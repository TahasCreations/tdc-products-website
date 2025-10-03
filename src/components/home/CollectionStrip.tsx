'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CollectionStrip() {
  const collections = [
    {
      title: 'Haftanın Trendleri',
      description: 'En popüler ürünler',
      image: '🔥',
      color: 'red',
      href: '/collections/trending'
    },
    {
      title: 'Özel Figürler',
      description: 'TDC Products',
      image: '🎭',
      color: 'indigo',
      href: '/collections/tdc-products',
      badge: 'Premium'
    },
    {
      title: 'Günlük Yaşam Favorileri',
      description: 'Her gün kullanacağınız ürünler',
      image: '⭐',
      color: 'yellow',
      href: '/collections/daily-favorites'
    },
    {
      title: 'Bütçe Dostu Hediyeler',
      description: 'Uygun fiyatlı seçenekler',
      image: '💝',
      color: 'green',
      href: '/collections/budget-gifts'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-coral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-ink-900 mb-4">
            Öne Çıkan Koleksiyonlar
          </h2>
          <p className="text-lg text-ink-600 max-w-2xl mx-auto">
            Özenle seçilmiş ürün koleksiyonları
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Link
                href={collection.href}
                className="block relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className={`h-48 bg-gradient-to-br from-${collection.color}-100 to-${collection.color}-200 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300`}>
                  {collection.image}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-ink-900 group-hover:text-indigo-600 transition-colors">
                      {collection.title}
                    </h3>
                    {collection.badge && (
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                        {collection.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-ink-600 text-sm mb-4">
                    {collection.description}
                  </p>
                  <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:text-indigo-700 transition-colors">
                    Koleksiyonu Gör
                    <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
