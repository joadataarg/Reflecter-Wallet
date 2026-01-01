'use client';

import { useState } from 'react';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import Header from '@/app/components/Header';
import Landing from '@/app/components/Landing';
import Footer from '@/app/components/Footer';
import WalletPopup from '@/app/components/WalletPopup';

export default function HomePage() {
  const { user, loading } = useFirebaseAuth();
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const handleOpenWallet = () => {
    setIsWalletOpen(true);
  };

  const handleCloseWallet = () => {
    setIsWalletOpen(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Cargando...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white selection:bg-white selection:text-black min-h-screen pb-16">
      <Header onOpenWallet={handleOpenWallet} />
      <Landing />
      <Footer />
      <WalletPopup 
        isOpen={isWalletOpen}
        onClose={handleCloseWallet}
      />
    </div>
  );
}

