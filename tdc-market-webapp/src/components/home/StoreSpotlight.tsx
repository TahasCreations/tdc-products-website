'use client';

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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-ink-900 mb-4">
            Öne Çıkan Mağazalar
          </h2>
          <p className="text-xl text-ink-600 max-w-2xl mx-auto">
            Doğrulanmış satıcılarımızın özel koleksiyonları
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredStores.map((store) => (
            <div
              key={store.id}
              onClick={() => onStoreClick(store)}
              className="group cursor-pointer bg-white rounded-tdc shadow-tdc hover:shadow-tdc-lg transition-all duration-300 border border-gray-200 hover:border-primary-300 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-tdc rounded-tdc flex items-center justify-center">
                    <span className="text-2xl text-white">🏪</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-ink-900 group-hover:text-primary-600 transition-colors">
                        {store.name}
                      </h3>
                      {store.isVerified && (
                        <div className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-ink-600 text-sm">{store.category}</p>
                  </div>
                </div>

                <p className="text-ink-600 mb-6 line-clamp-2">
                  {store.description}
                </p>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-semibold text-ink-900">{store.rating}</span>
                      <span className="text-sm text-ink-500">({store.reviewCount})</span>
                    </div>
                    <div className="text-sm text-ink-500">
                      {store.productCount} ürün
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-500">Özel domain</span>
                  <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm group-hover:underline">
                    Mağazaya Git →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
