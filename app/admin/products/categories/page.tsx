'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FolderOpen, Plus, Edit2, Trash2, ChevronRight, ChevronDown, Search, Eye, EyeOff } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  isActive: boolean;
  icon: string;
  parentId: string | null;
  children?: Category[];
}

export default function ProductCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['cat-1', 'cat-2']);
  const [showInactive, setShowInactive] = useState(false);

  // Veriler API'den gelecek - şimdilik boş
  const categories: Category[] = [
    /* Demo veriler temizlendi */
  ];
  
  // Eski mock data temizlendi
  const oldMockCategories: Category[] = [
    {
      id: 'cat-1',
      name: 'Elektronik',
      slug: 'elektronik',
      description: 'Elektronik ürünler ve aksesuarlar',
      productCount: 1247,
      isActive: true,
      icon: '📱',
      parentId: null,
      children: [
        {
          id: 'cat-1-1',
          name: 'Telefonlar',
          slug: 'telefonlar',
          description: 'Akıllı telefonlar ve cep telefonları',
          productCount: 456,
          isActive: true,
          icon: '📱',
          parentId: 'cat-1',
          children: [
            {
              id: 'cat-1-1-1',
              name: 'iPhone',
              slug: 'iphone',
              description: 'Apple iPhone modelleri',
              productCount: 189,
              isActive: true,
              icon: '🍎',
              parentId: 'cat-1-1'
            },
            {
              id: 'cat-1-1-2',
              name: 'Samsung',
              slug: 'samsung',
              description: 'Samsung Galaxy serisi',
              productCount: 156,
              isActive: true,
              icon: '📱',
              parentId: 'cat-1-1'
            },
            {
              id: 'cat-1-1-3',
              name: 'Xiaomi',
              slug: 'xiaomi',
              description: 'Xiaomi akıllı telefonlar',
              productCount: 111,
              isActive: true,
              icon: '📱',
              parentId: 'cat-1-1'
            }
          ]
        },
        {
          id: 'cat-1-2',
          name: 'Bilgisayarlar',
          slug: 'bilgisayarlar',
          description: 'Dizüstü ve masaüstü bilgisayarlar',
          productCount: 389,
          isActive: true,
          icon: '💻',
          parentId: 'cat-1',
          children: [
            {
              id: 'cat-1-2-1',
              name: 'Dizüstü',
              slug: 'dizustu',
              description: 'Laptop ve notebook',
              productCount: 234,
              isActive: true,
              icon: '💻',
              parentId: 'cat-1-2'
            },
            {
              id: 'cat-1-2-2',
              name: 'Masaüstü',
              slug: 'masaustu',
              description: 'Desktop bilgisayarlar',
              productCount: 155,
              isActive: true,
              icon: '🖥️',
              parentId: 'cat-1-2'
            }
          ]
        },
        {
          id: 'cat-1-3',
          name: 'Ses Sistemleri',
          slug: 'ses-sistemleri',
          description: 'Kulaklık, hoparlör ve ses ekipmanları',
          productCount: 402,
          isActive: true,
          icon: '🎧',
          parentId: 'cat-1'
        }
      ]
    },
    {
      id: 'cat-2',
      name: 'Giyim & Aksesuar',
      slug: 'giyim-aksesuar',
      description: 'Kıyafet, ayakkabı ve aksesuarlar',
      productCount: 2156,
      isActive: true,
      icon: '👕',
      parentId: null,
      children: [
        {
          id: 'cat-2-1',
          name: 'Erkek Giyim',
          slug: 'erkek-giyim',
          description: 'Erkek kıyafetleri',
          productCount: 789,
          isActive: true,
          icon: '👔',
          parentId: 'cat-2'
        },
        {
          id: 'cat-2-2',
          name: 'Kadın Giyim',
          slug: 'kadin-giyim',
          description: 'Kadın kıyafetleri',
          productCount: 1123,
          isActive: true,
          icon: '👗',
          parentId: 'cat-2'
        },
        {
          id: 'cat-2-3',
          name: 'Ayakkabı',
          slug: 'ayakkabi',
          description: 'Erkek ve kadın ayakkabıları',
          productCount: 244,
          isActive: true,
          icon: '👟',
          parentId: 'cat-2'
        }
      ]
    },
    {
      id: 'cat-3',
      name: 'Ev & Yaşam',
      slug: 'ev-yasam',
      description: 'Ev eşyaları ve dekorasyon',
      productCount: 1534,
      isActive: true,
      icon: '🏠',
      parentId: null,
      children: [
        {
          id: 'cat-3-1',
          name: 'Mobilya',
          slug: 'mobilya',
          description: 'Ev mobilyaları',
          productCount: 567,
          isActive: true,
          icon: '🛋️',
          parentId: 'cat-3'
        },
        {
          id: 'cat-3-2',
          name: 'Dekorasyon',
          slug: 'dekorasyon',
          description: 'Dekoratif ürünler',
          productCount: 423,
          isActive: true,
          icon: '🖼️',
          parentId: 'cat-3'
        },
        {
          id: 'cat-3-3',
          name: 'Mutfak',
          slug: 'mutfak',
          description: 'Mutfak gereçleri',
          productCount: 544,
          isActive: false,
          icon: '🍳',
          parentId: 'cat-3'
        }
      ]
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filterCategories = (cats: Category[]): Category[] => {
    return cats.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           cat.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesActive = showInactive || cat.isActive;
      
      if (cat.children) {
        cat.children = filterCategories(cat.children);
      }
      
      return matchesSearch && matchesActive;
    });
  };

  const filteredCategories = filterCategories(JSON.parse(JSON.stringify(categories)));

  const CategoryItem = ({ category, level = 0 }: { category: Category; level?: number }) => {
    const isExpanded = expandedCategories.includes(category.id);
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all ${
            !category.isActive ? 'opacity-60' : ''
          }`}
          style={{ marginLeft: `${level * 2}rem` }}
        >
          <div className="flex items-center space-x-4 flex-1">
            {hasChildren && (
              <button
                onClick={() => toggleCategory(category.id)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-7" />}
            
            <div className="flex items-center space-x-3 flex-1">
              <span className="text-2xl">{category.icon}</span>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                  {!category.isActive && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                      Pasif
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    Slug: <span className="font-mono">{category.slug}</span>
                  </span>
                  <span className="text-xs font-semibold text-[#CBA135]">
                    {category.productCount} ürün
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-2 text-[#CBA135] hover:bg-[#CBA135]/10 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-2"
            >
              {category.children!.map(child => (
                <CategoryItem key={child.id} category={child} level={level + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);
  const activeCategories = categories.filter(c => c.isActive).length;
  const totalCategories = categories.reduce((sum, cat) => {
    let count = 1;
    if (cat.children) {
      count += cat.children.length;
      cat.children.forEach(child => {
        if (child.children) count += child.children.length;
      });
    }
    return sum + count;
  }, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kategori Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Ürün kategorilerini organize edin ve yönetin</p>
        </div>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black px-4 py-2 rounded-lg hover:shadow-lg transition-all font-bold">
          <Plus className="w-4 h-4" />
          <span>Yeni Kategori</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <Folder className="w-8 h-8 text-[#CBA135]" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalCategories}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Kategori</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <FolderOpen className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{activeCategories}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Aktif Kategori</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">📦</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Ürün</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">🎯</span>
          </div>
          <div className="text-2xl font-bold text-black">{categories.length}</div>
          <div className="text-sm text-black/70">Ana Kategori</div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Kategori adı veya slug ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <button
            onClick={() => setShowInactive(!showInactive)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showInactive
                ? 'bg-[#CBA135] text-black'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {showInactive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{showInactive ? 'Pasif Göster' : 'Pasif Gizle'}</span>
          </button>
          <button
            onClick={() => setExpandedCategories(categories.map(c => c.id))}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Tümünü Aç
          </button>
          <button
            onClick={() => setExpandedCategories([])}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Tümünü Kapat
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        {filteredCategories.map(category => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Kategori Bulunamadı</h3>
          <p className="text-gray-600 dark:text-gray-400">Arama kriterlerinize uygun kategori bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
