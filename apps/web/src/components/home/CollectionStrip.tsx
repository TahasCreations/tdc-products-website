'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, StarIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
}

interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
  products: Product[];
}

interface CollectionStripProps {
  collections: Collection[];
  onProductClick: (product: Product) => void;
  onCollectionClick: (collection: Collection) => void;
}

export default function CollectionStrip({ 
  collections, 
  onProductClick, 
  onCollectionClick 
}: CollectionStripProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 to-primary-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-clash font-bold text-ink-900 mb-4">
            Kürasyon Şeritleri
          </h2>
          <p className="text-xl text-ink-600 max-w-2xl mx-auto">
            Özenle seçilmiş koleksiyonlar ve özel fırsatlar
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {collections.map((collection, collectionIndex) => (
            <div
              key={collection.id}
              className="bg-white rounded-tdc shadow-tdc-lg hover:shadow-tdc-xl transition-all duration-300 overflow-hidden group"
              style={{ animationDelay: `${collectionIndex * 200}ms` }}
            >
              {/* Collection Header */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {collection.title}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {collection.description}
                  </p>
                </div>

                {/* View Collection Button */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => onCollectionClick(collection)}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label={`${collection.title} koleksiyonunu görüntüle`}
                  >
                    <EyeIcon className="w-4 h-4 mr-1 inline" />
                    Görüntüle
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {collection.products.slice(0, 4).map((product, productIndex) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={() => onProductClick(product)}
                      className="group/product bg-neutral-50 rounded-lg p-3 hover:bg-white hover:shadow-tdc transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      aria-label={`${product.name} ürününü görüntüle`}
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square mb-2 overflow-hidden rounded-lg bg-white">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover/product:scale-105 transition-transform duration-300"
                          loading="lazy"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-ink-900 line-clamp-2 group-hover/product:text-primary-600 transition-colors duration-300">
                          {product.name}
                        </h4>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-ink-900">
                            ₺{product.price.toFixed(2)}
                          </span>
                          
                          <div className="flex items-center text-xs text-ink-500">
                            <StarIcon className="w-3 h-3 text-warning-500 mr-1" />
                            <span>{product.rating}</span>
                            <span className="ml-1">({product.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View All Products */}
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <Link
                    href={`/collections/${collection.id}`}
                    className="flex items-center justify-center w-full text-primary-600 hover:text-primary-700 font-medium text-sm group/link transition-colors duration-300"
                    aria-label={`${collection.title} koleksiyonundaki tüm ürünleri görüntüle`}
                  >
                    Tüm ürünleri gör
                    <ArrowRightIcon className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Special Collections Row */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.slice(2).map((collection, index) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              onClick={() => onCollectionClick(collection)}
              className="group bg-white rounded-tdc shadow-tdc hover:shadow-tdc-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              style={{ animationDelay: `${(index + 2) * 200}ms` }}
              aria-label={`${collection.title} koleksiyonunu görüntüle`}
            >
              {/* Collection Image */}
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              {/* Collection Info */}
              <div className="p-4">
                <h3 className="font-semibold text-ink-900 mb-1 group-hover:text-primary-600 transition-colors duration-300">
                  {collection.title}
                </h3>
                <p className="text-sm text-ink-600 line-clamp-2">
                  {collection.description}
                </p>
                <div className="flex items-center mt-2 text-primary-600 group-hover:text-primary-700 transition-colors duration-300">
                  <span className="text-sm font-medium mr-1">Keşfet</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

