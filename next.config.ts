import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['readdy.ai'],
  },
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig