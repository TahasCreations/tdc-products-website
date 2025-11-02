'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Layout, Home, Package, FileText, Mail, Info, Shield, ShoppingBag, Newspaper,
  Edit, Eye, Plus, Search, Filter, Grid3x3, List, Sparkles, Zap, Image as ImageIcon,
  Clock, TrendingUp, Users, ArrowUpRight
} from 'lucide-react';

interface Page {
  id: string;
  title: string;
  slug: string;
  type: 'home' | 'category' | 'static' | 'dynamic';
  status: 'published' | 'draft';
  views: number;
  lastModified: string;
  icon: React.ReactNode;
  description: string;
  thumbnail?: string;
}

export default function SiteBuilderPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'home' | 'category' | 'static' | 'dynamic'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAllSitePages();
  }, []);

  const loadAllSitePages = () => {
    const allSitePages: Page[] = [
      // ANASAYFA
      {
        id: 'home',
        title: 'Anasayfa',
        slug: '/',
        type: 'home',
        status: 'published',
        views: 12453,
        lastModified: new Date().toISOString(),
        icon: <Home className="w-5 h-5" />,
        description: 'Hero, maskot, kategoriler, ürün showcase, newsletter',
        thumbnail: '/images/thumbnails/home.jpg'
      },

      // KATEGORİ LANSMAN SAYFALARI
      {
        id: 'cat-figur',
        title: 'Figür & Koleksiyon',
        slug: '/categories/figur-koleksiyon',
        type: 'category',
        status: 'published',
        views: 3421,
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />,
        description: 'Anime, manga, funko pop koleksiyonu - Hero, featured, promo banners'
      },
      {
        id: 'cat-moda',
        title: 'Moda & Aksesuar',
        slug: '/categories/moda-aksesuar',
        type: 'category',
        status: 'published',
        views: 2891,
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />,
        description: 'Takı, saat, çanta kategorisi - Premium landing page'
      },
      {
        id: 'cat-elektronik',
        title: 'Elektronik',
        slug: '/categories/elektronik',
        type: 'category',
        status: 'published',
        views: 4102,
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />,
        description: 'Telefon, bilgisayar, aksesuar - Tech showcase page'
      },
      {
        id: 'cat-ev',
        title: 'Ev & Yaşam',
        slug: '/categories/ev-yasam',
        type: 'category',
        status: 'published',
        views: 1823,
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />,
        description: 'Dekorasyon, mutfak, ev eşyaları kategorisi'
      },
      {
        id: 'cat-sanat',
        title: 'Sanat & Hobi',
        slug: '/categories/sanat-hobi',
        type: 'category',
        status: 'published',
        views: 1456,
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />,
        description: 'Sanat malzemeleri, hobi ürünleri'
      },
      {
        id: 'cat-hediye',
        title: 'Hediyelik',
        slug: '/categories/hediyelik',
        type: 'category',
        status: 'published',
        views: 2103,
        lastModified: new Date().toISOString(),
        icon: <Package className="w-5 h-5" />,
        description: 'Özel günler için hediye ürünleri'
      },

      // STATİK SAYFALAR
      {
        id: 'about',
        title: 'Hakkımızda',
        slug: '/about',
        type: 'static',
        status: 'published',
        views: 892,
        lastModified: new Date().toISOString(),
        icon: <Info className="w-5 h-5" />,
        description: 'Şirket hikayesi, misyon, vizyon, ekip'
      },
      {
        id: 'contact',
        title: 'İletişim',
        slug: '/contact',
        type: 'static',
        status: 'published',
        views: 1234,
        lastModified: new Date().toISOString(),
        icon: <Mail className="w-5 h-5" />,
        description: 'İletişim formu, adres, telefon, sosyal medya'
      },
      {
        id: 'faq',
        title: 'Sık Sorulan Sorular',
        slug: '/faq',
        type: 'static',
        status: 'published',
        views: 567,
        lastModified: new Date().toISOString(),
        icon: <FileText className="w-5 h-5" />,
        description: 'Müşteri soruları, iade, kargo, ödeme bilgileri'
      },
      {
        id: 'privacy',
        title: 'Gizlilik Politikası',
        slug: '/privacy',
        type: 'static',
        status: 'published',
        views: 345,
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
        views: 289,
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
        views: 1567,
        lastModified: new Date().toISOString(),
        icon: <FileText className="w-5 h-5" />,
        description: 'Kargo bilgileri, iade prosedürü, teslimat süreleri'
      },

      // DİNAMİK SAYFALAR
      {
        id: 'products',
        title: 'Ürünler',
        slug: '/products',
        type: 'dynamic',
        status: 'published',
        views: 8923,
        lastModified: new Date().toISOString(),
        icon: <ShoppingBag className="w-5 h-5" />,
        description: 'Tüm ürünler listesi, filtreleme, sıralama'
      },
      {
        id: 'blog',
        title: 'Blog',
        slug: '/blog',
        type: 'dynamic',
        status: 'published',
        views: 2341,
        lastModified: new Date().toISOString(),
        icon: <Newspaper className="w-5 h-5" />,
        description: 'Blog yazıları, haberler, duyurular'
      },
    ];

    setPages(allSitePages);
  };

  const filteredPages = pages.filter(page => {
    const matchesFilter = filter === 'all' || page.type === filter;
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeConfig = (type: string) => {
    switch(type) {
      case 'home':
        return {
          label: 'Anasayfa',
          color: 'from-purple-500 to-pink-500',
          bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
          textColor: 'text-purple-700',
          borderColor: 'border-purple-200',
          badge: 'bg-purple-100 text-purple-700 border-purple-300'
        };
      case 'category':
        return {
          label: 'Kategori',
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          badge: 'bg-green-100 text-green-700 border-green-300'
        };
      case 'static':
        return {
          label: 'Statik',
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-gradient-to-r from-blue-50 to-cyan-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          badge: 'bg-blue-100 text-blue-700 border-blue-300'
        };
      case 'dynamic':
        return {
          label: 'Dinamik',
          color: 'from-orange-500 to-red-500',
          bgColor: 'bg-gradient-to-r from-orange-50 to-red-50',
          textColor: 'text-orange-700',
          borderColor: 'border-orange-200',
          badge: 'bg-orange-100 text-orange-700 border-orange-300'
        };
      default:
        return {
          label: type,
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          badge: 'bg-gray-100 text-gray-700 border-gray-300'
        };
    }
  };

  const totalViews = pages.reduce((sum, page) => sum + page.views, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-8">
      {/* Modern Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                  Site Builder
                </h1>
                <p className="text-indigo-600 font-semibold">Visual Page Editor</p>
              </div>
            </div>
            <p className="text-gray-600 text-lg">Sitenizin tüm sayfalarını görselleştirin ve düzenleyin</p>
          </div>

          <Link
            href="/admin/site-builder/pages/create"
            className="group px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Sayfa Oluştur</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
          </Link>
        </motion.div>
      </div>

      {/* Stats Cards - Modern & Colorful */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">{pages.length}</div>
          <div className="text-sm font-medium text-gray-600">Toplam Sayfa</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6 text-white" />
            </div>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">
            {pages.filter(p => p.type === 'category').length}
          </div>
          <div className="text-sm font-medium text-gray-600">Kategori Sayfası</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">
            {pages.filter(p => p.type === 'static').length}
          </div>
          <div className="text-sm font-medium text-gray-600">Statik Sayfa</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">
            {(totalViews / 1000).toFixed(1)}K
          </div>
          <div className="text-sm font-medium text-gray-600">Toplam Görüntülenme</div>
        </motion.div>
      </div>

      {/* Filters & Search - Modern Design */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Sayfa ara... (isim, URL, açıklama)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 placeholder-gray-400 font-medium"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { value: 'all', label: 'Tümü', icon: <Filter className="w-4 h-4" />, count: pages.length },
                { value: 'home', label: 'Ana', icon: <Home className="w-4 h-4" />, count: pages.filter(p => p.type === 'home').length },
                { value: 'category', label: 'Kategori', icon: <Package className="w-4 h-4" />, count: pages.filter(p => p.type === 'category').length },
                { value: 'static', label: 'Statik', icon: <FileText className="w-4 h-4" />, count: pages.filter(p => p.type === 'static').length },
                { value: 'dynamic', label: 'Dinamik', icon: <Zap className="w-4 h-4" />, count: pages.filter(p => p.type === 'dynamic').length }
              ].map((tab) => (
                <motion.button
                  key={tab.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(tab.value as any)}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 border-2 ${
                    filter === tab.value
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-500/50'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    filter === tab.value ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {tab.count}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-md text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-md text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pages Display */}
      {viewMode === 'grid' ? (
        /* Grid View - Premium Design */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPages.map((page, index) => {
            const typeConfig = getTypeConfig(page.type);
            
            return (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-indigo-300 transition-all">
                  {/* Thumbnail/Preview */}
                  <div className={`aspect-video ${typeConfig.bgColor} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`text-7xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all`}>
                        {page.icon}
                      </div>
                    </div>
                    
                    {/* Type Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 backdrop-blur-sm bg-white/90 ${typeConfig.badge}`}>
                        {typeConfig.label}
                      </span>
                    </div>

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end justify-center p-4 gap-2">
                      <Link
                        href={`/admin/site-builder/editor/${page.id}`}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-indigo-600 hover:text-white transition-all font-semibold text-sm flex items-center gap-2 shadow-xl"
                      >
                        <Edit className="w-4 h-4" />
                        Düzenle
                      </Link>
                      <a
                        href={page.slug}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg hover:bg-white transition-all font-semibold text-sm flex items-center gap-2 shadow-xl"
                      >
                        <Eye className="w-4 h-4" />
                        Önizle
                      </a>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Title */}
                    <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {page.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {page.description}
                    </p>

                    {/* URL */}
                    <div className="mb-4 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                      <code className="text-xs text-indigo-600 font-mono font-semibold">
                        {page.slug}
                      </code>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        <span className="font-semibold">{page.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Az önce</span>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        page.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {page.status === 'published' ? '🟢 Yayında' : '🟡 Taslak'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* List View - Modern Table */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-indigo-50 border-b-2 border-indigo-100">
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Sayfa</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-black text-gray-700 uppercase tracking-wider">URL</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Tip</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Görüntülenme</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Durum</span>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <span className="text-xs font-black text-gray-700 uppercase tracking-wider">İşlemler</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPages.map((page, index) => {
                  const typeConfig = getTypeConfig(page.type);
                  
                  return (
                    <motion.tr
                      key={page.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-indigo-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${typeConfig.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <div className="text-white">
                              {page.icon}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {page.title}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {page.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm text-indigo-600 font-mono font-semibold bg-indigo-50 px-3 py-1 rounded-lg">
                          {page.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${typeConfig.badge}`}>
                          {typeConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-semibold text-gray-700">
                            {page.views.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          page.status === 'published' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {page.status === 'published' ? '🟢 Yayında' : '🟡 Taslak'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/site-builder/editor/${page.id}`}
                            className="p-2.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all"
                            title="Düzenle"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <a
                            href={page.slug}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                            title="Önizle"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredPages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-16 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sayfa bulunamadı</h3>
          <p className="text-gray-500 mb-6">Arama kriterlerinizle eşleşen sayfa yok</p>
          <button
            onClick={() => {
              setFilter('all');
              setSearchQuery('');
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-semibold"
          >
            Tüm Sayfaları Göster
          </button>
        </motion.div>
      )}

      {/* Quick Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-black mb-1">{filteredPages.length}</div>
            <div className="text-sm text-indigo-100 font-medium">Görüntülenen Sayfa</div>
          </div>
          <div>
            <div className="text-3xl font-black mb-1">{pages.filter(p => p.status === 'published').length}</div>
            <div className="text-sm text-indigo-100 font-medium">Yayında</div>
          </div>
          <div>
            <div className="text-3xl font-black mb-1">{(totalViews / 1000).toFixed(1)}K</div>
            <div className="text-sm text-indigo-100 font-medium">Toplam Görüntülenme</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
