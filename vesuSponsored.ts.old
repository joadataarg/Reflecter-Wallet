// vesuSponsored.ts
// Gasless approve + deposit/withdraw to Vesu vTokens via ChipiPay useCallAnyContract.
// Fill the vToken (vault) contract addresses per pool/asset (see CONFIG.vTokens).
'use client';

import { useCallback, useMemo } from 'react';
import { useCallAnyContract } from '@chipi-pay/chipi-sdk';

/** ------------------------------------------------------------
 * VESU — MAINNET ADDRESSES (from docs.vesu.xyz)
 * -------------------------------------------------------------
 * Core (optional, for reference):
 *   Singleton V2: 0x000d8d6dfec4d33bfb6895de9f3852143a17c6f92fd2a21da3d6924d34870160
 *   Extension V2: 0x04e06e04b8d624d039aa1c3ca8e0aa9e21dc1ccba1d88d0d650837159e0ee054
 *
 * Assets we care about:
 *   WBTC (8d): 0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac
 *   tBTC (8d): 0x04daa17763b286d1e59b97c283c0b8c949994c361e426a28f743c67bdfe9a32f
 *   USDC (6d): 0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
 *   LBTC: (NOT listed by Vesu contracts page as of 2025-07-30)
 *
 * Pools (IDs; used by indexers/analytics & UI; vToken is a separate contract):
 *   Braavos Vault: 1921054942193708428619433636456748851087331856691656881799540576257302014718
 *   Re7 USDC:     3592370751539490711610556844458488648008775713878064059760995781404350938653
 *   Re7 xSTRK:    2345856225134458665876812536882617294246962319062565703131100435311373119841
 *   Re7 rUSDC:    1749206066145585665304376624725901901307432885480056836110792804696449290137
 *   Re7 Ecosys:   3163948199181372152800322058764275087686391083665033264234338943786798617741
 *   Re7 wstETH:   2535243615249328221060622268479728814680175138265908305094759253778126318519
 *   Re7 tBTC:     (not published on the contracts page at time of writing)
 * ----------------------------------------------------------- */

export const CONFIG = {
  tokens: {
    WBTC: {
      address:
        '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
      decimals: 8,
    },
    TBTC: {
      address:
        '0x04daa17763b286d1e59b97c283c0b8c949994c361e426a28f743c67bdfe9a32f',
      decimals: 8,
    },
    USDC: {
      address:
        '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
      decimals: 6,
    },
    // LBTC not listed by Vesu contracts page yet:
    LBTC: { address: '0x__LBTC_TOKEN_NOT_IN_VESU_LIST__', decimals: 8 },
  },
  // IMPORTANT: vToken = the SNIP-22 vault contract for a given pool/asset.
  // You MUST fill these with the actual vToken addresses for the markets you integrate.
  // (The pool IDs above are NOT the vToken addresses.)
  vTokens: {
    // Examples (placeholders — replace with the actual vToken contract addresses):
    // For Braavos Vault WBTC deposit/withdraw:
    WBTC_BRAAVOS: '0x__VTOKEN_WBTC_BRAAVOS__',
    USDC_BRAAVOS: '0x__VTOKEN_USDC_BRAAVOS__',

    // For a Re7 USDC market (if you integrate it):
    USDC_RE7: '0x__VTOKEN_USDC_RE7__',

    // For a Re7 tBTC market (when published):
    TBTC_RE7: '0x__VTOKEN_TBTC_RE7__',

    // LBTC when available:
    LBTC_SOMEPOOL: '0x__VTOKEN_LBTC__',
  },
} as const;

/** ------------------------------------------------------------
 * UINT256 HELPERS (Cairo u256 = [low, high])
 * ----------------------------------------------------------- */
function toUint256Parts(amount: bigint) {
  const mask = (1n << 128n) - 1n;
  const low = amount & mask;
  const high = amount >> 128n;
  return { low: `0x${low.toString(16)}`, high: `0x${high.toString(16)}` };
}

/** Converts human units string → base units bigint → u256 parts.
 *  Example: toBaseUnits("25.5", 6) = 25500000n for USDC.
 */
function toBaseUnits(human: string, decimals: number): bigint {
  const [i, f = ''] = human.split('.');
  const frac = (f + '0'.repeat(decimals)).slice(0, decimals);
  const s = `${i}${frac}`.replace(/^0+/, '') || '0';
  return BigInt(s);
}

/** ------------------------------------------------------------
 * CHIPIPAY CALL PARAMS
 * ----------------------------------------------------------- */
export type WalletData = {
  publicKey: string;
  encryptedPrivateKey: string;
};
export type SponsorParams = {
  encryptKey: string; // user PIN
  wallet: WalletData; // Chipi invisible wallet bundle
  bearerToken: string; // Chipi bearer (server-provided)
  userAddress: string; // Starknet account (contract) address
};

