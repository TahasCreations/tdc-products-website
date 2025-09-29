/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  webpack: (config) => {
    // Plugin system için gerekli webpack konfigürasyonları
    config.resolve.alias = {
      ...config.resolve.alias,
      '@tdc/plugin-system': require.resolve('../../src/lib/plugin-system')
    };
    
    return config;
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
  // Plugin sistemi için gerekli environment variables
  env: {
    PLUGIN_ECOMMERCE_ENABLED: 'true',
    PLUGIN_ECOMMERCE_CURRENCY: 'TRY',
    PLUGIN_ECOMMERCE_TAX_RATE: '0.18',
    PLUGIN_PRICING_PLUGIN_ENABLED: 'true',
    PLUGIN_PRICING_PLUGIN_CURRENCY: 'TRY',
    PLUGIN_LOGGER_ENABLED: 'true',
    PLUGIN_LOGGER_LEVEL: 'info'
  }
};

module.exports = nextConfig;
