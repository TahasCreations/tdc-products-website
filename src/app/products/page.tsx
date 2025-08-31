import { Suspense } from 'react';
import ProductCard from '../../../ProductCard';
import SearchAndFilter from '../../components/SearchAndFilter';
import SkeletonLoader from '../../components/SkeletonLoader';
import CategorySidebar from '../../components/CategorySidebar';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Ürünleri API'den çek
async function getProducts() {
  try {
    console.log('Ürünler sayfası: API\'den ürünler isteniyor...');
    
    const response = await fetch(`/api/products`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Ürünler sayfası:', data.length, 'ürün alındı');
      return data;
    }
    console.log('Ürünler sayfası: API yanıt vermedi, boş array döndürülüyor');
    return [];
  } catch (error) {
    console.error('Ürünler yüklenirken hata:', error);
    return [];
  }
}

// Kategorileri API'den çek
async function getCategories() {
  try {
    const response = await fetch(`/api/categories`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Kategoriler yüklenirken hata:', error);
    return [];
  }
}

// Filtreleme ve sıralama fonksiyonu
function filterAndSortProducts(products: any[], filters: any) {
  let filteredProducts = [...products];

  // Arama filtresi
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }

  // Kategori filtresi
  if (filters.category) {
    filteredProducts = filteredProducts.filter((product) =>
      product.category.toLowerCase() === filters.category.toLowerCase()
    );
  }

  // Fiyat aralığı filtresi
  if (filters.minPrice || filters.maxPrice) {
    filteredProducts = filteredProducts.filter((product) => {
      const price = parseFloat(product.price);
      const minPrice = filters.minPrice ? parseFloat(filters.minPrice) : 0;
      const maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
      return price >= minPrice && price <= maxPrice;
    });
  }

  // Sıralama
  switch (filters.sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
    case 'name-asc':
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
      break;
    case 'name-desc':
      filteredProducts.sort((a, b) => b.title.localeCompare(a.title, 'tr'));
      break;
    case 'oldest':
      filteredProducts.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      break;
    case 'newest':
    default:
      filteredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
  }

  return filteredProducts;
}

// Loading component
function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section Skeleton */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-white/20 rounded-lg mb-6 w-3/4 mx-auto"></div>
            <div className="h-6 bg-white/20 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Search and Filter Skeleton */}
      <section className="py-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-6"></div>
            <div className="flex gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid Skeleton */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonLoader count={8} type="product" />
        </div>
      </section>
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    category?: string; 
    search?: string; 
    minPrice?: string; 
    maxPrice?: string; 
    sortBy?: string; 
  }>;
}) {
  const params = await searchParams;
  const products = await getProducts();
  const categories = await getCategories();

  // Filtreleme ve sıralama
  const filteredProducts = filterAndSortProducts(products, {
    search: params.search,
    category: params.category,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    sortBy: params.sortBy
  });

  return (
    <Suspense fallback={<ProductsLoading />}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
              <div className="absolute top-40 right-20 w-72 h-72 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-40 w-72 h-72 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Ürünlerimiz
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Premium kalitede figürler ve koleksiyon ürünleri. En sevdiğiniz karakterlerin detaylı figürlerini keşfedin.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <SearchAndFilter
          categories={categories}
          totalProducts={filteredProducts.length}
          currentFilters={{
            search: params.search,
            category: params.category,
            minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
            maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
            sortBy: params.sortBy
          }}
        />

        {/* Products Grid with Sidebar */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Category Sidebar */}
              <div className="lg:w-64 flex-shrink-0">
                <CategorySidebar 
                  categories={categories} 
                  selectedCategory={params.category}
                />
              </div>

              {/* Products Content */}
              <div className="flex-1">
                {filteredProducts.length > 0 ? (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {params.category ? `${params.category} Kategorisi` : 'Tüm Ürünler'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {filteredProducts.length} ürün bulundu
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                      {filteredProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <i className="ri-shopping-bag-line text-3xl text-white"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                      Ürün Bulunamadı
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                      Aradığınız kriterlere uygun ürün bulunamadı. Farklı bir arama yapmayı deneyin.
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-full hover:scale-105 transition-all duration-300"
                    >
                      Tüm Ürünleri Gör
                      <i className="ri-arrow-right-line ml-2"></i>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Suspense>
  );
}
