import React, { useState } from 'react';
import { Sparkles, Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useCreateWallet } from '@chipi-stack/nextjs';
import { deriveEncryptKey } from '@/lib/utils/deriveEncryptKey';

type AuthView = 'login' | 'register';

interface WalletAuthProps {
    initialView?: AuthView;
    onViewChange?: (view: AuthView) => void;
}

export const WalletAuth: React.FC<WalletAuthProps> = ({ initialView = 'login', onViewChange }) => {
    const { signIn, signUp, signInWithGoogle } = useFirebaseAuth();
    const { createWalletAsync } = useCreateWallet();

    const [view, setView] = useState<AuthView>(initialView);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Sync internal view state if needed, or just use local
    const currentView = view;

    const handleSwitchView = (newView: AuthView) => {
        setView(newView);
        onViewChange?.(newView);
        setError('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (currentView === 'login') {
                await signIn(email, password);
            } else {
                // Validation: Passwords must match
                if (password !== confirmPassword) {
                    setError('Las contraseñas no coinciden');
                    setIsLoading(false);
                    return;
                }

                // 1. Firebase Sign Up
                const firebaseUser = await signUp(email, password);
                if (!firebaseUser) throw new Error('Error al crear el usuario en Firebase.');

                // 2. Get User Token
                const bearerToken = await firebaseUser.getIdToken();
                if (!bearerToken) throw new Error('No se pudo obtener el token de autenticación.');

                // 3. User UID
                const userUid = firebaseUser.uid;

                // 4. Derive Encryption Key
                const encryptKey = await deriveEncryptKey(userUid);

                // 5. Create Wallet with ChipiPay
                await createWalletAsync({
                    params: {
                        encryptKey,
                        externalUserId: userUid,
                    },
                    bearerToken,
                });

                console.log('Wallet created and deployed');
            }
        } catch (err: any) {
            console.error('Registration/Wallet Error:', err);
            if (err.status === 401) {
                setError('Error de autorización: Verifica la configuración de JWT en el dashboard de Chipi.');
            } else {
                setError(err.message || 'Error en la autenticación o creación de billetera');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            const firebaseUser = await signInWithGoogle();
            if (!firebaseUser) throw new Error('Google Sign In cancelled');

            // Check if wallet exists or create one (logic similar to register ideally, but typically sign-in handles both if new user)
            // For now, assuming sign-in is enough to get the user context, and the parent component handles fetching the wallet.
            console.log('Google Sign In success');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error with Google Sign In');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex h-full w-full bg-black">
            {/* Desktop: Image Carousel (Hidden on Mobile) */}
            <div className="hidden md:flex md:w-1/2 bg-black border-r border-white/10 relative overflow-hidden flex-col justify-end p-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                <div className="relative z-10 space-y-4">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                        Zero Friction.<br />
                        <span className="text-blue-500">Starknet Native.</span>
                    </h2>
                    <p className="text-zinc-400 text-sm font-light max-w-sm leading-relaxed">
                        Experience the future of finance without seed phrases. Enterprise-grade security powered by Reflecter Labs.
                    </p>

                    <div className="flex gap-2 pt-4">
                        <div className="w-12 h-1 bg-white rounded-full"></div>
                        <div className="w-2 h-1 bg-white/20 rounded-full"></div>
                        <div className="w-2 h-1 bg-white/20 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Login Form (Right Side on Desktop, Full on Mobile) */}
            <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 animate-in fade-in duration-500 relative">
                {/* Mobile Header / Logo could go here if needed */}

                <div className="max-w-sm mx-auto w-full flex flex-col h-full md:h-auto justify-center">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center mb-6 text-zinc-300 relative group">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            {currentView === 'register' ? <Sparkles size={32} /> : <Lock size={32} />}
                        </div>
                        <h3 className="text-2xl font-black mb-2 uppercase tracking-tight text-white">
                            {currentView === 'login' ? 'Bienvenido' : 'Crear Cuenta'}
                        </h3>
                        <p className="text-sm text-zinc-400 font-bold uppercase tracking-widest">
                            {currentView === 'login' ? 'Accede a tu billetera' : 'Sin frases semilla'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-950/20 border border-red-500/50 text-red-500 text-xs font-bold rounded-lg flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* 
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                            Continuar con Google
                        </button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-black px-4 text-zinc-500 font-bold tracking-widest">O usa tu email</span>
                            </div>
                        </div>
                        */}

                        <form onSubmit={handleAuthAction} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-white focus:outline-none transition-colors placeholder:text-zinc-600 text-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Contraseña</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min. 8 caracteres"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-white focus:outline-none transition-colors placeholder:text-zinc-600 text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {currentView === 'register' && (
                                <div className="space-y-1">
                                    <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Confirmar Contraseña</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Repite tu contraseña"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-white focus:outline-none transition-colors placeholder:text-zinc-600 text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-zinc-900 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                                ) : (
                                    currentView === 'login' ? 'Iniciar Sesión' : 'Crear Billetera'
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 text-center">
                        {currentView === 'login' ? (
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wide">
                                ¿No tienes cuenta?{' '}
                                <button onClick={() => handleSwitchView('register')} className="text-white hover:text-blue-400 transition-colors ml-1">
                                    Regístrate
                                </button>
                            </p>
                        ) : (
                            <button
                                onClick={() => handleSwitchView('login')}
                                className="flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-white font-bold uppercase tracking-wide transition-colors mx-auto"
                            >
                                <ChevronLeft size={14} /> Volver al Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
