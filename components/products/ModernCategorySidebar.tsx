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
    <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 overflow-y-auto sticky top-0 h-screen shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#CBA135] to-amber-600 bg-clip-text text-transparent">
            Filtreler
          </h2>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 hover:bg-[#CBA135]/10 text-[#CBA135] rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📂</span>
            Kategoriler
          </h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.slug}>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onCategorySelect(selectedCategory === category.slug ? null : category.slug)}
                    className={`flex-1 flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                      selectedCategory === category.slug
                        ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-lg shadow-' + category.color.split('-')[1] + '-500/30 scale-105'
                        : 'hover:bg-gray-100 text-gray-700 hover:shadow-md'
                    }`}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <div className="flex-1 text-left">
                      <div className={`text-sm font-semibold ${selectedCategory === category.slug ? 'text-white' : 'text-gray-900'}`}>
                        {category.name}
                      </div>
                      <div className={`text-xs ${selectedCategory === category.slug ? 'text-white/90' : 'text-gray-500'}`}>
                        {category.count} ürün
                      </div>
                    </div>
                  </button>
                  {category.subcategories.length > 0 && (
                    <button
                      onClick={() => toggleCategory(category.slug)}
                      className={`p-2 rounded-lg transition-all duration-200 ml-2 ${
                        selectedCategory === category.slug
                          ? 'hover:bg-white/20 text-white'
                          : 'hover:bg-[#CBA135]/10 text-[#CBA135]'
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
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
                          className={`block w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                            selectedCategory === subcat.slug
                              ? 'bg-[#CBA135] text-white font-semibold shadow-md'
                              : 'text-gray-700 hover:bg-[#CBA135]/10 hover:text-[#CBA135] font-medium'
                          }`}
                        >
                          • {subcat.label}
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
        <div className="mb-8 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">💰</span>
            Fiyat Aralığı
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Min Fiyat</label>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange([Number(e.target.value), priceRange[1]])}
                  className="w-full px-3 py-2.5 border-2 border-amber-200 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] bg-white"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Max Fiyat</label>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange([priceRange[0], Number(e.target.value)])}
                  className="w-full px-3 py-2.5 border-2 border-amber-200 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] bg-white"
                  placeholder="10000"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm font-bold">
              <span className="text-[#CBA135]">{priceRange[0]} ₺</span>
              <span className="text-gray-400">—</span>
              <span className="text-[#CBA135]">{priceRange[1]} ₺</span>
            </div>
          </div>
        </div>

        {/* Stock Filter */}
        <div className="mb-8 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="inStock"
              checked={inStock}
              onChange={(e) => onStockChange(e.target.checked)}
              className="w-5 h-5 text-[#CBA135] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#CBA135] cursor-pointer"
            />
            <label
              htmlFor="inStock"
              className="text-sm font-bold text-gray-800 cursor-pointer flex items-center"
            >
              <span className="mr-2">✓</span>
              Sadece stokta olanlar
            </label>
          </div>
        </div>

        {/* Clear Filters */}
        {(selectedCategory || minPrice || maxPrice || inStock) && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => {
              onCategorySelect(null);
              onPriceChange(undefined, undefined);
              onStockChange(false);
              setPriceRange([0, 10000]);
            }}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Filtreleri Temizle</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}

