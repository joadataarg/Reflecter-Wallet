/**
 * Global Type Definitions for Reflecter Wallet
 */

import { ErrorCode } from './utils/errors';

export enum WalletState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  SETTINGS = 'SETTINGS'
}

export type NetworkType = 'SEPOLIA' | 'MAINNET';

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  rawBalance: string;
  valueUsd?: string;
  icon: string;
  decimals: number;
}

export interface VesuPosition {
  asset: string;
  supplyBalance: string;
  debtBalance: string;
  apy: string;
  walletBalance: string;
}

export interface UserSession {
  address: string;
  email?: string;
  uid: string;
  network: NetworkType;
}

/**
 * SDK Configuration interface
 */
export interface SDKConfig {
  apiKey: string;
  network: NetworkType;
  debug?: boolean;
}

/**
 * Common response pattern for SDK operations
 */
export interface SDKResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
  };
}
