'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    TrendingUp, ArrowUp, ArrowDown, ExternalLink, LogOut,
    ShieldCheck, ChevronRight, User, Bell, X, Gift, ChevronLeft,
    Eye, EyeOff
} from 'lucide-react';
import { TokenChart } from './TokenChart';
import { WalletSession, WalletView } from '@/lib/core/domain/types';
import { TokenBalanceDisplay } from '@/app/components/TokenBalanceDisplay';
import { TOKEN_DATA, TokenType } from '@/lib/config/tokens';
import { TokenIcon } from '@/app/components/ui/TokenIcon';
import { useTokenPrices } from '@/lib/hooks/useTokenPrices';
import { useTokenBalance } from '@/lib/hooks/useTokenBalance';
import { RewardsModule } from '@/app/features/rewards/components/RewardsModule';
import { useRewards } from '@/lib/hooks/useRewards';
import { FeedbackForm } from './FeedbackForm';

interface WalletDashboardProps {
    wallet: WalletSession;
    onNavigate: (view: WalletView) => void;
    onLogout: () => void;
    activeTab?: 'home' | 'assets' | 'feedback';
    profile: {
        firstName: string;
        lastName: string;
        update: (data: any) => void;
    };
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({
    wallet,
    onNavigate,
    onLogout,
    activeTab: propActiveTab,
    profile
}) => {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<'home' | 'assets' | 'feedback'>(propActiveTab || 'home');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isBalanceHidden, setIsBalanceHidden] = useState(false);
    const [selectedTokenDetails, setSelectedTokenDetails] = useState<TokenType | null>(null);
    const { prices } = useTokenPrices(true);
    const { referrals } = useRewards();

    const [currentMarketingSlide, setCurrentMarketingSlide] = useState(0);

