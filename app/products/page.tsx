"use client";
import { Suspense } from 'react';
import ProductFilters from '../../src/components/products/ProductFilters';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductGrid from '../../src/components/products/ProductGrid';
import ProductSorting from '../../src/components/products/ProductSorting';
import Breadcrumb from '../../src/components/ui/Breadcrumb';
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

// Mock data - in real app, this would come from API/database
const mockProducts = [
  {
    id: '1',
    title: 'Naruto Uzumaki Figürü - Shippuden',
    slug: 'naruto-uzumaki-figuru-shippuden',
    price: 299.99,
    listPrice: 399.99,
    currency: 'TRY',
    rating: 4.8,
    reviewCount: 156,
    stock: 25,
    images: ['products/naruto-figur-1.jpg'],
    tags: ['anime', 'naruto', 'figür', 'shippuden'],
    seller: {
      name: 'AnimeWorld Store',
      slug: 'animeworld-store',
      rating: 4.8,
      logo: 'https://via.placeholder.com/50x50/4F46E5/FFFFFF?text=AW'
    },
    category: {
      name: 'Anime Figürleri',
      slug: 'anime-figurleri'
    }
  },
  {
    id: '2',
    title: 'One Piece Luffy Figürü - Gear 4',
    slug: 'one-piece-luffy-figuru-gear-4',
    price: 459.99,
    listPrice: 599.99,
    currency: 'TRY',
    rating: 4.9,
    reviewCount: 89,
    stock: 15,
    images: ['https://via.placeholder.com/400x400/FF9F43/FFFFFF?text=Luffy'],
    tags: ['anime', 'one-piece', 'luffy', 'gear-4'],
    seller: {
      name: 'AnimeWorld Store',
      slug: 'animeworld-store',
      rating: 4.8,
      logo: 'https://via.placeholder.com/50x50/4F46E5/FFFFFF?text=AW'
    },
    category: {
      name: 'Anime Figürleri',
      slug: 'anime-figurleri'
    }
  },
  {
    id: '3',
    title: 'Iron Man Mark 85 Figürü',
    slug: 'iron-man-mark-85-figuru',
    price: 1299.99,
    listPrice: 1599.99,
    currency: 'TRY',
    rating: 4.7,
    reviewCount: 234,
    stock: 8,
    images: ['https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Iron+Man'],
    tags: ['marvel', 'iron-man', 'figür', 'led'],
    seller: {
      name: 'AnimeWorld Store',
      slug: 'animeworld-store',
      rating: 4.8,
      logo: 'https://via.placeholder.com/50x50/4F46E5/FFFFFF?text=AW'
    },
    category: {
      name: 'Film/TV Figürleri',
      slug: 'film-tv-figurleri'
    }
  },
  {
    id: '4',
    title: 'Anime Tişört - Naruto Collection',
    slug: 'anime-tisort-naruto-collection',
    price: 89.99,
    listPrice: 129.99,
    currency: 'TRY',
    rating: 4.5,
    reviewCount: 67,
    stock: 50,
    images: ['https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Naruto+T'],
    tags: ['tişört', 'naruto', 'anime', 'pamuklu'],
    seller: {
      name: 'FashionHub',
      slug: 'fashionhub',
      rating: 4.5,
      logo: 'https://via.placeholder.com/50x50/7C3AED/FFFFFF?text=FH'
    },
    category: {
      name: 'Tişört',
      slug: 'tisort'
    }
  },
  {
    id: '5',
    title: 'Kablosuz Kulaklık - Noise Cancelling',
    slug: 'kablosuz-kulaklik-noise-cancelling',
    price: 899.99,
    listPrice: 1199.99,
    currency: 'TRY',
    rating: 4.6,
    reviewCount: 189,
    stock: 30,
    images: ['https://via.placeholder.com/400x400/2C3E50/FFFFFF?text=Headphones'],
    tags: ['kulaklık', 'kablosuz', 'gürültü-engelleyici', 'bluetooth'],
    seller: {
      name: 'TechGear Pro',
      slug: 'techgear-pro',
      rating: 4.6,
      logo: 'https://via.placeholder.com/50x50/059669/FFFFFF?text=TG'
    },
    category: {
      name: 'Kulaklık',
      slug: 'kulaklik'
    }
  },
  {
    id: '6',
    title: 'LED Aydınlatma Seti - RGB',
    slug: 'led-aydinlatma-seti-rgb',
    price: 149.99,
    listPrice: 199.99,
    currency: 'TRY',
    rating: 4.4,
    reviewCount: 92,
    stock: 40,
    images: ['https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=LED'],
    tags: ['led', 'aydınlatma', 'rgb', 'uzaktan-kumanda'],
    seller: {
      name: 'HomeDecor Plus',
      slug: 'homedecor-plus',
      rating: 4.4,
      logo: 'https://via.placeholder.com/50x50/EA580C/FFFFFF?text=HD'
    },
    category: {
      name: 'Dekor',
      slug: 'dekor'
    }
  },
  {
    id: '7',
    title: 'Akrilik Boya Seti - 24 Renk',
    slug: 'akrilik-boya-seti-24-renk',
    price: 199.99,
    listPrice: 249.99,
    currency: 'TRY',
    rating: 4.7,
    reviewCount: 145,
    stock: 25,
    images: ['https://via.placeholder.com/400x400/FF9F43/FFFFFF?text=Paint'],
    tags: ['akrilik', 'boya', 'sanat', 'profesyonel'],
    seller: {
      name: 'ArtCraft Studio',
      slug: 'artcraft-studio',
      rating: 4.7,
      logo: 'https://via.placeholder.com/50x50/DC2626/FFFFFF?text=AC'
    },
    category: {
      name: 'Boya & Fırça',
      slug: 'boya-firca'
    }
  },
  {
    id: '8',
    title: 'Kişiye Özel Fotoğraf Çerçevesi',
    slug: 'kisiye-ozel-fotograf-cercevesi',
    price: 79.99,
    listPrice: 99.99,
    currency: 'TRY',
    rating: 4.8,
    reviewCount: 78,
    stock: 60,
    images: ['https://via.placeholder.com/400x400/8E44AD/FFFFFF?text=Frame'],
    tags: ['çerçeve', 'kişiye-özel', 'ahşap', 'gravür'],
    seller: {
      name: 'HomeDecor Plus',
      slug: 'homedecor-plus',
      rating: 4.4,
      logo: 'https://via.placeholder.com/50x50/EA580C/FFFFFF?text=HD'
    },
    category: {
      name: 'Kişiye Özel',
      slug: 'kisiye-ozel'
    }
  },
  {
    id: '9',
    title: 'Doğum Günü Hediyelik Seti',
    slug: 'dogum-gunu-hediyelik-seti',
    price: 149.99,
    listPrice: 179.99,
    currency: 'TRY',
    rating: 4.6,
    reviewCount: 56,
    stock: 35,
    images: ['https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=Gift+Set'],
    tags: ['hediye', 'doğum-günü', 'set', 'özel'],
    seller: {
      name: 'HomeDecor Plus',
      slug: 'homedecor-plus',
      rating: 4.4,
      logo: 'https://via.placeholder.com/50x50/EA580C/FFFFFF?text=HD'
    },
    category: {
      name: 'Doğum Günü',
      slug: 'dogum-gunu'
    }
  },
  {
    id: '10',
    title: 'Dragon Ball Goku Figürü - Super Saiyan',
    slug: 'dragon-ball-goku-figuru-super-saiyan',
    price: 349.99,
    listPrice: 449.99,
    currency: 'TRY',
    rating: 4.9,
    reviewCount: 203,
    stock: 12,
    images: ['https://via.placeholder.com/400x400/FFD93D/FFFFFF?text=Goku'],
    tags: ['anime', 'dragon-ball', 'goku', 'super-saiyan'],
    seller: {
      name: 'AnimeWorld Store',
      slug: 'animeworld-store',
      rating: 4.8,
      logo: 'https://via.placeholder.com/50x50/4F46E5/FFFFFF?text=AW'
    },
    category: {
      name: 'Anime Figürleri',
      slug: 'anime-figurleri'
    }
  }
];

