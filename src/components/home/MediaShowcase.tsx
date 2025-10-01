'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

const mediaItems = [
  {
    id: 1,
    type: 'video',
    title: 'Atölye Turu',
    description: 'Figür üretim sürecimizi keşfedin',
    thumbnail: '/images/workshop-1.jpg',
    duration: '2:34'
  },
  {
    id: 2,
    type: 'image',
    title: 'Premium Kalite',
    description: 'El işçiliği detayları',
    thumbnail: '/images/quality-1.jpg'
  },
  {
    id: 3,
    type: 'video',
    title: 'Sanatçı Röportajı',
    description: 'Usta sanatçılarımızla tanışın',
    thumbnail: '/images/artist-1.jpg',
    duration: '4:12'
  },
  {
    id: 4,
    type: 'image',
    title: 'Koleksiyon Galerisi',
    description: 'Özel eserlerimiz',
    thumbnail: '/images/gallery-1.jpg'
  },
  {
    id: 5,
    type: 'video',
    title: 'Paketleme Süreci',
    description: 'Güvenli teslimat',
    thumbnail: '/images/packaging-1.jpg',
    duration: '1:45'
  },
  {
    id: 6,
    type: 'image',
    title: 'Müşteri Yorumları',
    description: 'Memnun müşterilerimiz',
    thumbnail: '/images/testimonial-1.jpg'
  }
];

export default function MediaShowcase() {
  const [activeItem, setActiveItem] = useState(0);

  return (
    <section className="py-20 bg-gradient-to-br from-neutral-50 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-ink-900 mb-6 font-serif">
            Üretim & Kalite{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-coral-500 bg-clip-text text-transparent">
              Showcase
            </span>
          </h2>
          <p className="text-xl text-ink-600 max-w-3xl mx-auto">
            Atölyemizden kalite standartlarımıza kadar her detayı görün
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Media Display */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
              <Image
                src={mediaItems[activeItem].thumbnail}
                alt={mediaItems[activeItem].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              />
              
              {/* Video Overlay */}
              {mediaItems[activeItem].type === 'video' && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-colors"
                  >
                    <svg className="w-8 h-8 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </motion.button>
                </div>
              )}

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-2 font-serif">
                      {mediaItems[activeItem].title}
                    </h3>
                    <p className="text-lg opacity-90">
                      {mediaItems[activeItem].description}
                    </p>
                  </div>
                  {mediaItems[activeItem].duration && (
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                      {mediaItems[activeItem].duration}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Thumbnail Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {mediaItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative h-24 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  activeItem === index 
                    ? 'ring-4 ring-indigo-500 shadow-lg scale-105' 
                    : 'hover:scale-105 hover:shadow-lg'
                }`}
                onClick={() => setActiveItem(index)}
              >
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                
                {/* Type Indicator */}
                <div className="absolute top-2 left-2">
                  {item.type === 'video' ? (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Duration for videos */}
                {item.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {item.duration}
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center mt-8 space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveItem(prev => prev > 0 ? prev - 1 : mediaItems.length - 1)}
            className="w-12 h-12 bg-white border-2 border-indigo-300 rounded-full flex items-center justify-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveItem(prev => prev < mediaItems.length - 1 ? prev + 1 : 0)}
            className="w-12 h-12 bg-white border-2 border-indigo-300 rounded-full flex items-center justify-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