    const marketingSlides = [
        {
            title: '¡TU OPINIÓN VALE!',
            description: 'Danos tu opinión para mejorar y gana puntos extras para recompensas.',
            icon: <Gift size={14} />,
            color: 'text-indigo-400',
            borderColor: 'border-indigo-500',
            bg: 'from-indigo-600/20 to-purple-600/20',
            view: 'feedback'
        },
        {
            title: 'RECOMPENSAS STARK',
            description: 'Completa tu perfil para desbloquear beneficios exclusivos en Starknet.',
            icon: <TrendingUp size={14} />,
            color: 'text-emerald-400',
            borderColor: 'border-emerald-500',
            bg: 'from-emerald-600/20 to-teal-600/20',
            view: 'home'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMarketingSlide((prev) => (prev + 1) % marketingSlides.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    // Sync active tab with URL or Props
    useEffect(() => {
        if (propActiveTab) {
            setActiveTab(propActiveTab as any);
            return;
        }
        const view = searchParams.get('view');
        if (view === 'assets') {
            setActiveTab('assets');
        } else if (view === 'feedback') {
            setActiveTab('feedback');
        } else {
            setActiveTab('home');
        }
    }, [searchParams, propActiveTab]);

    const ethData = useTokenBalance('ETH');
    const strkData = useTokenBalance('STRK');
    const usdcData = useTokenBalance('USDC');

    const balances = {
        ETH: ethData.balance || '0',
        STRK: strkData.balance || '0',
        USDC: usdcData.balance || '0'
    };

    const totalValue = (
        (parseFloat(balances.ETH) * (prices?.ETH || 0)) +
        (parseFloat(balances.STRK) * (prices?.STRK || 0)) +
        (parseFloat(balances.USDC) * (prices?.USDC || 1))
    );

    const calculateUSDValue = (token: TokenType) => {
        const balance = parseFloat(balances[token] || '0');
        const price = prices?.[token] || (token === 'USDC' ? 1 : 0);
        return (balance * price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-black relative">
            {/* --- TOKEN CHART OVERLAY --- */}
            {selectedTokenDetails && (
                <div className="absolute inset-0 z-[70] bg-black p-8 animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar">
                    <TokenChart
                        symbol={selectedTokenDetails}
                        onClose={() => setSelectedTokenDetails(null)}
                        hideStats={true}
                        hideCloseButton={true}
                    />
                </div>
            )}

            {/* --- HEADER --- */}
            <div className="shrink-0 p-6">
                <div className="flex items-center justify-between group">
                    <div
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center gap-3 cursor-pointer"
                    >
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px]">
                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                    <User size={20} className="text-zinc-500" />
                                </div>
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full"></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h2 className="text-xs font-black text-white uppercase tracking-wider">Mi Billetera</h2>
                                <ChevronRight size={12} className="text-zinc-500" />
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">
                                {wallet?.publicKey?.slice(0, 6)}...{wallet?.publicKey?.slice(-4)}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                    >
                        <Bell size={18} />
                    </button>
                </div>
            </div>

            {/* --- SETTINGS OVERLAY --- */}
            {isSettingsOpen && (
                <div className="absolute inset-0 z-[60] bg-black/95 backdrop-blur-xl p-6 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500">Configuración</h3>
                        <button onClick={() => setIsSettingsOpen(false)} className="p-2 bg-white/5 rounded-full text-zinc-500">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="space-y-6 pb-12">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                            <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">Perfil</label>
                            <div className="grid grid-cols-2 gap-3">
                                <input readOnly value={profile?.firstName} className="bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white" />
                                <input readOnly value={profile?.lastName} className="bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Referidos</span>
                                <span className="text-sm font-black text-white">{referrals.length}</span>
                            </div>
                        </div>

                        <RewardsModule />

                        <button
                            onClick={onLogout}
                            className="w-full p-4 border border-red-500/30 bg-red-500/5 rounded-2xl flex items-center justify-center gap-2 text-red-500"
                        >
                            <LogOut size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            )}

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
                {activeTab === 'home' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* 1. Total Balance Card with Flip Animation */}
                        <div className="perspective-1000 h-[220px]">
                            <div className={`relative w-full h-full text-center preserve-3d transition-transform-700 ${isBalanceHidden ? 'rotate-y-180' : ''}`}>

                                {/* Front Face */}
                                <div className="absolute inset-0 p-8 rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-black border border-white/10 shadow-2xl backface-hidden flex flex-col items-center justify-between">
                                    <div className="w-full flex justify-between items-start text-zinc-500 px-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Total de la Billetera</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setIsBalanceHidden(true); }}
                                            className="p-1 hover:text-white transition-colors"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-5xl font-black text-white tracking-tighter tabular-nums">
                                            {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                        <span className="text-xl font-black text-zinc-600 tracking-tighter">USD</span>
                                    </div>

                                    <div className="w-full grid grid-cols-2 gap-4">
                                        <button onClick={() => onNavigate('send')} className="py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all">Enviar</button>
                                        <button onClick={() => onNavigate('receive')} className="py-4 bg-zinc-900 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all">Recibir</button>
                                    </div>
                                </div>

                                {/* Back Face (Hidden Balance) */}
                                <div className="absolute inset-0 p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-900/40 to-black border border-white/10 shadow-2xl backface-hidden rotate-y-180 flex flex-col items-center justify-center space-y-4">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <EyeOff size={20} className="text-zinc-600" />
                                    </div>
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Balance Oculto</p>
                                    <button
                                        onClick={() => setIsBalanceHidden(false)}
                                        className="py-2 px-6 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest"
                                    >
                                        Mostrar Balance
                                    </button>
                                </div>

                            </div>
                        </div>

                        {/* 2. Feedback Carousel with Fluor Neon Effect */}
                        <div className="perspective-1000 h-[100px]">
                            <div
                                key={currentMarketingSlide}
                                className={`h-full p-6 bg-black border-2 ${marketingSlides[currentMarketingSlide].borderColor} rounded-[2rem] flex items-center justify-between group cursor-pointer transition-all duration-700 animate-in slide-in-from-right-full fade-in shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]`}
                                onClick={() => onNavigate(marketingSlides[currentMarketingSlide].view as any)}
                                style={{
                                    transformStyle: 'preserve-3d',
                                    boxShadow: `0 0 15px ${marketingSlides[currentMarketingSlide].borderColor === 'border-indigo-500' ? 'rgba(99,102,241,0.2)' : 'rgba(16,185,129,0.2)'}`
                                }}
                            >
                                <div className="flex-1">
                                    <div className={`flex items-center gap-2 mb-1 ${marketingSlides[currentMarketingSlide].color}`}>
                                        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                                            {marketingSlides[currentMarketingSlide].icon}
                                        </div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">{marketingSlides[currentMarketingSlide].title}</h4>
                                    </div>
                                    <p className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest leading-tight mt-1 max-w-[200px]">
                                        {marketingSlides[currentMarketingSlide].description}
                                    </p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                                    <ChevronRight size={16} className="text-zinc-400 group-hover:text-white" />
                                </div>
                            </div>
                        </div>

                        {/* 3. Portafolio List (Showing only non-zero assets) */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 pl-2">Portafolio</h3>
                            <div className="space-y-3">
                                {(Object.keys(TOKEN_DATA) as TokenType[])
                                    .filter(token => parseFloat(balances[token] || '0') > 0)
                                    .map((token) => (
                                        <div
                                            key={token}
                                            onClick={() => setSelectedTokenDetails(token)}
                                            className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 hover:bg-zinc-800/40 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                                                    <TokenIcon src={TOKEN_DATA[token].icon} alt={token} fallback={TOKEN_DATA[token].fallback} size="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-white">{token}</div>
                                                    <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{TOKEN_DATA[token].name}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-black text-white tabular-nums">
                                                    <TokenBalanceDisplay token={token} walletPublicKey={wallet?.publicKey} />
                                                </div>
                                                <div className="text-[9px] text-zinc-600 font-black tracking-widest">
                                                    {calculateUSDValue(token)} USD
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                {Object.keys(TOKEN_DATA).filter(token => parseFloat(balances[token as TokenType] || '0') > 0).length === 0 && (
                                    <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Sin fondos activos</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'assets' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 h-full">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Crypto Assets</h3>
                        </div>
                        <div className="space-y-4">
                            {(Object.keys(TOKEN_DATA) as TokenType[]).map((token) => (
                                <div
                                    key={token}
                                    onClick={() => setSelectedTokenDetails(token)}
                                    className="p-6 bg-zinc-900/50 border border-white/5 rounded-[2rem] flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 flex items-center justify-center bg-black rounded-2xl border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                                            <TokenIcon src={TOKEN_DATA[token].icon} alt={token} fallback={TOKEN_DATA[token].fallback} size="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="text-[16px] font-black text-white tracking-tight">{token}</div>
                                            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{TOKEN_DATA[token].name}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[18px] font-black text-white tabular-nums leading-none mb-1">
                                            <TokenBalanceDisplay token={token} walletPublicKey={wallet?.publicKey} />
                                        </div>
                                        <div className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">
                                            {calculateUSDValue(token)} USD
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 text-center text-[10px] text-zinc-700 font-black uppercase tracking-[0.2em] leading-relaxed">
                            Más integraciones nativas <br /> coming soon a Starknet.
                        </div>
                    </div>
                )}

                {activeTab === 'feedback' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full pb-20">
                        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors">
                            <ChevronLeft size={14} /> Volver
                        </button>
                        <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-[2rem]">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">¡Gana 50 Puntos!</h3>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">
                                Ayúdanos a mejorar completando esta encuesta rápida y obtén puntos extra.
                            </p>
                        </div>
                        <FeedbackForm
                            onComplete={() => {
                                onNavigate('home');
                            }}
                            onClose={() => onNavigate('home')}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
