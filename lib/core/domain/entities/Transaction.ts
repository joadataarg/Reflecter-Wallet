export type TransactionType = 'incoming' | 'outgoing';
export type TransactionStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export interface Transaction {
    hash: string;
    timestamp: number;
    type: TransactionType;
    token: 'ETH' | 'STRK' | 'USDC';
    amount: string;
    from: string;
    to: string;
    status: TransactionStatus;
    blockNumber?: number;
}
