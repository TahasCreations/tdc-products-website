"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  CheckCircle
} from 'lucide-react';
import { PageData } from '@/lib/site-builder/types';

export default function SiteBuilderPagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
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

  const handleCreatePage = () => {
    router.push('/admin/site-builder/editor/new');
  };

  const handleEditPage = (pageId: string) => {
    router.push(`/admin/site-builder/editor/${pageId}`);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Visual Site Builder</h1>
              <p className="text-gray-600">Sayfalarınızı oluşturun ve yönetin</p>
            </div>
            
            <button
              onClick={handleCreatePage}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              <Plus className="w-5 h-5" />
              Yeni Sayfa Oluştur
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Toplam Sayfa</p>
                <p className="text-2xl font-bold text-gray-900">{pages.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600 mb-1">Taslak</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pages.filter(p => p.status === 'draft').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Son Güncelleme</p>
                <p className="text-sm font-bold text-gray-900">
                  {pages.length > 0 ? 'Bugün' : '-'}
                </p>
              </div>
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </motion.div>

        {/* Pages Grid */}
        {pages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Henüz Sayfa Yok</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Visual site builder ile ilk sayfanızı oluşturun ve drag & drop ile kolayca düzenleyin
            </p>
            <button
              onClick={handleCreatePage}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-lg"
            >
              <Plus className="w-6 h-6" />
              İlk Sayfayı Oluştur
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page, index) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Preview Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-400" />
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
        )}
      </div>
    </div>
  );
}

