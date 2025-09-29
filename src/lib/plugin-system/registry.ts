/**
 * Plugin Registry
 * Central registry for managing all plugins/modules in the TDC ecosystem
 */

import { Plugin, PluginMeta, PluginConfig, PluginContext } from './types';
import { PluginMetaSchema, PluginConfigSchema } from './types';
import { z } from 'zod';

export class PluginRegistry {
  private plugins = new Map<string, Plugin>();
  private loadedPlugins = new Set<string>();
  private pluginConfigs = new Map<string, PluginConfig>();
  private context: PluginContext | null = null;
  private dependencyGraph = new Map<string, string[]>();
  private eventListeners = new Map<string, Function[]>();

  constructor() {
    this.setupEventSystem();
  }

  /**
   * Set the plugin context
   */
  setContext(context: PluginContext): void {
    this.context = context;
  }

  /**
   * Register a plugin
   */
  async register(plugin: Plugin): Promise<void> {
    // Validate plugin metadata
    const validation = this.validate(plugin);
    if (!validation.valid) {
      throw new Error(`Plugin validation failed: ${validation.errors?.join(', ')}`);
    }

    const pluginName = plugin.meta.name;
    
    // Check if plugin already exists
    if (this.plugins.has(pluginName)) {
      throw new Error(`Plugin '${pluginName}' is already registered`);
    }

    // Validate dependencies
    const dependencies = this.resolveDependencies(plugin);
    const missingDeps = dependencies.filter(dep => !this.plugins.has(dep));
    if (missingDeps.length > 0) {
      throw new Error(`Plugin '${pluginName}' has missing dependencies: ${missingDeps.join(', ')}`);
    }

    // Register plugin
    this.plugins.set(pluginName, plugin);
    this.dependencyGraph.set(pluginName, dependencies);
    
    this.emit('plugin-registered', { pluginName, meta: plugin.meta });
  }

