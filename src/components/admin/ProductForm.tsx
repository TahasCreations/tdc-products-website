'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  parent_id?: string | null;
  level?: number;
  created_at: string;
  updated_at: string;
}

interface ProductFormProps {
  newProduct: any;
  setNewProduct: (product: any) => void;
  categories: Category[];
  handleAddProduct: () => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  isDragOver: boolean;
  uploadProgress: number;
  apiLoading: boolean;
}

export default function ProductForm({
  newProduct,
  setNewProduct,
  categories,
  handleAddProduct,
  handleFileSelect,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  isDragOver,
  uploadProgress,
  apiLoading
}: ProductFormProps) {
  // Kategorileri ana ve alt kategoriler olarak ayır
  const parentCategories = categories.filter(cat => !cat.parent_id || cat.level === 0);
  const subCategories = categories.filter(cat => cat.parent_id && cat.level === 1);
  
  // Seçilen ana kategoriye ait alt kategorileri getir
  const getSubCategories = (parentId: string) => {
    return subCategories.filter(cat => cat.parent_id === parentId);
  };

  // Ana kategori değiştiğinde alt kategoriyi sıfırla
  const handleCategoryChange = (categoryName: string) => {
    const selectedCategory = parentCategories.find(cat => cat.name === categoryName);
    setNewProduct({ 
      ...newProduct, 
      category: categoryName,
      subcategory: '' // Alt kategoriyi sıfırla
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Ürün Ekle</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı</label>
          <input
            type="text"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ürün adını girin"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat</label>
          <input
            type="number"
            step="0.01"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            disabled={newProduct.hasVariationPrices}
          />
          <div className="mt-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newProduct.hasVariationPrices}
                onChange={(e) => setNewProduct({ 
                  ...newProduct, 
                  hasVariationPrices: e.target.checked,
                  variationPrices: e.target.checked ? {} : {}
                })}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Varyasyonlar için farklı fiyatlar</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ana Kategori</label>
          <select
            value={newProduct.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Ana kategori seçin</option>
            {parentCategories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Alt Kategori</label>
          <select
            value={newProduct.subcategory}
            onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!newProduct.category}
          >
            <option value="">Alt kategori seçin (opsiyonel)</option>
            {newProduct.category && getSubCategories(
              parentCategories.find(cat => cat.name === newProduct.category)?.id || ''
            ).map((subCategory) => (
              <option key={subCategory.id} value={subCategory.name}>
                {subCategory.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stok</label>
          <input
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Görselleri</label>
          
          {/* Drag & Drop Alanı */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="space-y-4">
              <i className="ri-image-add-line text-4xl text-gray-400"></i>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Görselleri buraya sürükleyin veya seçin
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG, JPEG dosyaları (max 5MB)
                </p>
              </div>
              
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <i className="ri-folder-open-line mr-2"></i>
                Görsel Seç
              </label>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Yükleniyor...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Yüklenen Görseller */}
          {newProduct.images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Yüklenen Görseller:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {newProduct.images.map((image: string, index: number) => (
                  <div key={index} className="relative group">
                    <Image
                      src={image}
                      alt={`Görsel ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-20 object-cover rounded-md"
                    />
                    {index === 0 && (
                      <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded">
                        Ana
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setNewProduct((prev: any) => ({
                          ...prev,
                          images: prev.images.filter((_: any, i: number) => i !== index),
                          image: index === 0 ? (prev.images[1] || '') : prev.image
                        }));
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
          <textarea
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            rows={15}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            placeholder="Ürün açıklaması (HTML desteklenir)"
          />
        </div>
        <div className="md:col-span-2">
          <button
            onClick={handleAddProduct}
            disabled={apiLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {apiLoading ? 'Ekleniyor...' : 'Ürün Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
}
