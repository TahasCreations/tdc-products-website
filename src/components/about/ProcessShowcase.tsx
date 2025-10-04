'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Package, Settings, CheckCircle, Truck } from 'lucide-react';
import Image from 'next/image';

const processSteps = [
  {
    icon: Palette,
    title: 'Tasarım',
    description: 'Yaratıcı tasarım ekibimiz her ürün için özel tasarımlar geliştirir.',
    image: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Design',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Package,
    title: 'Malzeme Seçimi',
    description: 'En kaliteli ve sürdürülebilir malzemeleri özenle seçeriz.',
    image: 'https://via.placeholder.com/400x300/27AE60/FFFFFF?text=Materials',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Settings,
    title: 'Üretim',
    description: 'Modern teknoloji ve uzman ellerle hassas üretim süreci.',
    image: 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Production',
    color: 'from-red-500 to-orange-500'
  },
  {
    icon: CheckCircle,
    title: 'Kalite Kontrol',
    description: 'Her ürün detaylı kalite kontrolünden geçer.',
    image: 'https://via.placeholder.com/400x300/9B59B6/FFFFFF?text=Quality',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Truck,
    title: 'Paketleme & Teslimat',
    description: 'Güvenli ambalajlama ve hızlı teslimat süreci.',
    image: 'https://via.placeholder.com/400x300/CBA135/FFFFFF?text=Shipping',
    color: 'from-yellow-500 to-orange-500'
  }
];

const sustainabilityFeatures = [
  {
    title: 'Sürdürülebilir Malzemeler',
    description: 'Geri dönüştürülebilir ve çevre dostu malzemeler kullanıyoruz.',
    icon: '🌱'
  },
  {
    title: 'Atık Azaltma',
    description: 'Üretim sürecimizde atık miktarını minimuma indiriyoruz.',
    icon: '♻️'
  },
  {
    title: 'Enerji Verimliliği',
    description: 'Yenilenebilir enerji kaynaklarını tercih ediyoruz.',
    icon: '⚡'
  },
  {
    title: 'Karbon Ayak İzi',
    description: 'Karbon emisyonlarımızı sürekli olarak azaltıyoruz.',
    icon: '🌍'
  }
];

export default function ProcessShowcase() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nasıl Üretiyoruz?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Her ürünümüzün arkasında titizlikle planlanmış bir süreç var. 
            Tasarımdan teslimatına kadar her adımı şeffaflıkla paylaşıyoruz.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="space-y-12 mb-20">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row items-center gap-8 ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={600}
                    height={400}
                    className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2">
                <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-[#CBA135]">Adım {index + 1}</span>
                        <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sustainability Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Sürdürülebilirlik</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Gelecek nesillere daha iyi bir dünya bırakmak için sürdürülebilir üretim süreçlerini benimsiyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sustainabilityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
