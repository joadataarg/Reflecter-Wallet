'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import { WalletReceive } from '@/app/features/wallet/components/WalletReceive';
import { WalletSession, WalletView } from '@/lib/core/domain/types';

export default function ReceivePage() {
    const router = useRouter();
    const { wallet, isLoading: walletLoading } = useFetchWallet();
    const [internalView, setInternalView] = useState<WalletView>('receive');

    const handleNavigate = (view: WalletView) => {
        if (view === 'home' || view === 'assets') {
            router.push('/dashboard');
        } else if (view.startsWith('receive')) {
            setInternalView(view);
        }
    };

    if (walletLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin rounded-full"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Preparando Recepción</p>
            </div>
        );
    }

    if (!wallet) return null;

    return (
        <div className="flex-1 flex flex-col min-h-0 relative">
            <WalletReceive
                wallet={wallet as WalletSession}
                view={internalView}
                onNavigate={handleNavigate}
            />
        </div>
    );
}

