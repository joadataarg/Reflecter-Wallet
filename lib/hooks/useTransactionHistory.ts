import { useState, useEffect } from 'react';

interface Transaction {
  hash: string;
  timestamp: number;
  type: 'TRANSFER_IN' | 'TRANSFER_OUT';
  token: 'ETH' | 'STRK' | 'USDC';
  amount: string;
  from: string;
  to: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  age: string;
}

interface UseTransactionHistoryResult {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch transaction history using starknet.js
 * @param walletAddress - The wallet address to fetch history for
 * @param network - Network to query (MAINNET or SEPOLIA) - currently only MAINNET supported
 * @returns Object with transactions, loading state, and error
 */
export function useTransactionHistory(
  walletAddress: string,
  network: 'MAINNET' | 'SEPOLIA' = 'MAINNET'
): UseTransactionHistoryResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!walletAddress) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Architecture Hexagonal: Use Repository
        const { StarkscanTransactionRepository } = await import('@/lib/infrastructure/repositories/StarkscanTransactionRepository');
        const repo = new StarkscanTransactionRepository();
        const data = await repo.getTransactionsByAddress(walletAddress);

        // Map domain entities to hook format (they are already compatible)
        const hookTransactions: Transaction[] = data.map(tx => ({
          hash: tx.hash,
          timestamp: tx.timestamp,
          type: tx.type === 'incoming' ? 'TRANSFER_IN' : 'TRANSFER_OUT',
          token: tx.token,
          amount: tx.amount,
          from: tx.from,
          to: tx.to,
          status: tx.status,
          age: getRelativeTime(tx.timestamp)
        }));

        setTransactions(hookTransactions);
      } catch (err) {
        console.error('Error fetching transaction history:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [walletAddress, network]);

  return { transactions, loading, error };
}

/**
 * Helper function to get relative time string
 */
function getRelativeTime(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;

  return new Date(timestamp * 1000).toLocaleDateString();
}
