/**
 * Utility functions for formatting blockchain data
 */

/**
 * Shorten a Starknet address (e.g., 0x123...4567)
 */
export function formatAddress(address: string, chars = 4): string {
    if (!address) return '';
    if (address.length <= chars * 2 + 2) return address;
    return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

/**
 * Format a number to currency string
 */
export function formatCurrency(amount: string | number, symbol = '$'): string {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(value)) return `${symbol}0.00`;

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(value).replace('$', symbol);
}

/**
 * Normalize Starknet hex (ensure 0x prefix and correct length padding)
 */
export function normalizeHex(hex: string): string {
    if (!hex) return '';
    const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
    return `0x${cleanHex.padStart(64, '0')}`;
}
