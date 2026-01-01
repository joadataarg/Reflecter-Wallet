
export enum WalletState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  SETTINGS = 'SETTINGS'
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  valueUsd: string;
  icon: string;
}

export interface UserSession {
  address: string;
  email?: string;
  network: 'mainnet' | 'sepolia';
}
