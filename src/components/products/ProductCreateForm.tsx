'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ImageUpload from '@/components/upload/ImageUpload';

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  listPrice?: number;
  category: string;
  stock: number;
  images: string[];
  tags: string[];
  attributes: Record<string, string>;
}

interface ProductCreateFormProps {
  onSubmit?: (data: ProductFormData) => void;
  loading?: boolean;
  initialData?: Partial<ProductFormData>;
}

export default function ProductCreateForm({ 
  onSubmit, 
  loading = false, 
  initialData = {} 
}: ProductCreateFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    price: initialData.price || 0,
    listPrice: initialData.listPrice || 0,
    category: initialData.category || '',
    stock: initialData.stock || 0,
    images: initialData.images || [],
    tags: initialData.tags || [],
    attributes: initialData.attributes || {},
    ...initialData
  });

  const [tagInput, setTagInput] = useState('');
  const [attributeKey, setAttributeKey] = useState('');
  const [attributeValue, setAttributeValue] = useState('');

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addAttribute = () => {
    if (attributeKey.trim() && attributeValue.trim()) {
      setFormData(prev => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [attributeKey.trim()]: attributeValue.trim()
        }
      }));
      setAttributeKey('');
      setAttributeValue('');
    }
  };

  const removeAttribute = (key: string) => {
    setFormData(prev => {
      const newAttributes = { ...prev.attributes };
      delete newAttributes[key];
      return {
        ...prev,
        attributes: newAttributes
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Temel Bilgiler</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Adı *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="Ürün adını girin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              >
                <option value="">Kategori seçin</option>
                <option value="figur-koleksiyon">Figür & Koleksiyon</option>
                <option value="moda-aksesuar">Moda & Aksesuar</option>
                <option value="elektronik">Elektronik</option>
                <option value="ev-yasam">Ev & Yaşam</option>
                <option value="sanat-hobi">Sanat & Hobi</option>
                <option value="hediyelik">Hediyelik</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat (₺) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Liste Fiyatı (₺)
              </label>
              <input
                type="number"
                value={formData.listPrice || ''}
                onChange={(e) => handleInputChange('listPrice', Number(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok Miktarı *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Ürün açıklamasını girin"
              required
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ürün Görselleri</h2>
          
          <ImageUpload
            onUploadSuccess={handleImageSelect}
            label="Ürün görseli yükleyin"
          />

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Ürün görseli ${index + 1}`}
                    className="w-full h-32 object-cover rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Etiketler</h2>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Etiket ekleyin"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Ekle
            </button>
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Attributes */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Özellikler</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              value={attributeKey}
              onChange={(e) => setAttributeKey(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Özellik adı"
            />
            <input
              type="text"
              value={attributeValue}
              onChange={(e) => setAttributeValue(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Özellik değeri"
            />
            <button
              type="button"
              onClick={addAttribute}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Ekle
            </button>
          </div>

          {Object.keys(formData.attributes).length > 0 && (
            <div className="space-y-2">
              {Object.entries(formData.attributes).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <span className="font-medium text-gray-900">{key}: {value}</span>
                  <button
                    type="button"
                    onClick={() => removeAttribute(key)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}