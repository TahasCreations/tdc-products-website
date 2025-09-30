'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MagnifyingGlassIcon,
  CubeIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface HeroProps {
  onSearch: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-accent-500 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-success-500 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-warning-500 rounded-full blur-xl animate-bounce-slow"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium animate-fade-in-up">
              <StarIcon className="w-4 h-4 mr-2" />
              Türkiye'nin #1 3D Figür Pazarı
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-clash font-bold text-ink-900 leading-tight animate-text-slide-up">
                Türkiye'nin{' '}
                <span className="text-transparent bg-clip-text bg-gradient-tdc">
                  tasarım & figür
                </span>{' '}
                pazarı
              </h1>
              
              <p className="text-xl md:text-2xl text-ink-600 font-medium animate-text-slide-up delay-300">
                AI destekli arama, özel domainli mağazalar, düşük komisyon
              </p>
              
              <p className="text-lg text-ink-500 max-w-2xl leading-relaxed animate-text-slide-up delay-500">
                El yapımı sıcaklığı ile AI güvencesini buluşturan platform. 
                En sevdiğiniz karakterlerin detaylı figürlerini keşfedin.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto lg:mx-0 animate-text-slide-up delay-700">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-tdc rounded-tdc opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                <div className="relative flex items-center bg-white rounded-tdc shadow-tdc-lg border border-neutral-200 group-hover:shadow-tdc-xl transition-all duration-300">
                  <div className="flex-1 px-6 py-4">
                    <input
                      type="text"
                      placeholder="3D figür, karakter, dekoratif obje ara..."
                      className="w-full text-lg text-ink-900 placeholder-ink-400 focus:outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      aria-label="Ürün arama"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-4 bg-gradient-tdc text-white rounded-r-tdc hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    aria-label="Arama yap"
                  >
                    <MagnifyingGlassIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-text-slide-up delay-900">
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-tdc text-white text-lg font-semibold rounded-tdc shadow-tdc-lg hover:shadow-tdc-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Ürünleri keşfet"
              >
                <CubeIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Keşfet
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link
                href="/become-seller"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-ink-700 text-lg font-semibold rounded-tdc border-2 border-ink-200 hover:border-primary-300 hover:bg-primary-50 shadow-tdc hover:shadow-tdc-lg transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Mağaza aç"
              >
                <StarIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Mağazanı Aç
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 animate-text-slide-up delay-1100">
              <div className="text-center">
                <div className="text-3xl font-bold text-ink-900">10K+</div>
                <div className="text-sm text-ink-600">Aktif Satıcı</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-ink-900">50K+</div>
                <div className="text-sm text-ink-600">Ürün Çeşidi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-ink-900">1M+</div>
                <div className="text-sm text-ink-600">Mutlu Müşteri</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative flex justify-center items-center animate-fade-in-up delay-500">
            <div className="relative w-full max-w-lg">
              {/* Main Product Showcase */}
              <div className="relative bg-white rounded-3xl shadow-tdc-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-square relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50">
                  <Image
                    src="/images/hero/showcase-1.jpg"
                    alt="3D Figür Koleksiyonu"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-gradient-tdc text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Yeni!
                </div>
              </div>

              {/* Floating Product Cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-tdc-xl p-4 transform -rotate-12 hover:rotate-0 transition-transform duration-500 animate-float">
                <div className="w-20 h-20 relative overflow-hidden rounded-xl bg-gradient-to-br from-success-50 to-primary-50">
                  <Image
                    src="/images/hero/floating-1.jpg"
                    alt="Küçük figür"
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="80px"
                  />
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-tdc-xl p-4 transform rotate-12 hover:rotate-0 transition-transform duration-500 animate-float-delayed">
                <div className="w-20 h-20 relative overflow-hidden rounded-xl bg-gradient-to-br from-accent-50 to-warning-50">
                  <Image
                    src="/images/hero/floating-2.jpg"
                    alt="Dekoratif obje"
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="80px"
                  />
                </div>
              </div>

              {/* Background Decorative Elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-tdc-soft rounded-full opacity-10 blur-3xl -z-10 animate-pulse-glow"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-ink-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-ink-300 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

