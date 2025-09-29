/**
 * Plugin System Tests
 * Comprehensive test suite for the plugin system
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PluginRegistry } from '../registry';
import { PluginLoader } from '../loader';
import { Plugin, PluginMeta } from '../types';
import { PluginMetaSchema } from '../types';

// Mock plugin for testing
const createMockPlugin = (overrides: Partial<Plugin> = {}): Plugin => ({
  meta: {
    name: 'test-plugin',
    version: '1.0.0',
    description: 'Test plugin',
    category: 'utility',
    supportedPlatforms: ['web']
  },
  validateConfig: vi.fn(() => ({ valid: true })),
  init: vi.fn(),
  ...overrides
});

describe('PluginRegistry', () => {
  let registry: PluginRegistry;
  let mockContext: any;

  beforeEach(() => {
    registry = new PluginRegistry();
    mockContext = {
      app: {
        version: '1.0.0',
        environment: 'test',
        baseUrl: 'http://localhost:3000'
      },
      services: {
        storage: { get: vi.fn(), set: vi.fn() },
        api: { request: vi.fn() },
        events: { emit: vi.fn(), on: vi.fn() },
        logger: { info: vi.fn(), error: vi.fn() },
        config: { get: vi.fn() }
      },
      hooks: {
        useConfig: vi.fn(),
        useService: vi.fn(),
        emit: vi.fn(),
        subscribe: vi.fn()
      }
    };
    registry.setContext(mockContext);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a valid plugin', async () => {
      const plugin = createMockPlugin();
      await expect(registry.register(plugin)).resolves.not.toThrow();
      expect(registry.get('test-plugin')).toBe(plugin);
    });

    it('should reject plugin with invalid metadata', async () => {
      const plugin = createMockPlugin({
        meta: {
          name: '', // Invalid: empty name
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web']
        }
      });

      await expect(registry.register(plugin)).rejects.toThrow('Plugin validation failed');
    });

    it('should reject duplicate plugin names', async () => {
      const plugin1 = createMockPlugin();
      const plugin2 = createMockPlugin({ meta: { ...plugin1.meta } });

      await registry.register(plugin1);
      await expect(registry.register(plugin2)).rejects.toThrow('already registered');
    });

    it('should reject plugin with missing dependencies', async () => {
      const plugin = createMockPlugin({
        meta: {
          name: 'dependent-plugin',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['non-existent-plugin']
        }
      });

      await expect(registry.register(plugin)).rejects.toThrow('missing dependencies');
    });
  });

  describe('load', () => {
    it('should load a registered plugin', async () => {
      const plugin = createMockPlugin();
      await registry.register(plugin);
      
      await expect(registry.load('test-plugin')).resolves.not.toThrow();
      expect(registry.isLoaded('test-plugin')).toBe(true);
      expect(plugin.init).toHaveBeenCalledWith(mockContext, undefined);
    });

    it('should load plugin with configuration', async () => {
      const plugin = createMockPlugin();
      const config = { enabled: true, settings: { test: 'value' } };
      
      await registry.register(plugin);
      await registry.load('test-plugin', config);
      
      expect(plugin.init).toHaveBeenCalledWith(mockContext, config);
    });

    it('should validate configuration before loading', async () => {
      const plugin = createMockPlugin({
        validateConfig: vi.fn(() => ({ valid: false, errors: ['Invalid config'] }))
      });
      
      await registry.register(plugin);
      
      await expect(registry.load('test-plugin', { invalid: 'config' }))
        .rejects.toThrow('Configuration validation failed');
    });

    it('should load dependencies first', async () => {
      const dependency = createMockPlugin({
        meta: { name: 'dependency', version: '1.0.0', category: 'utility', supportedPlatforms: ['web'] }
      });
      const plugin = createMockPlugin({
        meta: {
          name: 'main-plugin',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['dependency']
        }
      });

      await registry.register(dependency);
      await registry.register(plugin);
      await registry.load('main-plugin');

      expect(dependency.init).toHaveBeenCalledBefore(plugin.init as any);
    });
  });

  describe('unload', () => {
    it('should unload a loaded plugin', async () => {
      const plugin = createMockPlugin({ stop: vi.fn(), dispose: vi.fn() });
      
      await registry.register(plugin);
      await registry.load('test-plugin');
      await registry.unload('test-plugin');
      
      expect(registry.isLoaded('test-plugin')).toBe(false);
      expect(plugin.stop).toHaveBeenCalled();
      expect(plugin.dispose).toHaveBeenCalled();
    });

    it('should not throw when unloading unloaded plugin', async () => {
      const plugin = createMockPlugin();
      await registry.register(plugin);
      
      await expect(registry.unload('test-plugin')).resolves.not.toThrow();
    });
  });

  describe('getLoadingOrder', () => {
    it('should return correct loading order for dependencies', () => {
      const plugins = [
        createMockPlugin({
          meta: { name: 'a', version: '1.0.0', category: 'utility', supportedPlatforms: ['web'], dependencies: ['b'] }
        }),
        createMockPlugin({
          meta: { name: 'b', version: '1.0.0', category: 'utility', supportedPlatforms: ['web'], dependencies: ['c'] }
        }),
        createMockPlugin({
          meta: { name: 'c', version: '1.0.0', category: 'utility', supportedPlatforms: ['web'] }
        })
      ];

      plugins.forEach(plugin => registry.register(plugin));
      
      const order = registry.getLoadingOrder();
      expect(order).toEqual(['c', 'b', 'a']);
    });

    it('should detect circular dependencies', () => {
      const plugins = [
        createMockPlugin({
          meta: { name: 'a', version: '1.0.0', category: 'utility', supportedPlatforms: ['web'], dependencies: ['b'] }
        }),
        createMockPlugin({
          meta: { name: 'b', version: '1.0.0', category: 'utility', supportedPlatforms: ['web'], dependencies: ['a'] }
        })
      ];

      plugins.forEach(plugin => registry.register(plugin));
      
      expect(() => registry.getLoadingOrder()).toThrow('Circular dependency detected');
    });
  });

  describe('getByCategory', () => {
    it('should return plugins by category', async () => {
      const utilityPlugin = createMockPlugin({
        meta: { name: 'utility-plugin', version: '1.0.0', category: 'utility', supportedPlatforms: ['web'] }
      });
      const ecommercePlugin = createMockPlugin({
        meta: { name: 'ecommerce-plugin', version: '1.0.0', category: 'ecommerce', supportedPlatforms: ['web'] }
      });

      await registry.register(utilityPlugin);
      await registry.register(ecommercePlugin);

      const utilityPlugins = registry.getByCategory('utility');
      const ecommercePlugins = registry.getByCategory('ecommerce');

      expect(utilityPlugins).toHaveLength(1);
      expect(utilityPlugins[0].meta.name).toBe('utility-plugin');
      expect(ecommercePlugins).toHaveLength(1);
      expect(ecommercePlugins[0].meta.name).toBe('ecommerce-plugin');
    });
  });
});

describe('PluginLoader', () => {
  let loader: PluginLoader;

  beforeEach(() => {
    loader = new PluginLoader();
  });

  describe('validatePlugin', () => {
    it('should validate a correct plugin', () => {
      const plugin = createMockPlugin();
      expect(loader.validatePlugin(plugin)).toBe(true);
    });

    it('should reject invalid plugin objects', () => {
      expect(loader.validatePlugin(null)).toBe(false);
      expect(loader.validatePlugin(undefined)).toBe(false);
      expect(loader.validatePlugin('string')).toBe(false);
      expect(loader.validatePlugin(123)).toBe(false);
      expect(loader.validatePlugin({})).toBe(false);
    });

    it('should reject plugin without required methods', () => {
      const plugin = {
        meta: {
          name: 'test',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web']
        }
        // Missing validateConfig and init methods
      };

      expect(loader.validatePlugin(plugin)).toBe(false);
    });

    it('should reject plugin with invalid metadata', () => {
      const plugin = {
        meta: {
          name: '', // Invalid: empty name
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web']
        },
        validateConfig: vi.fn(),
        init: vi.fn()
      };

      expect(loader.validatePlugin(plugin)).toBe(false);
    });
  });

  describe('loadFromPath', () => {
    it('should handle module not found errors', async () => {
      await expect(loader.loadFromPath('./non-existent-module'))
        .rejects.toThrow('Failed to load plugin from path');
    });
  });

  describe('loadFromPackage', () => {
    it('should handle package not found errors', async () => {
      await expect(loader.loadFromPackage('non-existent-package'))
        .rejects.toThrow('Failed to load plugin from package');
    });
  });
});

describe('Plugin Meta Schema', () => {
  it('should validate correct metadata', () => {
    const validMeta: PluginMeta = {
      name: 'test-plugin',
      version: '1.0.0',
      description: 'A test plugin',
      author: 'Test Author',
      license: 'MIT',
      homepage: 'https://example.com',
      repository: 'https://github.com/example/test-plugin',
      keywords: ['test', 'plugin'],
      category: 'utility',
      dependencies: ['storage'],
      peerDependencies: ['api'],
      supportedPlatforms: ['web', 'admin'],
      minCoreVersion: '1.0.0',
      maxCoreVersion: '2.0.0'
    };

    expect(() => PluginMetaSchema.parse(validMeta)).not.toThrow();
  });

  it('should reject invalid metadata', () => {
    const invalidMeta = {
      name: '', // Invalid: empty name
      version: 'invalid-version', // Invalid: not semver
      category: 'invalid-category', // Invalid: not in enum
      supportedPlatforms: ['invalid-platform'] // Invalid: not in enum
    };

    expect(() => PluginMetaSchema.parse(invalidMeta)).toThrow();
  });

  it('should apply default values', () => {
    const minimalMeta = {
      name: 'test-plugin',
      version: '1.0.0',
      category: 'utility'
    };

    const parsed = PluginMetaSchema.parse(minimalMeta);
    expect(parsed.supportedPlatforms).toEqual(['web']);
  });
});

// Integration tests
describe('Plugin System Integration', () => {
  let registry: PluginRegistry;
  let mockContext: any;

  beforeEach(() => {
    registry = new PluginRegistry();
    mockContext = {
      app: { version: '1.0.0', environment: 'test', baseUrl: 'http://localhost:3000' },
      services: {
        storage: { get: vi.fn(), set: vi.fn() },
        api: { request: vi.fn() },
        events: { emit: vi.fn(), on: vi.fn() },
        logger: { info: vi.fn(), error: vi.fn() },
        config: { get: vi.fn() }
      },
      hooks: { useConfig: vi.fn(), useService: vi.fn(), emit: vi.fn(), subscribe: vi.fn() }
    };
    registry.setContext(mockContext);
  });

  it('should handle complete plugin lifecycle', async () => {
    const plugin = createMockPlugin({
      ready: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      dispose: vi.fn(),
      getPublicAPI: vi.fn(() => ({ testMethod: vi.fn() })),
      healthCheck: vi.fn(() => Promise.resolve({ status: 'healthy' as const }))
    });

    // Register
    await registry.register(plugin);
    expect(registry.get('test-plugin')).toBe(plugin);

    // Load
    await registry.load('test-plugin');
    expect(registry.isLoaded('test-plugin')).toBe(true);
    expect(plugin.init).toHaveBeenCalled();

    // Use public API
    const api = plugin.getPublicAPI();
    expect(api).toHaveProperty('testMethod');

    // Health check
    const health = await plugin.healthCheck();
    expect(health.status).toBe('healthy');

    // Unload
    await registry.unload('test-plugin');
    expect(registry.isLoaded('test-plugin')).toBe(false);
    expect(plugin.stop).toHaveBeenCalled();
    expect(plugin.dispose).toHaveBeenCalled();

    // Unregister
    await registry.unregister('test-plugin');
    expect(registry.get('test-plugin')).toBeUndefined();
  });

  it('should handle plugin errors gracefully', async () => {
    const plugin = createMockPlugin({
      init: vi.fn().mockRejectedValue(new Error('Init failed'))
    });

    await registry.register(plugin);
    
    await expect(registry.load('test-plugin')).rejects.toThrow('Init failed');
    expect(registry.isLoaded('test-plugin')).toBe(false);
  });
});

// Performance tests
describe('Plugin System Performance', () => {
  it('should handle large number of plugins efficiently', async () => {
    const registry = new PluginRegistry();
    const plugins = Array.from({ length: 100 }, (_, i) => createMockPlugin({
      meta: {
        name: `plugin-${i}`,
        version: '1.0.0',
        category: 'utility',
        supportedPlatforms: ['web']
      }
    }));

    const startTime = performance.now();
    
    for (const plugin of plugins) {
      await registry.register(plugin);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
    expect(registry.getAll()).toHaveLength(100);
  });
});
