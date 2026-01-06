export const TOKEN_DATA = {
    ETH: { name: 'ETHEREUM', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', fallback: 'Ξ' },
    STRK: { name: 'STARKNET', icon: 'https://www.starknet.io/assets/starknet-logo.svg', fallback: 'S' },
    USDC: { name: 'USD COIN', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', fallback: '$' }
} as const;

export type TokenType = keyof typeof TOKEN_DATA;
