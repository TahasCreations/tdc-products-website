'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface Stat {
  label: string;
  value: string;
  helper?: string;
}

const stats: Stat[] = [
  { label: 'Mutlu Müşteri', value: '50,000+', helper: 'Aktif kullanıcı' },
  { label: 'Ürün Çeşidi', value: '10,000+', helper: 'Farklı ürün' },
  { label: 'Ülke', value: '25+', helper: 'Teslimat yapılan ülke' },
  { label: 'Müşteri Memnuniyeti', value: '%98', helper: 'Ortalama puan' },
  { label: 'Yıllık Deneyim', value: '5+', helper: 'Sektörde' },
  { label: 'Günlük Sipariş', value: '500+', helper: 'Ortalama sipariş' }
];

export default function StatsStrip() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [counts, setCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (isInView) {
      stats.forEach((stat, index) => {
        const numericValue = parseInt(stat.value.replace(/[^\d]/g, ''));
        if (!isNaN(numericValue)) {
          const duration = 2000;
          const increment = numericValue / (duration / 16);
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
              current = numericValue;
              clearInterval(timer);
            }
            setCounts(prev => ({ ...prev, [stat.label]: Math.floor(current) }));
          }, 16);

          return () => clearInterval(timer);
        }
      });
    }
  }, [isInView]);

  const formatValue = (stat: Stat) => {
    if (stat.value.includes('%')) {
      return counts[stat.label] ? `${counts[stat.label]}%` : '0%';
    }
    if (stat.value.includes('+')) {
      return counts[stat.label] ? `${counts[stat.label].toLocaleString()}+` : '0+';
    }
    return counts[stat.label] ? counts[stat.label].toLocaleString() : '0';
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-r from-[#CBA135] to-[#F4D03F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Rakamlarla TDC Market</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Başarılarımızı sayılarla gösteriyoruz
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                >
                  {formatValue(stat)}
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-1">{stat.label}</h3>
                {stat.helper && (
                  <p className="text-sm text-white/80">{stat.helper}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
