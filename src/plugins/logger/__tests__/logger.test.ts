/**
 * Logger Plugin Tests
 * Comprehensive test suite for the logger plugin
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import loggerPlugin from '../index';
import { createMockContext } from '../../../../test/setup';

describe('Logger Plugin', () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = createMockContext();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Plugin Interface', () => {
    it('should implement required plugin interface', () => {
      expect(loggerPlugin.meta).toBeDefined();
      expect(loggerPlugin.meta.name).toBe('logger');
      expect(loggerPlugin.meta.version).toBe('1.0.0');
      expect(loggerPlugin.validateConfig).toBeDefined();
      expect(loggerPlugin.init).toBeDefined();
      expect(loggerPlugin.getPublicAPI).toBeDefined();
      expect(loggerPlugin.healthCheck).toBeDefined();
    });

    it('should have correct metadata', () => {
      expect(loggerPlugin.meta.category).toBe('utility');
      expect(loggerPlugin.meta.supportedPlatforms).toContain('web');
      expect(loggerPlugin.meta.supportedPlatforms).toContain('admin');
      expect(loggerPlugin.meta.supportedPlatforms).toContain('api');
    });
  });

  describe('Configuration Validation', () => {
    it('should validate correct configuration', () => {
      const config = {
        enabled: true,
        priority: 10,
        settings: {
          level: 'info',
          format: 'text',
          timestamp: true,
          colorize: true,
          maxFiles: 5
        },
        features: {
          fileLogging: false,
          remoteLogging: false,
          performanceLogging: true
        },
        integrations: {
          sentry: { enabled: false },
          datadog: { enabled: false }
        }
      };

      const result = loggerPlugin.validateConfig(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should reject invalid log level', () => {
      const config = {
        enabled: true,
        settings: {
          level: 'invalid-level'
        }
      };

      const result = loggerPlugin.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]).toContain('level');
    });

    it('should reject invalid format', () => {
      const config = {
        enabled: true,
        settings: {
          format: 'invalid-format'
        }
      };

      const result = loggerPlugin.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should apply default values', () => {
      const config = {};

      const result = loggerPlugin.validateConfig(config);
      expect(result.valid).toBe(true);
    });
  });

  describe('Initialization', () => {
    it('should initialize successfully with valid config', async () => {
      const config = {
        enabled: true,
        settings: {
          level: 'debug'
        }
      };

      await expect(loggerPlugin.init(mockContext, config)).resolves.not.toThrow();
    });

    it('should throw error with invalid config', async () => {
      const config = {
        settings: {
          level: 'invalid'
        }
      };

      await expect(loggerPlugin.init(mockContext, config)).rejects.toThrow('Configuration validation failed');
    });

    it('should be idempotent', async () => {
      const config = { enabled: true };

      await loggerPlugin.init(mockContext, config);
      await expect(loggerPlugin.init(mockContext, config)).resolves.not.toThrow();
    });
  });

  describe('Public API', () => {
    beforeEach(async () => {
      await loggerPlugin.init(mockContext, { enabled: true });
    });

    it('should provide all required API methods', () => {
      const api = loggerPlugin.getPublicAPI();
      
      expect(api.log).toBeDefined();
      expect(api.debug).toBeDefined();
      expect(api.info).toBeDefined();
      expect(api.warn).toBeDefined();
      expect(api.error).toBeDefined();
      expect(api.setLevel).toBeDefined();
      expect(api.getLogs).toBeDefined();
      expect(api.clearLogs).toBeDefined();
      expect(api.flush).toBeDefined();
    });

    it('should log messages at different levels', () => {
      const api = loggerPlugin.getPublicAPI();
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      api.info('Test message');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test message'));

      consoleSpy.mockRestore();
    });

    it('should respect log level filtering', () => {
      const api = loggerPlugin.getPublicAPI();
      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      // Set level to warn, debug should be filtered out
      api.setLevel('warn');
      api.debug('This should be filtered');
      
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should get and clear logs', () => {
      const api = loggerPlugin.getPublicAPI();
      
      api.info('Test message 1');
      api.info('Test message 2');
      
      const logs = api.getLogs();
      expect(logs).toHaveLength(2);
      expect(logs[0].message).toBe('Test message 1');
      expect(logs[1].message).toBe('Test message 2');
      
      const clearResult = api.clearLogs();
      expect(clearResult.cleared).toBe(2);
      
      const emptyLogs = api.getLogs();
      expect(emptyLogs).toHaveLength(0);
    });

    it('should filter logs by level', () => {
      const api = loggerPlugin.getPublicAPI();
      
      api.debug('Debug message');
      api.info('Info message');
      api.warn('Warn message');
      
      const infoLogs = api.getLogs(undefined, 'info');
      expect(infoLogs).toHaveLength(1);
      expect(infoLogs[0].message).toBe('Info message');
    });

    it('should limit log count', () => {
      const api = loggerPlugin.getPublicAPI();
      
      api.info('Message 1');
      api.info('Message 2');
      api.info('Message 3');
      
      const limitedLogs = api.getLogs(2);
      expect(limitedLogs).toHaveLength(2);
      expect(limitedLogs[0].message).toBe('Message 2');
      expect(limitedLogs[1].message).toBe('Message 3');
    });
  });

  describe('Health Check', () => {
    it('should return healthy status when initialized', async () => {
      await loggerPlugin.init(mockContext, { enabled: true });
      
      const health = await loggerPlugin.healthCheck();
      expect(health.status).toBe('healthy');
      expect(health.details.initialized).toBe(true);
      expect(health.details.currentLevel).toBeDefined();
    });

    it('should include log count in health details', async () => {
      await loggerPlugin.init(mockContext, { enabled: true });
      
      const api = loggerPlugin.getPublicAPI();
      api.info('Test message');
      
      const health = await loggerPlugin.healthCheck();
      expect(health.details.logCount).toBe(1);
    });
  });

  describe('Routes', () => {
    it('should provide API routes', () => {
      const routes = loggerPlugin.getRoutes();
      expect(routes).toHaveLength(2);
      
      const getLogsRoute = routes.find(r => r.path === '/api/logger/logs');
      expect(getLogsRoute).toBeDefined();
      expect(getLogsRoute?.method).toBe('GET');
      
      const clearLogsRoute = routes.find(r => r.path === '/api/logger/clear');
      expect(clearLogsRoute).toBeDefined();
      expect(clearLogsRoute?.method).toBe('POST');
    });

    it('should handle get logs API', async () => {
      await loggerPlugin.init(mockContext, { enabled: true });
      
      const api = loggerPlugin.getPublicAPI();
      api.info('Test message');
      
      const routes = loggerPlugin.getRoutes();
      const getLogsRoute = routes.find(r => r.path === '/api/logger/logs');
      
      const mockReq = { query: { limit: '1' } };
      const result = await getLogsRoute?.handler(mockReq);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.count).toBe(1);
    });

    it('should handle clear logs API', async () => {
      await loggerPlugin.init(mockContext, { enabled: true });
      
      const api = loggerPlugin.getPublicAPI();
      api.info('Test message');
      
      const routes = loggerPlugin.getRoutes();
      const clearLogsRoute = routes.find(r => r.path === '/api/logger/clear');
      
      const result = await clearLogsRoute?.handler({});
      
      expect(result.success).toBe(true);
      expect(result.data.cleared).toBe(1);
    });
  });

  describe('Components', () => {
    it('should provide React components', () => {
      const components = loggerPlugin.getComponents();
      expect(components.LogViewer).toBeDefined();
      expect(components.LogLevelSelector).toBeDefined();
    });
  });

  describe('Event Handling', () => {
    it('should handle plugin events', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      loggerPlugin.onEvent('init', { test: 'data' });
      loggerPlugin.onEvent('config-changed', { newConfig: {} });
      loggerPlugin.onEvent('error', { error: 'test error' });
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('init event'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('config-changed'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('error'));
      
      consoleSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle large number of logs', () => {
      const api = loggerPlugin.getPublicAPI();
      
      // Log more than the buffer limit (1000)
      for (let i = 0; i < 1100; i++) {
        api.info(`Message ${i}`);
      }
      
      const logs = api.getLogs();
      expect(logs).toHaveLength(1000); // Should be limited to 1000
      expect(logs[0].message).toBe('Message 100'); // Should keep the last 1000
      expect(logs[999].message).toBe('Message 1099');
    });

    it('should handle undefined meta in log calls', () => {
      const api = loggerPlugin.getPublicAPI();
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      api.info('Test message', undefined, 'test-source');
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('test-source'));
      consoleSpy.mockRestore();
    });

    it('should handle malformed log entries', () => {
      const api = loggerPlugin.getPublicAPI();
      
      // This should not throw
      expect(() => {
        api.log('info' as any, 'Test message', { circular: {} });
      }).not.toThrow();
    });
  });

  describe('Lifecycle Methods', () => {
    it('should handle ready lifecycle', async () => {
      await loggerPlugin.init(mockContext, { enabled: true });
      
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      await loggerPlugin.ready?.();
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Logger plugin ready'));
      consoleSpy.mockRestore();
    });

    it('should handle start lifecycle', async () => {
      await loggerPlugin.init(mockContext, { enabled: true });
      
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      await loggerPlugin.start?.();
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Logger plugin started'));
      consoleSpy.mockRestore();
    });

    it('should handle stop lifecycle', async () => {
      await loggerPlugin.init(mockContext, { enabled: true });
      
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      await loggerPlugin.stop?.();
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Logger plugin stopped'));
      consoleSpy.mockRestore();
    });

    it('should handle dispose lifecycle', async () => {
      await loggerPlugin.init(mockContext, { enabled: true });
      
      const api = loggerPlugin.getPublicAPI();
      api.info('Test message');
      
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      await loggerPlugin.dispose?.();
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Logger plugin disposed'));
      consoleSpy.mockRestore();
    });
  });
});
