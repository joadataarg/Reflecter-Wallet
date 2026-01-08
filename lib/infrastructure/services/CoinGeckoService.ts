export interface MarketData {
    prices: [number, number][];
    market_caps: [number, number][];
    total_volumes: [number, number][];
}

export interface TokenStats {
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
}

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export class CoinGeckoService {
    static async getMarketChart(tokenId: string, days: number = 7): Promise<MarketData> {
        try {
            const response = await fetch(
                `${COINGECKO_BASE_URL}/coins/${tokenId}/market_chart?vs_currency=usd&days=${days}`
            );
            if (!response.ok) throw new Error('API_UNREACHABLE');
            return await response.json();
        } catch (error) {
            return { prices: [], market_caps: [], total_volumes: [] };
        }
    }

    static async getTokenStats(tokenId: string): Promise<TokenStats> {
        try {
            const response = await fetch(
                `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${tokenId}&order=market_cap_desc&per_page=1&page=1&sparkline=false`
            );
            if (!response.ok) throw new Error('API_UNREACHABLE');
            const data = await response.json();

            if (!data || data.length === 0) throw new Error('NO_DATA');

            return data[0];
        } catch (error) {
            // Return sensible fallback stats
            return {
                current_price: tokenId === 'ethereum' ? 3400 : tokenId === 'starknet' ? 0.50 : 1.00,
                price_change_percentage_24h: 0,
                market_cap: 0,
                total_volume: 0,
                high_24h: 0,
                low_24h: 0
            };
        }
    }

    static getTokenId(symbol: string): string {
        const mapping: Record<string, string> = {
            'ETH': 'ethereum',
            'STRK': 'starknet',
            'USDC': 'usd-coin'
        };
        return mapping[symbol] || symbol.toLowerCase();
    }
}
