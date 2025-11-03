'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface StoreData {
  seller: {
    id: string;
    storeSlug: string;
    storeName: string;
    description?: string;
    logoUrl?: string;
    rating: number;
    reviewCount: number;
  };
  products: any[];
  theme?: {
    primaryColor?: string;
    logoUrl?: string;
    heroImageUrls?: string;
  };
}

export default function StoreFrontPage() {
  const params = useParams();
  const router = useRouter();
  const storeSlug = params.storeSlug as string;
  
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStoreData();
  }, [storeSlug]);

  const fetchStoreData = async () => {
    try {
      const response = await fetch(`/api/store/${storeSlug}`);
      const data = await response.json();
      
      if (response.ok) {
        setStoreData(data);
      } else {
        setError('Mağaza bulunamadı');
      }
    } catch (error) {
      console.error('Error fetching store:', error);
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Mağaza yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mağaza Bulunamadı</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-block"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const { seller, products, theme } = storeData;
  const primaryColor = theme?.primaryColor || '#4F46E5';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Header */}
      <header 
        className="bg-white border-b sticky top-0 z-50 shadow-sm"
        style={{ borderBottomColor: primaryColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Store Logo & Name */}
            <div className="flex items-center space-x-4">
              {seller.logoUrl && (
                <img
                  src={seller.logoUrl}
                  alt={seller.storeName}
                  className="w-12 h-12 rounded-full border-2"
                  style={{ borderColor: primaryColor }}
                />
              )}
              <div>
                <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>
                  {seller.storeName}
                </h1>
                {seller.description && (
                  <p className="text-sm text-gray-600">{seller.description}</p>
                )}
              </div>
            </div>

            {/* Store Rating */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="font-bold text-gray-900">{seller.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({seller.reviewCount})</span>
                </div>
                <Link
                  href={`/sellers/${seller.storeSlug}`}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Değerlendirmeleri Gör
                </Link>
              </div>
              
              <Link
                href="/cart"
                className="px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primaryColor }}
              >
                Sepet 🛒
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {theme?.heroImageUrls && (
        <div className="relative h-64 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative h-full flex items-center justify-center text-center text-white">
            <div>
              <h2 className="text-4xl font-bold mb-2">{seller.storeName}</h2>
              {seller.description && (
                <p className="text-xl opacity-90">{seller.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Ürünlerimiz</h2>
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>Tüm Kategoriler</option>
              <option>Figür & Koleksiyon</option>
              <option>Moda & Aksesuar</option>
              <option>Elektronik</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>Sırala: Önerilen</option>
              <option>Fiyat: Düşük - Yüksek</option>
              <option>Fiyat: Yüksek - Düşük</option>
              <option>En Yeni</option>
            </select>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz Ürün Yok</h3>
            <p className="text-gray-600">Bu mağaza yakında ürünlerini ekleyecek</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="aspect-square bg-gray-100">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold" style={{ color: primaryColor }}>
                      {product.price.toLocaleString('tr-TR')} ₺
                    </span>
                    <button
                      className="px-4 py-2 text-sm rounded-lg text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p>© 2024 {seller.storeName}. Tüm hakları saklıdır.</p>
            <p className="mt-2">
              <span className="text-gray-400">Powered by</span>{' '}
              <Link href="/" className="text-indigo-600 hover:underline font-medium">
                TDC Market
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

