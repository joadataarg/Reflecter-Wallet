import { useState, useEffect } from 'react';
import { getVesuConfig } from '@/lib/vesu/config';
import { logger } from '../utils/logger';
import { createSDKError, ErrorCode } from '../utils/errors';
import { VesuPosition } from '../types';

export function useVesuPosition(userAddress?: string) {
    const [positions, setPositions] = useState<VesuPosition[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const config = getVesuConfig();

    const fetchPositions = async () => {
        if (!userAddress) return;
        setLoading(true);
        setError(null);
        try {
            logger.debug('Fetching Vesu positions', { userAddress, network: config.network });

            const defaults: Record<string, string> = {
                USDC: '5.4%',
                ETH: '3.1%',
                STRK: '2.5%',
            };

            // Only show available tokens
            const availableTokens = Object.entries(config.tokens)
                .filter(([_, tokenConfig]) => tokenConfig.available !== false)
                .map(([symbol]) => symbol);

            const entries = availableTokens.map(asset => ({
                asset,
                supplyBalance: '0.00', // TODO: Read from Vesu vToken contract
                debtBalance: '0.00',   // TODO: Read from Vesu debt tracking
                apy: defaults[asset] || '3.0%',
                walletBalance: '...',
            }));

            setPositions(entries);
            logger.debug('Vesu positions metadata loaded', { count: entries.length });

        } catch (err) {
            const sdkError = createSDKError(ErrorCode.DEFI_POSITION_FETCH_FAILED, { userAddress }, err);
            logger.error('Failed to fetch Vesu positions', { error: sdkError.message });
            setError(sdkError.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchPositions();
    }, [userAddress, config.network]);

    return { positions, loading, error, refetch: fetchPositions };
}
