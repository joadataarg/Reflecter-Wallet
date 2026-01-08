'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useWalletUI } from '@/lib/context/WalletUIContext';
import { WalletDashboard } from '@/app/features/wallet/components/WalletDashboard';
import { WalletSession, WalletView } from '@/lib/core/domain/types';
import { useCreateWallet } from '@chipi-stack/nextjs';
import { deriveEncryptKey } from '@/lib/utils/deriveEncryptKey';
import { DesktopDashboard } from '@/app/features/wallet/components/DesktopDashboard';
import { useRewards } from '@/lib/hooks/useRewards';

export default function DashboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { wallet, isLoading: walletLoading, error: walletError, refetch } = useFetchWallet();
    const { user, getToken, signOut } = useFirebaseAuth();
    const { createWalletAsync } = useCreateWallet();
    const { isDesktop } = useRewards();
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState<string | null>(null);
    const [syncAttempts, setSyncAttempts] = useState(0);

    // Auto-Sincronización (Critical Logic for Production)
    useEffect(() => {
        const autoSync = async () => {
            // Exit if user not logged in, wallet already exists, or already syncing
            if (!user || wallet || walletLoading || isSyncing || syncError || syncAttempts >= 3) {
                return;
            }

            setIsSyncing(true);
            try {
                const bearerToken = await getToken();
                if (!bearerToken) throw new Error('No se pudo obtener el token de sesión');

                const encryptKey = await deriveEncryptKey(user.uid);
                await createWalletAsync({
                    params: {
                        encryptKey,
                        externalUserId: user.uid,
                    },
                    bearerToken,
                });

                setSyncAttempts(prev => prev + 1);
                // Wait a bit for the backend to propagate before refetching
                await new Promise(resolve => setTimeout(resolve, 2000));
                await refetch();
            } catch (err: any) {
                console.error('Critical: Auto-sync failed', err);
                setSyncError(err.message || 'Error al sincronizar la billetera');
            } finally {
                setIsSyncing(false);
            }
        };

        autoSync();
    }, [user, wallet, walletLoading, isSyncing, syncError, syncAttempts, getToken, createWalletAsync, refetch]);

    // Profile State
    const profile = {
        firstName: '',
        lastName: '',
        update: () => { }
    };

    if (walletLoading || isSyncing) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 bg-black h-full">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin rounded-full"></div>
                <div className="space-y-1 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                        {isSyncing ? 'Sincronizando Wallet' : 'Cargando Billetera'}
                    </p>
                </div>
            </div>
        );
    }

    if (!wallet) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-black h-full">
                <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-[2rem] max-w-xs text-red-500">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 leading-relaxed">
                        {syncError ? 'Error de Sincronización' : 'No se pudo encontrar tu billetera'}
                    </p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center">
                        {syncError || 'Error de conexión con el servidor de orquestación.'}
                    </p>
                </div>
                <button
                    onClick={() => {
                        setSyncError(null);
                        setSyncAttempts(0);
                        refetch();
                    }}
                    className="py-3 px-8 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all font-bold"
                >
                    Reintentar Conexión
                </button>
            </div>
        )
    }

    // Render logic optimization: Desktop gets the ecosystem hub, mobile gets the transactional wallet
    if (isDesktop) {
        return <DesktopDashboard />;
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 relative h-full">
            <WalletDashboard
                wallet={wallet as WalletSession}
                onNavigate={(view) => {
                    if (view === 'send') router.push('/send');
                    if (view === 'receive') router.push('/receive');
                    if (view === 'assets') router.push('/dashboard?view=assets');
                    if (view === 'feedback') router.push('/dashboard?view=feedback');
                    if (view === 'home') router.push('/dashboard');
                }}
                activeTab={searchParams.get('view') as any || 'home'}
                onLogout={async () => {
                    await signOut();
                    router.push('/auth');
                }}
                profile={profile as any}
            />
        </div>
    );
}
