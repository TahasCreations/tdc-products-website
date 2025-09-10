'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  description: string;
  tags: string[];
  stock: number;
}

interface SmartRecommendationsProps {
  userId?: string;
  userPreferences?: {
    categories?: string[];
    priceRange?: { min: number; max: number };
    brands?: string[];
    recentlyViewed?: string[];
    purchaseHistory?: string[];
  };
  currentProduct?: string;
  context?: 'homepage' | 'product' | 'cart' | 'checkout';
  limit?: number;
  title?: string;
  showTitle?: boolean;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  userId,
  userPreferences,
  currentProduct,
  context = 'homepage',
  limit = 6,
  title,
  showTitle = true
}) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, [userId, userPreferences, currentProduct, context, limit]);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userPreferences,
          currentProduct,
          context,
          limit
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations);
      } else {
        throw new Error(data.error || 'Öneriler alınamadı');
      }
    } catch (error) {
      console.error('Recommendations error:', error);
      setError('Öneriler yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultTitle = () => {
    switch (context) {
      case 'homepage':
        return '🤖 AI Önerileri - Size Özel';
      case 'product':
        return '🔗 Benzer Ürünler';
      case 'cart':
        return '🛒 Sepetinize Uygun';
      case 'checkout':
        return '⚡ Son Şans Fırsatları';
      default:
        return '🎯 Size Özel Öneriler';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`ri-star-${
          i < Math.floor(rating) ? 'fill' : 'line'
        } text-yellow-400 text-sm`}
      ></i>
    ));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        {showTitle && (
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {title || getDefaultTitle()}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-3"></div>
              <div className="bg-gray-200 rounded h-4 mb-2"></div>
              <div className="bg-gray-200 rounded h-3 w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        {showTitle && (
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {title || getDefaultTitle()}
          </h2>
        )}
        <div className="text-center py-8">
          <i className="ri-error-warning-line text-4xl text-red-500 mb-2"></i>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchRecommendations}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        {showTitle && (
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {title || getDefaultTitle()}
          </h2>
        )}
        <div className="text-center py-8">
          <i className="ri-inbox-line text-4xl text-gray-400 mb-2"></i>
          <p className="text-gray-600">Henüz öneri bulunmuyor</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {title || getDefaultTitle()}
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            <i className="ri-robot-line mr-1"></i>
            AI Destekli
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {recommendations.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group block bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
          >
            <div className="relative">
              <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Stock Badge */}
              {product.stock < 10 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Az Kaldı!
                </div>
              )}
              
              {/* AI Badge */}
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                AI Önerisi
              </div>
            </div>

            <div className="p-3">
              <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  ({product.rating})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">
                  ₺{product.price.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {product.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={fetchRecommendations}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          <i className="ri-refresh-line mr-1"></i>
          Önerileri Yenile
        </button>
      </div>
    </div>
  );
};

export default SmartRecommendations;
