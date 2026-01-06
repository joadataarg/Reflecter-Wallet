import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, TrendingUp, QrCode } from 'lucide-react';
import { WalletView } from '@/lib/core/domain/types';
import { useWalletUI } from '@/lib/context/WalletUIContext';

interface WalletNavbarProps {
    currentView?: WalletView;
    onNavigate?: (view: WalletView) => void;
    onScan?: () => void;
}

export const WalletNavbar: React.FC<WalletNavbarProps> = ({ currentView: propView, onNavigate, onScan }) => {
    const { openScanner } = useWalletUI();
    const pathname = usePathname();
    const router = useRouter();

    const handleScan = onScan || openScanner;

    // Determine current view from pathname if not provided
    const currentView = propView || (pathname.includes('/dashboard') ? 'home' :
        pathname.includes('/send') ? 'send' :
            pathname.includes('/receive') ? 'receive' : 'home');

    const handleNavigation = (view: WalletView) => {
        if (onNavigate) {
            onNavigate(view);
        } else {
            switch (view) {
                case 'home':
                    router.push('/dashboard');
                    break;
                case 'assets':
                    router.push('/dashboard?view=assets');
                    break;
                case 'send':
                    router.push('/send');
                    break;
                case 'receive':
                    router.push('/receive');
                    break;
                default:
                    router.push('/dashboard');
            }
        }
    };

    return (
        <div className="relative shrink-0 h-[88px] bg-black border-t border-white/5 backdrop-blur-xl">
            <div className="absolute inset-x-0 bottom-0 top-1 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

            <div className="h-full px-12 flex items-center justify-between relative z-10 pt-2 pb-6">

                <button
                    onClick={() => handleNavigation('home')}
                    className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${currentView === 'home' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                    <div className={`p-2 ${currentView === 'home' ? 'bg-white/5 rounded-xl' : ''}`}>
                        <Home size={20} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-center min-w-[40px]">Inicio</span>
                </button>

                {/* QR Floating Button */}
                <div className="relative -top-6">
                    <button
                        onClick={handleScan}
                        className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] border-4 border-black hover:scale-110 active:scale-95 transition-all"
                    >
                        <QrCode size={28} />
                    </button>
                    <div className="absolute top-16 left-1/2 -translate-x-1/2">
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">Pagar</span>
                    </div>
                </div>

                <button
                    onClick={() => handleNavigation('assets')}
                    className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${currentView === 'assets' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                    <div className={`p-2 ${currentView === 'assets' ? 'bg-white/5 rounded-xl' : ''}`}>
                        <TrendingUp size={20} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-center min-w-[40px]">Crypto</span>
                </button>

            </div>
        </div>
    );
};


