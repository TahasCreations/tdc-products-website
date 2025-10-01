'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface FeaturedCollectionsProps {
  onCollectionClick?: (collection: any) => void;
  onProductClick?: (product: any) => void;
}

const collections = [
  {
    id: 1,
    title: 'Premium Figürler',
    description: 'El yapımı premium kalite figürler',
    image: '/images/collection-1.jpg',
    items: 24,
    featured: true,
    slug: 'premium-figures'
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
  }
];

export default function FeaturedCollections({ onCollectionClick, onProductClick }: FeaturedCollectionsProps) {
  const handleCollectionClick = (collection: any) => {
    if (onCollectionClick) {
      onCollectionClick(collection);
    }
  };

  const handleViewAll = () => {
    if (onCollectionClick) {
      onCollectionClick({ slug: 'all', name: 'Tüm Koleksiyonlar' });
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-ink-900 mb-6 font-serif">
            Öne Çıkan{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-coral-500 bg-clip-text text-transparent">
              Koleksiyonlar
            </span>
          </h2>
          <p className="text-xl text-ink-600 max-w-3xl mx-auto">
            El işçiliği ve sanatsal değerle öne çıkan özel koleksiyonlarımızı keşfedin
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Collection - Large */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2 group cursor-pointer"
            onClick={() => handleCollectionClick(collections[0])}
          >
            <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={collections[0].image}
                alt={collections[0].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-3xl lg:text-4xl font-bold mb-3 font-serif">
                    {collections[0].title}
                  </h3>
                  <p className="text-lg mb-4 opacity-90">
                    {collections[0].description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      {collections[0].items} Ürün
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-ink-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Keşfet
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Other Collections - Small */}
          <div className="space-y-6">
            {collections.slice(1).map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => handleCollectionClick(collection)}
              >
                <div className="relative h-32 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h4 className="font-bold text-lg mb-1 font-serif">
                      {collection.title}
                    </h4>
                    <p className="text-sm opacity-90 mb-2">
                      {collection.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        {collection.items} Ürün
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewAll}
            className="group relative px-8 py-4 border-2 border-indigo-300 text-indigo-600 rounded-2xl font-semibold text-lg hover:border-indigo-500 hover:text-indigo-700 transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-50 to-coral-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center justify-center">
              Tüm Koleksiyonları Gör
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}