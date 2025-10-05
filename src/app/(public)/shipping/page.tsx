'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ShippingPage() {
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
              Kargo & Teslimat
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-ink-600 max-w-3xl mx-auto"
            >
              Güvenli ve hızlı teslimat garantisi
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
                Teslimat Bilgileri
              </h2>
              <div className="grid md:grid-cols-3 gap-8 text-left">
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-coral-50 rounded-2xl">
                  <h3 className="text-xl font-bold text-ink-900 mb-4">Standart Teslimat</h3>
                  <p className="text-ink-600">3-5 iş günü içinde teslim</p>
                </div>
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-coral-50 rounded-2xl">
                  <h3 className="text-xl font-bold text-ink-900 mb-4">Ücretsiz Kargo</h3>
                  <p className="text-ink-600">150 TL ve üzeri siparişlerde</p>
                </div>
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-coral-50 rounded-2xl">
                  <h3 className="text-xl font-bold text-ink-900 mb-4">Güvenli Paketleme</h3>
                  <p className="text-ink-600">Özel koruma ile paketleme</p>
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
