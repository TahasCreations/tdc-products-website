'use client';

import { useState } from 'react';
import { Type, Image as ImageIcon, Link as LinkIcon, Palette, Trash2 } from 'lucide-react';

interface ElementEditorProps {
  element: any;
  onUpdate: (element: any) => void;
  onMediaUpload: () => void;
}

export default function ElementEditor({ element, onUpdate, onMediaUpload }: ElementEditorProps) {
  const [localElement, setLocalElement] = useState(element);

  const handleFieldChange = (field: string, value: any) => {
    const updated = {
      ...localElement,
      content: {
        ...localElement.content,
        [field]: value
      }
    };
    setLocalElement(updated);
    onUpdate(updated);
  };

  if (!element) {
    return (
      <div className="p-6 text-center text-gray-400">
        <Type className="w-12 h-12 mx-auto mb-4" />
        <p>Düzenlemek için bir element seçin</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {element.type === 'hero' ? 'Hero Section' : 
           element.type === 'text' ? 'Text Block' : 
           element.type === 'image' ? 'Image' : 'Element'}
        </h3>
        <p className="text-sm text-gray-500">Özellikleri düzenleyin</p>
      </div>

      {/* Hero Section Editor */}
      {element.type === 'hero' && (
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Type className="w-4 h-4 inline mr-1" />
              Başlık
            </label>
            <input
              type="text"
              value={localElement.content.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Type className="w-4 h-4 inline mr-1" />
              Alt Başlık
            </label>
            <input
              type="text"
              value={localElement.content.subtitle}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* CTA Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Text
            </label>
            <input
              type="text"
              value={localElement.content.cta}
              onChange={(e) => handleFieldChange('cta', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Background Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="w-4 h-4 inline mr-1" />
              Arkaplan Görseli
            </label>
            <button
              onClick={onMediaUpload}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors text-gray-600 hover:text-indigo-600 flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Görsel Yükle / Seç
            </button>
            {localElement.content.backgroundImage && (
              <div className="mt-2">
                <img 
                  src={localElement.content.backgroundImage} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Element Editor */}
      {element.type === 'image' && (
        <div className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="w-4 h-4 inline mr-1" />
              Görsel
            </label>
            <button
              onClick={onMediaUpload}
              className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors text-gray-600 hover:text-indigo-600 flex flex-col items-center justify-center gap-2"
            >
              <Upload className="w-8 h-8" />
              <span className="font-medium">Sürükle & Bırak</span>
              <span className="text-sm">veya tıklayarak seç</span>
            </button>
            {localElement.content.url && (
              <div className="mt-4">
                <img 
                  src={localElement.content.url} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alt Text (SEO)
            </label>
            <input
              type="text"
              value={localElement.content.alt || ''}
              onChange={(e) => handleFieldChange('alt', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Görsel açıklaması..."
            />
          </div>
        </div>
      )}

      {/* Text Element Editor */}
      {element.type === 'text' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Type className="w-4 h-4 inline mr-1" />
              İçerik
            </label>
            <textarea
              value={localElement.content.html || ''}
              onChange={(e) => handleFieldChange('html', e.target.value)}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>
      )}

      {/* Delete Button */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={() => {
            if (confirm('Bu elementi silmek istediğinizden emin misiniz?')) {
              // Delete logic
            }
          }}
          className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Elementi Sil
        </button>
      </div>
    </div>
  );
}

