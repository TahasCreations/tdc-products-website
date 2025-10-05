'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';

const artists = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    specialty: 'Fantasy Art',
    experience: '15+ Yıl',
    image: '/images/artist-1.jpg',
    works: 45,
    rating: 4.9
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    specialty: 'Anime Design',
    experience: '12+ Yıl',
    image: '/images/artist-2.jpg',
    works: 38,
    rating: 4.8
  },
  {
    id: 3,
    name: 'Mehmet Kaya',
    specialty: 'Vintage Style',
    experience: '10+ Yıl',
    image: '/images/artist-3.jpg',
    works: 32,
    rating: 5.0
  }
];

export default function ArtistsPage() {
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
              Sanatçılarımız
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-ink-600 max-w-3xl mx-auto"
            >
              Yetenekli sanatçılarımızın el işçiliği ile hayat bulan eserler
            </motion.p>
          </div>
        </section>

        {/* Artists Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 overflow-hidden">
                    <div className="relative h-64">
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-ink-900 mb-2 font-serif">
                        {artist.name}
                      </h3>
                      <p className="text-indigo-600 font-semibold mb-2">
                        {artist.specialty}
                      </p>
                      <p className="text-ink-600 text-sm mb-4">
                        {artist.experience} deneyim
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-ink-600">{artist.rating}</span>
                        </div>
                        <span className="text-sm text-ink-600">
                          {artist.works} eser
                        </span>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-indigo-500 to-coral-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-600 hover:to-coral-600 transition-all duration-300"
                      >
                        Eserlerini Gör
                      </motion.button>
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
