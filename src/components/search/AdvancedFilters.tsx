"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  count: number;
  selected: boolean;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  isOpen: boolean;
}

interface AdvancedFiltersProps {
  onFiltersChange?: (filters: any) => void;
  className?: string;
}

export default function AdvancedFilters({ onFiltersChange, className = "" }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterGroup[]>([
    {
      id: 'category',
      label: 'Kategori',
      isOpen: true,
      options: [
        { id: 'electronics', label: 'Elektronik', count: 1250, selected: false },
        { id: 'fashion', label: 'Moda & Aksesuar', count: 890, selected: false },
        { id: 'home', label: 'Ev & Yaşam', count: 650, selected: false },
        { id: 'sports', label: 'Spor & Outdoor', count: 420, selected: false },
        { id: 'books', label: 'Kitap & Medya', count: 380, selected: false },
      ]
    },
    {
      id: 'brand',
      label: 'Marka',
      isOpen: false,
      options: [
        { id: 'apple', label: 'Apple', count: 180, selected: false },
        { id: 'samsung', label: 'Samsung', count: 150, selected: false },
        { id: 'nike', label: 'Nike', count: 95, selected: false },
        { id: 'adidas', label: 'Adidas', count: 85, selected: false },
        { id: 'sony', label: 'Sony', count: 70, selected: false },
      ]
    },
    {
      id: 'price',
      label: 'Fiyat Aralığı',
      isOpen: false,
      options: [
        { id: '0-100', label: '₺0 - ₺100', count: 320, selected: false },
        { id: '100-500', label: '₺100 - ₺500', count: 580, selected: false },
        { id: '500-1000', label: '₺500 - ₺1.000', count: 420, selected: false },
        { id: '1000-5000', label: '₺1.000 - ₺5.000', count: 350, selected: false },
        { id: '5000+', label: '₺5.000+', count: 180, selected: false },
      ]
    },
    {
      id: 'rating',
      label: 'Değerlendirme',
      isOpen: false,
      options: [
        { id: '5', label: '5 Yıldız', count: 280, selected: false },
        { id: '4', label: '4+ Yıldız', count: 650, selected: false },
        { id: '3', label: '3+ Yıldız', count: 890, selected: false },
        { id: '2', label: '2+ Yıldız', count: 420, selected: false },
      ]
    },
    {
      id: 'condition',
      label: 'Durum',
      isOpen: false,
      options: [
        { id: 'new', label: 'Yeni', count: 1850, selected: false },
        { id: 'used', label: 'İkinci El', count: 320, selected: false },
        { id: 'refurbished', label: 'Refurbished', count: 180, selected: false },
      ]
    },
    {
      id: 'shipping',
      label: 'Kargo Seçenekleri',
      isOpen: false,
      options: [
        { id: 'free', label: 'Ücretsiz Kargo', count: 1200, selected: false },
        { id: 'same-day', label: 'Aynı Gün Teslimat', count: 180, selected: false },
        { id: 'express', label: 'Hızlı Kargo', count: 650, selected: false },
      ]
    }
  ]);

  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const toggleFilterGroup = (groupId: string) => {
    setFilters(prev => prev.map(group => 
      group.id === groupId ? { ...group, isOpen: !group.isOpen } : group
    ));
  };

  const toggleFilterOption = (groupId: string, optionId: string) => {
    setFilters(prev => prev.map(group => 
      group.id === groupId 
        ? {
            ...group,
            options: group.options.map(option =>
              option.id === optionId ? { ...option, selected: !option.selected } : option
            )
          }
        : group
    ));

    // Filter değişikliklerini parent'a bildir
    const updatedFilters = filters.map(group => 
      group.id === groupId 
        ? {
            ...group,
            options: group.options.map(option =>
              option.id === optionId ? { ...option, selected: !option.selected } : option
            )
          }
        : group
    );
    
    onFiltersChange?.(updatedFilters);
  };

  const clearAllFilters = () => {
    setFilters(prev => prev.map(group => ({
      ...group,
      options: group.options.map(option => ({ ...option, selected: false }))
    })));
    setPriceRange({ min: '', max: '' });
    onFiltersChange?.([]);
  };

  const getSelectedFiltersCount = () => {
    return filters.reduce((count, group) => 
      count + group.options.filter(option => option.selected).length, 0
    );
  };

  const selectedFiltersCount = getSelectedFiltersCount();

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
          {selectedFiltersCount > 0 && (
            <span className="px-2 py-1 text-xs bg-[#CBA135] text-white rounded-full">
              {selectedFiltersCount}
            </span>
          )}
        </div>
        {selectedFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Temizle
          </button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="p-4 space-y-4">
        {filters.map((group) => (
          <div key={group.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
            <button
              onClick={() => toggleFilterGroup(group.id)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900">{group.label}</span>
              {group.isOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            <AnimatePresence>
              {group.isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 space-y-2 overflow-hidden"
                >
                  {group.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={option.selected}
                          onChange={() => toggleFilterOption(group.id, option.id)}
                          className="w-4 h-4 text-[#CBA135] border-gray-300 rounded focus:ring-[#CBA135] focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </div>
                      <span className="text-xs text-gray-500">({option.count})</span>
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Custom Price Range */}
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleFilterGroup('custom-price')}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-gray-900">Özel Fiyat Aralığı</span>
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min Fiyat</label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max Fiyat</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  placeholder="∞"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                />
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors text-sm">
              Fiyat Aralığını Uygula
            </button>
          </div>
        </div>
      </div>

      {/* Selected Filters Summary */}
      {selectedFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gray-50 border-t border-gray-200"
        >
          <h4 className="text-sm font-medium text-gray-900 mb-2">Seçili Filtreler</h4>
          <div className="flex flex-wrap gap-2">
            {filters.map(group =>
              group.options
                .filter(option => option.selected)
                .map(option => (
                  <span
                    key={`${group.id}-${option.id}`}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#CBA135] text-white rounded-full"
                  >
                    {option.label}
                    <button
                      onClick={() => toggleFilterOption(group.id, option.id)}
                      className="hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
