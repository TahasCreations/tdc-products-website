'use client';

import { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  HeartIcon, 
  ShoppingCartIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  slug: string;
}

interface RecommendationEngineProps {
  currentProductId?: string;
  userId?: string;
  category?: string;
  limit?: number;
  onRecommendationClick?: (product: Product) => void;
}

export default function ProductRecommendationEngine({
  currentProductId,
  userId,
  category,
  limit = 6,
  onRecommendationClick
}: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [algorithm, setAlgorithm] = useState<'collaborative' | 'content' | 'hybrid'>('hybrid');

  useEffect(() => {
    fetchRecommendations();
  }, [currentProductId, userId, category, algorithm]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentProductId,
          userId,
          category,
          algorithm,
          limit
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations);
      } else {
        // Fallback: Mock recommendations
        setRecommendations(generateMockRecommendations());
      }
    } catch (error) {
      console.error('Öneri sistemi hatası:', error);
      setError('Öneriler yüklenemedi');
      setRecommendations(generateMockRecommendations());
    } finally {
      setLoading(false);
    }
  };

  const generateMockRecommendations = (): Product[] => {
    const mockProducts: Product[] = [
      {
        id: '1',
        title: 'Naruto Uzumaki Figürü',
        price: 299,
        image: '/images/products/naruto.jpg',
        category: 'Anime',
        rating: 4.8,
        reviews: 156,
        slug: 'naruto-uzumaki-figuru'
      },
      {
        id: '2',
        title: 'Goku Super Saiyan Figürü',
        price: 349,
        image: '/images/products/goku.jpg',
        category: 'Anime',
        rating: 4.9,
        reviews: 203,
        slug: 'goku-super-saiyan-figuru'
      },
      {
        id: '3',
        title: 'Minecraft Steve Figürü',
        price: 199,
        image: '/images/products/steve.jpg',
        category: 'Oyun',
        rating: 4.6,
        reviews: 89,
        slug: 'minecraft-steve-figuru'
      },
      {
        id: '4',
        title: 'Spider-Man Figürü',
        price: 399,
        image: '/images/products/spiderman.jpg',
        category: 'Film',
        rating: 4.7,
        reviews: 124,
        slug: 'spider-man-figuru'
      },
      {
        id: '5',
        title: 'Pikachu Figürü',
        price: 249,
        image: '/images/products/pikachu.jpg',
        category: 'Oyun',
        rating: 4.9,
        reviews: 178,
        slug: 'pikachu-figuru'
      },
      {
        id: '6',
        title: 'Batman Figürü',
        price: 379,
        image: '/images/products/batman.jpg',
        category: 'Film',
        rating: 4.5,
        reviews: 95,
        slug: 'batman-figuru'
      }
    ];

    return mockProducts.slice(0, limit);
  };

  const handleProductClick = (product: Product) => {
    if (onRecommendationClick) {
      onRecommendationClick(product);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <SparklesIcon className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Önerileri</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <SparklesIcon className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">AI Önerileri</h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchRecommendations}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Önerileri</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Algoritma:</span>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="collaborative">İşbirlikçi</option>
            <option value="content">İçerik Tabanlı</option>
            <option value="hybrid">Hibrit</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((product) => (
          <div
            key={product.id}
            className="group cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square mb-3">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                  <HeartIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                {product.title}
              </h4>
              
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              <div className="flex space-x-2">
                <Link
                  href={`/products/${product.slug}`}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-center text-sm font-medium"
                >
                  <EyeIcon className="w-4 h-4 inline mr-1" />
                  İncele
                </Link>
                <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  <ShoppingCartIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-8">
          <SparklesIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Henüz öneri bulunmuyor</p>
        </div>
      )}
    </div>
  );
}
