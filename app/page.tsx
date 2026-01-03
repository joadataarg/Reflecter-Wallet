'use client';

import { useState, useEffect } from 'react';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import Header from '@/app/components/Header';
import Landing from '@/app/components/Landing';
import WalletPopup from '@/app/components/WalletPopup';

export default function HomePage() {
  const { user } = useFirebaseAuth();
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  useEffect(() => {
    if (isWalletOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isWalletOpen]);

  const handleOpenWallet = () => setIsWalletOpen(true);
  const handleCloseWallet = () => setIsWalletOpen(false);

  return (
    <div className="bg-black text-white selection:bg-white selection:text-black min-h-screen">
      <Header onOpenWallet={handleOpenWallet} />
      <Landing />
      <WalletPopup
        isOpen={isWalletOpen}
        onClose={handleCloseWallet}
      />
    </div>
  );
}

