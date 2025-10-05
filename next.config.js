/** @type {import('next').NextConfig} */
const config = {
  async redirects() {
    return [
      {
        source: '/k/:slug',
        destination: '/categories/:slug',
        permanent: false,
      },
    ];
  },
  experimental: {
    esmExternals: false,
  },
};

module.exports = config;
