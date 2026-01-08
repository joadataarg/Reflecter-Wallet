'use client';

import React, { useState } from 'react';
import {
    Gift,
    Share2,
    MessageSquare,
    Twitter,
    Send,
    CheckCircle2,
    Trophy,
    Zap,
    ChevronRight,
    Star,
    Layout
} from 'lucide-react';
import { useRewards } from '@/lib/hooks/useRewards';
import { RewardsModule } from '@/app/features/rewards/components/RewardsModule';
import { FeedbackForm } from '@/app/features/wallet/components/FeedbackForm';

export default function RewardsPage() {
    const { points, trackSocialShare } = useRewards();
    const [showFeedback, setShowFeedback] = useState(false);

    const rewardsActions = [
        {
            id: 'feedback',
            title: 'Danos tu Opinión',
            description: 'Ayúdanos a mejorar y gana 50 RT instantáneos.',
            icon: <MessageSquare size={20} className="text-indigo-400" />,
            points: '+50 RT',
            action: () => setShowFeedback(true),
            completed: false
        },
        {
            id: 'twitter',
            title: 'Compartir en X (Twitter)',
            description: 'Presume tu cuenta Reflecter y gana 25 RT.',
            icon: <Twitter size={20} className="text-blue-400" />,
            points: '+25 RT',
            action: () => {
                trackSocialShare('twitter', 'https://twitter.com/intent/tweet');
                window.open('https://twitter.com/intent/tweet?text=Gestionando%20mi%20identidad%20en%20Starknet%20con%20@ReflecterWallet!%20🚀', '_blank');
            },
            completed: false
        },
        {
            id: 'telegram',
            title: 'Unirse a la Comunidad',
            description: 'Únete a nuestro Telegram oficial.',
            icon: <Send size={20} className="text-sky-400" />,
            points: '+15 RT',
            action: () => {
                trackSocialShare('telegram', 'https://t.me/reflecterwallet');
                window.open('https://t.me/reflecterwallet', '_blank');
            },
            completed: false
        }
    ];

    return (
        <div className="p-12 space-y-12 animate-in fade-in duration-700 max-w-[1400px] mx-auto pb-32">
            {showFeedback && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
                    <div className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[3rem] p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <FeedbackForm
                            onComplete={() => { setShowFeedback(false); }}
                            onClose={() => setShowFeedback(false)}
                        />
                    </div>
                </div>
            )}

            <header className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                    <Gift size={10} className="text-amber-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Centro de Recompensas</span>
                </div>
                <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
                    Impacto & <br /> <span className="text-zinc-600">Recompensas</span>
                </h1>
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest max-w-lg">
                    Construye tu reputación on-chain y activa beneficios exclusivos completando desafíos.
                </p>
            </header>

            {/* Account Insight Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-4">
                {/* 1. Main Balance Card */}
                <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group min-h-[320px] flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                    <div className="relative z-10 space-y-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4">Balance Acumulado</p>
                            <div className="flex items-end gap-3 text-white">
                                <span className="text-7xl font-black tracking-tighter tabular-nums leading-none">{points?.currentBalance ?? 0}</span>
                                <span className="text-2xl font-black text-amber-400 uppercase leading-none pb-1">RT</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Star size={12} className="text-amber-400" /> Nivel de Impacto
                            </h4>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-amber-400 w-2/3 shadow-[0_0_15px_rgba(251,191,36,0.3)]"></div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-white">Nivel 2</span>
                                <span className="text-zinc-500">65% Completo</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Rewards Module (Points & Referrals) */}
                <div className="bg-zinc-900/40 border border-white/5 p-1 rounded-[3rem] shadow-xl overflow-hidden min-h-[320px]">
                    <RewardsModule />
                </div>
            </div>

            {/* Misiones Section */}
            <div className="space-y-10 pt-10">
                <div className="flex items-center justify-between px-4">
                    <div className="space-y-1">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                            <Zap size={16} className="text-amber-400" /> Misiones Disponibles
                        </h3>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest pl-7">Desbloquea RT completando tareas verificadas</p>
                    </div>
                    <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Sincronizado</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rewardsActions.map((action) => (
                        <div
                            key={action.id}
                            onClick={action.action}
                            className="p-10 bg-black/40 border border-white/5 rounded-[3rem] flex flex-col justify-between group cursor-pointer hover:border-amber-500/20 hover:bg-zinc-900/50 transition-all shadow-2xl shadow-black h-[280px] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-4">
                                <ChevronRight size={20} className="text-amber-500" />
                            </div>

                            <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-white/20 transition-all shadow-xl">
                                {action.icon}
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <h4 className="text-xl font-black text-white uppercase tracking-tight leading-tight">{action.title}</h4>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed mt-2 opacity-80">{action.description}</p>
                                </div>
                                <div className="inline-flex px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                    <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest">{action.points}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Proximamente */}
                    <div className="p-10 bg-zinc-900/10 border border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-700 h-[280px]">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                            <Trophy size={32} className="text-zinc-600 group-hover:text-amber-500 transition-colors" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Nuevos Desafíos</p>
                            <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest mt-1">Starknet On-Chain Soon</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
