'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCompare } from '@/contexts/CompareContext';
import StockIndicator from '@/components/products/StockIndicator';
import { QuickBuyWithCart } from '@/components/products/QuickBuyButton';

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
    badges?: string[]; // ['verified', 'top-rated', 'fast-shipping', 'new-seller']
  };
  rating?: number;
  reviewCount?: number;
  isSponsored?: boolean;
  adLabel?: string;
}

interface ProductCardProps {
  product: Product;
  showSeller?: boolean;
  className?: string;
}

export default function ProductCard({ product, showSeller = false, className = '' }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { addItem: addToCompare, isInCompare, removeItem: removeFromCompare } = useCompare();
  const isWishlisted = isInWishlist(product.id);
  const isInCompareList = isInCompare(product.id);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        slug: product.slug,
        image: product.image,
        price: product.price,
        category: product.category,
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0
      });
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompareList) {
      removeFromCompare(product.id);
    } else {
      addToCompare({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        slug: product.slug,
        category: product.category,
        rating: product.rating,
        reviewCount: product.reviewCount
      });
    }
  };

  const discountPercentage = product.listPrice && product.listPrice > product.price 
    ? Math.round(((product.listPrice - product.price) / product.listPrice) * 100)
    : 0;

  const getBadgeInfo = (badge: string) => {
    const badges = {
      'verified': { text: 'Doğrulanmış', color: 'bg-blue-100 text-blue-800', icon: '✓' },
      'top-rated': { text: 'En İyi Satıcı', color: 'bg-yellow-100 text-yellow-800', icon: '⭐' },
      'fast-shipping': { text: 'Hızlı Kargo', color: 'bg-green-100 text-green-800', icon: '🚚' },
      'new-seller': { text: 'Yeni Satıcı', color: 'bg-purple-100 text-purple-800', icon: '🆕' }
    };
    return badges[badge as keyof typeof badges] || { text: badge, color: 'bg-gray-100 text-gray-800', icon: '🏷️' };
  };

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

            {/* Sponsored Badge */}
            {product.isSponsored && (
              <div className="absolute bottom-3 left-3 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                {product.adLabel || 'Sponsorlu'}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              {/* Wishlist Button */}
              <motion.button
                onClick={handleWishlistToggle}
                className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300"
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

              {/* Compare Button */}
              <motion.button
                onClick={handleCompareToggle}
                className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg 
                  className={`w-4 h-4 transition-colors duration-300 ${
                    isInCompareList ? 'text-indigo-500 fill-current' : 'text-gray-400'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </motion.button>
            </div>

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
              <div className="mb-3">
                <div className="flex items-center space-x-2 mb-2">
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
                
                {/* Seller Badges */}
                {product.seller.badges && product.seller.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.seller.badges.slice(0, 3).map((badge, index) => {
                      const badgeInfo = getBadgeInfo(badge);
                      return (
                        <span
                          key={index}
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${badgeInfo.color}`}
                        >
                          <span>{badgeInfo.icon}</span>
                          <span>{badgeInfo.text}</span>
                        </span>
                      );
                    })}
                    {product.seller.badges.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        +{product.seller.badges.length - 3}
                      </span>
                    )}
                  </div>
                )}
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

            {/* Quick Buy with Cart Buttons */}
            <QuickBuyWithCart
              product={{
                id: product.id,
                name: product.title,
                price: product.price,
                image: product.image,
                stock: product.stock,
                sellerId: product.seller?.name || 'unknown',
                sellerName: product.seller?.name || 'TDC Market',
              }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
