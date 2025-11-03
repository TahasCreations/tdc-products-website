'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart, Star, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

interface ProductQuickViewProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    listPrice?: number;
    images: string[];
    rating: number;
    reviewCount: number;
    description: string;
    stock: number;
    seller?: {
      name: string;
      slug: string;
      rating: number;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();

  const handleAddToCart = () => {
    // Add to cart logic
    toast.success(`${product.title} sepete eklendi! 🎉`);
    onClose();
  };

  const handleBuyNow = () => {
    // Quick buy logic
    toast.info('Hızlı satın alma için yönlendiriliyorsunuz...');
    setTimeout(() => {
      window.location.href = `/checkout?product=${product.id}&qty=${quantity}`;
    }, 500);
  };

  const discount = product.listPrice 
    ? Math.round(((product.listPrice - product.price) / product.listPrice) * 100)
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Images */}
                <div>
                  {/* Main Image */}
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                    <img
                      src={product.images[selectedImage]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    {discount > 0 && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                        %{discount} İNDİRİM
                      </div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index ? 'border-indigo-600' : 'border-transparent'
                        }`}
                      >
                        <img src={image} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h2>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviewCount} değerlendirme)
                    </span>
                  </div>

                  {/* Seller */}
                  {product.seller && (
                    <Link
                      href={`/sellers/${product.seller.slug}`}
                      className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors mb-4"
                    >
                      <span className="text-sm font-medium">🏪 {product.seller.name}</span>
                      <span className="text-xs">⭐ {product.seller.rating.toFixed(1)}</span>
                    </Link>
                  )}

                  {/* Price */}
                  <div className="mb-6">
                    {product.listPrice && (
                      <div className="text-lg text-gray-500 line-through">
                        {product.listPrice.toLocaleString('tr-TR')} ₺
                      </div>
                    )}
                    <div className="text-3xl font-bold text-indigo-600">
                      {product.price.toLocaleString('tr-TR')} ₺
                    </div>
                    {discount > 0 && (
                      <div className="text-sm text-green-600 font-medium">
                        {(product.listPrice! - product.price).toLocaleString('tr-TR')} ₺ tasarruf
                      </div>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="mb-6">
                    {product.stock > 0 ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700 font-medium">
                          Stokta ({product.stock} adet)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-red-700 font-medium">Stokta yok</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-6 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Quantity */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adet</label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-bold"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={handleBuyNow}
                      disabled={product.stock === 0}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <Zap className="w-5 h-5" />
                      <span>Hemen Al</span>
                    </button>

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
                        className="py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
                      >
                        <Heart className="w-5 h-5" />
                        <span>Favorile</span>
                      </button>
                    </div>
                  </div>

                  {/* Full Details Link */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="block mt-6 text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Tüm detayları gör →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

