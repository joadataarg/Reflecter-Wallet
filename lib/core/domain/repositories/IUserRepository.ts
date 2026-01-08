import { UserProfile, UserSearchItem } from '../entities/User';

export interface IUserRepository {
    getProfile(userId: string): Promise<UserProfile | null>;
    updateProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile>;
    searchByHandle(handle: string): Promise<UserSearchItem | null>;
    isHandleAvailable(handle: string): Promise<boolean>;
    linkWallet(userId: string, walletAddress: string): Promise<void>;
}
