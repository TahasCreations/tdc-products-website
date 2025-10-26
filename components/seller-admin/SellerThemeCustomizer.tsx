'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Upload,
  Eye,
  Save,
  RotateCcw,
  Image as ImageIcon,
  Layout,
  Type,
  Sparkles,
} from 'lucide-react';

interface SellerThemeCustomizerProps {
  data: {
    seller: {
      id: string;
      storeName: string;
      storeSlug: string;
      logoUrl: string | null;
    };
    theme: {
      id: string;
      logoUrl: string | null;
      primaryColor: string | null;
      heroImageUrls: string[];
      headerLayout: string | null;
    } | null;
  };
}

const colorPresets = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#9333ea' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Green', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Cyan', value: '#06b6d4' },
];

const headerLayouts = [
  { id: 'centered', name: 'Merkez', preview: 'Logo ortada, menü altında' },
  { id: 'left', name: 'Sol', preview: 'Logo solda, menü sağda' },
  { id: 'split', name: 'Bölünmüş', preview: 'Logo solda, menü ortada, butonlar sağda' },
];

export default function SellerThemeCustomizer({ data }: SellerThemeCustomizerProps) {
  const { seller, theme } = data;
  
  const [primaryColor, setPrimaryColor] = useState(theme?.primaryColor || '#6366f1');
  const [logoUrl, setLogoUrl] = useState(theme?.logoUrl || seller.logoUrl || '');
  const [heroImages, setHeroImages] = useState<string[]>(theme?.heroImageUrls || []);
  const [headerLayout, setHeaderLayout] = useState(theme?.headerLayout || 'centered');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'logo' | 'layout' | 'images'>('colors');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/seller/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: seller.id,
          logoUrl,
          primaryColor,
          heroImageUrls: heroImages,
          headerLayout,
        }),
      });

      if (response.ok) {
        alert('Tema ayarları kaydedildi!');
      } else {
        alert('Tema kaydedilirken hata oluştu');
      }
    } catch (error) {
      alert('Bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPrimaryColor(theme?.primaryColor || '#6366f1');
    setLogoUrl(theme?.logoUrl || seller.logoUrl || '');
    setHeroImages(theme?.heroImageUrls || []);
    setHeaderLayout(theme?.headerLayout || 'centered');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tema Özelleştirme</h1>
          <p className="text-gray-600">
            Mağazanızın görünümünü özelleştirin
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-flex items-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Sıfırla</span>
          </button>
          <a
            href={`/${seller.storeSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
          >
            <Eye className="w-5 h-5" />
            <span>Önizle</span>
          </a>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { id: 'colors', label: 'Renkler', icon: Palette },
            { id: 'logo', label: 'Logo', icon: ImageIcon },
            { id: 'layout', label: 'Düzen', icon: Layout },
            { id: 'images', label: 'Görseller', icon: Sparkles },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-4 font-medium transition-colors inline-flex items-center justify-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Ana Renk
                </h3>
                <div className="grid grid-cols-5 gap-4">
                  {colorPresets.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setPrimaryColor(color.value)}
                      className={`aspect-square rounded-xl transition-all ${
                        primaryColor === color.value
                          ? 'ring-4 ring-offset-2 ring-gray-900 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Özel Renk
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-20 h-20 rounded-lg border-2 border-gray-300 cursor-pointer"
                  />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Seçili Renk</p>
                    <code className="text-lg font-mono font-semibold text-gray-900">
                      {primaryColor}
                    </code>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Önizleme</h4>
                <div className="space-y-3">
                  <button
                    className="w-full px-6 py-3 rounded-lg text-white font-semibold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Buton Örneği
                  </button>
                  <div
                    className="w-full h-24 rounded-lg"
                    style={{ backgroundColor: `${primaryColor}20` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Logo Tab */}
          {activeTab === 'logo' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Mağaza Logosu
                </h3>
                <div className="flex items-start space-x-6">
                  {logoUrl ? (
                    <div className="w-32 h-32 rounded-xl border-2 border-gray-200 overflow-hidden">
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo URL
                    </label>
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Önerilen boyut: 200x200px, PNG veya SVG formatı
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Layout Tab */}
          {activeTab === 'layout' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Header Düzeni
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {headerLayouts.map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => setHeaderLayout(layout.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        headerLayout === layout.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {layout.name}
                      </h4>
                      <p className="text-sm text-gray-600">{layout.preview}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Hero Görselleri
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Ana sayfanızda gösterilecek hero görselleri ekleyin
                </p>
                <div className="space-y-3">
                  {heroImages.map((url, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => {
                          const newImages = [...heroImages];
                          newImages[index] = e.target.value;
                          setHeroImages(newImages);
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => {
                          setHeroImages(heroImages.filter((_, i) => i !== index));
                        }}
                        className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setHeroImages([...heroImages, ''])}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors inline-flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Görsel Ekle</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

