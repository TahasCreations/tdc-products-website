'use client';

import React, { useState, useMemo } from 'react';
import { mockProducts, categories, brands, Product } from '@/data/mock-products';
import AiSuggestionButtons from '@/components/ai/AiSuggestionButtons';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;
      
      return matchesSearch && matchesCategory && matchesBrand;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedBrand, sortBy, sortOrder]);

  const handlePriceUpdate = (productId: string, newPrice: number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, price: newPrice, updatedAt: new Date().toISOString() }
        : product
    ));
  };

  const handleTagsUpdate = (productId: string, newTags: string[]) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, tags: newTags, updatedAt: new Date().toISOString() }
        : product
    ));
  };

  const handleSeoUpdate = (productId: string, newTitle: string, newDescription: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { 
            ...product, 
            title: newTitle, 
            description: newDescription, 
            updatedAt: new Date().toISOString() 
          }
        : product
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-red-100 text-red-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Aktif';
      case 'INACTIVE': return 'Pasif';
      case 'DRAFT': return 'Taslak';
      default: return status;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ürün Yönetimi</h1>
        <p className="text-gray-600">Ürünlerinizi yönetin ve AI önerilerini kullanın</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ürün adı veya açıklama..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marka</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tüm Markalar</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.name}>
                  {brand.name} ({brand.count})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama</label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">İsim</option>
                <option value="price">Fiyat</option>
                <option value="createdAt">Tarih</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {product.description}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                  {getStatusText(product.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Kategori:</span>
                  <div className="text-gray-600">{categories.find(c => c.id === product.category)?.name}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Marka:</span>
                  <div className="text-gray-600">{product.brand || 'Belirtilmemiş'}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Fiyat:</span>
                  <div className="text-gray-600">
                    {product.price ? `₺${product.price.toLocaleString()}` : 'Belirtilmemiş'}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Maliyet:</span>
                  <div className="text-gray-600">
                    {product.cost ? `₺${product.cost.toLocaleString()}` : 'Belirtilmemiş'}
                  </div>
                </div>
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="mb-4">
                  <span className="font-medium text-gray-700 text-sm">Taglar:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {product.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{product.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 mb-4">
                Güncellendi: {new Date(product.updatedAt).toLocaleDateString('tr-TR')}
              </div>

              {/* AI Suggestion Buttons */}
              <AiSuggestionButtons
                product={product}
                onPriceUpdate={(price) => handlePriceUpdate(product.id, price)}
                onTagsUpdate={(tags) => handleTagsUpdate(product.id, tags)}
                onSeoUpdate={(title, description) => handleSeoUpdate(product.id, title, description)}
                competitorPrices={[product.price! * 0.9, product.price! * 1.1, product.price! * 1.05]}
              />
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Ürün bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            Arama kriterlerinize uygun ürün bulunamadı.
          </p>
        </div>
      )}

      {/* Results Summary */}
      <div className="mt-6 text-sm text-gray-600">
        {filteredProducts.length} ürün gösteriliyor
        {searchTerm && ` (${searchTerm} için arama)`}
        {selectedCategory && ` (${categories.find(c => c.id === selectedCategory)?.name} kategorisi)`}
        {selectedBrand && ` (${selectedBrand} markası)`}
      </div>
    </div>
  );
}

