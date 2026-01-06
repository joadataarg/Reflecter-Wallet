'use client';

import React, { useState } from 'react';
import { ChevronDown, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import { useTransactionHistory } from '@/lib/hooks/useTransactionHistory';

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

interface TransactionHistoryProps {
  walletAddress?: string;
  network?: 'MAINNET' | 'SEPOLIA';
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  walletAddress,
  network = 'MAINNET'
}) => {
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const { transactions, loading, error } = useTransactionHistory(walletAddress || '', network);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getTokenColor = (token: string) => {
    switch (token) {
      case 'ETH': return 'from-blue-500 to-purple-600';
      case 'STRK': return 'from-purple-600 to-pink-600';
      case 'USDC': return 'from-blue-600 to-teal-600';
      default: return 'from-zinc-500 to-zinc-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      case 'FAILED': return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400 text-sm">Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-400 text-sm">Error loading transactions: {error}</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div key={tx.hash} className="border border-white/10 rounded-lg overflow-hidden">
          {/* Summary Row */}
          <button
            onClick={() => setExpandedTx(expandedTx === tx.hash ? null : tx.hash)}
            className="w-full p-4 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 flex-1 text-left">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTokenColor(tx.token)} flex items-center justify-center flex-shrink-0`}>
                {tx.type === 'TRANSFER_IN' ? (
                  <ArrowDown size={18} className="text-white" />
                ) : (
                  <ArrowUp size={18} className="text-white" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-white">
                    {tx.type === 'TRANSFER_IN' ? 'Received' : 'Sent'} {tx.token}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest border px-2 py-0.5 rounded ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500">
                  {tx.type === 'TRANSFER_IN' ? 'From' : 'To'}: {formatAddress(tx.type === 'TRANSFER_IN' ? tx.from : tx.to)}
                </div>
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <div className={`text-sm font-bold ${tx.type === 'TRANSFER_IN' ? 'text-emerald-500' : 'text-white'}`}>
                  {tx.type === 'TRANSFER_IN' ? '+' : '-'}{tx.amount} {tx.token}
                </div>
                <div className="text-[10px] text-zinc-500">{tx.age}</div>
              </div>

              {/* Chevron */}
              <div className={`text-zinc-500 group-hover:text-white transition-all ${expandedTx === tx.hash ? 'rotate-180' : ''}`}>
                <ChevronDown size={18} />
              </div>
            </div>
          </button>

          {/* Details Row - Expandible */}
          {expandedTx === tx.hash && (
            <div className="bg-black/50 border-t border-white/10 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Transaction Hash</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-white font-mono bg-white/5 p-2 rounded flex-1 break-all">
                        {tx.hash}
                      </code>
                      <a
                        href={`https://${network === 'MAINNET' ? 'starkscan.co' : 'sepolia.starkscan.co'}/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-zinc-500 hover:text-white transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">From Address</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-white font-mono bg-white/5 p-2 rounded flex-1 break-all">
                        {tx.from}
                      </code>
                      <a
                        href={`https://${network === 'MAINNET' ? 'starkscan.co' : 'sepolia.starkscan.co'}/contract/${tx.from}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-zinc-500 hover:text-white transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">To Address</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-white font-mono bg-white/5 p-2 rounded flex-1 break-all">
                        {tx.to}
                      </code>
                      <a
                        href={`https://${network === 'MAINNET' ? 'starkscan.co' : 'sepolia.starkscan.co'}/contract/${tx.to}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-zinc-500 hover:text-white transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Amount & Token</div>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getTokenColor(tx.token)} flex items-center justify-center`}>
                        <span className="text-xs font-bold text-white">{tx.token.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{tx.amount} {tx.token}</div>
                        <div className="text-[10px] text-zinc-500">Token Transfer</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="border-t border-white/10 pt-4 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Status</div>
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-widest border px-3 py-1 rounded ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Type</div>
                  <div className="text-sm font-bold text-white">{tx.type === 'TRANSFER_IN' ? 'Inflow' : 'Outflow'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Age</div>
                  <div className="text-sm font-bold text-white">{tx.age}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
