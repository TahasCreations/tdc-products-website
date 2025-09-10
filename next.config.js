const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Advanced image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'readdy.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Advanced image optimization settings
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Performance optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Tree shaking optimization (only in production)
    if (!dev) {
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      // Fix webpack optimization conflict
      config.optimization.cacheUnaffected = false;
    }
    
    // Advanced code splitting optimization
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          // Core React libraries
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 40,
          },
          // Next.js framework
          nextjs: {
            test: /[\\/]node_modules[\\/]next[\\/]/,
            name: 'nextjs',
            chunks: 'all',
            priority: 35,
          },
          // Supabase
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'all',
            priority: 30,
          },
          // Chart libraries
          charts: {
            test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2|recharts)[\\/]/,
            name: 'charts',
            chunks: 'all',
            priority: 25,
          },
          // UI libraries
          ui: {
            test: /[\\/]node_modules[\\/](lucide-react|@radix-ui|tailwindcss)[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 20,
          },
          // Utility libraries
          utils: {
            test: /[\\/]node_modules[\\/](lodash|date-fns|clsx|class-variance-authority)[\\/]/,
            name: 'utils',
            chunks: 'all',
            priority: 15,
          },
          // Other vendors
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    
    return config;
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', 'lucide-react', 'chart.js', 'react-chartjs-2'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Advanced headers for better caching and security
  async headers() {
    return [
      // Static assets caching
      {
        source: '/storage/v1/object/public/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // API routes caching
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // Static files caching
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Images caching
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Security headers for all pages
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = withPWA(withBundleAnalyzer(nextConfig));
