import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    TrendingUp, ArrowUp, ArrowDown, ExternalLink, LogOut,
    CreditCard, MessageSquare, ChevronRight, User, ShieldCheck,
    Bell, AlertCircle, Info, Gift, X
} from 'lucide-react';
import { WalletSession, WalletView } from '@/lib/core/domain/types';
import { TokenBalanceDisplay } from '@/app/components/TokenBalanceDisplay';
import { RewardPoints } from './RewardPoints';
import { TOKEN_DATA, TokenType } from '@/lib/config/tokens';
import { TokenIcon } from '@/app/components/ui/TokenIcon';
import { useTokenPrices } from '@/lib/hooks/useTokenPrices';
import { useTokenBalance } from '@/lib/hooks/useTokenBalance';
import { TransactionHistory } from '@/app/components/TransactionHistory';

import { useWalletUI } from '@/lib/context/WalletUIContext';

interface WalletDashboardProps {
    wallet: WalletSession;
    onNavigate: (view: WalletView) => void;
    onLogout: () => void;
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
    profile
}) => {
    const searchParams = useSearchParams();
    const { openFeedback, openReferral } = useWalletUI();
    const [activeTab, setActiveTab] = useState<'home' | 'assets'>('home');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const { prices } = useTokenPrices(true);

    const [currentMarketingSlide, setCurrentMarketingSlide] = useState(0);

    const marketingSlides = [
        {
            title: '¡TU OPINIÓN VALE!',
            description: 'Danos tu opinión para mejorar y gana puntos extras para recompensas.',
            icon: <Gift size={14} />,
            color: 'text-indigo-400',
            bg: 'from-indigo-600/20 to-purple-600/20'
        },
        {
            title: 'RECOMPENSAS STARK',
            description: 'Completa tu perfil para desbloquear beneficios exclusivos en Starknet.',
            icon: <TrendingUp size={14} />,
            color: 'text-emerald-400',
            bg: 'from-emerald-600/20 to-teal-600/20'
        },
        {
            title: 'SEGURIDAD TOTAL',
            description: 'Asegura tu frase de recuperación y gana un badge de seguridad.',
            icon: <ShieldCheck size={14} />,
            color: 'text-amber-400',
            bg: 'from-amber-600/20 to-orange-600/20'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMarketingSlide((prev) => (prev + 1) % marketingSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const [isDeployed, setIsDeployed] = useState(true);
    const [checkDeployment, setCheckDeployment] = useState(false); // No need to check if we default to true

    // Readiness status is managed by the ChipiPay orchestration layer.
    // In Reflecter, a linked wallet is considered a ready-to-use wallet.

    // Sync active tab with URL if needed
    useEffect(() => {
        const view = searchParams.get('view');
        if (view === 'assets') {
            setActiveTab('assets');
        } else {
            setActiveTab('home');
        }
    }, [searchParams]);

    // Token Data for Total Value and Filtering
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

    const portfolioAssets = (Object.keys(TOKEN_DATA) as TokenType[]).filter(token => {
        const balance = parseFloat(balances[token as keyof typeof balances] || '0');
        return balance > 0;
    });

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-black">
            {/* --- HEADER --- */}
            <div className="shrink-0 p-6 pb-2">
                <div
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="flex items-center justify-between mb-6 cursor-pointer group"
                >
                    <div className="flex items-center gap-3">
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
                                <ChevronRight size={12} className={`text-zinc-500 transition-transform ${isSettingsOpen ? 'rotate-90' : ''}`} />
                            </div>
                            {wallet && wallet.publicKey && (
                                <div className="text-[10px] text-zinc-500 font-mono">
                                    {wallet.publicKey.slice(0, 6)}...{wallet.publicKey.slice(-4)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowNotifications(!showNotifications);
                            }}
                            className="relative w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all capitalize"
                        >
                            {showNotifications ? <X size={18} /> : <Bell size={18} />}
                            {!showNotifications && <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-black"></div>}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- SCROLLABLE CONTENT --- */}
            <div className="flex-1 overflow-y-auto px-6 pb-12 space-y-8 scrollbar-hide relative">

                {/* --- SETTINGS OVERLAY --- */}
                {isSettingsOpen && (
                    <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300 p-6 space-y-6">
                        <div className="space-y-4 relative">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500">Configuración & Perfil</h3>
                                <button
                                    onClick={() => setIsSettingsOpen(false)}
                                    className="p-2 -mr-2 bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[10px] font-black text-white uppercase tracking-wider">Estado de Red</div>
                                        <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Starknet Mainnet Operativa</div>
                                    </div>
                                </div>
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest px-2 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20">Online</span>
                            </div>

                            <button
                                onClick={() => window.open(`https://starkscan.co/contract/${wallet.publicKey}`, '_blank')}
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <ExternalLink size={16} className="text-zinc-400" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-wider">Explorador de Blockchain</span>
                                </div>
                                <ChevronRight size={14} className="text-zinc-600" />
                            </button>

                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                                <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">Información Personal</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={profile?.firstName}
                                        onChange={(e) => profile?.update({ ...profile, firstName: e.target.value })}
                                        className="bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/20 transition-all font-bold"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Apellido"
                                        value={profile?.lastName}
                                        onChange={(e) => profile?.update({ ...profile, lastName: e.target.value })}
                                        className="bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/20 transition-all font-bold"
                                    />
                                </div>
                            </div>

                            {/* Rewards Section (Moved here) */}
                            <div className="pt-4 border-t border-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 px-1">Tus Recompensas</h3>
                                <RewardPoints onReferral={openReferral} />
                            </div>

                            <button
                                onClick={onLogout}
                                className="w-full p-4 border border-red-500/30 bg-red-500/5 rounded-2xl flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10 transition-all group"
                            >
                                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Cerrar Sesión</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* --- NOTIFICATIONS POPUP --- */}
                {showNotifications && (
                    <div className="absolute inset-x-0 top-0 z-40 animate-in slide-in-from-top-4 duration-300">
                        <div className="bg-zinc-900 border border-white/10 rounded-[2rem] p-6 shadow-2xl space-y-4 mx-2">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Notificaciones</h4>
                                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Despliegue de Wallet</p>
                                </div>
                                <button onClick={() => setShowNotifications(false)} className="p-2 bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors">
                                    <ChevronRight size={14} className="rotate-90" />
                                </button>
                            </div>

                            <div className="space-y-4 pt-2">
                                {/* Step 1: Keys - Fixed since user is logged in */}
                                <div className="flex items-center gap-4 opacity-100">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black text-white uppercase tracking-wider">Generando claves de seguridad</div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Completado</span>
                                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest text-right">Determinístico</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 2: Contract Creation - Dynamic based on wallet object */}
                                <div className="flex items-center gap-4 opacity-100">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black text-white uppercase tracking-wider">Billetera Vinculada (ChipiPay)</div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Completado</span>
                                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest text-right">Confirmado</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3: Deployment - DEFAULT TO COMPLETED */}
                                <div className="flex items-center gap-4 opacity-100">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black text-white uppercase tracking-wider">Desplegando en Starknet Mainnet</div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Completado</span>
                                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest text-right">Instante</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 4: Ready */}
                                <div className="flex items-center gap-4 opacity-100">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black text-white uppercase tracking-wider">¡Wallet lista para usar!</div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Completado</span>
                                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest text-right">Sistema OK</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- MAIN VIEWS --- */}
                {activeTab === 'home' ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

                        {/* 1. Total Balance Card */}
                        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-black border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-white/10 transition-all duration-700"></div>

                            <div className="relative z-10 text-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 block mb-3">Balance Estimado</span>
                                <div className="flex items-center justify-center gap-1.5 mb-8">
                                    <span className="text-3xl font-black text-zinc-500 tracking-tighter">$</span>
                                    <span className="text-5xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                        {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => onNavigate('send')}
                                        className="group/btn flex items-center justify-center gap-2 py-4 px-6 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5"
                                    >
                                        <ArrowUp size={14} className="group-hover/btn:-translate-y-1 transition-transform" />
                                        Enviar
                                    </button>
                                    <button
                                        onClick={() => onNavigate('receive')}
                                        className="group/btn flex items-center justify-center gap-2 py-4 px-6 bg-zinc-900 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-all active:scale-95"
                                    >
                                        <ArrowDown size={14} className="group-hover/btn:translate-y-1 transition-transform" />
                                        Recibir
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 2. Marketing Carousel Section */}
                        <div
                            className={`p-6 bg-gradient-to-br ${marketingSlides[currentMarketingSlide].bg} border border-white/10 rounded-3xl flex items-center justify-between gap-4 group cursor-pointer shadow-xl shadow-indigo-500/5 transition-all duration-700`}
                            onClick={openFeedback}
                        >
                            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className={`flex items-center gap-2 mb-1 ${marketingSlides[currentMarketingSlide].color}`}>
                                    {marketingSlides[currentMarketingSlide].icon}
                                    <h4 className="text-[10px] font-black uppercase tracking-widest">{marketingSlides[currentMarketingSlide].title}</h4>
                                </div>
                                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">{marketingSlides[currentMarketingSlide].description}</p>
                            </div>
                            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-black transition-all">
                                <ChevronRight size={16} />
                            </div>
                        </div>

                        {/* 3. Portfolio Card (Assets with Balance) */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 pl-2">Portafolio</h3>
                            <div className="space-y-2">
                                {portfolioAssets.length > 0 ? (
                                    portfolioAssets.map(token => (
                                        <div key={token} className="p-4 bg-zinc-950/50 border border-white/5 rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <TokenIcon
                                                    src={TOKEN_DATA[token].icon}
                                                    alt={token}
                                                    fallback={TOKEN_DATA[token].fallback}
                                                    size="w-8 h-8"
                                                />
                                                <div className="text-left font-black uppercase">
                                                    <div className="text-[10px] text-white tracking-widest">{token}</div>
                                                    <div className="text-[8px] text-zinc-600 tracking-wider font-bold">{TOKEN_DATA[token].name}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-black text-white tabular-nums">
                                                    <TokenBalanceDisplay token={token} walletPublicKey={wallet.publicKey} />
                                                </div>
                                                <div className="text-[8px] font-black text-zinc-500 tabular-nums uppercase">
                                                    ${(parseFloat(balances[token as keyof typeof balances]) * (prices?.[token] || (token === 'USDC' ? 1 : 0))).toFixed(2)} USD
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Sin activos aún</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 4. Recent Activity */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Actividad Reciente</h3>
                                <button className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Ver Todo</button>
                            </div>
                            <TransactionHistory walletAddress={wallet.publicKey} network="MAINNET" />
                        </div>
                    </div>
                ) : (
                    /* --- CRYPTO VIEW (ActiveTab === 'assets') --- */
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Activos en Starknet</h3>
                            <button className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Actualizar</button>
                        </div>

                        <div className="space-y-3">
                            {(Object.keys(TOKEN_DATA) as TokenType[]).map((token) => (
                                <button
                                    key={token}
                                    onClick={() => onNavigate('send')}
                                    className="w-full p-5 bg-zinc-950/30 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all rounded-3xl flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-black p-3 border border-white/5 group-hover:border-white/20 transition-all">
                                            <TokenIcon
                                                src={TOKEN_DATA[token].icon}
                                                alt={token}
                                                fallback={TOKEN_DATA[token].fallback}
                                                size="w-full h-full"
                                            />
                                        </div>
                                        <div className="text-left font-black uppercase">
                                            <div className="text-sm text-white tracking-widest mb-0.5">{token}</div>
                                            <div className="text-[9px] text-zinc-500 tracking-[0.2em] font-bold">{TOKEN_DATA[token].name}</div>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <div className="text-sm font-black text-white tabular-nums tracking-tight">
                                            <TokenBalanceDisplay token={token} walletPublicKey={wallet?.publicKey} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                ${prices?.[token] ? prices[token].toLocaleString() : '---'}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="p-8 text-center">
                            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest leading-relaxed">
                                Más activos e integraciones <br /> coming soon.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
