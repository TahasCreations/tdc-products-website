"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Sparkles, TrendingDown } from 'lucide-react';
import Image from 'next/image';

interface BundleProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  products: BundleProduct[];
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  discount: number;
}

const SAMPLE_BUNDLES: Bundle[] = [
  {
    id: '1',
    name: 'Anime Koleksiyon Seti',
    description: '3 popüler anime figürü bir arada',
    products: [
      { id: '1', name: 'Naruto Figür', price: 250, image: '/images/sample-1.jpg' },
      { id: '2', name: 'One Piece Figür', price: 280, image: '/images/sample-2.jpg' },
      { id: '3', name: 'Dragon Ball Figür', price: 270, image: '/images/sample-3.jpg' },
    ],
    originalPrice: 800,
    bundlePrice: 650,
    savings: 150,
    discount: 19,
  },
  {
    id: '2',
    name: 'Başlangıç Paketi',
    description: 'Yeni koleksiyoncular için ideal',
    products: [
      { id: '4', name: 'Mini Figür Set', price: 150, image: '/images/sample-4.jpg' },
      { id: '5', name: 'Display Stand', price: 80, image: '/images/sample-5.jpg' },
    ],
    originalPrice: 230,
    bundlePrice: 190,
    savings: 40,
    discount: 17,
  },
];

export default function ProductBundles() {
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);

  const handleAddToCart = (bundle: Bundle) => {
    // Sepete ekleme logic'i
    console.log('Adding bundle to cart:', bundle);
    alert(`${bundle.name} sepete eklendi!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <Package className="w-7 h-7 text-purple-600" />
          <span>Paket Teklifleri</span>
        </h2>
        <div className="flex items-center space-x-2 text-sm text-purple-600 font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Tasarruf Et!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SAMPLE_BUNDLES.map((bundle) => (
          <motion.div
            key={bundle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all relative overflow-hidden"
          >
            {/* Discount Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
              <TrendingDown className="w-4 h-4" />
              <span>%{bundle.discount} İndirim</span>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {bundle.name}
              </h3>
              <p className="text-gray-600 text-sm">{bundle.description}</p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {bundle.products.map((product) => (
                <div key={product.id} className="text-center">
                  <div className="w-full aspect-square bg-white rounded-xl mb-2 flex items-center justify-center overflow-hidden">
                    <Package className="w-12 h-12 text-gray-300" />
                  </div>
                  <p className="text-xs text-gray-700 font-medium truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">₺{product.price}</p>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Normal Fiyat:</span>
                <span className="text-gray-400 line-through text-sm">
                  ₺{bundle.originalPrice}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-900 font-semibold">Paket Fiyatı:</span>
                <span className="text-2xl font-bold text-purple-600">
                  ₺{bundle.bundlePrice}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-center space-x-2 text-green-600 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>₺{bundle.savings} tasarruf!</span>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => handleAddToCart(bundle)}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Paketi Sepete Ekle</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Frequently Bought Together Component
export function FrequentlyBoughtTogether({ productId }: { productId: string }) {
  const [selectedItems, setSelectedItems] = useState<string[]>([productId]);
  
  const relatedProducts = [
    { id: '1', name: 'Display Stand', price: 80, checked: true },
    { id: '2', name: 'Koruyucu Kılıf', price: 45, checked: false },
    { id: '3', name: 'Temizlik Kiti', price: 35, checked: false },
  ];

  const totalPrice = relatedProducts
    .filter(p => selectedItems.includes(p.id))
    .reduce((sum, p) => sum + p.price, 0);

  const toggleProduct = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Sıklıkla Birlikte Alınanlar
      </h3>
      
      <div className="space-y-3 mb-4">
        {relatedProducts.map((product) => (
          <label
            key={product.id}
            className="flex items-center space-x-3 p-3 bg-white rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedItems.includes(product.id)}
              onChange={() => toggleProduct(product.id)}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{product.name}</p>
            </div>
            <p className="font-bold text-gray-900">₺{product.price}</p>
          </label>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 bg-white rounded-xl mb-3">
        <span className="font-semibold text-gray-900">
          Toplam ({selectedItems.length} ürün):
        </span>
        <span className="text-2xl font-bold text-blue-600">₺{totalPrice}</span>
      </div>

      <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-xl transition-all">
        Hepsini Sepete Ekle
      </button>
    </div>
  );
}

