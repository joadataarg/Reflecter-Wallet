import { RpcProvider, Contract, uint256 } from 'starknet';

// Direcciones de contratos de tokens en Starknet mainnet
const TOKEN_CONTRACTS = {
  ETH: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
  STRK: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
  USDC: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8'
};

// Decimales de cada token
const TOKEN_DECIMALS = {
  ETH: 18,
  STRK: 18,
  USDC: 6
};

// Configuración del provider
const provider = new RpcProvider({
  nodeUrl: 'https://rpc.nethermind.io/mainnet-juno'
});

// Interfaz para una transferencia
export interface TokenTransfer {
  type: 'incoming' | 'outgoing';
  token: 'ETH' | 'STRK' | 'USDC';
  amount: string; // Monto formateado como string
  timestamp: number;
  transactionHash: string;
  counterpartAddress: string;
  blockNumber: number;
}

/**
 * Función para formatear montos con los decimales correctos
 */
function formatAmount(amount: bigint, token: 'ETH' | 'STRK' | 'USDC'): string {
  const decimals = TOKEN_DECIMALS[token];
  const divisor = BigInt(10) ** BigInt(decimals);
  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;

  if (fractionalPart === BigInt(0)) {
    return integerPart.toString();
  }

  // Formatear con hasta 6 decimales para legibilidad
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.replace(/0+$/, '');

  if (trimmedFractional.length === 0) {
    return integerPart.toString();
  }

  return `${integerPart}.${trimmedFractional}`;
}

/**
 * Función principal para obtener todas las transferencias de tokens
 */
export async function getTokenTransfers(
  walletAddress: string,
  maxBlocks: number = 100000 // Limitar a los últimos ~100k bloques para rendimiento
): Promise<TokenTransfer[]> {
  const allTransfers: TokenTransfer[] = [];
  const currentBlock = await provider.getBlockNumber();
  const fromBlock = Math.max(0, currentBlock - maxBlocks);

  // Procesar cada token
  for (const [tokenSymbol, contractAddress] of Object.entries(TOKEN_CONTRACTS)) {
    const token = tokenSymbol as 'ETH' | 'STRK' | 'USDC';

    try {
      // Configurar filtro de eventos para Transfer
      const transferEventKey = '0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d461131c66'; // Transfer event selector

      const filter = {
        fromBlock: fromBlock,
        toBlock: currentBlock,
        address: contractAddress,
        keys: [[transferEventKey]],
        chunk_size: 1000
      };

      let continuationToken: string | undefined;
      let hasMore = true;

      while (hasMore) {
        const eventsResponse = await provider.getEvents({
          ...filter,
          continuation_token: continuationToken
        });

        // Procesar cada evento
        for (const event of eventsResponse.events) {
          // Parsear datos del evento Transfer: [from, to, value_low, value_high]
          const from = event.data[0];
          const to = event.data[1];
          const valueLow = event.data[2];
          const valueHigh = event.data[3];

          // Verificar si la wallet está involucrada
          if (from.toLowerCase() === walletAddress.toLowerCase() ||
            to.toLowerCase() === walletAddress.toLowerCase()) {

            // Combinar Uint256
            const amount = uint256.uint256ToBN({ low: valueLow, high: valueHigh });

            // Determinar tipo
            const type: 'incoming' | 'outgoing' =
              to.toLowerCase() === walletAddress.toLowerCase() ? 'incoming' : 'outgoing';

            // Dirección counterpart
            const counterpartAddress = type === 'incoming' ? from : to;

            // Obtener timestamp del bloque
            const block = await provider.getBlock(event.block_number);
            const timestamp = block.timestamp;

            // Crear objeto de transferencia
            const transfer: TokenTransfer = {
              type,
              token,
              amount: formatAmount(amount, token),
              timestamp,
              transactionHash: event.transaction_hash,
              counterpartAddress,
              blockNumber: event.block_number
            };

            allTransfers.push(transfer);
          }
        }

        // Verificar si hay más páginas
        continuationToken = eventsResponse.continuation_token;
        hasMore = !!continuationToken;
      }

    } catch (error) {
      console.error(`Error fetching transfers for ${token}:`, error);
    }
  }

  // Ordenar por timestamp descendente (más reciente primero)
  allTransfers.sort((a, b) => b.timestamp - a.timestamp);

  return allTransfers;
}

/**
 * Hook personalizado para usar en React
 */
import { useState, useEffect } from 'react';

export function useTokenTransfers(walletAddress: string) {
  const [transfers, setTransfers] = useState<TokenTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        setLoading(true);
        const data = await getTokenTransfers(walletAddress);
        setTransfers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchTransfers();
    }
  }, [walletAddress]);

  return { transfers, loading, error };
}