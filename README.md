# Vesu Hooks

A React hook library for gasless interactions with Vesu vTokens using ChipiPay's sponsored transaction system.

## Overview

This library provides a convenient React hook (`useVesuSponsored`) for performing gasless approve, deposit, and withdraw operations on Vesu vTokens. It leverages ChipiPay's `useCallAnyContract` to handle sponsored transactions, eliminating gas fees for users.

## Features

- 🚀 **Gasless Transactions**: All operations are sponsored via ChipiPay
- 💰 **Multi-Asset Support**: WBTC, tBTC, USDC, and LBTC
- 🏦 **Vesu Integration**: Direct interaction with Vesu vToken contracts
- ⚡ **TypeScript Support**: Full type safety and IntelliSense
- 🔒 **Secure**: Uses ChipiPay's encrypted wallet system

## Installation

```bash
npm install @chipi-pay/chipi-sdk react
```

## Quick Start

```typescript
import { useVesuSponsored, CONFIG } from './vesuSponsored';

function MyComponent() {
  const { approve, deposit, withdraw, isLoading, error } = useVesuSponsored();

  const handleDeposit = async () => {
    const sponsorParams = {
      encryptKey: userPin,
      wallet: chipiWallet,
      bearerToken: chipiBearerToken,
      userAddress: userStarknetAddress,
    };

    // 1. Approve USDC for the vToken
    await approve(
      sponsorParams,
      CONFIG.tokens.USDC.address,
      CONFIG.vTokens.USDC_BRAAVOS,
      "100.0",
      CONFIG.tokens.USDC.decimals
    );

    // 2. Deposit into Vesu vault
    await deposit(
      sponsorParams,
      CONFIG.vTokens.USDC_BRAAVOS,
      "25.0",
      CONFIG.tokens.USDC.decimals
    );
  };

  return (
    <button onClick={handleDeposit} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Deposit USDC'}
    </button>
  );
}
```

## Configuration

### Token Addresses

The library includes pre-configured addresses for mainnet tokens:

```typescript
CONFIG.tokens = {
  WBTC: {
    address: '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
    decimals: 8,
  },
  TBTC: {
    address: '0x04daa17763b286d1e59b97c283c0b8c949994c361e426a28f743c67bdfe9a32f',
    decimals: 8,
  },
  USDC: {
    address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
    decimals: 6,
  },
  // LBTC not yet available on Vesu
  LBTC: { address: '0x__LBTC_TOKEN_NOT_IN_VESU_LIST__', decimals: 8 },
};
```

### vToken Addresses

**⚠️ Important**: You must configure the actual vToken contract addresses for your target markets:

```typescript
CONFIG.vTokens = {
  // Replace with actual vToken addresses from Vesu
  WBTC_BRAAVOS: '0x__VTOKEN_WBTC_BRAAVOS__',
  USDC_BRAAVOS: '0x__VTOKEN_USDC_BRAAVOS__',
  USDC_RE7: '0x__VTOKEN_USDC_RE7__',
  TBTC_RE7: '0x__VTOKEN_TBTC_RE7__',
  LBTC_SOMEPOOL: '0x__VTOKEN_LBTC__',
};
```

## API Reference

### `useVesuSponsored()`

Returns an object with the following properties:

#### Methods

##### `approve(sponsorParams, tokenAddress, vTokenAddress, amountHuman, decimals)`

Approves a token for spending by a vToken contract.

**Parameters:**
- `sponsorParams`: ChipiPay sponsor parameters
- `tokenAddress`: ERC20 token contract address
- `vTokenAddress`: vToken contract address (spender)
- `amountHuman`: Amount as human-readable string (e.g., "100.0")
- `decimals`: Token decimals

##### `deposit(sponsorParams, vTokenAddress, amountHuman, assetDecimals)`

Deposits assets into a Vesu vToken vault.

**Parameters:**
- `sponsorParams`: ChipiPay sponsor parameters
- `vTokenAddress`: vToken contract address
- `amountHuman`: Amount as human-readable string
- `assetDecimals`: Asset decimals

