'use client';

import { motion } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';

interface Milestone {
  year: string;
  title: string;
  description?: string;
  link?: string;
}

const milestones: Milestone[] = [
  {
    year: '2019',
    title: 'TDC Market Kuruluşu',
    description: 'Küçük bir ekip ile e-ticaret yolculuğumuza başladık.',
    link: '/blog/tdc-market-kurulusu'
  },
  {
    year: '2020',
    title: 'İlk 1000 Müşteri',
    description: 'Pandemi döneminde online alışverişe geçişle birlikte hızlı büyüme.',
    link: '/blog/ilk-1000-musteri'
  },
  {
    year: '2021',
    title: 'Uluslararası Teslimat',
    description: '25+ ülkeye teslimat hizmeti başlattık.',
    link: '/blog/uluslararasi-teslimat'
  },
  {
    year: '2022',
    title: 'Mobil Uygulama',
    description: 'iOS ve Android uygulamalarımızı yayınladık.',
    link: '/blog/mobil-uygulama'
  },
  {
    year: '2023',
    title: 'Sürdürülebilirlik Programı',
    description: 'Çevre dostu üretim ve ambalajlama süreçlerini hayata geçirdik.',
    link: '/blog/surdurulebilirlik-programi'
  },
  {
    year: '2024',
    title: 'AI Destekli Öneriler',
    description: 'Yapay zeka teknolojisi ile kişiselleştirilmiş ürün önerileri.',
    link: '/blog/ai-destekli-oneriler'
  }
];

export default function Timeline() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Yolculuğumuz</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            TDC Market'in kuruluşundan bugüne kadar geçen süreçteki önemli kilometre taşları
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#CBA135] to-[#F4D03F]"></div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-[#CBA135] rounded-full border-4 border-white shadow-lg z-10"></div>

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                }`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-[#CBA135]">{milestone.year}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#CBA135] transition-colors">
                      {milestone.title}
                    </h3>
                    
                    {milestone.description && (
                      <p className="text-gray-600 mb-4">{milestone.description}</p>
                    )}
                    
                    {milestone.link && (
                      <a
                        href={milestone.link}
                        className="inline-flex items-center space-x-2 text-[#CBA135] hover:text-[#F4D03F] transition-colors font-medium"
                      >
                        <span>Detayları Gör</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
