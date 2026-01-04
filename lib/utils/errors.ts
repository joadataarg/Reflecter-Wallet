/**
 * Centralized Error System for OpenTheDoorz SDK
 * Provides consistent error handling with error codes
 */

export enum ErrorCode {
    // Authentication Errors (1xxx)
    AUTH_FAILED = 'AUTH_1001',
    AUTH_INVALID_CREDENTIALS = 'AUTH_1002',
    AUTH_USER_NOT_FOUND = 'AUTH_1003',
    AUTH_SESSION_EXPIRED = 'AUTH_1004',

    // Wallet Errors (2xxx)
    WALLET_CREATE_FAILED = 'WALLET_2001',
    WALLET_NOT_FOUND = 'WALLET_2002',
    WALLET_ENCRYPTION_FAILED = 'WALLET_2003',
    WALLET_DECRYPTION_FAILED = 'WALLET_2004',

    // Transaction Errors (3xxx)
    TX_INSUFFICIENT_BALANCE = 'TX_3001',
    TX_SIMULATION_FAILED = 'TX_3002',
    TX_SEND_FAILED = 'TX_3003',
    TX_INVALID_AMOUNT = 'TX_3004',
    TX_INVALID_ADDRESS = 'TX_3005',

    // Network Errors (4xxx)
    NETWORK_ERROR = 'NETWORK_4001',
    NETWORK_TIMEOUT = 'NETWORK_4002',
    NETWORK_UNAVAILABLE = 'NETWORK_4003',

    // DeFi Protocol Errors (5xxx)
    DEFI_POSITION_FETCH_FAILED = 'DEFI_5001',
    DEFI_APPROVAL_FAILED = 'DEFI_5002',
    DEFI_DEPOSIT_FAILED = 'DEFI_5003',
    DEFI_WITHDRAW_FAILED = 'DEFI_5004',
    DEFI_INSUFFICIENT_LIQUIDITY = 'DEFI_5005',

    // Configuration Errors (6xxx)
    CONFIG_INVALID = 'CONFIG_6001',
    CONFIG_MISSING_ENV = 'CONFIG_6002',

    // Generic Errors (9xxx)
    UNKNOWN_ERROR = 'ERROR_9999',
}

export class SDKError extends Error {
    public readonly code: ErrorCode;
    public readonly context?: Record<string, any>;
    public readonly cause?: unknown;
    public readonly timestamp: number;

    constructor(
        code: ErrorCode,
        message: string,
        context?: Record<string, any>,
        cause?: unknown
    ) {
        super(message);
        this.name = 'SDKError';
        this.code = code;
        this.context = context;
        this.cause = cause;
        this.timestamp = Date.now();

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SDKError);
        }
    }

    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            context: this.context,
            timestamp: this.timestamp,
            stack: this.stack,
        };
    }
}

/**
 * User-friendly error messages for each error code
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
    // Auth
    [ErrorCode.AUTH_FAILED]: 'Authentication failed. Please try again.',
    [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password.',
    [ErrorCode.AUTH_USER_NOT_FOUND]: 'User not found.',
    [ErrorCode.AUTH_SESSION_EXPIRED]: 'Your session has expired. Please log in again.',

    // Wallet
    [ErrorCode.WALLET_CREATE_FAILED]: 'Failed to create wallet. Please try again.',
    [ErrorCode.WALLET_NOT_FOUND]: 'Wallet not found for this user.',
    [ErrorCode.WALLET_ENCRYPTION_FAILED]: 'Failed to encrypt wallet data.',
    [ErrorCode.WALLET_DECRYPTION_FAILED]: 'Failed to decrypt wallet data.',

    // Transaction
    [ErrorCode.TX_INSUFFICIENT_BALANCE]: 'Insufficient balance for this transaction.',
    [ErrorCode.TX_SIMULATION_FAILED]: 'Transaction simulation failed.',
    [ErrorCode.TX_SEND_FAILED]: 'Failed to send transaction.',
    [ErrorCode.TX_INVALID_AMOUNT]: 'Invalid transaction amount.',
    [ErrorCode.TX_INVALID_ADDRESS]: 'Invalid recipient address.',

    // Network
    [ErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection.',
    [ErrorCode.NETWORK_TIMEOUT]: 'Request timed out. Please try again.',
    [ErrorCode.NETWORK_UNAVAILABLE]: 'Network is currently unavailable.',

    // DeFi
    [ErrorCode.DEFI_POSITION_FETCH_FAILED]: 'Failed to fetch DeFi positions.',
    [ErrorCode.DEFI_APPROVAL_FAILED]: 'Token approval failed.',
    [ErrorCode.DEFI_DEPOSIT_FAILED]: 'Deposit failed.',
    [ErrorCode.DEFI_WITHDRAW_FAILED]: 'Withdrawal failed.',
    [ErrorCode.DEFI_INSUFFICIENT_LIQUIDITY]: 'Insufficient liquidity in the pool.',

    // Config
    [ErrorCode.CONFIG_INVALID]: 'Invalid configuration.',
    [ErrorCode.CONFIG_MISSING_ENV]: 'Missing required environment variable.',

    // Generic
    [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred.',
};

/**
 * Helper to create SDK errors quickly
 */
export function createSDKError(
    code: ErrorCode,
    context?: Record<string, any>,
    cause?: unknown
): SDKError {
    const message = ERROR_MESSAGES[code];
    return new SDKError(code, message, context, cause);
}

/**
 * Check if an error is an SDKError
 */
export function isSDKError(error: unknown): error is SDKError {
    return error instanceof SDKError;
}

/**
 * Get user-friendly message from any error
 */
export function getErrorMessage(error: unknown): string {
    if (isSDKError(error)) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR];
}
