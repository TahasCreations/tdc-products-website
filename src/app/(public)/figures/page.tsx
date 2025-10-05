'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';

const figures = [
  {
    id: 1,
    name: 'Dragon Warrior',
    category: 'Fantasy',
    price: 299,
    image: '/images/figure-1.jpg',
    rating: 4.9,
    reviews: 24
  },
  {
    id: 2,
    name: 'Anime Hero',
    category: 'Anime',
    price: 199,
    image: '/images/figure-2.jpg',
    rating: 4.8,
    reviews: 18
  },
  {
    id: 3,
    name: 'Vintage Classic',
    category: 'Vintage',
    price: 399,
    image: '/images/figure-3.jpg',
    rating: 5.0,
    reviews: 12
  }
];

export default function FiguresPage() {
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
              Figürler
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-ink-600 max-w-3xl mx-auto"
            >
              El işçiliği ile üretilmiş premium kalite figürler
            </motion.p>
          </div>
        </section>

        {/* Figures Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {figures.map((figure, index) => (
                <motion.div
                  key={figure.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                    <Image
                      src={figure.image}
                      alt={figure.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-500 to-coral-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ₺{figure.price}
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2 font-serif">
                        {figure.name}
                      </h3>
                      <p className="text-sm opacity-90 mb-4">
                        {figure.category} Kategorisi
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm">({figure.reviews})</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors"
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
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
