'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface StickyMobileCartProps {
  product: {
    id: string;
    title: string;
    price: number;
    stock: number;
  };
  onAddToCart?: () => void;
  onBuyNow?: () => void;
}

export default function StickyMobileCart({ product, onAddToCart, onBuyNow }: StickyMobileCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky cart after scrolling 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart();
    } else {
      toast.success(`${product.title} sepete eklendi! 🎉`);
    }
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow();
    } else {
      window.location.href = `/checkout?product=${product.id}`;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-gray-600 line-clamp-1">{product.title}</div>
              <div className="text-xl font-bold text-indigo-600">
                {product.price.toLocaleString('tr-TR')} ₺
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Sepete Ekle</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>Hemen Al</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

