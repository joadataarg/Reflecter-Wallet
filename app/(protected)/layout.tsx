'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import Sidebar from '@/app/components/Sidebar';
import { WalletNavbar } from '@/app/features/wallet/components/WalletNavbar';
import { WalletUIProvider } from '@/lib/context/WalletUIContext';
import { StandaloneWallet } from '@/app/features/wallet/components/StandaloneWallet';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading, signOut } = useFirebaseAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth');
        }
    }, [user, authLoading, router]);

    if (authLoading) {
        return (
            <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin rounded-full"></div>
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Authenticating</div>
            </div>
        );
    }

    if (!user) return null;

    const handleLogout = async () => {
        await signOut();
        router.push('/auth');
    };

    return (
        <WalletUIProvider>
            <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-white selection:text-black">

                {/* DESKTOP LAYOUT (3 Columns / Split View) */}
                <div className="hidden md:flex w-full h-full">

                    {/* Column 1: Control Panel (Sidebar) */}
                    <div className="w-72 flex-shrink-0 border-r border-white/5 bg-zinc-950/30">
                        <Sidebar onLogout={handleLogout} />
                    </div>

                    {/* Column 2: Experience / Hub (Central Area - DESKTOP CONTENT) */}
                    <div className="flex-1 overflow-hidden relative flex flex-col border-r border-white/5">
                        {/* Abstract Background Element */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

                        <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
                            {children}
                        </div>

                        {/* Footer Info for Desktop Hub */}
                        <div className="p-8 border-t border-white/5 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">
                            <span>Status: Operational</span>
                            <span>Reflecter Desktop v1.1.0</span>
                        </div>
                    </div>

                    {/* Column 3: The Wallet (Mobile Version Bridge) */}
                    <div className="w-[420px] flex-shrink-0 bg-black shadow-[20px_0_100px_rgba(0,0,0,1)] z-20 flex flex-col overflow-hidden">
                        <StandaloneWallet />
                    </div>

                </div>

                {/* MOBILE LAYOUT (Full screen focus) */}
                <div className="flex md:hidden w-full h-full flex-col relative overflow-hidden">
                    <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
                        {children}
                    </div>

                    {/* Global Navbar for Mobile */}
                    <WalletNavbar />
                </div>

            </div>
        </WalletUIProvider>
    );
}


