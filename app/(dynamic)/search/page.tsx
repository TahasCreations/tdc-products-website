"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, X, Star, Heart, ShoppingCart, TrendingUp, Clock, Sparkles, Grid, List } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface SearchProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  listPrice?: number;
  image: string;
  images: string[];
  category: string;
  brand?: string;
  rating: number;
  reviewCount: number;
  seller: {
    id: string;
    name: string;
    rating: number;
  };
  inStock: boolean;
  slug: string;
  score?: number;
  isSponsored?: boolean;
  adLabel?: string;
}

interface SearchFilters {
  category: string;
  minPrice: number;
  maxPrice: number;
  brand: string;
  rating: number;
  inStock: boolean;
  sortBy: string;
}

interface SearchSuggestions {
  products: string[];
  categories: string[];
  trending: string[];
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestions>({ products: [], categories: [], trending: [] });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchType, setSearchType] = useState<'text' | 'semantic'>('semantic');
  
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    brand: '',
    rating: 0,
    inStock: false,
    sortBy: 'relevance'
  });

  const debouncedQuery = useDebounce(query, 300);

  // URL'den query parametresini al
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      setQuery(q);
    }
  }, []);

  // Arama yap
  const performSearch = useCallback(async (searchQuery: string, currentFilters: SearchFilters, pageNum: number = 1) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const searchParams = new URLSearchParams({
        q: searchQuery,
        page: pageNum.toString(),
        limit: '20',
        sort: currentFilters.sortBy,
      });

      if (currentFilters.category) searchParams.append('category', currentFilters.category);
      if (currentFilters.minPrice > 0) searchParams.append('minPrice', currentFilters.minPrice.toString());
      if (currentFilters.maxPrice < 10000) searchParams.append('maxPrice', currentFilters.maxPrice.toString());
      if (currentFilters.brand) searchParams.append('brand', currentFilters.brand);
      if (currentFilters.rating > 0) searchParams.append('rating', currentFilters.rating.toString());

      const response = await fetch(`/api/search?${searchParams.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setTotal(data.total || 0);
        setSuggestions(data.suggestions || { products: [], categories: [], trending: [] });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Semantic arama yap
  const performSemanticSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/search/semantic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: searchQuery, k: 20 })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.products || []);
        setTotal(data.products?.length || 0);
      }
    } catch (error) {
      console.error('Semantic search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced arama
  useEffect(() => {
    if (debouncedQuery.trim()) {
      if (searchType === 'semantic') {
        performSemanticSearch(debouncedQuery);
      } else {
        performSearch(debouncedQuery, filters);
      }
    }
  }, [debouncedQuery, searchType, performSearch, performSemanticSearch]);

  // Filtre değişikliklerinde arama yap
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    if (query.trim()) {
      performSearch(query, updatedFilters);
    }
  };

  const handleAddToCart = (product: SearchProduct) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      sellerId: product.seller.id,
      sellerName: product.seller.name,
      maxStock: product.inStock ? 100 : 0,
    });
  };

  const handleWishlistToggle = (product: SearchProduct) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        slug: product.slug,
        image: product.image,
        price: product.price,
        category: product.category,
        rating: product.rating,
        reviewCount: product.reviewCount,
      });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Gelişmiş Arama</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-4xl">
            <div className="flex bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Ürün, kategori veya marka ara..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-none focus:ring-0 focus:outline-none"
                />
                
                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && (suggestions.products.length > 0 || suggestions.categories.length > 0 || suggestions.trending.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1"
                    >
                      {/* Trending Searches */}
                      {suggestions.trending.length > 0 && (
                        <div className="p-3 border-b border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-medium text-gray-700">Trend Aramalar</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {suggestions.trending.map((trend, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(trend)}
                                className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm hover:bg-orange-100 transition-colors"
                              >
                                {trend}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Product Suggestions */}
                      {suggestions.products.length > 0 && (
                        <div className="p-3 border-b border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <Search className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-700">Ürün Önerileri</span>
                          </div>
                          <div className="space-y-1">
                            {suggestions.products.slice(0, 5).map((product, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(product)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm"
                              >
                                {product}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Category Suggestions */}
                      {suggestions.categories.length > 0 && (
                        <div className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Filter className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-700">Kategori Önerileri</span>
                          </div>
                          <div className="space-y-1">
                            {suggestions.categories.slice(0, 5).map((category, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(category)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm"
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex items-center border-l border-gray-200">
                <button
                  onClick={() => setSearchType(searchType === 'semantic' ? 'text' : 'semantic')}
                  className={`px-4 py-4 transition-colors ${
                    searchType === 'semantic' 
                      ? 'bg-[#CBA135] text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title={searchType === 'semantic' ? 'Semantic Search' : 'Text Search'}
                >
                  <Sparkles className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-4 transition-colors ${
                    showFilters 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
                
                <button
                  type="button"
                  disabled={loading}
                  className="px-6 py-4 bg-[#CBA135] text-white hover:bg-[#B8941F] disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange({ category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                    >
                      <option value="">Tüm Kategoriler</option>
                      <option value="elektronik">Elektronik</option>
                      <option value="moda">Moda & Aksesuar</option>
                      <option value="figur">Figür & Koleksiyon</option>
                      <option value="ev-yasam">Ev & Yaşam</option>
                      <option value="sanat-hobi">Sanat & Hobi</option>
                      <option value="hediyelik">Hediyelik</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat Aralığı</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice || ''}
                        onChange={(e) => handleFilterChange({ minPrice: Number(e.target.value) })}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice === 10000 ? '' : filters.maxPrice}
                        onChange={(e) => handleFilterChange({ maxPrice: Number(e.target.value) })}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Puan</label>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center">
                          <input
                            type="radio"
                            name="rating"
                            value={rating}
                            checked={filters.rating === rating}
                            onChange={(e) => handleFilterChange({ rating: Number(e.target.value) })}
                            className="mr-2"
                          />
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-sm text-gray-600">ve üzeri</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Stock Filter */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => handleFilterChange({ inStock: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Sadece stokta olanlar</span>
                    </label>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                    >
                      <option value="relevance">İlgililik</option>
                      <option value="price-low">Fiyat (Düşük → Yüksek)</option>
                      <option value="price-high">Fiyat (Yüksek → Düşük)</option>
                      <option value="rating">En Yüksek Puan</option>
                      <option value="newest">En Yeni</option>
                      <option value="oldest">En Eski</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Info */}
            {query && (
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-600">
                    "{query}" için <span className="font-semibold">{total}</span> sonuç bulundu
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      searchType === 'semantic' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {searchType === 'semantic' ? 'AI Arama' : 'Metin Arama'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {loading ? 'Aranıyor...' : `${results.length} sonuç gösteriliyor`}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#CBA135] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#CBA135] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Results */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CBA135] mx-auto"></div>
                  <p className="mt-4 text-gray-600">Aranıyor...</p>
                </motion.div>
              ) : results.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                  }
                >
                  {results.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      {/* Product Image */}
                      <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'}`}>
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                        
                        {/* Sponsored Badge */}
                        {product.isSponsored && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                              {product.adLabel || 'Sponsorlu'}
                            </span>
                          </div>
                        )}
                        
                        {/* Quick Actions */}
                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleWishlistToggle(product)}
                            className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm"
                          >
                            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="mb-2">
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            {product.category}
                          </span>
                        </div>
                        
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#CBA135] transition-colors">
                            {product.title}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-xs text-gray-500">({product.reviewCount})</span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-lg font-bold text-gray-900">
                              ₺{product.price.toLocaleString()}
                            </span>
                            {product.listPrice && product.listPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ₺{product.listPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.inStock ? 'Stokta' : 'Stokta Yok'}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {product.seller.name}
                          </span>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock}
                            className="flex items-center gap-1 px-3 py-1 bg-[#CBA135] text-white rounded-lg text-sm hover:bg-[#B8941F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            Sepete Ekle
                          </button>
                        </div>
                        
                        {/* Semantic Search Score */}
                        {product.score && searchType === 'semantic' && (
                          <div className="mt-2 text-xs text-gray-500">
                            Benzerlik: {(product.score * 100).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : query && !loading ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-12"
                >
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sonuç bulunamadı</h3>
                  <p className="text-gray-500 mb-4">
                    "{query}" için hiç sonuç bulunamadı. Farklı anahtar kelimeler deneyin.
                  </p>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setSearchType('text')}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Metin Araması Dene
                    </button>
                    <button
                      onClick={() => setSearchType('semantic')}
                      className="px-4 py-2 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors"
                    >
                      AI Araması Dene
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-12"
                >
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Arama yapın</h3>
                  <p className="text-gray-500">
                    Ürün, kategori veya marka arayarak başlayın.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}