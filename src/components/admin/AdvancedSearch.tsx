'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  TagIcon,
  UserIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface SearchFilters {
  query: string;
  category: string;
  dateRange: {
    start: string;
    end: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  status: string;
  tags: string[];
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  status: string;
  date: string;
  tags: string[];
  relevance: number;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onResultSelect: (result: SearchResult) => void;
  placeholder?: string;
  categories?: string[];
  statuses?: string[];
}

export default function AdvancedSearch({ 
  onSearch, 
  onResultSelect, 
  placeholder = "Gelişmiş arama...",
  categories = ['Tümü', 'Ürünler', 'Siparişler', 'Müşteriler', 'Kampanyalar'],
  statuses = ['Tümü', 'Aktif', 'Pasif', 'Beklemede', 'Tamamlandı']
}: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'Tümü',
    dateRange: { start: '', end: '' },
    priceRange: { min: 0, max: 10000 },
    status: 'Tümü',
    tags: []
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'iPhone 15 Pro',
      description: 'Apple iPhone 15 Pro 256GB Space Black',
      category: 'Ürünler',
      price: 45000,
      status: 'Aktif',
      date: '2024-01-15',
      tags: ['elektronik', 'telefon', 'apple'],
      relevance: 95
    },
    {
      id: '2',
      title: 'Sipariş #1234',
      description: 'Ahmet Yılmaz - iPhone 15 Pro siparişi',
      category: 'Siparişler',
      price: 45000,
      status: 'Beklemede',
      date: '2024-01-20',
      tags: ['sipariş', 'beklemede'],
      relevance: 88
    },
    {
      id: '3',
      title: 'Yaz Kampanyası',
      description: 'Tüm ürünlerde %20 indirim',
      category: 'Kampanyalar',
      price: 0,
      status: 'Aktif',
      date: '2024-01-10',
      tags: ['kampanya', 'indirim'],
      relevance: 82
    },
    {
      id: '4',
      title: 'Ayşe Demir',
      description: 'VIP müşteri - Toplam alışveriş: ₺125,000',
      category: 'Müşteriler',
      price: 0,
      status: 'Aktif',
      date: '2024-01-18',
      tags: ['vip', 'müşteri'],
      relevance: 75
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const filteredResults = mockResults.filter(result => {
        const matchesQuery = !filters.query || 
          result.title.toLowerCase().includes(filters.query.toLowerCase()) ||
          result.description.toLowerCase().includes(filters.query.toLowerCase());
        
        const matchesCategory = filters.category === 'Tümü' || result.category === filters.category;
        const matchesStatus = filters.status === 'Tümü' || result.status === filters.status;
        
        return matchesQuery && matchesCategory && matchesStatus;
      });
      
      setResults(filteredResults);
      setShowResults(true);
      setIsLoading(false);
      onSearch(filters);
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setFilters(prev => ({ ...prev, query }));
    
    if (query.length > 2) {
      handleSearch();
    } else {
      setShowResults(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: 'Tümü',
      dateRange: { start: '', end: '' },
      priceRange: { min: 0, max: 10000 },
      status: 'Tümü',
      tags: []
    });
    setResults([]);
    setShowResults(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif': return 'bg-green-100 text-green-800';
      case 'Pasif': return 'bg-gray-100 text-gray-800';
      case 'Beklemede': return 'bg-yellow-100 text-yellow-800';
      case 'Tamamlandı': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Ürünler': return <TagIcon className="h-4 w-4" />;
      case 'Siparişler': return <CurrencyDollarIcon className="h-4 w-4" />;
      case 'Müşteriler': return <UserIcon className="h-4 w-4" />;
      case 'Kampanyalar': return <CalendarIcon className="h-4 w-4" />;
      default: return <TagIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={filters.query}
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            <FunnelIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Gelişmiş Filtreler</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat Aralığı</label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: Number(e.target.value) })}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: Number(e.target.value) })}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">TL</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Filtreleri Temizle
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  İptal
                </button>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Ara
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Aranıyor...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => (
                <div
                  key={result.id}
                  onClick={() => {
                    onResultSelect(result);
                    setShowResults(false);
                  }}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {getCategoryIcon(result.category)}
                        <h4 className="text-sm font-medium text-gray-900">{result.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(result.status)}`}>
                          {result.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{result.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{result.category}</span>
                        {result.price > 0 && <span>₺{result.price.toLocaleString()}</span>}
                        <span>{new Date(result.date).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">%{result.relevance} eşleşme</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <MagnifyingGlassIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Sonuç bulunamadı</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
