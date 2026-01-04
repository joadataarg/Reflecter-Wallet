'use client';

import { useWalletSession } from '@/lib/context/WalletSessionContext';
import { Power, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function WalletPowerSwitch() {
    const { isSessionActive, toggleSession, isLoading } = useWalletSession();

    return (
        <div className={`
      relative overflow-hidden rounded-2xl p-6 transition-all duration-500
      ${isSessionActive
                ? 'bg-gradient-to-br from-emerald-900 to-emerald-950 border border-emerald-500/30'
                : 'bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800'}
    `}>
            {/* Background glow effects */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br rounded-full mix-blend-overlay filter blur-3xl opacity-20 transition-colors duration-500
        ${isSessionActive ? 'from-emerald-400 to-cyan-300' : 'from-gray-700 to-gray-500'}`}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Status Indicator & Text */}
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors duration-500 ${isSessionActive ? 'bg-emerald-500/20' : 'bg-gray-800'}`}>
                        {isSessionActive ? (
                            <ShieldCheck className="w-8 h-8 text-emerald-400" />
                        ) : (
                            <ShieldAlert className="w-8 h-8 text-gray-400" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">
                            Wallet Session
                        </h3>
                        <p className={`text-sm font-medium transition-colors duration-300 ${isSessionActive ? 'text-emerald-400' : 'text-gray-400'}`}>
                            {isSessionActive ? 'ACTIVE - Ready to sign' : 'INACTIVE - Secure mode'}
                        </p>
                    </div>
                </div>

                {/* The Power Switch */}
                <button
                    onClick={() => toggleSession(!isSessionActive)}
                    disabled={isLoading}
                    className={`
            group relative flex items-center gap-3 px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300
            ${isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
            ${isSessionActive
                            ? 'bg-emerald-500 text-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]'
                            : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-white'}
          `}
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <Power className="w-5 h-5" />
                    )}
                    <span>{isSessionActive ? 'ON' : 'OFF'}</span>
                </button>
            </div>

            {/* Security notice */}
            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-center md:text-left text-gray-500 font-mono">
                {isSessionActive
                    ? "⚠️ SESSION KEY IN MEMORY. DO NOT SHARE YOUR SCREEN."
                    : "🔒 KEY FLUSHED. WALLET IS COLD."
                }
            </div>
        </div>
    );
}
