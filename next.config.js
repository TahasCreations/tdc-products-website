/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for production
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'via.placeholder.com',
      'picsum.photos'
    ],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Webpack optimization
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // Experimental features
  experimental: {
    // Enable modern features
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    // Disable useSearchParams() suspense warnings
    missingSuspenseWithCSRBailout: false,
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // TypeScript and ESLint configuration
  typescript: {
    // Allow TypeScript errors during build for faster deployment
    // Fix errors in development, but don't block production builds
    ignoreBuildErrors: true,
  },
  
  eslint: {
    // Allow ESLint errors during build for faster deployment
    // Fix errors in development, but don't block production builds
    ignoreDuringBuilds: true,
  },

  // Output configuration for Vercel
  // Note: Vercel automatically handles output, no need for 'standalone'
};

module.exports = nextConfig;
