'use client';

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

export default function CollectionStrip({ collections, onProductClick, onCollectionClick }: CollectionStripProps) {
  return (
    <section className="py-16 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-ink-900 mb-4">
            Özel Koleksiyonlar
          </h2>
          <p className="text-xl text-ink-600 max-w-2xl mx-auto">
            Dikkatle seçilmiş ürün koleksiyonları
          </p>
        </div>

        <div className="space-y-12">
          {collections.map((collection) => (
            <div key={collection.id} className="bg-white rounded-tdc shadow-tdc overflow-hidden">
              <div className="p-8 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-ink-900 mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-ink-600">{collection.description}</p>
                  </div>
                  <button
                    onClick={() => onCollectionClick(collection)}
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Tümünü Gör →
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {collection.products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => onProductClick(product)}
                      className="group cursor-pointer bg-white rounded-tdc border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                      <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-primary-100 to-accent-100 p-6 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-tdc rounded-tdc mx-auto mb-3 flex items-center justify-center">
                            <span className="text-lg">🎨</span>
                          </div>
                          <h4 className="font-semibold text-ink-900 group-hover:text-primary-600 transition-colors">
                            {product.name}
                          </h4>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-ink-900">
                            ₺{product.price}
                          </span>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm text-ink-600">{product.rating}</span>
                            <span className="text-sm text-ink-500">({product.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
