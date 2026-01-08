'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { MarketplaceClaim } from '@/app/features/rewards/components/MarketplaceClaim';
import { useRewards } from '@/lib/hooks/useRewards';

export default function MarketplacePage() {
    const { isDesktop } = useRewards();

    if (!isDesktop) {
        return (
            <div className="flex-1 bg-black flex flex-col items-center justify-center p-8 text-center space-y-4 h-full">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-zinc-500 mb-2">
                    <ShoppingBag size={32} />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Marketplace Desktop</h2>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed max-w-[240px]">
                    El marketplace de recompensas es exclusivo de la versión de escritorio por el momento.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-black min-h-screen p-8 md:p-12 overflow-y-auto custom-scrollbar">
            <div className="max-w-6xl mx-auto">
                <MarketplaceClaim />
            </div>
        </div>
    );
}
