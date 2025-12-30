'use client';

import { useState } from 'react';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useCreateWallet } from '@chipi-stack/nextjs';

/**
 * Componente para crear una billetera de ChipiPay
 * Integra Firebase Auth con ChipiPay para crear billeteras
 * encriptadas y asociadas a usuarios.
 */
export default function CreateWallet() {
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
      setEncryptKey('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear billetera';
      setError(errorMessage);
      console.error('Error creando billetera:', error);
    }
  };

  return (
    <div className="space-y-4 p-6 border border-gray-300 rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Crear Billetera ChipiPay</h2>
      <p className="text-sm text-gray-600">
        Crea una billetera encriptada para realizar transacciones gasless en Vesu.
      </p>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-800 text-sm">
          <p className="font-bold">Error: {error}</p>
          {debugInfo && (
            <div className="mt-4 p-2 bg-white rounded border border-red-200 text-xs font-mono">
              <p className="font-bold text-gray-700 mb-1">Información de depuración (Usa esto en ChipiPay Dashboard):</p>
              <p>Issuer (iss): <span className="text-blue-600 select-all">{debugInfo.iss}</span></p>
              <p>Audience (aud): <span className="text-blue-600 select-all">{debugInfo.aud}</span></p>
              <p>User ID (sub): <span className="text-blue-600 select-all">{debugInfo.sub}</span></p>
            </div>
          )}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4 text-green-800 text-sm">
          {success}
        </div>
      )}

      {walletData && (
        <div className="rounded-md bg-blue-50 p-4 space-y-2 text-sm">
          <div>
            <span className="font-semibold text-blue-900">Usuario:</span>
            <p className="text-blue-800">{walletData.email}</p>
          </div>
          <div>
            <span className="font-semibold text-blue-900">Clave Pública:</span>
            <p className="text-blue-800 break-all font-mono text-xs">{walletData.publicKey}</p>
          </div>
        </div>
      )}

      <form
        className="space-y-3"
        method="post"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void handleCreateWallet();
        }}
      >
        <div>
          <label htmlFor="encryptKey" className="block text-sm font-medium text-gray-700 mb-2">
            Clave de Encriptación
          </label>
          <input
            id="encryptKey"
            name="encryptKey"
            type="password"
            autoComplete="new-password"
            placeholder="Ingresa tu clave de encriptación (mín. 8 caracteres)"
            value={encryptKey}
            onChange={(e) => setEncryptKey(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:border-blue-500 focus:outline-none focus:ring-blue-500 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">
            Esta clave encriptará tu billetera. Guárdala en un lugar seguro.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !encryptKey}
          className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600
                   transition-colors"
        >
          {isLoading ? 'Creando billetera...' : 'Crear Billetera'}
        </button>
      </form>

      <div className="pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
        <p>• Tu billetera será encriptada y almacenada de forma segura</p>
        <p>• Solo tú tienes acceso a tu billetera con tu clave de encriptación</p>
        <p>• Puedes usar esta billetera para transacciones gasless con Vesu</p>
      </div>
    </div>
  );
}
