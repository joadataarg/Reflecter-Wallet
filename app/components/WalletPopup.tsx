'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  LogOut,
  ChevronLeft,
  Database,
  TrendingUp,
  Layers,
  Lock,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Home,
  LayoutGrid,
  CreditCard,
  RefreshCw,
  Bell,
  Plus,
  Pause,
  Circle,
  ShieldCheck,
  ExternalLink,
  Settings,
  QrCode,
  Eye,
  EyeOff,
  Copy,
  Receipt,
  Info,
  Globe,
  MessageSquare,
  Gift,
  CheckCircle2,
  Star,
  Trophy,
  Play,
  Share2
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import { useNetwork } from '@/lib/hooks/useNetwork';
import { useCreateWallet } from '@chipi-stack/nextjs';
import { auth } from '@/lib/firebase/config';
import { deriveEncryptKey } from '@/lib/utils/deriveEncryptKey';
import NetworkSelector from '@/app/components/NetworkSelector';
import { TokenBalanceDisplay } from '@/app/components/TokenBalanceDisplay';
import { useTokenPrices } from '@/lib/hooks/useTokenPrices';
import { useTokenBalance } from '@/lib/hooks/useTokenBalance';
import { useSendAssets } from '@/lib/hooks/useSendAssets';
import { formatStarknetAddress } from '@/lib/utils/formatAddress';

type AuthView = 'login' | 'register';
type WalletView = 'home' | 'assets' | 'send' | 'receive' | 'settings' | 'transactions' | 'miniapps' | 'card';

// Token Icon Component with fallback
const TokenIcon: React.FC<{ src: string; alt: string; fallback: string; size?: string }> = ({ src, alt, fallback, size = 'w-6 h-6' }) => {
  const [imgError, setImgError] = React.useState(false);

  if (imgError) {
    return <span className="text-white font-bold text-sm">{fallback}</span>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={size}
      onError={() => setImgError(true)}
    />
  );
};

export type WalletSession = {
  publicKey: string;
  walletId: string;
  encryptKey: string;
};

interface WalletPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isEmbedded?: boolean;
  initialAuthView?: AuthView;
}

