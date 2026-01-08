'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { MockRewardRepository } from '../infrastructure/repositories/MockRewardRepository';
import { RewardPoint, ReferralReward, MarketplacePrize } from '../core/domain/entities/Reward';
import { useFetchWallet } from './useFetchWallet';
import { logger } from '../utils/logger';

/**
 * Hook para gestionar el sistema de recompensas y puntos.
 * Orquesta la lógica entre la UI y el Repositorio.
 */
export function useRewards() {
    const { wallet } = useFetchWallet();
    const repository = useMemo(() => new MockRewardRepository(), []);

    const [points, setPoints] = useState<RewardPoint | null>(null);
    const [referralCode, setReferralCode] = useState<string>('');
    const [referrals, setReferrals] = useState<ReferralReward[]>([]);
    const [prizes, setPrizes] = useState<MarketplacePrize[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    const address = wallet?.publicKey;

    useEffect(() => {
        setIsDesktop(window.innerWidth > 1024);
        const handleResize = () => setIsDesktop(window.innerWidth > 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchRewardsData = useCallback(async () => {
        if (!address) return;

        try {
            setIsLoading(true);
            const [pointsData, code, history, marketplacePrizes] = await Promise.all([
                repository.getUserPoints(address),
                repository.generateReferralCode(address),
                repository.getReferralHistory(address),
                repository.getMarketplacePrizes()
            ]);

            setPoints(pointsData);
            setReferralCode(code);
            setReferrals(history);
            setPrizes(marketplacePrizes);
        } catch (error) {
            logger.error('Error fetching rewards data', { error });
        } finally {
            setIsLoading(false);
        }
    }, [address, repository]);

    useEffect(() => {
        if (address) {
            fetchRewardsData();
        }
    }, [address, fetchRewardsData]);

    const claimPrize = async (prizeId: string) => {
        if (!address) return { success: false, message: 'No wallet connected' };

        try {
            const txHash = await repository.claimReward(address, prizeId);
            if (txHash) {
                // Refrescamos los puntos después de canjear
                fetchRewardsData();
                return { success: true, transactionHash: txHash, message: 'Premio canjeado con éxito' };
            }
            return { success: false, message: 'Failed to claim prize' };
        } catch (error) {
            logger.error('Error claiming prize', { error, prizeId });
            return { success: false, message: 'Failed to claim prize' };
        }
    };

    const trackSocialShare = async (platform: string, url: string) => {
        if (!address) return { success: false };

        try {
            const updatedPoints = await repository.trackSocialShare(address, { url, platform });
            setPoints(updatedPoints);
            logger.audit('Social share tracked', { platform, address });
            return { success: true };
        } catch (error) {
            logger.error('Error tracking social share', { error, platform });
            return { success: false };
        }
    };

    return {
        points,
        referralCode,
        referrals,
        prizes,
        isLoading,
        isDesktop,
        claimPrize,
        trackSocialShare,
        refresh: fetchRewardsData
    };
}
