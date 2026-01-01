'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, loading, error, user } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      alert('¡Cuenta creada! Ya puedes iniciar sesión.');
      setIsSignUp(false);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleSubmit = isSignUp ? handleSignUp : handleSignIn;

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-bold text-lg rounded mx-auto mb-4">OTD</div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2">OPENTHEDOORZ</h1>
          <p className="text-sm text-zinc-400 uppercase tracking-widest font-bold">Firebase Auth</p>
        </div>

        {/* Form Container */}
        <div className="border border-white/10 bg-black rounded-xl p-8 shadow-[0_0_100px_rgba(255,255,255,0.05)]">
          <h2 className="text-center text-2xl font-bold tracking-tight text-white mb-2">
            {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>
          <p className="text-center text-sm text-zinc-400 uppercase tracking-widest font-bold mb-8">
            Accede a tu ecosistema Web3
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-white uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all text-sm"
                placeholder="tu@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-white uppercase tracking-widest mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase tracking-widest text-sm"
            >
              {loading ? 'Procesando...' : isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
              }}
              className="text-sm text-zinc-400 hover:text-white transition-colors uppercase tracking-widest font-bold"
            >
              {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
              <span className="text-white underline">{isSignUp ? 'Inicia sesión' : 'Regístrate'}</span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">
            Asegurado por Firebase & ChipiPay
          </p>
        </div>
      </div>
    </div>
  );
}
