import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleScan = onScan || openScanner;

    // Determine current view from pathname AND search params if not provided
    const viewParam = searchParams.get('view') as WalletView;
    const currentView = propView || (
        pathname.includes('/dashboard')
            ? (viewParam === 'assets' ? 'assets' : 'home')
            : pathname.includes('/send') ? 'send' :
                pathname.includes('/receive') ? 'receive' : 'home'
    );

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
                    className={`flex flex-col items-center gap-1.5 relative transition-all duration-500 ${currentView === 'home' ? 'text-white translate-y-[-2px]' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                    <div className={`p-2 transition-all duration-300 ${currentView === 'home' ? 'bg-white/10 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.05)]' : ''}`}>
                        <Home size={20} className={currentView === 'home' ? 'scale-110' : ''} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-center min-w-[40px]">Inicio</span>
                    {currentView === 'home' && (
                        <div className="absolute -bottom-2 w-1 h-1 bg-white rounded-full animate-in zoom-in duration-300"></div>
                    )}
                </button>

                {/* QR Floating Button */}
                <div className="relative -top-6 group">
                    <button
                        onClick={handleScan}
                        className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] border-[3px] border-black hover:scale-110 active:scale-95 transition-all duration-300 relative z-20"
                    >
                        <QrCode size={28} />
                    </button>
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 transition-opacity group-hover:opacity-100 opacity-60">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap">Pagar / Scan</span>
                    </div>
                </div>

                <button
                    onClick={() => handleNavigation('assets')}
                    className={`flex flex-col items-center gap-1.5 relative transition-all duration-500 ${currentView === 'assets' ? 'text-white translate-y-[-2px]' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                    <div className={`p-2 transition-all duration-300 ${currentView === 'assets' ? 'bg-white/10 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.05)]' : ''}`}>
                        <TrendingUp size={20} className={currentView === 'assets' ? 'scale-110' : ''} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-center min-w-[40px]">Crypto</span>
                    {currentView === 'assets' && (
                        <div className="absolute -bottom-2 w-1 h-1 bg-white rounded-full animate-in zoom-in duration-300"></div>
                    )}
                </button>

            </div>
        </div>
    );
};


