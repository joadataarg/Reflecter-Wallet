'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import WalletPopup from '@/app/components/WalletPopup';

export default function LoginPage() {
  const { user, loading } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-6 relative overflow-hidden">
        {/* Decorative background for loading */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.03] blur-[150px] rounded-full animate-pulse" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-12">
            <div className="w-24 h-24 bg-white text-black flex items-center justify-center font-black text-2xl shadow-[0_0_50px_rgba(255,255,255,0.2)] animate-bounce font-mono">
              OTD
            </div>
            <div className="absolute -inset-4 border border-white/10 animate-[spin_4s_linear_infinite]" />
            <div className="absolute -inset-8 border border-white/5 animate-[spin_8s_linear_infinite_reverse]" />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-[0.6em] text-white animate-pulse">
              Initializing Node
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-zinc-800" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">
                Establishing Secure Link
              </span>
              <div className="h-px w-12 bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration in sync with the Landing/Wallet style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] blur-[120px] rounded-full" />
      </div>

      {/* 
          Re-using the WalletPopup component directly for Login/Register.
          Since WalletPopup internally handles the !user state by showing the Login/Register forms,
          we just need to render it here in 'isEmbedded' mode to fit the page aesthetic perfectly.
      */}
      <div className="relative z-10 w-full max-w-[400px] h-[600px] border border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.1)]">
        <WalletPopup
          isOpen={true}
          onClose={() => router.push('/')}
          isEmbedded={true}
        />
      </div>
    </div>
  );
}
