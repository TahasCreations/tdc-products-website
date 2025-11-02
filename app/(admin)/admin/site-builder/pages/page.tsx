'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileText, Layout, ShoppingBag, Newspaper, Mail, Info, Shield, Package, Edit, Eye, Plus, Grid3x3, Image as ImageIcon } from 'lucide-react';

interface Page {
  id: string;
  title: string;
  slug: string;
  type: 'home' | 'category' | 'static' | 'dynamic';
  status: 'published' | 'draft';
  lastModified: string;
  icon: React.ReactNode;
  description: string;
}

export default function SiteBuilderPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'home' | 'category' | 'static' | 'dynamic'>('all');

  useEffect(() => {
    loadAllSitePages();
  }, []);

  const loadAllSitePages = () => {
    // SİTENİZDEKİ TÜM MEVCUT SAYFALAR
    const allSitePages: Page[] = [
      // ANASAYFA
      {
        id: 'home',
        title: 'Anasayfa',
        slug: '/',
        type: 'home',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Layout className="w-5 h-5" />,
        description: 'TDC Market ana sayfası - Hero, kategoriler, ürünler, maskot'
      },

      // KATEGORİ LANSMAN SAYFALARI (6 adet)
      {
        id: 'cat-figur',
        title: 'Figür & Koleksiyon',
        slug: '/categories/figur-koleksiyon',
        type: 'category',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />,
        description: 'Anime, manga, funko pop ve koleksiyon figürleri kategorisi'
      },
      {
        id: 'cat-moda',
        title: 'Moda & Aksesuar',
        slug: '/categories/moda-aksesuar',
        type: 'category',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />,
        description: 'Takı, saat, çanta ve aksesuar kategorisi'
      },
      {
        id: 'cat-elektronik',
        title: 'Elektronik',
        slug: '/categories/elektronik',
        type: 'category',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />,
        description: 'Telefon, bilgisayar ve elektronik aksesuar kategorisi'
      },
      {
        id: 'cat-ev',
        title: 'Ev & Yaşam',
        slug: '/categories/ev-yasam',
        type: 'category',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />,
        description: 'Dekorasyon, mutfak ve ev eşyaları kategorisi'
      },
      {
        id: 'cat-sanat',
        title: 'Sanat & Hobi',
        slug: '/categories/sanat-hobi',
        type: 'category',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />,
        description: 'Resim, heykel ve hobi malzemeleri kategorisi'
      },
      {
        id: 'cat-hediye',
        title: 'Hediyelik',
        slug: '/categories/hediyelik',
        type: 'category',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />,
        description: 'Özel günler için hediye ürünleri kategorisi'
      },

      // STATİK SAYFALAR
      {
        id: 'about',
        title: 'Hakkımızda',
        slug: '/about',
        type: 'static',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Info className="w-5 h-5" />,
        description: 'TDC Market hakkında bilgi, misyon, vizyon'
      },
      {
        id: 'contact',
        title: 'İletişim',
        slug: '/contact',
        type: 'static',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Mail className="w-5 h-5" />,
        description: 'İletişim formu, adres, telefon, email'
      },
      {
        id: 'faq',
        title: 'Sık Sorulan Sorular',
        slug: '/faq',
        type: 'static',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <FileText className="w-5 h-5" />,
        description: 'Müşteri soruları ve cevapları'
      },
      {
        id: 'privacy',
        title: 'Gizlilik Politikası',
        slug: '/privacy',
        type: 'static',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Shield className="w-5 h-5" />,
        description: 'KVKK uyumlu gizlilik politikası'
      },
      {
        id: 'terms',
        title: 'Kullanım Şartları',
        slug: '/terms',
        type: 'static',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Shield className="w-5 h-5" />,
        description: 'Site kullanım koşulları ve şartları'
      },
      {
        id: 'shipping',
        title: 'Kargo & İade',
        slug: '/shipping',
        type: 'static',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <FileText className="w-5 h-5" />,
        description: 'Kargo bilgileri ve iade koşulları'
      },

      // DİNAMİK SAYFALAR
      {
        id: 'products',
        title: 'Ürünler',
        slug: '/products',
        type: 'dynamic',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <ShoppingBag className="w-5 h-5" />,
        description: 'Tüm ürünler listesi ve filtreleme'
      },
      {
        id: 'blog',
        title: 'Blog',
        slug: '/blog',
        type: 'dynamic',
        status: 'published',
        lastModified: new Date().toISOString(),
        icon: <Newspaper className="w-5 h-5" />,
        description: 'Blog yazıları ve haberler'
      },
    ];

    setPages(allSitePages);
  };

  const filteredPages = pages.filter(page => {
    if (filter === 'all') return true;
    return page.type === filter;
  });

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'home': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'category': return 'bg-green-100 text-green-700 border-green-300';
      case 'static': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'dynamic': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'home': return 'Anasayfa';
      case 'category': return 'Kategori';
      case 'static': return 'Statik';
      case 'dynamic': return 'Dinamik';
      default: return type;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Builder - Sayfalar</h1>
        <p className="text-gray-600">Sitenizin tüm sayfalarını görüntüleyin ve düzenleyin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Toplam Sayfa</div>
          <div className="text-3xl font-bold text-gray-900">{pages.length}</div>
        </div>
        <div className="bg-purple-50 rounded-xl shadow-sm border border-purple-200 p-6">
          <div className="text-sm text-purple-600 mb-1">Anasayfa</div>
          <div className="text-3xl font-bold text-purple-700">
            {pages.filter(p => p.type === 'home').length}
          </div>
        </div>
        <div className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-6">
          <div className="text-sm text-green-600 mb-1">Kategori</div>
          <div className="text-3xl font-bold text-green-700">
            {pages.filter(p => p.type === 'category').length}
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-6">
          <div className="text-sm text-blue-600 mb-1">Statik</div>
          <div className="text-3xl font-bold text-blue-700">
            {pages.filter(p => p.type === 'static').length}
          </div>
        </div>
        <div className="bg-orange-50 rounded-xl shadow-sm border border-orange-200 p-6">
          <div className="text-sm text-orange-600 mb-1">Dinamik</div>
          <div className="text-3xl font-bold text-orange-700">
            {pages.filter(p => p.type === 'dynamic').length}
          </div>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="mb-6 flex items-center justify-between">
        {/* Filter Tabs */}
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Tümü', count: pages.length },
            { value: 'home', label: 'Anasayfa', count: pages.filter(p => p.type === 'home').length },
            { value: 'category', label: 'Kategori', count: pages.filter(p => p.type === 'category').length },
            { value: 'static', label: 'Statik', count: pages.filter(p => p.type === 'static').length },
            { value: 'dynamic', label: 'Dinamik', count: pages.filter(p => p.type === 'dynamic').length }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === tab.value
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pages Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Preview Image */}
              <div className="aspect-video bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-6xl opacity-50">
                  {page.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {page.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getTypeColor(page.type)}`}>
                    {getTypeLabel(page.type)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {page.description}
                </p>

                <div className="text-xs text-gray-500 mb-4 font-mono">
                  {page.slug}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/pages/${page.id}/edit`}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Düzenle
                  </Link>
                  <a
                    href={page.slug}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                    title="Önizle"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sayfa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {page.icon}
                      <div>
                        <div className="font-medium text-gray-900">{page.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{page.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm text-gray-600">{page.slug}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getTypeColor(page.type)}`}>
                      {getTypeLabel(page.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Yayında
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <a
                        href={page.slug}
                        target="_blank"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredPages.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Bu filtrede sayfa bulunamadı</p>
        </div>
      )}
    </div>
  );
}

