"use client";

import React from 'react';
import { Search, Globe, Share2, Image } from 'lucide-react';
import { useEditorStore } from '@/lib/site-builder/store';

export const SEOPanel: React.FC = () => {
  const { currentPage, updatePage } = useEditorStore();

  if (!currentPage) return null;

  const seo = currentPage.seo || {};

  const updateSEO = (key: string, value: string) => {
    updatePage({
      seo: {
        ...seo,
        [key]: value,
      },
    });
  };

  const titleLength = (seo.title || '').length;
  const descriptionLength = (seo.description || '').length;

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Search className="w-5 h-5" />
          SEO Ayarları
        </h3>
        <p className="text-xs text-gray-600 mt-1">Arama motoru optimizasyonu</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Page Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Meta Title
          </label>
          <input
            type="text"
            value={seo.title || currentPage.title || ''}
            onChange={(e) => updateSEO('title', e.target.value)}
            maxLength={60}
            className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Sayfa başlığı..."
          />
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className={titleLength > 60 ? 'text-red-600' : titleLength > 50 ? 'text-yellow-600' : 'text-gray-500'}>
              {titleLength}/60 karakter
            </span>
            {titleLength > 60 && <span className="text-red-600">❗ Çok uzun</span>}
            {titleLength >= 50 && titleLength <= 60 && <span className="text-green-600">✓ İyi</span>}
          </div>
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Meta Description
          </label>
          <textarea
            value={seo.description || currentPage.description || ''}
            onChange={(e) => updateSEO('description', e.target.value)}
            maxLength={160}
            rows={3}
            className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Sayfa açıklaması..."
          />
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className={descriptionLength > 160 ? 'text-red-600' : descriptionLength > 150 ? 'text-yellow-600' : 'text-gray-500'}>
              {descriptionLength}/160 karakter
            </span>
            {descriptionLength > 160 && <span className="text-red-600">❗ Çok uzun</span>}
            {descriptionLength >= 120 && descriptionLength <= 160 && <span className="text-green-600">✓ İyi</span>}
          </div>
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Anahtar Kelimeler
          </label>
          <input
            type="text"
            value={(seo.keywords || []).join(', ')}
            onChange={(e) => updateSEO('keywords', e.target.value.split(',').map(k => k.trim()))}
            className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="anahtar, kelime, virgülle, ayırın"
          />
          <p className="text-xs text-gray-500 mt-1">Virgülle ayırarak girin</p>
        </div>

        {/* Open Graph */}
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Open Graph (Social Share)
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                OG Title
              </label>
              <input
                type="text"
                value={(seo.customMeta && (seo.customMeta as any)['og:title']) || seo.title || ''}
                onChange={(e) => updateSEO('customMeta', { ...(seo.customMeta || {}), 'og:title': e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Social media başlığı"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                OG Description
              </label>
              <textarea
                value={(seo.customMeta && (seo.customMeta as any)['og:description']) || seo.description || ''}
                onChange={(e) => updateSEO('customMeta', { ...(seo.customMeta || {}), 'og:description': e.target.value })}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Social media açıklaması"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Image className="w-4 h-4" />
                OG Image URL
              </label>
              <input
                type="text"
                value={seo.ogImage || ''}
                onChange={(e) => updateSEO('ogImage', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="/images/og-image.jpg"
              />
              <button className="mt-2 w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Medya Kütüphanesinden Seç
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Google Önizleme</h4>
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="text-blue-600 text-sm truncate">{currentPage.slug}</div>
            <div className="text-lg text-blue-800 font-medium mt-1 truncate">
              {seo.title || currentPage.title || 'Başlık'}
            </div>
            <div className="text-sm text-gray-600 mt-1 line-clamp-2">
              {seo.description || currentPage.description || 'Açıklama metni buraya gelecek...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

