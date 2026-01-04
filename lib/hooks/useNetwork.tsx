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
  const [network, setNetworkState] = useState<NetworkType>('SEPOLIA');

  // Load saved network from localStorage on mount
  useEffect(() => {
    try {
      const savedNetwork = localStorage.getItem('starknet_network') as NetworkType;
      if (savedNetwork && (savedNetwork === 'SEPOLIA' || savedNetwork === 'MAINNET')) {
        setNetworkState(savedNetwork);
        logger.debug('Network loaded from storage', { network: savedNetwork });
      }
    } catch (e) {
      logger.error('Failed to load network from storage', { error: e });
    }
  }, []);

  const setNetwork = (newNetwork: NetworkType) => {
    try {
      setNetworkState(newNetwork);
      localStorage.setItem('starknet_network', newNetwork);
      logger.audit('Network changed', { from: network, to: newNetwork });

      // Reload page to apply config changes across all providers
      // Note: In a pure SPA this should be handled via state, 
      // but for heavy config changes, a reload is safer.
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (e) {
      const sdkError = createSDKError(ErrorCode.CONFIG_INVALID, { newNetwork }, e);
      logger.error('Failed to set network', { error: sdkError.message });
      throw sdkError;
    }
  };

  const toggleNetwork = () => {
    const newNetwork = network === 'MAINNET' ? 'SEPOLIA' : 'MAINNET';
    setNetwork(newNetwork);
  };

  const value = {
    network,
    setNetwork,
    toggleNetwork,
    isMainnet: network === 'MAINNET',
    isSepolia: network === 'SEPOLIA',
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
  if (typeof window === 'undefined') {
    return 'SEPOLIA'; // Default for SSR
  }
  try {
    const saved = localStorage.getItem('starknet_network') as NetworkType;
    return saved && (saved === 'SEPOLIA' || saved === 'MAINNET') ? saved : 'SEPOLIA';
  } catch (e) {
    return 'SEPOLIA';
  }
}
