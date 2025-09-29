/**
 * Plugin Loader
 * Handles loading plugins from various sources
 */

import { Plugin, PluginMeta } from './types';
import { PluginMetaSchema } from './types';

export class PluginLoader {
  /**
   * Load plugin from file path
   */
  async loadFromPath(path: string): Promise<Plugin> {
    try {
      // Dynamic import from path
      const pluginModule = await import(path);
      
      // Check if module exports a default plugin
      if (pluginModule.default && this.validatePlugin(pluginModule.default)) {
        return pluginModule.default;
      }
      
      // Check if module exports a plugin property
      if (pluginModule.plugin && this.validatePlugin(pluginModule.plugin)) {
        return pluginModule.plugin;
      }
      
      throw new Error(`No valid plugin found in module at path: ${path}`);
    } catch (error) {
      throw new Error(`Failed to load plugin from path '${path}': ${error}`);
    }
  }

  /**
   * Load plugin from npm package
   */
  async loadFromPackage(packageName: string): Promise<Plugin> {
    try {
      // Try to resolve package
      const packageModule = await import(packageName);
      
      // Check for common export patterns
      const possibleExports = [
        packageModule.default,
        packageModule.plugin,
        packageModule[packageName],
        packageModule[packageName.replace(/^@/, '').replace(/\//g, '-')]
      ];
      
      for (const exportValue of possibleExports) {
        if (exportValue && this.validatePlugin(exportValue)) {
          return exportValue;
        }
      }
      
      throw new Error(`No valid plugin found in package: ${packageName}`);
    } catch (error) {
      throw new Error(`Failed to load plugin from package '${packageName}': ${error}`);
    }
  }

  /**
   * Load plugin from URL (for remote plugins)
   */
  async loadFromUrl(url: string): Promise<Plugin> {
    try {
      // Fetch the plugin code
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const code = await response.text();
      
      // Create a blob URL for the code
      const blob = new Blob([code], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);
      
      try {
        // Dynamic import from blob URL
        const urlModule = await import(blobUrl);
        
        if (urlModule.default && this.validatePlugin(urlModule.default)) {
          return urlModule.default;
        }
        
        throw new Error(`No valid plugin found in remote module at: ${url}`);
      } finally {
        // Clean up blob URL
        URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      throw new Error(`Failed to load plugin from URL '${url}': ${error}`);
    }
  }

  /**
   * Validate that an object is a valid plugin
   */
  validatePlugin(plugin: unknown): plugin is Plugin {
    if (!plugin || typeof plugin !== 'object') {
      return false;
    }

    const p = plugin as Record<string, unknown>;

    // Check for required properties
    if (!p.meta || typeof p.meta !== 'object') {
      return false;
    }

    // Validate metadata
    try {
      PluginMetaSchema.parse(p.meta);
    } catch {
      return false;
    }

    // Check for required methods
    if (typeof p.validateConfig !== 'function') {
      return false;
    }

    if (typeof p.init !== 'function') {
      return false;
    }

    return true;
  }

  /**
   * Load multiple plugins from a manifest file
   */
  async loadFromManifest(manifestPath: string): Promise<Plugin[]> {
    try {
      const response = await fetch(manifestPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch manifest: ${response.statusText}`);
      }
      
      const manifest = await response.json();
      
      if (!Array.isArray(manifest.plugins)) {
        throw new Error('Manifest must contain a plugins array');
      }
      
      const plugins: Plugin[] = [];
      
      for (const pluginConfig of manifest.plugins) {
        let plugin: Plugin;
        
        if (pluginConfig.path) {
          plugin = await this.loadFromPath(pluginConfig.path);
        } else if (pluginConfig.package) {
          plugin = await this.loadFromPackage(pluginConfig.package);
        } else if (pluginConfig.url) {
          plugin = await this.loadFromUrl(pluginConfig.url);
        } else {
          throw new Error('Plugin config must specify path, package, or url');
        }
        
        plugins.push(plugin);
      }
      
      return plugins;
    } catch (error) {
      throw new Error(`Failed to load plugins from manifest '${manifestPath}': ${error}`);
    }
  }

  /**
   * Discover plugins in a directory
   */
  async discoverPlugins(directory: string): Promise<Plugin[]> {
    try {
      // This would typically use a file system API or require a server-side implementation
      // For now, we'll return an empty array as this is client-side
      console.warn('Plugin discovery is not implemented for client-side environments');
      return [];
    } catch (error) {
      throw new Error(`Failed to discover plugins in directory '${directory}': ${error}`);
    }
  }
}

// Export singleton instance
export const pluginLoader = new PluginLoader();
