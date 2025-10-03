"use client";

import { useState, useEffect } from 'react';
import { gcsObjectPublicUrl } from '@/src/lib/gcs';

interface SearchItem {
  type: 'ad' | 'organic';
  productId: string;
  campaignId?: string;
  cpc?: number;
  label?: string;
  product?: any;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: query, limit: 24 })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.items);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = async (item: SearchItem) => {
    if (item.type !== 'ad' || !item.campaignId || !item.cpc) return;
    
    try {
      const response = await fetch('/api/ads/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: item.campaignId,
          productId: item.productId,
          cost: item.cpc,
          idempotencyKey: `${item.campaignId}-${item.productId}-${Date.now()}`
        })
      });
      
      if (response.ok) {
        // Başarılı tıklama - ürün sayfasına yönlendir
        window.location.href = `/products/${item.product?.slug || item.productId}`;
      } else if (response.status === 409) {
        alert('Bütçe aşıldı, kampanya durduruldu.');
      } else if (response.status === 429) {
        alert('Çok hızlı tıklama, lütfen bekleyin.');
      }
    } catch (error) {
      console.error('Ad click error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ürün Arama</h1>
          
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ürün, kategori veya marka ara..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Aranıyor...' : 'Ara'}
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600">
              "{query}" için {results.length} sonuç bulundu
            </p>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((item, index) => (
            <div key={`${item.type}-${item.productId}-${index}`} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              {item.type === 'ad' ? (
                // Sponsorlu ürün kartı
                <div 
                  className="cursor-pointer relative"
                  onClick={() => handleAdClick(item)}
                  aria-label="Sponsorlu ürün"
                >
                  {/* Sponsorlu Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {item.label}
                    </span>
                  </div>
                  
                  {/* Ürün Bilgileri */}
                  <div className="p-4">
                    <div className="aspect-square mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img
                        src={item.product?.images?.[0] ? gcsObjectPublicUrl(item.product.images[0]) : 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Ürün'}
                        alt={item.product?.title || 'Ürün'}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.product?.title || 'Ürün Adı'}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-600">
                        ₺{item.product?.price?.toFixed(2) || '0.00'}
                      </span>
                      <span className="text-xs text-gray-500">
                        CPC: ₺{item.cpc?.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Tıklamak için kartın üzerine tıklayın
                    </div>
                  </div>
                </div>
              ) : (
                // Organik ürün kartı
                <div className="cursor-pointer" onClick={() => window.location.href = `/products/${item.product?.slug || item.productId}`}>
                  <div className="p-4">
                    <div className="aspect-square mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img
                        src={item.product?.images?.[0] ? gcsObjectPublicUrl(item.product.images[0]) : 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=Ürün'}
                        alt={item.product?.title || 'Ürün'}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.product?.title || 'Ürün Adı'}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-600">
                        ₺{item.product?.price?.toFixed(2) || '0.00'}
                      </span>
                      {item.product?.rating && (
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600 ml-1">
                            {item.product.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {results.length === 0 && query && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sonuç bulunamadı</h3>
            <p className="text-gray-500">
              "{query}" için hiç sonuç bulunamadı. Farklı anahtar kelimeler deneyin.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Aranıyor...</p>
          </div>
        )}
      </div>
    </div>
  );
}
