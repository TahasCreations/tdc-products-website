'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Siparişlerim ne kadar sürede teslim edilir?',
      answer: 'Siparişleriniz genellikle 1-3 iş günü içinde teslim edilir. Kargo takip numarası ile teslimat durumunu takip edebilirsiniz.'
    },
    {
      question: 'Ürünleriniz orijinal mi?',
      answer: 'Evet, tüm ürünlerimiz orijinal ve kaliteli tedarikçilerden temin edilir. Orijinallik garantisi veriyoruz.'
    },
    {
      question: 'İade işlemi nasıl yapılır?',
      answer: '14 gün içinde koşulsuz iade hakkınız vardır. İade işlemi için müşteri hizmetlerimizle iletişime geçebilirsiniz.'
    },
    {
      question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
      answer: 'Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerini kabul ediyoruz. Tüm ödemeler güvenlidir.'
    },
    {
      question: 'Müşteri hizmetlerinize nasıl ulaşabilirim?',
      answer: '7/24 müşteri hizmetlerimiz WhatsApp, telefon ve e-posta üzerinden hizmetinizdedir. Hızlı yanıt garantisi veriyoruz.'
    },
    {
      question: 'Kargo ücreti ne kadar?',
      answer: '150 TL ve üzeri alışverişlerde kargo ücretsizdir. Altındaki tutarlarda kargo ücreti 15 TL\'dir.'
    },
    {
      question: 'Kişisel verilerim güvende mi?',
      answer: 'KVKK uyumlu olarak kişisel verilerinizi koruyoruz. SSL şifreleme ile güvenli saklama sağlıyoruz.'
    },
    {
      question: 'Ürün stokta yoksa ne olur?',
      answer: 'Stokta olmayan ürünler için bildirim alabilirsiniz. Stok geldiğinde size haber veririz.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#1a1a1a] to-[#0B0B0B]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Sıkça Sorulan</span>
            <br />
            <span className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
              Sorular
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Müşterilerimizin en çok merak ettiği konular hakkında detaylı cevaplar.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:border-[#CBA135]/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-[#CBA135]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-4 h-4 text-[#CBA135]" />
                  </div>
                  <span className="text-white font-semibold text-lg">
                    {faq.question}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
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
                <div className="px-6 pb-6">
                  <div className="pl-12">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-[#CBA135]/10 to-[#F4D03F]/10 border border-[#CBA135]/30 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Sorunuz mu var?
            </h3>
            <p className="text-lg text-gray-300 mb-6">
              Aradığınız cevabı bulamadıysanız, müşteri hizmetlerimizle iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/905XXXXXXXXX"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                WhatsApp Destek
              </a>
              <a
                href="mailto:destek@tdcmarket.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#CBA135] text-black rounded-xl hover:bg-[#F4D03F] transition-colors"
              >
                E-posta Gönder
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}