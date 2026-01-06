import React, { useState } from 'react';
import { ChevronLeft, Globe, Copy } from 'lucide-react';
import { WalletSession, WalletView } from '@/lib/core/domain/types';
import { formatStarknetAddress } from '@/lib/utils/formatAddress';

interface WalletReceiveProps {
    wallet: WalletSession;
    view: WalletView;
    onNavigate: (view: WalletView) => void;
}

export const WalletReceive: React.FC<WalletReceiveProps> = ({ wallet, view, onNavigate }) => {
    const [isQrLoading, setIsQrLoading] = useState(true);

    if (view === 'receive') {
        return (
            <div className="p-6 animate-in fade-in slide-in-from-right duration-300 h-full flex flex-col">
                <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                >
                    <ChevronLeft size={14} /> Volver al Inicio
                </button>

                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight text-center">Recibir</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold text-center mb-8">Selecciona una opción</p>

                <div className="space-y-4 flex-1 flex flex-col justify-center pb-20">
                    <button
                        onClick={() => onNavigate('receive-starknet' as WalletView)}
                        className="group p-6 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 hover:scale-[1.02] transition-all rounded-2xl flex flex-col items-center gap-4 text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors border border-indigo-500/20">
                            <img src="https://www.starknet.io/assets/starknet-logo.svg" alt="Starknet" className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Desde Starknet</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Recibe tokens desde otra billetera</p>
                        </div>
                    </button>

                    <button
                        onClick={() => onNavigate('receive-bridge' as WalletView)}
                        className="group p-6 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 hover:scale-[1.02] transition-all rounded-2xl flex flex-col items-center gap-4 text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors border border-purple-500/20">
                            <Globe size={32} className="text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Desde Otra Cadena</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">BTC, ETH, SOL y más redes</p>
                        </div>
                    </button>
                </div>
            </div>
        );
    }

    if (view === 'receive-starknet') {
        return (
            <div className="p-6 animate-in fade-in slide-in-from-right duration-300 h-full flex flex-col">
                <button
                    onClick={() => onNavigate('receive')}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                >
                    <ChevronLeft size={14} /> Volver
                </button>

                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight text-center">Recibir</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold text-center mb-8">Solo Starknet Mainnet</p>

                <div className="flex flex-col items-center flex-1">
                    <div className="w-56 h-56 bg-white p-4 mb-8 flex items-center justify-center relative rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                        {isQrLoading && (
                            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-3 z-10 rounded-2xl">
                                <div className="w-10 h-10 border-2 border-zinc-100 border-t-black animate-spin rounded-full"></div>
                                <span className="text-[9px] font-black text-black uppercase tracking-widest animate-pulse">Generando</span>
                            </div>
                        )}
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${formatStarknetAddress(wallet?.publicKey || '0x0')}`}
                            alt="Wallet QR Code"
                            className={`w-48 h-48 transition-opacity duration-300 ${isQrLoading ? 'opacity-0' : 'opacity-100'}`}
                            onLoad={() => setIsQrLoading(false)}
                        />
                    </div>

                    <div className="w-full space-y-4">
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-black mb-3 text-center">Tu Dirección de Depósito</div>
                            <div className="p-4 bg-white/5 border border-white/10 text-[11px] text-white break-all text-center font-mono rounded-lg">
                                {formatStarknetAddress(wallet?.publicKey || '0x0')}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                const addr = formatStarknetAddress(wallet?.publicKey || '0x0');
                                navigator.clipboard.writeText(addr);
                            }}
                            className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-lg"
                        >
                            <Copy size={16} /> Copiar Dirección
                        </button>

                        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center px-4 leading-relaxed">
                            Envía solo activos de STARKNET (ETH, STRK, USDC) a esta dirección. El envío de otros activos puede resultar en una pérdida permanente.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // receive-bridge
    return (
        <div className="p-6 animate-in fade-in slide-in-from-right duration-300 h-full flex flex-col">
            <button
                onClick={() => onNavigate('receive')}
                className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
            >
                <ChevronLeft size={14} /> Volver
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight text-center">Bridge Layerswap</h2>

            <div className="flex-1 bg-white/5 rounded-2xl overflow-hidden border border-white/10 relative">
                <iframe
                    src="https://layerswap.io/app"
                    className="w-full h-full border-0 absolute inset-0"
                    allow="clipboard-write"
                />
            </div>
        </div>
    );
};
