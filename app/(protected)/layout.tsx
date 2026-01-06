'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import Sidebar from '@/app/components/Sidebar';
import { WalletNavbar } from '@/app/features/wallet/components/WalletNavbar';
import { WalletUIProvider } from '@/lib/context/WalletUIContext';

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

                    {/* Column 2: Experience / Hub (Central Area) */}
                    <div className="flex-1 overflow-hidden relative flex flex-col">
                        {/* Abstract Background Element */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative z-10">
                            <div className="max-w-md space-y-6">
                                <div className="inline-block p-3 px-6 bg-white/5 border border-white/10 rounded-full">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Reflecter Ecosystem</span>
                                </div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
                                    Your Digital <br /> Identity, Unleashed.
                                </h2>
                                <p className="text-xs text-zinc-500 uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
                                    Experience the future of decentralized finance with our multi-chain orchestrated wallet.
                                </p>
                            </div>
                        </div>

                        {/* Footer Info for Desktop Hub */}
                        <div className="p-8 border-t border-white/5 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">
                            <span>Status: Operational</span>
                            <span>v1.0.4-beta</span>
                        </div>
                    </div>

                    {/* Column 3: The Wallet (Active View) */}
                    <div className="w-[420px] flex-shrink-0 bg-black border-l border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] z-20 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col custom-scrollbar">
                            {children}
                        </div>
                        {/* Global Navbar for the Wallet Section */}
                        <WalletNavbar />
                    </div>

                </div>

                {/* MOBILE LAYOUT (Full screen focus) */}
                <div className="flex md:hidden w-full h-full flex-col relative overflow-hidden">
                    {/* Header for Mobile (Optional, but often nice) */}
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


