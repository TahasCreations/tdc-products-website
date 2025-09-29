/**
 * Plugin Configuration Schemas
 * Centralized configuration schemas for all plugins
 */

import { z } from 'zod';

// Base configuration schema that all plugins extend
export const BasePluginConfigSchema = z.object({
  enabled: z.boolean().default(true),
  priority: z.number().min(0).max(100).default(50),
  features: z.record(z.boolean()).optional(),
  integrations: z.record(z.unknown()).optional()
});

// E-commerce Plugin Configuration
export const EcommerceConfigSchema = BasePluginConfigSchema.extend({
  settings: z.object({
    currency: z.enum(['TRY', 'USD', 'EUR', 'GBP']).default('TRY'),
    taxRate: z.number().min(0).max(1).default(0.18),
    allowGuestCheckout: z.boolean().default(true),
    requireEmailVerification: z.boolean().default(false),
    maxCartItems: z.number().min(1).max(1000).default(100),
    enableInventoryTracking: z.boolean().default(true),
    lowStockThreshold: z.number().min(0).default(10),
    enableProductVariants: z.boolean().default(true),
    enableReviews: z.boolean().default(true),
    enableWishlist: z.boolean().default(true)
  }),
  features: z.object({
    advancedInventory: z.boolean().default(true),
    bulkOperations: z.boolean().default(true),
    categoryManagement: z.boolean().default(true),
    orderTracking: z.boolean().default(true),
    analytics: z.boolean().default(true)
  }),
  integrations: z.object({
    payment: z.object({
      stripe: z.boolean().default(false),
      paypal: z.boolean().default(false),
      iyzico: z.boolean().default(false)
    }),
    shipping: z.object({
      aras: z.boolean().default(false),
      ups: z.boolean().default(false),
      fedex: z.boolean().default(false)
    })
  })
});

// Logger Plugin Configuration
export const LoggerConfigSchema = BasePluginConfigSchema.extend({
  settings: z.object({
    level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    format: z.enum(['json', 'text', 'compact']).default('text'),
    timestamp: z.boolean().default(true),
    colorize: z.boolean().default(true),
    maxFileSize: z.string().optional(),
    maxFiles: z.number().min(1).max(100).default(5)
  }),
  features: z.object({
    fileLogging: z.boolean().default(false),
    remoteLogging: z.boolean().default(false),
    performanceLogging: z.boolean().default(false)
  }),
  integrations: z.object({
    sentry: z.object({
      enabled: z.boolean().default(false),
      dsn: z.string().optional()
    }),
    datadog: z.object({
      enabled: z.boolean().default(false),
      apiKey: z.string().optional()
    })
  })
});

// Analytics Plugin Configuration
export const AnalyticsConfigSchema = BasePluginConfigSchema.extend({
  settings: z.object({
    trackingEnabled: z.boolean().default(true),
    dataRetentionDays: z.number().min(1).max(3650).default(365),
    realTimeUpdates: z.boolean().default(true),
    exportFormats: z.array(z.enum(['csv', 'excel', 'pdf'])).default(['csv'])
  }),
  features: z.object({
    heatmapTracking: z.boolean().default(true),
    abTesting: z.boolean().default(true),
    predictiveAnalytics: z.boolean().default(true),
    customReports: z.boolean().default(true)
  }),
  integrations: z.object({
    googleAnalytics: z.object({
      enabled: z.boolean().default(false),
      trackingId: z.string().optional()
    }),
    mixpanel: z.object({
      enabled: z.boolean().default(false),
      token: z.string().optional()
    })
  })
});