/** ------------------------------------------------------------
 * HOOK: useVesuSponsored
 * - approve(token → spender=vToken)
 * - deposit(vToken.deposit(assets, receiver))
 * - withdraw(vToken.withdraw(assets, receiver, owner))
 *
 * vToken ABI per Vesu vToken docs (ERC4626-style). See:
 *   - deposit(assets:u256, receiver:ContractAddress) -> u256 (shares)
 *   - withdraw(assets:u256, receiver:ContractAddress, owner:ContractAddress) -> u256
 * ----------------------------------------------------------- */
export function useVesuSponsored() {
  const { callAsync, isLoading, error, callData } = useCallAnyContract();

  /** Approve ERC20 for a specific vToken (spender) */
  const approve = useCallback(
    async (
      p: SponsorParams,
      tokenAddress: string,
      vTokenAddress: string,
      amountHuman: string,
      decimals: number
    ) => {
      const { encryptKey, wallet, bearerToken } = p;
      const amountBase = toBaseUnits(amountHuman, decimals);
      const u = toUint256Parts(amountBase);
      const calldata = [vTokenAddress, u.low, u.high];

      return await callAsync({
        encryptKey,
        wallet,
        bearerToken,
        contractAddress: tokenAddress,
        entrypoint: 'approve',
        calldata,
      });
    },
    [callAsync]
  );

  /** Deposit assets into a vToken (receiver = user) */
  const deposit = useCallback(
    async (
      p: SponsorParams,
      vTokenAddress: string,
      amountHuman: string,
      assetDecimals: number
    ) => {
      const { encryptKey, wallet, bearerToken, userAddress } = p;
      const amountBase = toBaseUnits(amountHuman, assetDecimals);
      const u = toUint256Parts(amountBase);
      const calldata = [u.low, u.high, userAddress];

      return await callAsync({
        encryptKey,
        wallet,
        bearerToken,
        contractAddress: vTokenAddress,
        entrypoint: 'deposit',
        calldata,
      });
    },
    [callAsync]
  );

  /** Withdraw assets from a vToken back to the user (owner = user) */
  const withdraw = useCallback(
    async (
      p: SponsorParams,
      vTokenAddress: string,
      amountHuman: string,
      assetDecimals: number
    ) => {
      const { encryptKey, wallet, bearerToken, userAddress } = p;
      const amountBase = toBaseUnits(amountHuman, assetDecimals);
      const u = toUint256Parts(amountBase);
      const calldata = [u.low, u.high, userAddress, userAddress];

      return await callAsync({
        encryptKey,
        wallet,
        bearerToken,
        contractAddress: vTokenAddress,
        entrypoint: 'withdraw',
        calldata,
      });
    },
    [callAsync]
  );

  return useMemo(
    () => ({
      approve,
      deposit,
      withdraw,
      isLoading,
      error,
      txHash: callData as string | undefined,
    }),
    [approve, deposit, withdraw, isLoading, error, callData]
  );
}

/** ------------------------------------------------------------
 * EXAMPLE USAGE (Braavos Vault — WBTC & USDC)
 * -----------------------------------------------------------
 * const { approve, deposit, withdraw } = useVesuSponsored();
 *
 * // Approve 100.0 USDC (6 decimals) for Braavos vToken:
 * await approve(
 *   {
 *     encryptKey: pin, wallet: chipiWallet, bearerToken, userAddress,
 *   },
 *   CONFIG.tokens.USDC.address,
 *   CONFIG.vTokens.USDC_BRAAVOS,   // <- fill with actual vToken address
 *   "100.0",
 *   CONFIG.tokens.USDC.decimals
 * );
 *
 * // Deposit 25.0 USDC into the Braavos Vault vToken
 * await deposit(
 *   { encryptKey: pin, wallet: chipiWallet, bearerToken, userAddress },
 *   CONFIG.vTokens.USDC_BRAAVOS,
 *   "25.0",
 *   CONFIG.tokens.USDC.decimals
 * );
 *
 * // Withdraw 5.0 USDC back to the user
 * await withdraw(
 *   { encryptKey: pin, wallet: chipiWallet, bearerToken, userAddress },
 *   CONFIG.vTokens.USDC_BRAAVOS,
 *   "5.0",
 *   CONFIG.tokens.USDC.decimals
 * );
 *
 * // BTC wrappers (8 decimals), e.g. deposit "0.75" tBTC:
 * await approve(..., CONFIG.tokens.TBTC.address, CONFIG.vTokens.TBTC_RE7, "0.75", 8);
 * await deposit(..., CONFIG.vTokens.TBTC_RE7, "0.25", 8);
 */
