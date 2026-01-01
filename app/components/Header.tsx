'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNetwork } from '@/lib/hooks/useNetwork';

interface HeaderProps {
  onOpenWallet: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenWallet }) => {
  const pathname = usePathname();
  const { network } = useNetwork();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-xs">
            OTD
          </div>
          <Link href="/" className="text-sm font-bold tracking-tight hover:opacity-80 transition-opacity">
            OPEN THE DOORZ
          </Link>
          <span className={`px-2 py-0.5 border text-[8px] font-bold uppercase tracking-widest ${
            network === 'MAINNET' 
              ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10' 
              : 'border-amber-500/50 text-amber-500 bg-amber-500/10'
          }`}>
            {network}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenWallet}
            className="px-6 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all"
          >
            WALLET
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
