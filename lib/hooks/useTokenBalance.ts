import { useGetTokenBalance } from '@chipi-stack/nextjs';
import { useFirebaseAuth } from './useFirebaseAuth';
import type { ChainToken } from '@chipi-stack/types';
import { logger } from '../utils/logger';
import { TokenBalance } from '../types';

/**
 * Hook to get token balance for a specific wallet and token
 * Uses ChipiPay's useGetTokenBalance under the hood
 */
export function useTokenBalance(chainToken: ChainToken) {
    const { user, getToken } = useFirebaseAuth();

    const { data: balanceData, isLoading, error, refetch } = useGetTokenBalance({
        getBearerToken: getToken,
        params: user ? {
            externalUserId: user.uid,
            chainToken,
            chain: 'STARKNET',
        } : undefined,
    });

    if (error) {
        logger.error(`Error fetching ${chainToken} balance`, { error });
    }

    /**
     * Helper: safely convert a decimal string/number to base units as BigInt
     * This handles cases where ChipiPay might return a decimal string instead of a hex/integer string
     */
    function parseAmountToBigInt(balance: string | number | bigint, decimals: number): bigint {
        if (typeof balance === 'bigint') return balance;

        const scale = BigInt(10) ** BigInt(decimals);
        const str = typeof balance === 'number' ? balance.toString() : (balance ?? '0').toString();

        if (str.includes('.')) {
            const [whole, frac = ''] = str.split('.');
            const wholeBig = BigInt(whole || '0') * scale;
            const fracPadded = (frac + '0'.repeat(decimals)).slice(0, decimals);
            const fracBig = BigInt(fracPadded || '0');
            return wholeBig + fracBig;
        }

        try {
            return BigInt(str || '0');
        } catch (e) {
            // Handle hex strings or other non-decimal formats if needed
            return BigInt(0);
        }
    }

    // Format balance to human-readable string
    const formatBalance = (balance: string, decimals: number): string => {
        if (!balance || balance === '0') return '0.00';

        try {
            const num = parseAmountToBigInt(balance, decimals);
            const divisor = BigInt(10) ** BigInt(decimals);

            const wholePart = num / divisor;
            const fracPart = num % divisor;

            const fracStr = fracPart.toString().padStart(decimals, '0').replace(/0+$/, '');
            return fracStr ? `${wholePart.toString()}.${fracStr}` : wholePart.toString();
        } catch (e) {
            logger.error('Error formatting balance', { error: e, balance, decimals });
            return '0.00';
        }
    };

    const formattedBalance = balanceData
        ? formatBalance(balanceData.balance, balanceData.decimals)
        : '0.00';

    const result: TokenBalance = {
        symbol: chainToken as string,
        name: chainToken as string,
        balance: formattedBalance,
        rawBalance: balanceData?.balance || '0',
        decimals: balanceData?.decimals || 18,
        icon: '',
    };

    return {
        ...result,
        isLoading,
        error,
        refetch,
    };
}
