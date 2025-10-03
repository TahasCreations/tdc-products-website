/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: false,
  },
  // Disable static generation for all pages
  generateStaticParams: false,
}

module.exports = nextConfig
