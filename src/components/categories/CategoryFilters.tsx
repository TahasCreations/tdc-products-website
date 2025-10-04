'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface CategoryFiltersProps {
  filters: {
    price: {
      min: number;
      max: number;
    };
    categories: FilterOption[];
    brands: FilterOption[];
    colors: FilterOption[];
    features: FilterOption[];
  };
  onFilterChange: (filterType: string, value: any) => void;
  className?: string;
}

export default function CategoryFilters({
  filters,
  onFilterChange,
  className = ''
}: CategoryFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      {/* Mobile Header */}
      <div className="lg:hidden p-4 border-b border-gray-100">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
          <motion.svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Filtreler</h3>
        <p className="text-sm text-gray-600">Aradığınız ürünü kolayca bulun</p>
      </div>

      {/* Filter Content */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden lg:block"
      >
        <div className="p-6 space-y-8">
          {/* Price Range */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Fiyat Aralığı</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onChange={(e) => onFilterChange('priceMin', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onChange={(e) => onFilterChange('priceMax', e.target.value)}
                />
              </div>
              <div className="text-xs text-gray-500 text-center">₺</div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Kategoriler</h4>
            <div className="space-y-2">
              {filters.categories.map((category) => (
                <label key={category.id} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">
                    {category.label}
                  </span>
                  {category.count && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  )}
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    onChange={(e) => onFilterChange('category', { id: category.id, checked: e.target.checked })}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Markalar</h4>
            <div className="space-y-2">
              {filters.brands.map((brand) => (
                <label key={brand.id} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">
                    {brand.label}
                  </span>
                  {brand.count && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {brand.count}
                    </span>
                  )}
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    onChange={(e) => onFilterChange('brand', { id: brand.id, checked: e.target.checked })}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Renkler</h4>
            <div className="flex flex-wrap gap-2">
              {filters.colors.map((color) => (
                <button
                  key={color.id}
                  className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: color.label }}
                  onClick={() => onFilterChange('color', color.id)}
                />
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Özellikler</h4>
            <div className="space-y-2">
              {filters.features.map((feature) => (
                <label key={feature.id} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">
                    {feature.label}
                  </span>
                  {feature.count && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {feature.count}
                    </span>
                  )}
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    onChange={(e) => onFilterChange('feature', { id: feature.id, checked: e.target.checked })}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 px-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
            onClick={() => onFilterChange('clear', null)}
          >
            Filtreleri Temizle
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
