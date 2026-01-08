'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../core/domain/entities/User';
import { MockUserRepository } from '../infrastructure/repositories/MockUserRepository';
import { useFirebaseAuth } from './useFirebaseAuth';
import { useFetchWallet } from './useFetchWallet';

// Repository instance (singleton in hooks for now)
const userRepository = new MockUserRepository();

export const useUserProfile = () => {
    const { user } = useFirebaseAuth();
    const { wallet } = useFetchWallet();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        try {
            setIsLoading(true);
            let currentProfile = await userRepository.getProfile(user.uid);

            // Auto-create profile if doesn't exist
            if (!currentProfile) {
                const defaultHandle = `@${user.email?.split('@')[0] || 'user'}_${Math.floor(Math.random() * 1000)}`;
                currentProfile = await userRepository.updateProfile(user.uid, {
                    handle: defaultHandle,
                    walletAddress: wallet?.publicKey || '',
                });
            }

            // Sync wallet address if missing
            if (wallet?.publicKey && currentProfile.walletAddress !== wallet.publicKey) {
                currentProfile = await userRepository.updateProfile(user.uid, {
                    walletAddress: wallet.publicKey
                });
            }

            setProfile(currentProfile);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [user, wallet?.publicKey]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateHandle = async (newHandle: string) => {
        if (!user) return;

        // Remove @ if present for logic, we'll keep it for display if needed
        const cleanHandle = newHandle.startsWith('@') ? newHandle : `@${newHandle}`;

        const isAvailable = await userRepository.isHandleAvailable(cleanHandle);
        if (!isAvailable) throw new Error('Este ID ya está en uso');

        const updated = await userRepository.updateProfile(user.uid, { handle: cleanHandle });
        setProfile(updated);
        return updated;
    };

    return {
        profile,
        isLoading,
        error,
        updateHandle,
        refreshProfile: fetchProfile
    };
};
