'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DigitalProductBadge from '@/components/digital-products/DigitalProductBadge';

interface STLProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  listPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  fileSize: number;
  fileFormat: string;
  licenseType: string;
  seller: {
    name: string;
    slug: string;
    rating: number;
  };
  downloads: number;
  tags: string[];
}

export default function STLCategoryPage() {
  const [products, setProducts] = useState<STLProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedLicense, setSelectedLicense] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
  }, [sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Mock data - gerçekte API'den gelecek
      const mockProducts: STLProduct[] = [
        {
          id: '1',
          title: 'Naruto Uzumaki 3D Model - Tam Detaylı STL',
          slug: 'naruto-uzumaki-stl',
          price: 149.99,
          listPrice: 199.99,
          images: ['https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Naruto+STL'],
          rating: 4.9,
          reviewCount: 234,
          fileSize: 45 * 1024 * 1024, // 45 MB
          fileFormat: 'ZIP',
          licenseType: 'personal',
          seller: {
            name: '3D Models Pro',
            slug: '3d-models-pro',
            rating: 4.8
          },
          downloads: 1240,
          tags: ['anime', 'naruto', 'character', 'detailed']
        },
        // Daha fazla mock ürün eklenebilir
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching STL products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = (bytes / (1024 * 1024)).toFixed(1);
    return `${mb} MB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-5xl">🎨</div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">STL Dosyaları</h1>
              <p className="text-gray-600">3D Print için hazır dijital modeller</p>
            </div>
          </div>

          {/* Category Info */}
          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <div className="text-2xl mb-2">📥</div>
              <div className="text-sm text-gray-600">Anında İndirme</div>
              <div className="text-xs text-gray-500 mt-1">Satın al, hemen indir</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
              <div className="text-2xl mb-2">🖨️</div>
              <div className="text-sm text-gray-600">Print Ready</div>
              <div className="text-xs text-gray-500 mt-1">3D printer'a hazır</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <div className="text-2xl mb-2">📜</div>
              <div className="text-sm text-gray-600">Lisanslı</div>
              <div className="text-xs text-gray-500 mt-1">Kişisel/Ticari seçenekler</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
              <div className="text-2xl mb-2">🚚</div>
              <div className="text-sm text-gray-600">Kargo Yok</div>
              <div className="text-xs text-gray-500 mt-1">Dijital teslimat</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="popular">En Popüler</option>
                <option value="newest">En Yeni</option>
                <option value="price-low">Fiyat: Düşük - Yüksek</option>
                <option value="price-high">Fiyat: Yüksek - Düşük</option>
                <option value="rating">En Yüksek Puan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lisans Tipi</label>
              <select
                value={selectedLicense}
                onChange={(e) => setSelectedLicense(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="all">Tümü</option>
                <option value="personal">Kişisel Kullanım</option>
                <option value="commercial">Ticari Kullanım</option>
                <option value="extended">Genişletilmiş</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dosya Formatı</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                <option value="all">Tümü</option>
                <option value="stl">STL</option>
                <option value="zip">ZIP (Multi-part)</option>
                <option value="obj">OBJ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dosya Boyutu</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                <option value="all">Tümü</option>
                <option value="small">&lt; 10 MB</option>
                <option value="medium">10-50 MB</option>
                <option value="large">&gt; 50 MB</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz STL Dosyası Yok</h3>
            <p className="text-gray-600">Yakında harika 3D modeller eklenecek!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Digital Badge Overlay */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-bold shadow-lg">
                      📥 DIJITAL
                    </span>
                  </div>

                  {/* File Format Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur text-purple-700 rounded-lg text-xs font-bold">
                      {product.fileFormat}
                    </span>
                  </div>

                  {/* Downloads Counter */}
                  <div className="absolute bottom-3 right-3">
                    <span className="px-3 py-1 bg-black/70 backdrop-blur text-white rounded-lg text-xs font-medium">
                      📊 {product.downloads.toLocaleString()} indirme
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Seller */}
                  <Link
                    href={`/sellers/${product.seller.slug}`}
                    className="flex items-center space-x-2 mb-3 hover:opacity-70 transition-opacity"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {product.seller.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{product.seller.name}</span>
                    <span className="text-xs text-yellow-600">⭐ {product.seller.rating.toFixed(1)}</span>
                  </Link>

                  {/* File Info */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div className="bg-gray-50 px-2 py-1 rounded">
                      <span className="text-gray-500">Boyut:</span>
                      <span className="font-semibold text-gray-900 ml-1">{formatFileSize(product.fileSize)}</span>
                    </div>
                    <div className="bg-gray-50 px-2 py-1 rounded">
                      <span className="text-gray-500">Lisans:</span>
                      <span className="font-semibold text-gray-900 ml-1">
                        {product.licenseType === 'personal' ? '👤' : product.licenseType === 'commercial' ? '💼' : '⭐'}
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                          } fill-current`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating.toFixed(1)} ({product.reviewCount})
                    </span>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      {product.listPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {product.listPrice.toLocaleString('tr-TR')} ₺
                        </div>
                      )}
                      <div className="text-2xl font-bold text-purple-600">
                        {product.price.toLocaleString('tr-TR')} ₺
                      </div>
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Satın Al
                    </Link>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {product.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-white rounded-xl shadow-md p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">STL Dosyaları Hakkında</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <span className="text-xl">❓</span>
                <span>STL Dosyası Nedir?</span>
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                STL (Stereolithography) dosyaları, 3D modellerin dijital formatıdır. 
                3D printer'lar bu dosyaları kullanarak fiziksel objeler üretir. 
                Bu kategorideki tüm dosyalar print-ready (baskıya hazır) olarak sunulmaktadır.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <span className="text-xl">📜</span>
                <span>Lisans Tipleri</span>
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600">👤</span>
                  <div>
                    <strong className="text-gray-900">Kişisel:</strong>
                    <span className="text-gray-600"> Hobi amaçlı kullanım</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-purple-600">💼</span>
                  <div>
                    <strong className="text-gray-900">Ticari:</strong>
                    <span className="text-gray-600"> Satış yapabilirsiniz</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-amber-600">⭐</span>
                  <div>
                    <strong className="text-gray-900">Genişletilmiş:</strong>
                    <span className="text-gray-600"> Tüm haklar dahil</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

