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

    if (loading) {
        return <div className="h-screen w-screen bg-black"></div>;
    }

    return (
        <div className="h-screen w-screen bg-black">
            <WalletAuth initialView="login" />
        </div>
    );
}
