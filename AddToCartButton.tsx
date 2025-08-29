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
        <div className="space-y-3">
          {/* Quantity Selector */}
          <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-3 border border-gray-200 dark:border-gray-600">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
            >
              <i className="ri-subtract-line text-gray-600 dark:text-gray-300 text-lg"></i>
            </button>
            <span className="text-lg font-bold text-gray-900 dark:text-white min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
            >
              <i className="ri-add-line text-gray-600 dark:text-gray-300 text-lg"></i>
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Ekleniyor...
                </>
              ) : (
                <>
                  <i className="ri-shopping-cart-line mr-2"></i>
                  Sepete Ekle ({quantity})
                </>
              )}
            </button>
            
            <button
              onClick={() => { setShowQuantity(false); setQuantity(1); }}
              className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={isLoading || isAdded || isInCart}
          className={`w-full inline-flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
            isInCart
              ? 'bg-green-500 text-white cursor-not-allowed opacity-75'
              : isAdded
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
        >
          {isLoading ? (
            <>
              <i className="ri-loader-4-line animate-spin mr-2"></i>
              Ekleniyor...
            </>
          ) : isInCart ? (
            <>
              <i className="ri-check-line mr-2"></i>
              Sepette
            </>
          ) : isAdded ? (
            <>
              <i className="ri-check-line mr-2"></i>
              Eklendi!
            </>
          ) : (
            <>
              <i className="ri-shopping-cart-line mr-2"></i>
              Sepete Ekle
            </>
          )}
        </button>
      )}
    </div>
  );
}
