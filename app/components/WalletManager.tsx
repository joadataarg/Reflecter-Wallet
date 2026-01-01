'use client';

import { useState } from 'react';
import { Copy, CheckCircle2, ExternalLink, Lock } from 'lucide-react';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import { useNetwork } from '@/lib/hooks/useNetwork';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
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
    const { user } = useFirebaseAuth();
    const { isMainnet } = useNetwork();

    const [copied, setCopied] = useState(false);

    const handleRestore = (encryptKey: string) => {
        if (!existingWallet) return;
        onSessionChange({
            publicKey: existingWallet.normalizedPublicKey || existingWallet.publicKey,
            walletId: existingWallet.id || existingWallet.publicKey,
            encryptKey
        });
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (walletLoading) {
        return (
            <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-10 bg-white/10 rounded w-full"></div>
                <div className="h-10 bg-white/10 rounded w-full"></div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col transition-all duration-500">
            {!walletSession ? (
                // 1. No Session: Show Auth Handlers (Restore or Create)
                <div className="transform transition-all duration-500 ease-in-out">
                    {existingWallet ? (
                        <RestoreWallet wallet={existingWallet} userUid={user?.uid} onUnlock={handleRestore} />
                    ) : (
                        <CreateWallet onSuccess={onSessionChange} />
                    )}
                </div>
            ) : (
                // 2. Session Active: Show Wallet Status & Logout - Estilo Prototipo
                <div className="space-y-4">
                    {/* Wallet Status Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest">Billetera Conectada</h3>
                    </div>

                    {/* Wallet Address Card - Prototipo Style */}
                    <div className="bg-zinc-900/40 border border-white/10 p-4 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">Dirección Principal</p>
                            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Starknet</span>
                        </div>
                        
                        <div className="bg-black/50 border border-white/5 p-3 rounded mb-3 font-mono">
                            <p className="text-[10px] text-zinc-400 break-all leading-relaxed tracking-tighter">
                                {walletSession.publicKey.slice(0, 10)}...{walletSession.publicKey.slice(-10)}
                            </p>
                        </div>

                        {/* Copy Button */}
                        <button
                            onClick={() => copyToClipboard(walletSession.publicKey)}
                            className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                        >
                            {copied ? (
                                <>
                                    <CheckCircle2 size={14} />
                                    <span>¡Copiado!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={14} />
                                    <span>Copiar</span>
                                </>
                            )}
                        </button>

                        {/* Explorer Link */}
                        <a
                            href={`${isMainnet ? 'https://starkscan.co' : 'https://sepolia.starkscan.co'}/contract/${walletSession.publicKey}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full mt-2 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                        >
                            <ExternalLink size={14} />
                            <span>Starkscan</span>
                        </a>

                        <p className="text-[9px] text-zinc-500 mt-3 text-center leading-relaxed">
                            Usa esta dirección para recibir tokens en Starknet
                        </p>
                    </div>

                    {/* Lock Button */}
                    <button
                        onClick={() => onSessionChange(null)}
                        className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                    >
                        <Lock size={14} />
                        <span>Bloquear Billetera</span>
                    </button>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/10">
                        <p className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] text-center font-bold">
                            Asegurado por ChipiPay
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
