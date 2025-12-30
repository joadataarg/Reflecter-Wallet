'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import CreateWallet from '@/app/components/CreateWallet';

export default function DashboardPage() {
  const { user, loading, signOut } = useFirebaseAuth();
  const router = useRouter();

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Bienvenido, {user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">Información de sesión</h2>
            <dl className="mt-4 space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-600">Email</dt>
                <dd className="text-sm text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">ID de usuario</dt>
                <dd className="text-sm text-gray-900">{user.uid}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">Último acceso</dt>
                <dd className="text-sm text-gray-900">
                  {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString('es-ES') : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>

          <CreateWallet />
        </div>

        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900">Próximos pasos</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-gray-600">
            <li>✅ Autenticación con Firebase completada</li>
            <li>✅ Integración con Google JWKS</li>
            <li>✅ ChipiProvider integrado</li>
            <li>⏳ Crear una billetera ChipiPay (arriba)</li>
            <li>⏳ Conectar con Vesu para depósitos en vTokens</li>
            <li>⏳ Realizar transacciones gasless</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
