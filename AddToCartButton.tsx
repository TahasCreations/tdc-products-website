'use client';

import { useState } from 'react';
import { useCart } from './src/contexts/CartContext';
import { useToast } from './src/components/Toast';

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
  const [showQuantity, setShowQuantity] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem, state } = useCart();
  const { addToast } = useToast();

  // Ürünün sepette olup olmadığını kontrol et
  const cartItem = state.items.find(item => item.id === product.id);
  const isInCart = !!cartItem;

  const handleAddToCart = async () => {
    if (!showQuantity) {
      setShowQuantity(true);
      return;
    }

    setIsLoading(true);
    
    try {
      // Sepete ürün ekle
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        slug: product.slug
      }, quantity);

      setIsAdded(true);
      setShowQuantity(false);
      setQuantity(1);
      
      // Toast notification göster
      addToast({
        type: 'success',
        title: 'Ürün sepete eklendi!',
        message: `${product.title} (${quantity} adet) başarıyla sepete eklendi.`,
        duration: 3000
      });
      
      // 3 saniye sonra durumu sıfırla
      setTimeout(() => {
        setIsAdded(false);
      }, 3000);
    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
      addToast({
        type: 'error',
        title: 'Hata!',
        message: 'Ürün sepete eklenirken bir hata oluştu.',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {showQuantity && !isInCart && !isAdded ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <i className="ri-subtract-line text-gray-600 dark:text-gray-300"></i>
            </button>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <i className="ri-add-line text-gray-600 dark:text-gray-300"></i>
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-600 dark:hover:bg-orange-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Ekleniyor...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <i className="ri-shopping-cart-line mr-2"></i>
                  Ekle ({quantity})
                </div>
              )}
            </button>
            <button
              onClick={() => {
                setShowQuantity(false);
                setQuantity(1);
              }}
              className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-600 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={isLoading || isAdded || isInCart}
          className={`w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
            isInCart
              ? 'bg-green-500 dark:bg-green-600 text-white cursor-not-allowed'
              : isAdded
              ? 'bg-green-500 dark:bg-green-600 text-white cursor-not-allowed'
              : isLoading
              ? 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
              : 'bg-orange-500 dark:bg-orange-600 text-white hover:bg-orange-600 dark:hover:bg-orange-700 hover:scale-105'
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
      )}
    </div>
  );
}
