'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const blogPosts = [
  {
    id: 1,
    title: 'Figür Koleksiyonculuğu Rehberi',
    excerpt: 'Figür koleksiyonculuğuna başlamak isteyenler için kapsamlı rehber',
    image: '/images/blog-1.jpg',
    date: '15 Ekim 2024',
    category: 'Rehber'
  },
  {
    id: 2,
    title: 'El İşçiliği Figür Üretimi',
    excerpt: 'Premium kalite figürlerin üretim süreci ve detayları',
    image: '/images/blog-2.jpg',
    date: '10 Ekim 2024',
    category: 'Üretim'
  },
  {
    id: 3,
    title: 'Koleksiyon Bakımı İpuçları',
    excerpt: 'Figürlerinizi nasıl koruyup saklayacağınız hakkında ipuçları',
    image: '/images/blog-3.jpg',
    date: '5 Ekim 2024',
    category: 'Bakım'
  }
];

export default function BlogPage() {
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
              Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-ink-600 max-w-3xl mx-auto"
            >
              Figür dünyasından haberler, ipuçları ve rehberler
            </motion.p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 overflow-hidden">
                    <div className="relative h-64">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-indigo-500 to-coral-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {post.category}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-ink-900 mb-3 font-serif group-hover:text-indigo-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-ink-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-ink-500">
                          {post.date}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                        >
                          Devamını Oku →
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
