"use client";
import { Suspense, useEffect } from 'react';
import ProductFilters from '../../src/components/products/ProductFilters';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductGrid from '../../src/components/products/ProductGrid';
import ProductSorting from '../../src/components/products/ProductSorting';
import Breadcrumb from '../../src/components/ui/Breadcrumb';
import { EmptyProductsState } from '../../src/components/empty/EmptyState';
import { gcsObjectPublicUrl } from '@/lib/gcs';
import { useSearchParams } from 'next/navigation';
import ModernCategorySidebar from '@/components/products/ModernCategorySidebar';

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

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMinPrice, setSelectedMinPrice] = useState<number | undefined>(undefined);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number | undefined>(undefined);
  const [selectedInStock, setSelectedInStock] = useState(false);
  
  // Safely get search params with fallback
  const sortBy = searchParams?.get('sort') || 'recommended';
  const page = Number(searchParams?.get('page') || '1');
  const limit = 12;
  
  // Use local state for filtering instead of URL params
  const category = selectedCategory;
  const minPrice = selectedMinPrice;
  const maxPrice = selectedMaxPrice;
  const inStock = selectedInStock;
  const seller = searchParams?.get('seller') || undefined;

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

  // Modern categories with colors
  const modernCategories = [
    { 
      name: 'Figür & Koleksiyon',
      slug: 'figur-koleksiyon',
      icon: '🎭', 
      count: 0,
      color: 'from-purple-500 to-indigo-600',
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
      color: 'from-pink-500 to-rose-600',
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
      color: 'from-blue-500 to-cyan-600',
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
      color: 'from-emerald-500 to-teal-600',
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
      color: 'from-orange-500 to-amber-600',
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
      color: 'from-red-500 to-pink-600',
      subcategories: [
        { label: 'Kişiye Özel', slug: 'kisiye-ozel' },
        { label: 'Doğum Günü', slug: 'dogum-gunu' },
        { label: 'Ofis & Masaüstü', slug: 'ofis' },
        { label: 'Mini Setler', slug: 'mini-set' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      <div className="flex">
        {/* Modern Sidebar */}
        <ModernCategorySidebar
          categories={modernCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          minPrice={selectedMinPrice}
          maxPrice={selectedMaxPrice}
          inStock={selectedInStock}
          onPriceChange={(min, max) => {
            setSelectedMinPrice(min);
            setSelectedMaxPrice(max);
          }}
          onStockChange={setSelectedInStock}
        />

        {/* Main Content Area */}
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ürünler yükleniyor...</p>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
