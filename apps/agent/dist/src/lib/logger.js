const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};
class Logger {
    level;
    constructor() {
        const envLevel = process.env.LOG_LEVEL || 'INFO';
        this.level = LOG_LEVELS[envLevel] ?? LOG_LEVELS.INFO;
    }
    log(level, message, meta) {
        if (LOG_LEVELS[level] <= this.level) {
            const timestamp = new Date().toISOString();
            const logEntry = {
                timestamp,
                level,
                message,
                ...meta
            };
            console.log(JSON.stringify(logEntry));
        }
    }
    error(message, meta) {
        this.log('ERROR', message, meta);
    }
    warn(message, meta) {
        this.log('WARN', message, meta);
    }
    info(message, meta) {
        this.log('INFO', message, meta);
    }
    debug(message, meta) {
        this.log('DEBUG', message, meta);
    }
}
export const logger = new Logger();
