'use client';

import { useState } from 'react';
import ProductGrid from '../products/ProductGrid';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  
  // Mock search results
  const mockProducts = [
    {
      id: '1',
      title: 'Arama Sonucu 1',
      slug: 'arama-sonucu-1',
      price: 199.99,
      currency: 'TRY',
      rating: 4.5,
      reviewCount: 50,
      stock: 5,
      images: ['/images/search-result-1.jpg'],
      tags: ['arama', 'sonuç'],
      seller: {
        name: 'TDC Store',
        slug: 'tdc-store',
        rating: 4.9,
        logo: '/images/tdc-logo.png'
      },
      category: {
        name: 'Genel',
        slug: 'genel'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Arama</h1>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Ürün, kategori veya marka ara..."
              className="w-full max-w-lg px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Search Results */}
        <div>
          <ProductGrid products={mockProducts} />
        </div>
      </div>
    </div>
  );
}
