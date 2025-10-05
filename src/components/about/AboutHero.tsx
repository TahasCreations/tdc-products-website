'use client';

import { motion } from 'framer-motion';
import { Shield, Award, Users, Heart } from 'lucide-react';
import { ProductCardImage } from '@/components/media/AutoImage';

export default function AboutHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <ProductCardImage
          alt="TDC Market Hakkında"
          className="w-full h-full opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/90 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-[#CBA135]/10 border border-[#CBA135]/30 rounded-full px-4 py-2 backdrop-blur-sm"
            >
              <Shield className="w-4 h-4 text-[#CBA135]" />
              <span className="text-[#CBA135] font-medium text-sm">Güvenilir Platform</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
            >
              <span className="text-white">TDC Market</span>
              <br />
              <span className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
                Hakkında
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl text-gray-300 leading-relaxed max-w-2xl"
            >
              2024 yılında kurulan TDC Market, özel figürlerden elektroniğe, 
              tasarımdan ev yaşamına kadar geniş bir ürün yelpazesinde 
              müşterilerimize en kaliteli ve güvenilir alışveriş deneyimini sunuyor.
            </motion.p>

            {/* Key Values */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: 'Güvenlik',
                  description: 'KVKK uyumlu'
                },
                {
                  icon: <Award className="w-6 h-6" />,
                  title: 'Kalite',
                  description: 'Premium ürünler'
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: 'Müşteri Odaklı',
                  description: '7/24 destek'
                },
                {
                  icon: <Heart className="w-6 h-6" />,
                  title: 'Şeffaflık',
                  description: 'Açık iletişim'
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-[#CBA135]/20 rounded-xl flex items-center justify-center text-[#CBA135]">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">
                      {value.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="aspect-square bg-gradient-to-br from-[#CBA135]/20 to-[#F4D03F]/10 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">TDC Market</h3>
                  <p className="text-gray-300 text-sm">Güvenilir Alışveriş</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-2xl shadow-lg flex items-center justify-center"
            >
              <Award className="w-8 h-8 text-black" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#F4D03F] to-[#CBA135] rounded-xl shadow-lg flex items-center justify-center"
            >
              <Heart className="w-6 h-6 text-black" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-[#CBA135] rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}