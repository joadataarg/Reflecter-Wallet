'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import WalletManager, { WalletSession } from '@/app/components/WalletManager';
import FeatureContainer from '@/app/components/FeatureContainer';
import VesuLending from '@/app/components/VesuLending';

export default function DashboardPage() {
  const { user, loading, signOut } = useFirebaseAuth();
  const router = useRouter();
  const [walletSession, setWalletSession] = useState<WalletSession | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="text-gray-600 font-medium">Cargando ecosistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Navbar Minimalista */}
      <nav className="bg-white border-b border-gray-200 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">V</div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Vesu<span className="text-indigo-600">App</span></span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">{user.email}</p>
                <div className="flex items-center justify-end space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-green-600 font-medium">Conectado</span>
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200 mx-2"></div>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Grid Layout */}
      <main className="flex-grow max-w-[1600px] mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

          {/* LEFT SIDE: Feature Context (Main Interaction Area) */}
          <div className="lg:col-span-8 flex flex-col h-full">
            <FeatureContainer isActive={!!walletSession}>
              {walletSession && (
                <div className="h-full animate-fade-in-up">
                  {/* In the future, this VesuLending would be just one of many tabs */}
                  <VesuLending
                    walletInfo={{
                      publicKey: walletSession.publicKey,
                      walletId: walletSession.walletId
                    }}
                    encryptKey={walletSession.encryptKey}
                  />
                </div>
              )}
            </FeatureContainer>
          </div>

          {/* RIGHT SIDE: Wallet Module (Always Visible/Accessible) */}
          <div className="lg:col-span-4 flex flex-col lg:h-[calc(100vh-140px)] lg:sticky lg:top-24">
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-200 flex-grow">
              <div className="h-full overflow-y-auto custom-scrollbar p-2">
                <div className="mb-6 px-2">
                  <h2 className="text-lg font-bold text-gray-800">Billetera Digital</h2>
                  <p className="text-xs text-gray-400 font-medium">Gestión de identidad y llaves</p>
                </div>
                <WalletManager
                  walletSession={walletSession}
                  onSessionChange={setWalletSession}
                />

                {/* System Status in Sidebar Footer */}
                <div className="mt-12 pt-6 border-t border-gray-100">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Estado de la Red</h4>
                  <div className="space-y-2 px-2">
                    <div className="flex justify-between text-xs items-center">
                      <span className="text-gray-500">Network</span>
                      <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                        {process.env.NEXT_PUBLIC_STARKNET_NETWORK || 'SEPOLIA'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs items-center">
                      <span className="text-gray-500">Provider</span>
                      <span className="text-green-600 font-medium flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                        ChipiPay
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
