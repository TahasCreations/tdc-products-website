'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import { useState } from 'react';
import InteractiveButton from './InteractiveButton';
import { ImageGallery } from './OptimizedImage';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating?: number;
  reviews?: number;
  description?: string;
  inStock?: boolean;
  seller?: string;
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-2 gap-8 p-8 overflow-y-auto max-h-[90vh]">
                {/* Left: Images */}
                <div>
                  <ImageGallery images={product.images} alt={product.name} />
                </div>

                {/* Right: Details */}
                <div className="space-y-6">
                  {/* Title & Rating */}
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {product.name}
                    </h2>
                    {product.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating!)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {product.rating} ({product.reviews || 0} değerlendirme)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-[#CBA135]">
                      ₺{product.price.toLocaleString('tr-TR')}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          ₺{product.originalPrice.toLocaleString('tr-TR')}
                        </span>
                        <span className="px-2 py-1 bg-red-500 text-white text-sm font-bold rounded-lg">
                          %{discount} İNDİRİM
                        </span>
                      </>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inStock ? 'Stokta var' : 'Stokta yok'}
                    </span>
                  </div>

                  {/* Description */}
                  {product.description && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                        Ürün Açıklaması
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {/* Seller */}
                  {product.seller && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Satıcı:
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.seller}
                      </span>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Adet
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <InteractiveButton
                      variant="primary"
                      size="lg"
                      icon={<ShoppingCart className="w-5 h-5" />}
                      className="w-full"
                      disabled={!product.inStock}
                    >
                      Sepete Ekle
                    </InteractiveButton>

                    <div className="grid grid-cols-2 gap-3">
                      <InteractiveButton
                        variant="secondary"
                        icon={<Heart className="w-5 h-5" />}
                      >
                        Favorilere Ekle
                      </InteractiveButton>
                      <InteractiveButton
                        variant="secondary"
                        icon={<Share2 className="w-5 h-5" />}
                      >
                        Paylaş
                      </InteractiveButton>
                    </div>
                  </div>

                  {/* View Full Details */}
                  <button
                    onClick={onClose}
                    className="w-full text-center text-sm text-[#CBA135] hover:text-[#F4D03F] font-medium transition-colors"
                  >
                    Tüm detayları görüntüle →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
