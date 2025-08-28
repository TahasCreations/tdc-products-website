/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['readdy.ai'],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
