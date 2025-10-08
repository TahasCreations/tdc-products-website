'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface HeroProps {
  onSearch?: (query: string) => void;
  onCollectionClick?: (collection: any) => void;
}

export default function Hero({ onSearch, onCollectionClick }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleCollectionExplore = () => {
    if (onCollectionClick) {
      onCollectionClick({ slug: 'all', name: 'Tüm Koleksiyonlar' });
    }
  };

  const handleSellerPortal = () => {
    // Redirect to seller registration or login
    window.location.href = '/seller/register';
  };

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-indigo-50/30 pt-20 pb-12">
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-1/4 left-1/4 w-32 h-32"
        >
          <div className="w-full h-full bg-gradient-to-r from-indigo-400/20 to-coral-400/20 rounded-full animate-pulse" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute top-1/3 right-1/3 w-24 h-24"
        >
          <div className="w-full h-full bg-gradient-to-r from-coral-400/20 to-indigo-400/20 rounded-full animate-pulse" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="absolute bottom-1/4 left-1/3 w-20 h-20"
        >
          <div className="w-full h-full bg-gradient-to-r from-indigo-400/20 to-coral-400/20 rounded-full animate-pulse" />
        </motion.div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-400 to-coral-400 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.08 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-coral-400 to-indigo-400 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-4"
            >
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-coral-100 text-indigo-700 rounded-full text-sm font-medium">
                🏪 TDC Market
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-ink-900 mb-4 sm:mb-6 font-serif leading-tight"
            >
              <span className="block">TDC Market —</span>
              <span className="block bg-gradient-to-r from-indigo-600 to-coral-500 bg-clip-text text-transparent text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Özel figürlerden elektroniğe, tasarımdan ev yaşamına
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg sm:text-xl text-ink-600 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed px-4 sm:px-0"
            >
              El yapımı & koleksiyon ürünlerinden moda ve teknolojiye; hepsi TDC Market'te.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              onSubmit={handleSearch}
              className="mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0 px-4 sm:px-0"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün, kategori veya marka ara..."
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-12 rounded-2xl border-2 border-ink-200 focus:border-indigo-500 focus:outline-none transition-colors text-base sm:text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-colors touch-manipulation"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCollectionExplore}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-coral-500 text-white rounded-2xl font-semibold text-base sm:text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 touch-manipulation min-h-[48px]"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600 to-coral-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center">
                  Keşfet
                  <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSellerPortal}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 border-2 border-ink-300 text-ink-700 rounded-2xl font-semibold text-base sm:text-lg hover:border-indigo-400 hover:text-indigo-600 transition-all duration-300 bg-white/50 backdrop-blur-sm touch-manipulation min-h-[48px]"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-50 to-coral-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center">
                  Özel Figürler
                  <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-8 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto lg:mx-0 px-4 sm:px-0"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-1">10K+</div>
                <div className="text-xs sm:text-sm text-ink-600">Ürün</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-coral-500 mb-1">500+</div>
                <div className="text-xs sm:text-sm text-ink-600">Satıcı</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-1">50K+</div>
                <div className="text-xs sm:text-sm text-ink-600">Müşteri</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mt-8 lg:mt-0"
          >
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px]">
              <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-coral-100 rounded-3xl flex items-center justify-center relative overflow-hidden">
                {/* Animated Background Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-indigo-200/30 to-coral-200/30 rounded-full w-80 h-80 -top-20 -right-20"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-coral-200/30 to-indigo-200/30 rounded-full w-60 h-60 -bottom-20 -left-20"
                />
                
                {/* Main Icon */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="text-6xl sm:text-7xl lg:text-8xl"
                >
                  🎨
                </motion.div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute top-4 right-4 sm:top-10 sm:right-10 w-12 h-12 sm:w-16 sm:h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center"
              >
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="absolute bottom-16 left-4 sm:bottom-20 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center"
              >
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-coral-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="absolute top-1/2 left-2 sm:left-5 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-ink-300 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-indigo-500 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
