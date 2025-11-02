"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';

interface FilterProps {
  onFilterChange: (filters: any) => void;
}

const CATEGORIES = ['Tümü', 'Anime', 'Manga', 'Gaming', 'Film', 'Diğer'];
const BRANDS = ['Bandai', 'Good Smile', 'Funko', 'Nendoroid', 'Kotobukiya'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'En Popüler' },
  { value: 'price-asc', label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'price-desc', label: 'Fiyat: Yüksekten Düşüğe' },
  { value: 'newest', label: 'En Yeni' },
  { value: 'rating', label: 'En Yüksek Puan' },
];

export default function AdvancedFilters({ onFilterChange }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [rating, setRating] = useState(0);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleApply = () => {
    onFilterChange({
      priceRange,
      categories: selectedCategories,
      brands: selectedBrands,
      sortBy,
      inStock,
      onSale,
      rating,
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setPriceRange([0, 5000]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSortBy('popular');
    setInStock(false);
    setOnSale(false);
    setRating(0);
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    (inStock ? 1 : 0) +
    (onSale ? 1 : 0) +
    (rating > 0 ? 1 : 0);

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-500 transition-colors relative"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span className="font-semibold">Filtrele</span>
        {activeFilterCount > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-md h-full bg-white shadow-2xl overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-gray-900">Filtreler</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Sort */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Sıralama
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Fiyat Aralığı: ₺{priceRange[0]} - ₺{priceRange[1]}
                  </label>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="50"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="50"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Kategori
                  </label>
                  <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                      <label
                        key={category}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-5 h-5 text-indigo-600 rounded"
                        />
                        <span className="text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Marka
                  </label>
                  <div className="space-y-2">
                    {BRANDS.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-5 h-5 text-indigo-600 rounded"
                        />
                        <span className="text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Stock & Sale */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded"
                    />
                    <span className="text-gray-700 font-semibold">
                      Sadece Stokta Olanlar
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onSale}
                      onChange={(e) => setOnSale(e.target.checked)}
                      className="w-5 h-5 text-red-600 rounded"
                    />
                    <span className="text-gray-700 font-semibold">
                      İndirimli Ürünler
                    </span>
                  </label>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Minimum Puan
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          rating === star
                            ? 'bg-yellow-400 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {star}★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex space-x-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Sıfırla
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                >
                  Uygula
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

