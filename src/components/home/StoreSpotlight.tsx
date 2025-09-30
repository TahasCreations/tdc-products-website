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
            Doğrulanmış mağazalardan özel ürünler
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
                    <span className="text-2xl">🏪</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-ink-900 group-hover:text-primary-600 transition-colors">
                        {store.name}
                      </h3>
                      {store.isVerified && (
                        <span className="text-primary-500" title="Doğrulanmış Mağaza">
                          ✓
                        </span>
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
                      <span className="text-sm font-semibold text-ink-900">
                        {store.rating}
                      </span>
                      <span className="text-sm text-ink-500">
                        ({store.reviewCount})
                      </span>
                    </div>
                    <div className="text-sm text-ink-500">
                      {store.productCount} ürün
                    </div>
                  </div>
                </div>

                <button className="w-full bg-primary-500 text-white py-3 px-6 rounded-tdc font-semibold hover:bg-primary-600 transition-colors">
                  Mağazayı Ziyaret Et
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}