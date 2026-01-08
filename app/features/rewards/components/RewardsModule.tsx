'use client';

import React, { useState } from 'react';
import { Gift, Share2, Star, QrCode, Award, Users, ChevronRight, Share } from 'lucide-react';
import { useRewards } from '@/lib/hooks/useRewards';
import { ReferralQRGenerator } from '@/app/features/rewards/components/ReferralQRGenerator';
import { SocialShareButton } from '@/app/features/rewards/components/SocialShareButton';

export const RewardsModule: React.FC = () => {
    const { points, referrals, referralCode, isLoading, isDesktop } = useRewards();
    const [showQR, setShowQR] = useState(false);

    if (isLoading && !points) {
        return <div className="animate-pulse bg-white/5 h-48 rounded-2xl" />;
    }

    return (
        <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-2xl space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-colors"></div>

            <div className="flex items-center justify-between relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Reflecter Points</h3>
                    </div>
                    <div className="text-3xl font-black text-white tracking-tight tabular-nums">
                        {points?.currentBalance ?? 0}
                    </div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
                        Total Ganados: {points?.totalEarned ?? 0}
                    </p>
                </div>
                <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
                    <Gift size={24} />
                </div>
            </div>

            {/* Referidos Track Tool */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="bg-black/40 backdrop-blur-sm border border-white/5 p-3 rounded-xl">
                    <div className="flex items-center gap-2 text-zinc-400 mb-1">
                        <Users size={12} />
                        <span className="text-[9px] font-bold uppercase tracking-tighter">Referidos</span>
                    </div>
                    <div className="text-lg font-bold text-white">{referrals.length}</div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm border border-white/5 p-3 rounded-xl">
                    <div className="flex items-center gap-2 text-zinc-400 mb-1">
                        <Award size={12} />
                        <span className="text-[9px] font-bold uppercase tracking-tighter">Pendientes</span>
                    </div>
                    <div className="text-lg font-bold text-white">{points?.pendingBalance ?? 0}</div>
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                <button
                    onClick={() => setShowQR(!showQR)}
                    className="w-full py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                >
                    <QrCode size={16} /> {showQR ? 'Ocultar Código' : 'Invitar Amigos'}
                </button>

                {isDesktop && (
                    <div className="grid grid-cols-2 gap-2">
                        <SocialShareButton platform="TWITTER" />
                        <SocialShareButton platform="DISCORD" />
                    </div>
                )}
            </div>

            {showQR && referralCode && (
                <div className="pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <ReferralQRGenerator code={referralCode} />
                </div>
            )}

            {/* Referral Mini-History */}
            <div className="space-y-2 relative z-10">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Actividad Reciente</h4>
                {referrals.slice(0, 2).map((ref) => (
                    <div key={ref.referralId} className="flex items-center justify-between py-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                                <Users size={10} className="text-zinc-400" />
                            </div>
                            <span className="text-[10px] text-zinc-300 font-medium">
                                {ref.referredAddress.slice(0, 6)}...{ref.referredAddress.slice(-4)}
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-400">+{ref.pointsEarned} PT</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
