'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PromoBandProps {
  promos: {
    id: string;
    title: string;
    description: string;
    image: string;
    ctaText: string;
    ctaLink: string;
    badge?: string;
    gradient: string;
  }[];
  autoRotate?: boolean;
  rotationInterval?: number;
  className?: string;
}

export default function PromoBand({ 
  promos, 
  autoRotate = true, 
  rotationInterval = 5000,
  className = '' 
}: PromoBandProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoRotate || promos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, promos.length, rotationInterval]);

  if (promos.length === 0) return null;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="relative h-96">
        {promos.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0,
              x: index === currentIndex ? 0 : 100
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={`absolute inset-0 ${promo.gradient} flex items-center`}
          >
            <div className="container mx-auto px-4 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-white"
                >
                  {promo.badge && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4"
                    >
                      {promo.badge}
                    </motion.span>
                  )}
                  
                  <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                    {promo.title}
                  </h2>
                  
                  <p className="text-xl text-white/90 mb-6 max-w-lg">
                    {promo.description}
                  </p>
                  
                  <motion.a
                    href={promo.ctaLink}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-white/90 transition-colors"
                  >
                    {promo.ctaText}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.a>
                </motion.div>

                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="relative"
                >
                  <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Dots */}
      {promos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {promos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
