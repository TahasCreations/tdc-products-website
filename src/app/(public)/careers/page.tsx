'use client';

import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-coral-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-900 mb-6 font-serif"
            >
              Kariyer
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-ink-600 max-w-3xl mx-auto"
            >
              Bizimle birlikte çalışmak ister misiniz?
            </motion.p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-ink-900 mb-8 font-serif">
                Açık Pozisyonlar
              </h2>
              <p className="text-xl text-ink-600 mb-8">
                Şu anda açık pozisyon bulunmamaktadır. CV'nizi gönderebilirsiniz.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/contact'}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-coral-500 text-white rounded-2xl font-semibold text-lg hover:from-indigo-600 hover:to-coral-600 transition-all duration-300"
              >
                CV Gönder
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
