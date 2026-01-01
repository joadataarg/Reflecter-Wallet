'use client';

import { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

type FeatureContainerProps = {
    children: ReactNode;
    isActive: boolean;
    title?: string;
    description?: string;
};

export default function FeatureContainer({ children, isActive, title, description }: FeatureContainerProps) {
    if (!isActive) {
        return (
            <div className="border border-white/10 bg-black rounded-xl shadow-[0_0_100px_rgba(255,255,255,0.05)] p-12 min-h-[500px] flex items-center justify-center relative overflow-hidden group">
                {/* Decorative Background Glow */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-[100px] group-hover:bg-white/10 transition-colors duration-700"></div>

                <div className="relative z-10 max-w-lg text-center">
                    {/* Icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg group-hover:bg-white/10 transition-all duration-300">
                            <Sparkles size={32} className="text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-4 text-white">
                        Conecta tu Billetera
                    </h2>

                    {/* Description */}
                    <p className="text-zinc-400 text-lg mb-8 leading-relaxed font-light">
                        Usa el panel de la derecha para crear o restaurar tu wallet y desbloquear acceso a Vesu, ChipiPay y más.
                    </p>

                    {/* Arrow Indicator */}
                    <div className="flex items-center justify-center gap-2 text-white font-bold uppercase tracking-widest text-sm">
                        <span className="text-2xl animate-bounce">→</span>
                        <span>Panel derecha</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="border border-white/10 bg-black rounded-xl shadow-[0_0_100px_rgba(255,255,255,0.05)] p-8 transition-all duration-500">
                {children}
            </div>
        </div>
    );
}
