'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    role: 'Koleksiyoncu',
    avatar: '/images/avatar-1.jpg',
    rating: 5,
    comment: 'Figür kalitesi gerçekten mükemmel. El işçiliği detayları inanılmaz. Koleksiyonumun en değerli parçaları oldular.',
    location: 'İstanbul, Türkiye'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Sanat Sever',
    avatar: '/images/avatar-2.jpg',
    rating: 5,
    comment: 'The attention to detail is incredible. Each piece tells a story and the craftsmanship is outstanding. Highly recommended!',
    location: 'New York, USA'
  },
  {
    id: 3,
    name: 'Mehmet Kaya',
    role: 'Anime Fan',
    avatar: '/images/avatar-3.jpg',
    rating: 5,
    comment: 'Anime koleksiyonum için aradığım kaliteyi buldum. Paketleme ve teslimat da çok profesyonel.',
    location: 'Ankara, Türkiye'
  }
];

const stats = [
  { number: '10,000+', label: 'Mutlu Müşteri' },
  { number: '50,000+', label: 'Satılan Figür' },
  { number: '98%', label: 'Memnuniyet Oranı' },
  { number: '4.9/5', label: 'Ortalama Puan' }
];

export default function CommunitySection() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-coral-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-ink-900 mb-6 font-serif">
            Topluluk &{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-coral-500 bg-clip-text text-transparent">
              Sosyal Kanıt
            </span>
          </h2>
          <p className="text-xl text-ink-600 max-w-3xl mx-auto mb-12">
            Binlerce müşterimizin güvenini kazandık
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-ink-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.svg
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: (index * 0.2) + (i * 0.1) }}
                      viewport={{ once: true }}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </div>

                {/* Comment */}
                <blockquote className="text-ink-700 mb-6 leading-relaxed italic">
                  "{testimonial.comment}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-ink-600">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-ink-500">
                      {testimonial.location}
                    </div>
                  </div>
                </div>

                {/* Quote Icon */}
                <div className="absolute top-6 right-6 w-8 h-8 bg-gradient-to-r from-indigo-100 to-coral-100 rounded-full flex items-center justify-center opacity-50">
                  <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: (index * 0.2) + 0.5 }}
                viewport={{ once: true }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-coral-400 to-indigo-400 rounded-full opacity-60"
              />
            </motion.div>
          ))}
        </div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-ink-900 mb-6 font-serif">
              Sosyal Medyada Bizi Takip Edin
            </h3>
            <div className="flex justify-center space-x-6">
              {['Instagram', 'Twitter', 'YouTube', 'TikTok'].map((platform, index) => (
                <motion.button
                  key={platform}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-coral-500 rounded-xl flex items-center justify-center text-white font-semibold hover:shadow-lg transition-shadow duration-300"
                >
                  {platform[0]}
                </motion.button>
              ))}
            </div>
            <p className="text-sm text-ink-600 mt-4">
              @tdcproducts hesabımızdan güncel koleksiyonları takip edin
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
