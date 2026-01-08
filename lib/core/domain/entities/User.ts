export interface UserProfile {
    id: string; // From Firebase/Supabase Auth
    handle: string; // Unique ID (e.g., @juan_stark)
    walletAddress: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    createdAt: Date;
}

export interface UserSearchItem {
    handle: string;
    walletAddress: string;
    avatarUrl?: string;
}
