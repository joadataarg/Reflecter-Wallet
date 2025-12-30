import { constants } from "starknet";

export type NetworkConfig = {
    network: string;
    vTokens: {
        USDC: string;
        ETH: string;
    };
    tokens: {
        USDC: { address: string; decimals: number };
        ETH: { address: string; decimals: number };
    };
    explorer: string;
};

// Starknet Sepolia Verification
// USDC (Circle): 0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8 (Standard Testnet USDC)
// ETH: 0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7 (Standard Starknet ETH)

const SEPOLIA_CONFIG: NetworkConfig = {
    network: constants.NetworkName.SN_SEPOLIA,
    vTokens: {
        // Placeholders for Vesu vTokens (as public addresses aren't indexed yet)
        // User might need to replace these if they have specific deployments
        USDC: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        ETH: "0x0abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
    },
    tokens: {
        // Real Starknet Sepolia Addresses
        USDC: {
            address: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
            decimals: 6
        },
        ETH: {
            address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
            decimals: 18
        },
    },
    explorer: "https://sepolia.starkscan.co",
};

const MAINNET_CONFIG: NetworkConfig = {
    network: constants.NetworkName.SN_MAIN,
    vTokens: {
        USDC: "0x0...", // TODO: Add Mainnet Vesu Addresses
        ETH: "0x0...",
    },
    tokens: {
        USDC: {
            address: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8", // Mainnet USDC
            decimals: 6
        },
        ETH: {
            address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7", // Mainnet ETH
            decimals: 18
        },
    },
    explorer: "https://starkscan.co",
};

// Default to Sepolia for Development
export const VESU_CONFIG = process.env.NEXT_PUBLIC_STARKNET_NETWORK === 'MAINNET'
    ? MAINNET_CONFIG
    : SEPOLIA_CONFIG;
