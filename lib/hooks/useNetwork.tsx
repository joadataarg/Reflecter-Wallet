'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { logger } from '../utils/logger';
import { createSDKError, ErrorCode } from '../utils/errors';

export type NetworkType = 'SEPOLIA' | 'MAINNET';

type NetworkContextType = {
  network: NetworkType;
  setNetwork: (network: NetworkType) => void;
  toggleNetwork: () => void;
  isMainnet: boolean;
  isSepolia: boolean;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network] = useState<NetworkType>('MAINNET');

  // No switching allowed in production
  const setNetwork = (newNetwork: NetworkType) => {
    logger.debug('Network switching is disabled in production', { attempt: newNetwork });
  };

  const toggleNetwork = () => {
    logger.debug('Network toggling is disabled in production');
  };

  const value = {
    network,
    setNetwork,
    toggleNetwork,
    isMainnet: true,
    isSepolia: false,
  };

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    const err = createSDKError(ErrorCode.CONFIG_INVALID, { hook: 'useNetwork' });
    logger.error('useNetwork used outside of NetworkProvider');
    throw err;
  }
  return context;
}

/**
 * Simple helper to get current network without context (for SSR or configs)
 */
export function getCurrentNetwork(): NetworkType {
  return 'MAINNET';
}
