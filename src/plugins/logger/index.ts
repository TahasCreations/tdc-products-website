/**
 * Logger Plugin
 * Enhanced logging system with configurable levels and output formats
 */

import { Plugin, PluginMeta } from '../../lib/plugin-system/types';
import { z } from 'zod';

// Plugin metadata
const meta: PluginMeta = {
  name: 'logger',
  version: '1.0.0',
  description: 'Enhanced logging system with configurable levels and output formats',
  author: 'TDC Team',
  license: 'MIT',
  category: 'utility',
  keywords: ['logging', 'utility', 'debug', 'monitoring'],
  supportedPlatforms: ['web', 'admin', 'api'],
  dependencies: [],
  peerDependencies: []
};

// Configuration schema
const configSchema = z.object({
  enabled: z.boolean().default(true),
  priority: z.number().min(0).max(100).default(10), // High priority for logger
  settings: z.object({
    level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    format: z.enum(['json', 'text', 'compact']).default('text'),
    timestamp: z.boolean().default(true),
    colorize: z.boolean().default(true),
    maxFileSize: z.string().optional(),
    maxFiles: z.number().min(1).max(100).default(5)
  }),
  features: z.object({
    fileLogging: z.boolean().default(false),
    remoteLogging: z.boolean().default(false),
    performanceLogging: z.boolean().default(false)
  }),
  integrations: z.object({
    sentry: z.object({
      enabled: z.boolean().default(false),
      dsn: z.string().optional()
    }),
    datadog: z.object({
      enabled: z.boolean().default(false),
      apiKey: z.string().optional()
    })
  })
});

// Log levels
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: any;
  source?: string;
}

// Plugin implementation class
class LoggerPlugin implements Plugin {
  meta = meta;
  configSchema = configSchema;
  private initialized = false;
  private context: any;
  private config: any;
  private logBuffer: LogEntry[] = [];
  private currentLevel: LogLevel = 'info';

