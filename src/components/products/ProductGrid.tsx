'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { gcsObjectPublicUrl } from '@/src/lib/gcs';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  listPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  tags: string[];
  seller: {
    name: string;
    slug: string;
    rating: number;
    logo?: string;
  };
  category: {
    name: string;
    slug: string;
  };
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalProducts?: number;
}

export default function ProductGrid({ 
  products, 
  loading = false, 
  currentPage = 1, 
  totalPages = 1, 
  totalProducts = 0 
}: ProductGridProps) {
  if (loading) {
    return <ProductGridSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün bulunamadı</h3>
        <p className="text-gray-600 mb-4">Arama kriterlerinize uygun ürün bulunamadı.</p>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Filtreleri Sıfırla
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {totalProducts} ürün bulundu
          {currentPage > 1 && ` • Sayfa ${currentPage} / ${totalPages}`}
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Görüntüleme:</span>
          <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="48">48</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <button
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Önceki
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                className={`px-3 py-2 border rounded-md text-sm font-medium ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const discountPercentage = product.listPrice && product.listPrice > product.price 
    ? Math.round(((product.listPrice - product.price) / product.listPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={gcsObjectPublicUrl(product.images[0])}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              %{discountPercentage} İndirim
            </div>
          )}
          
          {/* Stock Status */}
          <div className="absolute top-2 right-2">
            {product.stock > 0 ? (
              <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                Stokta
              </div>
            ) : (
              <div className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                Stokta Yok
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <div className="text-xs text-indigo-600 font-medium mb-1">
            {product.category.name}
          </div>
          
          {/* Title */}
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
          
          {/* Seller */}
          <div className="flex items-center space-x-2 mb-2">
            {product.seller.logo && (
              <img
                src={gcsObjectPublicUrl(product.seller.logo)}
                alt={product.seller.name}
                className="w-4 h-4 rounded-full"
              />
            )}
            <span className="text-xs text-gray-600">{product.seller.name}</span>
          </div>
          
          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.reviewCount})</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {product.price} {product.currency}
            </span>
            {product.listPrice && product.listPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {product.listPrice} {product.currency}
              </span>
            )}
          </div>
          
          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200"></div>
          <div className="p-4">
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}