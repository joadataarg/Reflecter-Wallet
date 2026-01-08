'use client';

import React, { useState } from 'react';
import {
    Layout,
    TrendingUp,
    Users,
    Award,
    Activity,
    ShieldCheck,
    ChevronRight,
    ArrowUpRight,
    Zap,
    Globe,
    ShoppingBag,
    Gift,
    Star,
    ArrowRight,
    Code
} from 'lucide-react';
import { useRewards } from '@/lib/hooks/useRewards';
import { TokenChart } from './TokenChart';
import { useRouter } from 'next/navigation';

export const DesktopDashboard: React.FC = () => {
    const router = useRouter();
    const { points, prizes, referrals } = useRewards();
    const [activeAsset, setActiveAsset] = useState<'ETH' | 'STRK' | 'USDC'>('ETH');
    const assets = ['ETH', 'STRK', 'USDC'] as const;

    // First 3 prizes
    const featuredPrizes = prizes.slice(0, 3);

    return (
        <div className="p-12 space-y-16 animate-in fade-in duration-700 max-w-[1700px] mx-auto pb-32">

            {/* Header: Global Overview */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <header className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <Activity size={10} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Reflecter Hub • Resumen General</span>
                    </div>
                    <h1 className="text-7xl font-black text-white tracking-tighter uppercase leading-none">
                        Tu Ecosistema <br /> <span className="text-zinc-700">Reflecter</span>
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest max-w-xl">
                        Gestiona tus activos, reclama recompensas y explora el marketplace desde un solo lugar. Todo lo que necesitas en Starknet concentrado aquí.
                    </p>
                </header>

                <div className="hidden lg:flex items-center gap-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-zinc-900/40 px-6 py-4 rounded-3xl border border-white/5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    Sincronización On-Chain Activa
                </div>
            </div>

            {/* Section 1: Marketplace Showcase */}
            <section className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                        <ShoppingBag size={20} className="text-indigo-400" />
                        <h2 className="text-xl font-black text-white uppercase tracking-[0.3em]">Marketplace</h2>
                    </div>
                    <button
                        onClick={() => router.push('/marketplace')}
                        className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Ver Todo</span>
                        <ArrowRight size={14} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredPrizes.map((prize) => (
                        <div key={prize.id} className="group bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/30 transition-all duration-500 flex flex-col h-[400px]">
                            <div className="flex-1 relative bg-zinc-800">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-zinc-700 font-black text-4xl opacity-10 uppercase">{prize.type}</span>
                                </div>
                                <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
                                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-black text-white tabular-nums">{prize.costInPoints} PT</span>
                                </div>
                            </div>
                            <div className="p-8 space-y-2">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">{prize.name}</h3>
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest truncate">{prize.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 2: Rewards Overview */}
            <section className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                        <Gift size={20} className="text-emerald-400" />
                        <h2 className="text-xl font-black text-white uppercase tracking-[0.3em]">Recompensas</h2>
                    </div>
                    <button
                        onClick={() => router.push('/rewards')}
                        className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Centro de Impacto</span>
                        <ArrowRight size={14} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Balance Acumulado Card */}
                    <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-10 rounded-[3rem] relative overflow-hidden group min-h-[280px] flex flex-col justify-between shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-6">Balance de Impacto</p>
                            <div className="flex items-end gap-3 text-white">
                                <span className="text-7xl font-black tracking-tighter tabular-nums leading-none">{points?.currentBalance ?? 0}</span>
                                <span className="text-2xl font-black text-emerald-400 uppercase leading-none pb-1">RT</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Listo para usar</span>
                            </div>
                        </div>
                    </div>

                    {/* Reflecter Points Card (Stats) */}
                    <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[3rem] relative overflow-hidden flex flex-col justify-between shadow-xl min-h-[280px]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">Total Ganado</p>
                                <p className="text-3xl font-black text-white tabular-nums">{points?.totalEarned ?? 0} <span className="text-xs text-zinc-500">PT</span></p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">Referidos</p>
                                <p className="text-3xl font-black text-white tabular-nums">{referrals.length} <span className="text-xs text-zinc-500">Usuarios</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 pt-8">
                            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-indigo-500 w-1/3"></div>
                            </div>
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Progreso Nivel 2</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Asset Monitor */}
            <section className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                    <div className="flex items-center gap-4">
                        <Globe size={20} className="text-blue-400" />
                        <h2 className="text-xl font-black text-white uppercase tracking-[0.3em]">Monitor de Activos</h2>
                    </div>

                    <div className="bg-zinc-900/80 p-1.5 rounded-2xl border border-white/10 flex gap-1">
                        {assets.map((asset) => (
                            <button
                                key={asset}
                                onClick={() => setActiveAsset(asset)}
                                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAsset === asset
                                    ? 'bg-white text-black shadow-xl'
                                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {asset}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-black/60 border border-white/5 p-12 rounded-[5rem] h-[800px] overflow-hidden group relative flex flex-col shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>
                    <div className="relative h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500" key={activeAsset}>
                        <TokenChart
                            symbol={activeAsset}
                            onClose={() => { }}
                            hideCloseButton={true}
                            hideStats={true}
                        />
                    </div>
                </div>
            </section>

            {/* Striking Footer Signature */}
            <footer className="pt-24 flex flex-col items-center gap-8">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="flex flex-col items-center gap-4 group">
                    <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full group-hover:bg-white/10 transition-all cursor-pointer">
                        <Code size={14} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                        <span className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-500 transition-all">
                            Desarrollado por <span className="text-white group-hover:text-emerald-400">reflecterlabs.xyz</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <div className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Starknet Ecosystem Provider</div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