// Feedback Form Component
const FeedbackForm: React.FC<{ onComplete: () => void; onClose: () => void }> = ({ onComplete, onClose }) => {
  const [step, setStep] = useState(1);
  const [score, setScore] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [qrRating, setQrRating] = useState<number | null>(null);
  const [helpsSave, setHelpsSave] = useState<string | null>(null);
  const [mainUsage, setMainUsage] = useState<string | null>(null);

  const handleNext = () => setStep(prev => prev + 1);

  return (
    <div className="flex-1 flex flex-col pt-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className={`w-8 h-1 rounded-full transition-all ${s <= step ? 'bg-blue-500' : 'bg-white/10'}`} />
          ))}
        </div>
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{step}/5</span>
      </div>

      <div className="flex-1 space-y-6">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">¿Qué tan probable es que recomiendes Reflecter Wallet a un amigo?</h3>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <button
                  key={n}
                  onClick={() => setScore(n)}
                  className={`py-3 rounded-xl border font-black transition-all ${score === n ? 'bg-white border-white text-black scale-105 shadow-lg' : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/30'}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              disabled={score === null}
              onClick={handleNext}
              className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50 transition-all shadow-xl shadow-blue-600/20"
            >
              Siguiente
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">
              {score! <= 6 ? '¿Qué es lo principal que no te gustó o te frustró?' : '¿Qué es lo que más te gustó?'}
            </h3>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs min-h-[120px] focus:border-blue-500 focus:outline-none transition-all"
            />
            <button
              onClick={handleNext}
              className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-blue-600/20"
            >
              Siguiente
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">¿Has usado el pago por QR? ¿Qué tan fácil fue?</h3>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setQrRating(n)}
                  className="transition-all hover:scale-110"
                >
                  <Star
                    size={32}
                    className={qrRating && n <= qrRating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'}
                  />
                </button>
              ))}
            </div>
            <button
              disabled={qrRating === null}
              onClick={handleNext}
              className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">¿Reflecter Wallet te ayuda a ahorrar o ganar dinero de forma única?</h3>
            <div className="space-y-3">
              {['Sí', 'No', 'Tal vez'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setHelpsSave(opt)}
                  className={`w-full p-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${helpsSave === opt ? 'bg-white border-white text-black' : 'bg-white/5 border-white/10 text-white'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              disabled={helpsSave === null}
              onClick={handleNext}
              className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">¿Cuál es tu principal uso de la wallet?</h3>
            <div className="space-y-3">
              {['Pagos diarios', 'Cashback', 'Referidos', 'Ahorro'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setMainUsage(opt)}
                  className={`w-full p-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${mainUsage === opt ? 'bg-white border-white text-black' : 'bg-white/5 border-white/10 text-white'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              disabled={mainUsage === null}
              onClick={onComplete}
              className="w-full py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50 transition-all shadow-xl shadow-emerald-600/20"
            >
              Finalizar y Ganar Puntos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const WalletPopup: React.FC<WalletPopupProps> = ({ isOpen, onClose, isEmbedded = false, initialAuthView = 'login' }) => {
  const { user, signIn, signUp, signOut, getToken } = useFirebaseAuth();
  const { wallet, error: walletError, isLoading: isWalletLoading, refetch: refetchWallet } = useFetchWallet();
  const { network, toggleNetwork } = useNetwork();
  const { createWalletAsync } = useCreateWallet();

  const [authView, setAuthView] = useState<AuthView>(initialAuthView);
  const [walletView, setWalletView] = useState<WalletView>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [walletSession, setWalletSession] = useState<WalletSession | null>(null);
  const [selectedToken, setSelectedToken] = useState<'ETH' | 'STRK' | 'USDC'>('ETH');

  // Update authView when opening the popup if initialAuthView is provided
  useEffect(() => {
    if (isOpen && initialAuthView) {
      setAuthView(initialAuthView);
    }
  }, [isOpen, initialAuthView]);

  const [activeDashboardTab, setActiveDashboardTab] = useState<'assets' | 'transactions'>('assets');
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
  const [isValueVisible, setIsValueVisible] = useState(true);
  const [sendAmount, setSendAmount] = useState('');
  const [sendPercent, setSendPercent] = useState(0);
  const [sendToAddress, setSendToAddress] = useState('');
  const [sendAddressError, setSendAddressError] = useState('');
  const [sendAmountError, setSendAmountError] = useState('');

  // Profile states
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    city: '',
    province: '',
    postalCode: ''
  });

  const [cryptoTab, setCryptoTab] = useState<'assets' | 'portfolio'>('assets');
  const [isRequestingCard, setIsRequestingCard] = useState(false);
  const [cardRequestStep, setCardRequestStep] = useState(0);

  const [isQrLoading, setIsQrLoading] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showQrFeatureModal, setShowQrFeatureModal] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [hasCompletedFeedback, setHasCompletedFeedback] = useState(false);
  const [showCardFeatureModal, setShowCardFeatureModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  // Mock deployment notifications
  const deploymentNotifications = [
    { id: 1, title: 'Generando claves de seguridad', status: 'completed', time: 'Ahora' },
    { id: 2, title: 'Creando contrato inteligente', status: 'completed', time: 'Hace 1 min' },
    { id: 3, title: 'Desplegando en Starknet Mainnet', status: 'completed', time: 'Hace 2 min' },
    { id: 4, title: '¡Wallet lista para usar!', status: 'completed', time: 'Hace 3 min' }
  ];

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

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
          setShowQrFeatureModal(true);
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
  }, [isScanning]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setSendToAddress(text);
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  // Real-time Data: Prices and Balances
  const { prices } = useTokenPrices();
  const { balance: ethBalance } = useTokenBalance('ETH');
  const { balance: strkBalance } = useTokenBalance('STRK');
  const { balance: usdcBalance } = useTokenBalance('USDC');

  // Send Assets Hook
  const sendAssetsHook = useSendAssets(selectedToken);

  // Totals Calculation
  const ethValue = parseFloat(ethBalance || '0') * prices.ETH;
  const strkValue = parseFloat(strkBalance || '0') * prices.STRK;
  const usdcValue = parseFloat(usdcBalance || '0') * (prices.USDC || 1);
  const totalValue = ethValue + strkValue + usdcValue;

  // Token data
  const tokenData = {
    ETH: { name: 'ETHEREUM', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', fallback: 'Ξ' },
    STRK: { name: 'STARKNET', icon: 'https://www.starknet.io/assets/starknet-logo.svg', fallback: 'S' },
    USDC: { name: 'USD COIN', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', fallback: '$' }
  };

  // Redirect to login or show warning if we get 401 errors consistently
  useEffect(() => {
    if (walletError && (walletError as any).status === 401) {
      console.error('Chipi Auth Error (401): Please check your Dashboard JWT validation rules. Ensure "aud" is set to "reflecter-wallet" and "iss" matches your Firebase project.');
    }
  }, [walletError]);
  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (authView === 'login') {
        await signIn(email, password);
      } else {
        // Validation: Passwords must match
        if (password !== confirmPassword) {
          setError('Las contraseñas no coinciden');
          setIsLoading(false);
          return;
        }

        // 1. Firebase Sign Up
        const firebaseUser = await signUp(email, password);
        if (!firebaseUser) throw new Error('Error al crear el usuario en Firebase.');

        // 2. Get User Token
        const bearerToken = await firebaseUser.getIdToken();
        if (!bearerToken) throw new Error('No se pudo obtener el token de autenticación.');

        // 3. User UID
        const userUid = firebaseUser.uid;

        // 4. Derive Encryption Key
        const encryptKey = await deriveEncryptKey(userUid);

        // 5. Create Wallet with ChipiPay (This also deploys it on Starknet)
        const response = await createWalletAsync({
          params: {
            encryptKey,
            externalUserId: userUid,
          },
          bearerToken,
        });

        console.log('Wallet created and deployed:', response.txHash);
      }
    } catch (err: any) {
      console.error('Registration/Wallet Error:', err);
      if (err.status === 401) {
        setError('Error de autorización: Verifica la configuración de JWT en el dashboard de Chipi.');
      } else {
        setError(err.message || 'Error en la autenticación o creación de billetera');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setWalletSession(null);
    setWalletView('assets');
    onClose();
  };

  const handleSessionChange = (session: WalletSession | null) => {
    setWalletSession(session);
  };

  const handleInitSend = () => {
    setSendAmount('');
    setSendPercent(0);
    setSendToAddress('');
    setSendAddressError('');
    setSendAmountError('');
    setWalletView('send');
  };

  const handleConfirmSend = async () => {
    // Reset errors
    setSendAddressError('');
    setSendAmountError('');

    // Validate amount
    const amountValidation = sendAssetsHook.validateAmount(sendAmount);
    if (!amountValidation.isValid) {
      setSendAmountError(amountValidation.error || 'Invalid amount');
      return;
    }

    // Validate address
    const addressValidation = sendAssetsHook.validateAddress(sendToAddress);
    if (!addressValidation.isValid) {
      setSendAddressError(addressValidation.error || 'Invalid address');
      return;
    }

    // Send transaction
    const result = await sendAssetsHook.sendTransaction(sendToAddress, sendAmount);

    if (result.success) {
      // Reset form and show success
      setSendAmount('');
      setSendPercent(0);
      setSendToAddress('');
      // In a real app, show toast notification
      console.log('Transaction sent:', result.txHash);
      // Return to assets view after short delay
      setTimeout(() => {
        setWalletView('assets');
      }, 2000);
    } else {
      setSendAmountError(result.error || 'Transaction failed');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Overlays - only in modal mode */}
      {!isEmbedded && (
        <div
          className={`fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          onClick={onClose}
        />
      )}

      {/* Modal / Embedded Container */}
      <div
        className={`${isEmbedded
          ? 'relative w-full h-full border-none shadow-none'
          : 'fixed bottom-0 md:top-1/2 left-0 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[110] w-full md:max-w-[380px] h-[85vh] md:h-[600px] border-t md:border border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.1)] transition-all duration-500 rounded-t-[2rem] md:rounded-none'
          } bg-black flex flex-col ${!isEmbedded && (isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full md:translate-y-0 md:scale-95 opacity-0 pointer-events-none')
          }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs">RW</div>
            {user ? (
              <button
                onClick={() => setWalletView('settings')}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors truncate max-w-[150px]"
              >
                {user.email}
              </button>
            ) : (
              <span className="text-xs font-bold uppercase tracking-widest text-white">
                Reflecter Wallet
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!isEmbedded && (
              <button
                onClick={onClose}
                className="p-2 text-zinc-300 hover:text-white transition-colors"
                title="Cerrar"
              >
                <X size={18} />
              </button>
            )}
            {user && (
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="p-2 text-zinc-300 hover:text-white transition-colors relative"
                title="Notificaciones"
              >
                <Bell size={18} />
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full border border-black shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
              </button>
            )}
          </div>
        </div>

        {/* Notifications Panel Overlay */}
        {isNotificationsOpen && (
          <div className="absolute inset-0 z-[120] bg-black animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-950 shrink-0">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Notificaciones</h3>
              <button onClick={() => setIsNotificationsOpen(false)} className="p-2 text-zinc-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 mb-2">Despliegue de Wallet</h4>
              {deploymentNotifications.map((notif) => (
                <div key={notif.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-start gap-3">
                  <div className="mt-0.5">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white mb-1">{notif.title}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Completado</span>
                      <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest">{notif.time}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-6">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 mb-2">Historial</h4>
                <div className="p-8 text-center bg-white/5 border border-white/5 border-dashed rounded-xl">
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">No tienes otras notificaciones en este momento.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-black custom-scrollbar">
          {!user ? (
            /* AUTH VIEW */
            <div className="p-8 flex flex-col animate-in fade-in duration-500">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center mb-6 text-zinc-300">
                  {authView === 'register' ? <Sparkles size={32} /> : <Lock size={32} />}
                </div>
                <h3 className="text-xl font-bold mb-2 uppercase tracking-tight text-white">
                  {authView === 'login' ? 'Bienvenido de nuevo' : 'Crear Billetera'}
                </h3>
                <p className="text-sm text-zinc-300 font-light">
                  {authView === 'login' ? 'Accede a tus activos en Starknet' : 'Crea tu billetera Starknet sin frases semilla'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-950/20 border border-red-500/50 text-red-500 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleAuthAction} className="space-y-4 flex-1">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold ml-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-zinc-950 border border-white/10 p-4 text-sm focus:border-white focus:outline-none transition-colors placeholder:text-zinc-400 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold ml-1">Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contraseña"
                      className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-white focus:outline-none transition-colors placeholder:text-zinc-600 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {authView === 'register' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold ml-1">Confirmar Contraseña</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmar Contraseña"
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-white focus:outline-none transition-colors placeholder:text-zinc-600 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 bg-white text-black hover:bg-zinc-200"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
                  ) : (
                    authView === 'login' ? 'Iniciar Sesión' : 'Crear Billetera'
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                {authView === 'login' ? (
                  <p className="text-xs text-zinc-300 font-light">
                    ¿Nuevo en Reflecter Wallet?{' '}
                    <button onClick={() => setAuthView('register')} className="text-white font-bold hover:underline">
                      Crea tu Billetera
                    </button>
                  </p>
                ) : (
                  <button
                    onClick={() => setAuthView('login')}
                    className="flex items-center justify-center gap-2 text-xs text-zinc-300 hover:text-white transition-colors mx-auto"
                  >
                    <ChevronLeft size={14} /> Volver a Iniciar Sesión
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* AUTHENTICATED VIEW - Diseño del Prototipo */
            <>
              {walletView === 'assets' && (
                <div className="flex flex-col h-full animate-in fade-in duration-500">
                  <div className="px-6 pt-6 pb-2">
                    <div className="flex bg-white/5 p-1 rounded-xl mb-6">
                      <button
                        onClick={() => setCryptoTab('assets')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${cryptoTab === 'assets' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-zinc-500 hover:text-white'}`}
                      >
                        Activos
                      </button>
                      <button
                        onClick={() => setCryptoTab('portfolio')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${cryptoTab === 'portfolio' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-zinc-500 hover:text-white'}`}
                      >
                        Portafolio
                      </button>
                    </div>

                    {cryptoTab === 'assets' ? (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1 mb-4">Activos Disponibles</h4>
                        {/* ETH Asset */}
                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/10">
                              <TokenIcon src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" fallback="Ξ" size="w-6 h-6" />
                            </div>
                            <div>
                              <div className="text-sm font-black text-white uppercase tracking-tight">Ethereum</div>
                              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{ethBalance} ETH</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-black text-white">${ethValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">${prices.ETH.toLocaleString()}</div>
                          </div>
                        </div>
                        {/* STRK Asset */}
                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl flex items-center justify-center text-purple-400 border border-purple-500/10">
                              <TokenIcon src="https://cryptologos.cc/logos/starknet-strk-logo.png" alt="STRK" fallback="S" size="w-6 h-6" />
                            </div>
                            <div>
                              <div className="text-sm font-black text-white uppercase tracking-tight">Starknet</div>
                              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{strkBalance} STRK</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-black text-white">${strkValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">${prices.STRK.toLocaleString()}</div>
                          </div>
                        </div>
                        {/* USDC Asset */}
                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-500/10 to-teal-600/10 rounded-xl flex items-center justify-center text-teal-400 border border-teal-500/10">
                              <TokenIcon src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" alt="USDC" fallback="$" size="w-6 h-6" />
                            </div>
                            <div>
                              <div className="text-sm font-black text-white uppercase tracking-tight">USD Coin</div>
                              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{usdcBalance} USDC</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-black text-white">${usdcValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Stablecoin</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="animate-in slide-in-from-right duration-300">
                        <div className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl mb-6">
                          <h4 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black mb-4">Portafolio Total</h4>
                          <div className="text-4xl font-black text-white tracking-tighter mb-2">
                            ${isValueVisible ? totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '••••••'}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Actualizado En Vivo</span>
                          </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                          <TrendingUp size={24} className="mx-auto text-zinc-700 mb-3" />
                          <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Análisis de Rendimiento</h5>
                          <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-relaxed">Analíticas detalladas próximamente en la siguiente actualización.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}



              {walletView === 'settings' && (
                <div className="p-6">
                  <button
                    onClick={() => setWalletView('home')}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                  >
                    <ChevronLeft size={14} /> Volver al Inicio
                  </button>

                  <div className="space-y-6">
                    {/* Network Section - Simplified for Mainnet only */}
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-white mb-4">Red</h3>
                      <div className="p-4 bg-green-400/5 border border-green-400/20 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe size={16} className="text-green-400" />
                          <div>
                            <div className="text-xs font-bold text-white uppercase tracking-widest">Starknet Mainnet</div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Red de Producción</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Activa</span>
                        </div>
                      </div>
                    </div>

                    {/* System Health Section */}
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-white mb-4">Estado del Sistema</h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span className="text-xs font-bold text-white uppercase tracking-wider">Sesión Auth</span>
                            </div>
                            <span className="text-xs text-emerald-500">✓ Conectado</span>
                          </div>
                          <div className="text-[10px] text-zinc-400 truncate">{user?.email}</div>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${wallet ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                              <span className="text-xs font-bold text-white uppercase tracking-wider">Estado de Wallet</span>
                            </div>
                            <span className={`text-xs ${wallet ? 'text-emerald-500' : 'text-amber-500'}`}>
                              {wallet ? '✓ Activada' : '○ Inactiva'}
                            </span>
                          </div>
                          {wallet && (
                            <div className="text-[10px] text-zinc-400 font-mono truncate">
                              {wallet.publicKey.slice(0, 24)}...
                            </div>
                          )}
                        </div>

                        <div className="p-4 bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span className="text-xs font-bold text-white uppercase tracking-wider">Infraestructura</span>
                            </div>
                            <span className="text-xs text-emerald-500">✓ En Línea</span>
                          </div>
                          <div className="text-[10px] text-zinc-400">Gateway Starknet Mainnet Listo</div>
                        </div>
                      </div>
                    </div>

                    {/* Explorer Section */}
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-white mb-4">Explorador</h3>
                      <button
                        onClick={() => {
                          if (wallet?.publicKey) {
                            window.open(`https://starkscan.co/contract/${wallet.publicKey}`, '_blank');
                          }
                        }}
                        disabled={!wallet?.publicKey}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 transition-all text-white text-xs uppercase tracking-widest font-bold"
                      >
                        <ExternalLink size={14} />
                        Ver Actividad en Starkscan
                      </button>
                    </div>

                    {/* Profile Section */}
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-white mb-4">Perfil</h3>
                      <div className="p-4 bg-white/5 border border-white/10 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Nombre</label>
                            <input
                              type="text"
                              value={profile.firstName}
                              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                              placeholder="Nombre"
                              className="w-full bg-black/40 border border-white/10 p-2 text-xs focus:border-white focus:outline-none text-white transition-colors"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Apellido</label>
                            <input
                              type="text"
                              value={profile.lastName}
                              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                              placeholder="Apellido"
                              className="w-full bg-black/40 border border-white/10 p-2 text-xs focus:border-white focus:outline-none text-white transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terminate Session */}
                    <button
                      onClick={handleLogout}
                      className="w-full p-4 bg-red-950/20 border border-red-500/30 text-red-500 text-xs uppercase tracking-widest hover:bg-red-950/30 transition-all flex items-center justify-center gap-2 font-bold"
                    >
                      <LogOut size={14} /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}

              {walletView === 'send' && (
                <div className="p-6 animate-in fade-in slide-in-from-right duration-300">
                  <button
                    onClick={() => setWalletView('home')}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                  >
                    <ChevronLeft size={14} /> Volver al Inicio
                  </button>

                  <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Enviar Activos</h2>

                  <div className="space-y-4">
                    <div className="relative">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold mb-2 block">Token</label>

                      {/* Dropdown Button */}
                      <button
                        onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
                        className="w-full p-4 bg-white/5 border border-white/10 text-white text-sm hover:border-white transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 flex items-center justify-center">
                            <TokenIcon
                              src={tokenData[selectedToken].icon}
                              alt={selectedToken}
                              fallback={tokenData[selectedToken].fallback}
                              size="w-6 h-6"
                            />
                          </div>
                          <span className="font-bold">{selectedToken}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
                            SALDO: <TokenBalanceDisplay token={selectedToken} walletPublicKey={wallet?.publicKey} />
                          </span>
                          <ChevronLeft size={16} className={`transition-transform ${isTokenDropdownOpen ? '-rotate-90' : 'rotate-90'}`} />
                        </div>
                      </button>

                      {/* Dropdown Menu */}
                      {isTokenDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/10 z-50 shadow-2xl">
                          {(['ETH', 'STRK', 'USDC'] as const).map((token) => (
                            <button
                              key={token}
                              onClick={() => {
                                setSelectedToken(token);
                                setIsTokenDropdownOpen(false);
                              }}
                              className="w-full p-4 hover:bg-white/5 transition-colors flex items-center justify-between border-b border-white/5 last:border-b-0"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 flex items-center justify-center">
                                  <TokenIcon
                                    src={tokenData[token].icon}
                                    alt={token}
                                    fallback={tokenData[token].fallback}
                                    size="w-6 h-6"
                                  />
                                </div>
                                <div className="text-left">
                                  <div className="text-sm font-bold text-white">{token}</div>
                                  <div className="text-xs text-zinc-500">{tokenData[token].name}</div>
                                </div>
                              </div>
                              <span className="text-sm text-zinc-400">
                                <TokenBalanceDisplay token={token} walletPublicKey={wallet?.publicKey} />
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold mb-2 block">Dirección de Destino</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={sendToAddress}
                          onChange={(e) => {
                            setSendToAddress(e.target.value);
                            setSendAddressError('');
                          }}
                          placeholder="0x..."
                          className={`w-full bg-white/5 border p-4 text-sm focus:outline-none transition-colors placeholder:text-zinc-500 text-white pr-12 ${sendAddressError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-white'
                            }`}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          {isMobile ? (
                            <button
                              onClick={() => setIsScanning(true)}
                              className="p-2 text-zinc-400 hover:text-white transition-colors"
                              title="Scan QR"
                            >
                              <QrCode size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={handlePaste}
                              className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white transition-all shadow-sm"
                            >
                              Paste
                            </button>
                          )}
                        </div>
                      </div>

                      {/* QR Reader Modal/Overlay */}
                      {isScanning && (
                        <div className="fixed inset-0 z-[120] bg-black flex flex-col items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
                          <div className="w-full max-w-sm mb-8 flex justify-between items-center">
                            <h3 className="text-white font-black uppercase tracking-widest">Scan Address</h3>
                            <button onClick={() => setIsScanning(false)} className="text-zinc-400 hover:text-white p-2">
                              <X size={24} />
                            </button>
                          </div>
                          <div id="qr-reader" className="w-full max-w-sm aspect-square bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)]"></div>
                          <p className="mt-8 text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] text-center max-w-[200px]">
                            Center the QR code in the frame to scan
                          </p>
                        </div>
                      )}

                      {sendAddressError && (
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-red-500 font-bold uppercase tracking-widest">
                          <Info size={12} />
                          {sendAddressError}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold">Amount</label>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                          Available: <TokenBalanceDisplay token={selectedToken} walletPublicKey={wallet?.publicKey} /> {selectedToken}
                        </span>
                      </div>
                      <div className="relative mb-4">
                        <input
                          type="text"
                          value={sendAmount}
                          onChange={(e) => {
                            setSendAmount(e.target.value);
                            setSendAmountError('');
                          }}
                          placeholder="0.00"
                          className={`w-full bg-white/5 border p-4 text-sm focus:outline-none transition-colors placeholder:text-zinc-500 text-white ${sendAmountError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-white'
                            }`}
                        />
                        <button
                          onClick={() => {
                            const balance = selectedToken === 'ETH' ? ethBalance : selectedToken === 'STRK' ? strkBalance : usdcBalance;
                            const balanceNum = parseFloat(balance || '0');
                            const estimatedFee = sendAssetsHook.estimatedGasPrice;
                            const maxAmount = Math.max(0, balanceNum - estimatedFee);
                            setSendAmount(maxAmount.toFixed(selectedToken === 'USDC' ? 6 : 18).replace(/\.?0+$/, ''));
                            setSendPercent(100);
                            setSendAmountError('');
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-zinc-300 transition-colors"
                        >
                          Max
                        </button>
                      </div>

                      {/* Percentage Slider */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">
                          <span>0%</span>
                          <span>25%</span>
                          <span>50%</span>
                          <span>75%</span>
                          <span className="text-zinc-400">100%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={sendPercent}
                          onChange={(e) => {
                            const percent = parseInt(e.target.value);
                            setSendPercent(percent);
                            const balanceStr = selectedToken === 'ETH' ? ethBalance : selectedToken === 'STRK' ? strkBalance : usdcBalance;
                            const balance = parseFloat(balanceStr || '0');
                            const amount = (balance * (percent / 100)).toFixed(selectedToken === 'USDC' ? 6 : 18);
                            setSendAmount(amount.replace(/\.?0+$/, ''));
                            setSendAmountError('');
                          }}
                          className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                      </div>

                      {/* Fee Estimation */}
                      {sendAmount && !sendAmountError && (
                        <div className="bg-white/5 border border-white/10 p-4 space-y-2 mb-6">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Network Fee</span>
                            <span className="text-xs font-bold text-white tracking-widest">
                              ~{sendAssetsHook.calculateEstimatedFee(sendAmount).toFixed(6)} {selectedToken}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">Total Cost</span>
                            <span className="text-xs font-bold text-white tracking-widest">
                              {sendAssetsHook.calculateTotalCost(sendAmount).toFixed(6)} {selectedToken}
                            </span>
                          </div>
                        </div>
                      )}

                      {sendAmountError && (
                        <div className="flex items-center gap-1 mb-4 text-[10px] text-red-500 font-bold uppercase tracking-widest">
                          <Info size={12} />
                          {sendAmountError}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleConfirmSend}
                      disabled={sendAssetsHook.isLoading || !sendAmount || !sendToAddress}
                      className={`w-full py-5 font-black uppercase tracking-[0.3em] text-[10px] transition-all ${sendAssetsHook.isLoading || !sendAmount || !sendToAddress
                        ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5'
                        : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                        }`}
                    >
                      {sendAssetsHook.isLoading ? 'Procesando...' : 'Confirmar Transacción'}
                    </button>
                  </div>
                </div>
              )}

              {walletView === 'receive' && (
                <div className="p-6 animate-in fade-in slide-in-from-right duration-300 h-full flex flex-col">
                  <button
                    onClick={() => setWalletView('home')}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                  >
                    <ChevronLeft size={14} /> Volver al Inicio
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
              )}

              {walletView === 'transactions' && (
                <div className="p-6 animate-in fade-in slide-in-from-right duration-300">
                  <button
                    onClick={() => setWalletView('home')}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                  >
                    <ChevronLeft size={14} /> Volver al Inicio
                  </button>

                  <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Transacciones</h2>

                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-zinc-700">
                      <Receipt size={40} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest">Historial Próximamente</h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed max-w-[220px]">
                        El seguimiento avanzado de transacciones en cadena está en desarrollo para Mainnet.
                      </p>
                    </div>
                    <button
                      onClick={() => setWalletView('home')}
                      className="px-6 py-3 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-colors"
                    >
                      Ir al Inicio
                    </button>
                  </div>
                </div>
              )}

              {walletView === 'home' && (
                <div className="flex flex-col h-full animate-in fade-in duration-500">
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Valor Total</div>
                        <button
                          onClick={() => refetchWallet()}
                          className="p-1 text-zinc-500 hover:text-white transition-colors"
                          title="Actualizar saldos"
                        >
                          <RefreshCw size={12} />
                        </button>
                      </div>
                      <div className="px-2 py-0.5 border border-emerald-500/30 text-emerald-500 bg-emerald-500/5 text-[7px] font-black uppercase tracking-widest rounded-full">
                        <span className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full animate-pulse bg-emerald-500"></div>
                          RED MAINNET
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl font-black text-white tracking-tighter">
                          {isValueVisible ? `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
                        </div>
                        <button
                          onClick={() => setIsValueVisible(!isValueVisible)}
                          className="p-2 text-zinc-500 hover:text-white transition-colors"
                        >
                          {isValueVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          if (wallet?.publicKey) {
                            window.open(`https://starkscan.co/contract/${formatStarknetAddress(wallet.publicKey)}`, '_blank');
                          }
                        }}
                        className="text-[10px] font-black text-zinc-500 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest"
                      >
                        En Vivo <ExternalLink size={10} />
                      </button>
                    </div>
                  </div>

                  {/* Primary Grid Actions */}
                  <div className="grid grid-cols-2 gap-3 p-4">
                    <button
                      onClick={handleInitSend}
                      className="p-4 bg-white/5 border border-white/10 flex flex-col items-center gap-3 hover:bg-white/10 transition-all group rounded-xl"
                    >
                      <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform border border-blue-500/10">
                        <ArrowUp size={20} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Enviar</span>
                    </button>
                    <button
                      onClick={() => setWalletView('receive')}
                      className="p-4 bg-white/5 border border-white/10 flex flex-col items-center gap-3 hover:bg-white/10 transition-all group rounded-xl"
                    >
                      <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform border border-purple-500/10">
                        <ArrowDown size={20} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Recibir</span>
                    </button>
                  </div>

                  {/* Marketing / Feedback Section */}
                  <div className="px-4 mb-4">
                    <div className="p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl relative overflow-hidden group hover:border-white/30 transition-all">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MessageSquare size={48} />
                      </div>
                      <div className="relative z-10 grid grid-cols-2 gap-4 items-center">
                        {/* Left Column: Title & Subtitle */}
                        <div>
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Tu opinión importa</h4>
                          <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest leading-relaxed">
                            Ayúdanos a mejorar. Danos tu feedback y obtén beneficios exclusivos.
                          </p>
                        </div>

                        {/* Right Column: Button */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => setIsFeedbackModalOpen(true)}
                            className="px-4 py-2 bg-white text-black text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-all shadow-lg flex items-center gap-2"
                          >
                            <MessageSquare size={12} /> Comenzar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Crypto Summary Div */}
                  <div className="px-4 mb-6">
                    <div className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl grid grid-cols-2 gap-4">
                      {/* Left Column: Total Value */}
                      <div className="flex flex-col justify-center border-r border-white/5 pr-4">
                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Mi Portafolio</h4>
                        <span className="text-xl font-black text-white">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>

                      {/* Right Column: Crypto Icons & Navigation */}
                      <div className="flex items-center justify-between pl-4">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-black flex items-center justify-center overflow-hidden">
                            <TokenIcon src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" fallback="Ξ" size="w-5 h-5" />
                          </div>
                          <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-black flex items-center justify-center overflow-hidden">
                            <TokenIcon src="https://www.starknet.io/assets/starknet-logo.svg" alt="STRK" fallback="S" size="w-5 h-5" />
                          </div>
                          <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-black flex items-center justify-center overflow-hidden">
                            <TokenIcon src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" alt="USDC" fallback="$" size="w-5 h-5" />
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setWalletView('assets');
                            setCryptoTab('portfolio');
                          }}
                          className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all group"
                        >
                          <ChevronLeft className="rotate-180 text-white group-hover:translate-x-0.5 transition-transform" size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="p-6 pt-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Actividad Reciente</h3>
                      <button
                        onClick={() => setWalletView('transactions')}
                        className="text-[8px] font-black text-blue-500 uppercase tracking-widest hover:underline"
                      >
                        Ver Todo
                      </button>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 flex items-center justify-center py-12 rounded-xl border-dashed">
                      <div className="text-center">
                        <Receipt size={28} className="mx-auto text-zinc-800 mb-3" />
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Sin transacciones aún</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {walletView === 'miniapps' && (
                <div className="p-6 animate-in fade-in duration-500 flex flex-col h-full">
                  <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Mini-Apps</h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-8">Ecosistema de Aplicaciones</p>

                  <div className="flex-1 space-y-4">
                    {[
                      { name: 'Motor de Intercambio', desc: 'Mejores tasas en todo Starknet', icon: <RefreshCw size={18} /> },
                      { name: 'Centro de Préstamos', desc: 'Pide prestado y presta con facilidad', icon: <Database size={18} /> },
                      { name: 'Galería NFT', desc: 'Gestiona tus coleccionables digitales', icon: <LayoutGrid size={18} /> }
                    ].map((app, i) => (
                      <div key={i} className="p-4 bg-white/5 border border-white/10 flex items-center gap-4 opacity-40 grayscale transition-all">
                        <div className="w-10 h-10 bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600">
                          {app.icon}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{app.name}</h4>
                          <p className="text-[9px] text-zinc-600 uppercase tracking-tighter">{app.desc}</p>
                        </div>
                        <div className="ml-auto">
                          <span className="text-[7px] font-black text-zinc-700 border border-white/5 px-1.5 py-0.5 uppercase">Inactiva</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto p-4 bg-zinc-950/50 border border-white/5 rounded-lg">
                    <p className="text-[8px] text-zinc-600 uppercase tracking-widest leading-relaxed text-center font-bold">
                      Entorno de Desarrollo Aislado<br />
                      <span className="text-blue-500/50">Implementación de Puente Pendiente</span>
                    </p>
                  </div>
                </div>
              )}

              {walletView === 'card' && (
                <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
                  {cardRequestStep === 1 ? (
                    <div className="p-6">
                      <button
                        onClick={() => setCardRequestStep(0)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all mb-8"
                      >
                        <ChevronLeft size={16} /> Volver
                      </button>
                      <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-tight">Escoge tu tarjeta</h2>

                      <div className="space-y-6">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-6 group opacity-70">
                          <div className="flex gap-4">
                            <div className="w-20 h-28 bg-gradient-to-br from-blue-500/50 to-purple-600/50 rounded-xl relative overflow-hidden shrink-0 shadow-2xl grayscale-[0.5]">
                              <div className="absolute inset-x-0 bottom-0 p-2 text-white/50 font-bold text-[8px]">RW VIRTUAL</div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-sm font-black text-white uppercase tracking-widest">Tarjeta Virtual</h4>
                              <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-relaxed">Instantánea, prepaga y gratuita. Con cashback en todas tus compras.</p>
                            </div>
                          </div>
                          <button
                            disabled
                            className="w-full py-4 bg-zinc-800 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-xl cursor-not-allowed"
                          >
                            Próximamente
                          </button>
                        </div>

                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-6 group opacity-50">
                          <div className="flex gap-4">
                            <div className="w-20 h-28 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-xl relative overflow-hidden shrink-0 grayscale shadow-2xl">
                              <div className="absolute inset-x-0 bottom-0 p-2 text-zinc-400 font-bold text-[8px]">RW FISICA</div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-sm font-black text-white uppercase tracking-widest">Tarjeta Física</h4>
                              <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-relaxed">Prepaga y gratuita. Recibe cashback en Bitcoin en todas tus compras.</p>
                            </div>
                          </div>
                          <button className="w-full py-4 bg-zinc-800 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-xl cursor-not-allowed">Proximamente</button>
                        </div>
                      </div>
                    </div>
                  ) : cardRequestStep === 2 ? (
                    <div className="p-6 flex flex-col items-center justify-center h-full text-center space-y-6 animate-in zoom-in duration-300">
                      <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-4">
                        <ShieldCheck size={40} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">¡Solicitud Exitosa!</h2>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed max-w-[240px] mx-auto">
                          Tu Reflecter Card Virtual está siendo procesada. Recibirás una notificación en cuanto esté lista para usar.
                        </p>
                      </div>
                      <button
                        onClick={() => setCardRequestStep(0)}
                        className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
                      >
                        Entendido
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="p-6 flex items-center justify-between shrink-0">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Tarjetas</h2>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCardRequestStep(1)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/20 transition-all"
                          >
                            <Plus size={14} /> Pedir
                          </button>
                          <button
                            onClick={() => setWalletView('settings')}
                            className="p-2 bg-white/5 border border-white/10 rounded-full text-white"
                          >
                            <Settings size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="px-6 space-y-4 pb-12">
                        {/* Status Card */}
                        <div className="p-6 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg relative overflow-hidden border border-white/10 shadow-lg">
                                <div className="absolute inset-0 bg-black/20" />
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">Reflecter Card</h4>
                                <div className="text-xs font-mono text-zinc-500 tracking-widest">**** **** **** ****</div>
                                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-zinc-500/10 text-zinc-500 text-[8px] font-black uppercase tracking-widest rounded-full border border-zinc-500/20">
                                  <div className="w-1 h-1 bg-zinc-500 rounded-full" /> Próximamente
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowCardFeatureModal(true)}
                              className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all"
                            >
                              <Play size={18} fill="white" />
                            </button>
                          </div>

                          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Moneda de pago</span>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-lg">
                                <span className="text-[10px] font-black text-white">USDC</span>
                                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                                  <TokenIcon src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" alt="USDC" fallback="$" size="w-2 h-2" />
                                </div>
                              </div>
                              <ChevronLeft className="rotate-180 text-zinc-600" size={12} />
                            </div>
                          </div>
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Cashback Histórico</span>
                              <ChevronLeft className="rotate-180 text-zinc-700" size={10} />
                            </div>
                            <div>
                              <div className="text-sm font-black text-white uppercase tracking-tight">$0.00</div>
                              <div className="text-[8px] text-zinc-600 uppercase font-black tracking-widest">0.00 STRK</div>
                            </div>
                          </div>
                          <div className="p-5 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Análisis de Gastos</span>
                              <ChevronLeft className="rotate-180 text-zinc-700" size={10} />
                            </div>
                            <div>
                              <div className="text-sm font-black text-white uppercase tracking-tight">$0.00</div>
                              <div className="text-[8px] text-zinc-600 uppercase font-black tracking-widest">Enero 2024</div>
                            </div>
                          </div>
                        </div>

                        {/* Reward Points Section */}
                        <div className="p-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10 rounded-3xl space-y-4 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Star size={40} />
                          </div>
                          <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                                <Gift size={16} />
                              </div>
                              <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Puntos de Recompensa</h4>
                            </div>
                            <div className="text-xl font-black text-white">{rewardPoints} PTS</div>
                          </div>
                          <p className="text-[8px] text-zinc-500 uppercase tracking-widest leading-relaxed font-bold">
                            Completa misiones y feedback para ganar puntos canjeables por beneficios.
                          </p>
                          <button
                            onClick={() => setShowReferralModal(true)}
                            className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
                          >
                            Ganar más puntos
                          </button>
                        </div>

                        {/* Recent Movements */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between px-1">
                            <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Movimientos</h5>
                            <ChevronLeft className="rotate-180 text-zinc-700" size={12} />
                          </div>
                          <div className="p-8 bg-white/5 border border-white/10 border-dashed rounded-3xl flex flex-col items-center justify-center text-center gap-3">
                            <ShieldCheck size={24} className="text-zinc-800 opacity-20" />
                            <p className="text-[8px] text-zinc-600 uppercase tracking-[0.2em] font-black leading-relaxed">No se han detectado movimientos recientes con tu tarjeta.</p>
                          </div>
                        </div>

                        {/* Footer Link */}
                        <div className="pt-4 text-center">
                          <button className="inline-flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-all">
                            Saber más sobre tarjetas <ExternalLink size={12} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Navigation */}
        {user && (
          <div className="bg-black border-t border-white/10 px-2 pb-6 pt-2 shrink-0 relative z-50">
            <div className="flex items-center justify-around">
              <button
                onClick={() => setWalletView('home')}
                className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${walletView === 'home' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                <div className={`p-2 ${walletView === 'home' ? 'bg-white/5 rounded-xl' : ''}`}>
                  <Home size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">Inicio</span>
              </button>

              <button
                onClick={() => setWalletView('assets')}
                className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${walletView === 'assets' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                <div className={`p-2 ${walletView === 'assets' ? 'bg-white/5 rounded-xl' : ''}`}>
                  <TrendingUp size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">Cripto</span>
              </button>

              {/* QR Floating Button */}
              <div className="relative -top-6">
                <button
                  onClick={() => setIsScanning(true)}
                  className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] border-4 border-black hover:scale-110 active:scale-95 transition-all"
                >
                  <QrCode size={28} />
                </button>
              </div>

              <button
                onClick={() => setWalletView('miniapps')}
                className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${walletView === 'miniapps' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                <div className={`p-2 ${walletView === 'miniapps' ? 'bg-white/5 rounded-xl' : ''}`}>
                  <LayoutGrid size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">Mini-Apps</span>
              </button>

              <button
                onClick={() => setWalletView('card')}
                className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${walletView === 'card' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                <div className={`p-2 ${walletView === 'card' ? 'bg-white/5 rounded-xl' : ''}`}>
                  <CreditCard size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">Tarjeta</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-black border-t border-white/10 flex items-center justify-between text-[8px] text-zinc-600 uppercase tracking-[0.3em] font-black shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            Producción Mainnet
          </div>
          <div>v1.1.0</div>
        </div>

        {/* QR Feature Modal */}
        {showQrFeatureModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
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
        {/* Feedback Modal */}
        {isFeedbackModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsFeedbackModalOpen(false)}></div>
            <div className="relative bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] max-w-[340px] w-full shadow-2xl overflow-hidden min-h-[480px] flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

              {!hasCompletedFeedback ? (
                <FeedbackForm
                  onComplete={() => {
                    setRewardPoints(prev => prev + 5);
                    setHasCompletedFeedback(true);
                  }}
                  onClose={() => setIsFeedbackModalOpen(false)}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">¡Gracias por tu Feedback!</h3>
                    <p className="text-[11px] text-zinc-400 uppercase tracking-widest font-bold leading-relaxed px-4">
                      Tus respuestas han sido procesadas correctamente. Has ganado:
                    </p>
                    <div className="inline-block px-6 py-3 bg-blue-500/20 border border-blue-500/30 rounded-2xl">
                      <span className="text-2xl font-black text-blue-400">+5 Puntos</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFeedbackModalOpen(false)}
                    className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Card Feature Modal */}
        {showCardFeatureModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowCardFeatureModal(false)}></div>
            <div className="relative bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] max-w-[340px] w-full shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
                  <Play size={32} fill="white" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Control de Tarjeta</h3>
                  <p className="text-[11px] text-zinc-400 uppercase tracking-widest font-bold leading-relaxed px-4">
                    Esta funcionalidad estará disponible próximamente. Podrás pausar y reanudar tu tarjeta con un solo toque.
                  </p>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-relaxed font-bold">
                      Pronto podrás gestionar tu tarjeta con controles avanzados de seguridad y límites personalizados.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCardFeatureModal(false)}
                  className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Referral Modal */}
        {showReferralModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowReferralModal(false)}></div>
            <div className="relative bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] max-w-[340px] w-full shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                  <Share2 size={32} />
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Gana Más Puntos</h3>
                  <p className="text-[11px] text-zinc-400 uppercase tracking-widest font-bold leading-relaxed px-4">
                    Comparte tu enlace de referido y gana puntos cada vez que un amigo cree su billetera.
                  </p>

                  <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 space-y-3">
                    <div className="flex items-center gap-2 justify-center text-emerald-400">
                      <Gift size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">+10 Puntos por Referido</span>
                    </div>
                    <p className="text-[9px] text-zinc-400 uppercase tracking-widest leading-relaxed font-bold">
                      Además, tu amigo también recibe 5 puntos de bienvenida al registrarse.
                    </p>
                  </div>

                  {/* Referral Link */}
                  <div className="w-full space-y-2">
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Tu Enlace de Referido</label>
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white font-mono truncate">
                        {`reflecter.app/r/${user?.uid?.slice(0, 8) || 'xxxxxxxx'}`}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://reflecter.app/r/${user?.uid || ''}`);
                        }}
                        className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all"
                      >
                        <Copy size={14} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowReferralModal(false)}
                  className="w-full py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
                >
                  Compartir Enlace
                </button>
              </div>
            </div>
          </div>
        )}
      </div >

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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        #qr-reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
        #qr-reader__scan_region {
           aspect-ratio: 1/1 !important;
           width: 100% !important;
           height: 100% !important;
        }
        #qr-reader__scan_region img {
          display: none !important;
        }
        #qr-reader__dashboard {
          display: none !important;
        }
        #qr-reader canvas {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
      `}</style>
    </>
  );
};

export default WalletPopup;
