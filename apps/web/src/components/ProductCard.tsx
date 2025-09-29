'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  images: string[];
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
      <Link href={`/products/${product.slug}`}>
        <div className="relative">
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden bg-gray-100">
            {!imageError && product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="text-6xl text-gray-400">
                  🎨
                </div>
              </div>
            )}
            
            {/* Stock Badge */}
            {product.stock <= 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Stokta Yok
              </div>
            )}
            
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 shadow-lg"
            >
              <i className={`ri-heart-${isWishlisted ? 'fill text-red-500' : 'line text-gray-600'} text-lg`}></i>
            </button>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                  <span className="text-gray-800 font-semibold">Detayları Gör</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="p-6">
            <div className="mb-2">
              <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
              {product.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  ₺{product.price.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-sm"></i>
                  ))}
                </div>
                <span className="text-sm text-gray-500">(4.8)</span>
              </div>
            </div>
            
            <button
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              disabled={product.stock <= 0}
            >
              {product.stock <= 0 ? 'Stokta Yok' : 'Sepete Ekle'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