  /**
   * Unregister a plugin
   */
  async unregister(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin '${pluginName}' not found`);
    }

    // Check if plugin is loaded
    if (this.loadedPlugins.has(pluginName)) {
      await this.unload(pluginName);
    }

    // Check if other plugins depend on this one
    const dependents = Array.from(this.plugins.keys()).filter(name => {
      const deps = this.dependencyGraph.get(name) || [];
      return deps.includes(pluginName);
    });

    if (dependents.length > 0) {
      throw new Error(`Cannot unregister plugin '${pluginName}': ${dependents.join(', ')} depend on it`);
    }

    this.plugins.delete(pluginName);
    this.dependencyGraph.delete(pluginName);
    this.pluginConfigs.delete(pluginName);
    
    this.emit('plugin-unregistered', { pluginName });
  }

  /**
   * Get a plugin by name
   */
  get(pluginName: string): Plugin | undefined {
    return this.plugins.get(pluginName);
  }

  /**
   * Get all registered plugins
   */
  getAll(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get plugins by category
   */
  getByCategory(category: string): Plugin[] {
    return this.getAll().filter(plugin => plugin.meta.category === category);
  }

  /**
   * Check if plugin is loaded
   */
  isLoaded(pluginName: string): boolean {
    return this.loadedPlugins.has(pluginName);
  }

  /**
   * Load a plugin with optional configuration
   */
  async load(pluginName: string, config?: unknown): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin '${pluginName}' not found`);
    }

    if (this.loadedPlugins.has(pluginName)) {
      console.warn(`Plugin '${pluginName}' is already loaded`);
      return;
    }

    if (!this.context) {
      throw new Error('Plugin context not set');
    }

    try {
      // Validate configuration
      if (config && plugin.validateConfig) {
        const configValidation = plugin.validateConfig(config);
        if (!configValidation.valid) {
          throw new Error(`Configuration validation failed: ${configValidation.errors?.join(', ')}`);
        }
      }

      // Store configuration
      if (config) {
        const validatedConfig = PluginConfigSchema.parse(config);
        this.pluginConfigs.set(pluginName, validatedConfig);
      }

      // Load dependencies first
      const dependencies = this.dependencyGraph.get(pluginName) || [];
      for (const dep of dependencies) {
        if (!this.loadedPlugins.has(dep)) {
          await this.load(dep);
        }
      }

      // Initialize plugin
      await plugin.init(this.context, config);
      this.loadedPlugins.add(pluginName);

      // Call ready hook if available
      if (plugin.ready) {
        await plugin.ready();
      }

      this.emit('plugin-loaded', { pluginName, config });
    } catch (error) {
      this.emit('plugin-load-error', { pluginName, error });
      throw error;
    }
  }

  /**
   * Unload a plugin
   */
  async unload(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin '${pluginName}' not found`);
    }

    if (!this.loadedPlugins.has(pluginName)) {
      console.warn(`Plugin '${pluginName}' is not loaded`);
      return;
    }

    try {
      // Stop plugin if available
      if (plugin.stop) {
        await plugin.stop();
      }

      // Dispose plugin if available
      if (plugin.dispose) {
        await plugin.dispose();
      }

      this.loadedPlugins.delete(pluginName);
      this.pluginConfigs.delete(pluginName);
      
      this.emit('plugin-unloaded', { pluginName });
    } catch (error) {
      this.emit('plugin-unload-error', { pluginName, error });
      throw error;
    }
  }

  /**
   * Reload a plugin
   */
  async reload(pluginName: string, config?: unknown): Promise<void> {
    await this.unload(pluginName);
    await this.load(pluginName, config);
  }

  /**
   * Validate a plugin
   */
  validate(plugin: Plugin): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    try {
      // Validate metadata
      PluginMetaSchema.parse(plugin.meta);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(`Metadata validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
    }

    // Validate required methods
    if (typeof plugin.validateConfig !== 'function') {
      errors.push('Plugin must implement validateConfig method');
    }

    if (typeof plugin.init !== 'function') {
      errors.push('Plugin must implement init method');
    }

    // Validate configuration schema if provided
    if (plugin.configSchema) {
      try {
        plugin.configSchema.parse({});
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors.push(`Configuration schema validation failed: ${error.errors.map(e => e.message).join(', ')}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Resolve plugin dependencies
   */
  resolveDependencies(plugin: Plugin): string[] {
    const dependencies = new Set<string>();
    
    // Add explicit dependencies
    if (plugin.meta.dependencies) {
      plugin.meta.dependencies.forEach(dep => dependencies.add(dep));
    }

    // Add peer dependencies
    if (plugin.meta.peerDependencies) {
      plugin.meta.peerDependencies.forEach(dep => dependencies.add(dep));
    }

    return Array.from(dependencies);
  }

  /**
   * Get loading order for plugins
   */
  getLoadingOrder(): string[] {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: string[] = [];

    const visit = (pluginName: string) => {
      if (visiting.has(pluginName)) {
        throw new Error(`Circular dependency detected involving plugin '${pluginName}'`);
      }
      
      if (visited.has(pluginName)) {
        return;
      }

      visiting.add(pluginName);
      
      const dependencies = this.dependencyGraph.get(pluginName) || [];
      for (const dep of dependencies) {
        visit(dep);
      }
      
      visiting.delete(pluginName);
      visited.add(pluginName);
      order.push(pluginName);
    };

    for (const pluginName of this.plugins.keys()) {
      visit(pluginName);
    }

    return order;
  }

  /**
   * Setup event system
   */
  private setupEventSystem(): void {
    // Plugin lifecycle events
    this.on('plugin-registered', (data) => {
      console.log(`Plugin registered: ${data.pluginName}`);
    });

    this.on('plugin-loaded', (data) => {
      console.log(`Plugin loaded: ${data.pluginName}`);
    });

    this.on('plugin-unloaded', (data) => {
      console.log(`Plugin unloaded: ${data.pluginName}`);
    });

    this.on('plugin-load-error', (data) => {
      console.error(`Plugin load error: ${data.pluginName}`, data.error);
    });

    this.on('plugin-unload-error', (data) => {
      console.error(`Plugin unload error: ${data.pluginName}`, data.error);
    });
  }

  /**
   * Emit an event
   */
  private emit(event: string, data?: unknown): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in event listener for '${event}':`, error);
      }
    });
  }

  /**
   * Subscribe to an event
   */
  on(event: string, listener: Function): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    
    this.eventListeners.get(event)!.push(listener);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(event) || [];
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }
}

// Export singleton instance
export const pluginRegistry = new PluginRegistry();
