'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CategoryStrip() {
  const categories = [
    { name: 'Figür & Koleksiyon', slug: 'figur-koleksiyon', icon: '🎭', color: 'indigo' },
    { name: 'Moda & Aksesuar', slug: 'moda-aksesuar', icon: '👗', color: 'pink' },
    { name: 'Elektronik', slug: 'elektronik', icon: '📱', color: 'blue' },
    { name: 'Ev & Yaşam', slug: 'ev-yasam', icon: '🏠', color: 'green' },
    { name: 'Sanat & Hobi', slug: 'sanat-hobi', icon: '🎨', color: 'purple' },
    { name: 'Hediyelik', slug: 'hediyelik', icon: '🎁', color: 'orange' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-ink-900 mb-4">
            Kategoriler
          </h2>
          <p className="text-lg text-ink-600 max-w-2xl mx-auto">
            Her ihtiyacınız için geniş ürün yelpazesi
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <Link
                href={`/categories/${category.slug}`}
                className="block p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-${category.color}-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-ink-900 group-hover:text-indigo-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