// Security Plugin Configuration
export const SecurityConfigSchema = BasePluginConfigSchema.extend({
  settings: z.object({
    multiFactorAuth: z.boolean().default(false),
    roleBasedAccess: z.boolean().default(true),
    securityMonitoring: z.boolean().default(true),
    sessionTimeout: z.number().min(300).max(86400).default(3600)
  }),
  features: z.object({
    threatDetection: z.boolean().default(true),
    accessLogging: z.boolean().default(true),
    passwordPolicy: z.boolean().default(true),
    ipWhitelisting: z.boolean().default(false)
  }),
  integrations: z.object({
    auth0: z.object({
      enabled: z.boolean().default(false),
      domain: z.string().optional(),
      clientId: z.string().optional()
    }),
    okta: z.object({
      enabled: z.boolean().default(false),
      domain: z.string().optional(),
      clientId: z.string().optional()
    })
  })
});

// Payment Plugin Configuration
export const PaymentConfigSchema = BasePluginConfigSchema.extend({
  settings: z.object({
    currency: z.enum(['TRY', 'USD', 'EUR', 'GBP']).default('TRY'),
    testMode: z.boolean().default(true)
  }),
  features: z.object({
    stripe: z.boolean().default(false),
    paypal: z.boolean().default(false),
    iyzico: z.boolean().default(false)
  }),
  integrations: z.object({
    stripe: z.object({
      enabled: z.boolean().default(false),
      publicKey: z.string().optional(),
      secretKey: z.string().optional()
    }),
    paypal: z.object({
      enabled: z.boolean().default(false),
      clientId: z.string().optional(),
      clientSecret: z.string().optional()
    }),
    iyzico: z.object({
      enabled: z.boolean().default(false),
      apiKey: z.string().optional(),
      secretKey: z.string().optional()
    })
  })
});

// AI System Configuration
export const AIConfigSchema = BasePluginConfigSchema.extend({
  settings: z.object({
    chatbotEnabled: z.boolean().default(true),
    recommendationsEnabled: z.boolean().default(true),
    priceOptimizationEnabled: z.boolean().default(false),
    languageModel: z.enum(['gpt-3.5', 'gpt-4', 'claude', 'local']).default('gpt-3.5')
  }),
  features: z.object({
    naturalLanguageProcessing: z.boolean().default(true),
    sentimentAnalysis: z.boolean().default(false),
    imageRecognition: z.boolean().default(false),
    predictiveModeling: z.boolean().default(false)
  }),
  integrations: z.object({
    openai: z.object({
      enabled: z.boolean().default(false),
      apiKey: z.string().optional(),
      model: z.string().default('gpt-3.5-turbo')
    }),
    anthropic: z.object({
      enabled: z.boolean().default(false),
      apiKey: z.string().optional(),
      model: z.string().default('claude-3-sonnet')
    })
  })
});

// Marketing Plugin Configuration
export const MarketingConfigSchema = BasePluginConfigSchema.extend({
  settings: z.object({
    emailMarketing: z.boolean().default(true),
    socialMedia: z.boolean().default(true),
    campaigns: z.boolean().default(true),
    coupons: z.boolean().default(true)
  }),
  features: z.object({
    automatedCampaigns: z.boolean().default(false),
    segmentation: z.boolean().default(true),
    abTesting: z.boolean().default(false),
    analytics: z.boolean().default(true)
  }),
  integrations: z.object({
    mailchimp: z.object({
      enabled: z.boolean().default(false),
      apiKey: z.string().optional(),
      listId: z.string().optional()
    }),
    sendgrid: z.object({
      enabled: z.boolean().default(false),
      apiKey: z.string().optional()
    })
  })
});

// HR System Configuration
export const HRConfigSchema = BasePluginConfigSchema.extend({
  settings: z.object({
    employeeTracking: z.boolean().default(true),
    payroll: z.boolean().default(true),
    attendance: z.boolean().default(true),
    performance: z.boolean().default(false)
  }),
  features: z.object({
    timeTracking: z.boolean().default(true),
    leaveManagement: z.boolean().default(true),
    performanceReviews: z.boolean().default(false),
    training: z.boolean().default(false)
  }),
  integrations: z.object({
    adp: z.object({
      enabled: z.boolean().default(false),
      clientId: z.string().optional(),
      clientSecret: z.string().optional()
    })
  })
});

