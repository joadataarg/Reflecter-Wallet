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
  CheckCircle2
} from 'lucide-react';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import { useNetwork } from '@/lib/hooks/useNetwork';
import WalletManager from '@/app/components/WalletManager';
import VesuLending from '@/app/components/VesuLending';
import NetworkSelector from '@/app/components/NetworkSelector';
import { TokenBalanceDisplay } from '@/app/components/TokenBalanceDisplay';

type AuthView = 'login' | 'register';
type WalletView = 'assets' | 'lending' | 'storage' | 'staging' | 'send' | 'receive' | 'settings';

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
}

const WalletPopup: React.FC<WalletPopupProps> = ({ isOpen, onClose }) => {
  const { user, signIn, signUp, signOut } = useFirebaseAuth();
  const { wallet } = useFetchWallet();
  const { network, toggleNetwork } = useNetwork();
  
  const [authView, setAuthView] = useState<AuthView>('login');
  const [walletView, setWalletView] = useState<WalletView>('assets');
  const [isLoading, setIsLoading] = useState(false);
  const [walletSession, setWalletSession] = useState<WalletSession | null>(null);
  const [selectedToken, setSelectedToken] = useState<'ETH' | 'STRK' | 'USDC'>('ETH');
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Token data
  const tokenData = {
    ETH: { name: 'ETHEREUM', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', fallback: 'Ξ' },
    STRK: { name: 'STARKNET', icon: 'https://www.starknet.io/assets/starknet-logo.svg', fallback: 'S' },
    USDC: { name: 'USD COIN', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', fallback: '$' }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (authView === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
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

  if (!isOpen) return null;

  return (
    <>
      {/* Modal */}
      <div 
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-full max-w-[380px] h-[600px] bg-black border border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.1)] flex flex-col transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-xs">OTD</div>
            <span className="text-xs font-bold uppercase tracking-widest text-white">Open The Doorz</span>
          </div>
          <div className="flex items-center gap-1">
            {user && (
              <button 
                onClick={toggleNetwork}
                className={`px-2 py-0.5 border text-[8px] font-bold uppercase tracking-widest transition-all ${
                  network === 'MAINNET' 
                    ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20' 
                    : 'border-amber-500/50 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20'
                }`}
                title="Quick Network Switch"
              >
                {network}
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
            <button 
              onClick={onClose}
              className="p-2 text-zinc-300 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-black">
          {!user ? (
            /* AUTH VIEW */
            <div className="p-8 flex flex-col animate-in fade-in duration-500">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center mb-6 text-zinc-300">
                  {authView === 'register' ? <Sparkles size={32} /> : <Lock size={32} />}
                </div>
                <h3 className="text-xl font-bold mb-2 uppercase tracking-tight text-white">
                  {authView === 'login' ? 'Welcome Back' : 'Join the Bridge'}
                </h3>
                <p className="text-sm text-zinc-300 font-light">
                  {authView === 'login' ? 'Access your Starknet assets' : 'Create a secure non-custodial account'}
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
                    New to OpenTheDoorz?{' '}
                    <button onClick={() => setAuthView('register')} className="text-white font-bold hover:underline">
                      Register
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
                    {/* Fila 1: TOTAL VALUE + Address */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Total Value</div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        {wallet?.publicKey 
                          ? `${wallet.publicKey.slice(0, 6)}...${wallet.publicKey.slice(-4)}`
                          : '0X0471...052A'
                        }
                      </div>
                    </div>
                    {/* Fila 2: Balance + Porcentaje */}
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-bold text-white">-</div>
                      <div className="text-xs text-zinc-500">-</div>
                    </div>
                  </div>

                  {/* View Address Activity Button */}
                  <div className="p-4 border-b border-white/10">
                    <button
                      onClick={() => {
                        if (wallet?.publicKey) {
                          window.open(`https://starkscan.co/contract/${wallet.publicKey}`, '_blank');
                        }
                      }}
                      disabled={!wallet?.publicKey}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 transition-all text-white text-xs uppercase tracking-widest font-bold"
                    >
                      <ExternalLink size={14} />
                      View Address Activity
                    </button>
                  </div>

                  {/* Send / Receive Buttons */}
                  <div className="grid grid-cols-2 gap-2 p-4 border-b border-white/10">
                    <button 
                      onClick={() => setWalletView('send')}
                      className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <ArrowUp size={16} className="text-white" />
                      <span className="text-xs font-bold uppercase tracking-widest text-white">Send</span>
                    </button>
                    <button 
                      onClick={() => setWalletView('receive')}
                      className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <ArrowDown size={16} className="text-white" />
                      <span className="text-xs font-bold uppercase tracking-widest text-white">Receive</span>
                    </button>
                  </div>

                  {/* Storage, Lending, Staging Buttons */}
                  <div className="grid grid-cols-3 gap-2 p-4 border-b border-white/10">
                    <button
                      onClick={() => setWalletView('storage')}
                      className="flex flex-col items-center gap-2 p-3 border border-white/10 hover:bg-white/5 transition-all"
                    >
                      <Database size={18} className="text-white" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white">Storage</span>
                    </button>
                    
                    <button
                      onClick={() => setWalletView('lending')}
                      className="flex flex-col items-center gap-2 p-3 border border-white/10 hover:bg-white/5 transition-all"
                    >
                      <TrendingUp size={18} className="text-white" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white">Lending</span>
                    </button>

                    <button
                      onClick={() => setWalletView('staging')}
                      className="flex flex-col items-center gap-2 p-3 border border-white/10 hover:bg-white/5 transition-all"
                    >
                      <Layers size={18} className="text-white" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white">Staging</span>
                    </button>
                  </div>

                  {/* Your Assets */}
                  <div className="flex-1">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] uppercase tracking-widest font-bold text-white">Your Assets</h3>
                        <button className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">See all</button>
                      </div>
                      
                      {/* Asset List */}
                      <div className="space-y-2">
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
                                <TokenBalanceDisplay token="ETH" walletPublicKey={wallet?.publicKey} /> ETH
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">-</div>
                            <div className="text-xs text-zinc-500">-</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              <TokenIcon 
                                src="https://www.starknet.io/assets/starknet-logo.svg"
                                alt="STRK"
                                fallback="S"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white">Starknet</div>
                              <div className="text-xs text-zinc-400">
                                <TokenBalanceDisplay token="STRK" walletPublicKey={wallet?.publicKey} /> STRK
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">-</div>
                            <div className="text-xs text-zinc-500">-</div>
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
                                <TokenBalanceDisplay token="USDC" walletPublicKey={wallet?.publicKey} /> USDC
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">-</div>
                            <div className="text-xs text-zinc-500">-</div>
                          </div>
                        </div>
                      </div>
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
                            <div className="text-xs text-zinc-400">Connected via OTD SDK</div>
                          </div>
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
                        placeholder="0x..."
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-white focus:outline-none transition-colors placeholder:text-zinc-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold mb-2 block">Amount</label>
                      <div className="relative">
                        <input 
                          type="text"
                          placeholder="0.00"
                          className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-white focus:outline-none transition-colors placeholder:text-zinc-500 text-white"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-widest text-white hover:text-zinc-300">
                          Max
                        </button>
                      </div>
                    </div>

                    <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all">
                      Confirm Send
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
                    {/* QR Code Real - Usando patrón de bloques */}
                    <div className="w-48 h-48 bg-white p-4 mb-6">
                      <div className="w-full h-full relative">
                        {/* Patrón QR simplificado */}
                        <div className="absolute inset-0 grid grid-cols-8 gap-0">
                          {[
                            [1,1,1,1,0,0,1,1],
                            [1,0,0,0,0,0,0,1],
                            [1,0,1,1,0,1,0,1],
                            [1,0,1,1,0,0,0,0],
                            [0,0,0,0,1,1,1,1],
                            [0,0,1,0,0,1,0,1],
                            [1,1,0,0,1,0,1,1],
                            [0,1,0,1,0,0,1,0]
                          ].map((row, i) => 
                            row.map((cell, j) => (
                              <div key={`${i}-${j}`} className={cell ? 'bg-black' : 'bg-transparent'}></div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-full mb-4">
                      <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-2 text-center">Your Starknet Address</div>
                      <div className="p-3 bg-white/5 border border-white/10 text-xs text-white break-all text-center font-mono">
                        {wallet?.publicKey || '0x04718285712f0959891c8d9045966755c4ab4301002380ee73d59952a'}
                      </div>
                    </div>

                    {/* Botón de Copiado Rápido */}
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(wallet?.publicKey || '0x04718285712f0959891c8d9045966755c4ab4301002380ee73d59952a');
                      }}
                      className="w-full py-3 mb-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Copy size={14} /> Copy Address
                    </button>

                    <button 
                      onClick={() => window.open('https://starknet-faucet.vercel.app/', '_blank')}
                      className="w-full py-3 bg-white/5 border border-white/10 text-white text-xs uppercase tracking-widest hover:bg-white/10 transition-all font-bold flex items-center justify-center gap-2"
                    >
                      Get Testnet Tokens <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              )}

              {walletView === 'lending' && (
                <div className="p-6">
                  <button 
                    onClick={() => setWalletView('assets')}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                  >
                    <ChevronLeft size={14} /> Back to Assets
                  </button>
                  
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <TrendingUp size={64} className="text-zinc-600 mb-6" />
                    <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">Vesu Lending</h3>
                    <p className="text-sm text-zinc-400 mb-8 max-w-sm">
                      Integrate Vesu lending protocol into your application with gasless transactions.
                    </p>
                    <button 
                      onClick={() => window.open('https://docs.vesu.xyz/', '_blank')}
                      className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all flex items-center gap-2"
                    >
                      View Documentation <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              )}

              {walletView === 'storage' && (
                <div className="p-6">
                  <button 
                    onClick={() => setWalletView('assets')}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                  >
                    <ChevronLeft size={14} /> Back to Assets
                  </button>
                  
                  <div className="text-center py-12">
                    <Database size={48} className="mx-auto mb-4 text-zinc-600" />
                    <p className="text-sm text-zinc-400">
                      Encrypted storage coming soon
                    </p>
                  </div>
                </div>
              )}

              {walletView === 'staging' && (
                <div className="p-6">
                  <button 
                    onClick={() => setWalletView('assets')}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
                  >
                    <ChevronLeft size={14} /> Back to Assets
                  </button>

                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Staging</h2>
                    <p className="text-xs text-zinc-400">Verificación de integraciones para desarrolladores</p>
                  </div>

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
                          <div className={`w-2 h-2 rounded-full ${walletSession ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Wallet Session</span>
                        </div>
                        <span className={`text-xs ${walletSession ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {walletSession ? '✓ Active' : '○ Inactive'}
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

                  {!walletSession && (
                    <div className="mt-6 p-4 bg-amber-950/20 border border-amber-500/30">
                      <div className="text-xs text-amber-500 mb-2 font-bold uppercase tracking-wider">⚠ Acción Requerida</div>
                      <div className="text-[10px] text-zinc-400 mb-3">Conecta tu wallet para activar todas las funciones</div>
                      <WalletManager 
                        onSessionChange={handleSessionChange}
                        walletSession={walletSession}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-300 uppercase tracking-widest font-bold shrink-0">
          <div>Open Source Product from ReflecterLabs.xyz</div>
          <div>V0.0.1</div>
        </div>
      </div>
      
      {/* Overlay */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/80 backdrop-blur-2xl z-[90] transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
    </>
  );
};

export default WalletPopup;
