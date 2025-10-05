'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Award, Users, Truck, RefreshCw } from 'lucide-react';

export default function TrustBanner() {
  const trustFeatures = [
    {
      icon: Shield,
      title: 'Güvenli Alışveriş',
      description: 'SSL sertifikası ile korumalı'
    },
    {
      icon: Lock,
      title: 'Güvenli Ödeme',
      description: '3D Secure ödeme sistemi'
    },
    {
      icon: Award,
      title: 'Kalite Garantisi',
      description: 'Orijinal ürün garantisi'
    },
    {
      icon: Users,
      title: 'Müşteri Memnuniyeti',
      description: '50.000+ mutlu müşteri'
    },
    {
      icon: Truck,
      title: 'Hızlı Teslimat',
      description: '1-3 gün içinde teslimat'
    },
    {
      icon: RefreshCw,
      title: 'Kolay İade',
      description: '14 gün koşulsuz iade'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-[#CBA135]/5 to-[#F4D03F]/5 border-t border-[#CBA135]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#CBA135]/10 to-[#F4D03F]/10 border border-[#CBA135]/30 rounded-3xl p-8 lg:p-12 mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
                TDC Market
              </span>
              {' '}ile Güvenli Alışveriş
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              2020'den beri müşterilerimize güvenli, hızlı ve kaliteli alışveriş deneyimi sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {trustFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-[#CBA135]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#CBA135]/30 transition-colors">
                    <Icon className="w-8 h-8 text-[#CBA135]" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { number: '50K+', label: 'Mutlu Müşteri' },
            { number: '100K+', label: 'Satılan Ürün' },
            { number: '4.9', label: 'Müşteri Puanı' },
            { number: '99%', label: 'Memnuniyet Oranı' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 hover:border-[#CBA135]/30"
            >
              <div className="text-3xl lg:text-4xl font-bold text-[#CBA135] mb-2">
                {stat.number}
              </div>
              <div className="text-gray-300 text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-[#CBA135]/20 to-[#F4D03F]/20 border border-[#CBA135]/40 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Güvenli Alışverişe Başlayın
            </h3>
            <p className="text-lg text-gray-300 mb-6">
              TDC Market'in güvenilir platformunda aradığınız ürünleri bulun, 
              güvenle satın alın ve hızlı teslimatın keyfini çıkarın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#CBA135] text-black rounded-xl hover:bg-[#F4D03F] transition-colors font-semibold text-lg"
              >
                Ürünleri Keşfet
              </a>
              <a
                href="/hakkimizda"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-semibold text-lg border border-white/20"
              >
                Hakkımızda Daha Fazla
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
