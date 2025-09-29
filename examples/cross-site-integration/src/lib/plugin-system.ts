import { enhancedPluginRegistry } from '../../../src/lib/plugin-system/registry-enhanced';

// Mock servisler - gerçek uygulamada bunlar farklı kaynaklardan gelecek
function createStorageService() {
  return {
    get: (key: string) => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    },
    set: (key: string, value: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    },
    remove: (key: string) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    }
  };
}

function createApiService() {
  return {
    get: async (url: string) => {
      const response = await fetch(url);
      return response.json();
    },
    post: async (url: string, data: any) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    }
  };
}

function createEventService() {
  const listeners = new Map();
  
  return {
    on: (event: string, callback: Function) => {
      if (!listeners.has(event)) {
        listeners.set(event, []);
      }
      listeners.get(event).push(callback);
    },
    emit: (event: string, data?: any) => {
      const eventListeners = listeners.get(event) || [];
      eventListeners.forEach((callback: Function) => callback(data));
    },
    off: (event: string, callback: Function) => {
      const eventListeners = listeners.get(event) || [];
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  };
}

function createLoggerService() {
  return {
    info: (message: string, meta?: any) => {
      console.log(`[INFO] ${message}`, meta || '');
    },
    warn: (message: string, meta?: any) => {
      console.warn(`[WARN] ${message}`, meta || '');
    },
    error: (message: string, meta?: any) => {
      console.error(`[ERROR] ${message}`, meta || '');
    },
    debug: (message: string, meta?: any) => {
      console.debug(`[DEBUG] ${message}`, meta || '');
    }
  };
}

function createConfigService() {
  return {
    get: (key: string, defaultValue?: any) => {
      // Environment variables'den oku
      const envKey = `PLUGIN_${key.toUpperCase().replace(/-/g, '_')}`;
      if (typeof process !== 'undefined' && process.env) {
        return process.env[envKey] || defaultValue;
      }
      return defaultValue;
    },
    set: (key: string, value: any) => {
      // Runtime config için
      if (typeof window !== 'undefined') {
        window.__PLUGIN_CONFIG__ = window.__PLUGIN_CONFIG__ || {};
        window.__PLUGIN_CONFIG__[key] = value;
      }
    }
  };
}

export async function initializePluginSystem() {
  const context = {
    app: {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      platform: 'nextjs'
    },
    services: {
      storage: createStorageService(),
      api: createApiService(),
      events: createEventService(),
      logger: createLoggerService(),
      config: createConfigService()
    },
    features: {
      hotReload: true,
      lazyLoading: true,
      parallelInit: true,
      errorRecovery: true
    }
  };

  // Plugin registry'yi başlat
  await enhancedPluginRegistry.setContext(context);
  
  // Plugin'leri keşfet (örnek uygulamada bu otomatik olarak yapılır)
  try {
    await enhancedPluginRegistry.discoverPlugins();
    context.services.logger.info('Plugin system initialized successfully');
  } catch (error) {
    context.services.logger.error('Failed to initialize plugin system', error);
    throw error;
  }

  return enhancedPluginRegistry;
}

// Global window type extension
declare global {
  interface Window {
    __PLUGIN_CONFIG__?: Record<string, any>;
  }
}
