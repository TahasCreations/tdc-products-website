"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, Filter } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  type: 'product' | 'category' | 'suggestion';
}

interface SmartSearchProps {
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

export default function SmartSearch({ 
  onSearch, 
  onResultSelect, 
  placeholder = "Ürün, kategori veya marka ara...",
  className = ""
}: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data - gerçek uygulamada API'den gelecek
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'iPhone 15 Pro',
      description: 'Apple iPhone 15 Pro 256GB',
      category: 'Elektronik',
      price: 45000,
      image: '/images/iphone15.jpg',
      type: 'product'
    },
    {
      id: '2',
      title: 'Elektronik Kategorisi',
      description: 'Telefon, bilgisayar ve elektronik ürünler',
      category: 'Elektronik',
      price: 0,
      image: '/images/electronics.jpg',
      type: 'category'
    }
  ];

  const mockTrending = [
    'iPhone 15', 'Samsung Galaxy', 'MacBook Air', 'AirPods', 'iPad Pro'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Local storage'dan son aramaları yükle
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setIsOpen(true);

    try {
      // TODO: Gerçek API çağrısı
      // const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      // const data = await response.json();
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock results
      const filteredResults = mockResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setResults(filteredResults);

      // Son aramaları güncelle
      const newRecentSearches = [
        searchQuery,
        ...recentSearches.filter(s => s !== searchQuery)
      ].slice(0, 5);
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));

      onSearch?.(searchQuery);
    } catch (error) {
      console.error('Arama hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      handleSearch(value);
    } else {
      setResults([]);
      setIsOpen(true);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    onResultSelect?.(result);
    setIsOpen(false);
    setQuery('');
  };

  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    handleSearch(searchTerm);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CBA135] focus:border-transparent bg-white shadow-sm text-gray-900 placeholder-gray-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#CBA135] mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Aranıyor...</p>
              </div>
            ) : query.length > 2 && results.length > 0 ? (
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Arama Sonuçları ({results.length})
                </div>
                {results.map((result) => (
                  <motion.button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-gray-900">{result.title}</h3>
                        {result.type === 'product' && (
                          <span className="text-xs text-gray-500">₺{result.price.toLocaleString()}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{result.description}</p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        {result.category}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : query.length <= 2 ? (
              <div className="p-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Son Aramalar</span>
                      </div>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Temizle
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentSearchClick(search)}
                          className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Trend Aramalar</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mockTrending.map((trend, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(trend)}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {trend}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center">
                <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">"{query}" için sonuç bulunamadı</p>
                <p className="text-xs text-gray-500 mt-1">Farklı anahtar kelimeler deneyin</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
