/**
 * Structured Logger for OpenTheDoorz SDK
 * Replaces console.log with configurable, environment-aware logging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    [key: string]: any;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';
    private minLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

    private levelPriority: Record<LogLevel, number> = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
    };

    private shouldLog(level: LogLevel): boolean {
        return this.levelPriority[level] >= this.levelPriority[this.minLevel];
    }

    private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
        const timestamp = new Date().toISOString();
        const levelStr = level.toUpperCase().padEnd(5);

        let formatted = `[${timestamp}] [${levelStr}] ${message}`;

        if (context && Object.keys(context).length > 0) {
            formatted += ` ${JSON.stringify(context)}`;
        }

        return formatted;
    }

    debug(message: string, context?: LogContext): void {
        if (!this.shouldLog('debug')) return;

        const formatted = this.formatMessage('debug', message, context);
        console.log(formatted);
    }

    info(message: string, context?: LogContext): void {
        if (!this.shouldLog('info')) return;

        const formatted = this.formatMessage('info', message, context);
        console.info(formatted);
    }

    warn(message: string, context?: LogContext): void {
        if (!this.shouldLog('warn')) return;

        const formatted = this.formatMessage('warn', message, context);
        console.warn(formatted);
    }

    error(message: string, context?: LogContext): void {
        if (!this.shouldLog('error')) return;

        const formatted = this.formatMessage('error', message, context);
        console.error(formatted);
    }

    /**
     * Special method for sensitive operations (wallet creation, transactions)
     * Always logs in production for audit trail
     */
    audit(message: string, context?: LogContext): void {
        const formatted = this.formatMessage('info', `[AUDIT] ${message}`, context);
        console.info(formatted);
    }
}

export const logger = new Logger();
