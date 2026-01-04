import { useGetWallet } from '@chipi-stack/nextjs';
import { useFirebaseAuth } from './useFirebaseAuth';
import { logger } from '../utils/logger';

/**
 * Hook to fetch the user's Starknet wallet managed by ChipiPay
 */
export function useFetchWallet() {
    const { user, getToken } = useFirebaseAuth();

    const { data: walletData, isLoading, error, refetch } = useGetWallet({
        getBearerToken: getToken,
        params: user ? {
            externalUserId: user.uid // Always use Firebase UID as reference
        } : undefined,
    });

    if (error) {
        logger.error('Error fetching user wallet from ChipiPay', {
            error,
            uid: user?.uid
        });
    }

    if (walletData) {
        logger.debug('Wallet data fetched successfully', {
            publicKey: walletData.publicKey,
            walletId: walletData.id
        });
    }

    return {
        wallet: walletData,
        isLoading,
        error,
        refetch,
    };
}
