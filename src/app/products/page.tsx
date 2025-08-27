import { Suspense } from 'react';
import ProductCard from '../blog/BlogCard';

// Ürünleri API'den çek
async function getProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`, {
      cache: 'no-store'
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/categories`, {
      cache: 'no-store'
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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const products = await getProducts();
  const categories = await getCategories();

  // Filtreleme
  let filteredProducts = products;
  
  if (params.category) {
    filteredProducts = products.filter((product: any) => 
      product.category.toLowerCase() === params.category?.toLowerCase()
    );
  }
  
  if (params.search) {
    filteredProducts = filteredProducts.filter((product: any) =>
      product.title.toLowerCase().includes(params.search?.toLowerCase() || '') ||
      product.description.toLowerCase().includes(params.search?.toLowerCase() || '')
    );
  }

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

      {/* Filters Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <form method="GET" className="relative">
                                 <input
                   type="text"
                   name="search"
                   placeholder="Ürün ara..."
                   defaultValue={params.search}
                   className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                 />
                <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
              </form>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-3">
                             <a
                 href="/products"
                 className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                   !params.category
                     ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                 }`}
               >
                 Tümü
               </a>
               {categories.map((category: any) => (
                 <a
                   key={category.id}
                   href={`/products?category=${category.name}`}
                   className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                     params.category === category.name
                       ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                   }`}
                 >
                   {category.name}
                 </a>
               ))}
            </div>
          </div>
        </div>
      </section>

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
