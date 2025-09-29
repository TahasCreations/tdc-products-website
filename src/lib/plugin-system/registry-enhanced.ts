/**
 * Enhanced Plugin Registry
 * Advanced plugin management with discovery, dependency resolution, and lifecycle management
 */

import { Plugin, PluginMeta, PluginConfig, PluginContext } from './types';
import { PluginMetaSchema, PluginConfigSchema } from './types';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import glob from 'glob';

interface PluginManifest {
  name: string;
  version: string;
  description?: string;
  main?: string;
  dependsOn?: string[];
  tdcPlugin?: boolean;
}

interface PluginStatus {
  name: string;
  loaded: boolean;
  enabled: boolean;
  config?: any;
  dependencies: string[];
  dependents: string[];
  lastError?: string;
  loadTime?: number;
}

export class EnhancedPluginRegistry {
  private plugins = new Map<string, Plugin>();
  private pluginStatuses = new Map<string, PluginStatus>();
  private pluginConfigs = new Map<string, PluginConfig>();
  private context: PluginContext | null = null;
  private dependencyGraph = new Map<string, string[]>();
  private loadingOrder: string[] = [];
  private eventListeners = new Map<string, Function[]>();
  private manifestCache = new Map<string, PluginManifest>();
  private nameNormalizationMap = new Map<string, string>();

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
   * Discover plugins from filesystem
   */
  async discoverPlugins(searchPaths: string[] = ['src/plugins/**', 'plugins/**']): Promise<string[]> {
    const discoveredPlugins: string[] = [];

    for (const searchPath of searchPaths) {
      const pluginFiles = await this.findPluginFiles(searchPath);
      
      for (const file of pluginFiles) {
        try {
          const manifest = await this.loadPluginManifest(file);
          if (manifest && this.isValidPlugin(manifest)) {
            const normalizedName = this.normalizePluginName(manifest.name);
            discoveredPlugins.push(normalizedName);
            this.manifestCache.set(normalizedName, manifest);
          }
        } catch (error) {
          this.emit('plugin-discovery-error', { file, error: error.message });
        }
      }
    }

    this.emit('plugins-discovered', { count: discoveredPlugins.length, plugins: discoveredPlugins });
    return discoveredPlugins;
  }

  /**
   * Register a plugin
   */
  async register(plugin: Plugin): Promise<void> {
    const pluginName = this.normalizePluginName(plugin.meta.name);
    
    // Check for name conflicts
    if (this.plugins.has(pluginName)) {
      throw new Error(`Plugin name conflict: '${pluginName}' is already registered`);
    }

    // Validate plugin
    const validation = this.validatePlugin(plugin);
    if (!validation.valid) {
      throw new Error(`Plugin validation failed: ${validation.errors?.join(', ')}`);
    }

    // Register plugin
    this.plugins.set(pluginName, plugin);
    this.pluginStatuses.set(pluginName, {
      name: pluginName,
      loaded: false,
      enabled: false,
      dependencies: this.resolveDependencies(plugin),
      dependents: []
    });

    // Update dependency graph
    this.updateDependencyGraph(pluginName, plugin);
    
    this.emit('plugin-registered', { pluginName, meta: plugin.meta });
  }

