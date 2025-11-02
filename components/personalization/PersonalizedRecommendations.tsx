"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Eye, Heart } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  reason: string;
}

export default function PersonalizedRecommendations() {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations/personalized');
      const data = await response.json();
      setRecommendations(data.products || []);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <Sparkles className="w-7 h-7 text-purple-600" />
          <span>Size Özel Seçtiklerimiz</span>
        </h2>
        <div className="text-sm text-purple-600 font-semibold">
          AI destekli öneriler
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {recommendations.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link href={`/products/${product.id}`}>
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full" />
                </div>
                <div className="absolute top-2 right-2 px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                  Öneri
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-purple-600 mb-2">{product.reason}</p>
              <p className="font-bold text-gray-900">₺{product.price}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function RecentlyViewed() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
        <Eye className="w-6 h-6 text-blue-600" />
        <span>Son Baktıklarınız</span>
      </h3>
      {/* Product list */}
    </div>
  );
}

export function TrendingForYou() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
        <TrendingUp className="w-6 h-6 text-green-600" />
        <span>Sizin İçin Trend</span>
      </h3>
      {/* Product list */}
    </div>
  );
}

