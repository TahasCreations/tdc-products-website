/**
 * Plugin System Types
 * Standard interface for all modules/plugins in the TDC ecosystem
 */

import { z } from 'zod';

// Base plugin metadata schema
export const PluginMetaSchema = z.object({
  name: z.string().min(1).max(50),
  version: z.string().regex(/^\d+\.\d+\.\d+/),
  description: z.string().optional(),
  author: z.string().optional(),
  license: z.string().optional(),
  homepage: z.string().url().optional(),
  repository: z.string().url().optional(),
  keywords: z.array(z.string()).optional(),
  category: z.enum([
    'ecommerce',
    'accounting', 
    'analytics',
    'ai',
    'security',
    'marketing',
    'hr',
    'finance',
    'integration',
    'ui',
    'utility'
  ]),
  dependencies: z.array(z.string()).optional(),
  peerDependencies: z.array(z.string()).optional(),
  supportedPlatforms: z.array(z.enum(['web', 'admin', 'api', 'mobile'])).default(['web']),
  minCoreVersion: z.string().optional(),
  maxCoreVersion: z.string().optional()
});

// Plugin configuration schema
export const PluginConfigSchema = z.object({
  enabled: z.boolean().default(true),
  priority: z.number().min(0).max(100).default(50),
  settings: z.record(z.unknown()).optional(),
  features: z.record(z.boolean()).optional(),
  integrations: z.record(z.unknown()).optional()
});

// Plugin lifecycle events
export const PluginEventSchema = z.enum([
  'init',
  'ready', 
  'start',
  'stop',
  'dispose',
  'error',
  'config-changed',
  'dependency-changed'
]);

// Plugin context interface
export interface PluginContext {
  app: {
    version: string;
    environment: 'development' | 'staging' | 'production';
    baseUrl: string;
  };
  services: {
    storage: StorageService;
    api: ApiService;
    events: EventService;
    logger: LoggerService;
    config: ConfigService;
  };
  hooks: {
    useConfig: (key: string) => unknown;
    useService: <T>(serviceName: string) => T;
    emit: (event: string, data?: unknown) => void;
    subscribe: (event: string, callback: Function) => () => void;
  };
}

// Service interfaces
export interface StorageService {
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: unknown) => Promise<void>;
  delete: (key: string) => Promise<void>;
  exists: (key: string) => Promise<boolean>;
}

export interface ApiService {
  request: (endpoint: string, options?: RequestInit) => Promise<Response>;
  get: (endpoint: string) => Promise<unknown>;
  post: (endpoint: string, data?: unknown) => Promise<unknown>;
  put: (endpoint: string, data?: unknown) => Promise<unknown>;
  delete: (endpoint: string) => Promise<unknown>;
}

export interface EventService {
  emit: (event: string, data?: unknown) => void;
  on: (event: string, handler: Function) => () => void;
  off: (event: string, handler: Function) => void;
  once: (event: string, handler: Function) => void;
}

export interface LoggerService {
  debug: (message: string, meta?: unknown) => void;
  info: (message: string, meta?: unknown) => void;
  warn: (message: string, meta?: unknown) => void;
  error: (message: string, meta?: unknown) => void;
}

export interface ConfigService {
  get: <T = unknown>(key: string, defaultValue?: T) => T;
  set: (key: string, value: unknown) => void;
  has: (key: string) => boolean;
  reset: (key?: string) => void;
}

// Main plugin interface
export interface Plugin {
  // Metadata
  meta: z.infer<typeof PluginMetaSchema>;
  
  // Configuration validation
  configSchema?: z.ZodSchema<unknown>;
  
  // Lifecycle methods
  validateConfig: (config: unknown) => { valid: boolean; errors?: string[] };
  init: (context: PluginContext, config: unknown) => Promise<void> | void;
  ready?: () => Promise<void> | void;
  start?: () => Promise<void> | void;
  stop?: () => Promise<void> | void;
  dispose?: () => Promise<void> | void;
  
  // API methods
  getPublicAPI?: () => Record<string, unknown>;
  getRoutes?: () => Array<{
    path: string;
    component?: React.ComponentType;
    handler?: Function;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  }>;
  getComponents?: () => Record<string, React.ComponentType>;
  
  // Event handlers
  onEvent?: (event: z.infer<typeof PluginEventSchema>, data?: unknown) => void;
  
  // Health check
  healthCheck?: () => Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details?: Record<string, unknown>;
  }>;
}

// Plugin registry interface moved to registry.ts to avoid conflicts

// Plugin loader interface moved to loader.ts to avoid conflicts

// Export types
export type PluginMeta = z.infer<typeof PluginMetaSchema>;
export type PluginConfig = z.infer<typeof PluginConfigSchema>;
export type PluginEvent = z.infer<typeof PluginEventSchema>;
