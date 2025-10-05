'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';

const faqs = [
  {
    question: 'Siparişlerim ne kadar sürede teslim edilir?',
    answer: 'Standart siparişler 3-5 iş günü içinde, özel tasarım ürünler 2-3 hafta içinde teslim edilir.'
  },
  {
    question: 'Kargo ücreti ne kadar?',
    answer: '150 TL ve üzeri siparişlerde kargo ücretsizdir. Altındaki siparişlerde 25 TL kargo ücreti alınır.'
  },
  {
    question: 'İade ve değişim politikası nedir?',
    answer: 'Ürünlerinizi teslim aldıktan sonra 14 gün içinde iade edebilir veya değiştirebilirsiniz.'
  },
  {
    question: 'Özel tasarım hizmeti veriyor musunuz?',
    answer: 'Evet, müşterilerimizin özel tasarım taleplerini değerlendiriyoruz. İletişim sayfamızdan bize ulaşabilirsiniz.'
  },
  {
    question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    answer: 'Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerini kabul ediyoruz.'
  },
  {
    question: 'Ürünleriniz orijinal mi?',
    answer: 'Tüm ürünlerimiz orijinal ve el işçiliği ile üretilmiştir. Kalite garantimiz vardır.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
              Sık Sorulan Sorular
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-ink-600 max-w-3xl mx-auto"
            >
              Merak ettiğiniz soruların yanıtları burada
            </motion.p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-ink-900 pr-4">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: openIndex === index ? 'auto' : 0,
                      opacity: openIndex === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-ink-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-coral-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-white mb-6 font-serif"
            >
              Sorunuz mu var?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-white/90 mb-8"
            >
              Aradığınız yanıtı bulamadıysanız bizimle iletişime geçin
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/contact'}
              className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              İletişime Geçin
            </motion.button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
