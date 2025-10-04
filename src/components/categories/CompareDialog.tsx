'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  specifications: Record<string, string>;
  features: string[];
  pros: string[];
  cons: string[];
}

interface CompareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  maxProducts?: number;
}

export default function CompareDialog({ 
  isOpen, 
  onClose, 
  products, 
  maxProducts = 3 
}: CompareDialogProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(products.slice(0, maxProducts));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const toggleProduct = (product: Product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else if (selectedProducts.length < maxProducts) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const getSpecValue = (spec: string) => {
    const values = selectedProducts.map(p => p.specifications[spec] || 'N/A');
    const uniqueValues = [...new Set(values)];
    return uniqueValues.length === 1 ? values[0] : 'Farklı';
  };

  const getBestValue = (spec: string, higherIsBetter = true) => {
    if (selectedProducts.length < 2) return null;
    
    const values = selectedProducts.map(p => {
      const value = p.specifications[spec];
      if (!value || value === 'N/A') return null;
      
      // Try to extract numeric value
      const numeric = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
      return isNaN(numeric) ? null : { product: p, value: numeric };
    }).filter(Boolean);

    if (values.length === 0) return null;

    const best = values.reduce((best, current) => 
      higherIsBetter ? 
        (current.value > best.value ? current : best) :
        (current.value < best.value ? current : best)
    );

    return best.product.id;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ürün Karşılaştırması</h2>
              <p className="text-gray-600 mt-1">
                {selectedProducts.length} ürün karşılaştırılıyor
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close dialog"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {selectedProducts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Karşılaştırılacak Ürün Yok</h3>
                <p className="text-gray-600 mb-4">Karşılaştırmak için ürün seçin</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => toggleProduct(product)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-left"
                    >
                      <div className="aspect-square relative mb-3">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                        {product.title}
                      </h4>
                      <p className="text-indigo-600 font-semibold text-sm">
                        {formatPrice(product.price)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Product Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ürün Seçimi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => {
                      const isSelected = selectedProducts.find(p => p.id === product.id);
                      const canSelect = isSelected || selectedProducts.length < maxProducts;
                      
                      return (
                        <button
                          key={product.id}
                          onClick={() => canSelect && toggleProduct(product)}
                          disabled={!canSelect}
                          className={`p-4 border rounded-lg transition-all text-left ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50'
                              : canSelect
                              ? 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                              : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="aspect-square relative mb-3">
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-cover rounded-lg"
                            />
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                            {product.title}
                          </h4>
                          <p className="text-indigo-600 font-semibold text-sm">
                            {formatPrice(product.price)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comparison Table */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Karşılaştırma Tablosu</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Özellik</th>
                          {selectedProducts.map((product) => (
                            <th key={product.id} className="text-center py-3 px-4 font-semibold text-gray-900 min-w-[200px]">
                              <div className="aspect-square relative w-16 h-16 mx-auto mb-2">
                                <Image
                                  src={product.image}
                                  alt={product.title}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>
                              <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                {product.title}
                              </div>
                              <div className="text-indigo-600 font-semibold text-sm mt-1">
                                {formatPrice(product.price)}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {/* Basic Info */}
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium text-gray-700">Değerlendirme</td>
                          {selectedProducts.map((product) => (
                            <td key={product.id} className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <div className="text-sm text-gray-600">{product.rating} ({product.reviewCount})</div>
                            </td>
                          ))}
                        </tr>

                        {/* Specifications */}
                        {Object.keys(selectedProducts[0]?.specifications || {}).map((spec) => {
                          const bestValue = getBestValue(spec);
                          return (
                            <tr key={spec} className="border-b border-gray-100">
                              <td className="py-3 px-4 font-medium text-gray-700">{spec}</td>
                              {selectedProducts.map((product) => {
                                const value = product.specifications[spec] || 'N/A';
                                const isBest = bestValue === product.id;
                                
                                return (
                                  <td key={product.id} className={`py-3 px-4 text-center ${
                                    isBest ? 'bg-green-50' : ''
                                  }`}>
                                    <span className={`text-sm ${isBest ? 'text-green-700 font-semibold' : 'text-gray-900'}`}>
                                      {value}
                                    </span>
                                    {isBest && (
                                      <div className="text-xs text-green-600 mt-1">✓ En İyi</div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Tümünü Sepete Ekle
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Favorilere Ekle
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
