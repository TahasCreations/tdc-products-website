'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function ProductManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const router = useRouter();

  useEffect(() => {
    const adminAuth = document.cookie.includes('adminAuth=true');
    if (adminAuth) {
      setIsAuthenticated(true);
      setIsLoading(false);
      
      // Mock product data
      setProducts([
        {
          id: 'P001',
          name: 'Premium Dragon Figür',
          category: 'Fantasy',
          variants: [
            { id: 'V001', name: 'Kırmızı Dragon', price: 299, stock: 15, sku: 'DRG-RED-001' },
            { id: 'V002', name: 'Mavi Dragon', price: 299, stock: 8, sku: 'DRG-BLU-001' },
            { id: 'V003', name: 'Altın Dragon', price: 399, stock: 3, sku: 'DRG-GLD-001' }
          ],
          totalStock: 26,
          totalRevenue: 7485,
          status: 'active',
          images: ['/images/dragon-1.jpg', '/images/dragon-2.jpg'],
          description: 'El yapımı premium dragon figürü',
          tags: ['fantasy', 'dragon', 'premium', 'handmade']
        },
        {
          id: 'P002',
          name: 'Anime Character Collection',
          category: 'Anime',
          variants: [
            { id: 'V004', name: 'Naruto Uzumaki', price: 199, stock: 25, sku: 'ANM-NAR-001' },
            { id: 'V005', name: 'Goku', price: 199, stock: 20, sku: 'ANM-GOK-001' },
            { id: 'V006', name: 'Luffy', price: 199, stock: 18, sku: 'ANM-LUF-001' }
          ],
          totalStock: 63,
          totalRevenue: 12537,
          status: 'active',
          images: ['/images/anime-1.jpg', '/images/anime-2.jpg'],
          description: 'Popüler anime karakterleri koleksiyonu',
          tags: ['anime', 'characters', 'collection', 'popular']
        },
        {
          id: 'P003',
          name: 'Limited Edition Warrior',
          category: 'Fantasy',
          variants: [
            { id: 'V007', name: 'Savaşçı - Gümüş', price: 599, stock: 5, sku: 'WAR-SLV-001' },
            { id: 'V008', name: 'Savaşçı - Bronz', price: 499, stock: 8, sku: 'WAR-BRZ-001' }
          ],
          totalStock: 13,
          totalRevenue: 6995,
          status: 'limited',
          images: ['/images/warrior-1.jpg', '/images/warrior-2.jpg'],
          description: 'Sınırlı sayıda üretilen savaşçı figürü',
          tags: ['limited', 'warrior', 'exclusive', 'collectible']
        }
      ]);
    } else {
      router.push('/admin');
    }
  }, [router]);

  const categories = ['all', 'Fantasy', 'Anime', 'Sci-Fi', 'Historical', 'Animals'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'discontinued': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'limited': return 'Sınırlı';
      case 'out-of-stock': return 'Stokta Yok';
      case 'discontinued': return 'Üretim Durduruldu';
      default: return 'Bilinmiyor';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
            <p className="text-gray-600 mt-1">Gelişmiş ürün ve varyant yönetimi</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ➕ Yeni Ürün
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              📊 Toplu İşlem
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              📤 Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Tüm Kategoriler' : category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="name">İsim</option>
                <option value="price">Fiyat</option>
                <option value="stock">Stok</option>
                <option value="revenue">Gelir</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                🔍 Filtrele
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="h-48 bg-gradient-to-br from-indigo-100 to-coral-100 flex items-center justify-center">
                <span className="text-6xl">🎭</span>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                    {getStatusText(product.status)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                {/* Variants */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium text-gray-900">Varyantlar ({product.variants.length})</h4>
                  <div className="space-y-1">
                    {product.variants.slice(0, 2).map((variant, variantIndex) => (
                      <div key={variantIndex} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{variant.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">₺{variant.price}</span>
                          <span className="text-gray-500">({variant.stock} adet)</span>
                        </div>
                      </div>
                    ))}
                    {product.variants.length > 2 && (
                      <p className="text-xs text-gray-500">+{product.variants.length - 2} daha fazla</p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Toplam Stok</p>
                    <p className="font-semibold text-gray-900">{product.totalStock}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Toplam Gelir</p>
                    <p className="font-semibold text-gray-900">₺{product.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowModal(true);
                    }}
                    className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    ✏️ Düzenle
                  </button>
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                    👁️
                  </button>
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                    📊
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedProduct(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı</label>
                    <input
                      type="text"
                      defaultValue={selectedProduct?.name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="Fantasy">Fantasy</option>
                      <option value="Anime">Anime</option>
                      <option value="Sci-Fi">Sci-Fi</option>
                      <option value="Historical">Historical</option>
                      <option value="Animals">Animals</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    rows={3}
                    defaultValue={selectedProduct?.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Etiketler</label>
                  <input
                    type="text"
                    placeholder="etiket1, etiket2, etiket3"
                    defaultValue={selectedProduct?.tags?.join(', ') || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedProduct(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {selectedProduct ? 'Güncelle' : 'Oluştur'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </ModernAdminLayout>
  );
}
