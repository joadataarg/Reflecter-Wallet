'use client';

import { useState } from 'react';

type WalletProps = {
    wallet: {
        publicKey: string;
        id: string; // Ensure we handle whatever the SDK returns
    };
    onUnlock: (encryptKey: string) => void;
};

export default function RestoreWallet({ wallet, onUnlock }: WalletProps) {
    const [encryptKey, setEncryptKey] = useState('');

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (encryptKey.length >= 8) {
            onUnlock(encryptKey);
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden max-w-md w-full mx-auto relative group hover:shadow-2xl transition-shadow duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-teal-500"></div>

            <div className="p-8">
                <div className="text-center mb-8">
                    <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.5-4m1.5-2l1 1" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Bienvenido de nuevo</h2>
                    <p className="text-gray-500 text-sm mt-2">
                        Ingresa tu PIN para desbloquear tu billetera.
                    </p>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-center space-x-2 bg-gray-50 py-2 px-3 rounded-lg border border-gray-200">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-mono text-gray-600 truncate max-w-[200px]">{wallet.publicKey}</span>
                    </div>
                </div>

                <form onSubmit={handleUnlock} className="space-y-6">
                    <div>
                        <label htmlFor="restore-key" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                            PIN de Seguridad
                        </label>
                        <input
                            id="restore-key"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={encryptKey}
                            onChange={(e) => setEncryptKey(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-center text-lg tracking-[0.5em] font-bold text-gray-800
                     focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={encryptKey.length < 8}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-lg shadow-lg
                   hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                   disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99] transition-all"
                    >
                        Desbloquear Billetera
                    </button>
                </form>
            </div>
        </div>
    );
}