// Inventory Configuration
export const InventoryConfigSchema = BasePluginConfigSchema.extend({
  settings: z.object({
    stockTracking: z.boolean().default(true),
    lowStockAlerts: z.boolean().default(true),
    warehouses: z.number().min(1).max(100).default(1),
    barcodeSupport: z.boolean().default(false)
  }),
  features: z.object({
    automatedReordering: z.boolean().default(false),
    batchTracking: z.boolean().default(false),
    serialNumberTracking: z.boolean().default(false),
    recommendations: z.boolean().default(true)
  }),
  integrations: z.object({
    barcodeScanner: z.object({
      enabled: z.boolean().default(false),
      deviceType: z.enum(['usb', 'bluetooth', 'network']).optional()
    })
  })
});

// Multi-Currency Configuration
export const MultiCurrencyConfigSchema = BasePluginConfigSchema.extend({
  settings: z.object({
    supportedCurrencies: z.array(z.string()).default(['TRY', 'USD', 'EUR']),
    exchangeRateProvider: z.enum(['fixer', 'currencylayer', 'exchangerate']).default('fixer'),
    updateInterval: z.number().min(3600).max(86400).default(3600)
  }),
  features: z.object({
    autoConversion: z.boolean().default(true),
    currencySymbols: z.boolean().default(true),
    historicalRates: z.boolean().default(false)
  }),
  integrations: z.object({
    fixer: z.object({
      enabled: z.boolean().default(false),
      apiKey: z.string().optional()
    }),
    currencylayer: z.object({
      enabled: z.boolean().default(false),
      apiKey: z.string().optional()
    })
  })
});

// Configuration schema mapping
export const PLUGIN_CONFIG_SCHEMAS = {
  ecommerce: EcommerceConfigSchema,
  logger: LoggerConfigSchema,
  analytics: AnalyticsConfigSchema,
  security: SecurityConfigSchema,
  'payment-system': PaymentConfigSchema,
  'ai-system': AIConfigSchema,
  marketing: MarketingConfigSchema,
  'hr-system': HRConfigSchema,
  inventory: InventoryConfigSchema,
  'multi-currency': MultiCurrencyConfigSchema
} as const;

// Configuration validation function
export function validatePluginConfig(pluginName: string, config: unknown): { valid: boolean; errors?: string[] } {
  const schema = PLUGIN_CONFIG_SCHEMAS[pluginName as keyof typeof PLUGIN_CONFIG_SCHEMAS];
  
  if (!schema) {
    return {
      valid: false,
      errors: [`No configuration schema found for plugin '${pluginName}'`]
    };
  }

  try {
    schema.parse(config);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      };
    }
    return {
      valid: false,
      errors: ['Invalid configuration format']
    };
  }
}

// Configuration with environment variable override
export function createConfigWithEnvOverrides(pluginName: string, baseConfig: any): any {
  const envPrefix = `PLUGIN_${pluginName.toUpperCase().replace(/-/g, '_')}`;
  
  // Override with environment variables
  const overrides: any = {};
  
  // Check for common environment variables
  const envEnabled = process.env[`${envPrefix}_ENABLED`];
  if (envEnabled !== undefined) {
    overrides.enabled = envEnabled === 'true';
  }

  // Check for settings overrides
  Object.keys(baseConfig.settings || {}).forEach(key => {
    const envKey = `${envPrefix}_${key.toUpperCase()}`;
    const envValue = process.env[envKey];
    if (envValue !== undefined) {
      overrides.settings = overrides.settings || {};
      overrides.settings[key] = envValue;
    }
  });

  // Merge base config with overrides
  return {
    ...baseConfig,
    ...overrides,
    settings: {
      ...baseConfig.settings,
      ...overrides.settings
    }
  };
}
