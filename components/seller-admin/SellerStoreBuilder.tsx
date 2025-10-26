'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  FileText,
  Globe,
  Layout,
  Sparkles,
  Calendar,
  MoreVertical,
} from 'lucide-react';

interface Page {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  description: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SellerStoreBuilderProps {
  data: {
    seller: {
      id: string;
      storeName: string;
      storeSlug: string;
    };
    pages: Page[];
  };
}

const pageTemplates = [
  {
    id: 'blank',
    name: 'Boş Sayfa',
    description: 'Sıfırdan başlayın',
    icon: FileText,
    color: 'from-gray-500 to-gray-600',
  },
  {
    id: 'home',
    name: 'Ana Sayfa',
    description: 'Hero, özellikler ve CTA',
    icon: Layout,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'about',
    name: 'Hakkımızda',
    description: 'Hikayenizi anlatın',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 'contact',
    name: 'İletişim',
    description: 'İletişim formu ve bilgiler',
    icon: Globe,
    color: 'from-green-500 to-emerald-600',
  },
];

export default function SellerStoreBuilder({ data }: SellerStoreBuilderProps) {
  const { seller, pages } = data;
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleCreatePage = async () => {
    if (!selectedTemplate) return;

    try {
      const response = await fetch('/api/seller/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: seller.id,
          template: selectedTemplate,
        }),
      });

      if (response.ok) {
        const page = await response.json();
        window.location.href = `/seller/store/builder/${page.id}`;
      } else {
        alert('Sayfa oluşturulurken hata oluştu');
      }
    } catch (error) {
      alert('Bir hata oluştu');
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/seller/pages/${pageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Sayfa silinirken hata oluştu');
      }
    } catch (error) {
      alert('Bir hata oluştu');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Builder</h1>
          <p className="text-gray-600">
            Mağazanızın sayfalarını oluşturun ve düzenleyin
          </p>
        </div>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Yeni Sayfa</span>
        </button>
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6"
      >
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              Drag & Drop Site Builder
            </h3>
            <p className="text-blue-800 mb-4">
              Kod yazmadan profesyonel sayfalar oluşturun. Hazır şablonlardan başlayın veya sıfırdan tasarlayın.
            </p>
            <div className="flex items-center space-x-4 text-sm text-blue-700">
              <span className="flex items-center space-x-1">
                <Layout className="w-4 h-4" />
                <span>Hazır Bloklar</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>Canlı Önizleme</span>
              </span>
              <span className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>Mobil Uyumlu</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pages Grid */}
      {pages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Page Preview */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-gray-400" />
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    page.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {page.status === 'published' ? 'Yayında' : 'Taslak'}
                  </span>
                </div>

                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/${seller.storeSlug}/${page.slug}`}
                      target="_blank"
                      className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                      title="Önizle"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Link>
                    <Link
                      href={`/seller/store/builder/${page.id}`}
                      className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                      title="Düzenle"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Page Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {page.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {page.description || 'Açıklama yok'}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(page.updatedAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <button
                    onClick={() => handleDeletePage(page.id)}
                    className="p-1 hover:bg-red-50 rounded text-red-600 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Henüz Sayfa Yok
          </h3>
          <p className="text-gray-600 mb-6">
            İlk sayfanızı oluşturarak başlayın. Hazır şablonlardan birini seçin veya sıfırdan tasarlayın.
          </p>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Sayfa Oluştur</span>
          </button>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Şablon Seçin
              </h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pageTemplates.map((template) => {
                const TemplateIcon = template.icon;
                const isSelected = selectedTemplate === template.id;

                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-4`}>
                      <TemplateIcon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {template.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleCreatePage}
                disabled={!selectedTemplate}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sayfa Oluştur
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

