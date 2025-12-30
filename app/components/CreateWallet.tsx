'use client';

import { useState } from 'react';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useCreateWallet } from '@chipi-stack/nextjs';

/**
 * Componente para crear una billetera de ChipiPay
 * Integra Firebase Auth con ChipiPay para crear billeteras
 * encriptadas y asociadas a usuarios.
 */
type WalletSuccessData = {
  publicKey: string;
  walletId: string;
  encryptKey: string;
};

export default function CreateWallet({ onSuccess }: { onSuccess?: (data: WalletSuccessData) => void }) {
  const { user, getToken } = useFirebaseAuth();
  const { createWalletAsync, isLoading } = useCreateWallet();

  const [encryptKey, setEncryptKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [walletData, setWalletData] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<{ iss?: string; aud?: string; sub?: string } | null>(null);

  const handleCreateWallet = async () => {
    if (!encryptKey) {
      setError('Por favor ingresa una clave de encriptación');
      return;
    }

    if (encryptKey.length < 8) {
      setError('La clave debe tener al menos 8 caracteres');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setWalletData(null);
      setDebugInfo(null);

      if (!user) {
        setError('No hay usuario autenticado. Por favor inicia sesión primero.');
        return;
      }

      // Obtener Bearer Token de Firebase
      const bearerToken = await getToken();

      if (!bearerToken) {
        setError('No se pudo obtener el token de autenticación.');
        return;
      }

      // DEBUG: Decodificar y mostrar claims del token
      try {
        // Simple base64 decode for debug purposes to avoid adding heavy libs if not needed, 
        // but since we have 'jose' in package.json (from previous view), we could import it. 
        // Let's use simple JSON parse of the payload part.
        const [, payload] = bearerToken.split('.');
        const decoded = JSON.parse(atob(payload));
        console.log('JWT Debug:', decoded);
        setDebugInfo({
          iss: decoded.iss,
          aud: decoded.aud,
          sub: decoded.sub
        });
      } catch (e) {
        console.error('Error decoding token for debug:', e);
      }

      // Crear billetera con ChipiPay
      const response = await createWalletAsync({
        params: {
          encryptKey,
          externalUserId: user.uid,
        },
        bearerToken,
      });

      // Guardar información de la billetera
      setWalletData({
        publicKey: response.wallet.publicKey,
        // walletId: response.wallet.id, // Removed to fix TS error
        userId: user.uid,
        email: user.email,
      });

      setSuccess(`¡Billetera creada exitosamente! Clave pública: ${response.wallet.publicKey}`);
      if (onSuccess) {
        onSuccess({
          publicKey: response.wallet.publicKey,
          // The type definition might not include 'id', but publicKey is a unique identifier for us
          walletId: response.wallet.publicKey,
          encryptKey
        });
      }
      // Keep encryptKey for a moment or clear it? If we clear it, parent has it.
      // setEncryptKey(''); 

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear billetera';
      setError(errorMessage);
      console.error('Error creando billetera:', error);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden max-w-md w-full mx-auto relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

      <div className="p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Crear Billetera</h2>
          <p className="text-gray-500 text-sm mt-2">
            Configura tu identidad digital segura para operar sin gas.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 border-l-4 border-red-500">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-1 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
            {debugInfo && (
              <div className="mt-3 pt-3 border-t border-red-100 text-xs font-mono text-red-600 bg-red-50/50 p-2 rounded">
                <p className="font-bold">Debug Info:</p>
                <p>iss: {debugInfo.iss}</p>
                <p>aud: {debugInfo.aud}</p>
              </div>
            )}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 border-l-4 border-green-500">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">¡Éxito!</h3>
                <div className="mt-1 text-sm text-green-700">
                  {success}
                </div>
              </div>
            </div>
          </div>
        )}

        <form
          className="space-y-6"
          method="post"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void handleCreateWallet();
          }}
        >
          <div>
            <label htmlFor="encryptKey" className="block text-sm font-bold text-gray-700 mb-2">
              Crea tu PIN de Acceso
            </label>
            <div className="relative">
              <input
                id="encryptKey"
                name="encryptKey"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={encryptKey}
                onChange={(e) => setEncryptKey(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none
                         disabled:bg-gray-50 disabled:text-gray-500 transition-all text-lg tracking-widest"
              />
            </div>
            <p className="mt-2 text-xs text-gray-400 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Mínimo 8 caracteres. No la compartas.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !encryptKey}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg
                   hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                   disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.99] transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando Billetera Segura...
              </span>
            ) : 'Crear Billetera'}
          </button>
        </form>
      </div>

      <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
        <span>🔒 End-to-End Encrypted</span>
        <span>ChipiPay Secure Core</span>
      </div>
    </div>
  );
}
