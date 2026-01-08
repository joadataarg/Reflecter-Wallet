import { RewardPoint, ReferralReward, MarketplacePrize, SocialShareReward } from '../entities/Reward';

export type TransactionHash = string;
export type ShareProof = { url: string; platform: string };

export interface IRewardRepository {
    /**
     * Obtiene el balance de puntos del usuario
     */
    getUserPoints(address: string): Promise<RewardPoint>;

    /**
     * Genera un código de referido único para la dirección
     */
    generateReferralCode(address: string): Promise<string>;

    /**
     * Valida y procesa un nuevo referido
     */
    validateReferral(referralCode: string, newAddress: string): Promise<ReferralReward>;

    /**
     * Obtiene la lista de premios disponibles en el marketplace
     */
    getMarketplacePrizes(): Promise<MarketplacePrize[]>;

    /**
     * Canjea un premio del marketplace
     */
    claimReward(address: string, prizeId: string): Promise<TransactionHash>;

    /**
     * Obtiene el historial de referidos del usuario
     */
    getReferralHistory(address: string): Promise<ReferralReward[]>;

    /**
     * Trackea un share social para desktop
     */
    trackSocialShare(address: string, shareProof: ShareProof): Promise<RewardPoint>;
}
