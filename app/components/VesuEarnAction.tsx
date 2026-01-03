'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Zap, ArrowDown } from 'lucide-react';

interface Pool {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    apr: string;
}

interface VesuEarnActionProps {
    pool: Pool;
    onBack: () => void;
}

export const VesuEarnAction: React.FC<VesuEarnActionProps> = ({ pool, onBack }) => {
    const [amount, setAmount] = useState<string>('0.00');
    const [usdValue, setUsdValue] = useState<number>(0);

    // Mock price - in a real app this would come from an oracle or API
    const mockPrice = 3110;

    useEffect(() => {
        const numAmount = parseFloat(amount) || 0;
        setUsdValue(numAmount * mockPrice);
    }, [amount]);

    const aprValue = parseFloat(pool.apr.replace('%', '')) / 100;
    const monthlyEarnings = (parseFloat(amount) || 0) * aprValue / 12;
    const yearlyReturn = (parseFloat(amount) || 0) * aprValue;

    return (
        <div className="flex flex-col h-full bg-black p-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors mb-8"
            >
                <ChevronLeft size={14} /> Back to Details
            </button>

            <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">I want to deposit</h4>

                    <div className="p-4 bg-zinc-900/30 border border-white/10 rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                onFocus={() => amount === '0.00' && setAmount('')}
                                onBlur={() => !amount && setAmount('0.00')}
                                className="text-3xl font-bold bg-transparent outline-none placeholder:text-zinc-700 text-white w-full"
                                placeholder="0.00"
                            />
                            <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 px-3 py-1.5 rounded-full shrink-0">
                                <img src={pool.icon} alt={pool.symbol} className="w-5 h-5 rounded-full" />
                                <span className="font-bold text-sm text-white">{pool.symbol}</span>
                            </div>
                        </div>
                        <div className="text-zinc-500 text-xs font-medium">
                            ≈ ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500">
                        <ArrowDown size={14} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Estimated Returns</h4>
                    <div className="p-4 bg-zinc-900/30 border border-white/10 rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">APR</span>
                            <div className="flex items-center gap-1 text-sm font-bold text-blue-400">
                                {pool.apr} <Zap size={12} className="fill-blue-400" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Monthly</span>
                            <span className="text-sm font-bold text-white">${(monthlyEarnings * mockPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Yearly</span>
                            <span className="text-sm font-bold text-white">${(yearlyReturn * mockPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                <button
                    className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 mt-4"
                    onClick={() => alert('Próximamente: Integración con contrato Vesu')}
                >
                    Confirm Deposit
                </button>
            </div>

            <p className="text-[8px] text-zinc-600 text-center mt-8 uppercase tracking-[0.2em] font-bold">
                Open Source Infrastructure • Reflecter Labs
            </p>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};
