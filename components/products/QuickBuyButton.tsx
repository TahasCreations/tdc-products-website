"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Check, Loader2, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/Toast';

interface QuickBuyButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    sellerId?: string;
    sellerName?: string;
  };
  className?: string;
}

export default function QuickBuyButton({ product, className = '' }: QuickBuyButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { addItem } = useCart();
  const toast = useToast();

  const handleQuickBuy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) {
      toast.error('Ürün stokta yok');
      return;
    }

    setIsProcessing(true);

    try {
      // Sepete ekle
      addItem({
        id: product.id,
        title: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        sellerId: product.sellerId || 'default',
        sellerName: product.sellerName || 'TDC Market',
        maxStock: product.stock,
      });

      // Kısa bir başarı gösterimi
      await new Promise(resolve => setTimeout(resolve, 500));

      // Direkt checkout'a yönlendir
      router.push('/checkout');
    } catch (error) {
      toast.error('Bir hata oluştu');
      setIsProcessing(false);
    }
  };

  return (
    <motion.button
      onClick={handleQuickBuy}
      disabled={isProcessing || product.stock === 0}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden group
        ${className}
        ${product.stock === 0 
          ? 'bg-gray-300 cursor-not-allowed' 
          : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600'
        }
        text-white font-bold py-3 px-6 rounded-xl
        shadow-lg hover:shadow-xl
        transition-all duration-300
        flex items-center justify-center space-x-2
      `}
    >
      {/* Shimmer Effect */}
      {!isProcessing && product.stock > 0 && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}

      {/* Button Content */}
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-2"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Yönlendiriliyor...</span>
          </motion.div>
        ) : product.stock === 0 ? (
          <span>Stokta Yok</span>
        ) : (
          <motion.div
            key="buy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-2"
          >
            <Zap className="w-5 h-5" />
            <span>Hızlı Satın Al</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Alternatif: Sepet + Hızlı Satın Al İkili Buton
export function QuickBuyWithCart({ product }: QuickBuyButtonProps) {
  const { addItem } = useCart();
  const toast = useToast();
  const router = useRouter();
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAddingToCart(true);
    addItem({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      sellerId: product.sellerId || 'default',
      sellerName: product.sellerName || 'TDC Market',
      maxStock: product.stock,
    });

    toast.success('Sepete eklendi! 🎉');
    
    setTimeout(() => setAddingToCart(false), 1000);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      sellerId: product.sellerId || 'default',
      sellerName: product.sellerName || 'TDC Market',
      maxStock: product.stock,
    });

    router.push('/checkout');
  };

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full py-3 bg-gray-300 text-white rounded-xl font-semibold cursor-not-allowed"
      >
        Stokta Yok
      </button>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-2">
      {/* Sepete Ekle */}
      <button
        onClick={handleAddToCart}
        disabled={addingToCart}
        className="col-span-2 py-3 bg-white border-2 border-[#CBA135] text-[#CBA135] rounded-xl hover:bg-[#CBA135] hover:text-white transition-all font-semibold flex items-center justify-center space-x-1"
      >
        {addingToCart ? (
          <Check className="w-5 h-5" />
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm">Sepet</span>
          </>
        )}
      </button>

      {/* Hızlı Satın Al */}
      <button
        onClick={handleQuickBuy}
        className="col-span-3 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl hover:from-orange-600 hover:to-pink-700 transition-all font-bold flex items-center justify-center space-x-2 shadow-lg"
      >
        <Zap className="w-4 h-4" />
        <span className="text-sm">Hızlı Al</span>
      </button>
    </div>
  );
}


