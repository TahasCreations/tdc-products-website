'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  listPrice?: number;
  category: string;
  stock: number;
  image: string;
  images: string[];
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  seller?: {
    name: string;
    rating: number;
  };
  rating?: number;
  reviewCount?: number;
}

interface ProductCardProps {
  product: Product;
  showSeller?: boolean;
  className?: string;
}

export default function ProductCard({ product, showSeller = false, className = '' }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const discountPercentage = product.listPrice && product.listPrice > product.price 
    ? Math.round(((product.listPrice - product.price) / product.listPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-indigo-200 ${className}`}
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            {!imageError && product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                <div className="text-6xl opacity-50">📦</div>
              </div>
            )}
            
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg"
              >
                %{discountPercentage} İndirim
              </motion.div>
            )}
            
            {/* Stock Badge */}
            {product.stock === 0 && (
              <div className="absolute top-3 right-3 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Stokta Yok
              </div>
            )}
            
            {/* Wishlist Button */}
            <motion.button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg 
                className={`w-4 h-4 transition-colors duration-300 ${
                  isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.button>

            {/* Quick View Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                y: isHovered ? 0 : 20 
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 text-sm font-semibold text-gray-900">
                Hızlı Görüntüle
              </div>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="p-5">
            {/* Category */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                {product.category}
              </span>
              {product.rating && (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="text-sm text-gray-600 font-medium">
                    {product.rating.toFixed(1)}
                  </span>
                  {product.reviewCount && (
                    <span className="text-xs text-gray-400">
                      ({product.reviewCount})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
              {product.title}
            </h3>

            {/* Seller Info */}
            {showSeller && product.seller && (
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {product.seller.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{product.seller.name}</span>
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="text-xs text-gray-500">{product.seller.rating.toFixed(1)}</span>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  ₺{product.price.toLocaleString('tr-TR')}
                </span>
                {product.listPrice && product.listPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₺{product.listPrice.toLocaleString('tr-TR')}
                  </span>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  product.stock > 10 ? 'bg-green-400' : 
                  product.stock > 0 ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
                <span className="text-xs text-gray-500">
                  {product.stock > 10 ? 'Stokta' : 
                   product.stock > 0 ? 'Az Stokta' : 'Stokta Yok'}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={product.stock === 0}
              className={`w-full py-3 px-4 rounded-2xl font-semibold text-white transition-all duration-300 ${
                product.stock === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
