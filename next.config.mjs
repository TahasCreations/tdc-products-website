/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  generateBuildId: async () => {
    return `tdc-market-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'X-Build-ID',
            value: `tdc-market-${Date.now()}`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;