import { IUserRepository } from '../../core/domain/repositories/IUserRepository';
import { UserProfile, UserSearchItem } from '../../core/domain/entities/User';

export class MockUserRepository implements IUserRepository {
    private profiles: Map<string, UserProfile> = new Map();

    async getProfile(userId: string): Promise<UserProfile | null> {
        return this.profiles.get(userId) || null;
    }

    async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
        const existing = this.profiles.get(userId) || {
            id: userId,
            handle: `user_${userId.slice(0, 5)}`,
            walletAddress: '',
            createdAt: new Date(),
        };

        const updated = { ...existing, ...data };
        this.profiles.set(userId, updated);
        return updated;
    }

    async searchByHandle(handle: string): Promise<UserSearchItem | null> {
        const profile = Array.from(this.profiles.values()).find(p => p.handle === handle);
        if (!profile) return null;
        return {
            handle: profile.handle,
            walletAddress: profile.walletAddress,
            avatarUrl: profile.avatarUrl
        };
    }

    async isHandleAvailable(handle: string): Promise<boolean> {
        return !Array.from(this.profiles.values()).some(p => p.handle === handle);
    }

    async linkWallet(userId: string, walletAddress: string): Promise<void> {
        const profile = await this.getProfile(userId);
        if (profile) {
            await this.updateProfile(userId, { walletAddress });
        }
    }
}
