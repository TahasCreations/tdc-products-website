"use client";

import { useState, useEffect } from 'react';

export default function ThemeSettingsPage() {
  const [logoUrl, setLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#4F46E5');
  const [heroImageUrls, setHeroImageUrls] = useState<string[]>([]);
  const [headerLayout, setHeaderLayout] = useState('logo-left-under-header');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/theme/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoUrl,
          primaryColor,
          heroImageUrls,
          headerLayout
        })
      });
      
      if (response.ok) {
        setMessage('Tema ayarları başarıyla kaydedildi!');
      } else {
        setMessage('Hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      setMessage('Hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setHeroImageUrls(prev => [...prev, url]);
  };

  const removeImage = (index: number) => {
    setHeroImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tema Ayarları</h1>
      
      <form onSubmit={handleSave} className="space-y-8">
        {/* Logo */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Logo Ayarları</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {logoUrl && (
              <div className="mt-4">
                <img 
                  src={logoUrl} 
                  alt="Logo Preview" 
                  className="h-16 w-auto object-contain border rounded"
                />
              </div>
            )}
          </div>
        </div>

        {/* Renk Ayarları */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Renk Ayarları</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ana Renk
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: primaryColor + '20' }}>
              <p className="text-sm text-gray-600">Bu renk mağaza vitrininizde kullanılacak</p>
            </div>
          </div>
        </div>

        {/* Hero Görselleri */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Hero Görselleri</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Görsel URL'leri
              </label>
              <div className="space-y-2">
                {heroImageUrls.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...heroImageUrls];
                        newUrls[index] = e.target.value;
                        setHeroImageUrls(newUrls);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      Sil
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setHeroImageUrls([...heroImageUrls, ''])}
                  className="px-4 py-2 text-indigo-600 hover:text-indigo-800 border border-indigo-300 rounded-md"
                >
                  + Görsel Ekle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Header Layout */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Header Düzeni</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Layout Seçimi
              </label>
              <select
                value={headerLayout}
                onChange={(e) => setHeaderLayout(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="logo-left-under-header">Logo Sol Alt - Header Altında</option>
                <option value="logo-center-above-header">Logo Orta Üst - Header Üstünde</option>
                <option value="logo-right-side-header">Logo Sağ Yan - Header Yanında</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? 'Kaydediliyor...' : 'Tema Ayarlarını Kaydet'}
          </button>
        </div>

        {message && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">{message}</p>
          </div>
        )}
      </form>
    </div>
  );
}
