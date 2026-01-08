'use client';

import React, { useState } from 'react';
import {
    User,
    ShieldCheck,
    Key,
    Copy,
    ExternalLink,
    Fingerprint,
    Zap,
    CreditCard,
    Award,
    X
} from 'lucide-react';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import { useRewards } from '@/lib/hooks/useRewards';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { formatStarknetAddress } from '@/lib/utils/formatAddress';

export default function ProfilePage() {
    const { wallet } = useFetchWallet();
    const { points, referrals } = useRewards();
    const { profile, updateHandle, isLoading: profileLoading } = useUserProfile();
    const [isEditingHandle, setIsEditingHandle] = useState(false);
    const [newHandle, setNewHandle] = useState('');
    const [handleError, setHandleError] = useState('');

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleSaveHandle = async () => {
        try {
            setHandleError('');
            await updateHandle(newHandle);
            setIsEditingHandle(false);
        } catch (err: any) {
            setHandleError(err.message);
        }
    };

    if (profileLoading) {
        return <div className="p-12 text-zinc-500 font-black uppercase tracking-widest animate-pulse">Cargando Perfil...</div>;
    }

    return (
        <div className="p-12 space-y-12 animate-in fade-in duration-700">
            <header className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                    <Fingerprint size={10} className="text-purple-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Identidad Digital</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
                    Perfil de <br /> <span className="text-zinc-600">{profile?.handle || 'Usuario'}</span>
                </h1>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
                {/* Profile Info Card */}
                <div className="xl:col-span-2 space-y-8 h-full">
                    <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                    <User size={64} className="text-zinc-800" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div className="space-y-1">
                                    {!isEditingHandle ? (
                                        <div className="flex items-center justify-center md:justify-start gap-3">
                                            <h3 className="text-3xl font-black text-white uppercase tracking-tight">{profile?.handle}</h3>
                                            <button
                                                onClick={() => { setIsEditingHandle(true); setNewHandle(profile?.handle || ''); }}
                                                className="p-2 bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors"
                                            >
                                                <Key size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <input
                                                autoFocus
                                                value={newHandle}
                                                onChange={(e) => setNewHandle(e.target.value)}
                                                className="bg-black border border-indigo-500/50 rounded-xl px-4 py-2 text-white font-black uppercase text-xl w-full max-w-xs focus:outline-none focus:border-indigo-500"
                                            />
                                            <button onClick={handleSaveHandle} className="p-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors">
                                                <ShieldCheck size={18} />
                                            </button>
                                            <button onClick={() => setIsEditingHandle(false)} className="p-3 bg-zinc-800 text-zinc-400 rounded-xl hover:bg-zinc-700 transition-colors">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    )}
                                    {handleError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{handleError}</p>}
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Miembro desde Enero 2026</p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-lg">ID Verificado</span>
                                    <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-lg">Early Adopter</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                        {/* Wallet Section */}
                        <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] space-y-6">
                            <div className="flex items-center gap-3 text-white">
                                <Zap size={20} className="text-indigo-400" />
                                <h4 className="text-sm font-black uppercase tracking-widest">Información On-chain</h4>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-2">Dirección Starknet</label>
                                    <div className="flex items-center gap-2 p-4 bg-black border border-white/5 rounded-2xl group transition-all hover:border-white/10">
                                        <code className="flex-1 text-[11px] text-zinc-400 truncate">
                                            {wallet?.publicKey || '0x0000...0000'}
                                        </code>
                                        <button
                                            onClick={() => handleCopy(wallet?.publicKey || '')}
                                            className="p-2 text-zinc-600 hover:text-white transition-colors"
                                        >
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estado</span>
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                        Activa
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] space-y-6">
                            <div className="flex items-center gap-3 text-white">
                                <ShieldCheck size={20} className="text-purple-400" />
                                <h4 className="text-sm font-black uppercase tracking-widest">Seguridad</h4>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: 'Cloud Backup', status: 'Activado', icon: <Award size={14} className="text-emerald-500" /> },
                                    { label: 'Firma Biométrica', status: 'Activado', icon: <Award size={14} className="text-emerald-500" /> },
                                    { label: '2FA Auth', status: 'Pendiente', icon: <Award size={14} className="text-zinc-700" /> }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-black border border-white/5 rounded-2xl">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</span>
                                        {item.icon}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Summary Sidebar */}
                <div className="h-full">
                    <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[2.5rem] text-white space-y-12 relative overflow-hidden group h-full flex flex-col justify-between shadow-2xl shadow-indigo-500/10">
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mb-32"></div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Balance de Premios</p>
                            <h3 className="text-6xl font-black tracking-tighter tabular-nums leading-none">
                                {points?.currentBalance ?? 0} <span className="text-2xl opacity-60">RT</span>
                            </h3>
                        </div>

                        <div className="space-y-6 flex-1 pt-12">
                            <div className="flex items-center justify-between pt-6 border-t border-white/10 uppercase font-black text-[10px] tracking-widest">
                                <span className="opacity-60">Referidos</span>
                                <span>{referrals.length} Activos</span>
                            </div>
                            <div className="flex items-center justify-between pt-6 border-t border-white/10 uppercase font-black text-[10px] tracking-widest">
                                <span className="opacity-60">Tier</span>
                                <span className="text-yellow-400">Platinum</span>
                            </div>
                            <div className="flex items-center justify-between pt-6 border-t border-white/10 uppercase font-black text-[10px] tracking-widest">
                                <span className="opacity-60">Estatus</span>
                                <span className="text-emerald-400 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                    VIP Verificado
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 mt-auto">
                            <button className="w-full py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] hover:bg-zinc-200 transition-all shadow-2xl shadow-black/40">
                                Mejorar Cuenta
                            </button>
                            <p className="text-center text-[8px] font-black uppercase tracking-widest opacity-40">Acceso Prioritario Starknet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
