'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Zap, Settings, Info } from 'lucide-react';

interface Pool {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    collateralIcon?: string;
    apr: string;
    maxApr?: string;
    maxMultiplier?: string;
}

interface VesuMultiplyActionProps {
    pool: Pool;
    onBack: () => void;
}

export const VesuMultiplyAction: React.FC<VesuMultiplyActionProps> = ({ pool, onBack }) => {
    const [depositAmount, setDepositAmount] = useState<string>('0');
    const [ltv, setLtv] = useState<number>(0);
    const [showSlippage, setShowSlippage] = useState(false);
    const [isAutoSlippage, setIsAutoSlippage] = useState(true);
    const [slippageValue, setSlippageValue] = useState('0.5');

    const ethPrice = 3110;
    const depositUsd = (parseFloat(depositAmount) || 0) * ethPrice;

    // Multiply calculations (simplistic mock)
    const multiplier = 1 + (ltv / 100) * 8; // Max around 9x
    const totalSupplied = (parseFloat(depositAmount) || 0) * multiplier;
    const totalBorrowed = totalSupplied - (parseFloat(depositAmount) || 0);

    return (
        <div className="flex flex-col h-full bg-black p-6 animate-in fade-in slide-in-from-right-4 duration-300 relative">
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
                                <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" className="w-5 h-5 rounded-full" />
                                <span className="font-bold text-sm text-white">ETH</span>
                            </div>
                        </div>
                        <div className="text-zinc-500 text-xs font-medium">≈ ${depositUsd.toLocaleString()}</div>
                    </div>
                </div>

                {/* Net APR & LTV */}
                <div className="space-y-6 pt-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Net APR</span>
                        <span className="text-xs font-bold text-white">2.43%</span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-zinc-500">Loan to value</span>
                            <span className="text-zinc-400">{ltv}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="89.18"
                            value={ltv}
                            onChange={(e) => setLtv(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-zinc-900 rounded-full appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>

                {/* Quote with Settings */}
                <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between relative">
                        <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Quote</span>
                        <button
                            onClick={() => setShowSlippage(!showSlippage)}
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            <Settings size={14} />
                        </button>

                        {/* Slippage Dropdown */}
                        {showSlippage && (
                            <div className="absolute right-0 top-6 w-56 bg-zinc-900 border border-white/10 rounded-xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                                <h5 className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-3">Max Slippage</h5>
                                <div className="flex items-center gap-2 bg-black border border-white/5 p-1 rounded-lg mb-3">
                                    <button
                                        onClick={() => setIsAutoSlippage(true)}
                                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${isAutoSlippage ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        Auto
                                    </button>
                                    <div className="flex items-center gap-1 flex-1 px-2">
                                        <input
                                            type="text"
                                            value={slippageValue}
                                            onChange={(e) => {
                                                setSlippageValue(e.target.value);
                                                setIsAutoSlippage(false);
                                            }}
                                            className="w-full bg-transparent text-[10px] text-right font-bold outline-none text-white"
                                        />
                                        <span className="text-[10px] text-zinc-500">%</span>
                                    </div>
                                </div>
                                <p className="text-[9px] text-zinc-500 leading-relaxed italic">
                                    We'll set the slippage automatically to minimize the failure rate.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Price Impact</span>
                        <span className="text-[10px] text-zinc-500">-</span>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Multiplier</span>
                        <span className="text-xs font-bold text-white">{multiplier.toFixed(1)}x</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Monthly earnings</span>
                        <span className="text-xs font-bold text-white">${(depositAmount === '0' ? 0 : 4.25).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" className="w-3.5 h-3.5" />
                            <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Total supplied</span>
                        </div>
                        <span className="text-xs font-bold text-white">{totalSupplied.toFixed(4)} ETH</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" className="w-3.5 h-3.5" style={{ opacity: 0.6 }} />
                            <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Total borrowed</span>
                        </div>
                        <span className="text-xs font-bold text-white">{totalBorrowed.toFixed(4)} wstETH</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Liquidation price</span>
                        <span className="text-xs font-bold text-white">—</span>
                    </div>
                </div>

                <button
                    disabled={parseFloat(depositAmount) === 0}
                    className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    onClick={() => alert('Confirming Multiply Position...')}
                >
                    Confirm Multiply
                </button>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                input[type='range']::-webkit-slider-thumb {
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    background: white;
                    border-radius: 50%;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};
