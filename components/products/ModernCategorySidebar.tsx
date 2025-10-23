'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronDown, 
  Search, 
  X, 
  SlidersHorizontal,
  ChevronLeft,
  Sparkles,
  TrendingUp,
  Package,
  DollarSign,
  Filter
} from 'lucide-react';

interface Category {
  name: string;
  slug: string;
  icon: string;
  count: number;
  color: string;
  subcategories?: Array<{
    label: string;
    slug: string;
    count?: number;
  }>;
}

interface ModernCategorySidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (slug: string) => void;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onPriceChange?: (min?: number, max?: number) => void;
  onStockChange?: (checked: boolean) => void;
}

export default function ModernCategorySidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  minPrice,
  maxPrice,
  inStock,
  onPriceChange,
  onStockChange
}: ModernCategorySidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showPriceFilter, setShowPriceFilter] = useState(true);
  const [showStockFilter, setShowStockFilter] = useState(true);

  const toggleCategory = (slug: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug);
    } else {
      newExpanded.add(slug);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.subcategories?.some(sub => sub.label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleClearFilters = () => {
    onCategorySelect('');
    onPriceChange?.(undefined, undefined);
    onStockChange?.(false);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory || minPrice || maxPrice || inStock;

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ width: 280 }}
        animate={{ width: 64 }}
        className="hidden lg:block flex-shrink-0 sticky top-32 h-[calc(100vh-8rem)]"
      >
        <div className="h-full backdrop-blur-2xl bg-white/80 dark:bg-gray-900/80 border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
          <div className="flex flex-col items-center p-4 space-y-6">
            {/* Expand Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCollapsed(false)}
              className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            {/* Vertical Icons */}
            <div className="flex flex-col space-y-4">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
                <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30">
                <Package className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ width: 64 }}
      animate={{ width: 280 }}
      className="hidden lg:block flex-shrink-0 sticky top-32 h-[calc(100vh-8rem)]"
    >
      <div className="h-full overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-white/95 via-white/90 to-white/95 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/95 border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
        {/* Header with Glassmorphism */}
        <div className="relative overflow-hidden border-b border-gray-200/50 dark:border-gray-700/50">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
          
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Filtreler
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {filteredCategories.length} kategori
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCollapsed(true)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleClearFilters}
                className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Filtreleri Temizle</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-[calc(100%-theme(spacing.24))] custom-scrollbar p-4 space-y-6">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Kategori ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </motion.div>

          {/* Categories */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2 mb-3">
              <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kategoriler
              </h4>
              <TrendingUp className="w-4 h-4 text-indigo-500" />
            </div>

            <AnimatePresence>
              {filteredCategories.map((category, index) => (
                <CategoryCard
                  key={category.slug}
                  category={category}
                  index={index}
                  isSelected={selectedCategory === category.slug}
                  isExpanded={expandedCategories.has(category.slug)}
                  onToggle={() => toggleCategory(category.slug)}
                  onSelect={() => onCategorySelect(category.slug)}
                  onSubcategorySelect={(subSlug) => onCategorySelect(subSlug)}
                  selectedCategory={selectedCategory}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Price Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <button
              onClick={() => setShowPriceFilter(!showPriceFilter)}
              className="flex items-center justify-between w-full px-2"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Fiyat Aralığı</h4>
              </div>
              <motion.div
                animate={{ rotate: showPriceFilter ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {showPriceFilter && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/50 dark:border-emerald-700/50 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Min
                        </label>
                        <input
                          type="number"
                          placeholder="0 ₺"
                          value={minPrice || ''}
                          onChange={(e) => onPriceChange?.(Number(e.target.value) || undefined, maxPrice)}
                          className="w-full px-3 py-2 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 bg-white/80 dark:bg-gray-900/80 focus:ring-2 focus:ring-emerald-500/50 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Max
                        </label>
                        <input
                          type="number"
                          placeholder="∞"
                          value={maxPrice || ''}
                          onChange={(e) => onPriceChange?.(minPrice, Number(e.target.value) || undefined)}
                          className="w-full px-3 py-2 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 bg-white/80 dark:bg-gray-900/80 focus:ring-2 focus:ring-emerald-500/50 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stock Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <button
              onClick={() => setShowStockFilter(!showStockFilter)}
              className="flex items-center justify-between w-full px-2"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Stok Durumu</h4>
              </div>
              <motion.div
                animate={{ rotate: showStockFilter ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {showStockFilter && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-700/50">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={inStock || false}
                        onChange={(e) => onStockChange?.(e.target.checked)}
                        className="w-5 h-5 rounded-lg border-2 border-amber-300 text-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-all"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        Sadece stokta olanlar
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #ec4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9333ea, #db2777);
        }
      `}</style>
    </motion.div>
  );
}

function CategoryCard({
  category,
  index,
  isSelected,
  isExpanded,
  onToggle,
  onSelect,
  onSubcategorySelect,
  selectedCategory
}: {
  category: Category;
  index: number;
  isSelected: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onSelect: () => void;
  onSubcategorySelect: (slug: string) => void;
  selectedCategory: string | null;
}) {
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="relative">
        {/* Glow Effect on Hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-300" />
        
        <div
          className={`relative rounded-xl transition-all duration-300 ${
            isSelected
              ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/50'
              : 'bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50'
          }`}
        >
          <button
            onClick={onSelect}
            className="w-full flex items-center p-3 space-x-3"
          >
            {/* Icon with Gradient */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg ${
                isSelected
                  ? 'bg-white/20 backdrop-blur-sm'
                  : `bg-gradient-to-br ${category.color} shadow-lg`
              }`}
            >
              {category.icon}
            </motion.div>

            {/* Category Info */}
            <div className="flex-1 text-left">
              <h5 className={`text-sm font-bold ${
                isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {category.name}
              </h5>
              {category.count > 0 && (
                <p className={`text-xs ${
                  isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {category.count} ürün
                </p>
              )}
            </div>

            {/* Expand/Collapse Button */}
            {hasSubcategories && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: isExpanded ? 90 : 0 }}
                className={`p-1 rounded-lg ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </button>

          {/* Subcategories */}
          <AnimatePresence>
            {hasSubcategories && isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-3 pb-3 space-y-1">
                  {category.subcategories!.map((sub) => (
                    <motion.button
                      key={sub.slug}
                      whileHover={{ x: 4 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSubcategorySelect(sub.slug);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                        selectedCategory === sub.slug
                          ? 'bg-white/30 backdrop-blur-sm text-white font-medium'
                          : isSelected
                          ? 'text-white/80 hover:bg-white/20'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-xs">{sub.label}</span>
                      {sub.count && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          selectedCategory === sub.slug || isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {sub.count}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

