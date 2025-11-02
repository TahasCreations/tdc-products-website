"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Sparkles,
  TrendingUp,
  Clock,
  Loader2
} from 'lucide-react';

interface SearchSuggestion {
  text: string;
  type: 'recent' | 'popular' | 'ai';
}

export const AISearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false); // Hydration fix
  const inputRef = useRef<HTMLInputElement>(null);

  // Hydration fix
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Guard clause for SSR
    
    // Load recent searches from localStorage
    const recent = localStorage.getItem('recent-searches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, [isMounted]);

  useEffect(() => {
    if (query.length > 2) {
      handleSearchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearchSuggestions = async (searchQuery: string) => {
    setIsLoading(true);
    
    try {
      // Fetch AI-powered suggestions
      // const aiSuggestions = await AISearchEngine.autocomplete(searchQuery);
      
      // Mock suggestions
      const aiSuggestions = [
        'laptop computer',
        'wireless headphones',
        'smartphone cases',
        'mechanical keyboard',
        'gaming mouse'
      ];
      
      setSuggestions([
        ...recentSearches.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).map(s => ({
          text: s,
          type: 'recent' as const
        })),
        ...aiSuggestions.map(s => ({
          text: s,
          type: 'ai' as const
        }))
      ]);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
    
    // Perform search
    // window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    
    setQuery('');
    setIsOpen(false);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="AI ile ara... (örn: kablosuz kulaklık)"
          className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900 placeholder-gray-400"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Loading State */}
            {isLoading && (
              <div className="p-4 flex items-center justify-center gap-2 text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">AI ile öneriler üretiliyor...</span>
              </div>
            )}

            {/* AI Suggestions */}
            {query.length > 2 && suggestions.length > 0 && (
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-gray-700">AI Önerileri</span>
                </div>
                <div className="space-y-1">
                  {suggestions.filter(s => s.type === 'ai').map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(suggestion.text)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm text-gray-700"
                    >
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && query.length === 0 && (
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-semibold text-gray-700">Son Aramalar</span>
                  </div>
                  <button
                    onClick={handleClearRecent}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Temizle
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm text-gray-700 flex items-center gap-2"
                    >
                      <Clock className="w-3 h-3 text-gray-400" />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            {query.length === 0 && recentSearches.length === 0 && (
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-semibold text-gray-700">Popüler Aramalar</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Laptop', 'Telefon', 'Kulaklık', 'Kamera', 'Tablet'].map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(tag)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {query.length > 2 && suggestions.length === 0 && !isLoading && (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Sonuç bulunamadı</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close on outside click */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

