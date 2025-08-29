'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

interface SearchAndFilterProps {
  categories: Category[];
  totalProducts: number;
  currentFilters: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  };
}

export default function SearchAndFilter({ categories, totalProducts, currentFilters }: SearchAndFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.category || '');
  const [priceRange, setPriceRange] = useState({
    min: currentFilters.minPrice || 0,
    max: currentFilters.maxPrice || 10000
  });
  const [sortBy, setSortBy] = useState(currentFilters.sortBy || 'newest');
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      updateFilters();
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    
    if (selectedCategory) {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    
    if (priceRange.min > 0) {
      params.set('minPrice', priceRange.min.toString());
    } else {
      params.delete('minPrice');
    }
    
    if (priceRange.max < 10000) {
      params.set('maxPrice', priceRange.max.toString());
    } else {
      params.delete('maxPrice');
    }
    
    if (sortBy !== 'newest') {
      params.set('sortBy', sortBy);
    } else {
      params.delete('sortBy');
    }

    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: 0, max: 10000 });
    setSortBy('newest');
    router.push('/products');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ürün ara..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              />
              <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              >
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
                <option value="price-low">Fiyat: Düşükten Yükseğe</option>
                <option value="price-high">Fiyat: Yüksekten Düşüğe</option>
                <option value="name-asc">İsim: A-Z</option>
                <option value="name-desc">İsim: Z-A</option>
              </select>
              <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>

            {/* Expand/Collapse Filters */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <i className={`ri-filter-${isExpanded ? 'off' : 'line'} text-lg`}></i>
              <span className="hidden sm:inline">Filtreler</span>
            </button>

            {/* Clear All */}
            {(searchTerm || selectedCategory || priceRange.min > 0 || priceRange.max < 10000 || sortBy !== 'newest') && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <i className="ri-close-line text-lg"></i>
                <span className="hidden sm:inline">Temizle</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {totalProducts} ürün bulundu
          </p>
          {Object.values(currentFilters).some(Boolean) && (
            <div className="flex flex-wrap gap-2">
              {currentFilters.search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Arama: {currentFilters.search}
                  <button onClick={() => setSearchTerm('')} className="hover:text-blue-600">
                    <i className="ri-close-line text-xs"></i>
                  </button>
                </span>
              )}
              {currentFilters.category && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Kategori: {currentFilters.category}
                  <button onClick={() => setSelectedCategory('')} className="hover:text-green-600">
                    <i className="ri-close-line text-xs"></i>
                  </button>
                </span>
              )}
              {(currentFilters.minPrice || currentFilters.maxPrice) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Fiyat: {formatPrice(currentFilters.minPrice || 0)} - {formatPrice(currentFilters.maxPrice || 10000)}
                  <button onClick={() => setPriceRange({ min: 0, max: 10000 })} className="hover:text-purple-600">
                    <i className="ri-close-line text-xs"></i>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="border-t border-gray-200 pt-6 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Kategoriler</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    !selectedCategory
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tümü
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category.name
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Fiyat Aralığı</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Minimum Fiyat</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      min="0"
                      max={priceRange.max}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Maksimum Fiyat</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      min={priceRange.min}
                      max="10000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
