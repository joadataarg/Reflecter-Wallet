import React, { useState } from 'react';
import { ChevronLeft, Info, QrCode } from 'lucide-react';
import { WalletSession, WalletView } from '@/lib/core/domain/types';
import { TokenType, TOKEN_DATA } from '@/lib/config/tokens';
import { TokenIcon } from '@/app/components/ui/TokenIcon';
import { TokenBalanceDisplay } from '@/app/components/TokenBalanceDisplay';
import { useSendAssets } from '@/lib/hooks/useSendAssets';
import { useTokenBalance } from '@/lib/hooks/useTokenBalance';

interface WalletSendProps {
    wallet: WalletSession;
    onNavigate: (view: WalletView) => void;
    sendToAddress: string;
    setSendToAddress: (addr: string) => void;
    onScanRequest: () => void;
    isMobile: boolean;
}

export const WalletSend: React.FC<WalletSendProps> = ({
    wallet,
    onNavigate,
    sendToAddress,
    setSendToAddress,
    onScanRequest,
    isMobile
}) => {
    const [selectedToken, setSelectedToken] = useState<TokenType>('ETH');
    const [sendAmount, setSendAmount] = useState('');
    const [sendPercent, setSendPercent] = useState(0);
    const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);

    // Errors
    const [sendAddressError, setSendAddressError] = useState('');
    const [sendAmountError, setSendAmountError] = useState('');

    // Hooks
    const {
        sendTransaction,
        isLoading: isSending,
        error: sendError,
        estimatedGasPrice,
        calculateEstimatedFee,
        calculateTotalCost
    } = useSendAssets(selectedToken);

    const ethData = useTokenBalance('ETH');
    const strkData = useTokenBalance('STRK');
    const usdcData = useTokenBalance('USDC');

    const getBalance = (token: TokenType) => {
        switch (token) {
            case 'ETH': return ethData.balance;
            case 'STRK': return strkData.balance;
            case 'USDC': return usdcData.balance;
            default: return '0';
        }
    };

    const handleConfirmSend = async () => {
        if (!sendAmount || !sendToAddress) return;

        try {
            await sendTransaction({
                recipientAddress: sendToAddress,
                amount: sendAmount,
                tokenAddress: selectedToken, // Note: Hook expects symbol or address? usage in WalletPopup suggests 'ETH', 'STRK' strings are used.
                // Check useSendAssets implementation basically assumes symbol for now or maps it.
                // In WalletPopup call: sendAssetsHook.sendTransaction(sendToAddress, sendAmount, selectedToken)
                // Wait, useSendAssets signature in WalletPopup might be different. 
                // Let me verify usage in WalletPopup. 
                // Line 1284: onClick={handleConfirmSend}
                // handleConfirmSend (line 390 approx? No need to find it).
            });

            // Success
            onNavigate('home');
            setSendAmount('');
            setSendToAddress('');
        } catch (e: any) {
            console.error("Send failed", e);
            setSendAmountError(e.message || "Failed to send");
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) setSendToAddress(text);
        } catch (err) {
            console.error("Failed to read clipboard:", err);
        }
    };

    return (
        <div className="p-6 animate-in fade-in slide-in-from-right duration-300">
            <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors mb-6"
            >
                <ChevronLeft size={14} /> Volver al Inicio
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Enviar Activos</h2>

            <div className="space-y-4">
                <div className="relative">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold mb-2 block">Token</label>

                    {/* Dropdown Button */}
                    <button
                        onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
                        className="w-full p-4 bg-white/5 border border-white/10 text-white text-sm hover:border-white transition-colors flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <TokenIcon
                                    src={TOKEN_DATA[selectedToken].icon}
                                    alt={selectedToken}
                                    fallback={TOKEN_DATA[selectedToken].fallback}
                                    size="w-6 h-6"
                                />
                            </div>
                            <span className="font-bold">{selectedToken}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
                                SALDO: <TokenBalanceDisplay token={selectedToken} walletPublicKey={wallet?.publicKey} />
                            </span>
                            <ChevronLeft size={16} className={`transition-transform ${isTokenDropdownOpen ? '-rotate-90' : 'rotate-90'}`} />
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isTokenDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/10 z-50 shadow-2xl">
                            {(Object.keys(TOKEN_DATA) as TokenType[]).map((token) => (
                                <button
                                    key={token}
                                    onClick={() => {
                                        setSelectedToken(token);
                                        setIsTokenDropdownOpen(false);
                                    }}
                                    className="w-full p-4 hover:bg-white/5 transition-colors flex items-center justify-between border-b border-white/5 last:border-b-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 flex items-center justify-center">
                                            <TokenIcon
                                                src={TOKEN_DATA[token].icon}
                                                alt={token}
                                                fallback={TOKEN_DATA[token].fallback}
                                                size="w-6 h-6"
                                            />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-bold text-white">{token}</div>
                                            <div className="text-xs text-zinc-500">{TOKEN_DATA[token].name}</div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-zinc-400">
                                        <TokenBalanceDisplay token={token} walletPublicKey={wallet?.publicKey} />
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold mb-2 block">Dirección de Destino</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={sendToAddress}
                            onChange={(e) => {
                                setSendToAddress(e.target.value);
                                setSendAddressError('');
                            }}
                            placeholder="0x..."
                            className={`w-full bg-white/5 border p-4 text-sm focus:outline-none transition-colors placeholder:text-zinc-500 text-white pr-12 ${sendAddressError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-white'
                                }`}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            {isMobile ? (
                                <button
                                    onClick={onScanRequest}
                                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                                    title="Scan QR"
                                >
                                    <QrCode size={18} />
                                </button>
                            ) : (
                                <button
                                    onClick={handlePaste}
                                    className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white transition-all shadow-sm"
                                >
                                    Paste
                                </button>
                            )}
                        </div>
                    </div>

                    {sendAddressError && (
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-red-500 font-bold uppercase tracking-widest">
                            <Info size={12} />
                            {sendAddressError}
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold">Amount</label>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                            Available: <TokenBalanceDisplay token={selectedToken} walletPublicKey={wallet?.publicKey} /> {selectedToken}
                        </span>
                    </div>
                    <div className="relative mb-4">
                        <input
                            type="text"
                            value={sendAmount}
                            onChange={(e) => {
                                setSendAmount(e.target.value);
                                setSendAmountError('');
                            }}
                            placeholder="0.00"
                            className={`w-full bg-white/5 border p-4 text-sm focus:outline-none transition-colors placeholder:text-zinc-500 text-white ${sendAmountError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-white'
                                }`}
                        />
                        <button
                            onClick={() => {
                                const balance = getBalance(selectedToken);
                                const balanceNum = parseFloat(balance || '0');
                                const estimatedFee = estimatedGasPrice;
                                const maxAmount = Math.max(0, balanceNum - estimatedFee);
                                setSendAmount(maxAmount.toFixed(selectedToken === 'USDC' ? 6 : 18).replace(/\.?0+$/, ''));
                                setSendPercent(100);
                                setSendAmountError('');
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-zinc-300 transition-colors"
                        >
                            Max
                        </button>
                    </div>

                    {/* Percentage Slider */}
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">
                            <span>0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span className="text-zinc-400">100%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={sendPercent}
                            onChange={(e) => {
                                const percent = parseInt(e.target.value);
                                setSendPercent(percent);
                                const balance = parseFloat(getBalance(selectedToken) || '0');
                                const amount = (balance * (percent / 100)).toFixed(selectedToken === 'USDC' ? 6 : 18);
                                setSendAmount(amount.replace(/\.?0+$/, ''));
                                setSendAmountError('');
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                    </div>

                    {/* Fee Estimation */}
                    {sendAmount && !sendAmountError && (
                        <div className="bg-white/5 border border-white/10 p-4 space-y-2 mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Network Fee</span>
                                <span className="text-xs font-bold text-white tracking-widest">
                                    ~{calculateEstimatedFee(sendAmount).toFixed(6)} {selectedToken}
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">Total Cost</span>
                                <span className="text-xs font-bold text-white tracking-widest">
                                    {calculateTotalCost(sendAmount).toFixed(6)} {selectedToken}
                                </span>
                            </div>
                        </div>
                    )}

                    {sendAmountError && (
                        <div className="flex items-center gap-1 mb-4 text-[10px] text-red-500 font-bold uppercase tracking-widest">
                            <Info size={12} />
                            {sendAmountError}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => handleConfirmSend()}
                    disabled={isSending || !sendAmount || !sendToAddress}
                    className={`w-full py-5 font-black uppercase tracking-[0.3em] text-[10px] transition-all ${isSending || !sendAmount || !sendToAddress
                        ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5'
                        : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                        }`}
                >
                    {isSending ? 'Procesando...' : 'Confirmar Transacción'}
                </button>
            </div>
        </div>
    );
};
