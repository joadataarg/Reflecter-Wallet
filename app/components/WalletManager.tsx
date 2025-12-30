'use client';

import { useState } from 'react';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import CreateWallet from '@/app/components/CreateWallet';
import RestoreWallet from '@/app/components/RestoreWallet';

export type WalletSession = {
    publicKey: string;
    walletId: string;
    encryptKey: string;
};

type WalletManagerProps = {
    onSessionChange: (session: WalletSession | null) => void;
    walletSession: WalletSession | null;
};

export default function WalletManager({ onSessionChange, walletSession }: WalletManagerProps) {
    const { wallet: existingWallet, isLoading: walletLoading } = useFetchWallet();

    const handleRestore = (encryptKey: string) => {
        if (!existingWallet) return;
        onSessionChange({
            publicKey: existingWallet.publicKey,
            walletId: existingWallet.id || existingWallet.publicKey,
            encryptKey
        });
    };

    if (walletLoading) {
        return (
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col transition-all duration-500">
            {!walletSession ? (
                // 1. No Session: Show Auth Handlers (Restore or Create)
                <div className="transform transition-all duration-500 ease-in-out">
                    {existingWallet ? (
                        <RestoreWallet wallet={existingWallet} onUnlock={handleRestore} />
                    ) : (
                        <CreateWallet onSuccess={onSessionChange} />
                    )}
                </div>
            ) : (
                // 2. Session Active: Show Wallet Status & Logout
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xl space-y-4">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="relative">
                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                        </div>
                        <h3 className="text-gray-900 font-bold text-lg">Billetera Conectada</h3>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Clave Pública</p>
                        <p className="text-sm font-mono text-gray-700 break-all">{walletSession.publicKey}</p>
                    </div>

                    <button
                        onClick={() => onSessionChange(null)}
                        className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-lg border border-red-100 hover:bg-red-100 hover:border-red-200 transition-colors flex items-center justify-center space-x-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Bloquear Billetera</span>
                    </button>
                </div>
            )}

            {/* Footer Status inside Manager */}
            <div className="mt-6 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold opacity-60">
                    Secured by ChipiPay Enclaves
                </p>
            </div>
        </div>
    );
}
