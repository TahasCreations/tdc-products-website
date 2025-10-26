"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Plus,
  FileText,
  Eye,
  Edit3,
  Trash2,
  Copy,
  Globe,
  Clock,
  CheckCircle,
  Code,
  Palette,
  Calendar,
  ExternalLink,
  Search
} from 'lucide-react';
import { PageData } from '@/lib/site-builder/types';

interface ExistingPage {
  id: string;
  name: string;
  slug: string;
  filePath: string;
  type: string;
  isEditable: boolean;
  lastModified: Date;
  size: number;
  category: string;
  metadata: {
    title?: string;
    description?: string;
    hasMetadata: boolean;
  };
}

export default function SiteBuilderPagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<PageData[]>([]);
  const [existingPages, setExistingPages] = useState<ExistingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'all' | 'builder' | 'existing'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPages();
    fetchExistingPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/site-builder/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data.pages || []);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingPages = async () => {
    try {
      const response = await fetch('/api/site-builder/pages/scan');
      if (response.ok) {
        const data = await response.json();
        setExistingPages(data.pages || []);
      }
    } catch (error) {
      console.error('Error fetching existing pages:', error);
    }
  };

  const handleCreatePage = (openInNewTab: boolean = true) => {
    const editorUrl = '/admin/site-builder/editor-full';
    
    if (openInNewTab) {
      // Yeni sekmede tam sayfa editörü aç
      window.open(editorUrl, '_blank', 'noopener,noreferrer');
    } else {
      router.push(editorUrl);
    }
  };

  const handleEditPage = (pageId: string, openInNewTab: boolean = true) => {
    const editorUrl = `/admin/site-builder/editor-full?page=${pageId}`;
    
    if (openInNewTab) {
      // Yeni sekmede tam sayfa editörü aç
      window.open(editorUrl, '_blank', 'noopener,noreferrer');
    } else {
      router.push(editorUrl);
    }
  };

  const handleDuplicatePage = async (pageId: string) => {
    try {
      const response = await fetch('/api/site-builder/pages/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId }),
      });

      if (response.ok) {
        fetchPages();
      }
    } catch (error) {
      console.error('Error duplicating page:', error);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/site-builder/pages/${pageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPages();
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const handleEditExistingPage = async (existingPage: ExistingPage) => {
    // Mevcut sayfayı builder formatına dönüştür ve editörde aç
    try {
      // Yeni bir builder sayfası oluştur
      const newPage = {
        name: existingPage.name,
        slug: existingPage.slug,
        components: {},
        rootComponentIds: [],
        status: 'draft' as const,
        seo: {
          title: existingPage.metadata.title || existingPage.name,
          description: existingPage.metadata.description || '',
        },
      };

      // Sayfayı kaydet
      const response = await fetch('/api/site-builder/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPage),
      });

      if (response.ok) {
        const data = await response.json();
        // Yeni sekmede tam sayfa editörü aç
        window.open(`/admin/site-builder/editor-full?page=${data.page.id}`, '_blank', 'noopener,noreferrer');
        // Sayfaları yenile
        fetchPages();
      }
    } catch (error) {
      console.error('Error creating page from existing:', error);
      alert('Sayfa oluşturulurken hata oluştu');
    }
  };

  const filteredPages = pages.filter(page =>
    page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExistingPages = existingPages.filter(page => {
    const matchesSearch = page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || page.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(existingPages.map(p => p.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Sayfalar
            </h1>
            <p className="text-gray-600">
              {existingPages.length + pages.length} toplam • {pages.length} builder • {existingPages.length} mevcut
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreatePage}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
          >
            <Plus className="w-5 h-5" />
            Yeni Sayfa
          </motion.button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('all')}
              className={`px-6 py-2 rounded-lg transition-all font-medium ${
                viewMode === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setViewMode('builder')}
              className={`px-6 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${
                viewMode === 'builder'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Palette className="w-4 h-4" />
              Builder ({pages.length})
            </button>
            <button
              onClick={() => setViewMode('existing')}
              className={`px-6 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${
                viewMode === 'existing'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Code className="w-4 h-4" />
              Mevcut ({existingPages.length})
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 relative min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sayfa ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          {viewMode === 'existing' && categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Builder Sayfaları</p>
                <p className="text-2xl font-bold text-gray-900">{pages.length}</p>
              </div>
              <Palette className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Yayında</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pages.filter(p => p.status === 'published').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Mevcut Sayfalar</p>
                <p className="text-2xl font-bold text-gray-900">{existingPages.length}</p>
              </div>
              <Code className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Toplam</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pages.length + existingPages.length}
                </p>
              </div>
              <Globe className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </motion.div>

        {/* Pages Content */}
        <div className="space-y-8">
          {/* Builder Pages */}
          {viewMode !== 'existing' && filteredPages.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-600" />
                Visual Builder Sayfaları
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPages.map((page, index) => (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    {/* Preview Thumbnail */}
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="w-12 h-12 text-blue-400" />
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditPage(page.id)}
                          className="p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                          title="Düzenle"
                        >
                          <Edit3 className="w-5 h-5 text-gray-900" />
                        </button>
                        <button
                          onClick={() => window.open(`/${page.slug}`, '_blank')}
                          className="p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                          title="Önizle"
                        >
                          <Eye className="w-5 h-5 text-gray-900" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg mb-1">{page.name}</h3>
                          <p className="text-sm text-gray-500">/{page.slug}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          page.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {page.status === 'published' ? 'Yayında' : 'Taslak'}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 mb-4">
                        <div>Güncelleme: {new Date(page.updatedAt).toLocaleDateString('tr-TR')}</div>
                        <div>{Object.keys(page.components).length} component</div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditPage(page.id)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          Düzenle
                        </button>
                        
                        <button
                          onClick={() => handleDuplicatePage(page.id)}
                          className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          title="Kopyala"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeletePage(page.id)}
                          className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Existing Pages */}
          {viewMode !== 'builder' && filteredExistingPages.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-600" />
                Mevcut Next.js Sayfaları
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExistingPages.map((page, index) => (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border-2 border-gray-100 hover:border-purple-300 overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="w-5 h-5 text-purple-600" />
                            <h3 className="font-bold text-gray-900 text-lg">{page.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-1 font-mono">{page.slug}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            page.category === 'main' ? 'bg-blue-100 text-blue-700' :
                            page.category === 'admin' ? 'bg-purple-100 text-purple-700' :
                            page.category === 'products' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {page.category}
                          </span>
                        </div>
                      </div>

                      {page.metadata.hasMetadata && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          {page.metadata.title && (
                            <p className="text-sm text-gray-700 font-medium mb-1">{page.metadata.title}</p>
                          )}
                          {page.metadata.description && (
                            <p className="text-xs text-gray-500 line-clamp-2">{page.metadata.description}</p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(page.lastModified).toLocaleDateString('tr-TR')}</span>
                        <span className="mx-1">•</span>
                        <span>{(page.size / 1024).toFixed(1)} KB</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {page.isEditable ? (
                          <>
                            <button
                              onClick={() => handleEditExistingPage(page)}
                              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm flex items-center justify-center gap-2"
                            >
                              <Palette className="w-4 h-4" />
                              Builder'da Düzenle
                            </button>
                            <button
                              onClick={() => window.open(page.slug, '_blank')}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                              title="Görüntüle"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => window.open(page.slug, '_blank')}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Görüntüle
                          </button>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400 font-mono truncate" title={page.filePath}>
                          {page.filePath}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Empty States */}
          {viewMode === 'builder' && filteredPages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Henüz Builder Sayfası Yok</h3>
              <p className="text-gray-600 mb-8">İlk sayfanızı oluşturun ve tasarlamaya başlayın!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreatePage}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                <Plus className="w-5 h-5" />
                İlk Sayfayı Oluştur
              </motion.button>
            </div>
          )}

          {viewMode === 'all' && filteredPages.length === 0 && filteredExistingPages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Henüz Sayfa Yok</h3>
              <p className="text-gray-600 mb-8">İlk sayfanızı oluşturun!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreatePage}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                <Plus className="w-5 h-5" />
                Yeni Sayfa Oluştur
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
