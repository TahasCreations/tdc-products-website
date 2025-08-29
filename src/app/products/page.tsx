import { Suspense } from 'react';
import ProductCard from '../blog/BlogCard';
import SearchAndFilter from '../../components/SearchAndFilter';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// Ürünleri API'den çek
async function getProducts() {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    
    const response = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 60 } // 60 saniye cache
    });
    
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Ürünler yüklenirken hata:', error);
    return [];
  }
}

// Kategorileri API'den çek
async function getCategories() {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    
    const response = await fetch(`${baseUrl}/api/categories`, {
      next: { revalidate: 60 } // 60 saniye cache
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
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

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {params.category ? `${params.category} Kategorisi` : 'Tüm Ürünler'}
                </h2>
                <p className="text-gray-600">
                  {filteredProducts.length} ürün bulundu
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product: any) => (
                  <div key={product.id} className="group">
                    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden glow-effect">
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Product Image */}
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {product.category}
                          </span>
                          <span className="text-2xl font-bold text-gray-900">
                            ₺{product.price}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Stok: {product.stock}
                          </span>
                          <a
                            href={`/products/${product.slug}`}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            Detaylar
                            <i className="ri-arrow-right-line ml-1"></i>
                          </a>
                        </div>
                      </div>

                      {/* Glow Border */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-shopping-bag-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ürün Bulunamadı
              </h3>
              <p className="text-gray-600 mb-8">
                Aradığınız kriterlere uygun ürün bulunamadı. Farklı bir arama yapmayı deneyin.
              </p>
              <a
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-full hover:scale-105 transition-all duration-300"
              >
                Tüm Ürünleri Gör
                <i className="ri-arrow-right-line ml-2"></i>
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
