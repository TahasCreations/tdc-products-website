'use client';

import { useState } from 'react';
import ProductGrid from './ProductGrid';
import ProductFilters from './ProductFilters';
import ProductSorting from './ProductSorting';

export default function ProductsPage() {
  const [currentSort, setCurrentSort] = useState('recommended');
  
  // Mock data for products
  const products = [
    {
      id: '1',
      title: 'Naruto Figür - Kırmızı',
      slug: 'naruto-figur-kirmizi',
      price: 299.99,
      listPrice: 399.99,
      currency: 'TRY',
      rating: 4.8,
      reviewCount: 125,
      stock: 10,
      images: ['/images/naruto-figur.jpg'],
      tags: ['figür', 'naruto', 'anime'],
      seller: {
        name: 'TDC Store',
        slug: 'tdc-store',
        rating: 4.9,
        logo: '/images/tdc-logo.png'
      },
      category: {
        name: 'Figür & Koleksiyon',
        slug: 'figur-koleksiyon'
      }
    },
    {
      id: '2',
      title: 'Elektronik Oyuncak',
      slug: 'elektronik-oyuncak',
      price: 199.99,
      currency: 'TRY',
      rating: 4.5,
      reviewCount: 89,
      stock: 5,
      images: ['/images/elektronik-oyuncak.jpg'],
      tags: ['elektronik', 'oyuncak', 'eğitici'],
      seller: {
        name: 'El Yapımı Atölye',
        slug: 'el-yapimi-atolye',
        rating: 4.7,
        logo: '/images/atolye-logo.png'
      },
      category: {
        name: 'Elektronik',
        slug: 'elektronik'
      }
    }
  ];

  // Mock data for filters
  const categories = [
    { id: '1', name: 'Figür & Koleksiyon', slug: 'figur-koleksiyon', count: 150 },
    { id: '2', name: 'Moda & Aksesuar', slug: 'moda-aksesuar', count: 200 },
    { id: '3', name: 'Elektronik', slug: 'elektronik', count: 100 },
    { id: '4', name: 'Ev & Yaşam', slug: 'ev-yasam', count: 80 },
    { id: '5', name: 'Sanat & Hobi', slug: 'sanat-hobi', count: 120 },
    { id: '6', name: 'Hediyelik', slug: 'hediyelik', count: 90 },
  ];

  const sellers = [
    { id: '1', name: 'TDC Store', slug: 'tdc-store', count: 300 },
    { id: '2', name: 'El Yapımı Atölye', slug: 'el-yapimi-atolye', count: 150 },
    { id: '3', name: 'Koleksiyon Dükkanı', slug: 'koleksiyon-dukkani', count: 100 },
  ];

  const currentFilters = {
    category: undefined,
    seller: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    inStock: undefined,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tüm Ürünler</h1>
          <p className="text-gray-600 mt-2">
            TDC Market'teki tüm ürünleri keşfedin
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filters */}
          <div className="w-64 flex-shrink-0">
            <ProductFilters 
              categories={categories}
              sellers={sellers}
              currentFilters={currentFilters}
            />
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="mb-6">
              <ProductSorting 
                currentSort={currentSort}
                onSortChange={setCurrentSort}
              />
            </div>
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}
