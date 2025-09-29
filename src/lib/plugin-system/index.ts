/**
 * Plugin System Entry Point
 * Main export for the TDC Plugin System
 */

export * from './types';
export * from './registry';
export * from './loader';

// Re-export commonly used items
export { pluginRegistry } from './registry';
export { pluginLoader } from './loader';

// Plugin system initialization
export class PluginSystem {
  private static instance: PluginSystem | null = null;
  private initialized = false;

  static getInstance(): PluginSystem {
    if (!PluginSystem.instance) {
      PluginSystem.instance = new PluginSystem();
    }
    return PluginSystem.instance;
  }

  /**
   * Initialize the plugin system
   */
  async initialize(context: any): Promise<void> {
    if (this.initialized) {
      console.warn('Plugin system already initialized');
      return;
    }

    try {
      // Set up plugin registry context
      const { pluginRegistry } = await import('./registry');
      pluginRegistry.setContext(context);

      this.initialized = true;
      console.log('Plugin system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize plugin system:', error);
      throw error;
    }
  }

  /**
   * Check if plugin system is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get plugin registry
   */
  async getRegistry() {
    const { pluginRegistry } = await import('./registry');
    return pluginRegistry;
  }

  /**
   * Get plugin loader
   */
  async getLoader() {
    const { pluginLoader } = await import('./loader');
    return pluginLoader;
  }
}

// Export singleton instance
export const pluginSystem = PluginSystem.getInstance();
