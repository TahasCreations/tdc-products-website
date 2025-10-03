'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Campaign {
  id: string;
  title: string;
  description: string;
  discount: number;
  image: string;
  link: string;
  badge: string;
  gradient: string;
}

const campaigns: Campaign[] = [
  {
    id: '1',
    title: '3D Figür Koleksiyonu',
    description: 'Tüm anime figürlerinde %30 indirim',
    discount: 30,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop',
    link: '/products?category=anime',
    badge: '🔥 Sıcak',
    gradient: 'from-red-500 to-pink-500'
  },
  {
    id: '2',
    title: 'Premium Abonelik',
    description: 'İlk ay ücretsiz + özel indirimler',
    discount: 50,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    link: '/subscriptions',
    badge: '⭐ Premium',
    gradient: 'from-purple-500 to-indigo-500'
  },
  {
    id: '3',
    title: 'Yeni Ürünler',
    description: 'Son eklenen figürlerde %20 indirim',
    discount: 20,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop',
    link: '/products?sort=newest',
    badge: '✨ Yeni',
    gradient: 'from-green-500 to-teal-500'
  },
  {
    id: '4',
    title: 'Toplu Alım',
    description: '5+ ürün alana ekstra %15 indirim',
    discount: 15,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    link: '/products?bulk=true',
    badge: '🎁 Bonus',
    gradient: 'from-orange-500 to-red-500'
  }
];

export default function CampaignSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === campaigns.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? campaigns.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === campaigns.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {campaigns.map((campaign, index) => (
            <div key={campaign.id} className="w-full flex-shrink-0">
              <div className={`relative h-96 bg-gradient-to-br ${campaign.gradient} overflow-hidden`}>
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-full bg-white/10"></div>
                </div>
                
                <div className="relative h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div className="text-white">
                        <div className="mb-4">
                          <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                            {campaign.badge}
                          </span>
                        </div>
                        
                        <h3 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                          {campaign.title}
                        </h3>
                        
                        <p className="text-xl md:text-2xl mb-8 text-white/90">
                          {campaign.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 mb-8">
                          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                            <div className="text-3xl font-bold">
                              %{campaign.discount}
                            </div>
                            <div className="text-sm opacity-90">
                              İndirim
                            </div>
                          </div>
                        </div>
                        
                        <Link
                          href={campaign.link}
                          className="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          Kampanyayı İncele
                          <i className="ri-arrow-right-line ml-2"></i>
                        </Link>
                      </div>
                      
                      <div className="relative hidden lg:block">
                        <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-2xl">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                          <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                            <div className="text-8xl opacity-50">
                              🎨
                            </div>
                          </div>
                        </div>
                        
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-ping delay-1000"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
        >
          <i className="ri-arrow-left-line text-xl"></i>
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
        >
          <i className="ri-arrow-right-line text-xl"></i>
        </button>
      </div>
      
      <div className="flex justify-center space-x-3 mt-8">
        {campaigns.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-blue-600 scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
