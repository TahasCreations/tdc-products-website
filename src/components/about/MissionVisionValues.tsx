'use client';

import { motion } from 'framer-motion';
import { Target, Eye, Heart, Star, Zap, Crown } from 'lucide-react';

export default function MissionVisionValues() {
  const cards = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Misyonumuz',
      description: 'Kaliteli ürünler ve mükemmel hizmet anlayışıyla müşterilerimizin ihtiyaçlarını karşılamak, onlara en iyi alışveriş deneyimini sunmak.',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/10'
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Vizyonumuz',
      description: 'Türkiye\'nin en güvenilir ve müşteri odaklı e-ticaret platformu olmak, teknoloji ve kaliteyi birleştirerek sektörde öncü konuma gelmek.',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/10'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Değerlerimiz',
      description: 'Şeffaflık, güvenilirlik, kalite ve müşteri memnuniyeti. Her kararımızda bu değerleri ön planda tutuyoruz.',
      gradient: 'from-pink-500 to-pink-600',
      bgGradient: 'from-pink-500/10 to-pink-600/10'
    }
  ];

  const values = [
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Kalite',
      description: 'En yüksek kalite standartlarında ürünler'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Hız',
      description: 'Hızlı teslimat ve müşteri hizmetleri'
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: 'Mükemmellik',
      description: 'Her detayda mükemmellik arayışı'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Güven',
      description: 'Şeffaf ve güvenilir hizmet anlayışı'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#0B0B0B] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full hover:bg-white/10 transition-all duration-300 hover:border-[#CBA135]/30">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#CBA135] transition-colors">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Temel</span>
            <br />
            <span className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
              Değerlerimiz
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            İş yapış şeklimizi belirleyen ve her kararımızda rehber olan değerlerimiz.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-[#CBA135]/30 text-center">
                {/* Icon */}
                <div className="w-12 h-12 bg-[#CBA135]/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#CBA135] group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#CBA135] transition-colors">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Commitment Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-[#CBA135]/10 to-[#F4D03F]/10 border border-[#CBA135]/30 rounded-3xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Müşterilerimize Sözümüz
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Her ürünümüzde kalite, her hizmetimizde güvenilirlik, her müşteri ilişkimizde 
              samimiyet ve şeffaflık. TDC Market olarak, bu değerler doğrultusunda 
              çalışmaya devam edeceğiz.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}