  /**
   * Enable a plugin with configuration
   */
  async enable(name: string, config?: any): Promise<void> {
    const pluginName = this.normalizePluginName(name);
    const plugin = this.plugins.get(pluginName);
    
    if (!plugin) {
      throw new Error(`Plugin '${pluginName}' not found`);
    }

    const status = this.pluginStatuses.get(pluginName);
    if (!status) {
      throw new Error(`Plugin status not found for '${pluginName}'`);
    }

    if (status.enabled) {
      console.warn(`Plugin '${pluginName}' is already enabled`);
      return;
    }

    try {
      // Validate configuration if plugin has schema
      if (plugin.validateConfig && config) {
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
      await this.loadDependencies(pluginName);

      // Initialize plugin
      const startTime = performance.now();
      
      if (!status.loaded) {
        await this.initializePlugin(plugin, config);
        status.loaded = true;
      }

      status.enabled = true;
      status.config = config;
      status.loadTime = performance.now() - startTime;
      status.lastError = undefined;

      this.emit('plugin-enabled', { pluginName, config, loadTime: status.loadTime });

    } catch (error) {
      status.lastError = error.message;
      this.emit('plugin-enable-error', { pluginName, error: error.message });
      throw error;
    }
  }

  /**
   * Disable a plugin
   */
  async disable(name: string): Promise<void> {
    const pluginName = this.normalizePluginName(name);
    const plugin = this.plugins.get(pluginName);
    
    if (!plugin) {
      throw new Error(`Plugin '${pluginName}' not found`);
    }

    const status = this.pluginStatuses.get(pluginName);
    if (!status) {
      throw new Error(`Plugin status not found for '${pluginName}'`);
    }

    if (!status.enabled) {
      console.warn(`Plugin '${pluginName}' is not enabled`);
      return;
    }

    try {
      // Disable dependents first
      await this.disableDependents(pluginName);

      // Stop plugin
      if (plugin.stop) {
        await plugin.stop();
      }

      status.enabled = false;
      this.emit('plugin-disabled', { pluginName });

    } catch (error) {
      status.lastError = error.message;
      this.emit('plugin-disable-error', { pluginName, error: error.message });
      throw error;
    }
  }

  /**
   * Get a plugin by name
   */
  get(name: string): Plugin | undefined {
    const pluginName = this.normalizePluginName(name);
    return this.plugins.get(pluginName);
  }

  /**
   * List all plugins with their status
   */
  list(): PluginStatus[] {
    return Array.from(this.pluginStatuses.values());
  }

  /**
   * Get plugin status
   */
  getStatus(name: string): PluginStatus | undefined {
    const pluginName = this.normalizePluginName(name);
    return this.pluginStatuses.get(pluginName);
  }

  /**
   * Get loading order based on dependencies
   */
  getLoadingOrder(): string[] {
    return [...this.loadingOrder];
  }

  /**
   * Check for circular dependencies
   */
  detectCircularDependencies(): string[] {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const circularDeps: string[] = [];

    const visit = (pluginName: string, path: string[]) => {
      if (recursionStack.has(pluginName)) {
        const cycleStart = path.indexOf(pluginName);
        const cycle = path.slice(cycleStart).concat(pluginName);
        circularDeps.push(cycle.join(' -> '));
        return;
      }

      if (visited.has(pluginName)) {
        return;
      }

      visited.add(pluginName);
      recursionStack.add(pluginName);

      const dependencies = this.dependencyGraph.get(pluginName) || [];
      for (const dep of dependencies) {
        visit(dep, [...path, pluginName]);
      }

      recursionStack.delete(pluginName);
    };

    for (const pluginName of this.plugins.keys()) {
      visit(pluginName, []);
    }

    return circularDeps;
  }

  /**
   * Get plugin dependency tree
   */
  getDependencyTree(pluginName: string): any {
    const tree: any = {
      name: pluginName,
      dependencies: []
    };

    const dependencies = this.dependencyGraph.get(pluginName) || [];
    for (const dep of dependencies) {
      tree.dependencies.push(this.getDependencyTree(dep));
    }

    return tree;
  }

  /**
   * Validate plugin
   */
  validatePlugin(plugin: Plugin): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    try {
      PluginMetaSchema.parse(plugin.meta);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(`Metadata validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
    }

    if (typeof plugin.validateConfig !== 'function') {
      errors.push('Plugin must implement validateConfig method');
    }

    if (typeof plugin.init !== 'function') {
      errors.push('Plugin must implement init method');
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
      plugin.meta.dependencies.forEach(dep => dependencies.add(this.normalizePluginName(dep)));
    }

    // Add peer dependencies
    if (plugin.meta.peerDependencies) {
      plugin.meta.peerDependencies.forEach(dep => dependencies.add(this.normalizePluginName(dep)));
    }

    return Array.from(dependencies);
  }

  // Private methods
  private async findPluginFiles(searchPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      glob(searchPath, (err, files) => {
        if (err) {
          reject(err);
        } else {
          // Filter for plugin files
          const pluginFiles = files.filter(file => 
            file.endsWith('index.ts') || 
            file.endsWith('index.js') ||
            file.endsWith('plugin.ts') ||
            file.endsWith('plugin.js')
          );
          resolve(pluginFiles);
        }
      });
    });
  }

  private async loadPluginManifest(filePath: string): Promise<PluginManifest | null> {
    try {
      // Try to load from package.json first
      const packagePath = path.join(path.dirname(filePath), 'package.json');
      if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        if (packageJson.tdcPlugin) {
          return {
            name: packageJson.name,
            version: packageJson.version,
            description: packageJson.description,
            main: packageJson.main,
            dependsOn: packageJson.dependsOn,
            tdcPlugin: true
          };
        }
      }

      // Try to load from plugin file
      const pluginModule = await import(filePath);
      const plugin = pluginModule.default || pluginModule.plugin;
      
      if (plugin && plugin.meta) {
        return {
          name: plugin.meta.name,
          version: plugin.meta.version,
          description: plugin.meta.description,
          dependsOn: plugin.meta.dependencies
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  private isValidPlugin(manifest: PluginManifest): boolean {
    return !!(manifest.name && manifest.version);
  }

  private normalizePluginName(name: string): string {
    const normalized = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    // Check for conflicts
    if (this.nameNormalizationMap.has(normalized) && this.nameNormalizationMap.get(normalized) !== name) {
      throw new Error(`Plugin name conflict: '${name}' and '${this.nameNormalizationMap.get(normalized)}' both normalize to '${normalized}'`);
    }
    
    this.nameNormalizationMap.set(normalized, name);
    return normalized;
  }

  private updateDependencyGraph(pluginName: string, plugin: Plugin): void {
    const dependencies = this.resolveDependencies(plugin);
    this.dependencyGraph.set(pluginName, dependencies);

    // Update dependents
    for (const dep of dependencies) {
      const depStatus = this.pluginStatuses.get(dep);
      if (depStatus && !depStatus.dependents.includes(pluginName)) {
        depStatus.dependents.push(pluginName);
      }
    }

    // Recalculate loading order
    this.calculateLoadingOrder();
  }

  private calculateLoadingOrder(): void {
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

    this.loadingOrder = order;
  }

  private async loadDependencies(pluginName: string): Promise<void> {
    const dependencies = this.dependencyGraph.get(pluginName) || [];
    
    for (const dep of dependencies) {
      const depStatus = this.pluginStatuses.get(dep);
      if (!depStatus || !depStatus.enabled) {
        throw new Error(`Dependency '${dep}' is not available for plugin '${pluginName}'`);
      }
    }
  }

  private async initializePlugin(plugin: Plugin, config?: any): Promise<void> {
    if (!this.context) {
      throw new Error('Plugin context not set');
    }

    // Idempotent initialization check
    if (plugin.init && typeof plugin.init === 'function') {
      await plugin.init(this.context, config);
    }

    // Call ready hook if available
    if (plugin.ready && typeof plugin.ready === 'function') {
      await plugin.ready();
    }
  }

  private async disableDependents(pluginName: string): Promise<void> {
    const status = this.pluginStatuses.get(pluginName);
    if (!status) return;

    for (const dependent of status.dependents) {
      const depStatus = this.pluginStatuses.get(dependent);
      if (depStatus && depStatus.enabled) {
        await this.disable(dependent);
      }
    }
  }

  private setupEventSystem(): void {
    // Plugin lifecycle events
    this.on('plugin-registered', (data) => {
      console.log(`Plugin registered: ${data.pluginName}`);
    });

    this.on('plugin-enabled', (data) => {
      console.log(`Plugin enabled: ${data.pluginName}`);
    });

    this.on('plugin-disabled', (data) => {
      console.log(`Plugin disabled: ${data.pluginName}`);
    });

    this.on('plugin-enable-error', (data) => {
      console.error(`Plugin enable error: ${data.pluginName}`, data.error);
    });

    this.on('plugin-disable-error', (data) => {
      console.error(`Plugin disable error: ${data.pluginName}`, data.error);
    });
  }

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

  private on(event: string, listener: Function): () => void {
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
export const enhancedPluginRegistry = new EnhancedPluginRegistry();
