/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['readdy.ai', 'blob.vercel-storage.com'],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  // Vercel optimization
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  // Vercel specific settings
  output: 'standalone',
  // Disable image optimization for Vercel
  images: {
    unoptimized: true,
    domains: ['readdy.ai', 'blob.vercel-storage.com'],
  },
  // Headers for better security
  async headers() {
    return [
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
        ],
      },
    ]
  },
}

module.exports = nextConfig
