import { useState, useEffect } from 'react';
import { getVesuConfig } from '@/lib/vesu/config';

export type VesuPosition = {
    asset: string;
    supplyBalance: string;
    debtBalance: string;
    apy: string;
};

export function useVesuPosition(userAddress?: string) {
    const [positions, setPositions] = useState<VesuPosition[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPositions = async () => {
        if (!userAddress) return;
        setLoading(true);
        setError(null);
        try {
            // TODO: Integrate Starknet Provider here to read 'balanceOf' from vToken contracts.
            // const config = getVesuConfig();
            // const provider = new Provider(...);
            // const balance = await provider.callContract(...);

            // MOCK DATA FOR UI TESTING
            // Simulating a network delay
            await new Promise(r => setTimeout(r, 1000));

            setPositions([
                {
                    asset: 'USDC',
                    supplyBalance: '0.00',
                    debtBalance: '0.00',
                    apy: '5.4%'
                },
                {
                    asset: 'ETH',
                    supplyBalance: '0.00',
                    debtBalance: '0.00',
                    apy: '3.1%'
                }
            ]);

        } catch (err) {
            console.error(err);
            setError('Failed to fetch Vesu positions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchPositions();
    }, [userAddress]);

    return { positions, loading, error, refetch: fetchPositions };
}
