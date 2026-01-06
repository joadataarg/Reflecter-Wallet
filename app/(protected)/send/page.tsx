'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import { WalletSend } from '@/app/features/wallet/components/WalletSend';
import { WalletSession, WalletView } from '@/lib/core/domain/types';
import { useWalletUI } from '@/lib/context/WalletUIContext';

export default function SendPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { wallet, isLoading: walletLoading } = useFetchWallet();
    const { openScanner } = useWalletUI();
    const [sendToAddress, setSendToAddress] = useState('');

    // If address is passed via URL (e.g. from global scanner)
    useEffect(() => {
        const addr = searchParams.get('address');
        if (addr) {
            setSendToAddress(addr);
        }
    }, [searchParams]);

    const handleNavigate = (view: WalletView) => {
        if (view === 'home' || view === 'assets') {
            router.push('/dashboard');
        } else if (view === 'receive') {
            router.push('/receive');
        }
    };

    if (walletLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin rounded-full"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Preparando Envío</p>
            </div>
        );
    }

    if (!wallet) return null;

    return (
        <div className="flex-1 flex flex-col min-h-0 relative">
            <WalletSend
                wallet={wallet as WalletSession}
                onNavigate={handleNavigate}
                sendToAddress={sendToAddress}
                setSendToAddress={setSendToAddress}
                onScanRequest={openScanner}
                isMobile={true}
            />
        </div>
    );
}

