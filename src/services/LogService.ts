type LogLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error';

export default class LogService {
    static logLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'error';

    static levels: Record<LogLevel, number> = { 
        verbose: 0, 
        debug: 1, 
        info: 2, 
        warn: 3, 
        error: 4 
    };

    static log(message: any, level: LogLevel = 'debug'): void {
        if (this.levels[level] >= this.levels[this.logLevel]) {
            if (console[level as keyof Console]) {
                (console[level as keyof Console] as (...args: any[]) => void)(message);
            } else {
                console.log(message);
            }
        }
    }
}