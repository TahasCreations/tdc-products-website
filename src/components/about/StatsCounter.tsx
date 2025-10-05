'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Users, Package, Star, Truck, Heart, Globe } from 'lucide-react';

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function Counter({ end, duration = 2, suffix = '', prefix = '' }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const startCount = 0;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const currentCount = Math.floor(progress * (end - startCount) + startCount);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, duration, isInView]);

  return (
    <span ref={ref} className="font-bold">
      {prefix}{count.toLocaleString('tr-TR')}{suffix}
    </span>
  );
}

export default function StatsCounter() {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: 1250,
      suffix: '+',
      label: 'Mutlu Müşteri',
      description: 'Platformumuzu tercih eden müşteri sayısı',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Package className="w-8 h-8" />,
      value: 5000,
      suffix: '+',
      label: 'Ürün Çeşidi',
      description: 'Farklı kategorilerde ürün yelpazesi',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: 4.8,
      suffix: '/5',
      label: 'Müşteri Puanı',
      description: 'Ortalama müşteri değerlendirmesi',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      value: 98,
      suffix: '%',
      label: 'Zamanında Teslimat',
      description: 'Planlanan tarihte teslimat oranı',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      value: 24,
      suffix: '/7',
      label: 'Müşteri Desteği',
      description: 'Kesintisiz destek hizmeti',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      value: 81,
      suffix: '',
      label: 'İl Kapsamı',
      description: 'Türkiye geneli teslimat ağı',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#1a1a1a] to-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Rakamlarla</span>
            <br />
            <span className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
              TDC Market
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Başarılarımızı ve müşteri memnuniyetimizi rakamlarla gösteriyoruz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:border-[#CBA135]/30 h-full">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>

                {/* Counter */}
                <div className="mb-4">
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    <Counter 
                      end={stat.value} 
                      duration={2.5}
                      suffix={stat.suffix}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-[#CBA135] transition-colors">
                    {stat.label}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {stat.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#CBA135]/5 to-[#F4D03F]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievement Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-[#CBA135]/10 to-[#F4D03F]/10 border border-[#CBA135]/30 rounded-2xl px-8 py-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-black" />
            </div>
            <div className="text-left">
              <div className="text-lg font-bold text-white">Güvenilir Platform</div>
              <div className="text-sm text-gray-300">2024 E-ticaret Ödülü</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
