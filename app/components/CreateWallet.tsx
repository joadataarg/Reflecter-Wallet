'use client';

import { useState } from 'react';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useCreateWallet } from '@chipi-stack/nextjs';
import { deriveEncryptKey } from '@/lib/utils/deriveEncryptKey';
import { logger } from '@/lib/utils/logger';
import { getErrorMessage } from '@/lib/utils/errors';

/**
 * Component to create a ChipiPay wallet
 * Integrates Firebase Auth with ChipiPay for encrypted wallets
 */
type WalletSuccessData = {
  publicKey: string;
  walletId: string;
  encryptKey: string;
};

export default function CreateWallet({ onSuccess }: { onSuccess?: (data: WalletSuccessData) => void }) {
  const { user, getToken } = useFirebaseAuth();
  const { createWalletAsync, isLoading } = useCreateWallet();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [walletData, setWalletData] = useState<any>(null);

  const handleCreateWallet = async () => {
    try {
      setError('');
      setSuccess('');
      setWalletData(null);

      if (!user) {
        setError('No hay usuario autenticado. Por favor inicia sesión primero.');
        return;
      }

      logger.audit('Initiating wallet creation', { uid: user.uid });

      // Get Bearer Token from Firebase
      const bearerToken = await getToken();

      if (!bearerToken) {
        setError('No se pudo obtener el token de autenticación.');
        return;
      }

      // Derivar encryptKey automáticamente desde el UID para UX sin PIN
      // Este proceso es ahora asíncrono y mucho más seguro (PBKDF2)
      const encryptKey = await deriveEncryptKey(user.uid);

      // Create wallet with ChipiPay
      const response = await createWalletAsync({
        params: {
          encryptKey,
          externalUserId: user.uid,
        },
        bearerToken,
      });

      const starknetAddress = response.wallet.normalizedPublicKey || response.wallet.publicKey;

      logger.audit('Wallet created successfully', {
        address: starknetAddress,
        uid: user.uid
      });

      setWalletData({
        publicKey: starknetAddress,
        rawPublicKey: response.wallet.publicKey,
        userId: user.uid,
        email: user.email,
      });

      setSuccess(`¡Billetera creada exitosamente! Dirección Starknet: ${starknetAddress}`);

      if (onSuccess) {
        onSuccess({
          publicKey: starknetAddress,
          walletId: response.wallet.publicKey,
          encryptKey
        });
      }

    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      logger.error('Failed to create wallet', { error: err });
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

        {walletData && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 break-all">
            <p className="text-xs text-gray-500 mb-1 uppercase font-semibold">Tu Dirección</p>
            <p className="text-sm font-mono text-gray-800">{walletData.publicKey}</p>
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
          <button
            type="submit"
            disabled={isLoading}
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
        <span>🔒 PBKDF2 Encrypted</span>
        <span>ChipiPay Secure Core</span>
      </div>
    </div>
  );
}
