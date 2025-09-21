'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { 
  FireIcon,
  ClockIcon,
  TagIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface Campaign {
  id: string;
  title: string;
  description: string;
  discount: number;
  category: string;
  image: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  products: any[];
}

const getDefaultCampaigns = (): Campaign[] => [
  {
    id: "1",
    title: "Anime Figürleri %30 İndirim",
    description: "Tüm anime figürlerinde büyük indirim! En sevdiğiniz karakterleri kaçırmayın.",
    discount: 30,
    category: "Anime",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: true,
    products: []
  },
  {
    id: "2",
    title: "Gaming Koleksiyonu %25 İndirim",
    description: "Gaming dünyasının efsane karakterleri özel fiyatlarla!",
    discount: 25,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: true,
    products: []
  },
  {
    id: "3",
    title: "Film Figürleri %20 İndirim",
    description: "Hollywood'un en sevilen karakterleri artık daha uygun!",
    discount: 20,
    category: "Film",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: true,
    products: []
  },
  {
    id: "4",
    title: "Yeni Ürünler %15 İndirim",
    description: "Yeni eklenen tüm ürünlerde özel indirim fırsatı!",
    discount: 15,
    category: "Yeni",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: true,
    products: []
  }
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCampaigns(getDefaultCampaigns());
      setLoading(false);
    }, 1000);
  }, []);

  const categories = ['all', 'Anime', 'Gaming', 'Film', 'Yeni'];
  const filteredCampaigns = selectedCategory === 'all' 
    ? campaigns 
    : campaigns.filter(campaign => campaign.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FireIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              🔥 Özel Kampanyalar
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kaçırılmayacak fırsatlar ve sınırlı süreli indirimler
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {category === 'all' ? 'Tümü' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCampaigns.map((campaign) => (
                <div key={campaign.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  <div className="relative">
                    <Image
                      src={campaign.image}
                      alt={campaign.title}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        %{campaign.discount} İndirim
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        {campaign.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      {campaign.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {campaign.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        <span>Geçerli: {new Date(campaign.endDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex items-center text-yellow-500">
                        <StarIcon className="w-4 h-4 fill-current" />
                        <StarIcon className="w-4 h-4 fill-current" />
                        <StarIcon className="w-4 h-4 fill-current" />
                        <StarIcon className="w-4 h-4 fill-current" />
                        <StarIcon className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                    
                    <Link
                      href={`/products?category=${campaign.category.toLowerCase()}`}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center group"
                    >
                      <span>Kampanyayı Gör</span>
                      <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Kampanyaları Kaçırma!
          </h2>
          <p className="text-xl text-red-100 mb-8">
            En güncel kampanyalar ve özel fırsatlar için bizi takip et
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-red-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <i className="ri-shopping-bag-line mr-2"></i>
              Tüm Ürünleri Gör
            </Link>
            <Link
              href="/contact"
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              <i className="ri-notification-line mr-2"></i>
              Bildirim Al
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
