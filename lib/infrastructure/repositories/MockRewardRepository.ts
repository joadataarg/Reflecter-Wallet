import { IRewardRepository, TransactionHash, ShareProof } from '../../core/domain/repositories/IRewardRepository';
import { RewardPoint, ReferralReward, MarketplacePrize, SocialShareReward } from '../../core/domain/entities/Reward';

/**
 * Implementación Mock del repositorio de recompensas.
 * Preparado para futura migración a Base de Datos y Smart Contracts.
 */
export class MockRewardRepository implements IRewardRepository {
    private mockPoints: Record<string, number> = {};
    private mockReferrals: Record<string, ReferralReward[]> = {};

    async getUserPoints(address: string): Promise<RewardPoint> {
        const balance = this.mockPoints[address] || 250; // Balance base por defecto para demo
        return {
            currentBalance: balance,
            totalEarned: balance + 150,
            pendingBalance: 50,
            lastUpdated: Date.now()
        };
    }

    async generateReferralCode(address: string): Promise<string> {
        // Simulación de generación de código
        return `REF-${address.slice(2, 8).toUpperCase()}`;
    }

    async validateReferral(referralCode: string, newAddress: string): Promise<ReferralReward> {
        const reward: ReferralReward = {
            referralId: Math.random().toString(36).substring(2, 9),
            referrerAddress: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
            referredAddress: newAddress,
            pointsEarned: 100,
            status: 'CLAIMED',
            timestamp: Date.now()
        };
        return reward;
    }

    async getMarketplacePrizes(): Promise<MarketplacePrize[]> {
        return [
            {
                id: '1',
                name: '10 STRK Token',
                description: 'Recibe 10 tokens STRK directamente en tu wallet.',
                costInPoints: 1000,
                image: '/tokens/strk.png',
                type: 'TOKEN',
                availableStock: 50
            },
            {
                id: '2',
                name: 'Reflecter Genesis NFT',
                description: 'Un NFT exclusivo para los primeros miembros de Reflecter.',
                costInPoints: 5000,
                image: '/nfts/genesis.png',
                type: 'NFT',
                availableStock: 10
            },
            {
                id: '3',
                name: 'Fee Discount 50%',
                description: 'Descuento del 50% en comisiones por 1 mes.',
                costInPoints: 500,
                image: '/discounts/fee.png',
                type: 'DISCOUNT',
                availableStock: 100
            }
        ];
    }

    async claimReward(address: string, prizeId: string): Promise<TransactionHash> {
        // Simulación de canje
        return '0x' + Math.random().toString(16).substring(2, 64);
    }

    async getReferralHistory(address: string): Promise<ReferralReward[]> {
        // Retornamos algunos referidos mockeados para la UI si no hay
        if (!this.mockReferrals[address]) {
            return [
                {
                    referralId: 'ref_1',
                    referrerAddress: address,
                    referredAddress: '0x123...abc',
                    pointsEarned: 100,
                    status: 'CLAIMED',
                    timestamp: Date.now() - 86400000
                },
                {
                    referralId: 'ref_2',
                    referrerAddress: address,
                    referredAddress: '0x456...def',
                    pointsEarned: 100,
                    status: 'PENDING',
                    timestamp: Date.now() - 43200000
                }
            ];
        }
        return this.mockReferrals[address];
    }

    async trackSocialShare(address: string, shareProof: ShareProof): Promise<RewardPoint> {
        // Simulamos que el balance sube
        const current = await this.getUserPoints(address);
        return {
            ...current,
            currentBalance: current.currentBalance + 50,
            totalEarned: current.totalEarned + 50,
            lastUpdated: Date.now()
        };
    }
}
