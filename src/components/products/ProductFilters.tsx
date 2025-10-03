'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface Seller {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface ProductFiltersProps {
  categories: Category[];
  sellers: Seller[];
  currentFilters: {
    category?: string;
    seller?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  };
  isOpen?: boolean;
  onClose?: () => void;
}

export default function ProductFilters({
  categories,
  sellers,
  currentFilters,
  isOpen = true,
  onClose
}: ProductFiltersProps) {
  const [filters, setFilters] = useState(currentFilters);
  const [isExpanded, setIsExpanded] = useState({
    category: true,
    seller: true,
    price: true,
    stock: true
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const applyFilters = () => {
    // In a real app, this would update the URL params or call a parent function
    console.log('Applying filters:', filters);
  };

  const FilterSection = ({ title, children, isExpanded, onToggle }: {
    title: string;
    children: React.ReactNode;
    isExpanded: boolean;
    onToggle: () => void;
  }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Categories */}
      <FilterSection
        title="Kategoriler"
        isExpanded={isExpanded.category}
        onToggle={() => setIsExpanded(prev => ({ ...prev, category: !prev.category }))}
      >
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.slug}
                checked={filters.category === category.slug}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 flex-1">{category.name}</span>
              <span className="text-xs text-gray-500">({category.count})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Sellers */}
      <FilterSection
        title="Satıcılar"
        isExpanded={isExpanded.seller}
        onToggle={() => setIsExpanded(prev => ({ ...prev, seller: !prev.seller }))}
      >
        <div className="space-y-2">
          {sellers.map((seller) => (
            <label key={seller.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="seller"
                value={seller.slug}
                checked={filters.seller === seller.slug}
                onChange={(e) => handleFilterChange('seller', e.target.value)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 flex-1">{seller.name}</span>
              <span className="text-xs text-gray-500">({seller.count})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="Fiyat Aralığı"
        isExpanded={isExpanded.price}
        onToggle={() => setIsExpanded(prev => ({ ...prev, price: !prev.price }))}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max</label>
              <input
                type="number"
                placeholder="10000"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Fiyat: {filters.minPrice || 0}₺ - {filters.maxPrice || '∞'}₺
          </div>
        </div>
      </FilterSection>

      {/* Stock Status */}
      <FilterSection
        title="Stok Durumu"
        isExpanded={isExpanded.stock}
        onToggle={() => setIsExpanded(prev => ({ ...prev, stock: !prev.stock }))}
      >
        <div className="space-y-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Stokta olanlar</span>
          </label>
        </div>
      </FilterSection>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4">
        <button
          onClick={applyFilters}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Filtreleri Uygula
        </button>
        <button
          onClick={clearFilters}
          className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Temizle
        </button>
      </div>
    </div>
  );

  // Mobile version (full screen sheet)
  if (onClose) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Filtreler</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterContent />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop version (sidebar)
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtreler</h3>
      <FilterContent />
    </div>
  );
}
