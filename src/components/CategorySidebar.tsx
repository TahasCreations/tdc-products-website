'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  parent_id?: string | null;
  level?: number;
  created_at: string;
  updated_at: string;
}

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory?: string;
}

export default function CategorySidebar({ categories, selectedCategory }: CategorySidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createCategoryUrl = (categoryName: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryName === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryName);
    }
    return `${pathname}?${params.toString()}`;
  };

  // Kategorileri hiyerarşik olarak düzenle
  const parentCategories = categories.filter(cat => !cat.parent_id || cat.level === 0);
  const childCategories = categories.filter(cat => cat.parent_id && cat.level === 1);

  const getChildCategories = (parentId: string) => {
    return childCategories.filter(cat => cat.parent_id === parentId);
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-fit sticky top-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Kategoriler
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ürünleri kategorilere göre filtreleyin
        </p>
      </div>

      <div className="space-y-2">
        {/* Tüm Ürünler */}
        <Link
          href={createCategoryUrl('all')}
          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
            !selectedCategory
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
            !selectedCategory
              ? 'bg-white/20'
              : 'bg-gray-100 dark:bg-gray-600'
          }`}>
            <i className="ri-apps-line text-lg"></i>
          </div>
          <span className="font-medium">Tüm Ürünler</span>
          {!selectedCategory && (
            <div className="ml-auto bg-white/20 px-2 py-1 rounded-full text-xs">
              {categories.length > 0 ? categories.length : 0}
            </div>
          )}
        </Link>

        {/* Ana Kategoriler */}
        {parentCategories.map((category) => {
          const children = getChildCategories(category.id);
          return (
            <div key={category.id} className="space-y-1">
              {/* Ana Kategori */}
              <Link
                href={createCategoryUrl(category.name)}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    selectedCategory === category.name
                      ? 'bg-white/20'
                      : 'bg-gray-100 dark:bg-gray-600'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.name 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : category.color + '20'
                  }}
                >
                  <i 
                    className={`${category.icon} text-lg`}
                    style={{
                      color: selectedCategory === category.name 
                        ? 'white' 
                        : category.color
                    }}
                  ></i>
                </div>
                <span className="font-medium">{category.name}</span>
                {children.length > 0 && (
                  <div className="ml-auto">
                    <i className="ri-arrow-down-s-line text-sm"></i>
                  </div>
                )}
              </Link>

              {/* Alt Kategoriler */}
              {children.length > 0 && (
                <div className="ml-4 space-y-1">
                  {children.map((child) => (
                    <Link
                      key={child.id}
                      href={createCategoryUrl(child.name)}
                      className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 group text-sm ${
                        selectedCategory === child.name
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                          selectedCategory === child.name
                            ? 'bg-white/20'
                            : 'bg-gray-100 dark:bg-gray-600'
                        }`}
                        style={{
                          backgroundColor: selectedCategory === child.name 
                            ? 'rgba(255, 255, 255, 0.2)' 
                            : child.color + '20'
                        }}
                      >
                        <i 
                          className={`${child.icon} text-sm`}
                          style={{
                            color: selectedCategory === child.name 
                              ? 'white' 
                              : child.color
                          }}
                        ></i>
                      </div>
                      <span className="font-medium">{child.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Kategori İstatistikleri */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
          Kategori İstatistikleri
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Toplam Kategori:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {categories.length}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Aktif Kategori:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {selectedCategory ? 1 : 0}
            </span>
          </div>
        </div>
      </div>

      {/* Hızlı Eylemler */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
          Hızlı Eylemler
        </h4>
        <div className="space-y-2">
          <Link
            href="/cart"
            className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <i className="ri-shopping-cart-line mr-2"></i>
            Sepetim
          </Link>
          <Link
            href="/wishlist"
            className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <i className="ri-heart-line mr-2"></i>
            Favorilerim
          </Link>
        </div>
      </div>
    </div>
  );
}
