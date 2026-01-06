'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  X, LogOut, CheckCircle2, Gift, QrCode, CreditCard
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import { useNetwork } from '@/lib/hooks/useNetwork';
import { useSessionTimeout } from '@/lib/hooks/useSessionTimeout';

// Hexagonal Architecture Components
import { WalletAuth } from '@/app/features/wallet/components/WalletAuth';
import { WalletDashboard } from '@/app/features/wallet/components/WalletDashboard';
import { WalletSend } from '@/app/features/wallet/components/WalletSend';
import { WalletReceive } from '@/app/features/wallet/components/WalletReceive';
import { WalletNavbar } from '@/app/features/wallet/components/WalletNavbar';
import { FeedbackForm } from '@/app/features/wallet/components/FeedbackForm';

// Core & Config
import { WalletView, AuthView, WalletSession } from '@/lib/core/domain/types';

const SESSION_TIMEOUT_MS = 15 * 60 * 1000;

interface WalletPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isEmbedded?: boolean;
  initialAuthView?: AuthView;
}

const WalletPopup: React.FC<WalletPopupProps> = ({ isOpen, onClose, isEmbedded = false, initialAuthView = 'login' }) => {
  const { user, signOut } = useFirebaseAuth();
  const { wallet, error: walletError } = useFetchWallet();
  // useNetwork is used implicitly or we can display network status via context/props
  const { network } = useNetwork();

  const [authView, setAuthView] = useState<AuthView>(initialAuthView);
  const [walletView, setWalletView] = useState<WalletView>('assets'); // Default to assets/dashboard

  // States lifted for Global Features
  const [sendToAddress, setSendToAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Profile State (Mock for now, should be in domain/service)
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    city: '',
    province: '',
    postalCode: ''
  });

  // Modal States
  const [showQrFeatureModal, setShowQrFeatureModal] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [showCardFeatureModal, setShowCardFeatureModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  useEffect(() => {
    if (walletError && (walletError as any).status === 401) {
      console.error('Chipi Auth Error (401). Check Dashboard JWT config.');
    }
  }, [walletError]);

  const handleLogout = useCallback(() => {
    signOut();
    setWalletView('assets'); // Reset view on logout
  }, [signOut]);

  useSessionTimeout(
    !!user,
    SESSION_TIMEOUT_MS,
    () => {
      console.log('Session timed out');
      handleLogout();
    }
  );

  // QR Scanner Logic
  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    if (isScanning) {
      html5QrCode = new Html5Qrcode("qr-reader");
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
          // Feature: If in Send view, fill address. Else show promo/info.
          if (walletView === 'send') {
            setSendToAddress(decodedText);
          } else {
            setShowQrFeatureModal(true);
          }
          html5QrCode?.stop().catch(console.error);
        },
        (errorMessage) => {
          // ignore scan errors
        }
      ).catch((err) => {
        console.error("Error starting QR scanner", err);
        setIsScanning(false);
      });
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [isScanning, walletView]);

  if (!isOpen) return null;

  return (
    <div className={`
      ${isEmbedded ? 'w-full h-full' : 'fixed inset-0 z-50'}
      bg-black text-white flex flex-col overflow-hidden
      ${!isEmbedded ? 'animate-in fade-in duration-200' : ''}
    `}>
      {/* Header (Only if not in Dashboard which has its own header, or we consolidate) */}
      {!user && (
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black z-20">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-widest uppercase">Reflecter</span>
          </div>
          {!isEmbedded && (
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 overflow-hidden relative">
        {!user ? (
          <WalletAuth
            initialView={authView}
            onViewChange={setAuthView}
          />
        ) : (
          <>
            {(!wallet && !walletError) ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin rounded-full"></div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">Cargando Billetera...</p>
              </div>
            ) : (
              <>
                {/* Views Router */}
                {(walletView === 'home' || walletView === 'assets') && (
                  <WalletDashboard
                    wallet={wallet as WalletSession}
                    onNavigate={setWalletView}
                    onLogout={handleLogout}
                    profile={{ ...profile, update: setProfile } as any}
                  />
                )}

                {walletView === 'send' && (
                  <WalletSend
                    wallet={wallet as WalletSession}
                    onNavigate={setWalletView}
                    sendToAddress={sendToAddress}
                    setSendToAddress={setSendToAddress}
                    onScanRequest={() => setIsScanning(true)}
                    isMobile={true}
                  />
                )}

                {(walletView.startsWith('receive')) && (
                  <WalletReceive
                    wallet={wallet as WalletSession}
                    view={walletView}
                    onNavigate={setWalletView}
                  />
                )}

                {/* Fallback for other views */}
                {(walletView === 'miniapps' || walletView === 'card' || walletView === 'transactions') && (
                  <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="p-4 bg-white/5 rounded-full">
                      <LogOut size={24} className="text-zinc-500" />
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-widest">Próximamente</h3>
                    <p className="text-xs text-zinc-500">Esta función estará disponible en breve.</p>
                    <button onClick={() => setWalletView('assets')} className="text-xs font-bold underline">Volver</button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* --- NAVBAR --- */}
      {user && (
        <WalletNavbar
          currentView={walletView}
          onNavigate={setWalletView}
          onScan={() => setIsScanning(true)}
        />
      )}


      {/* --- MODALS (Global) --- */}

      {/* Feedback Modal */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
          <div className="w-full h-full flex flex-col max-w-md mx-auto relative">
            <button
              onClick={() => setIsFeedbackModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all z-10"
            >
              <X size={20} />
            </button>
            <div className="p-6 h-full">
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowCardFeatureModal(false)}></div>
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowReferralModal(false)}></div>
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
          <div id="qr-reader" className="w-full max-w-sm aspect-square bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)]"></div>
          <p className="mt-8 text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] text-center max-w-[200px]">
            Apunta la cámara al código QR para escanear
          </p>
        </div>
      )}

      {/* QR Feature Modal (Result of scan from Navbar) */}
      {showQrFeatureModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowQrFeatureModal(false)}></div>
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

    </div>
  );
};

export default WalletPopup;
