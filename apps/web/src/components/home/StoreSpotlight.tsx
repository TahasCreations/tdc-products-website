'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  StarIcon, 
  CheckBadgeIcon, 
  ArrowRightIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  category: string;
}

interface StoreSpotlightProps {
  stores: Store[];
  onStoreClick: (store: Store) => void;
}

export default function StoreSpotlight({ stores, onStoreClick }: StoreSpotlightProps) {
  const featuredStores = stores.filter(store => store.isFeatured);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-clash font-bold text-ink-900 mb-4">
            Mağaza Vitrini
          </h2>
          <p className="text-xl text-ink-600 max-w-2xl mx-auto">
            Doğrulanmış satıcılarımızın özel koleksiyonlarını keşfedin
          </p>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredStores.map((store, index) => (
            <div
              key={store.id}
              className="group bg-white rounded-tdc shadow-tdc-lg hover:shadow-tdc-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Store Header */}
              <div className="relative p-6 pb-4">
                {/* Store Logo and Info */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative w-16 h-16 rounded-tdc overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 flex-shrink-0">
                    <Image
                      src={store.logo}
                      alt={store.name}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="64px"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-xl font-bold text-ink-900 truncate group-hover:text-primary-600 transition-colors duration-300">
                        {store.name}
                      </h3>
                      
                      {/* Verified Badge */}
                      {store.isVerified && (
                        <div className="flex items-center bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium">
                          <CheckBadgeIcon className="w-3 h-3 mr-1" />
                          Doğrulanmış
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-ink-600 line-clamp-2 mb-2">
                      {store.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-ink-500">
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-warning-500 mr-1" />
                        <span className="font-medium">{store.rating}</span>
                        <span className="ml-1">({store.reviewCount})</span>
                      </div>
                      <div>
                        {store.productCount} ürün
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
                  {store.category}
                </div>
              </div>

              {/* Store Stats */}
              <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-ink-900">
                      {store.rating}
                    </div>
                    <div className="text-xs text-ink-500">Puan</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-ink-900">
                      {store.reviewCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-ink-500">Değerlendirme</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-ink-900">
                      {store.productCount}
                    </div>
                    <div className="text-xs text-ink-500">Ürün</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-4 space-y-3">
                <Link
                  href={`/store/${store.slug}`}
                  onClick={() => onStoreClick(store)}
                  className="w-full bg-gradient-tdc text-white py-3 px-4 rounded-tdc font-semibold text-center hover:shadow-tdc-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 group/btn focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label={`${store.name} mağazasını ziyaret et`}
                >
                  <EyeIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                  <span>Mağazaya Git</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Link>
                
                <button
                  className="w-full bg-white border-2 border-primary-200 text-primary-700 py-3 px-4 rounded-tdc font-semibold hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 flex items-center justify-center space-x-2 group/favorite focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label={`${store.name} mağazasını favorilere ekle`}
                >
                  <HeartIcon className="w-5 h-5 group-hover/favorite:scale-110 transition-transform duration-300" />
                  <span>Favorilere Ekle</span>
                </button>
              </div>

              {/* Special Badges */}
              <div className="absolute top-4 right-4 space-y-2">
                {store.isFeatured && (
                  <div className="bg-gradient-tdc text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    Öne Çıkan
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View All Stores CTA */}
        <div className="text-center mt-12">
          <Link
            href="/stores"
            className="inline-flex items-center px-8 py-4 bg-gradient-tdc text-white text-lg font-semibold rounded-tdc shadow-tdc-lg hover:shadow-tdc-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Tüm mağazaları görüntüle"
          >
            Tüm Mağazaları Keşfet
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </div>

        {/* Become a Seller CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-accent-50 rounded-tdc p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-clash font-bold text-ink-900 mb-4">
              Mağazanı Aç — 5 dakikada yayında
            </h3>
            <p className="text-lg text-ink-600 mb-6">
              Şirketin yok mu? Faturalamayı biz üstleniyoruz. Özel domain, düşük komisyon, AI araçlar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/become-seller"
                className="inline-flex items-center px-8 py-4 bg-gradient-tdc text-white text-lg font-semibold rounded-tdc shadow-tdc-lg hover:shadow-tdc-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Satıcı ol"
              >
                <StarIcon className="w-5 h-5 mr-2" />
                Satıcı Ol
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                href="/seller-benefits"
                className="inline-flex items-center px-8 py-4 bg-white text-ink-700 text-lg font-semibold rounded-tdc border-2 border-ink-200 hover:border-primary-300 hover:bg-primary-50 shadow-tdc hover:shadow-tdc-lg transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Avantajları öğren"
              >
                Avantajları Öğren
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

