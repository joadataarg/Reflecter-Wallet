/**
 * Entidades de Recompensas y Puntos
 * Definidas de forma inmutable siguiendo DDD
 */

export type RewardStatus = 'PENDING' | 'CLAIMED' | 'EXPIRED';

export type RewardSource = 'REFERRAL' | 'SOCIAL_SHARE' | 'TRANSACTION' | 'OTHER';

export interface RewardPoint {
    readonly currentBalance: number;
    readonly totalEarned: number;
    readonly pendingBalance: number;
    readonly lastUpdated: number;
}

export interface ReferralReward {
    readonly referralId: string;
    readonly referrerAddress: string;
    readonly referredAddress: string;
    readonly pointsEarned: number;
    readonly status: RewardStatus;
    readonly timestamp: number;
}

export interface SocialShareReward {
    readonly shareId: string;
    readonly address: string;
    readonly platform: 'TWITTER' | 'DISCORD' | 'TELEGRAM';
    readonly pointsEarned: number;
    readonly status: RewardStatus;
    readonly timestamp: number;
}

export interface MarketplacePrize {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly costInPoints: number;
    readonly image: string;
    readonly type: 'TOKEN' | 'NFT' | 'DISCOUNT' | 'CASHBACK';
    readonly availableStock: number;
}

export type RewardType = ReferralReward | SocialShareReward;
