/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['readdy.ai'],
  },
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig