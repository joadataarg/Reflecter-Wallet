'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Zap, ArrowDown } from 'lucide-react';

interface Pool {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    collateralIcon?: string;
    apr: string;
    borrowApr?: string;
    supplyApr?: string;
}

interface VesuBorrowActionProps {
    pool: Pool;
    onBack: () => void;
}

export const VesuBorrowAction: React.FC<VesuBorrowActionProps> = ({ pool, onBack }) => {

    const [depositAmount, setDepositAmount] = useState<string>('0');
    const [borrowAmount, setBorrowAmount] = useState<string>('0.00');

    // Mock prices & rates
    const strkPrice = 0.085; // Refined to match image roughly (50 STRK ≈ $4.25)
    const wstethPrice = 3810;
    const supplyApr = 0.0463; // 4.63%
    const borrowApr = 0.0072; // 0.72%
    const maxLtv = 68.6;

    const depositUsd = (parseFloat(depositAmount) || 0) * strkPrice;
    const borrowUsd = (parseFloat(borrowAmount) || 0) * wstethPrice;

    // LTV Calculation
    const ltv = depositUsd > 0 ? (borrowUsd / depositUsd) * 100 : 0;

    // Dynamic Suggestions
    const maxBorrowAsset = (depositUsd * (maxLtv / 100)) / wstethPrice;
    const monthlyEarnings = (depositUsd * supplyApr) / 12;
    const monthlyCost = (borrowUsd * borrowApr) / 12;

    const handleMaxBorrow = () => {
        setBorrowAmount(maxBorrowAsset.toFixed(4));
    };

    return (
        <div className="flex flex-col h-full bg-black p-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors mb-6"
            >
                <ChevronLeft size={14} /> Back to Details
            </button>

            <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                {/* Deposit Section */}
                <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">I want to deposit</h4>
                    <div className="p-4 bg-zinc-900/30 border border-white/10 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                            <input
                                type="number"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                onFocus={() => depositAmount === '0' && setDepositAmount('')}
                                onBlur={() => !depositAmount && setDepositAmount('0')}
                                className="text-3xl font-bold bg-transparent outline-none placeholder:text-zinc-700 text-white w-full"
                                placeholder="0"
                            />
                            <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 px-3 py-1.5 rounded-full shrink-0">
                                <img src="https://www.starknet.io/assets/starknet-logo.svg" alt="STRK" className="w-5 h-5 rounded-full" />
                                <span className="font-bold text-sm text-white">STRK</span>
                            </div>
                        </div>
                        <div className="text-zinc-500 text-xs font-medium">≈ ${depositUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-black border border-white/10 flex items-center justify-center text-zinc-500">
                        <ArrowDown size={14} />
                    </div>
                </div>

                {/* Borrow Section */}
                <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">To borrow</h4>
                    <div className="p-4 bg-zinc-900/30 border border-white/10 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                            <input
                                type="number"
                                value={borrowAmount}
                                onChange={(e) => setBorrowAmount(e.target.value)}
                                onFocus={() => borrowAmount === '0.00' && setBorrowAmount('')}
                                onBlur={() => !borrowAmount && setBorrowAmount('0.00')}
                                className="text-3xl font-bold bg-transparent outline-none placeholder:text-zinc-700 text-white w-full"
                                placeholder="0.00"
                            />
                            <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 px-3 py-1.5 rounded-full shrink-0">
                                <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="wstETH" className="w-5 h-5 rounded-full" />
                                <span className="font-bold text-sm text-white">wstETH</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-zinc-500 text-xs font-medium">≈ ${borrowUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-zinc-500 font-bold">{maxBorrowAsset.toFixed(4)} wstETH</span>
                                <button
                                    onClick={handleMaxBorrow}
                                    className="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 text-[8px] font-bold uppercase rounded hover:text-white transition-colors"
                                >
                                    Max
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LTV Status */}
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-zinc-500">Loan to value</span>
                        <span className={ltv > maxLtv ? 'text-red-500' : 'text-zinc-400'}>{ltv.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900/50 rounded-full overflow-hidden border border-white/5">
                        <div
                            className={`h-full transition-all duration-300 ${ltv > maxLtv ? 'bg-red-500 shadow-[0_0_8px_rgba(239,44,44,0.3)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]'}`}
                            style={{ width: `${Math.min(ltv, 100)}%` }}
                        />
                    </div>
                    <div className="text-right text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                        Max. {maxLtv}%
                    </div>
                </div>

                {/* Stats List */}
                <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Supply APR</span>
                        <span className="text-xs font-bold text-white">{(supplyApr * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Borrow APR</span>
                        <span className="text-xs font-bold text-white">{(borrowApr * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Monthly earnings</span>
                        <span className="text-xs font-bold text-white">${monthlyEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Monthly cost</span>
                        <span className="text-xs font-bold text-white">${monthlyCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2">
                            <img src="https://www.starknet.io/assets/starknet-logo.svg" className="w-3.5 h-3.5" />
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">STRK liquidation price</span>
                        </div>
                        <span className="text-xs font-bold text-white">$0</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" className="w-3.5 h-3.5" />
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">wstETH liquidation price</span>
                        </div>
                        <span className="text-xs font-bold text-white">$0</span>
                    </div>
                </div>

                <button
                    disabled={ltv > maxLtv || depositUsd === 0}
                    className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                    Confirm Borrow
                </button>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
};
