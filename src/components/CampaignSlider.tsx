'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: number;
  originalPrice?: number;
  newPrice?: number;
  category: string;
  link: string;
  badge?: string;
  gradient?: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

interface CampaignSliderProps {
  campaigns?: Campaign[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

export default function CampaignSlider({
  campaigns = [],
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  className = ''
}: CampaignSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Default campaigns if none provided
  const defaultCampaigns: Campaign[] = [
    {
      id: '1',
      title: 'Yaz Kampanyası',
      description: 'Tüm figürlerde %30 indirim!',
      image: '/api/placeholder/800/400',
      discount: 30,
      category: 'Tüm Kategoriler',
      link: '/products?campaign=summer',
      badge: 'YENİ',
      gradient: 'from-orange-400 to-red-500',
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    {
      id: '2',
      title: 'Anime Koleksiyonu',
      description: 'En sevilen anime karakterleri %25 indirimle!',
      image: '/api/placeholder/800/400',
      discount: 25,
      category: 'Anime',
      link: '/products?category=anime&campaign=anime',
      badge: 'POPÜLER',
      gradient: 'from-purple-400 to-pink-500',
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    {
      id: '3',
      title: 'Gaming Figürleri',
      description: 'Oyun dünyasının efsane karakterleri!',
      image: '/api/placeholder/800/400',
      discount: 20,
      category: 'Gaming',
      link: '/products?category=gaming&campaign=gaming',
      badge: 'ÖZEL',
      gradient: 'from-blue-400 to-cyan-500',
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    {
      id: '4',
      title: 'Film Karakterleri',
      description: 'Hollywood\'un unutulmaz karakterleri!',
      image: '/api/placeholder/800/400',
      discount: 35,
      category: 'Film',
      link: '/products?category=film&campaign=film',
      badge: 'SINIRLI',
      gradient: 'from-green-400 to-emerald-500',
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    }
  ];

  const activeCampaigns = campaigns.length > 0 ? campaigns : defaultCampaigns;
  const totalSlides = activeCampaigns.length;

  useEffect(() => {
    if (isPlaying && totalSlides > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, totalSlides, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 3000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 3000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 3000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const difference = end - now;

    if (difference <= 0) return null;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

  if (totalSlides === 0) {
    return (
      <div className={`h-96 bg-gray-100 rounded-2xl flex items-center justify-center ${className}`}>
        <p className="text-gray-500 text-lg">Henüz kampanya bulunmuyor</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-2xl ${className}`}>
      {/* Main Slider Container */}
      <div className="relative h-96 md:h-[500px]">
        {activeCampaigns.map((campaign, index) => {
          const isActive = index === currentSlide;
          const timeRemaining = getTimeRemaining(campaign.endDate);

          return (
            <div
              key={campaign.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${campaign.image})`,
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${campaign.gradient} opacity-80`}></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Text Content */}
                    <div className="text-white space-y-6">
                      {campaign.badge && (
                        <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                          {campaign.badge}
                        </div>
                      )}
                      
                      <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                        {campaign.title}
                      </h2>
                      
                      <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                        {campaign.description}
                      </p>

                      <div className="flex items-center space-x-4">
                        <div className="text-3xl md:text-4xl font-bold">
                          %{campaign.discount} İndirim
                        </div>
                        {campaign.originalPrice && campaign.newPrice && (
                          <div className="flex items-center space-x-2">
                            <span className="text-lg line-through opacity-75">
                              {formatPrice(campaign.originalPrice)}
                            </span>
                            <span className="text-2xl font-bold">
                              {formatPrice(campaign.newPrice)}
                            </span>
                          </div>
                        )}
                      </div>

                      {timeRemaining && (
                        <div className="flex items-center space-x-4 text-sm">
                          <span>Kampanya bitişi:</span>
                          <div className="flex space-x-2">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                              <div className="text-center">
                                <div className="text-lg font-bold">{timeRemaining.days}</div>
                                <div className="text-xs">Gün</div>
                              </div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                              <div className="text-center">
                                <div className="text-lg font-bold">{timeRemaining.hours}</div>
                                <div className="text-xs">Saat</div>
                              </div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                              <div className="text-center">
                                <div className="text-lg font-bold">{timeRemaining.minutes}</div>
                                <div className="text-xs">Dakika</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          href={campaign.link}
                          className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <span>Kampanyayı İncele</span>
                          <ChevronRightIcon className="w-5 h-5 ml-2" />
                        </Link>
                        <Link
                          href="/products"
                          className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
                        >
                          Tüm Ürünler
                        </Link>
                      </div>
                    </div>

                    {/* Visual Element */}
                    <div className="hidden lg:flex justify-center">
                      <div className="relative">
                        <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <div className="text-6xl">🎯</div>
                        </div>
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                          <span className="text-2xl">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300"
            aria-label="Önceki kampanya"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300"
            aria-label="Sonraki kampanya"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && totalSlides > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {activeCampaigns.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Kampanya ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {isPlaying && totalSlides > 1 && (
        <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
          <div
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{
              width: `${((currentSlide + 1) / totalSlides) * 100}%`
            }}
          />
        </div>
      )}
    </div>
  );
}
