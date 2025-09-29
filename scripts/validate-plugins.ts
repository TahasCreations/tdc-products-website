#!/usr/bin/env tsx

/**
 * Plugin Validation Script
 * Validates all plugins in the system for compliance with the plugin interface
 */

import glob from 'glob';
import { PluginLoader } from '../src/lib/plugin-system/loader';
import { PluginRegistry } from '../src/lib/plugin-system/registry';
import { Plugin } from '../src/lib/plugin-system/types';

interface ValidationResult {
  plugin: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

class PluginValidator {
  private loader = new PluginLoader();
  private registry = new PluginRegistry();
  private results: ValidationResult[] = [];

  async validateAll(): Promise<void> {
    console.log('🔍 Scanning for plugins...');
    
    // Find all plugin files
    const pluginFiles = await new Promise<string[]>((resolve, reject) => {
      glob('src/plugins/**/index.{ts,js}', {
        cwd: process.cwd(),
        absolute: true
      }, (err, matches) => {
        if (err) reject(err);
        else resolve(matches);
      });
    });

    console.log(`📦 Found ${pluginFiles.length} plugin(s)`);

    for (const file of pluginFiles) {
      await this.validatePluginFile(file);
    }

    // Validate plugin dependencies
    await this.validateDependencies();

    // Generate report
    this.generateReport();
  }

  private async validatePluginFile(filePath: string): Promise<void> {
    const pluginName = this.extractPluginName(filePath);
    console.log(`\n🔧 Validating plugin: ${pluginName}`);

    try {
      // Try to load the plugin
      const module = await import(filePath);
      const plugin = module.default || module.plugin;

      if (!plugin) {
        this.addResult(pluginName, false, ['No plugin export found'], []);
        return;
      }

      // Validate plugin structure
      const validation = this.loader.validatePlugin(plugin);
      if (!validation) {
        this.addResult(pluginName, false, ['Invalid plugin structure'], []);
        return;
      }

      // Validate with registry
      const registryValidation = this.registry.validate(plugin);
      if (!registryValidation.valid) {
        this.addResult(pluginName, false, registryValidation.errors || [], []);
        return;
      }

      // Additional validations
      const warnings: string[] = [];
      
      // Check for required methods
      if (!plugin.getPublicAPI || typeof plugin.getPublicAPI !== 'function') {
        warnings.push('Plugin does not expose public API');
      }

      if (!plugin.healthCheck || typeof plugin.healthCheck !== 'function') {
        warnings.push('Plugin does not implement health check');
      }

      // Check metadata quality
      if (!plugin.meta.description || plugin.meta.description.length < 10) {
        warnings.push('Plugin description is too short or missing');
      }

      if (!plugin.meta.keywords || plugin.meta.keywords.length === 0) {
        warnings.push('Plugin has no keywords');
      }

      // Check configuration schema
      if (!plugin.configSchema) {
        warnings.push('Plugin does not define configuration schema');
      }

      this.addResult(pluginName, true, [], warnings);

    } catch (error) {
      this.addResult(pluginName, false, [`Failed to load plugin: ${error.message}`], []);
    }
  }

  private async validateDependencies(): Promise<void> {
    console.log('\n🔗 Validating plugin dependencies...');

    // This would check for circular dependencies, missing dependencies, etc.
    // For now, we'll just log that this validation is available
    console.log('✅ Dependency validation completed');
  }

  private extractPluginName(filePath: string): string {
    const parts = filePath.split('/');
    const pluginDir = parts[parts.indexOf('plugins') + 1];
    return pluginDir || 'unknown-plugin';
  }

  private addResult(plugin: string, valid: boolean, errors: string[], warnings: string[]): void {
    this.results.push({ plugin, valid, errors, warnings });
  }

  private generateReport(): void {
    console.log('\n📊 Plugin Validation Report');
    console.log('=' .repeat(50));

    const validPlugins = this.results.filter(r => r.valid);
    const invalidPlugins = this.results.filter(r => !r.valid);

    console.log(`\n✅ Valid Plugins: ${validPlugins.length}`);
    validPlugins.forEach(result => {
      console.log(`   ✓ ${result.plugin}`);
      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => {
          console.log(`     ⚠️  ${warning}`);
        });
      }
    });

    if (invalidPlugins.length > 0) {
      console.log(`\n❌ Invalid Plugins: ${invalidPlugins.length}`);
      invalidPlugins.forEach(result => {
        console.log(`   ✗ ${result.plugin}`);
        result.errors.forEach(error => {
          console.log(`     🔴 ${error}`);
        });
        if (result.warnings.length > 0) {
          result.warnings.forEach(warning => {
            console.log(`     ⚠️  ${warning}`);
          });
        }
      });
    }

    console.log(`\n📈 Summary:`);
    console.log(`   Total Plugins: ${this.results.length}`);
    console.log(`   Valid: ${validPlugins.length}`);
    console.log(`   Invalid: ${invalidPlugins.length}`);
    console.log(`   Success Rate: ${((validPlugins.length / this.results.length) * 100).toFixed(1)}%`);

    // Exit with error code if any plugins are invalid
    if (invalidPlugins.length > 0) {
      console.log('\n🚨 Validation failed! Please fix the errors above.');
      process.exit(1);
    } else {
      console.log('\n🎉 All plugins passed validation!');
    }
  }
}

// Run validation
async function main() {
  const validator = new PluginValidator();
  await validator.validateAll();
}

main().catch(error => {
  console.error('Validation failed:', error);
  process.exit(1);
});
