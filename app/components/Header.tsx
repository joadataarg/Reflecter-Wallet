
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onOpenWallet: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenWallet }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  const navLinks = [
    { label: 'HOME', href: '#hero' },
    { label: 'ROADMAP', href: '#roadmap' },
    { label: 'VALUES', href: '#philosophy' },
    { label: 'SOLUTIONS', href: '#solutions' },
    { label: 'TEAM', href: '#team' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    if (isDashboard) return; // Logic handled by router in dashboard if needed
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
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.08]">
      <nav className="max-w-7xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between relative">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-white text-black flex items-center justify-center font-black text-[10px] transition-transform group-hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              OTD
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] hidden sm:block">
              OPEN THE DOORZ
            </span>
          </Link>
        </div>

        {/* Centered Navigation Links Desktop */}
        {!isDashboard && (
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
        )}

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="https://openthedoorz.gitbook.io/open-the-doorz/"
            target="_blank"
            className="group flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors"
          >
            DOCS <ArrowUpRight size={10} className="text-zinc-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <button
            onClick={onOpenWallet}
            className="px-5 py-2 bg-white text-black text-[10px] font-black uppercase tracking-[0.15em] hover:bg-zinc-200 transition-all active:scale-95 flex items-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
          >
            TRY NOW
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-zinc-400 transition-colors hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 top-[56px] md:top-[64px] bg-black z-40 md:hidden transition-all duration-500 ease-in-out border-t border-white/[0.05] ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="flex flex-col p-8 gap-8 items-center justify-center h-full">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-lg font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-all"
            >
              {link.label}
            </a>
          ))}

          <div className="w-full h-px bg-white/5 my-4" />

          <Link
            href="https://openthedoorz.gitbook.io/open-the-doorz/"
            target="_blank"
            className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-all flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            DOCUMENTATION <ArrowUpRight size={14} />
          </Link>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onOpenWallet();
            }}
            className="w-full max-w-xs py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.05)]"
          >
            TRY THE SDK NOW
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
