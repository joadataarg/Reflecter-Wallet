/**
 * @reflecterwallet/app - Punto de entrada principal
 * Reflecter Wallet - Your Starknet Wallet Without Seed Phrases
 */

// Autenticación
export * from './hooks/useFirebaseAuth';

// Wallet y Balances
export * from './hooks/useFetchWallet';
export * from './hooks/useTokenBalance';
export * from './hooks/useSendAssets';

// Utilidades Core
export * from './utils/logger';
export * from './utils/errors';
export * from './utils/deriveEncryptKey';
export * from './utils/formatAddress';

// Configuración y Tipos
export * from './types';
export { FEATURE_FLAGS, isEnabled } from './config/featureFlags';
export { getCurrentNetwork } from './hooks/useNetwork';

/**
 * Nota: Vesu protoloco queda minimizado por ahora 
 * pero se mantienen los hooks básicos para compatibilidad.
 */
export * from './hooks/useVesuPosition';
export * from './hooks/useVesuTransaction';
