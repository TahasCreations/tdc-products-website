"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, TrendingUp, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
}

interface ProductRecommendationsProps {
  currentCartItems: string[];
  onAddToCart: (product: Product) => void;
}

export default function ProductRecommendations({ currentCartItems, onAddToCart }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recommendations
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/reco', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            productIds: currentCartItems,
            limit: 4 
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.products || []);
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentCartItems]);

  if (loading || recommendations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl border-2 border-purple-200"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">Bunları da alabilirsiniz</h3>
        <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-semibold">
          AI Önerisi
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all group"
          >
            {/* Product Image */}
            <div className="relative aspect-square rounded-t-xl overflow-hidden bg-gray-100">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package className="w-12 h-12" />
                </div>
              )}
              
              {/* Quick Add Button */}
              <button
                onClick={() => onAddToCart(product)}
                className="absolute bottom-2 right-2 w-8 h-8 bg-[#CBA135] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-[#B8941F]"
                aria-label="Sepete ekle"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
                {product.name}
              </p>
              
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-2">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
                <span className="text-xs text-gray-500">({product.reviewCount})</span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#CBA135]">
                  ₺{product.price.toFixed(2)}
                </span>
                <button
                  onClick={() => onAddToCart(product)}
                  className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-all font-medium"
                >
                  Ekle
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Incentive */}
      <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
        <p className="text-xs text-center text-gray-600">
          💡 Bu ürünleri alanlar <span className="font-bold text-purple-600">%95 memnun</span> kaldı
        </p>
      </div>
    </motion.div>
  );
}


