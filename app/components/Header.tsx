
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onOpenWallet: (view?: 'login' | 'register') => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenWallet }) => {
  const pathname = usePathname();

  const navLinks = [
    { label: 'HOME', href: '#hero' },
    { label: 'BENEFITS', href: '#benefits' },
    { label: 'HOW IT WORKS', href: '#demo' },
    { label: 'COMPARE', href: '#comparison' },
    { label: 'ROADMAP', href: '#roadmap' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Adjust for header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.08]">
      <nav className="max-w-7xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between relative">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-black text-[10px] transition-transform group-hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              RW
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] hidden sm:block">
              REFLECTER WALLET
            </span>
          </Link>
        </div>

        {/* Centered Navigation Links Desktop */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-8">
          <button
            onClick={() => onOpenWallet('login')}
            className="group flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors"
          >
            LOGIN
          </button>
          <button
            onClick={() => onOpenWallet('register')}
            className="px-3 md:px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] hover:opacity-90 transition-all active:scale-95 flex items-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
          >
            <span className="hidden xs:inline">Create Wallet</span>
            <span className="xs:hidden">Create</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
