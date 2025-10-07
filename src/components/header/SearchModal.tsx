'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<'text' | 'semantic'>('semantic');
  const router = useRouter();

  // Mock data for suggestions
  const mockSuggestions = [
    'Naruto Figürü',
    'One Piece Koleksiyon',
    'Gaming Kulaklık',
    'LED Aydınlatma',
    'Anime Tişört',
    'Model Kit',
    'Funko Pop',
    'Akıllı Ev Ürünleri'
  ];

  const mockTrending = [
    'Dragon Ball Figürleri',
    'Marvel Koleksiyon',
    'Gaming Aksesuarları',
    'LED Şerit',
    'Anime Kıyafetleri'
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockSuggestions.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Load recent searches from localStorage
    const recent = localStorage.getItem('recentSearches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newRecent = [query, ...recentSearches.filter(item => item !== query)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));
      
      // Navigate to advanced search page
      router.push(`/search?q=${encodeURIComponent(query)}&type=${searchType}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl z-50"
          >
            {/* Search Input */}
            <div className="p-6 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ürün, kategori veya marka ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-16 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                  autoFocus
                />
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <button
                    onClick={() => setSearchType(searchType === 'semantic' ? 'text' : 'semantic')}
                    className={`p-2 rounded-lg transition-colors ${
                      searchType === 'semantic' 
                        ? 'bg-[#CBA135] text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title={searchType === 'semantic' ? 'AI Arama (Semantic)' : 'Metin Arama'}
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search Type Indicator */}
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  searchType === 'semantic' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {searchType === 'semantic' ? '🤖 AI Arama' : '📝 Metin Arama'}
                </span>
                <span className="text-xs text-gray-500">
                  Enter ile arama yapın
                </span>
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {searchQuery.trim() ? (
                // Search Suggestions
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                    Öneriler
                  </h3>
                  {suggestions.length > 0 ? (
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={suggestion}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSearch(suggestion)}
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            <Search className="w-4 h-4 text-gray-400 group-hover:text-[#CBA135]" />
                            <span className="text-gray-700 group-hover:text-[#CBA135]">
                              {suggestion}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Arama sonucu bulunamadı</p>
                    </div>
                  )}
                </div>
              ) : (
                // Recent & Trending Searches
                <div className="p-6 space-y-6">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Son Aramalar
                        </h3>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          Temizle
                        </button>
                      </div>
                      <div className="space-y-2">
                        {recentSearches.map((search, index) => (
                          <motion.button
                            key={search}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSearch(search)}
                            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                          >
                            <div className="flex items-center space-x-3">
                              <Clock className="w-4 h-4 text-gray-400 group-hover:text-[#CBA135]" />
                              <span className="text-gray-700 group-hover:text-[#CBA135]">
                                {search}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Searches */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Trend Aramalar
                    </h3>
                    <div className="space-y-2">
                      {mockTrending.map((trend, index) => (
                        <motion.button
                          key={trend}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (recentSearches.length + index) * 0.05 }}
                          onClick={() => handleSearch(trend)}
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-[#CBA135]" />
                            <span className="text-gray-700 group-hover:text-[#CBA135]">
                              {trend}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Enter ile arama yapın</span>
                <div className="flex items-center space-x-4">
                  <span>↑↓ Navigasyon</span>
                  <span>Esc Kapat</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
