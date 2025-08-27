'use client';

import { useState } from 'react';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
}

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    
    // Simüle edilmiş sepete ekleme işlemi
    setTimeout(() => {
      setIsLoading(false);
      setIsAdded(true);
      
      // 3 saniye sonra durumu sıfırla
      setTimeout(() => {
        setIsAdded(false);
      }, 3000);
    }, 1000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading || isAdded}
      className={`w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
        isAdded
          ? 'bg-green-500 text-white cursor-not-allowed'
          : isLoading
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105'
      }`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <i className="ri-loader-4-line animate-spin mr-2"></i>
          Ekleniyor...
        </div>
      ) : isAdded ? (
        <div className="flex items-center justify-center">
          <i className="ri-check-line mr-2"></i>
          Sepete Eklendi!
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <i className="ri-shopping-cart-line mr-2"></i>
          Sepete Ekle
        </div>
      )}
    </button>
  );
}
