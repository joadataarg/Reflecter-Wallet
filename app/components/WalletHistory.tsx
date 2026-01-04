'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
import { useTokenTransfers } from '@/lib/services/starknetTransfers';

interface WalletHistoryProps {
  walletAddress: string;
}

/**
 * Componente simple para mostrar el historial de transacciones en la sección History de la wallet
 */
export function WalletHistory({ walletAddress }: WalletHistoryProps) {
  const { transfers, loading, error } = useTokenTransfers(walletAddress);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400 text-sm">Loading transaction history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-400 text-sm">Error: {error}</div>
      </div>
    );
  }

  if (transfers.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400 text-sm">No transactions found</div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTokenIcon = (token: string) => {
    const icons = {
      ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      STRK: 'https://www.starknet.io/assets/starknet-logo.svg',
      USDC: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    };
    return icons[token as keyof typeof icons] || '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Transaction History</h3>
        <span className="text-xs text-zinc-400">{transfers.length} transactions</span>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {transfers.map((transfer, index) => (
          <div
            key={`${transfer.transactionHash}-${index}`}
            className="flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-lg hover:bg-zinc-900/70 transition-colors"
          >
            {/* Icono y dirección */}
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                transfer.type === 'incoming'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {transfer.type === 'incoming' ? (
                  <ArrowDownLeft size={16} />
                ) : (
                  <ArrowUpRight size={16} />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <img
                    src={getTokenIcon(transfer.token)}
                    alt={transfer.token}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-sm font-bold text-white">
                    {transfer.type === 'incoming' ? 'Received' : 'Sent'} {transfer.token}
                  </span>
                </div>
                <div className="text-xs text-zinc-400">
                  {transfer.counterpartAddress.slice(0, 6)}...{transfer.counterpartAddress.slice(-4)}
                </div>
                <div className="text-xs text-zinc-500">
                  {formatDate(transfer.timestamp)}
                </div>
              </div>
            </div>

            {/* Monto y link */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className={`text-sm font-bold ${
                  transfer.type === 'incoming' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transfer.type === 'incoming' ? '+' : '-'}{transfer.amount} {transfer.token}
                </div>
              </div>

              <a
                href={`https://starkscan.co/tx/${transfer.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-zinc-400 hover:text-white transition-colors"
                title="View on Starkscan"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}