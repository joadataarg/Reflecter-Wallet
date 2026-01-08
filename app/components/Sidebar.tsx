'use client';

import { LogOut, Layout, User, Settings, Shield, ShoppingBag, Fingerprint, Gift } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    const router = useRouter();
    const pathname = usePathname();

    const mainItems = [
        { icon: <Layout size={18} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <ShoppingBag size={18} />, label: 'Marketplace', path: '/marketplace' },
        { icon: <Gift size={18} />, label: 'Recompensas', path: '/rewards' },
    ];

    const userItems = [
        { icon: <Fingerprint size={18} />, label: 'Mi Perfil', path: '/profile' },
    ];

    return (
        <div className="h-full flex flex-col bg-zinc-950 border-r border-white/5 p-6 select-none shadow-2xl">
            <div className="flex items-center gap-3 mb-10 pl-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/20">
                    RW
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-black uppercase tracking-widest text-white">Reflecter</span>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight">Ecosystem v1.1</span>
                </div>
            </div>

            <div className="flex-1 space-y-10">
                {/* Main Section */}
                <div>
                    <h3 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] mb-4 pl-4 font-mono">Principal</h3>
                    <nav className="space-y-1">
                        {mainItems.map((item, index) => {
                            const isActive = pathname === item.path;
                            return (
                                <button
                                    key={index}
                                    onClick={() => router.push(item.path)}
                                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                        ? 'bg-white/5 text-white shadow-sm border border-white/5'
                                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <span className={`${isActive ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-indigo-400 rotate-[-10deg] group-hover:rotate-0'} transition-all`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-[11px] font-black uppercase tracking-widest leading-none">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Account Section */}
                <div>
                    <h3 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] mb-4 pl-4 font-mono">Ecosistema</h3>
                    <nav className="space-y-1">
                        {userItems.map((item, index) => {
                            const isActive = pathname === item.path;
                            return (
                                <button
                                    key={index}
                                    onClick={() => router.push(item.path)}
                                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                        ? 'bg-white/5 text-white shadow-sm border border-white/5'
                                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <span className={`${isActive ? 'text-purple-400' : 'text-zinc-600 group-hover:text-purple-400 rotate-[-10deg] group-hover:rotate-0'} transition-all`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-[11px] font-black uppercase tracking-widest leading-none">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            <div className="pt-6 border-t border-white/5">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-zinc-600 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 group"
                >
                    <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Terminate Session</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
