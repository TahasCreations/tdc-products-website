'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';
import GlassCard from '../ui/GlassCard';

export default function CategoryStrip() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: 'Figür & Koleksiyon', slug: 'figur-koleksiyon', icon: '🎭', color: 'indigo', count: '0' },
    { name: 'Moda & Aksesuar', slug: 'moda-aksesuar', icon: '👗', color: 'pink', count: '0' },
    { name: 'Elektronik', slug: 'elektronik', icon: '📱', color: 'blue', count: '0' },
    { name: 'Ev & Yaşam', slug: 'ev-yasam', icon: '🏠', color: 'green', count: '0' },
    { name: 'Sanat & Hobi', slug: 'sanat-hobi', icon: '🎨', color: 'purple', count: '0' },
    { name: 'Hediyelik', slug: 'hediyelik', icon: '🎁', color: 'orange', count: '0' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-100/20 opacity-40"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün, kategori veya marka ara..."
                className="w-full px-6 py-4 pl-14 pr-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-lg"
              />
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Ara
              </motion.button>
            </div>
          </motion.form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2 animate-pulse"></span>
            Kategoriler
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
              Keşfetmeye Hazır mısın?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Her zevke uygun <span className="text-indigo-600 font-semibold">1000+ satıcı</span> tarafından sunulan geniş ürün yelpazesi
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8">
          {categories.map((category, index) => (
            <ScrollReveal
              key={category.slug}
              direction="up"
              delay={index * 0.1}
            >
              <Link href={`/categories/${category.slug}`}>
                <GlassCard
                  variant="premium"
                  hover3d={true}
                  glowColor="#CBA135"
                  className="group p-6 cursor-pointer"
                >
                  <div className="text-center">
                    <motion.div 
                      className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-[#CBA135]/20 to-[#F4D03F]/20 rounded-2xl flex items-center justify-center group-hover:from-[#CBA135]/30 group-hover:to-[#F4D03F]/30 transition-all duration-500 shadow-lg group-hover:shadow-xl"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <span className="text-3xl sm:text-4xl">{category.icon}</span>
                    </motion.div>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#CBA135] transition-colors duration-300 mb-2">
                      {category.name}
                    </h3>
                    
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="w-2 h-2 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] rounded-full animate-pulse"></span>
                      <span>{category.count} ürün</span>
                    </div>
                    
                    {/* Hover Arrow */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-white rounded-full flex items-center justify-center shadow-lg"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                </GlassCard>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 transform"
          >
            <span>Tüm Kategorileri Görüntüle</span>
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