  validateConfig(config: unknown) {
    try {
      configSchema.parse(config);
      return { valid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        };
      }
      return {
        valid: false,
        errors: ['Invalid configuration format']
      };
    }
  }

  async init(context: any, config: unknown) {
    if (this.initialized) {
      console.log('Logger plugin already initialized');
      return;
    }

    console.log('Initializing Logger Plugin...');
    
    // Validate configuration
    const configValidation = this.validateConfig(config);
    if (!configValidation.valid) {
      throw new Error(`Configuration validation failed: ${configValidation.errors?.join(', ')}`);
    }

    const validatedConfig = configSchema.parse(config);
    
    // Initialize services
    this.context = context;
    this.config = validatedConfig;
    this.currentLevel = validatedConfig.settings.level;
    
    // Set up global logger
    this.setupGlobalLogger();
    
    // Initialize integrations
    await this.initializeIntegrations();
    
    this.initialized = true;
    console.log('Logger Plugin initialized successfully');
  }

  async ready() {
    console.log('Logger Plugin is ready');
    this.log('info', 'Logger plugin ready', { timestamp: new Date().toISOString() });
  }

  async start() {
    console.log('Logger Plugin started');
    this.log('info', 'Logger plugin started', { timestamp: new Date().toISOString() });
  }

  async stop() {
    console.log('Logger Plugin stopped');
    this.log('info', 'Logger plugin stopped', { timestamp: new Date().toISOString() });
  }

  async dispose() {
    console.log('Logger Plugin disposed');
    this.flushLogs();
    this.initialized = false;
  }

  getPublicAPI() {
    return {
      log: this.log.bind(this),
      debug: this.debug.bind(this),
      info: this.info.bind(this),
      warn: this.warn.bind(this),
      error: this.error.bind(this),
      setLevel: this.setLevel.bind(this),
      getLogs: this.getLogs.bind(this),
      clearLogs: this.clearLogs.bind(this),
      flush: this.flushLogs.bind(this)
    };
  }

  getRoutes() {
    return [
      {
        path: '/api/logger/logs',
        handler: this.handleGetLogs.bind(this),
        method: 'GET' as const
      },
      {
        path: '/api/logger/clear',
        handler: this.handleClearLogs.bind(this),
        method: 'POST' as const
      }
    ];
  }

  getComponents() {
    return {
      LogViewer: this.LogViewer.bind(this),
      LogLevelSelector: this.LogLevelSelector.bind(this)
    };
  }

  onEvent(event: string, data?: unknown) {
    this.log('debug', `Logger plugin received event: ${event}`, { eventData: data });
  }

  async healthCheck() {
    try {
      const logCount = this.logBuffer.length;
      const memoryUsage = process.memoryUsage ? process.memoryUsage() : null;
      
      return {
        status: 'healthy' as const,
        details: {
          initialized: this.initialized,
          currentLevel: this.currentLevel,
          logCount,
          memoryUsage,
          lastCheck: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        status: 'unhealthy' as const,
        details: {
          error: error.message,
          lastCheck: new Date().toISOString()
        }
      };
    }
  }

  // Public API methods
  log(level: LogLevel, message: string, meta?: any, source?: string) {
    if (LOG_LEVELS[level] < LOG_LEVELS[this.currentLevel]) {
      return; // Skip if level is below current threshold
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      source: source || 'logger-plugin'
    };

    // Add to buffer
    this.logBuffer.push(entry);
    
    // Keep only last 1000 entries
    if (this.logBuffer.length > 1000) {
      this.logBuffer = this.logBuffer.slice(-1000);
    }

    // Output to console
    this.outputToConsole(entry);
  }

  debug(message: string, meta?: any, source?: string) {
    this.log('debug', message, meta, source);
  }

  info(message: string, meta?: any, source?: string) {
    this.log('info', message, meta, source);
  }

  warn(message: string, meta?: any, source?: string) {
    this.log('warn', message, meta, source);
  }

  error(message: string, meta?: any, source?: string) {
    this.log('error', message, meta, source);
  }

  setLevel(level: LogLevel) {
    this.currentLevel = level;
    this.log('info', `Log level changed to ${level}`);
  }

  getLogs(limit?: number, level?: LogLevel) {
    let logs = [...this.logBuffer];
    
    if (level) {
      logs = logs.filter(log => log.level === level);
    }
    
    if (limit) {
      logs = logs.slice(-limit);
    }
    
    return logs;
  }

  clearLogs() {
    const count = this.logBuffer.length;
    this.logBuffer = [];
    this.log('info', `Cleared ${count} log entries`);
    return { cleared: count };
  }

  flushLogs() {
    // In a real implementation, this would flush logs to files or remote services
    this.log('debug', `Flushed ${this.logBuffer.length} log entries`);
  }

  // Private methods
  private setupGlobalLogger() {
    if (this.context?.services?.logger) {
      // Enhance the global logger
      const originalLogger = this.context.services.logger;
      
      this.context.services.logger = {
        debug: (msg: string, meta?: any) => {
          originalLogger.debug(msg, meta);
          this.log('debug', msg, meta, 'global');
        },
        info: (msg: string, meta?: any) => {
          originalLogger.info(msg, meta);
          this.log('info', msg, meta, 'global');
        },
        warn: (msg: string, meta?: any) => {
          originalLogger.warn(msg, meta);
          this.log('warn', msg, meta, 'global');
        },
        error: (msg: string, meta?: any) => {
          originalLogger.error(msg, meta);
          this.log('error', msg, meta, 'global');
        }
      };
    }
  }

  private async initializeIntegrations() {
    // Initialize Sentry if enabled
    if (this.config.integrations.sentry.enabled) {
      this.log('info', 'Initializing Sentry integration');
      // TODO: Initialize Sentry
    }

    // Initialize Datadog if enabled
    if (this.config.integrations.datadog.enabled) {
      this.log('info', 'Initializing Datadog integration');
      // TODO: Initialize Datadog
    }
  }

  private outputToConsole(entry: LogEntry) {
    const { timestamp, level, message, meta, source } = entry;
    const timeStr = this.config.settings.timestamp ? `[${timestamp}] ` : '';
    const sourceStr = source ? `[${source}] ` : '';
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    
    const logMessage = `${timeStr}${sourceStr}[${level.toUpperCase()}] ${message}${metaStr}`;
    
    // Use appropriate console method
    switch (level) {
      case 'debug':
        console.debug(logMessage);
        break;
      case 'info':
        console.info(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      case 'error':
        console.error(logMessage);
        break;
    }
  }

  // API handlers
  private async handleGetLogs(req: any) {
    const limit = parseInt(req.query.limit) || 100;
    const level = req.query.level as LogLevel;
    
    const logs = this.getLogs(limit, level);
    
    return {
      success: true,
      data: logs,
      count: logs.length
    };
  }

  private async handleClearLogs(req: any) {
    const result = this.clearLogs();
    
    return {
      success: true,
      data: result
    };
  }

  // Component definitions
  private LogViewer() {
    return 'Log Viewer Component';
  }
  
  private LogLevelSelector() {
    return 'Log Level Selector Component';
  }
}

const loggerPlugin = new LoggerPlugin();
export default loggerPlugin;
