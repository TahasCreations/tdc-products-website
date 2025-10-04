'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, RotateCcw, Award } from 'lucide-react';

export default function AboutHero() {
  const trustBadges = [
    { icon: Shield, text: '%100 Güvenli Alışveriş', color: 'bg-green-100 text-green-800' },
    { icon: Clock, text: '7/24 Hızlı Destek', color: 'bg-blue-100 text-blue-800' },
    { icon: RotateCcw, text: '30 Gün İade Garantisi', color: 'bg-purple-100 text-purple-800' },
    { icon: Award, text: 'Premium Kalite', color: 'bg-yellow-100 text-yellow-800' }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image/Video */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://via.placeholder.com/1920x1080/0B0B0B/CBA135?text=TDC+Market+Team"
          alt="TDC Market Ekibi"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="space-y-8"
        >
          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
              TDC Market
              <span className="block bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
                Hakkımızda
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              Özel figürlerden elektroniğe, tasarımdan ev yaşamına kadar her alanda 
              <span className="text-[#CBA135] font-semibold"> kaliteli ürünler</span> ve 
              <span className="text-[#CBA135] font-semibold"> güvenilir hizmet</span> sunuyoruz.
            </p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeInOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] hover:shadow-xl transition-all duration-300 text-white px-8 py-4 text-lg font-semibold"
            >
              Bize Ulaşın
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-4 text-lg font-semibold"
            >
              Mağazamız
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              className="text-gray-300 hover:text-white transition-colors duration-300 px-8 py-4 text-lg"
            >
              Basın Kiti
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: 'easeInOut' }}
        className="absolute bottom-8 left-0 right-0 z-10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20"
              >
                <badge.icon className="w-5 h-5 text-[#CBA135]" />
                <span className="text-white text-sm font-medium">{badge.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