##### `withdraw(sponsorParams, vTokenAddress, amountHuman, assetDecimals)`

Withdraws assets from a Vesu vToken vault.

**Parameters:**
- `sponsorParams`: ChipiPay sponsor parameters
- `vTokenAddress`: vToken contract address
- `amountHuman`: Amount as human-readable string
- `assetDecimals`: Asset decimals

#### State

- `isLoading`: Boolean indicating if a transaction is in progress
- `error`: Error object if transaction failed
- `txHash`: Transaction hash of the last successful transaction

### Types

#### `SponsorParams`

```typescript
type SponsorParams = {
  encryptKey: string;        // User PIN
  wallet: WalletData;        // Chipi invisible wallet bundle
  bearerToken: string;       // Chipi bearer token (server-provided)
  userAddress: string;       // Starknet account address
};
```

#### `WalletData`

```typescript
type WalletData = {
  publicKey: string;
  encryptedPrivateKey: string;
};
```

## Vesu Integration

### Supported Markets

- **Braavos Vault**: WBTC, USDC
- **Re7 Markets**: USDC, xSTRK, rUSDC, Ecosys, wstETH, tBTC

### Pool IDs (for reference)

```typescript
// These are pool IDs, NOT vToken addresses
const POOL_IDS = {
  BRAAVOS_VAULT: 1921054942193708428619433636456748851087331856691656881799540576257302014718,
  RE7_USDC: 3592370751539490711610556844458488648008775713878064059760995781404350938653,
  RE7_XSTRK: 2345856225134458665876812536882617294246962319062565703131100435311373119841,
  RE7_RUSDC: 1749206066145585665304376624725901901307432885480056836110792804696449290137,
  RE7_ECOSYS: 3163948199181372152800322058764275087686391083665033264234338943786798617741,
  RE7_WSTETH: 2535243615249328221060622268479728814680175138265908305094759253778126318519,
};
```

## Examples

### Complete Deposit Flow

```typescript
const handleCompleteDeposit = async () => {
  try {
    // 1. Approve token for vToken
    await approve(
      sponsorParams,
      CONFIG.tokens.USDC.address,
      CONFIG.vTokens.USDC_BRAAVOS,
      "100.0",
      CONFIG.tokens.USDC.decimals
    );

    // 2. Deposit into vault
    await deposit(
      sponsorParams,
      CONFIG.vTokens.USDC_BRAAVOS,
      "50.0",
      CONFIG.tokens.USDC.decimals
    );

    console.log('Deposit successful!');
  } catch (error) {
    console.error('Deposit failed:', error);
  }
};
```

### BTC Operations

```typescript
// Deposit tBTC (8 decimals)
await approve(
  sponsorParams,
  CONFIG.tokens.TBTC.address,
  CONFIG.vTokens.TBTC_RE7,
  "0.75",  // 0.75 tBTC
  8
);

await deposit(
  sponsorParams,
  CONFIG.vTokens.TBTC_RE7,
  "0.25",  // 0.25 tBTC
  8
);
```

### Withdrawal

```typescript
// Withdraw 10 USDC from vault
await withdraw(
  sponsorParams,
  CONFIG.vTokens.USDC_BRAAVOS,
  "10.0",
  CONFIG.tokens.USDC.decimals
);
```

## Error Handling

```typescript
const { error, isLoading } = useVesuSponsored();

if (error) {
  console.error('Transaction error:', error);
  // Handle error appropriately
}

if (isLoading) {
  // Show loading state
  return <div>Processing transaction...</div>;
}
```

## Requirements

- React 16.8+ (hooks support)
- ChipiPay SDK
- Starknet account
- Valid vToken contract addresses

## Security Notes

- All transactions are sponsored by ChipiPay
- Private keys are encrypted and handled securely
- Users only need to provide their PIN for authentication
- No gas fees are charged to users

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License

## Support

For issues related to:
- **Vesu**: Visit [docs.vesu.xyz](https://docs.vesu.xyz)
- **ChipiPay**: Contact ChipiPay support
- **This library**: Open an issue in this repository
