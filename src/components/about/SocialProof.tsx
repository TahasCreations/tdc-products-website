'use client';

import { motion } from 'framer-motion';
import { Star, Quote, User, CheckCircle } from 'lucide-react';

export default function SocialProof() {
  const testimonials = [
    {
      name: 'Elif Yılmaz',
      role: 'Müşteri',
      content: 'TDC Market\'ten aldığım ürünler gerçekten kaliteli. Teslimat da çok hızlı oldu. Kesinlikle tavsiye ederim.',
      rating: 5,
      product: 'Naruto Figürü'
    },
    {
      name: 'Mehmet Kaya',
      role: 'Koleksiyoner',
      content: 'Figür koleksiyonum için aradığım nadir ürünleri burada buldum. Orijinal ve kaliteli ürünler.',
      rating: 5,
      product: 'One Piece Figürü'
    },
    {
      name: 'Ayşe Demir',
      role: 'Müşteri',
      content: 'Müşteri hizmetleri gerçekten çok ilgili. Sorularımı hemen yanıtladılar. Güvenilir bir platform.',
      rating: 5,
      product: 'Elektronik Ürün'
    }
  ];

  const stats = [
    { label: 'Müşteri Memnuniyeti', value: '98%' },
    { label: 'Tekrar Alışveriş', value: '85%' },
    { label: 'Arkadaşa Tavsiye', value: '92%' },
    { label: 'Kalite Puanı', value: '4.8/5' }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#1a1a1a] to-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Müşteri</span>
            <br />
            <span className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
              Yorumları
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Müşterilerimizin deneyimlerini ve geri bildirimlerini paylaşıyoruz.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-[#CBA135]/30 h-full">
                {/* Quote Icon */}
                <div className="w-12 h-12 bg-[#CBA135]/20 rounded-xl flex items-center justify-center mb-4">
                  <Quote className="w-6 h-6 text-[#CBA135]" />
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#CBA135] text-[#CBA135]" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-300 leading-relaxed mb-4">
                  "{testimonial.content}"
                </p>

                {/* Product */}
                <div className="text-sm text-[#CBA135] mb-4 font-medium">
                  {testimonial.product}
                </div>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                    <div className="text-gray-400 text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl lg:text-4xl font-bold text-[#CBA135] mb-2">
                {stat.value}
              </div>
              <div className="text-gray-300 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-[#CBA135]/10 to-[#F4D03F]/10 border border-[#CBA135]/30 rounded-3xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <CheckCircle className="w-6 h-6 text-[#CBA135]" />
              <h3 className="text-2xl font-bold text-white">
                Doğrulanmış Müşteri Yorumları
              </h3>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed">
              Tüm yorumlarımız gerçek müşterilerimizden gelir ve doğrulanır. 
              Müşteri memnuniyeti bizim önceliğimizdir.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
