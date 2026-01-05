'use client';

import React from 'react';
import { LogOut, Layout, User, Settings, Shield } from 'lucide-react';

interface SidebarProps {
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    const menuItems = [
        { icon: <Layout size={18} />, label: 'Dashboard', active: true },
        { icon: <User size={18} />, label: 'Profile', active: false },
        { icon: <Shield size={18} />, label: 'Security', active: false },
        { icon: <Settings size={18} />, label: 'Preferences', active: false },
    ];

    return (
        <div className="h-full flex flex-col bg-zinc-950 border-r border-white/5 p-6 select-none">
            <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20">
                    RW
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-black uppercase tracking-widest text-white">Reflecter</span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Wallet v1.0</span>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${item.active
                                ? 'bg-white/10 text-white shadow-sm'
                                : 'text-zinc-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span className={`${item.active ? 'text-blue-400' : 'text-zinc-500 group-hover:text-blue-400'} transition-colors`}>
                            {item.icon}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="pt-6 border-t border-white/5">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
                >
                    <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Terminate Session</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
