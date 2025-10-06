"use client";
import { Suspense } from 'react';
import ProductFilters from '../../src/components/products/ProductFilters';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductGrid from '../../src/components/products/ProductGrid';
import ProductSorting from '../../src/components/products/ProductSorting';
import Breadcrumb from '../../src/components/ui/Breadcrumb';
import { EmptyProductsState } from '../../src/components/empty/EmptyState';
import { gcsObjectPublicUrl } from '@/lib/gcs';

// Note: metadata cannot be exported from a Client Component; moved to head via JSON-LD only.
const pageMeta = {
  title: 'Tüm Ürünler - TDC Market',
  description: 'TDC Market\'te tüm ürünleri keşfedin. Figürlerden elektroniğe, modadan hediyeliğe kadar geniş ürün yelpazesi.',
  openGraph: {
    title: 'Tüm Ürünler - TDC Market',
    description: 'TDC Market\'te tüm ürünleri keşfedin. Figürlerden elektroniğe, modadan hediyeliğe kadar geniş ürün yelpazesi.',
    images: ['https://via.placeholder.com/1200x630/4F46E5/FFFFFF?text=TDC+Market+Products'],
  },
};

// Empty products array - no demo data
const mockProducts: any[] = [];

// Empty categories and sellers arrays - no demo data
const mockCategories: any[] = [];
const mockSellers: any[] = [];

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const sortBy = (searchParams.sort as string) || 'recommended';
  const category = searchParams.category as string;
  const seller = searchParams.seller as string;
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const inStock = searchParams.inStock === 'true';
  const page = Number(searchParams.page) || 1;
  const limit = 12;

  // Filter products based on search params
  let filteredProducts = [...mockProducts];

  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.slug === category
    );
  }

  if (seller) {
    filteredProducts = filteredProducts.filter(product => 
      product.seller.slug === seller
    );
  }

  if (minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => 
      product.price >= minPrice
    );
  }

  if (maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => 
      product.price <= maxPrice
    );
  }

  if (inStock) {
    filteredProducts = filteredProducts.filter(product => 
      product.stock > 0
    );
  }

  // Sort products
  switch (sortBy) {
    case 'newest':
      filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
      break;
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'best-selling':
      filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case 'highest-rated':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    default: // recommended
      filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / limit);
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Tüm Ürünler', href: '/products' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="flex">
        {/* Desktop Filters Sidebar - Compact & Animated */}
        <div className="hidden lg:block lg:w-56 flex-shrink-0 bg-white/95 backdrop-blur-sm border-r border-gray-200/50 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto shadow-sm">
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Filtreler</h3>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            </div>
            
            {/* Categories - Compact Design */}
            <div className="mb-5">
              <h4 className="text-xs font-medium text-gray-700 mb-3 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Kategoriler
              </h4>
              <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {[
                  { name: 'Figür & Koleksiyon', href: '/products?category=figur-koleksiyon', icon: '🎭', count: 0 },
                  { name: 'Moda & Aksesuar', href: '/products?category=moda-aksesuar', icon: '👕', count: 0 },
                  { name: 'Elektronik', href: '/products?category=elektronik', icon: '📱', count: 0 },
                  { name: 'Ev & Yaşam', href: '/products?category=ev-yasam', icon: '🏠', count: 0 },
                  { name: 'Sanat & Hobi', href: '/products?category=sanat-hobi', icon: '🎨', count: 0 },
                  { name: 'Hediyelik', href: '/products?category=hediyelik', icon: '🎁', count: 0 }
                ].map((cat, index) => (
                  <motion.a
                    key={cat.name}
                    href={cat.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`group flex items-center justify-between px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-[1.02] ${
                      category === cat.name.toLowerCase().replace(/\s+/g, '-')
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{cat.icon}</span>
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-gray-600">{cat.count}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Price Range - Compact */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Fiyat Aralığı
              </h4>
              <div className="space-y-2">
                <div className="flex space-x-1">
                  <input
                    type="number"
                    placeholder="Min"
                    defaultValue={minPrice || ''}
                    className="flex-1 px-2 py-1.5 border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    defaultValue={maxPrice || ''}
                    className="flex-1 px-2 py-1.5 border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="text-xs text-gray-500 text-center">₺</div>
              </div>
            </div>

            {/* Stock Filter - Compact */}
            <div className="mb-4">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    defaultChecked={inStock}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 opacity-0 absolute"
                  />
                  <div className="w-4 h-4 border-2 border-gray-300 rounded flex items-center justify-center group-hover:border-indigo-400 transition-colors">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <span className="text-xs text-gray-700 group-hover:text-gray-900">Stokta olanlar</span>
              </label>
            </div>

            {/* Clear Filters - Animated */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-xs text-indigo-600 hover:text-indigo-700 font-medium py-2 px-3 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center space-x-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Filtreleri Temizle</span>
            </motion.button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tüm Ürünler</h1>
          <p className="text-gray-600">
            {filteredProducts.length} ürün bulundu
            {category && ` • ${mockCategories.find(c => c.slug === category)?.name}`}
            {seller && ` • ${mockSellers.find(s => s.slug === seller)?.name}`}
          </p>
        </div>


        {/* Mobile Filters Trigger */}
        <div className="lg:hidden mb-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFiltersOpen(true)}
            className="inline-flex items-center px-4 py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-sm font-medium text-gray-700 hover:bg-white hover:shadow-md shadow-sm transition-all duration-200"
          >
            <div className="w-5 h-5 mr-2 bg-indigo-100 rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
            </div>
            <span>Gelişmiş Filtreler</span>
            <div className="ml-2 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          </motion.button>
        </div>

          {/* Mobile Slide-over Filters */}
          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                onClick={() => setIsFiltersOpen(false)}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="absolute left-0 top-0 h-full w-full max-w-sm bg-white shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                        </svg>
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">Filtreler</h2>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsFiltersOpen(false)} 
                      className="p-2 hover:bg-white/50 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                  <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
                    <ProductFilters
                      categories={mockCategories}
                      sellers={mockSellers}
                      currentFilters={{
                        category,
                        seller,
                        minPrice,
                        maxPrice,
                        inStock
                      }}
                      isOpen
                      onClose={() => setIsFiltersOpen(false)}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        {/* Results Header & Sorting */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredProducts.length} ürün
                </h2>
                {/* Active Filters Display */}
                <div className="flex flex-wrap gap-2">
                  {category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {mockCategories.find(c => c.slug === category)?.name}
                      <button className="ml-2 text-indigo-600 hover:text-indigo-800">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}
                  {seller && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {mockSellers.find(s => s.slug === seller)?.name}
                      <button className="ml-2 text-indigo-600 hover:text-indigo-800">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}
                  {inStock && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Stokta Olanlar
                      <button className="ml-2 text-green-600 hover:text-green-800">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="hidden sm:flex items-center border border-gray-300 rounded-lg">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                  <button className="p-2 text-indigo-600 bg-indigo-50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                </div>
                
                <ProductSorting currentSort={sortBy} />
              </div>
            </div>

        {/* Products Grid or Empty State */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {filteredProducts.length === 0 ? (
            <EmptyProductsState />
          ) : (
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid 
                products={paginatedProducts}
                currentPage={page}
                totalPages={totalPages}
                totalProducts={filteredProducts.length}
              />
            </Suspense>
          )}
        </div>
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Tüm Ürünler - TDC Market",
            "description": "TDC Market'te tüm ürünleri keşfedin. Figürlerden elektroniğe, modadan hediyeliğe kadar geniş ürün yelpazesi.",
            "url": "https://tdcmarket.com/products",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": filteredProducts.length,
              "itemListElement": paginatedProducts.map((product, index) => ({
                "@type": "Product",
                "position": index + 1,
                "name": product.title,
                "url": `https://tdcmarket.com/products/${product.slug}`,
                "image": product.images[0],
                "offers": {
                  "@type": "Offer",
                  "price": product.price,
                  "priceCurrency": product.currency,
                  "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": product.rating,
                  "reviewCount": product.reviewCount
                }
              }))
            }
          })
        }}
      />
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200"></div>
          <div className="p-5">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
