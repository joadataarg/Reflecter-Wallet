'use client';

import React, { useState } from 'react';
import { ShoppingBag, Star, Info, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useRewards } from '@/lib/hooks/useRewards';
import { MarketplacePrize } from '@/lib/core/domain/entities/Reward';

export const MarketplaceClaim: React.FC = () => {
    const { points, prizes, claimPrize, isLoading } = useRewards();
    const [claimingId, setClaimingId] = useState<string | null>(null);
    const [status, setStatus] = useState<{ id: string, type: 'success' | 'error', message: string } | null>(null);

    const handleClaim = async (prize: MarketplacePrize) => {
        if ((points?.currentBalance ?? 0) < prize.costInPoints) {
            setStatus({ id: prize.id, type: 'error', message: 'No tienes suficientes puntos' });
            return;
        }

        setClaimingId(prize.id);
        setStatus(null);

        const result = await claimPrize(prize.id);

        if (result.success) {
            setStatus({ id: prize.id, type: 'success', message: '¡Canjeado! Revisa tu historial.' });
        } else {
            setStatus({ id: prize.id, type: 'error', message: result.message });
        }

        setClaimingId(null);
        setTimeout(() => setStatus(null), 5000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Marketplace</h2>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">Canjea tus Reflecter Points por premios exclusivos</p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/10 rounded-2xl">
                        <Star size={18} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-2xl font-black text-white tabular-nums tracking-tight">
                            {points?.currentBalance ?? 0}
                        </span>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">PT</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prizes.map((prize) => (
                    <div
                        key={prize.id}
                        className="group bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all duration-500 flex flex-col"
                    >
                        <div className="aspect-[16/10] relative overflow-hidden bg-zinc-800">
                            {/* Placeholder for images */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-zinc-700 font-black text-4xl opacity-20">{prize.type}</span>
                            </div>
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                <span className="text-xs font-black text-white">{prize.costInPoints} PT</span>
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow space-y-4">
                            <div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">{prize.name}</h3>
                                <p className="text-zinc-500 text-[11px] font-medium leading-relaxed mt-2">{prize.description}</p>
                            </div>

                            <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Stock: {prize.availableStock}</span>
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{prize.type}</span>
                                </div>

                                <button
                                    onClick={() => handleClaim(prize)}
                                    disabled={claimingId === prize.id || (points?.currentBalance ?? 0) < prize.costInPoints}
                                    className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2
                                        ${(points?.currentBalance ?? 0) >= prize.costInPoints
                                            ? 'bg-white text-black hover:bg-zinc-200'
                                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}
                                    `}
                                >
                                    {claimingId === prize.id ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <>
                                            <ShoppingBag size={16} /> Canjear Premio
                                        </>
                                    )}
                                </button>

                                {status?.id === prize.id && (
                                    <div className={`flex items-center gap-2 p-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider
                                        ${status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}
                                    `}>
                                        {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                        {status.message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="pt-8">
                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6 flex items-start gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                        <Info size={20} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">Compromiso con la Transparencia</h4>
                        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                            Todas las redenciones en el marketplace son finales. Los premios digitales se transfieren directamente a tu dirección vinculada en Starknet. En esta versión beta, los puntos son representativos y se migrarán a un Smart Contract on-chain próximamente.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
