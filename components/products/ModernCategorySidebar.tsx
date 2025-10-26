'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  name: string;
  slug: string;
  icon: string;
  count: number;
  color: string;
  subcategories: { label: string; slug: string }[];
}

interface ModernCategorySidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (slug: string | null) => void;
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
  onPriceChange: (min: number | undefined, max: number | undefined) => void;
  onStockChange: (inStock: boolean) => void;
}

export default function ModernCategorySidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  minPrice,
  maxPrice,
  inStock,
  onPriceChange,
  onStockChange,
}: ModernCategorySidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice || 0, maxPrice || 10000]);

  const toggleCategory = (slug: string) => {
    setExpandedCategories(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
    onPriceChange(values[0] === 0 ? undefined : values[0], values[1] === 10000 ? undefined : values[1]);
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-white border-r border-gray-200 p-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto sticky top-0 h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Filtreler</h2>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Kategoriler</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.slug}>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onCategorySelect(selectedCategory === category.slug ? null : category.slug)}
                    className={`flex-1 flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      selectedCategory === category.slug
                        ? 'bg-gradient-to-r ' + category.color + ' text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{category.name}</div>
                      <div className="text-xs opacity-75">{category.count} ürün</div>
                    </div>
                  </button>
                  {category.subcategories.length > 0 && (
                    <button
                      onClick={() => toggleCategory(category.slug)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          expandedCategories.includes(category.slug) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {expandedCategories.includes(category.slug) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-12 mt-2 space-y-1 overflow-hidden"
                    >
                      {category.subcategories.map((subcat) => (
                        <button
                          key={subcat.slug}
                          onClick={() => onCategorySelect(selectedCategory === subcat.slug ? null : subcat.slug)}
                          className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            selectedCategory === subcat.slug
                              ? 'bg-indigo-50 text-indigo-600 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {subcat.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Fiyat Aralığı</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-600 mb-1 block">Min</label>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange([Number(e.target.value), priceRange[1]])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600 mb-1 block">Max</label>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange([priceRange[0], Number(e.target.value)])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="10000"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{priceRange[0]} ₺</span>
              <span>{priceRange[1]} ₺</span>
            </div>
          </div>
        </div>

        {/* Stock Filter */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="inStock"
              checked={inStock}
              onChange={(e) => onStockChange(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="inStock"
              className="text-sm font-medium text-gray-900 cursor-pointer"
            >
              Sadece stokta olanlar
            </label>
          </div>
        </div>

        {/* Clear Filters */}
        {(selectedCategory || minPrice || maxPrice || inStock) && (
          <button
            onClick={() => {
              onCategorySelect(null);
              onPriceChange(undefined, undefined);
              onStockChange(false);
              setPriceRange([0, 10000]);
            }}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            Filtreleri Temizle
          </button>
        )}
      </div>
    </div>
  );
}

