'use client';

import { useState } from 'react';
import AddToCartButton from './AddToCartButton';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  description: string;
  slug: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'anime':
        return 'bg-pink-100 text-pink-800';
      case 'gaming':
      case 'oyun':
        return 'bg-blue-100 text-blue-800';
      case 'film':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
            <i className="ri-image-line text-4xl text-orange-400"></i>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(product.category)}`}>
            {product.category}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            product.stock > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `${product.stock} adet` : 'Stokta yok'}
          </span>
        </div>

        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-2">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-orange-600 transition-colors duration-300">
              <i className="ri-heart-line"></i>
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-orange-600 transition-colors duration-300">
              <i className="ri-eye-line"></i>
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-orange-600 transition-colors duration-300">
              <i className="ri-share-line"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.stock > 0 && (
              <span className="text-xs text-green-600 font-medium">
                Stokta
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {product.stock > 0 ? (
              <AddToCartButton product={product} />
            ) : (
              <button 
                disabled
                className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
              >
                Stokta Yok
              </button>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>SKU: {product.id}</span>
            <span>Kategori: {product.category}</span>
          </div>
        </div>

        {/* View Details Button */}
        <div className="mt-4">
          <a
            href={`/products/${product.slug}`}
            className="block w-full text-center bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-orange-500 hover:text-white transition-colors duration-300"
          >
            Detayları Gör
          </a>
        </div>
      </div>
    </div>
  );
}