const mockCategories = [
  { id: '1', name: 'Anime Figürleri', slug: 'anime-figurleri', count: 3 },
  { id: '2', name: 'Film/TV Figürleri', slug: 'film-tv-figurleri', count: 1 },
  { id: '3', name: 'Tişört', slug: 'tisort', count: 1 },
  { id: '4', name: 'Kulaklık', slug: 'kulaklik', count: 1 },
  { id: '5', name: 'Dekor', slug: 'dekor', count: 1 },
  { id: '6', name: 'Boya & Fırça', slug: 'boya-firca', count: 1 },
  { id: '7', name: 'Kişiye Özel', slug: 'kisiye-ozel', count: 1 },
  { id: '8', name: 'Doğum Günü', slug: 'dogum-gunu', count: 1 }
];

const mockSellers = [
  { id: '1', name: 'AnimeWorld Store', slug: 'animeworld-store', count: 4 },
  { id: '2', name: 'FashionHub', slug: 'fashionhub', count: 1 },
  { id: '3', name: 'TechGear Pro', slug: 'techgear-pro', count: 1 },
  { id: '4', name: 'HomeDecor Plus', slug: 'homedecor-plus', count: 3 },
  { id: '5', name: 'ArtCraft Studio', slug: 'artcraft-studio', count: 1 }
];

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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


        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filters Trigger */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              Gelişmiş Filtreler
            </button>
          </div>

          {/* Desktop Filters Sidebar - Enhanced Version */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Filtreler</h3>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-gray-700 mb-3">Kategoriler</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {[
                    { name: 'Figür & Koleksiyon', href: '/products?category=figur-koleksiyon', subcategories: ['Anime Figürleri', 'Film/TV Figürleri', 'Dioramalar', 'Koleksiyon Arabaları', 'Maket & Kitler', 'Limited Edition'] },
                    { name: 'Moda & Aksesuar', href: '/products?category=moda-aksesuar', subcategories: ['Tişört', 'Hoodie', 'Şapka', 'Takı & Bileklik', 'Çanta & Cüzdan', 'Ayakkabı'] },
                    { name: 'Elektronik', href: '/products?category=elektronik', subcategories: ['Kulaklık', 'Akıllı Ev', 'Aydınlatma', 'Hobi Elektroniği', '3D Yazıcı', 'Bilgisayar Aksesuarları'] },
                    { name: 'Ev & Yaşam', href: '/products?category=ev-yasam', subcategories: ['Dekor', 'Mutfak', 'Düzenleme', 'Banyo', 'Tekstil'] },
                    { name: 'Sanat & Hobi', href: '/products?category=sanat-hobi', subcategories: ['Boya & Fırça', 'Tuval', '3D Baskı', 'El Sanatları', 'Kırtasiye', 'Model & Maket'] },
                    { name: 'Hediyelik', href: '/products?category=hediyelik', subcategories: ['Kişiye Özel', 'Doğum Günü', 'Özel Gün Setleri', 'Kart & Aksesuar', 'Kurumsal Hediyeler'] }
                  ].map((cat) => (
                    <div key={cat.name} className="space-y-1">
                      <a
                        href={cat.href}
                        className={`block px-3 py-2 rounded text-xs font-medium transition-colors ${
                          category === cat.name.toLowerCase().replace(/\s+/g, '-')
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {cat.name}
                      </a>
                      {/* Subcategories */}
                      <div className="ml-4 space-y-1">
                        {cat.subcategories.slice(0, 3).map((subcat, index) => (
                          <a
                            key={index}
                            href={`${cat.href}&subcategory=${subcat.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block text-xs text-gray-600 hover:text-indigo-600 transition-colors py-1"
                          >
                            {subcat}
                          </a>
                        ))}
                        {cat.subcategories.length > 3 && (
                          <span className="text-xs text-gray-400">+{cat.subcategories.length - 3} daha</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Fiyat Aralığı</h4>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min ₺"
                    defaultValue={minPrice || ''}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max ₺"
                    defaultValue={maxPrice || ''}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Stock Filter */}
              <div className="mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={inStock}
                    className="w-3 h-3 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-xs text-gray-700">Stokta olanlar</span>
                </label>
              </div>

              {/* Clear Filters */}
              <button className="w-full text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                Filtreleri Temizle
              </button>
            </div>
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
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      <h2 className="text-base font-semibold text-gray-900">Kategoriler & Filtreler</h2>
                    </div>
                    <button onClick={() => setIsFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
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

          {/* Main Content */}
          <div className="flex-1">
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

            {/* Products Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <Suspense fallback={<ProductGridSkeleton />}>
                <ProductGrid 
                  products={paginatedProducts}
                  currentPage={page}
                  totalPages={totalPages}
                  totalProducts={filteredProducts.length}
                />
              </Suspense>
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
