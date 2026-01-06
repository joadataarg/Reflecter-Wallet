'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Gift, QrCode, CreditCard } from 'lucide-react';
import { FeedbackForm } from '@/app/features/wallet/components/FeedbackForm';

interface WalletUIContextType {
    openFeedback: () => void;
    openCardFeature: () => void;
    openReferral: () => void;
    openScanner: () => void;
    closeAll: () => void;
}

const WalletUIContext = createContext<WalletUIContextType | undefined>(undefined);

export const useWalletUI = () => {
    const context = useContext(WalletUIContext);
    if (!context) {
        throw new Error('useWalletUI must be used within a WalletUIProvider');
    }
    return context;
};

export const WalletUIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();
    const [isScanning, setIsScanning] = useState(false);
    const [showQrFeatureModal, setShowQrFeatureModal] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [showCardFeatureModal, setShowCardFeatureModal] = useState(false);
    const [showReferralModal, setShowReferralModal] = useState(false);

    // Scanner Logic
    useEffect(() => {
        let html5QrCode: Html5Qrcode | null = null;

        if (isScanning) {
            const elementId = "global-qr-reader";

            const timeoutId = setTimeout(() => {
                const element = document.getElementById(elementId);
                if (!element) return;

                html5QrCode = new Html5Qrcode(elementId);
                const config = {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                };

                html5QrCode.start(
                    { facingMode: "environment" },
                    config,
                    (decodedText) => {
                        setIsScanning(false);

                        // Smart routing based on QR content
                        if (decodedText.startsWith('0x') && decodedText.length > 20) {
                            router.push(`/send?address=${decodedText}`);
                        } else {
                            setShowQrFeatureModal(true);
                        }

                        html5QrCode?.stop().catch(console.error);
                    },
                    () => { }
                ).catch((err) => {
                    console.error("Error starting QR scanner", err);
                    setIsScanning(false);
                });
            }, 100);

            return () => clearTimeout(timeoutId);
        }

        return () => {
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch(console.error);
            }
        };
    }, [isScanning, router]);

    const closeAll = () => {
        setIsScanning(false);
        setShowQrFeatureModal(false);
        setIsFeedbackModalOpen(false);
        setShowCardFeatureModal(false);
        setShowReferralModal(false);
    };

    const value = {
        openFeedback: () => setIsFeedbackModalOpen(true),
        openCardFeature: () => setShowCardFeatureModal(true),
        openReferral: () => setShowReferralModal(true),
        openScanner: () => setIsScanning(true),
        closeAll
    };

    return (
        <WalletUIContext.Provider value={value}>
            {children}

            {/* --- MODALS --- */}
            {/* Feedback Modal */}
            {isFeedbackModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md mx-auto relative">
                        <button
                            onClick={() => setIsFeedbackModalOpen(false)}
                            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all z-20"
                        >
                            <X size={20} className="text-white" />
                        </button>
                        <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                            <FeedbackForm
                                onComplete={() => {
                                    setIsFeedbackModalOpen(false);
                                    setShowReferralModal(true);
                                }}
                                onClose={() => setIsFeedbackModalOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Card Feature Modal */}
            {showCardFeatureModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300 bg-black/80 backdrop-blur-sm">
                    <div className="relative bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] max-w-[320px] text-center space-y-6 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white mx-auto relative z-10">
                            <div className="relative">
                                <CreditCard size={32} />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Reflecter Card</h3>
                            <p className="text-[10px] text-zinc-400 uppercase tracking-[0.1em] font-bold leading-relaxed px-2">
                                Pausa tu tarjeta, controla límites y gestiona tus gastos en tiempo real.
                            </p>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                                Próximamente
                            </div>
                        </div>
                        <button onClick={() => setShowCardFeatureModal(false)} className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 relative z-10">
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* Referral Modal */}
            {showReferralModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300 bg-black/80 backdrop-blur-sm">
                    <div className="relative bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] max-w-[320px] text-center space-y-6 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/20 relative z-10">
                            <Gift size={40} />
                        </div>
                        <div className="space-y-4 relative z-10">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Ganar Puntos</h3>
                            <div className="p-4 bg-white/5 rounded-2xl space-y-3 border border-white/5">
                                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest border-b border-white/5 pb-2">
                                    <span className="text-zinc-400">Tú ganas</span>
                                    <span className="text-emerald-400">+10 Pts</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                                    <span className="text-zinc-400">Tu amigo</span>
                                    <span className="text-emerald-400">+5 Pts</span>
                                </div>
                            </div>
                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-relaxed font-bold">
                                Comparte tu enlace único y sube de nivel para obtener mejores recompensas.
                            </p>
                        </div>
                        <button onClick={() => setShowReferralModal(false)} className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 relative z-10">
                            Copiar Enlace
                        </button>
                    </div>
                </div>
            )}

            {/* Global QR Reader Overlay */}
            {isScanning && (
                <div className="fixed inset-0 z-[250] bg-black flex flex-col items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
                    <div className="w-full max-w-sm mb-8 flex justify-between items-center">
                        <h3 className="text-white font-black uppercase tracking-widest">Escanear QR</h3>
                        <button onClick={() => setIsScanning(false)} className="text-zinc-400 hover:text-white p-2">
                            <X size={24} />
                        </button>
                    </div>
                    <div id="global-qr-reader" className="w-full max-w-sm aspect-square bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)]"></div>
                    <p className="mt-8 text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] text-center max-w-[200px]">
                        Apunta la cámara al código QR para escanear
                    </p>
                </div>
            )}

            {/* QR Feature Modal (Result of scan from Navbar) */}
            {showQrFeatureModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300 bg-black/80 backdrop-blur-sm">
                    <div className="relative bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] max-w-[320px] text-center space-y-6 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/20 relative z-10">
                            <QrCode size={40} />
                        </div>
                        <div className="space-y-4 relative z-10">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Pagos por QR</h3>
                            <p className="text-[10px] text-zinc-400 uppercase tracking-[0.1em] font-bold leading-relaxed px-2">
                                Esta función estará disponible próximamente. ¿Quieres ser de los primeros en usarla?
                            </p>
                            <div className="p-4 bg-white/5 rounded-2xl space-y-3 border border-white/5">
                                <div className="flex items-center gap-2 justify-center text-emerald-400">
                                    <Gift size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Activa tu Cashback</span>
                                </div>
                                <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-relaxed font-bold">
                                    Recomienda a un amigo <br /> para crear su billetera fácil <br /> y activa tu cashback en cada pago.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowQrFeatureModal(false)}
                            className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 relative z-10"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </WalletUIContext.Provider>
    );
};

