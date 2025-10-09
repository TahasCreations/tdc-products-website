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

// Category Item Component
function CategoryItem({ cat, index, selectedCategory, onCategorySelect }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onCategorySelect(cat.slug);
  };
  
  const handleSubcategoryClick = (e: React.MouseEvent, subcatSlug: string) => {
    e.preventDefault();
    onCategorySelect(subcatSlug);
  };
  
  return (
    <div>
      <div className="flex items-center">
        <motion.button
          onClick={handleCategoryClick}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`group flex-1 flex items-center justify-between p-2 rounded-lg transition-all duration-200 text-left ${
            selectedCategory === cat.slug
              ? 'bg-[#CBA135]/10 text-[#CBA135]'
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-base">{cat.icon}</span>
            <div>
              <span className="text-xs font-medium text-gray-900 group-hover:text-[#CBA135] transition-colors">{cat.name}</span>
              <p className="text-[10px] text-gray-500">{cat.count} ürün</p>
            </div>
          </div>
        </motion.button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <motion.svg 
            className="w-3 h-3 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-8 mt-1 space-y-1 overflow-hidden"
          >
            {cat.subcategories.map((subcat: any, subIndex: number) => (
              <motion.button
                key={subcat.slug}
                onClick={(e) => handleSubcategoryClick(e, subcat.slug)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: subIndex * 0.03 }}
                className={`block w-full text-left px-2 py-1 text-[11px] rounded transition-all duration-200 ${
                  selectedCategory === subcat.slug
                    ? 'text-[#CBA135] bg-[#CBA135]/5 font-medium'
                    : 'text-gray-600 hover:text-[#CBA135] hover:bg-gray-50'
                }`}
              >
                • {subcat.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMinPrice, setSelectedMinPrice] = useState<number | undefined>(undefined);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number | undefined>(undefined);
  const [selectedInStock, setSelectedInStock] = useState(false);
  
  const sortBy = (searchParams.sort as string) || 'recommended';
  const page = Number(searchParams.page) || 1;
  const limit = 12;
  
  // Use local state for filtering instead of URL params
  const category = selectedCategory;
  const minPrice = selectedMinPrice;
  const maxPrice = selectedMaxPrice;
  const inStock = selectedInStock;

  // Filter products based on local state
  let filteredProducts = [...mockProducts];

  if (category) {
    filteredProducts = filteredProducts.filter(product => {
      // Check if product category matches main category or subcategory
      return product.category?.slug === category || 
             product.category?.parentSlug === category;
    });
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
        {/* Desktop Filters Sidebar - Collapsible Design */}
        <div className={`hidden lg:block flex-shrink-0 bg-gradient-to-b from-white via-gray-50/30 to-white backdrop-blur-xl border-r border-gray-200/60 sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto shadow-2xl shadow-gray-900/5 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          {/* Collapsible Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#CBA135]/5 via-[#F4D03F]/10 to-[#CBA135]/5"></div>
            <div className="relative p-4 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                {!isSidebarCollapsed ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-lg flex items-center justify-center shadow-lg shadow-[#CBA135]/25">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">Filtreler</h3>
                        <p className="text-xs text-gray-500">Arama sonuçlarını daraltın</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#CBA135] rounded-full animate-pulse shadow-lg shadow-[#CBA135]/50"></div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsSidebarCollapsed(true)}
                        className="p-1 text-gray-500 hover:text-[#CBA135] transition-colors"
                        title="Daralt"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-lg flex items-center justify-center shadow-lg shadow-[#CBA135]/25">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                      </svg>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsSidebarCollapsed(false)}
                      className="p-1 text-gray-500 hover:text-[#CBA135] transition-colors"
                      title="Genişlet"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 space-y-6"
              >
                {/* Categories - Compact Design with Subcategories */}
                <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold text-gray-900">Kategoriler</h4>
              </div>
              
              <div className="space-y-1 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {[
                  { 
                    name: 'Figür & Koleksiyon',
                    slug: 'figur-koleksiyon',
                    icon: '🎭', 
                    count: 0,
                    subcategories: [
                      { label: 'Koleksiyon Figürleri', slug: 'koleksiyon-figurleri' },
                      { label: 'Anime / Manga', slug: 'anime' },
                      { label: 'Model Kit', slug: 'model-kit' },
                      { label: 'Aksiyon Figür', slug: 'aksiyon' },
                      { label: 'Funko / Nendoroid', slug: 'funko' },
                    ]
                  },
                  { 
                    name: 'Moda & Aksesuar',
                    slug: 'moda-aksesuar',
                    icon: '👗', 
                    count: 0,
                    subcategories: [
                      { label: 'Tişört & Hoodie', slug: 'tisort-hoodie' },
                      { label: 'Takı & Saat', slug: 'taki-saat' },
                      { label: 'Çanta & Cüzdan', slug: 'canta' },
                      { label: 'Ayakkabı', slug: 'ayakkabi' },
                    ]
                  },
                  { 
                    name: 'Elektronik',
                    slug: 'elektronik',
                    icon: '📱', 
                    count: 0,
                    subcategories: [
                      { label: 'Kulaklık & Ses', slug: 'kulaklik' },
                      { label: 'Akıllı Ev', slug: 'akilli-ev' },
                      { label: 'Bilgisayar Aksesuarları', slug: 'pc-aksesuar' },
                      { label: 'Oyun & Konsol', slug: 'oyun' },
                    ]
                  },
                  { 
                    name: 'Ev & Yaşam',
                    slug: 'ev-yasam',
                    icon: '🏠', 
                    count: 0,
                    subcategories: [
                      { label: 'Dekorasyon', slug: 'dekorasyon' },
                      { label: 'Mutfak', slug: 'mutfak' },
                      { label: 'Aydınlatma', slug: 'aydinlatma' },
                      { label: 'Mobilya', slug: 'mobilya' },
                    ]
                  },
                  { 
                    name: 'Sanat & Hobi',
                    slug: 'sanat-hobi',
                    icon: '🎨', 
                    count: 0,
                    subcategories: [
                      { label: 'Tablo & Poster', slug: 'poster' },
                      { label: 'El Sanatları', slug: 'el-sanatlari' },
                      { label: 'Boyama & Çizim', slug: 'boyama' },
                      { label: 'Müzik & Enstrüman', slug: 'muzik' },
                    ]
                  },
                  { 
                    name: 'Hediyelik',
                    slug: 'hediyelik',
                    icon: '🎁', 
                    count: 0,
                    subcategories: [
                      { label: 'Kişiye Özel', slug: 'kisiye-ozel' },
                      { label: 'Doğum Günü', slug: 'dogum-gunu' },
                      { label: 'Ofis & Masaüstü', slug: 'ofis' },
                      { label: 'Mini Setler', slug: 'mini-set' },
                    ]
                  }
                ].map((cat, index) => (
                  <CategoryItem 
                    key={cat.name} 
                    cat={cat} 
                    index={index} 
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                  />
                ))}
              </div>
            </div>

            {/* Price Range - Premium Design */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-gray-900">Fiyat Aralığı</h4>
              </div>
              
              <div className="bg-white border border-gray-200/60 rounded-2xl p-5 space-y-4">
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Minimum</label>
                    <input
                      type="number"
                      placeholder="0"
                      defaultValue={minPrice || ''}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#CBA135]/20 focus:border-[#CBA135] transition-all duration-200 bg-gray-50/50"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Maksimum</label>
                    <input
                      type="number"
                      placeholder="10000"
                      defaultValue={maxPrice || ''}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#CBA135]/20 focus:border-[#CBA135] transition-all duration-200 bg-gray-50/50"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#CBA135]/10 text-[#CBA135]">
                    ₺ Türk Lirası
                  </span>
                </div>
              </div>
            </div>

            {/* Stock Filter - Premium Design */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-gray-900">Stok Durumu</h4>
              </div>
              
              <div className="bg-white border border-gray-200/60 rounded-2xl p-5">
                <label className="flex items-center space-x-4 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      defaultChecked={inStock}
                      className="w-5 h-5 text-[#CBA135] border-gray-300 rounded-lg focus:ring-[#CBA135]/20 opacity-0 absolute"
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-lg flex items-center justify-center group-hover:border-[#CBA135]/50 transition-all duration-200 bg-gray-50/50">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900 group-hover:text-[#CBA135] transition-colors">Stokta Olanlar</span>
                    <p className="text-xs text-gray-500">Sadece mevcut ürünleri göster</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </label>
              </div>
            </div>

                {/* Clear Filters - Premium Button */}
                <motion.button 
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedMinPrice(undefined);
                    setSelectedMaxPrice(undefined);
                    setSelectedInStock(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-[#CBA135]/10 hover:to-[#F4D03F]/10 border border-gray-200 hover:border-[#CBA135]/30 text-gray-700 hover:text-[#CBA135] font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-lg text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Tüm Filtreleri Temizle</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
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


        {/* Mobile Filters Trigger - Premium Design */}
        <div className="lg:hidden mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFiltersOpen(true)}
            className="w-full inline-flex items-center justify-between px-6 py-4 rounded-2xl border border-gray-200/60 bg-gradient-to-r from-white via-gray-50/50 to-white backdrop-blur-sm text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-[#CBA135]/5 hover:to-[#F4D03F]/5 hover:border-[#CBA135]/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-xl flex items-center justify-center shadow-lg shadow-[#CBA135]/25">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Gelişmiş Filtreler</div>
                <div className="text-xs text-gray-500">Kategoriler, fiyat ve daha fazlası</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#CBA135] rounded-full animate-pulse shadow-lg shadow-[#CBA135]/50"></div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
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
                  className="absolute left-0 top-0 h-full w-full max-w-sm bg-gradient-to-b from-white via-gray-50/30 to-white shadow-2xl shadow-gray-900/20 backdrop-blur-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Premium Mobile Header */}
                  <div className="relative p-6 border-b border-gray-200/50 bg-gradient-to-r from-[#CBA135]/5 via-[#F4D03F]/10 to-[#CBA135]/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-xl flex items-center justify-center shadow-lg shadow-[#CBA135]/25">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Filtreler</h2>
                          <p className="text-xs text-gray-500">Arama sonuçlarını daraltın</p>
                        </div>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsFiltersOpen(false)} 
                        className="w-10 h-10 bg-white/80 hover:bg-white border border-gray-200/60 hover:border-gray-300 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Mobile Filter Content */}
                  <div className="p-6 overflow-y-auto h-[calc(100%-120px)] space-y-6">
                    {/* Categories - Mobile */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">Kategoriler</h4>
                      </div>
                      
                      <div className="space-y-2">
                        {[
                          { 
                            name: 'Figür & Koleksiyon',
                            slug: 'figur-koleksiyon',
                            icon: '🎭', 
                            count: 0,
                            subcategories: [
                              { label: 'Koleksiyon Figürleri', slug: 'koleksiyon-figurleri' },
                              { label: 'Anime / Manga', slug: 'anime' },
                              { label: 'Model Kit', slug: 'model-kit' },
                              { label: 'Aksiyon Figür', slug: 'aksiyon' },
                              { label: 'Funko / Nendoroid', slug: 'funko' },
                            ]
                          },
                          { 
                            name: 'Moda & Aksesuar',
                            slug: 'moda-aksesuar',
                            icon: '👗', 
                            count: 0,
                            subcategories: [
                              { label: 'Tişört & Hoodie', slug: 'tisort-hoodie' },
                              { label: 'Takı & Saat', slug: 'taki-saat' },
                              { label: 'Çanta & Cüzdan', slug: 'canta' },
                              { label: 'Ayakkabı', slug: 'ayakkabi' },
                            ]
                          },
                          { 
                            name: 'Elektronik',
                            slug: 'elektronik',
                            icon: '📱', 
                            count: 0,
                            subcategories: [
                              { label: 'Kulaklık & Ses', slug: 'kulaklik' },
                              { label: 'Akıllı Ev', slug: 'akilli-ev' },
                              { label: 'Bilgisayar Aksesuarları', slug: 'pc-aksesuar' },
                              { label: 'Oyun & Konsol', slug: 'oyun' },
                            ]
                          },
                          { 
                            name: 'Ev & Yaşam',
                            slug: 'ev-yasam',
                            icon: '🏠', 
                            count: 0,
                            subcategories: [
                              { label: 'Dekorasyon', slug: 'dekorasyon' },
                              { label: 'Mutfak', slug: 'mutfak' },
                              { label: 'Aydınlatma', slug: 'aydinlatma' },
                              { label: 'Mobilya', slug: 'mobilya' },
                            ]
                          },
                          { 
                            name: 'Sanat & Hobi',
                            slug: 'sanat-hobi',
                            icon: '🎨', 
                            count: 0,
                            subcategories: [
                              { label: 'Tablo & Poster', slug: 'poster' },
                              { label: 'El Sanatları', slug: 'el-sanatlari' },
                              { label: 'Boyama & Çizim', slug: 'boyama' },
                              { label: 'Müzik & Enstrüman', slug: 'muzik' },
                            ]
                          },
                          { 
                            name: 'Hediyelik',
                            slug: 'hediyelik',
                            icon: '🎁', 
                            count: 0,
                            subcategories: [
                              { label: 'Kişiye Özel', slug: 'kisiye-ozel' },
                              { label: 'Doğum Günü', slug: 'dogum-gunu' },
                              { label: 'Ofis & Masaüstü', slug: 'ofis' },
                              { label: 'Mini Setler', slug: 'mini-set' },
                            ]
                          }
                        ].map((cat, index) => (
                          <CategoryItem 
                            key={cat.name} 
                            cat={cat} 
                            index={index} 
                            selectedCategory={selectedCategory}
                            onCategorySelect={setSelectedCategory}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">Fiyat Aralığı</h4>
                      </div>
                      
                      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 space-y-4">
                        <div className="flex space-x-3">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-2">Minimum</label>
                            <input
                              type="number"
                              placeholder="0"
                              defaultValue={minPrice || ''}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#CBA135]/20 focus:border-[#CBA135] transition-all duration-200 bg-gray-50/50"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-2">Maksimum</label>
                            <input
                              type="number"
                              placeholder="10000"
                              defaultValue={maxPrice || ''}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#CBA135]/20 focus:border-[#CBA135] transition-all duration-200 bg-gray-50/50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stock Filter */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">Stok Durumu</h4>
                      </div>
                      
                      <div className="bg-white border border-gray-200/60 rounded-2xl p-5">
                        <label className="flex items-center space-x-4 cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              defaultChecked={inStock}
                              className="w-5 h-5 text-[#CBA135] border-gray-300 rounded-lg focus:ring-[#CBA135]/20 opacity-0 absolute"
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-lg flex items-center justify-center group-hover:border-[#CBA135]/50 transition-all duration-200 bg-gray-50/50">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold text-gray-900 group-hover:text-[#CBA135] transition-colors">Stokta Olanlar</span>
                            <p className="text-xs text-gray-500">Sadece mevcut ürünleri göster</p>
                          </div>
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Clear Filters Button */}
                    <motion.button 
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedMinPrice(undefined);
                        setSelectedMaxPrice(undefined);
                        setSelectedInStock(false);
                        setIsFiltersOpen(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-[#CBA135]/10 hover:to-[#F4D03F]/10 border border-gray-200 hover:border-[#CBA135]/30 text-gray-700 hover:text-[#CBA135] font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-sm hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Tüm Filtreleri Temizle</span>
                    </motion.button>
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
