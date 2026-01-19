/**
 * Professional Logger Utility
 * Replaces console.log with a more structured logging system
 * Can be extended to send logs to a remote service in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: string;
    data?: unknown;
}

interface ErrorWithResponse extends Error {
    response?: unknown;
}

class Logger {
    private isDevelopment = import.meta.env.DEV;
    private logHistory: LogEntry[] = [];
    private maxHistorySize = 100;

    private formatMessage(level: LogLevel, message: string, context?: string, data?: unknown): LogEntry {
        return {
            level,
            message,
            timestamp: new Date().toISOString(),
            context,
            data: data ? JSON.parse(JSON.stringify(data)) : undefined, // Deep clone to avoid mutations
        };
    }

    private log(level: LogLevel, message: string, context?: string, data?: unknown): void {
        const entry = this.formatMessage(level, message, context, data);

        // Store in history (for debugging)
        this.logHistory.push(entry);
        if (this.logHistory.length > this.maxHistorySize) {
            this.logHistory.shift();
        }

        // In production, you might want to send errors to a logging service
        if (!this.isDevelopment && level === 'error') {
            // TODO: Send to logging service (e.g., Sentry, LogRocket)
            this.sendToRemoteService(entry);
        }

        // Console output (only in development or for errors)
        if (this.isDevelopment || level === 'error') {
            const prefix = context ? `[${context}]` : '';
            const formattedMessage = `${prefix} ${message}`;

            switch (level) {
                case 'debug':
                    console.debug(formattedMessage, data || '');
                    break;
                case 'info':
                    console.info(formattedMessage, data || '');
                    break;
                case 'warn':
                    console.warn(formattedMessage, data || '');
                    break;
                case 'error':
                    console.error(formattedMessage, data || '');
                    break;
            }
        }
    }

    debug(message: string, context?: string, data?: unknown): void {
        this.log('debug', message, context, data);
    }

    info(message: string, context?: string, data?: unknown): void {
        this.log('info', message, context, data);
    }

    warn(message: string, context?: string, data?: unknown): void {
        this.log('warn', message, context, data);
    }

    error(message: string, context?: string, error?: unknown): void {
        let errorData: unknown = error;
        if (error instanceof Error) {
            const errorWithResponse = error as ErrorWithResponse;
            errorData = {
                name: error.name,
                message: error.message,
                stack: error.stack,
                ...(errorWithResponse.response ? { response: errorWithResponse.response } : {}),
            };
        }

        this.log('error', message, context, errorData);
    }

    /**
     * Send critical errors to remote logging service
     */
    private sendToRemoteService(_entry: LogEntry): void {
        // TODO: Implement remote logging
        // Example: Send to Sentry, LogRocket, or custom API
        // fetch('/api/logs', {
        //     method: 'POST',
        //     body: JSON.stringify(entry),
        // }).catch(() => {});
    }

    /**
     * Get log history (useful for debugging)
     */
    getHistory(): LogEntry[] {
        return [...this.logHistory];
    }

    /**
     * Clear log history
     */
    clearHistory(): void {
        this.logHistory = [];
    }
}

export const logger = new Logger();
export default logger;
