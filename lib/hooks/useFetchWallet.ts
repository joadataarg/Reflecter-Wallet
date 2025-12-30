import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useGetWallet } from '@chipi-stack/nextjs';

export function useFetchWallet() {
    const { user, getToken } = useFirebaseAuth();

    // The hook automatically fetches when params are stable and valid
    // According to docs: useGetWallet({ getBearerToken, params })
    const { data: wallet, isLoading, error } = useGetWallet({
        getBearerToken: getToken,
        params: {
            externalUserId: user?.uid || '',
        },
    });

    return { wallet, isLoading, error };
}
