/**
 * Centralized Error System for Reflecter Wallet
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

    // Configuration Errors (6xxx)
    CONFIG_INVALID = 'CONFIG_6001',
    CONFIG_MISSING_ENV = 'CONFIG_6002',

    // Generic Errors (9xxx)
    UNKNOWN_ERROR = 'ERROR_9999',
}

export class WalletError extends Error {
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
        this.name = 'WalletError';
        this.code = code;
        this.context = context;
        this.cause = cause;
        this.timestamp = Date.now();

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, WalletError);
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

    // Config
    [ErrorCode.CONFIG_INVALID]: 'Invalid configuration.',
    [ErrorCode.CONFIG_MISSING_ENV]: 'Missing required environment variable.',

    // Generic
    [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred.',
};

/**
 * Helper to create wallet errors quickly
 */
export function createWalletError(
    code: ErrorCode,
    context?: Record<string, any>,
    cause?: unknown
): WalletError {
    const message = ERROR_MESSAGES[code];
    return new WalletError(code, message, context, cause);
}

/**
 * Check if an error is a WalletError
 */
export function isWalletError(error: unknown): error is WalletError {
    return error instanceof WalletError;
}

/**
 * Get user-friendly message from any error
 */
export function getErrorMessage(error: unknown): string {
    if (isWalletError(error)) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR];
}
