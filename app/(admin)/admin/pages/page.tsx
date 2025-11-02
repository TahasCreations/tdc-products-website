'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileText, Layout, ShoppingBag, Newspaper, Mail, Info, Shield, Package, Edit, Eye, Trash2 } from 'lucide-react';

interface Page {
  id: string;
  title: string;
  slug: string;
  type: 'static' | 'dynamic' | 'category' | 'product';
  status: 'published' | 'draft';
  lastModified: string;
  icon: React.ReactNode;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [filter, setFilter] = useState<'all' | 'static' | 'dynamic' | 'category'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Mevcut tüm sayfaları yükle
    loadAllPages();
  }, []);

  const loadAllPages = () => {
    // Sitenizde mevcut olan TÜM sayfalar
    const allPages: Page[] = [
      // Ana Sayfalar
      {
        id: 'home',
        title: 'Anasayfa',
        slug: '/',
        type: 'static',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Layout className="w-5 h-5" />
      },
      {
        id: 'products-list',
        title: 'Ürünler Listesi',
        slug: '/products',
        type: 'dynamic',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <ShoppingBag className="w-5 h-5" />
      },
      
      // Kategori Sayfaları
      {
        id: 'cat-figur',
        title: 'Figür & Koleksiyon',
        slug: '/categories/figur-koleksiyon',
        type: 'category',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />
      },
      {
        id: 'cat-moda',
        title: 'Moda & Aksesuar',
        slug: '/categories/moda-aksesuar',
        type: 'category',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />
      },
      {
        id: 'cat-elektronik',
        title: 'Elektronik',
        slug: '/categories/elektronik',
        type: 'category',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />
      },
      {
        id: 'cat-ev',
        title: 'Ev & Yaşam',
        slug: '/categories/ev-yasam',
        type: 'category',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />
      },
      {
        id: 'cat-sanat',
        title: 'Sanat & Hobi',
        slug: '/categories/sanat-hobi',
        type: 'category',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />
      },
      {
        id: 'cat-hediye',
        title: 'Hediyelik',
        slug: '/categories/hediyelik',
        type: 'category',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />
      },
      
      // Statik Sayfalar
      {
        id: 'about',
        title: 'Hakkımızda',
        slug: '/about',
        type: 'static',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Info className="w-5 h-5" />
      },
      {
        id: 'contact',
        title: 'İletişim',
        slug: '/contact',
        type: 'static',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Mail className="w-5 h-5" />
      },
      {
        id: 'blog',
        title: 'Blog',
        slug: '/blog',
        type: 'dynamic',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Newspaper className="w-5 h-5" />
      },
      {
        id: 'privacy',
        title: 'Gizlilik Politikası',
        slug: '/privacy',
        type: 'static',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Shield className="w-5 h-5" />
      },
      {
        id: 'terms',
        title: 'Kullanım Şartları',
        slug: '/terms',
        type: 'static',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Shield className="w-5 h-5" />
      },
      {
        id: 'faq',
        title: 'Sık Sorulan Sorular',
        slug: '/faq',
        type: 'static',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <FileText className="w-5 h-5" />
      },
      {
        id: 'shipping',
        title: 'Kargo & İade',
        slug: '/shipping',
        type: 'static',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <FileText className="w-5 h-5" />
      }
    ];

    setPages(allPages);
  };

  const filteredPages = pages.filter(page => {
    const matchesFilter = filter === 'all' || page.type === filter;
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'static': return 'Statik';
      case 'dynamic': return 'Dinamik';
      case 'category': return 'Kategori';
      case 'product': return 'Ürün';
      default: return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch(type) {
      case 'static': return 'bg-blue-100 text-blue-700';
      case 'dynamic': return 'bg-purple-100 text-purple-700';
      case 'category': return 'bg-green-100 text-green-700';
      case 'product': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sayfalar</h1>
        <p className="text-gray-600">Sitenizd ki tüm sayfaları görüntüleyin ve düzenleyin</p>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Sayfa ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Tümü' },
            { value: 'static', label: 'Statik' },
            { value: 'category', label: 'Kategori' },
            { value: 'dynamic', label: 'Dinamik' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Toplam Sayfa</div>
          <div className="text-2xl font-bold text-gray-900">{pages.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Statik Sayfalar</div>
          <div className="text-2xl font-bold text-blue-600">
            {pages.filter(p => p.type === 'static').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Kategori Sayfaları</div>
          <div className="text-2xl font-bold text-green-600">
            {pages.filter(p => p.type === 'category').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Dinamik Sayfalar</div>
          <div className="text-2xl font-bold text-purple-600">
            {pages.filter(p => p.type === 'dynamic').length}
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sayfa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tip
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPages.map((page) => (
              <motion.tr
                key={page.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-gray-400">
                      {page.icon}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {page.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 font-mono">
                    {page.slug}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(page.type)}`}>
                    {getTypeLabel(page.type)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    page.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {page.status === 'published' ? 'Yayında' : 'Taslak'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/pages/${page.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <a
                      href={page.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Önizle"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredPages.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Sayfa bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}

