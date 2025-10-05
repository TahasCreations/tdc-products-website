'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const collections = [
  {
    id: 1,
    title: 'Premium Figürler',
    description: 'El yapımı premium kalite figürler',
    image: '/images/collection-1.jpg',
    items: 24,
    slug: 'premium-figures',
    featured: true
  },
  {
    id: 2,
    title: 'Anime Koleksiyonu',
    description: 'Popüler anime karakterleri',
    image: '/images/collection-2.jpg',
    items: 18,
    slug: 'anime-collection'
  },
  {
    id: 3,
    title: 'Fantasy Serisi',
    description: 'Fantastik dünya karakterleri',
    image: '/images/collection-3.jpg',
    items: 32,
    slug: 'fantasy-series'
  },
  {
    id: 4,
    title: 'Vintage Klasikler',
    description: 'Nostaljik klasik figürler',
    image: '/images/collection-4.jpg',
    items: 15,
    slug: 'vintage-classics'
  },
  {
    id: 5,
    title: 'Modern Sanat',
    description: 'Çağdaş sanat eserleri',
    image: '/images/collection-5.jpg',
    items: 28,
    slug: 'modern-art'
  },
  {
    id: 6,
    title: 'Sınırlı Seri',
    description: 'Özel ve sınırlı üretim',
    image: '/images/collection-6.jpg',
    items: 12,
    slug: 'limited-series'
  }
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-coral-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-900 mb-6 font-serif"
            >
              Koleksiyonlarımız
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-ink-600 max-w-3xl mx-auto"
            >
              El işçiliği ve sanatsal değerle öne çıkan özel koleksiyonlarımızı keşfedin
            </motion.p>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/collections/${collection.slug}`}>
                    <div className="relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                      <Image
                        src={collection.image}
                        alt={collection.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      {/* Featured Badge */}
                      {collection.featured && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-indigo-500 to-coral-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Öne Çıkan
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2 font-serif">
                          {collection.title}
                        </h3>
                        <p className="text-sm opacity-90 mb-4">
                          {collection.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            {collection.items} Ürün
                          </span>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-coral-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-white mb-6 font-serif"
            >
              Özel Koleksiyonunuzu Oluşturun
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-white/90 mb-8"
            >
              Size özel figür tasarımı ve koleksiyon oluşturma hizmetlerimiz
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-colors"
                onClick={() => window.location.href = '/contact'}
              >
                İletişime Geçin
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold text-lg hover:bg-white/10 transition-colors"
                onClick={() => window.location.href = '/about'}
              >
                Hakkımızda
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
