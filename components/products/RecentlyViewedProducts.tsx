"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, X, ShoppingBag, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  viewedAt: number;
}

export default function RecentlyViewedProducts() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      try {
        const products = JSON.parse(stored);
        setRecentProducts(products.slice(0, 6)); // Max 6 ürün
      } catch (error) {
        console.error('Failed to load recently viewed:', error);
      }
    }
  }, []);

  // Ürün görüntülendiğinde kaydet
  const addToRecentlyViewed = (product: Omit<Product, 'viewedAt'>) => {
    const stored = localStorage.getItem('recentlyViewed');
    let products: Product[] = stored ? JSON.parse(stored) : [];
    
    // Aynı ürünü kaldır (tekrar ekleneceği için)
    products = products.filter(p => p.id !== product.id);
    
    // En başa ekle
    products.unshift({
      ...product,
      viewedAt: Date.now(),
    });
    
    // Max 12 ürün tut
    products = products.slice(0, 12);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(products));
    setRecentProducts(products.slice(0, 6));
  };

  // Hook olarak export et
  if (typeof window !== 'undefined') {
    (window as any).addToRecentlyViewed = addToRecentlyViewed;
  }

  if (!isVisible || recentProducts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-12 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Son Baktığınız Ürünler</h2>
              <p className="text-sm text-gray-600">Daha önce görüntülediğiniz ürünler</p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {recentProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/products/${product.slug}`}
                className="block group"
              >
                <div className="bg-white rounded-xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all overflow-hidden">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingBag className="w-12 h-12" />
                      </div>
                    )}
                    
                    {/* View Badge */}
                    <div className="absolute top-2 left-2">
                      <div className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-semibold flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>Baktınız</span>
                      </div>
                    </div>

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white px-4 py-2 rounded-lg text-sm font-semibold text-gray-900">
                        Tekrar İncele
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
                      {product.name}
                    </p>
                    
                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center space-x-1 mb-2">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold text-gray-700">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <p className="text-lg font-bold text-[#CBA135]">
                      ₺{product.price.toFixed(2)}
                    </p>

                    {/* Quick Add Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // Add to cart logic
                      }}
                      className="mt-2 w-full py-2 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-all font-medium"
                    >
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Clear History */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              localStorage.removeItem('recentlyViewed');
              setRecentProducts([]);
              setIsVisible(false);
            }}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Geçmişi Temizle
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Helper function to track product views
export const trackProductView = (product: {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
}) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('recentlyViewed');
    let products: Product[] = stored ? JSON.parse(stored) : [];
    
    // Remove duplicate
    products = products.filter(p => p.id !== product.id);
    
    // Add to beginning
    products.unshift({
      ...product,
      viewedAt: Date.now(),
    });
    
    // Keep max 12
    products = products.slice(0, 12);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(products));
  }
};


