'use client';

import { useState } from 'react';
import { useCart } from './src/contexts/CartContext';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  slug?: string;
}

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, state } = useCart();

  // Ürünün sepette olup olmadığını kontrol et
  const cartItem = state.items.find(item => item.id === product.id);
  const isInCart = !!cartItem;

  const handleAddToCart = async () => {
    setIsLoading(true);
    
    try {
      // Sepete ürün ekle
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        slug: product.slug
      });

      setIsAdded(true);
      
      // 3 saniye sonra durumu sıfırla
      setTimeout(() => {
        setIsAdded(false);
      }, 3000);
    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading || isAdded || isInCart}
      className={`w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
        isInCart
          ? 'bg-green-500 text-white cursor-not-allowed'
          : isAdded
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
      ) : isInCart ? (
        <div className="flex items-center justify-center">
          <i className="ri-check-line mr-2"></i>
          Sepette ({cartItem?.quantity})
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
