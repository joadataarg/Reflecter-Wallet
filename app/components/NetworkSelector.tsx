'use client';

import { useNetwork, NetworkType } from '@/lib/hooks/useNetwork.tsx';
import { Globe, AlertCircle, Lock } from 'lucide-react';

export default function NetworkSelector() {
  const { network, setNetwork } = useNetwork();

  const handleNetworkChange = (newNetwork: NetworkType) => {
    if (newNetwork !== network) {
      const confirmed = window.confirm(
        `Switch to ${newNetwork === 'MAINNET' ? 'Mainnet' : 'Sepolia Testnet'}?\n\nThe page will reload to apply changes.`
      );
      if (confirmed) {
        setNetwork(newNetwork);
      }
    }
  };

  return (
    <div className="border border-white/10 bg-black rounded-xl shadow-[0_0_100px_rgba(255,255,255,0.05)] p-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Globe size={14} className="text-white" />
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">Blockchain Network</h3>
        </div>
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Starknet</p>
      </div>

      {/* Network Selector Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {/* Sepolia Testnet (Locked) */}
        <button
          onClick={() => alert('Coming Soon!\n\nSepolia testnet is under development and will be available soon. For now, you can only operate on Mainnet.')}
          className="relative p-3 rounded-lg border border-white/5 bg-white/5 opacity-50 cursor-not-allowed group transition-all duration-200 text-left"
        >
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <Lock size={10} className="text-zinc-500" />
            <span className="text-[7px] font-bold uppercase tracking-widest bg-zinc-800 px-1 py-0.5 rounded text-zinc-400">Soon</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Sepolia
            </p>
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Testnet</p>
          </div>
        </button>

        {/* Mainnet */}
        <button
          onClick={() => handleNetworkChange('MAINNET')}
          className={`relative p-3 rounded-lg border transition-all duration-200 text-left ${network === 'MAINNET'
            ? 'border-green-400/50 bg-green-400/10'
            : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
        >
          {network === 'MAINNET' && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"></div>
          )}
          <div className="space-y-1">
            <p className={`text-xs font-bold uppercase tracking-widest ${network === 'MAINNET' ? 'text-green-400' : 'text-white'}`}>
              Mainnet
            </p>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Production</p>
          </div>
        </button>
      </div>

      {/* Network Info */}
      <div className="pt-3 border-t border-white/10">
        <div className="flex items-start gap-2 text-[10px]">
          <AlertCircle size={14} className={`flex-shrink-0 mt-0.5 ${network === 'MAINNET' ? 'text-orange-400' : 'text-blue-400'}`} />
          <p className="text-zinc-400 leading-relaxed uppercase tracking-widest font-bold">
            {network === 'SEPOLIA' ? (
              <>
                Testnet: Get free ETH from <a href="https://starknet-faucet.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-zinc-300 underline">
                  faucets
                </a>
              </>
            ) : (
              <>
                ⚠️ Real network. Requires tokens with economic value
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
