'use client';

import { useState } from 'react';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useVesuTransaction } from '@/lib/hooks/useVesuTransaction';
import { useVesuPosition } from '@/lib/hooks/useVesuPosition';
import { VESU_CONFIG } from '@/lib/vesu/config';

// Temporary type for props until we have global context
type WalletInfo = {
    walletId: string;
    publicKey: string;
};

export default function VesuLending({ walletInfo, encryptKey }: { walletInfo: WalletInfo, encryptKey: string }) {
    const { user, getToken } = useFirebaseAuth();
    const { approve, deposit, withdraw, isLoading: txLoading, error: txError, txHash } = useVesuTransaction();
    const { positions, loading: dataLoading, refetch } = useVesuPosition(walletInfo?.publicKey);

    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
    const [amount, setAmount] = useState('');
    const [selectedAsset, setSelectedAsset] = useState('USDC');
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);

    const config = VESU_CONFIG;

    const handleAction = async () => {
        setStatus(null);
        if (!user || !walletInfo || !encryptKey) {
            setStatus({ type: 'error', message: 'Faltan datos de la billetera (PIN o Usuario)' });
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setStatus({ type: 'error', message: 'Ingresa una cantidad válida' });
            return;
        }

        try {
            const bearerToken = await getToken();
            if (!bearerToken) throw new Error('No auth token');

            // Prepare common params
            const params = {
                encryptKey,
                bearerToken,
                userAddress: walletInfo.publicKey,
                walletData: {
                    id: walletInfo.walletId,
                    publicKey: walletInfo.publicKey
                }
            };

            const tokenConfig = config.tokens[selectedAsset as keyof typeof config.tokens];
            const vTokenAddress = config.vTokens[selectedAsset as keyof typeof config.vTokens];

            if (!vTokenAddress || vTokenAddress.includes('__')) {
                setStatus({ type: 'error', message: 'Contrato no configurado para este activo en esta red.' });
                return;
            }

            // SIMULATION MODE CHECK
            const vTokenLower = vTokenAddress.toLowerCase();
            const isPlaceholder = vTokenLower.startsWith('0x0123') || vTokenLower.startsWith('0x0abc');

            if (isPlaceholder) {
                console.log('⚠️ Using Placeholder Address - Simulating Transaction Flow');
                setIsSimulating(true);

                try {
                    if (activeTab === 'deposit') {
                        setStatus({ type: 'info', message: 'Simulando Aprobación...' });
                        await new Promise(r => setTimeout(r, 1500));
                        setStatus({ type: 'info', message: 'Simulando Depósito...' });
                        await new Promise(r => setTimeout(r, 1500));
                    } else {
                        setStatus({ type: 'info', message: 'Simulando Retiro...' });
                        await new Promise(r => setTimeout(r, 2000));
                    }

                    const mockHash = "0x0simulated_hash_" + Math.floor(Math.random() * 100000);
                    setStatus({
                        type: 'success',
                        message: `Operación simulada con éxito. Hash: ${mockHash}`
                    });
                } finally {
                    setIsSimulating(false);
                }
                return;
            }

            // REAL TRANSACTION FLOW
            if (activeTab === 'deposit') {
                console.log('Approving...');
                await approve(params, tokenConfig.address, vTokenAddress, amount, tokenConfig.decimals);
                console.log('Depositing...');
                await deposit(params, vTokenAddress, amount, tokenConfig.decimals);
            } else {
                console.log('Withdrawing...');
                await withdraw(params, vTokenAddress, amount, tokenConfig.decimals);
            }

            setStatus({ type: 'success', message: 'Transacción completada exitosamente!' });
            void refetch();

        } catch (e) {
            console.error(e);
            setStatus({ type: 'error', message: e instanceof Error ? e.message : String(e) });
        }
    };

    return (
        <div className="bg-white border text-gray-800 rounded-xl shadow-lg w-full max-w-2xl mx-auto overflow-hidden">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
                <div>
                    <h2 className="text-2xl font-bold">Vesu Lending</h2>
                    <p className="text-blue-100 text-sm opacity-90">Gestión de activos gasless</p>
                </div>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {process.env.NEXT_PUBLIC_STARKNET_NETWORK || 'SEPOLIA'}
                </span>
            </div>

            <div className="p-6 space-y-8">
                {/* POSITIONS SUMMARY */}
                <section>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Tus Posiciones</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {dataLoading ? (
                            <div className="col-span-2 py-8 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mb-2"></div>
                                <p>Sincronizando con la blockchain...</p>
                            </div>
                        ) : positions.length > 0 ? (
                            positions.map((pos) => (
                                <div key={pos.asset} className="group relative border border-gray-200 p-5 rounded-xl bg-white hover:shadow-md transition-shadow duration-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${pos.asset === 'USDC' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                                                {pos.asset[0]}
                                            </div>
                                            <span className="font-bold text-lg text-gray-800">{pos.asset}</span>
                                        </div>
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                                            {pos.apy} APY
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Suministrado</span>
                                            <span className="font-mono font-medium text-gray-900">{pos.supplyBalance}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Deuda</span>
                                            <span className="font-mono font-medium text-gray-900">{pos.debtBalance}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-sm">No tienes posiciones activas aún.</p>
                                <p className="text-xs text-gray-400 mt-1">Deposita activos para empezar a ganar rendimiento.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ACTION AREA */}
                <section className="bg-gray-50 rounded-xl p-1 border border-gray-200">
                    {/* TABS */}
                    <div className="grid grid-cols-2 gap-1 mb-6 bg-gray-200/50 p-1 rounded-lg">
                        <button
                            className={`py-2.5 rounded-md text-sm font-bold transition-all duration-200 ${activeTab === 'deposit'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                                }`}
                            onClick={() => setActiveTab('deposit')}
                        >
                            Depositar
                        </button>
                        <button
                            className={`py-2.5 rounded-md text-sm font-bold transition-all duration-200 ${activeTab === 'withdraw'
                                ? 'bg-white text-orange-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                                }`}
                            onClick={() => setActiveTab('withdraw')}
                        >
                            Retirar
                        </button>
                    </div>

                    <div className="px-5 pb-6 space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Activo</label>
                                <select
                                    value={selectedAsset}
                                    onChange={(e) => setSelectedAsset(e.target.value)}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                >
                                    {Object.keys(config.tokens).map(t => (
                                        <option key={t} value={t}>{t === 'ETH' ? 'ETH (Starknet)' : t === 'USDC' ? 'USDC (Starknet)' : t}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                    Cantidad a {activeTab === 'deposit' ? 'Depositar' : 'Retirar'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded-lg pl-4 pr-16 py-3 text-lg font-mono text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    />
                                    <button
                                        className="absolute right-2 top-2 bottom-2 px-3 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        onClick={() => setAmount('100')} // Placeholder MAX logic
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Status Messages */}
                        {status && (
                            <div className={`p-4 rounded-md border-l-4 ${status.type === 'error' ? 'bg-red-50 border-red-500 text-red-700' :
                                    status.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' :
                                        'bg-blue-50 border-blue-500 text-blue-700'
                                }`}>
                                <p className="text-sm font-medium">{status.message}</p>
                            </div>
                        )}

                        {txError && !status && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                                <p className="text-sm text-red-700">{JSON.stringify(txError)}</p>
                            </div>
                        )}

                        {txHash && !status && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md">
                                <p className="text-sm text-green-700 break-all">Hash: {txHash}</p>
                            </div>
                        )}

                        <button
                            onClick={void handleAction}
                            disabled={txLoading || isSimulating || !amount}
                            className={`w-full py-3.5 rounded-lg text-white font-bold text-lg shadow-md hover:shadow-lg transform active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === 'deposit'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                                : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                                }`}
                        >
                            {txLoading || isSimulating ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Procesando...</span>
                                </span>
                            ) : (
                                activeTab === 'deposit' ? 'Depositar Fondos' : 'Retirar Fondos'
                            )}
                        </button>

                        {/* Testnet Faucet Helper */}
                        <div className="text-center pt-2">
                            <a
                                href="https://starknet-faucet.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-indigo-500 hover:text-indigo-700 font-medium bg-indigo-50 px-3 py-1.5 rounded-full transition-colors"
                            >
                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                Obtener Fondos de Prueba (Faucet)
                            </a>
                        </div>

                        <p className="text-xs text-center text-gray-400 font-medium mt-2">
                            🔒 Seguridad garantizada por ChipiPay Enclaves • ⚡ Vesu Protocol
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
