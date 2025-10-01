'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ReturnsPage() {
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
              İade & Değişim
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-ink-600 max-w-3xl mx-auto"
            >
              14 gün içinde iade ve değişim hakkı
            </motion.p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-ink-900 mb-8 font-serif">
                İade Koşulları
              </h2>
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-coral-50 rounded-2xl">
                  <h3 className="text-xl font-bold text-ink-900 mb-4">14 Gün İçinde</h3>
                  <p className="text-ink-600">Teslim aldıktan sonra 14 gün içinde iade edebilirsiniz</p>
                </div>
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-coral-50 rounded-2xl">
                  <h3 className="text-xl font-bold text-ink-900 mb-4">Orijinal Paket</h3>
                  <p className="text-ink-600">Ürün orijinal paketinde ve hasarsız olmalı</p>
                </div>
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-coral-50 rounded-2xl">
                  <h3 className="text-xl font-bold text-ink-900 mb-4">Ücretsiz İade</h3>
                  <p className="text-ink-600">İade kargo ücreti bizim tarafımızdan karşılanır</p>
                </div>
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-coral-50 rounded-2xl">
                  <h3 className="text-xl font-bold text-ink-900 mb-4">Hızlı İade</h3>
                  <p className="text-ink-600">İade onayı sonrası 3-5 gün içinde ödeme</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
