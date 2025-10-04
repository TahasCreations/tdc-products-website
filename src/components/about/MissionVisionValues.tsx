'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, Heart, Users, Leaf, Shield } from 'lucide-react';

export default function MissionVisionValues() {
  const missionVision = [
    {
      icon: Target,
      title: 'Misyonumuz',
      description: 'Kaliteli ürünler ve güvenilir hizmetle müşterilerimizin ihtiyaçlarını karşılayarak, onlara en iyi alışveriş deneyimini sunmak.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Eye,
      title: 'Vizyonumuz',
      description: 'Türkiye\'nin önde gelen e-ticaret platformu olarak, sürdürülebilir büyüme ve müşteri memnuniyetinde sektör lideri olmak.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Heart,
      title: 'Değerlerimiz',
      description: 'Kalite, şeffaflık, sürdürülebilirlik ve topluluk odaklı yaklaşımımızla müşterilerimize değer katıyoruz.',
      color: 'from-red-500 to-orange-500'
    }
  ];

  const values = [
    { icon: Shield, title: 'Kalite', description: 'Her ürünümüzde en yüksek kalite standartlarını uygularız.' },
    { icon: Users, title: 'Şeffaflık', description: 'Müşterilerimizle açık ve dürüst iletişim kurarız.' },
    { icon: Leaf, title: 'Sürdürülebilirlik', description: 'Çevre dostu üretim ve ambalajlama yöntemleri kullanırız.' },
    { icon: Heart, title: 'Topluluk', description: 'Müşteri topluluğumuzun gelişimini destekleriz.' }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission, Vision, Values Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {missionVision.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Değerlerimiz</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            TDC Market olarak, müşterilerimize en iyi hizmeti sunmak için bu değerleri benimsiyoruz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-gray-600 text-sm">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
