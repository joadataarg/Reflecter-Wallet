import { useState, useEffect } from 'react';

export interface TokenPrices {
    ETH: number;
    STRK: number;
    USDC: number;
}

/**
 * Hook to fetch real-time token prices from CoinGecko
 */
export function useTokenPrices(enabled: boolean = true) {
    const [prices, setPrices] = useState<TokenPrices>({
        ETH: 3400, // Fallback prices
        STRK: 0.50,
        USDC: 1.00
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const fetchPrices = async () => {
            try {
                setIsLoading(true);
                // CoinGecko IDs: ethereum, starknet, usd-coin
                const response = await fetch(
                    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,starknet,usd-coin&vs_currencies=usd'
                );

                if (!response.ok) {
                    throw new Error('Price API unreachable');
                }

                let data: any;
                try {
                    data = await response.json();
                } catch (e) {
                    data = {};
                }

                setPrices({
                    ETH: data?.ethereum?.usd || 3400,
                    STRK: data?.starknet?.usd || 0.50,
                    USDC: data?.['usd-coin']?.usd || 1.00
                });
                setError(null);
            } catch (err: any) {
                // Silently handle network errors/rate limits
                setError(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrices();
        // Refresh prices every 60 minutes
        const interval = setInterval(fetchPrices, 3600000);
        return () => clearInterval(interval);
    }, [enabled]);

    return { prices, isLoading, error };
}
