'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, FireIcon } from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
  isTrending: boolean;
}

interface CategoryGridProps {
  categories: Category[];
  onCategoryClick: (category: Category) => void;
}

export default function CategoryGrid({ categories, onCategoryClick }: CategoryGridProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-clash font-bold text-ink-900 mb-4">
            Kategori Keşfi
          </h2>
          <p className="text-xl text-ink-600 max-w-2xl mx-auto">
            İlgi alanınıza göre kategorileri keşfedin ve binlerce ürün arasından seçim yapın
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              onClick={() => onCategoryClick(category)}
              className="group relative bg-white rounded-tdc shadow-tdc hover:shadow-tdc-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              style={{ animationDelay: `${index * 100}ms` }}
              aria-label={`${category.name} kategorisini görüntüle`}
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-tdc opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tdc"></div>
              <div className="absolute inset-[1px] bg-white rounded-tdc"></div>
              
              {/* Content */}
              <div className="relative p-6">
                {/* Image Container */}
                <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-primary-50 to-accent-50">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  
                  {/* Trending Badge */}
                  {category.isTrending && (
                    <div className="absolute top-3 right-3 bg-gradient-tdc text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
                      <FireIcon className="w-3 h-3 mr-1" />
                      Trend
                    </div>
                  )}
                </div>

                {/* Category Info */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-ink-900 group-hover:text-primary-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                  
                  <p className="text-ink-600 text-sm line-clamp-2">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-ink-500">
                      {category.productCount.toLocaleString()} ürün
                    </span>
                    
                    <div className="flex items-center text-primary-600 group-hover:text-primary-700 transition-colors duration-300">
                      <span className="text-sm font-medium mr-1">Keşfet</span>
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tdc"></div>
            </Link>
          ))}
        </div>

        {/* View All Categories CTA */}
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center px-8 py-4 bg-gradient-tdc text-white text-lg font-semibold rounded-tdc shadow-tdc-lg hover:shadow-tdc-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Tüm kategorileri görüntüle"
          >
            Tüm Kategorileri Gör
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}

