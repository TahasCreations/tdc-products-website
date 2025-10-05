'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Award, Zap, Heart } from 'lucide-react';

export default function Timeline() {
  const milestones = [
    {
      year: '2024',
      month: 'Ocak',
      title: 'TDC Market Kuruluşu',
      description: 'TDC Market\'in temelleri atıldı ve ilk ekibimiz kuruldu.',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      year: '2024',
      month: 'Mart',
      title: 'Platform Geliştirme',
      description: 'Modern ve kullanıcı dostu platformumuzun geliştirilmesi tamamlandı.',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      year: '2024',
      month: 'Mayıs',
      title: 'İlk Satışlar',
      description: 'Platformumuzda ilk satışlar gerçekleşti ve müşteri memnuniyeti başladı.',
      icon: <Users className="w-6 h-6" />,
      color: 'from-green-500 to-green-600'
    },
    {
      year: '2024',
      month: 'Ağustos',
      title: '1000. Müşteri',
      description: 'Platformumuzda 1000. müşteriye ulaştık ve büyük bir dönüm noktası yaşadık.',
      icon: <Award className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600'
    },
    {
      year: '2024',
      month: 'Ekim',
      title: 'Kategori Genişletme',
      description: 'Ürün kategorilerimizi genişlettik ve daha fazla seçenek sunduk.',
      icon: <MapPin className="w-6 h-6" />,
      color: 'from-pink-500 to-pink-600'
    },
    {
      year: '2024',
      month: 'Aralık',
      title: 'Gelecek Planları',
      description: '2025 yılı için büyük hedefler ve yeni projeler planlıyoruz.',
      icon: <Calendar className="w-6 h-6" />,
      color: 'from-cyan-500 to-cyan-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#0B0B0B] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Yolculuğumuz</span>
            <br />
            <span className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
              Zaman Çizelgesi
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            TDC Market'in kuruluşundan bugüne kadar olan önemli kilometre taşlarımız.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#CBA135] to-[#F4D03F] opacity-30" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex items-start space-x-8"
              >
                {/* Timeline Dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-16 h-16 bg-gradient-to-br ${milestone.color} rounded-full flex items-center justify-center text-white shadow-lg`}>
                    {milestone.icon}
                  </div>
                  <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-full opacity-0 animate-ping" />
                </div>

                {/* Content */}
                <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-[#CBA135]/30">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 text-sm text-[#CBA135] font-medium mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{milestone.month} {milestone.year}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {milestone.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Future Vision */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-[#CBA135]/10 to-[#F4D03F]/10 border border-[#CBA135]/30 rounded-3xl p-8 max-w-4xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Gelecek Vizyonumuz
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              2025 yılında daha da büyük hedeflerle, müşteri memnuniyetini artırarak 
              ve teknolojiyi daha etkin kullanarak sektörde öncü konuma gelmeyi hedefliyoruz.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}