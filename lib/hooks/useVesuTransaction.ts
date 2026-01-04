import { useCallback } from 'react';
import { useCallAnyContract } from '@chipi-stack/nextjs';
import { logger } from '../utils/logger';
import { createSDKError, ErrorCode } from '../utils/errors';

/**
 * Helper for BigInt conversion to u256 for Starknet
 */
function toUint256Parts(amount: bigint) {
    const mask = (1n << 128n) - 1n;
    const low = amount & mask;
    const high = amount >> 128n;
    return { low: `0x${low.toString(16)}`, high: `0x${high.toString(16)}` };
}

/**
 * Convert human readable amount to base units
 */
function toBaseUnits(human: string, decimals: number): bigint {
    try {
        const [i, f = ''] = human.split('.');
        const frac = (f + '0'.repeat(decimals)).slice(0, decimals);
        const s = `${i}${frac}`.replace(/^0+/, '') || '0';
        return BigInt(s);
    } catch (e) {
        logger.error('Failed to convert to base units', { human, decimals });
        return 0n;
    }
}

export type VesuTxParams = {
    encryptKey: string;
    bearerToken: string;
    userAddress: string;
    walletData?: any;
};

/**
 * Hook for interacting with Vesu Protocol contracts via ChipiPay
 */
export function useVesuTransaction() {
    const { callAnyContractAsync, isLoading, error } = useCallAnyContract();

    const approve = useCallback(async (
        params: VesuTxParams,
        tokenAddress: string,
        spenderAddress: string,
        amountHuman: string,
        decimals: number
    ) => {
        try {
            const amountBase = toBaseUnits(amountHuman, decimals);
            const u = toUint256Parts(amountBase);
            const calldata = [spenderAddress, u.low, u.high];

            logger.audit('Initiating token approval', { tokenAddress, spenderAddress, amountHuman });

            return await callAnyContractAsync({
                params: {
                    encryptKey: params.encryptKey,
                    wallet: params.walletData,
                    contractAddress: tokenAddress,
                    calls: [{
                        contractAddress: tokenAddress,
                        entrypoint: 'approve',
                        calldata,
                    }],
                },
                bearerToken: params.bearerToken,
            });
        } catch (err) {
            const sdkError = createSDKError(ErrorCode.DEFI_APPROVAL_FAILED, { tokenAddress }, err);
            logger.error('Approval failed', { error: sdkError.message });
            throw sdkError;
        }
    }, [callAnyContractAsync]);

    const deposit = useCallback(async (
        params: VesuTxParams,
        vTokenAddress: string,
        amountHuman: string,
        decimals: number
    ) => {
        try {
            const amountBase = toBaseUnits(amountHuman, decimals);
            const u = toUint256Parts(amountBase);
            const calldata = [u.low, u.high, params.userAddress];

            logger.audit('Initiating Vesu deposit', { vTokenAddress, amountHuman });

            return await callAnyContractAsync({
                params: {
                    encryptKey: params.encryptKey,
                    wallet: params.walletData,
                    contractAddress: vTokenAddress,
                    calls: [{
                        contractAddress: vTokenAddress,
                        entrypoint: 'deposit',
                        calldata,
                    }],
                },
                bearerToken: params.bearerToken,
            });
        } catch (err) {
            const sdkError = createSDKError(ErrorCode.DEFI_DEPOSIT_FAILED, { vTokenAddress }, err);
            logger.error('Deposit failed', { error: sdkError.message });
            throw sdkError;
        }
    }, [callAnyContractAsync]);

    const withdraw = useCallback(async (
        params: VesuTxParams,
        vTokenAddress: string,
        amountHuman: string,
        decimals: number
    ) => {
        try {
            const amountBase = toBaseUnits(amountHuman, decimals);
            const u = toUint256Parts(amountBase);
            const calldata = [u.low, u.high, params.userAddress, params.userAddress];

            logger.audit('Initiating Vesu withdrawal', { vTokenAddress, amountHuman });

            return await callAnyContractAsync({
                params: {
                    encryptKey: params.encryptKey,
                    wallet: params.walletData,
                    contractAddress: vTokenAddress,
                    calls: [{
                        contractAddress: vTokenAddress,
                        entrypoint: 'withdraw',
                        calldata,
                    }],
                },
                bearerToken: params.bearerToken,
            });
        } catch (err) {
            const sdkError = createSDKError(ErrorCode.DEFI_WITHDRAW_FAILED, { vTokenAddress }, err);
            logger.error('Withdrawal failed', { error: sdkError.message });
            throw sdkError;
        }
    }, [callAnyContractAsync]);

    return {
        approve,
        deposit,
        withdraw,
        isLoading,
        error,
    };
}
