'use client';

import React from 'react';
import { AlertCircle, ChevronLeft, Sparkles } from 'lucide-react';

interface BotsTradingOrchestratorProps {
  onBack?: () => void;
  isWalletView?: boolean;
}

export const BotsTradingOrchestrator: React.FC<BotsTradingOrchestratorProps> = ({ 
  onBack, 
  isWalletView = false 
}) => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Back Button - Solo en wallet */}
      {isWalletView && onBack && (
        <div className="px-6 pt-6 pb-4 border-b border-white/10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={14} /> Back to Assets
          </button>
        </div>
      )}

      {/* Coming Soon Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center mb-6">
          <Sparkles size={32} className="text-purple-400" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">
          Automated Trading Bots
        </h2>

        <p className="text-zinc-400 text-sm mb-8 max-w-sm">
          Our AI-powered trading bot orchestration is coming soon. Configure advanced trading strategies and automate your portfolio management.
        </p>

        {/* Coming Soon Features */}
        <div className="w-full max-w-md space-y-3 mb-8">
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-white font-bold">Grid Trading Strategies</span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">Automated buy/sell grid execution</p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-white font-bold">DCA Automation</span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">Dollar-cost averaging on schedule</p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-white font-bold">Smart Order Routing</span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">AI-optimized execution paths</p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-white font-bold">Performance Analytics</span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">Real-time bot performance tracking</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="w-full max-w-md p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg flex gap-3">
          <AlertCircle size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <div className="text-sm font-bold text-purple-400 mb-1">Coming Soon</div>
            <p className="text-[10px] text-purple-300/80">
              Join our waitlist to be notified when this feature launches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
