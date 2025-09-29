/**
 * Dependency Resolution Tests
 * Tests for plugin dependency management and circular dependency detection
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EnhancedPluginRegistry } from '../registry-enhanced';
import { createMockPlugin } from '../../../../test/setup';

describe('Enhanced Plugin Registry - Dependency Resolution', () => {
  let registry: EnhancedPluginRegistry;
  let mockContext: any;

  beforeEach(() => {
    registry = new EnhancedPluginRegistry();
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

  describe('Simple Dependencies', () => {
    it('should resolve A dependsOn B correctly', async () => {
      // Create plugin B (dependency)
      const pluginB = createMockPlugin({
        meta: {
          name: 'plugin-b',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web']
        }
      });

      // Create plugin A (depends on B)
      const pluginA = createMockPlugin({
        meta: {
          name: 'plugin-a',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-b']
        }
      });

      // Register plugins
      await registry.register(pluginB);
      await registry.register(pluginA);

      // Get loading order
      const loadingOrder = registry.getLoadingOrder();
      expect(loadingOrder).toEqual(['plugin-b', 'plugin-a']);
    });

    it('should resolve A dependsOn B, B dependsOn C correctly', async () => {
      // Create plugins C, B, A in dependency chain
      const pluginC = createMockPlugin({
        meta: { name: 'plugin-c', version: '1.0.0', category: 'utility', supportedPlatforms: ['web'] }
      });

      const pluginB = createMockPlugin({
        meta: {
          name: 'plugin-b',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-c']
        }
      });

      const pluginA = createMockPlugin({
        meta: {
          name: 'plugin-a',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-b']
        }
      });

      // Register plugins
      await registry.register(pluginC);
      await registry.register(pluginB);
      await registry.register(pluginA);

      // Get loading order
      const loadingOrder = registry.getLoadingOrder();
      expect(loadingOrder).toEqual(['plugin-c', 'plugin-b', 'plugin-a']);
    });
  });

  describe('Circular Dependencies', () => {
    it('should detect direct circular dependency (A dependsOn A)', async () => {
      const pluginA = createMockPlugin({
        meta: {
          name: 'plugin-a',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-a'] // Self-dependency
        }
      });

      await registry.register(pluginA);

      expect(() => registry.getLoadingOrder()).toThrow('Circular dependency detected involving plugin \'plugin-a\'');
    });

    it('should detect simple circular dependency (A dependsOn B, B dependsOn A)', async () => {
      const pluginA = createMockPlugin({
        meta: {
          name: 'plugin-a',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-b']
        }
      });

      const pluginB = createMockPlugin({
        meta: {
          name: 'plugin-b',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-a']
        }
      });

      await registry.register(pluginA);
      await registry.register(pluginB);

      expect(() => registry.getLoadingOrder()).toThrow('Circular dependency detected involving plugin');
    });

    it('should detect complex circular dependency (A->B->C->A)', async () => {
      const pluginA = createMockPlugin({
        meta: {
          name: 'plugin-a',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-b']
        }
      });

      const pluginB = createMockPlugin({
        meta: {
          name: 'plugin-b',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-c']
        }
      });

      const pluginC = createMockPlugin({
        meta: {
          name: 'plugin-c',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-a']
        }
      });

      await registry.register(pluginA);
      await registry.register(pluginB);
      await registry.register(pluginC);

      expect(() => registry.getLoadingOrder()).toThrow('Circular dependency detected involving plugin');
    });

    it('should provide detailed circular dependency information', () => {
      const pluginA = createMockPlugin({
        meta: {
          name: 'plugin-a',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-b']
        }
      });

      const pluginB = createMockPlugin({
        meta: {
          name: 'plugin-b',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-a']
        }
      });

      registry.register(pluginA);
      registry.register(pluginB);

      const circularDeps = registry.detectCircularDependencies();
      expect(circularDeps).toHaveLength(1);
      expect(circularDeps[0]).toContain('plugin-a');
      expect(circularDeps[0]).toContain('plugin-b');
    });
  });

  describe('Enable/Disable Order', () => {
    it('should enable dependencies first', async () => {
      const pluginB = createMockPlugin({
        meta: {
          name: 'plugin-b',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web']
        }
      });

      const pluginA = createMockPlugin({
        meta: {
          name: 'plugin-a',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-b']
        }
      });

      await registry.register(pluginB);
      await registry.register(pluginA);

      // Enable plugin A (should automatically enable B first)
      await registry.enable('plugin-b', { enabled: true });
      await registry.enable('plugin-a', { enabled: true });

      const statusA = registry.getStatus('plugin-a');
      const statusB = registry.getStatus('plugin-b');

      expect(statusA?.enabled).toBe(true);
      expect(statusB?.enabled).toBe(true);
    });

    it('should disable dependents first', async () => {
      const pluginB = createMockPlugin({
        meta: {
          name: 'plugin-b',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web']
        }
      });

      const pluginA = createMockPlugin({
        meta: {
          name: 'plugin-a',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-b']
        }
      });

      await registry.register(pluginB);
      await registry.register(pluginA);

      // Enable both plugins
      await registry.enable('plugin-b', { enabled: true });
      await registry.enable('plugin-a', { enabled: true });

      // Disable plugin B (should disable A first)
      await registry.disable('plugin-b');

      const statusA = registry.getStatus('plugin-a');
      const statusB = registry.getStatus('plugin-b');

      expect(statusA?.enabled).toBe(false);
      expect(statusB?.enabled).toBe(false);
    });

    it('should handle missing dependencies gracefully', async () => {
      const pluginA = createMockPlugin({
        meta: {
          name: 'plugin-a',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['non-existent-plugin']
        }
      });

      await registry.register(pluginA);

      await expect(registry.enable('plugin-a', { enabled: true })).rejects.toThrow(
        'Dependency \'non-existent-plugin\' is not available for plugin \'plugin-a\''
      );
    });
  });

  describe('Dependency Tree', () => {
    it('should build correct dependency tree', async () => {
      const pluginC = createMockPlugin({
        meta: { name: 'plugin-c', version: '1.0.0', category: 'utility', supportedPlatforms: ['web'] }
      });

      const pluginB = createMockPlugin({
        meta: {
          name: 'plugin-b',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-c']
        }
      });

      const pluginA = createMockPlugin({
        meta: {
          name: 'plugin-a',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-b']
        }
      });

      await registry.register(pluginC);
      await registry.register(pluginB);
      await registry.register(pluginA);

      const tree = registry.getDependencyTree('plugin-a');
      
      expect(tree.name).toBe('plugin-a');
      expect(tree.dependencies).toHaveLength(1);
      expect(tree.dependencies[0].name).toBe('plugin-b');
      expect(tree.dependencies[0].dependencies).toHaveLength(1);
      expect(tree.dependencies[0].dependencies[0].name).toBe('plugin-c');
    });

    it('should handle plugins with no dependencies', async () => {
      const pluginA = createMockPlugin({
        meta: {
          name: 'plugin-a',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web']
        }
      });

      await registry.register(pluginA);

      const tree = registry.getDependencyTree('plugin-a');
      expect(tree.name).toBe('plugin-a');
      expect(tree.dependencies).toHaveLength(0);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle multiple plugins with shared dependencies', async () => {
      // Create shared dependency
      const pluginShared = createMockPlugin({
        meta: { name: 'plugin-shared', version: '1.0.0', category: 'utility', supportedPlatforms: ['web'] }
      });

      // Create plugins that both depend on shared
      const pluginA = createMockPlugin({
        meta: {
          name: 'plugin-a',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-shared']
        }
      });

      const pluginB = createMockPlugin({
        meta: {
          name: 'plugin-b',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-shared']
        }
      });

      await registry.register(pluginShared);
      await registry.register(pluginA);
      await registry.register(pluginB);

      const loadingOrder = registry.getLoadingOrder();
      expect(loadingOrder).toContain('plugin-shared');
      expect(loadingOrder.indexOf('plugin-shared')).toBeLessThan(loadingOrder.indexOf('plugin-a'));
      expect(loadingOrder.indexOf('plugin-shared')).toBeLessThan(loadingOrder.indexOf('plugin-b'));
    });

    it('should handle diamond dependency pattern (A->B,C; B,C->D)', async () => {
      const pluginD = createMockPlugin({
        meta: { name: 'plugin-d', version: '1.0.0', category: 'utility', supportedPlatforms: ['web'] }
      });

      const pluginB = createMockPlugin({
        meta: {
          name: 'plugin-b',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-d']
        }
      });

      const pluginC = createMockPlugin({
        meta: {
          name: 'plugin-c',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-d']
        }
      });

      const pluginA = createMockPlugin({
        meta: {
          name: 'plugin-a',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-b', 'plugin-c']
        }
      });

      await registry.register(pluginD);
      await registry.register(pluginB);
      await registry.register(pluginC);
      await registry.register(pluginA);

      const loadingOrder = registry.getLoadingOrder();
      expect(loadingOrder).toEqual(['plugin-d', 'plugin-b', 'plugin-c', 'plugin-a']);
    });
  });

  describe('Error Handling', () => {
    it('should provide clear error messages for circular dependencies', async () => {
      const pluginA = createMockPlugin({
        meta: {
          name: 'plugin-a',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-b']
        }
      });

      const pluginB = createMockPlugin({
        meta: {
          name: 'plugin-b',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['plugin-a']
        }
      });

      await registry.register(pluginA);
      await registry.register(pluginB);

      try {
        registry.getLoadingOrder();
        expect.fail('Should have thrown circular dependency error');
      } catch (error: any) {
        expect(error.message).toContain('Circular dependency detected');
        expect(error.message).toContain('plugin-a');
        expect(error.message).toContain('plugin-b');
      }
    });

    it('should handle missing plugin gracefully in dependency resolution', async () => {
      const pluginA = createMockPlugin({
        meta: {
          name: 'plugin-a',
          version: '1.0.0',
          category: 'utility',
          supportedPlatforms: ['web'],
          dependencies: ['missing-plugin']
        }
      });

      await registry.register(pluginA);

      // Should not throw during registration, but should throw during enable
      await expect(registry.enable('plugin-a', { enabled: true })).rejects.toThrow(
        'Dependency \'missing-plugin\' is not available'
      );
    });
  });
});
