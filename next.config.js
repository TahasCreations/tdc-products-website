/** @type {import('next').NextConfig} */
const config = {
  async redirects() {
    return [
      {
        source: '/categories/:slug',
        destination: '/k/:slug',
        permanent: false,
      },
      {
        source: '/category/:slug',
        destination: '/k/:slug',
        permanent: false,
      },
    ];
  },
  experimental: {
    esmExternals: false,
  },
};

module.exports = config;
