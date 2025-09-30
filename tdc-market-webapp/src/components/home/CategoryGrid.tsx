'use client';

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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-ink-900 mb-4">
            Kategorileri Keşfet
          </h2>
          <p className="text-xl text-ink-600 max-w-2xl mx-auto">
            Binlerce ürün arasından ihtiyacınıza uygun kategoriyi bulun
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onCategoryClick(category)}
              className="group cursor-pointer bg-white rounded-tdc shadow-tdc hover:shadow-tdc-lg transition-all duration-300 border border-gray-200 hover:border-primary-300 overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-primary-100 to-accent-100 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-tdc rounded-tdc mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="text-lg font-semibold text-ink-900 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-ink-600 text-sm mb-3">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-500">
                    {category.productCount} ürün
                  </span>
                  {category.isTrending && (
                    <span className="bg-accent-100 text-accent-600 px-2 py-1 rounded-full text-xs font-medium">
                      Trend
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
