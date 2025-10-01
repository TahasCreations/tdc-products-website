'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const qualityFeatures = [
  {
    id: 1,
    title: 'Premium Reçine',
    description: 'Yüksek kaliteli reçine malzemesi ile dayanıklı ve detaylı figürler',
    icon: '🧪',
    image: '/images/quality-resin.jpg',
    features: ['UV Dayanıklı', 'Çizilmez Yüzey', 'Uzun Ömürlü']
  },
  {
    id: 2,
    title: 'Elde Boyama',
    description: 'Usta sanatçılarımızın el işçiliği ile her detay özenle işlenir',
    icon: '🎨',
    image: '/images/quality-painting.jpg',
    features: ['El İşçiliği', 'Özel Renkler', 'Detay Odaklı']
  },
  {
    id: 3,
    title: 'Sınırlı Üretim',
    description: 'Her koleksiyon sınırlı sayıda üretilir, özel ve değerli',
    icon: '⭐',
    image: '/images/quality-limited.jpg',
    features: ['Sınırlı Sayı', 'Özel Sertifika', 'Koleksiyon Değeri']
  }
];

export default function QualitySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-ink-900 mb-6 font-serif">
            Üretim & Kalite{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-coral-500 bg-clip-text text-transparent">
              Standartlarımız
            </span>
          </h2>
          <p className="text-xl text-ink-600 max-w-3xl mx-auto">
            Her figürde mükemmellik arayışımız ve kalite garantimiz
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {qualityFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Icon */}
                <div className="absolute top-6 left-6 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  {feature.icon}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-3 font-serif">
                    {feature.title}
                  </h3>
                  <p className="text-sm opacity-90 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Features List */}
                  <div className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: (index * 0.2) + (itemIndex * 0.1) + 0.3 }}
                        viewport={{ once: true }}
                        className="flex items-center text-sm"
                      >
                        <svg className="w-4 h-4 text-coral-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="opacity-90">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: (index * 0.2) + 0.5 }}
                viewport={{ once: true }}
                className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-indigo-400 to-coral-400 rounded-full opacity-80"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: (index * 0.2) + 0.7 }}
                viewport={{ once: true }}
                className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-coral-400 to-indigo-400 rounded-full opacity-60"
              />
            </motion.div>
          ))}
        </div>

        {/* Quality Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-indigo-50 to-coral-50 rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-coral-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-bold text-ink-900">Kalite Garantisi</h4>
              <p className="text-sm text-ink-600">Tüm ürünlerimiz 2 yıl kalite garantisi ile</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">100%</div>
              <div className="text-xs text-ink-600">Müşteri Memnuniyeti</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
