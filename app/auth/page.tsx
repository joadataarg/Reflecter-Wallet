'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { WalletAuth } from '@/app/features/wallet/components/WalletAuth';

export default function AuthPage() {
    const { user, loading } = useFirebaseAuth();
    const router = useRouter();

    useEffect(() => {
        if (user && !loading) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    // Only show global loading during initial initialization
    // Once initialization is done, even if user is null, we show the Auth UI
    if (loading && !user) {
        return (
            <div className="h-screen w-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-black">
            <WalletAuth initialView="login" />
        </div>
    );
}
