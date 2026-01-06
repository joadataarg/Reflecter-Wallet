import { RpcProvider, uint256 } from 'starknet';
import { Transaction } from '../../core/domain/entities/Transaction';
import { ITransactionRepository } from '../../core/domain/repositories/ITransactionRepository';

export class StarkscanTransactionRepository implements ITransactionRepository {
    private provider: RpcProvider;
    private tokenContracts = {
        ETH: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        STRK: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
        USDC: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8'
    };

    constructor() {
        // Use environment variable if available, otherwise fallback to a more stable public RPC
        const nodeUrl = process.env.NEXT_PUBLIC_STARKNET_RPC_URL || 'https://starknet-mainnet.public.blastapi.io';
        this.provider = new RpcProvider({ nodeUrl });
    }

    async getTransactionsByAddress(address: string, limit: number = 20): Promise<Transaction[]> {
        try {
            const allTransfers: Transaction[] = [];

            let currentBlock: number;
            try {
                currentBlock = await this.provider.getBlockNumber();
            } catch (rpcError) {
                console.warn('RPC Provider failed to get block number, history might be unavailable:', rpcError);
                return []; // Return empty instead of crashing
            }

            const fromBlock = Math.max(0, currentBlock - 50000); // Check last 50k blocks

            const transferEventKey = '0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d461131c66';

            for (const [tokenSymbol, contractAddress] of Object.entries(this.tokenContracts)) {
                try {
                    const eventsResponse = await this.provider.getEvents({
                        from_block: { block_number: fromBlock },
                        to_block: { block_number: currentBlock },
                        address: contractAddress,
                        keys: [[transferEventKey]],
                        chunk_size: 1000
                    });

                    for (const event of eventsResponse.events) {
                        const from = event.data[0];
                        const to = event.data[1];
                        const valueLow = event.data[2];
                        const valueHigh = event.data[3];

                        const targetAddressBI = BigInt(address);
                        const fromBI = BigInt(from);
                        const toBI = BigInt(to);

                        if (fromBI === targetAddressBI || toBI === targetAddressBI) {

                            const amountRaw = uint256.uint256ToBN({ low: valueLow, high: valueHigh });
                            const isIncoming = toBI === targetAddressBI;

                            allTransfers.push({
                                hash: event.transaction_hash,
                                timestamp: 0, // Will be 0 for now as fetching block for each is slow
                                type: isIncoming ? 'incoming' : 'outgoing',
                                token: tokenSymbol as any,
                                amount: this.formatAmount(amountRaw.toString(), tokenSymbol),
                                from: from,
                                to: to,
                                status: 'SUCCESS',
                                blockNumber: event.block_number
                            });
                        }
                    }
                } catch (e) {
                    console.error(`Error fetching ${tokenSymbol} transfers:`, e);
                }
            }

            // Since we don't have timestamps easily without fetching blocks, sort by block number
            allTransfers.sort((a, b) => (b.blockNumber || 0) - (a.blockNumber || 0));

            return allTransfers.slice(0, limit);
        } catch (error) {
            console.error('RpcRepository error:', error);
            return [];
        }
    }

    private formatAmount(amount: string, token: string): string {
        const decimals = token === 'USDC' ? 6 : 18;
        const value = BigInt(amount);
        const divisor = BigInt(10) ** BigInt(decimals);

        const integerPart = value / divisor;
        const fractionalPart = value % divisor;

        if (fractionalPart === BigInt(0)) return integerPart.toString();

        const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
        const trimmedFractional = fractionalStr.replace(/0+$/, '').slice(0, 6);

        return `${integerPart}.${trimmedFractional}`;
    }
}
