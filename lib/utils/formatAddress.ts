/**
 * Formats a Starknet address to ensure it has the correct length (66 characters total)
 * Starknet addresses must be: 0x + 64 hexadecimal characters
 * 
 * @param address - The address to format (with or without 0x prefix)
 * @returns Formatted address with 0x prefix and padded to 66 characters
 * 
 * @example
 * formatStarknetAddress('0x3f85d7a469aa4430de87c4c342b3b4f3182cbf8635c34f9c81e8eb9888b87e5')
 * // Returns: '0x03f85d7a469aa4430de87c4c342b3b4f3182cbf8635c34f9c81e8eb9888b87e5'
 */
export function formatStarknetAddress(address: string): string {
  if (!address) return '';
  
  // Remove 0x prefix if present
  const cleanAddress = address.startsWith('0x') ? address.slice(2) : address;
  
  // Pad with zeros to ensure 64 hex characters
  const paddedAddress = cleanAddress.padStart(64, '0');
  
  // Add 0x prefix
  return `0x${paddedAddress}`;
}

/**
 * Truncates a Starknet address for display purposes
 * Shows first 6 and last 4 characters with ... in between
 * 
 * @param address - The full address to truncate
 * @returns Truncated address for display
 * 
 * @example
 * truncateAddress('0x03f85d7a469aa4430de87c4c342b3b4f3182cbf8635c34f9c81e8eb9888b87e5')
 * // Returns: '0x03f8...87e5'
 */
export function truncateAddress(address: string): string {
  if (!address) return '';
  if (address.length < 12) return address;
  
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
