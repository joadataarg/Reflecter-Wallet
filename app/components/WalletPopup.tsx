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
  Settings,
  ExternalLink,
  Copy,
  CheckCircle2,
  Info,
  Eye,
  EyeOff,
  Receipt
} from 'lucide-react';
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
type WalletView = 'assets' | 'send' | 'receive' | 'settings' | 'transactions';

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

const WalletPopup: React.FC<WalletPopupProps> = ({ isOpen, onClose, isEmbedded = false, initialAuthView = 'login' }) => {
  const { user, signIn, signUp, signOut, getToken } = useFirebaseAuth();
  const { wallet, error: walletError, isLoading: isWalletLoading, refetch: refetchWallet } = useFetchWallet();
  const { network, toggleNetwork } = useNetwork();
  const { createWalletAsync } = useCreateWallet();

  const [authView, setAuthView] = useState<AuthView>(initialAuthView);
  const [walletView, setWalletView] = useState<WalletView>('assets');
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

  const [isQrLoading, setIsQrLoading] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
            <span className="text-xs font-bold uppercase tracking-widest text-white">
              {profile.firstName ? `Hola ${profile.firstName} 👋` : 'Reflecter Wallet'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {/* Close button - only show in modal mode (not embedded) */}
            {!isEmbedded && (
              <button
                onClick={onClose}
                className="p-2 text-zinc-300 hover:text-white transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            )}
            {user && walletView !== 'settings' && (
              <button
                onClick={() => setWalletView('settings')}
                className="p-2 text-zinc-300 hover:text-white transition-colors"
                title="Settings"
              >
                <Settings size={18} />
              </button>
            )}
          </div>
        </div>

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
                  {authView === 'login' ? 'Welcome Back' : 'Create Wallet'}
                </h3>
                <p className="text-sm text-zinc-300 font-light">
                  {authView === 'login' ? 'Access your Starknet assets' : 'Create your Starknet wallet without seed phrases'}
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
                  <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold ml-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 border border-white/10 p-4 text-sm focus:border-white focus:outline-none transition-colors placeholder:text-zinc-400 text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 bg-white text-black hover:bg-zinc-200"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
                  ) : (
                    authView === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                {authView === 'login' ? (
                  <p className="text-xs text-zinc-300 font-light">
                    New to Reflecter Wallet?{' '}
                    <button onClick={() => setAuthView('register')} className="text-white font-bold hover:underline">
                      Create Wallet
                    </button>
                  </p>
                ) : (
                  <button
                    onClick={() => setAuthView('login')}
                    className="flex items-center justify-center gap-2 text-xs text-zinc-300 hover:text-white transition-colors mx-auto"
                  >
                    <ChevronLeft size={14} /> Back to Sign In
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* AUTHENTICATED VIEW - Diseño del Prototipo */
            <>
              {walletView === 'assets' && (
                <div className="flex flex-col h-full">
                  {/* Total Value Section - 2 filas según prototipo */}
                  <div className="p-6 border-b border-white/10">
                    {/* Fila 1: TOTAL VALUE + Network Indicator */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Total Value</div>
                        <button
                          onClick={() => {
                            // Force refetch balances - hooks will automatically update
                            window.location.reload();
                          }}
                          className="p-1 text-zinc-500 hover:text-white transition-colors"
                          title="Refresh balances"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                      <div className="px-2 py-0.5 border border-emerald-500/30 text-emerald-500 bg-emerald-500/5 text-[7px] font-bold uppercase tracking-widest rounded-full">
                        <span className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full animate-pulse bg-emerald-500"></div>
                          MAINNET NETWORK
                        </span>
                      </div>
                    </div>

                    {/* Fila 2: Balance + Porcentaje con Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-4xl font-bold text-white">
                          {isValueVisible ? `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••'}
                        </div>
                        <button
                          onClick={() => setIsValueVisible(!isValueVisible)}
                          className="p-2 text-zinc-500 hover:text-white transition-colors"
                        >
                          {isValueVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          if (wallet?.publicKey) {
                            const baseUrl = network === 'MAINNET' ? 'https://starkscan.co' : 'https://sepolia.starkscan.co';
                            window.open(`${baseUrl}/contract/${formatStarknetAddress(wallet.publicKey)}`, '_blank');
                          }
                        }}
                        disabled={!wallet?.publicKey}
                        className="text-xs text-zinc-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        title="View on Starkscan"
                      >
                        {totalValue > 0 ? 'Live' : '0%'}
                        <ExternalLink size={10} />
                      </button>
                    </div>
                  </div>


                  {/* Action Buttons Row 1: Send, Receive */}
                  <div className="grid grid-cols-2 gap-2 p-3 border-b border-white/10">
                    <button
                      onClick={handleInitSend}
                      className="flex flex-col items-center gap-1 p-3 border border-white/10 hover:bg-white/5 transition-all"
                    >
                      <ArrowUp size={18} className="text-white" />
                      <span className="text-[9px] uppercase font-bold tracking-widest text-white text-center">Send</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsQrLoading(true);
                        setWalletView('receive');
                      }}
                      className="flex flex-col items-center gap-1 p-3 border border-white/10 hover:bg-white/5 transition-all"
                    >
                      <ArrowDown size={18} className="text-white" />
                      <span className="text-[9px] uppercase font-bold tracking-widest text-white text-center">Receive</span>
                    </button>
                  </div>

                  {/* Dashboard Tabs: Assets and Transactions */}
                  <div className="flex-1">
                    <div className="px-4 pt-4 grid grid-cols-2 border-b border-white/5">
                      <button
                        onClick={() => setActiveDashboardTab('assets')}
                        className={`text-[9px] uppercase tracking-widest font-bold pb-3 whitespace-nowrap relative transition-colors flex justify-center ${activeDashboardTab === 'assets' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
                      >
                        Assets
                        {activeDashboardTab === 'assets' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>}
                      </button>
                      <button
                        onClick={() => setActiveDashboardTab('transactions')}
                        className={`text-[9px] uppercase tracking-widest font-bold pb-3 whitespace-nowrap relative transition-colors flex justify-center ${activeDashboardTab === 'transactions' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
                      >
                        Transactions
                        {activeDashboardTab === 'transactions' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>}
                      </button>
                    </div>

                    <div className="p-4">
                      {activeDashboardTab === 'assets' && (
                        <div className="space-y-2">
                          {/* Asset rows remain same... */}
                          <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                <TokenIcon
                                  src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                                  alt="ETH"
                                  fallback="Ξ"
                                />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-white">Ethereum</div>
                                <div className="text-xs text-zinc-400">
                                  {ethBalance} ETH
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-white">
                                ${ethValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                              <div className="text-[10px] text-zinc-500">
                                ${prices.ETH.toLocaleString()} / unit
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                <TokenIcon
                                  src="https://cryptologos.cc/logos/starknet-token-strk-logo.png"
                                  alt="STRK"
                                  fallback="S"
                                />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-white">Starknet</div>
                                <div className="text-xs text-zinc-400">
                                  {strkBalance} STRK
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-white">
                                ${strkValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                              <div className="text-[10px] text-zinc-500">
                                ${prices.STRK.toLocaleString()} / unit
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                <TokenIcon
                                  src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                                  alt="USDC"
                                  fallback="$"
                                />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-white">USD Coin</div>
                                <div className="text-xs text-zinc-400">
                                  {usdcBalance} USDC
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-white">
                                ${usdcValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                              <div className="text-[10px] text-zinc-500">
                                Stablecoin
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeDashboardTab === 'transactions' && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Receipt size={32} className="text-zinc-600 mb-4" />
                          <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-2">Transactions</h4>
                          <p className="text-[10px] text-zinc-500 max-w-[200px]">
                            Advanced transaction history and tracking feature is coming soon.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {walletView === 'settings' && (
                <div className="p-6">
                  <button
                    onClick={() => setWalletView('assets')}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                  >
                    <ChevronLeft size={14} /> Back to Dashboard
                  </button>

                  <div className="space-y-6">
                    {/* Network Section */}
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-white mb-4">Network</h3>
                      <NetworkSelector />
                    </div>

                    {/* View Address Activity Button */}
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-white mb-4">Explorer</h3>
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
                        View Address Activity
                      </button>
                    </div>

                    {/* Active Session */}
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-white mb-4">Active Session</h3>
                      <div className="p-4 bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                            <span className="text-xs">👤</span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{user?.email}</div>
                            <div className="text-xs text-zinc-400">Connected via Reflecter Wallet</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Section */}
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-white mb-4">Profile</h3>
                      <div className="p-4 bg-white/5 border border-white/10 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">First Name *</label>
                            <input
                              type="text"
                              value={profile.firstName}
                              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                              placeholder="Your first name"
                              className="w-full bg-black/40 border border-white/10 p-2 text-xs focus:border-white focus:outline-none text-white transition-colors"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Last Name</label>
                            <input
                              type="text"
                              value={profile.lastName}
                              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                              placeholder="Your last name"
                              className="w-full bg-black/40 border border-white/10 p-2 text-xs focus:border-white focus:outline-none text-white transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">City</label>
                          <input
                            type="text"
                            value={profile.city}
                            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                            placeholder="City"
                            className="w-full bg-black/40 border border-white/10 p-2 text-xs focus:border-white focus:outline-none text-white transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Province</label>
                            <input
                              type="text"
                              value={profile.province}
                              onChange={(e) => setProfile({ ...profile, province: e.target.value })}
                              placeholder="Provincia"
                              className="w-full bg-black/40 border border-white/10 p-2 text-xs focus:border-white focus:outline-none text-white transition-colors"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Cód. Postal</label>
                            <input
                              type="text"
                              value={profile.postalCode}
                              onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                              placeholder="C.P."
                              className="w-full bg-black/40 border border-white/10 p-2 text-xs focus:border-white focus:outline-none text-white transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Staging / Logs Section */}
                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-white mb-4">Staging Logs</h3>
                      <div className="space-y-3">
                        {/* Integration Status Cards */}
                        <div className="p-4 bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span className="text-xs font-bold text-white uppercase tracking-wider">Firebase Auth</span>
                            </div>
                            <span className="text-xs text-emerald-500">✓ Active</span>
                          </div>
                          <div className="text-[10px] text-zinc-400">User: {user?.email}</div>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span className="text-xs font-bold text-white uppercase tracking-wider">Starknet {network}</span>
                            </div>
                            <span className="text-xs text-emerald-500">✓ Connected</span>
                          </div>
                          <div className="text-[10px] text-zinc-400">Network: {network}</div>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${wallet ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                              <span className="text-xs font-bold text-white uppercase tracking-wider">Wallet Session</span>
                            </div>
                            <span className={`text-xs ${wallet ? 'text-emerald-500' : 'text-amber-500'}`}>
                              {wallet ? '✓ Activated' : '○ Inactive'}
                            </span>
                          </div>
                          {walletSession && (
                            <div className="text-[10px] text-zinc-400 font-mono truncate">
                              {walletSession.publicKey.slice(0, 20)}...
                            </div>
                          )}
                        </div>

                        <div className="p-4 bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span className="text-xs font-bold text-white uppercase tracking-wider">ChipiPay SDK</span>
                            </div>
                            <span className="text-xs text-emerald-500">✓ Loaded</span>
                          </div>
                          <div className="text-[10px] text-zinc-400">Gasless transactions ready</div>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span className="text-xs font-bold text-white uppercase tracking-wider">Vesu Protocol</span>
                            </div>
                            <span className="text-xs text-emerald-500">✓ Available</span>
                          </div>
                          <div className="text-[10px] text-zinc-400">Lending hooks configured</div>
                        </div>
                      </div>
                    </div>

                    {/* Terminate Session */}
                    <button
                      onClick={handleLogout}
                      className="w-full p-4 bg-red-950/20 border border-red-500/30 text-red-500 text-xs uppercase tracking-widest hover:bg-red-950/30 transition-all flex items-center justify-center gap-2 font-bold"
                    >
                      <LogOut size={14} /> Terminate Session
                    </button>
                  </div>
                </div>
              )}

              {walletView === 'send' && (
                <div className="p-6">
                  <button
                    onClick={() => setWalletView('assets')}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                  >
                    <ChevronLeft size={14} /> Back to Assets
                  </button>

                  <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Send Assets</h2>

                  <div className="space-y-4">
                    <div className="relative">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold mb-2 block">Token</label>

                      {/* Dropdown Button - Vista Compacta */}
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
                          <span className="text-xs text-zinc-400">
                            BALANCE: <TokenBalanceDisplay token={selectedToken} walletPublicKey={wallet?.publicKey} />
                          </span>
                          <ChevronLeft size={16} className={`transition-transform ${isTokenDropdownOpen ? '-rotate-90' : 'rotate-90'}`} />
                        </div>
                      </button>

                      {/* Dropdown Menu - Vista Expandida */}
                      {isTokenDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/10 z-50">
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
                      <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold mb-2 block">To Address</label>
                      <input
                        type="text"
                        value={sendToAddress}
                        onChange={(e) => {
                          setSendToAddress(e.target.value);
                          setSendAddressError('');
                        }}
                        placeholder="0x..."
                        className={`w-full bg-white/5 border p-4 text-sm focus:outline-none transition-colors placeholder:text-zinc-500 text-white ${sendAddressError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-white'
                          }`}
                      />
                      {sendAddressError && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-red-500">
                          <Info size={12} />
                          {sendAddressError}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold">Amount</label>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                          Balance: {selectedToken === 'ETH' ? ethBalance : selectedToken === 'STRK' ? strkBalance : usdcBalance} {selectedToken}
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
                            // Subtract estimated fee from balance
                            const estimatedFee = sendAssetsHook.estimatedGasPrice;
                            const maxAmount = Math.max(0, balanceNum - estimatedFee);
                            setSendAmount(maxAmount.toFixed(selectedToken === 'USDC' ? 6 : 18).replace(/\.?0+$/, ''));
                            setSendPercent(100);
                            setSendAmountError('');
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-widest text-white hover:text-zinc-300"
                        >
                          Max
                        </button>
                      </div>
                      {sendAmountError && (
                        <div className="flex items-center gap-1 mb-4 text-xs text-red-500">
                          <Info size={12} />
                          {sendAmountError}
                        </div>
                      )}

                      {/* Percentage Slider */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          <span>0%</span>
                          <span>25%</span>
                          <span>50%</span>
                          <span>75%</span>
                          <span>100%</span>
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
                          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                      </div>

                      {/* Fee Estimation Display */}
                      {sendAmount && !sendAmountError && (
                        <div className="bg-white/5 border border-white/10 p-3 rounded mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-zinc-400 uppercase font-bold">Estimated Fee</span>
                            <span className="text-sm font-bold text-white">
                              {sendAssetsHook.calculateEstimatedFee(sendAmount).toFixed(selectedToken === 'USDC' ? 6 : 8)} {selectedToken}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400 uppercase font-bold">Total Cost</span>
                            <span className="text-sm font-bold text-white">
                              {sendAssetsHook.calculateTotalCost(sendAmount).toFixed(selectedToken === 'USDC' ? 6 : 8)} {selectedToken}
                            </span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                            <span className="text-xs text-zinc-500">Min Amount</span>
                            <span className="text-xs text-zinc-400">{sendAssetsHook.minAmount} {selectedToken}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleConfirmSend}
                      disabled={sendAssetsHook.isLoading || !sendAmount || !sendToAddress}
                      className={`w-full py-4 font-bold uppercase tracking-widest text-xs transition-all ${sendAssetsHook.isLoading || !sendAmount || !sendToAddress
                        ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-zinc-200'
                        }`}
                    >
                      {sendAssetsHook.isLoading ? 'Sending...' : 'Confirm Send'}
                    </button>
                  </div>
                </div>
              )}

              {walletView === 'receive' && (
                <div className="p-6">
                  <button
                    onClick={() => setWalletView('assets')}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                  >
                    <ChevronLeft size={14} /> Back to Assets
                  </button>

                  <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight text-center">Receive Assets</h2>

                  <div className="flex flex-col items-center">
                    {/* Real QR Code using QR Server API with Loading Context */}
                    <div className="w-48 h-48 bg-white p-2 mb-6 flex items-center justify-center relative overflow-hidden group">
                      {isQrLoading && (
                        <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-2 z-10">
                          <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-800 animate-spin rounded-full"></div>
                          <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest animate-pulse">Generating QR</span>
                        </div>
                      )}
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${formatStarknetAddress(wallet?.publicKey || '0x04718285712f0959891c8d9045966755c4ab4301002380ee73d59952a')}`}
                        alt="Wallet QR Code"
                        className={`w-[180px] h-[180px] transition-opacity duration-300 ${isQrLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={() => setIsQrLoading(false)}
                      />
                    </div>

                    <div className="w-full mb-4">
                      <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-2 text-center">Your Starknet Address</div>
                      <div className="p-3 bg-white/5 border border-white/10 text-xs text-white break-all text-center font-mono">
                        {formatStarknetAddress(wallet?.publicKey || '0x04718285712f0959891c8d9045966755c4ab4301002380ee73d59952a')}
                      </div>
                    </div>

                    {/* Botón de Copiado Rápido */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(formatStarknetAddress(wallet?.publicKey || '0x04718285712f0959891c8d9045966755c4ab4301002380ee73d59952a'));
                      }}
                      className="w-full py-3 mb-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Copy size={14} /> Copy Address
                    </button>

                    {network !== 'MAINNET' && (
                      <button
                        onClick={() => window.open('https://starknet-faucet.vercel.app/', '_blank')}
                        className="w-full py-3 bg-white/5 border border-white/10 text-white text-xs uppercase tracking-widest hover:bg-white/10 transition-all font-bold flex items-center justify-center gap-2"
                      >
                        Get Testnet Tokens <ExternalLink size={12} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {walletView === 'transactions' && (
                <div className="p-6">
                  <button
                    onClick={() => setWalletView('assets')}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                  >
                    <ChevronLeft size={14} /> Back to Assets
                  </button>

                  <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Transactions</h2>

                  <div className="text-center py-12">
                    <Receipt size={48} className="mx-auto mb-4 text-zinc-600" />
                    <p className="text-sm text-zinc-400">
                      This feature is coming soon. Stay tuned for advanced transaction tracking.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-bold shrink-0">
          <div>Reflecter Wallet | Starknet Wallet</div>
          <div>v1.0.0</div>
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
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </>
  );
};

export default WalletPopup;
