import React from 'react';
import { Gift, Share2, Star } from 'lucide-react';

interface RewardPointsProps {
    onReferral: () => void;
}

export const RewardPoints: React.FC<RewardPointsProps> = ({ onReferral }) => {
    return (
        <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-y border-white/5 space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-colors"></div>

            <div className="flex items-center justify-between relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Reflecter Points</h3>
                    </div>
                    <div className="text-2xl font-black text-white tracking-tight tabular-nums">1,250</div>
                </div>
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                    <Gift size={20} />
                </div>
            </div>

            <div className="relative z-10">
                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[65%] rounded-full relative">
                        <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/20 animate-pulse"></div>
                    </div>
                </div>
                <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                    <span>Nivel 2</span>
                    <span>Próximo: 250 pt</span>
                </div>
            </div>

            <button
                onClick={onReferral}
                className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 relative z-10 group/btn"
            >
                <Share2 size={12} className="group-hover/btn:scale-110 transition-transform" /> Ganar más puntos
            </button>
        </div>
    );
};
