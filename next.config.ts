import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * `images` yapılandırması, uzak kaynaklardan gelen görselleri optimize etmenizi sağlar.
   * Next.js, tarayıcı destekliyorsa görselleri otomatik olarak WebP ve AVIF gibi modern formatlarda sunar.
   * Ayrıca, küçük cihazlara büyük görseller göndermemek için görselleri isteğe bağlı olarak yeniden boyutlandırır.
   *
   * @see https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
   */
  images: {
    remotePatterns: [
      // Unsplash görselleri için mevcut kural
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      // Örnek: Contentful gibi bir CMS veya Cloudinary gibi bir depolama hizmeti kullanırsanız,
      // bu servislerin alan adlarını buraya eklersiniz.
      // { protocol: "https", hostname: "images.ctfassets.net" },
    ],
    /**
     * Hangi görsel formatlarının kullanılacağını belirtir. `image/avif` çok modern ve verimli bir formattır.
     * Next.js önce AVIF, sonra WebP ve son olarak orijinal formatı deneyecektir.
     */
    formats: ["image/avif", "image/webp"],
  },
  /**
   * Projeniz büyüdükçe buraya başka yapılandırmalar ekleyebilirsiniz.
   * Örneğin, yönlendirmeler (redirects), yeniden yazımlar (rewrites) veya ortam değişkenleri.
   * @see https://nextjs.org/docs/api-reference/next.config.js/introduction
   */
};

export default nextConfig;
