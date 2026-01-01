import { useCallback, useMemo } from 'react';
import { useCallAnyContract } from '@chipi-stack/nextjs'; // Corrected import based on package.json

// Helper for BigInt conversion
function toUint256Parts(amount: bigint) {
    const mask = (1n << 128n) - 1n;
    const low = amount & mask;
    const high = amount >> 128n;
    return { low: `0x${low.toString(16)}`, high: `0x${high.toString(16)}` };
}

function toBaseUnits(human: string, decimals: number): bigint {
    const [i, f = ''] = human.split('.');
    const frac = (f + '0'.repeat(decimals)).slice(0, decimals);
    const s = `${i}${frac}`.replace(/^0+/, '') || '0';
    return BigInt(s);
}

export type VesuTxParams = {
    encryptKey: string;
    bearerToken: string;
    userAddress: string;
    // Wallet is handled internally by Chipi provider if configured, 
    // OR passed explicitly if the SDK requires it. 
    // Based on CreateWallet usage, we might not need to pass full wallet object if context handles it?
    // Checking vesuSponsored.ts, it passed 'wallet'. createWallet returned 'walletData'.
    // We'll keep the signature compatible with passing the wallet object.
    walletData?: any;
};

export function useVesuTransaction() {
    const { callAnyContractAsync, isLoading, error } = useCallAnyContract();

    const approve = useCallback(async (
        params: VesuTxParams,
        tokenAddress: string,
        spenderAddress: string,
        amountHuman: string,
        decimals: number
    ) => {
        const amountBase = toBaseUnits(amountHuman, decimals);
        const u = toUint256Parts(amountBase);

        // Cairo 0/1 style often uses [low, high] for u256
        const calldata = [spenderAddress, u.low, u.high];

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
    }, [callAnyContractAsync]);

    const deposit = useCallback(async (
        params: VesuTxParams,
        vTokenAddress: string,
        amountHuman: string,
        decimals: number
    ) => {
        const amountBase = toBaseUnits(amountHuman, decimals);
        const u = toUint256Parts(amountBase);
        // deposit(assets: u256, receiver: ContractAddress)
        const calldata = [u.low, u.high, params.userAddress];

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
    }, [callAnyContractAsync]);

    const withdraw = useCallback(async (
        params: VesuTxParams,
        vTokenAddress: string,
        amountHuman: string,
        decimals: number
    ) => {
        const amountBase = toBaseUnits(amountHuman, decimals);
        const u = toUint256Parts(amountBase);
        // withdraw(assets: u256, receiver: ContractAddress, owner: ContractAddress)
        const calldata = [u.low, u.high, params.userAddress, params.userAddress];

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
    }, [callAnyContractAsync]);

    return {
        approve,
        deposit,
        withdraw,
        isLoading,
        error,
    };
}
