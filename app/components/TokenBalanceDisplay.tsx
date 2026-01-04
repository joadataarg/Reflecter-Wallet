'use client';

import { useTokenBalance } from '@/lib/hooks/useTokenBalance';
import type { ChainToken } from '@chipi-stack/types';

type TokenBalanceDisplayProps = {
    token: ChainToken;
    walletPublicKey?: string;
};

/**
 * Component to display real-time token balance from ChipiPay
 * Uses the logged-in user's externalUserId to fetch balance
 */
export function TokenBalanceDisplay({ token, walletPublicKey }: TokenBalanceDisplayProps) {
    const { balance, isLoading, error } = useTokenBalance(token);

    if (isLoading) {
        return <span className="font-mono font-medium text-gray-400 animate-pulse">...</span>;
    }

    if (error) {
        return <span className="text-xs text-red-600">Err bal</span>;
    }

    return <span className="font-mono font-medium text-blue-600">{balance}</span>;
}
