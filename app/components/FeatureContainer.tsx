'use client';

import { ReactNode } from 'react';

type FeatureContainerProps = {
    children: ReactNode;
    isActive: boolean;
    title?: string;
    description?: string;
};

export default function FeatureContainer({ children, isActive, title, description }: FeatureContainerProps) {
    if (!isActive) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden group">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                <div className="relative z-10 max-w-lg">
                    <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 inline-block transform group-hover:-translate-y-2 transition-transform duration-300">
                        <svg className="w-16 h-16 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                        Bienvenido al Futuro DeFi
                    </h2>
                    <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                        Gestiona tus activos, realiza préstamos y ahorra sin fricción.
                        Conecta tu billetera en el panel derecho para desbloquear el ecosistema.
                    </p>

                    <div className="flex justify-center">
                        <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl border border-indigo-100 shadow-md flex items-center hover:shadow-lg transition-shadow">
                            <span className="mr-2 text-xl">👉</span>
                            Configura tu Billetera a la derecha para empezar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            {/* Placeholder for future specific header logic */}
            <div className="h-full bg-transparent rounded-3xl transition-all duration-500">
                {children}
            </div>
        </div>
    );
}
