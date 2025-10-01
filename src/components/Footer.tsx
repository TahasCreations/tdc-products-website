'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    collections: [
      { name: 'Premium Figürler', href: '/collections/premium' },
      { name: 'Anime Koleksiyonu', href: '/collections/anime' },
      { name: 'Fantasy Serisi', href: '/collections/fantasy' },
      { name: 'Vintage Klasikler', href: '/collections/vintage' },
      { name: 'Modern Sanat', href: '/collections/modern' }
    ],
    support: [
      { name: 'Yardım Merkezi', href: '/help' },
      { name: 'İletişim', href: '/contact' },
      { name: 'Kargo & Teslimat', href: '/shipping' },
      { name: 'İade & Değişim', href: '/returns' },
      { name: 'SSS', href: '/faq' }
    ],
    company: [
      { name: 'Hakkımızda', href: '/about' },
      { name: 'Kariyer', href: '/careers' },
      { name: 'Basın', href: '/press' },
      { name: 'Blog', href: '/blog' },
      { name: 'İş Ortaklığı', href: '/partnership' }
    ],
    legal: [
      { name: 'Gizlilik Politikası', href: '/privacy' },
      { name: 'Kullanım Şartları', href: '/terms' },
      { name: 'Çerez Politikası', href: '/cookies' },
      { name: 'KVKK', href: '/kvkk' }
    ]
  };

  const socialLinks = [
    { name: 'Instagram', href: '#', icon: '📷' },
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'YouTube', href: '#', icon: '📺' },
    { name: 'TikTok', href: '#', icon: '🎵' },
    { name: 'Discord', href: '#', icon: '💬' }
  ];

  return (
    <footer className="bg-ink-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-coral-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">T</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-serif">TDC Products</h3>
                <p className="text-sm text-gray-400">Figür & Koleksiyon</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              El işçiliği ve yüksek kalite ile üretilen premium figür koleksiyonları. 
              Sanat ve koleksiyon tutkunları için özel tasarım.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors duration-300"
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Collections */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Koleksiyonlar</h4>
            <ul className="space-y-3">
              {footerLinks.collections.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + (index * 0.05) }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-indigo-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Destek</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + (index * 0.05) }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-indigo-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Şirket</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + (index * 0.05) }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-indigo-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Yasal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + (index * 0.05) }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-indigo-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-gray-800"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-bold mb-4 font-serif">
              Haberlerden Haberdar Olun
            </h4>
            <p className="text-gray-300 mb-6">
              Yeni koleksiyonlar ve özel indirimler hakkında bilgi alın
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-coral-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-coral-600 transition-all duration-300"
              >
                Abone Ol
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm mb-4 md:mb-0"
            >
              © {currentYear} TDC Products. Tüm hakları saklıdır.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center space-x-6 text-sm text-gray-400"
            >
              <span>🇹🇷 Türkiye</span>
              <span>•</span>
              <span>Güvenli Ödeme</span>
              <span>•</span>
              <span>Hızlı Kargo</span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}