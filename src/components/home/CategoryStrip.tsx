'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CategoryStrip() {
  const categories = [
    { name: 'Figür & Koleksiyon', slug: 'figur-koleksiyon', icon: '🎭', color: 'indigo', count: '2.5K+' },
    { name: 'Moda & Aksesuar', slug: 'moda-aksesuar', icon: '👗', color: 'pink', count: '3.2K+' },
    { name: 'Elektronik', slug: 'elektronik', icon: '📱', color: 'blue', count: '4.1K+' },
    { name: 'Ev & Yaşam', slug: 'ev-yasam', icon: '🏠', color: 'green', count: '2.8K+' },
    { name: 'Sanat & Hobi', slug: 'sanat-hobi', icon: '🎨', color: 'purple', count: '1.9K+' },
    { name: 'Hediyelik', slug: 'hediyelik', icon: '🎁', color: 'orange', count: '1.5K+' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-100/20 opacity-40"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10, 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              <Link
                href={`/categories/${category.slug}`}
                className="group block p-6 bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 hover:bg-white/90 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 relative overflow-hidden"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-gray-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500"></div>
                
                <div className="relative z-10 text-center">
                  <motion.div 
                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-all duration-500 shadow-lg group-hover:shadow-xl"
                    whileHover={{ rotate: 5 }}
                  >
                    <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
                  </motion.div>
                  
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 mb-2">
                    {category.name}
                  </h3>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <span className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></span>
                    <span>{category.count} ürün</span>
                  </div>
                  
                  {/* Hover Arrow */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="absolute top-4 right-4 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
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
