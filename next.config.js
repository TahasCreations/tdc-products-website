/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel optimization
  output: 'standalone',
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Image optimization for Vercel
  images: {
    unoptimized: true,
    domains: ['readdy.ai', 'blob.vercel-storage.com'],
  },
  
  // Headers for better security and performance
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
