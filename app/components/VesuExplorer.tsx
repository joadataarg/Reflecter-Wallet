'use client';

import React, { useState } from 'react';
import {
    ChevronLeft,
    ExternalLink,
    TrendingUp,
    Info,
    ArrowUpRight,
    ShieldCheck,
    Activity,
    Globe,
    Lock,
    Zap
} from 'lucide-react';
import { VesuEarnAction } from './VesuEarnAction';
import { VesuBorrowAction } from './VesuBorrowAction';
import { VesuMultiplyAction } from './VesuMultiplyAction';

interface Pool {
    id: string;
    type: 'Earn' | 'Borrow' | 'Multiply';
    name: string;
    symbol: string;
    icon: string;
    collateralIcon?: string;
    totalSupplied?: string;
    liquidity?: string;
    apr: string;
    borrowApr?: string;
    supplyApr?: string;
    maxApr?: string;
    maxMultiplier?: string;
    utilization: string;
    collateral: {
        asset: string;
        icon: string;
        lltv: string;
        price: string;
        debtCap: string;
    }[];
    addresses: {
        poolId: string;
        collateralAsset: string;
        debtAsset?: string;
    };
}

const MOCK_POOLS: Pool[] = [
    {
        id: 'wsteth-prime',
        type: 'Earn',
        name: 'Wrapped Staked Ether',
        symbol: 'wstETH',
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        totalSupplied: '$4.87M',
        apr: '3.25%',
        utilization: '7.08%',
        collateral: [
            { asset: 'WBTC', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', lltv: '80%', price: '$89.62K', debtCap: '50M wstETH' },
            { asset: 'USDC', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', lltv: '75%', price: '$1', debtCap: '100M wstETH' },
            { asset: 'ETH', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', lltv: '91%', price: '$3.11K', debtCap: '50M wstETH' },
            { asset: 'STRK', icon: 'https://www.starknet.io/assets/starknet-logo.svg', lltv: '70%', price: '$0.08', debtCap: '50M wstETH' },
            { asset: 'USDT', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', lltv: '80%', price: '$0.99', debtCap: '50M wstETH' },
        ],
        addresses: {
            poolId: '0x045...c3b5',
            collateralAsset: '0x005...e38b'
        }
    },
    {
        id: 'strk-wsteth-prime',
        type: 'Borrow',
        name: 'STRK / wstETH',
        symbol: 'STRK / wstETH',
        icon: 'https://www.starknet.io/assets/starknet-logo.svg',
        collateralIcon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        liquidity: '$4.31M',
        apr: '0.72%',
        supplyApr: '4.01%',
        borrowApr: '0.72%',
        utilization: '7.08%',
        collateral: [
            { asset: 'USDC', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', lltv: '68%', price: '$1', debtCap: '10M STRK' },
            { asset: 'xSTRK', icon: 'https://www.starknet.io/assets/starknet-logo.svg', lltv: '90%', price: '$0.09', debtCap: '10M STRK' },
            { asset: 'ETH', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', lltv: '70%', price: '$3.12K', debtCap: '50M STRK' },
        ],
        addresses: {
            poolId: '0x045...c3b5',
            collateralAsset: '0x047...938d',
            debtAsset: '0x005...e38b'
        }
    },
    {
        id: 'eth-wsteth-multiply',
        type: 'Multiply',
        name: 'ETH / wstETH',
        symbol: 'ETH / wstETH',
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        collateralIcon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        liquidity: '$4.3M',
        apr: '15.05%',
        maxApr: '15.05%',
        maxMultiplier: '9.2x',
        utilization: '7.08%',
        collateral: [
            { asset: 'STRK', icon: 'https://www.starknet.io/assets/starknet-logo.svg', lltv: '70%', price: '$0.08', debtCap: '50M ETH' },
            { asset: 'WBTC', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', lltv: '80%', price: '$89.77K', debtCap: '50M ETH' },
            { asset: 'wstETH', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', lltv: '91%', price: '$3.81K', debtCap: '50M ETH' },
        ],
        addresses: {
            poolId: '0x045...c3b5',
            collateralAsset: '0x049...4dc7',
            debtAsset: '0x005...e38b'
        }
    }
];

interface VesuExplorerProps {
    onBack: () => void;
}

export const VesuExplorer: React.FC<VesuExplorerProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'Earn' | 'Borrow' | 'Multiply' | 'Vaults'>('Earn');
    const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
    const [view, setView] = useState<'list' | 'details' | 'action'>('list');

    const tabs = ['Earn', 'Borrow', 'Multiply', 'Vaults'] as const;

    if (selectedPool) {
        if (view === 'action') {
            if (selectedPool.type === 'Earn') {
                return (
                    <VesuEarnAction
                        pool={selectedPool}
                        onBack={() => setView('details')}
                    />
                );
            } else if (selectedPool.type === 'Borrow') {
                return (
                    <VesuBorrowAction
                        pool={selectedPool}
                        onBack={() => setView('details')}
                    />
                );
            } else if (selectedPool.type === 'Multiply') {
                return (
                    <VesuMultiplyAction
                        pool={selectedPool}
                        onBack={() => setView('details')}
                    />
                );
            }
        }

        return (
            <div className="flex flex-col h-full p-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <button
                    onClick={() => {
                        setSelectedPool(null);
                        setView('list');
                    }}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                >
                    <ChevronLeft size={14} /> Back to Markets
                </button>

                <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center -space-x-2">
                            <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 z-10 overflow-hidden">
                                <img src={selectedPool.icon} alt={selectedPool.symbol} className="w-6 h-6" />
                            </div>
                            {selectedPool.collateralIcon && (
                                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 overflow-hidden">
                                    <img src={selectedPool.collateralIcon} alt="Collateral" className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white leading-tight">{selectedPool.name}</h3>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                <span>Prime</span>
                                <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 bg-white text-black flex items-center justify-center rounded-xs text-[6px]">V</span> Vesu
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-tight">
                                {selectedPool.type === 'Multiply' ? 'Max APR' : (selectedPool.type === 'Earn' ? 'Total supplied' : 'Supply APR')}
                            </div>
                            <div className="text-lg font-bold text-white">
                                {selectedPool.type === 'Multiply' ? selectedPool.maxApr : (selectedPool.type === 'Earn' ? selectedPool.totalSupplied : selectedPool.supplyApr)}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-tight">
                                {selectedPool.type === 'Multiply' ? 'Max multiplier' : (selectedPool.type === 'Earn' ? 'APR' : 'Borrow APR')}
                            </div>
                            <div className="text-lg font-bold text-blue-400 flex items-center gap-1">
                                {selectedPool.type === 'Multiply' ? selectedPool.maxMultiplier : (selectedPool.type === 'Earn' ? selectedPool.apr : selectedPool.borrowApr)} <Zap size={12} className="fill-blue-400" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-tight">
                                {selectedPool.type === 'Earn' ? 'Utilization' : 'Liquidity'}
                            </div>
                            <div className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity size={14} className="text-zinc-500" /> {selectedPool.type === 'Earn' ? selectedPool.utilization : selectedPool.liquidity}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 border-b border-white/5 pb-2">
                        <button className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white pb-2 -mb-[9px]">Overview</button>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white pb-2 transition-colors">Position activity</button>
                    </div>

                    {(selectedPool.type === 'Borrow' || selectedPool.type === 'Multiply') && (
                        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-lg space-y-4">
                            <h4 className="text-sm font-bold text-white">Liquidation</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-tight">Max loan-to-value</div>
                                    <div className="text-xs font-bold text-white">{selectedPool.type === 'Multiply' ? '89.18%' : '68.6%'}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-tight">Liquidation loan-to-value</div>
                                    <div className="text-xs font-bold text-white">{selectedPool.type === 'Multiply' ? '91%' : '70%'}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-tight">Liquidation bonus</div>
                                    <div className="text-xs font-bold text-white">{selectedPool.type === 'Multiply' ? '5%' : '10%'}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Collateral Table */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-white/5">
                            <h4 className="text-sm font-bold text-white">Collateral exposure</h4>
                            <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">Deposits in this market can be borrowed against.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[9px] uppercase tracking-widest text-zinc-500 border-b border-white/5">
                                        <th className="px-4 py-3 font-bold">Collateral</th>
                                        <th className="px-4 py-3 font-bold">LLTV</th>
                                        <th className="px-4 py-3 font-bold">Price</th>
                                        <th className="px-4 py-3 font-bold">Debt cap</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {selectedPool.collateral.map((item, idx) => (
                                        <tr key={idx} className="text-xs text-white hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <img src={item.icon} alt={item.asset} className="w-4 h-4 rounded-full" />
                                                    <span className="font-bold">{item.asset}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-zinc-400">{item.lltv}</td>
                                            <td className="px-4 py-3 text-zinc-400">{item.price}</td>
                                            <td className="px-4 py-3 text-zinc-400">{item.debtCap}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Interest Rate Graph (Simulated) */}
                    <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-lg space-y-4">
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-tight">Interest rate</h4>
                            <div className="text-lg font-bold text-blue-400 mt-1">0.72%</div>
                        </div>

                        <div className="border border-white/10 rounded p-4 relative">
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <div className="h-40 w-full relative">
                                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                                            {/* Grid Lines - Horizontal */}
                                            {[0, 10, 20, 30, 40, 50].map((val) => (
                                                <line
                                                    key={val}
                                                    x1="0" y1={50 - val} x2="100" y2={50 - val}
                                                    stroke="white" strokeOpacity="0.03" strokeWidth="0.5"
                                                />
                                            ))}

                                            {/* Grid Lines - Vertical (every 10%) */}
                                            {[0, 20, 40, 60, 80, 100].map((val) => (
                                                <line
                                                    key={val}
                                                    x1={val} y1="0" x2={val} y2="50"
                                                    stroke="white" strokeOpacity="0.03" strokeWidth="0.5"
                                                />
                                            ))}

                                            {/* Kinked Interest Rate Curve */}
                                            {/* Starts at (0, 48), Kink at (80, 40), Max at (100, 5) */}
                                            <path
                                                d="M 0 48 L 80 40 L 100 5"
                                                fill="none"
                                                stroke="url(#gradient)"
                                                strokeWidth="2"
                                                strokeLinejoin="round"
                                                strokeLinecap="round"
                                                className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                            />

                                            <defs>
                                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#3b82f6" />
                                                    <stop offset="100%" stopColor="#60a5fa" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>

                                    {/* X Axis Labels */}
                                    <div className="flex justify-between text-[7px] text-zinc-600 font-bold uppercase tracking-tight mt-2 px-0 w-full">
                                        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
                                            <span key={val}>{val}%</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Y Axis Labels (Right Side) */}
                                <div className="flex flex-col justify-between text-[7px] text-zinc-600 font-bold uppercase h-40">
                                    {[50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0].map((val) => (
                                        <span key={val} className="text-right w-6">{val}%</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security & Addresses */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-lg space-y-3">
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                                <ShieldCheck size={12} /> Security
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-zinc-400">Audits</span>
                                    <span className="text-emerald-400 font-bold">100% Coverage</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-zinc-400">Status</span>
                                    <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-500 font-bold rounded text-[8px]">NORMAL</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-lg space-y-3">
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                                <Globe size={12} /> Addresses
                            </div>
                            <div className="space-y-2">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] text-zinc-400 font-bold uppercase">Pool Id</span>
                                    <span className="text-[10px] text-blue-400 font-mono cursor-pointer hover:underline">{selectedPool.addresses.poolId}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] text-zinc-400 font-bold uppercase">Collateral Asset</span>
                                    <span className="text-[10px] text-blue-400 font-mono cursor-pointer hover:underline">{selectedPool.addresses.collateralAsset}</span>
                                </div>
                                {selectedPool.addresses.debtAsset && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] text-zinc-400 font-bold uppercase">Debt Asset</span>
                                        <span className="text-[10px] text-blue-400 font-mono cursor-pointer hover:underline">{selectedPool.addresses.debtAsset}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => setView('action')}
                        className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-white/5"
                    >
                        Start winning
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-6 animate-in fade-in duration-300">
            <div className="shrink-0">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                >
                    <ChevronLeft size={14} /> Back to Assets
                </button>

                <div className="flex items-center gap-4 border-b border-white/10 mb-6 pb-2 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-xs font-bold uppercase tracking-widest pb-2 transition-all relative ${activeTab === tab ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scrollable Content Section */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
                {/* Tab Header Content */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">{activeTab}</h2>
                        <p className="text-sm text-zinc-500 max-w-xl leading-relaxed">
                            {activeTab === 'Earn' && "Deposit assets in a lending pool to earn interest and other yield. "}
                            {activeTab === 'Borrow' && "Borrow assets instantly, repay anytime with interest. "}
                            {activeTab === 'Multiply' && "Maximize your yield by borrowing, swapping and redepositing a correlated asset with 1 click. "}
                            {activeTab === 'Vaults' && "Earn yield on any asset with curated yield strategies. "}
                            <span className="text-blue-500 cursor-pointer hover:underline">Learn more.</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-zinc-900/30 border border-white/5 rounded-xl space-y-2">
                            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-tight">Total supplied</div>
                            <div className="text-xl font-bold text-white">
                                {activeTab === 'Vaults' ? '$92.42K' : (activeTab === 'Multiply' ? '$67.33M' : '$67.32M')}
                            </div>
                        </div>
                        {activeTab !== 'Vaults' && (
                            <div className="p-5 bg-zinc-900/30 border border-white/5 rounded-xl space-y-2">
                                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-tight">Total borrowed</div>
                                <div className="text-xl font-bold text-white">$16.55M</div>
                            </div>
                        )}
                    </div>

                    {activeTab === 'Vaults' && (
                        <div className="flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Info size={16} className="text-blue-400" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                                This section is currently under development
                            </span>
                        </div>
                    )}
                </div>

                {/* Pool Table */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Markets</h3>
                    <div className="w-full border border-white/10 rounded-lg overflow-hidden bg-zinc-900/30">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[9px] uppercase tracking-widest text-zinc-500 border-b border-white/10 bg-white/5">
                                    <th className="px-4 py-3 font-bold">Asset & Pool</th>
                                    <th className="px-4 py-3 font-bold">Total Supplied</th>
                                    <th className="px-4 py-3 font-bold text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {MOCK_POOLS.filter(p => p.type === activeTab).length > 0 ? (
                                    MOCK_POOLS.filter(p => p.type === activeTab).map((pool) => (
                                        <tr key={pool.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center -space-x-1.5">
                                                        <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center bg-zinc-900 overflow-hidden shrink-0 z-10">
                                                            <img src={pool.icon} alt={pool.symbol} className="w-4 h-4" />
                                                        </div>
                                                        {pool.collateralIcon && (
                                                            <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center bg-zinc-900 overflow-hidden shrink-0">
                                                                <img src={pool.collateralIcon} alt="Collateral" className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-white uppercase tracking-tight">{pool.symbol}</div>
                                                        <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Prime</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-xs font-bold text-white">
                                                {pool.type === 'Earn' ? pool.totalSupplied : pool.liquidity}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedPool(pool);
                                                        setView('details');
                                                    }}
                                                    className="px-3 py-1.5 bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2 ml-auto"
                                                >
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-xs text-zinc-500 italic uppercase tracking-widest font-bold">
                                            No active {activeTab} pools
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
        </div>
    );
};
