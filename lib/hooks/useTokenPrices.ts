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

                if (!response.ok) throw new Error('Failed to fetch prices');

                const data = await response.json();

                setPrices({
                    ETH: data.ethereum?.usd || 3400,
                    STRK: data.starknet?.usd || 0.50,
                    USDC: data['usd-coin']?.usd || 1.00
                });
                setError(null);
            } catch (err: any) {
                console.error('Price fetch error:', err.name, err.message);
                if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
                    console.warn('NetworkError: The price API might be blocked by an adblocker or the network. Using fallback prices.');
                }
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrices();
        // Refresh prices every 60 seconds
        const interval = setInterval(fetchPrices, 60000);
        return () => clearInterval(interval);
    }, [enabled]);

    return { prices, isLoading, error };
}
