"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, BarChart3, Share2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCompare } from '@/contexts/CompareContext';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  stock: number;
}

interface ProductActionsProps {
  product: Product;
  selectedVariant?: {
    id: string;
    name: string;
    price: number;
    stock: number;
  };
}

export default function ProductActions({ product, selectedVariant }: ProductActionsProps) {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { addItem: addToCompare, removeItem: removeFromCompare, isInCompare } = useCompare();
  
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isAddingToCompare, setIsAddingToCompare] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const isInCompareList = isInCompare(product.id);
  
  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock || product.stock;

  const handleAddToCart = async () => {
    if (currentStock === 0) return;
    
    setIsAddingToCart(true);
    
    try {
      // Sepete quantity kadar ekle
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          title: product.title,
          price: currentPrice,
          image: product.image,
          sellerId: 'unknown', // TODO: Get from product data
          sellerName: 'Bilinmiyor',
          maxStock: currentStock,
        });
      }
      
      // Success feedback
      setTimeout(() => setIsAddingToCart(false), 1000);
    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    setIsAddingToWishlist(true);
    
    try {
      if (isWishlisted) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist({
          id: product.id,
          title: product.title,
          slug: product.slug,
          image: product.image,
          price: currentPrice,
          category: product.category,
          rating: 0, // TODO: Get from product data
          reviewCount: 0, // TODO: Get from product data
        });
      }
      
      setTimeout(() => setIsAddingToWishlist(false), 500);
    } catch (error) {
      console.error('Wishlist hatası:', error);
      setIsAddingToWishlist(false);
    }
  };

  const handleCompareToggle = async () => {
    setIsAddingToCompare(true);
    
    try {
      if (isInCompareList) {
        removeFromCompare(product.id);
      } else {
        addToCompare({
          id: product.id,
          title: product.title,
          price: currentPrice,
          image: product.image,
          slug: product.slug,
          category: product.category,
          rating: 0, // TODO: Get from product data
          reviewCount: 0, // TODO: Get from product data
        });
      }
      
      setTimeout(() => setIsAddingToCompare(false), 500);
    } catch (error) {
      console.error('Karşılaştırma hatası:', error);
      setIsAddingToCompare(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `${product.title} - TDC Market'te keşfedin!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Paylaşım iptal edildi');
      }
    } else {
      // Fallback: URL'yi kopyala
      navigator.clipboard.writeText(window.location.href);
      alert('Ürün linki kopyalandı!');
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-3">
        <label className="text-sm font-medium text-gray-700">Adet:</label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            −
          </button>
          <span className="px-4 py-2 min-w-[60px] text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            disabled={quantity >= currentStock}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      {currentStock > 0 ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full bg-[#CBA135] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#B8941F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAddingToCart ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Ekleniyor...
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Sepete Ekle
            </>
          )}
        </motion.button>
      ) : (
        <button className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-medium cursor-not-allowed">
          Stokta Yok
        </button>
      )}
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleWishlistToggle}
          disabled={isAddingToWishlist}
          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 ${
            isWishlisted
              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isAddingToWishlist ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : (
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          )}
          {isWishlisted ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCompareToggle}
          disabled={isAddingToCompare}
          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 ${
            isInCompareList
              ? 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isAddingToCompare ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          ) : (
            <BarChart3 className="w-4 h-4" />
          )}
          {isInCompareList ? 'Karşılaştırmadan Çıkar' : 'Karşılaştır'}
        </motion.button>
      </div>

      {/* Share Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleShare}
        className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Paylaş
      </motion.button>
    </div>
  );
}
