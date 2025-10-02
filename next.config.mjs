/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // DİKKAT: Aşağıdakiler BULUNMAMALI:
  // - output: 'export'  (App Router ile yasak)
  // - distDir özelleştirmesi
  // - output: 'standalone' (Vercel'de gereksiz)
  experimental: {
    // Gerekli değilse flag ekleme; varsayılanlar yeterli
  },
};

export default nextConfig;