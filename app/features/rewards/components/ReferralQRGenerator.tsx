'use client';

import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface ReferralQRGeneratorProps {
    code: string;
}

export const ReferralQRGenerator: React.FC<ReferralQRGeneratorProps> = ({ code }) => {
    const [copied, setCopied] = useState(false);
    const referralLink = `https://reflecter.app/join?ref=${code}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white/5 rounded-xl p-4 space-y-4">
            <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 bg-white p-2 rounded-lg">
                    {/* Placeholder for QR Code - In a real app we'd use qrcode.react */}
                    <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 grid grid-cols-4 gap-1 p-1 opacity-20">
                            {Array.from({ length: 16 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-sm" />
                            ))}
                        </div>
                        <span className="text-[10px] font-black text-white relative z-10">REFLECTER</span>
                    </div>
                </div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                    {code}
                </p>
            </div>

            <div className="space-y-2">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest text-center">
                    Comparte tu enlace de referido
                </p>
                <div className="flex items-center gap-2 p-2 bg-black/40 border border-white/5 rounded-lg group">
                    <input
                        type="text"
                        readOnly
                        value={referralLink}
                        className="bg-transparent text-[10px] text-zinc-400 w-full outline-none font-medium truncate"
                    />
                    <button
                        onClick={copyToClipboard}
                        className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white"
                    >
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                </div>
            </div>
        </div>
    );
};
