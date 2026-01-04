import { useState, useEffect } from 'react';
import { getTokenTransfers, TokenTransfer } from '@/lib/services/starknetTransfers';

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

        // Usar la nueva función de starknet.js
        const transfers: TokenTransfer[] = await getTokenTransfers(walletAddress);

        // Convertir al formato esperado por el componente
        const formattedTransactions: Transaction[] = transfers.map((transfer) => ({
          hash: transfer.transactionHash,
          timestamp: transfer.timestamp,
          type: transfer.type === 'incoming' ? 'TRANSFER_IN' : 'TRANSFER_OUT',
          token: transfer.token,
          amount: transfer.amount,
          from: transfer.type === 'incoming' ? transfer.counterpartAddress : walletAddress,
          to: transfer.type === 'outgoing' ? transfer.counterpartAddress : walletAddress,
          status: 'SUCCESS', // Asumimos éxito ya que estamos obteniendo eventos exitosos
          age: getRelativeTime(transfer.timestamp)
        }));

        setTransactions(formattedTransactions);
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
