'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

interface WishlistButtonProps {
  productId: string;
  productTitle: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'card';
  className?: string;
}

export default function WishlistButton({ 
  productId, 
  productTitle, 
  size = 'md', 
  variant = 'icon',
  className = '' 
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isWishlisted = isInWishlist(productId);

  const handleWishlistToggle = async () => {
    if (!user) {
      alert('Favorilerinize ürün eklemek için giriş yapmanız gerekiyor!');
      return;
    }

    setIsLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoubleClick = () => {
    if (user) {
      router.push('/wishlist');
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-sm';
      case 'lg':
        return 'w-12 h-12 text-lg';
      default:
        return 'w-10 h-10 text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'button':
        return 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-red-500';
      case 'card':
        return 'bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-600 hover:text-red-500';
      default:
        return 'bg-white/80 hover:bg-white backdrop-blur-sm border border-white/20 hover:border-red-200 text-gray-700 hover:text-red-500';
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleWishlistToggle}
        onDoubleClick={handleDoubleClick}
        disabled={isLoading}
        className={`
          ${getSizeClasses()}
          ${getVariantClasses()}
          rounded-full shadow-lg hover:shadow-xl
          transition-all duration-300 ease-in-out
          flex items-center justify-center
          group relative
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
          ${className}
        `}
        title={isWishlisted ? 'Favorilerden çıkar (çift tık: favorilerim)' : 'Favorilere ekle (çift tık: favorilerim)'}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-red-500" />
        ) : (
          <i className={`ri-heart-${isWishlisted ? 'fill text-red-500' : 'line'} transition-colors duration-300`} />
        )}
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
          {isWishlisted ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          <br />
          <span className="text-gray-300">Çift tık: Favorilerim</span>
        </div>
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleWishlistToggle}
        disabled={isLoading}
        className={`
          ${getVariantClasses()}
          px-4 py-2 rounded-lg font-medium
          transition-all duration-300 ease-in-out
          flex items-center space-x-2
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          ${className}
        `}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-red-500" />
        ) : (
          <i className={`ri-heart-${isWishlisted ? 'fill text-red-500' : 'line'} transition-colors duration-300`} />
        )}
        <span className="transition-colors duration-300">
          {isWishlisted ? 'Wishlist\'ten Çıkar' : 'Wishlist\'e Ekle'}
        </span>
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <button
        onClick={handleWishlistToggle}
        disabled={isLoading}
        className={`
          ${getVariantClasses()}
          px-3 py-2 rounded-lg text-sm font-medium
          transition-all duration-300 ease-in-out
          flex items-center space-x-2 w-full justify-center
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          ${className}
        `}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-red-500" />
        ) : (
          <i className={`ri-heart-${isWishlisted ? 'fill text-red-500' : 'line'} transition-colors duration-300`} />
        )}
        <span className="transition-colors duration-300">
          {isWishlisted ? 'Wishlist\'ten Çıkar' : 'Wishlist\'e Ekle'}
        </span>
      </button>
    );
  }

  return null;
}



