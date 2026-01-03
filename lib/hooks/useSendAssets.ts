import { useState, useCallback } from 'react';
import { useCallAnyContract } from '@chipi-stack/nextjs';
import { useFirebaseAuth } from './useFirebaseAuth';
import { useFetchWallet } from './useFetchWallet';
import { useNetwork } from './useNetwork';
import { deriveEncryptKey } from '@/lib/utils/deriveEncryptKey';

export interface SendConfig {
  minAmount: number;
  estimatedGasPrice: number;
  decimals: number;
}

export const TOKEN_SEND_CONFIG: Record<'ETH' | 'STRK' | 'USDC', SendConfig> = {
  ETH: {
    minAmount: 0.001,
    estimatedGasPrice: 0.00001,
    decimals: 18,
  },
  STRK: {
    minAmount: 1,
    estimatedGasPrice: 0.1,
    decimals: 18,
  },
  USDC: {
    minAmount: 0.1,
    estimatedGasPrice: 0.5,
    decimals: 6,
  },
};

// Helper to convert human amount to base units (BigInt)
function toBaseUnits(human: string, decimals: number): bigint {
  const [integer, fraction = ''] = human.split('.');
  const frac = (fraction + '0'.repeat(decimals)).slice(0, decimals);
  const combined = `${integer}${frac}`.replace(/^0+/, '') || '0';
  return BigInt(combined);
}

// Helper to convert BigInt to Uint256 parts (low, high)
function toUint256Parts(amount: bigint) {
  const mask = (1n << 128n) - 1n;
  const low = amount & mask;
  const high = amount >> 128n;
  return { low: `0x${low.toString(16)}`, high: `0x${high.toString(16)}` };
}

export const useSendAssets = (token: 'ETH' | 'STRK' | 'USDC') => {
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  
  const { callAnyContractAsync, isLoading } = useCallAnyContract();
  const { getToken, user } = useFirebaseAuth();
  const { wallet } = useFetchWallet();
  const { network } = useNetwork();

  const config = TOKEN_SEND_CONFIG[token];

  const validateAmount = useCallback((amount: string): { isValid: boolean; error?: string } => {
    if (!amount || amount === '0') {
      return { isValid: false, error: 'Amount is required' };
    }

    const numAmount = parseFloat(amount);

    if (isNaN(numAmount)) {
      return { isValid: false, error: 'Invalid amount' };
    }

    if (numAmount < config.minAmount) {
      return {
        isValid: false,
        error: `Minimum amount is ${config.minAmount} ${token}`,
      };
    }

    return { isValid: true };
  }, [config.minAmount, token]);

  const validateAddress = useCallback((address: string): { isValid: boolean; error?: string } => {
    if (!address) {
      return { isValid: false, error: 'Address is required' };
    }

    // Starknet address validation: 0x + 1 to 64 hex characters
    // Addresses can have leading zeros omitted, so they vary in length
    const starknetAddressRegex = /^0x[a-fA-F0-9]{1,64}$/;
    if (!starknetAddressRegex.test(address)) {
      return { isValid: false, error: 'Invalid Starknet address format' };
    }

    return { isValid: true };
  }, []);

  const calculateEstimatedFee = useCallback((amount: string): number => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 0;

    // Estimated fee = base gas price * amount (increases with larger transfers)
    const baseFee = config.estimatedGasPrice;
    const amountFactor = Math.log(numAmount + 1); // Log scale to avoid excessive fees
    const estimatedFee = baseFee * amountFactor;

    return Math.max(baseFee, estimatedFee); // At least the base fee
  }, [config.estimatedGasPrice]);

  const calculateTotalCost = useCallback((amount: string): number => {
    const numAmount = parseFloat(amount);
    const fee = calculateEstimatedFee(amount);
    return numAmount + fee;
  }, [calculateEstimatedFee]);

  const sendTransaction = useCallback(
    async (toAddress: string, amount: string): Promise<{ success: boolean; txHash?: string; error?: string }> => {
      setError(null);
      setTxHash(null);

      try {
        // Validate inputs
        const amountValidation = validateAmount(amount);
        if (!amountValidation.isValid) {
          setError(amountValidation.error || 'Invalid amount');
          return { success: false, error: amountValidation.error };
        }

        const addressValidation = validateAddress(toAddress);
        if (!addressValidation.isValid) {
          setError(addressValidation.error || 'Invalid address');
          return { success: false, error: addressValidation.error };
        }

        // Check user and wallet
        if (!user) {
          setError('User not authenticated');
          return { success: false, error: 'User not authenticated' };
        }

        if (!wallet) {
          setError('Wallet not found');
          return { success: false, error: 'Wallet not found' };
        }

        // Derive encryptKey from user UID
        const encryptKey = await deriveEncryptKey(user.uid);

        // Get bearer token
        const bearerToken = await getToken();
        if (!bearerToken) {
          setError('Authentication failed');
          return { success: false, error: 'Authentication failed' };
        }

        // Get token contract address based on network
        const tokenAddresses: Record<string, Record<'ETH' | 'STRK' | 'USDC', string>> = {
          MAINNET: {
            ETH: process.env.NEXT_PUBLIC_STARKNET_MAINNET_ETH || '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
            STRK: process.env.NEXT_PUBLIC_STARKNET_MAINNET_STRK || '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
            USDC: process.env.NEXT_PUBLIC_STARKNET_MAINNET_USDC || '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
          },
          SEPOLIA: {
            ETH: process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_ETH || '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
            STRK: process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_STRK || '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
            USDC: process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_USDC || '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
          },
        };

        const tokenAddress = tokenAddresses[network]?.[token];
        if (!tokenAddress) {
          setError(`Token address not configured for ${token} on ${network}`);
          return { success: false, error: `Token address not configured` };
        }

        // Convert amount to base units
        const amountBase = toBaseUnits(amount, config.decimals);
        const u = toUint256Parts(amountBase);

        // Prepare calldata for ERC20 transfer: transfer(recipient, amount_low, amount_high)
        const calldata = [toAddress, u.low, u.high];

        // Execute transaction using ChipiPay
        const result = await callAnyContractAsync({
          params: {
            encryptKey: encryptKey,
            wallet: wallet,
            contractAddress: tokenAddress,
            calls: [{
              contractAddress: tokenAddress,
              entrypoint: 'transfer',
              calldata,
            }],
          },
          bearerToken,
        });
        
        // Extract transaction hash - ChipiPay returns the hash as a string directly
        let hash = null;
        if (typeof result === 'string') {
          hash = result;
        } else if (result && typeof result === 'object') {
          hash = result.transaction_hash || result.transactionHash || result.hash || result.txHash;
        }
        
        if (hash) {
          setTxHash(hash);
          return { success: true, txHash: hash };
        } else {
          console.warn('[SEND] No transaction hash in result:', result);
          return { success: true, txHash: 'pending' };
        }

      } catch (err) {
        console.error('[SEND] Transaction failed:', err);
        const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [validateAmount, validateAddress, user, wallet, getToken, callAnyContractAsync, config.decimals, network, token]
  );

  return {
    isLoading,
    error,
    txHash,
    validateAmount,
    validateAddress,
    calculateEstimatedFee,
    calculateTotalCost,
    sendTransaction,
    minAmount: config.minAmount,
    estimatedGasPrice: config.estimatedGasPrice,
  };
};
