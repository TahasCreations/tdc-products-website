'use client';

import { motion } from 'framer-motion';
import { Shield, Award, Lock, CheckCircle } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'KVKK Uyumlu',
      description: 'Veri güvenliği garantisi',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Güvenli Ödeme',
      description: 'SSL sertifikası',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Şifreli Bağlantı',
      description: '256-bit şifreleme',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Orijinal Ürün',
      description: '%100 orijinal garanti',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-[#1a1a1a] to-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Güvenlik</span>
            <br />
            <span className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
              Sertifikalarımız
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Müşteri güvenliği ve veri koruması konusunda en yüksek standartları benimsiyoruz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-[#CBA135]/30">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${badge.color} rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {badge.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#CBA135] transition-colors">
                  {badge.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {badge.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#CBA135]/5 to-[#F4D03F]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-8 py-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#CBA135] mb-1">4.8/5</div>
              <div className="text-sm text-gray-300">Müşteri Puanı</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-[#CBA135] mb-1">1,250+</div>
              <div className="text-sm text-gray-300">Memnun Müşteri</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-[#CBA135] mb-1">99.9%</div>
              <div className="text-sm text-gray-300">Uptime</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-[#CBA135] mb-1">24/7</div>
              <div className="text-sm text-gray-300">Destek</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
