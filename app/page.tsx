'use client';

import { useState, useEffect } from 'react';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import Header from '@/app/components/Header';
import Landing from '@/app/components/Landing';
import WalletPopup from '@/app/components/WalletPopup';

import Sidebar from '@/app/components/Sidebar';

export default function HomePage() {
  const { user, signOut } = useFirebaseAuth();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletAuthView, setWalletAuthView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (isWalletOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isWalletOpen]);

  // When user is authenticated, we close the modal if it was open
  useEffect(() => {
    if (user) {
      setIsWalletOpen(false);
    }
  }, [user]);

  const handleOpenWallet = (view: 'login' | 'register' = 'register') => {
    setWalletAuthView(view);
    setIsWalletOpen(true);
  };

  const handleCloseWallet = () => setIsWalletOpen(false);

  // AUTHENTICATED STATE
  if (user) {
    return (
      <div className="flex h-screen bg-black text-white overflow-hidden">
        {/* DESKTOP LAYOUT (3 Columns) */}
        <div className="hidden md:flex w-full h-full">
          {/* Column 1: Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Sidebar onLogout={signOut} />
          </div>

          {/* Column 2: Empty Space (Reserved for future features) */}
          <div className="flex-1 border-r border-white/5 bg-zinc-950/50 flex flex-col items-center justify-center p-12 text-center">
            <div className="max-w-md">
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white/20 mb-4">Central Hub</h2>
              <p className="text-xs text-white/10 uppercase tracking-widest leading-relaxed">
                This space is reserved for ecosystem features. Your Starknet assets are managed on the right panel.
              </p>
            </div>
          </div>

          {/* Column 3: Functional Wallet */}
          <div className="w-[400px] flex-shrink-0 bg-black shadow-2xl z-10 relative">
            <WalletPopup
              isOpen={true}
              onClose={() => { }}
              isEmbedded={true}
            />
          </div>
        </div>

        {/* MOBILE LAYOUT (Full screen Wallet) */}
        <div className="flex md:hidden w-full h-full">
          <WalletPopup
            isOpen={true}
            onClose={() => { }}
            isEmbedded={true}
          />
        </div>
      </div>
    );
  }

  // PUBLIC STATE (Landing Page)
  return (
    <div className="bg-black text-white selection:bg-white selection:text-black min-h-screen">
      <Header onOpenWallet={handleOpenWallet} />
      <Landing onOpenWallet={() => handleOpenWallet('register')} />
      <WalletPopup
        isOpen={isWalletOpen}
        onClose={handleCloseWallet}
        initialAuthView={walletAuthView}
      />
    </div>
  );
}

