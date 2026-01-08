'use client';

import React, { useState } from 'react';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { WalletDashboard } from '@/app/features/wallet/components/WalletDashboard';
import { WalletSession, WalletView } from '@/lib/core/domain/types';
import { WalletNavbar } from '@/app/features/wallet/components/WalletNavbar';
import { WalletSend } from '@/app/features/wallet/components/WalletSend';
import { WalletReceive } from '@/app/features/wallet/components/WalletReceive';

export const StandaloneWallet: React.FC = () => {
    const { wallet, isLoading } = useFetchWallet();
    const { signOut } = useFirebaseAuth();
    const [view, setView] = useState<WalletView>('home');

    // Internal state for Send view
    const [sendToAddress, setSendToAddress] = useState('');

    // Profile State Placeholder
    const profile = {
        firstName: '',
        lastName: '',
        update: () => { }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 bg-black h-full">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin rounded-full"></div>
            </div>
        );
    }

    if (!wallet) return null;

    const renderView = () => {
        // Handle all variations of Receive views
        if (view.startsWith('receive')) {
            return (
                <WalletReceive
                    wallet={wallet as WalletSession}
                    view={view}
                    onNavigate={(v) => setView(v)}
                />
            );
        }

        switch (view) {
            case 'send':
                return (
                    <WalletSend
                        wallet={wallet as WalletSession}
                        onNavigate={(v) => setView(v)}
                        sendToAddress={sendToAddress}
                        setSendToAddress={setSendToAddress}
                        onScanRequest={() => { }}
                        isMobile={false}
                    />
                );
            default:
                return (
                    <WalletDashboard
                        wallet={wallet as WalletSession}
                        onNavigate={(v) => setView(v)}
                        onLogout={signOut}
                        activeTab={view as any}
                        profile={profile as any}
                    />
                );
        }
    };

    return (
        <div className="flex flex-col h-full bg-black relative">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {renderView()}
            </div>
            <WalletNavbar
                currentView={view}
                onNavigate={(v) => setView(v)}
            />
        </div>
    );
};
