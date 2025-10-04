'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  name: string;
  rating: number;
  content: string;
  avatar?: string;
  location?: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Ayşe Demir',
    rating: 5,
    content: 'TDC Market\'ten aldığım ürünler gerçekten kaliteli. Hızlı teslimat ve müşteri hizmetleri çok profesyonel.',
    avatar: 'https://via.placeholder.com/80x80/4F46E5/FFFFFF?text=AD',
    location: 'İstanbul'
  },
  {
    name: 'Mehmet Kaya',
    rating: 5,
    content: 'Figür koleksiyonum için aradığım her şeyi buldum. Ürün çeşitliliği ve fiyatlar çok uygun.',
    avatar: 'https://via.placeholder.com/80x80/27AE60/FFFFFF?text=MK',
    location: 'Ankara'
  },
  {
    name: 'Elif Özkan',
    rating: 5,
    content: 'Elektronik ürünlerde güvenilir bir platform. İade süreci de çok kolay.',
    avatar: 'https://via.placeholder.com/80x80/FF6B6B/FFFFFF?text=EO',
    location: 'İzmir'
  },
  {
    name: 'Can Yılmaz',
    rating: 5,
    content: 'Ev dekorasyonu için mükemmel ürünler. Kalite ve tasarım harika.',
    avatar: 'https://via.placeholder.com/80x80/9B59B6/FFFFFF?text=CY',
    location: 'Bursa'
  },
  {
    name: 'Zeynep Arslan',
    rating: 5,
    content: 'Hediye seçimi için ideal platform. Herkes için uygun ürünler var.',
    avatar: 'https://via.placeholder.com/80x80/CBA135/FFFFFF?text=ZA',
    location: 'Antalya'
  },
  {
    name: 'Ali Çelik',
    rating: 5,
    content: 'Sanat ve hobi malzemeleri konusunda en iyi seçenek. Kaliteli ve uygun fiyatlı.',
    avatar: 'https://via.placeholder.com/80x80/FF8C00/FFFFFF?text=AC',
    location: 'Adana'
  }
];

const socialLinks = [
  { name: 'Instagram', icon: '📷', url: 'https://instagram.com/tdcmarket', followers: '25K' },
  { name: 'Discord', icon: '💬', url: 'https://discord.gg/tdcmarket', members: '5K' },
  { name: 'Twitter', icon: '🐦', url: 'https://twitter.com/tdcmarket', followers: '15K' },
  { name: 'YouTube', icon: '📺', url: 'https://youtube.com/tdcmarket', subscribers: '10K' }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Müşterilerimiz Ne Diyor?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Binlerce mutlu müşterimizin deneyimlerini keşfedin
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#CBA135] text-[#CBA135]" />
                    ))}
                  </div>
                  
                  <div className="relative mb-4">
                    <Quote className="w-8 h-8 text-[#CBA135] opacity-20 absolute -top-2 -left-2" />
                    <p className="text-gray-600 italic leading-relaxed pl-6">
                      "{testimonial.content}"
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Image
                      src={testimonial.avatar || 'https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=?'}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      {testimonial.location && (
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Social Community */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-lg"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Topluluğumuza Katılın</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sosyal medyada bizi takip edin ve topluluğumuzun bir parçası olun
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-[#CBA135] hover:to-[#F4D03F] transition-all duration-300"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {social.icon}
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-white transition-colors mb-1">
                  {social.name}
                </h4>
                <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors">
                  {social.followers || social.members || social.subscribers}
                </p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
