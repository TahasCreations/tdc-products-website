'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminProtection from '../../../components/AdminProtection';
import ProductForm from '../../../components/admin/ProductForm';
import OptimizedLoader from '../../../components/OptimizedLoader';
import { getSupabaseClient } from '../../../lib/supabase-client';

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

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  category: string;
  subcategory?: string;
  stock: number;
  image: string;
  images: string[];
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    category: '',
    subcategory: '',
    stock: '',
    image: '',
    images: [] as string[],
    description: '',
    slug: '',
    variations: [] as string[],
    hasVariationPrices: false,
    variationPrices: {} as Record<string, number>
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#6b7280',
    icon: 'ri-more-line',
    parent_id: null as string | null
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products || []);
      } else {
        setMessage('Ürünler yüklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Fetch categories error:', error);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.title || !newProduct.price || !newProduct.category) {
      setMessage('Lütfen tüm gerekli alanları doldurun');
      setMessageType('error');
      return;
    }

    setApiLoading(true);
    setMessage('Ürün ekleniyor...');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add',
          title: newProduct.title,
          price: newProduct.price,
          category: newProduct.category,
          subcategory: newProduct.subcategory || null,
          stock: newProduct.stock,
          image: newProduct.image,
          images: newProduct.images,
          description: newProduct.description,
          slug: newProduct.slug
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Ürün başarıyla eklendi!');
        setMessageType('success');
        setNewProduct({
          title: '',
          price: '',
          category: '',
          subcategory: '',
          stock: '',
          image: '',
          images: [],
          description: '',
          slug: '',
          variations: [],
          hasVariationPrices: false,
          variationPrices: {}
        });
        setShowAddForm(false);
        fetchProducts();
      } else {
        setMessage(data.error || 'Ürün eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add product error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    } finally {
      setApiLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadProgress(0);
    const uploadedImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        
        if (data.success) {
          uploadedImages.push(data.url);
          setUploadProgress(((i + 1) / files.length) * 100);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    if (uploadedImages.length > 0) {
      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
        image: prev.image || uploadedImages[0]
      }));
    }

    setUploadProgress(0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*';
      input.files = files;
      
      const event = new Event('change', { bubbles: true });
      Object.defineProperty(event, 'target', { value: input });
      handleFileSelect(event as any);
    }
  };

  // Kategori yönetimi fonksiyonları
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      setMessage('Kategori adı gerekli');
      setMessageType('error');
      return;
    }

    try {
      setApiLoading(true);
      
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add',
          ...newCategory
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Kategori başarıyla eklendi');
        setMessageType('success');
        setNewCategory({
          name: '',
          color: '#6b7280',
          icon: 'ri-more-line',
          parent_id: null
        });
        setShowCategoryForm(false);
        fetchCategories();
      } else {
        setMessage(data.error || 'Kategori eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add category error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    } finally {
      setApiLoading(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      color: category.color,
      icon: category.icon,
      parent_id: category.parent_id || null
    });
    setShowEditForm(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCategory || !newCategory.name.trim()) {
      setMessage('Kategori adı gerekli');
      setMessageType('error');
      return;
    }

    try {
      setApiLoading(true);
      
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          id: editingCategory.id,
          ...newCategory
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Kategori başarıyla güncellendi');
        setMessageType('success');
        setEditingCategory(null);
        setShowEditForm(false);
        setNewCategory({
          name: '',
          color: '#6b7280',
          icon: 'ri-more-line',
          parent_id: null
        });
        fetchCategories();
      } else {
        setMessage(data.error || 'Kategori güncellenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Update category error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    } finally {
      setApiLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          id: id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Kategori başarıyla silindi');
        setMessageType('success');
        fetchCategories();
      } else {
        setMessage(data.error || 'Kategori silinemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Delete category error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          id: id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Ürün başarıyla silindi');
        setMessageType('success');
        fetchProducts();
      } else {
        setMessage(data.error || 'Ürün silinemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Delete product error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  if (loading) {
    return <OptimizedLoader message="Ürünler yükleniyor..." />;
  }

  return (
    <AdminProtection>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
            <p className="text-gray-600">Ürünleri ekleyin, düzenleyin ve yönetin</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {showCategoryForm ? 'Kategori Formunu Gizle' : 'Kategori Yönetimi'}
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {showAddForm ? 'Formu Gizle' : 'Yeni Ürün Ekle'}
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
            <button
              onClick={() => setMessage('')}
              className="float-right text-lg font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Category Management Form */}
        {showCategoryForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Kategori Yönetimi</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Toplam: {categories.length} kategori
                </span>
                <span className="text-sm text-gray-500">
                  Ana: {categories.filter(c => !c.parent_id).length}
                </span>
                <span className="text-sm text-gray-500">
                  Alt: {categories.filter(c => c.parent_id).length}
                </span>
              </div>
            </div>
            
            {/* Add/Edit Category Form */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {showEditForm ? 'Kategori Düzenle' : 'Yeni Kategori Oluştur'}
              </h3>
              <form onSubmit={showEditForm ? handleUpdateCategory : handleAddCategory} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori Adı *
                    </label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Örn: Elektronik"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ana Kategori
                    </label>
                    <select
                      value={newCategory.parent_id || ''}
                      onChange={(e) => setNewCategory(prev => ({ 
                        ...prev, 
                        parent_id: e.target.value || null 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Ana Kategori Oluştur</option>
                      {categories.filter(cat => !cat.parent_id).map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Boş bırakırsanız ana kategori oluşturulur
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Renk
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                        className="w-12 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="#6b7280"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İkon
                    </label>
                    <div className="flex items-center gap-2">
                      <i className={`${newCategory.icon} text-xl`} style={{ color: newCategory.color }}></i>
                      <select
                        value={newCategory.icon}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="ri-more-line">Genel</option>
                        <option value="ri-gamepad-line">Oyun</option>
                        <option value="ri-movie-line">Film</option>
                        <option value="ri-music-line">Müzik</option>
                        <option value="ri-book-line">Kitap</option>
                        <option value="ri-shirt-line">Giyim</option>
                        <option value="ri-smartphone-line">Teknoloji</option>
                        <option value="ri-home-line">Ev & Yaşam</option>
                        <option value="ri-car-line">Araç</option>
                        <option value="ri-heart-line">Hediye</option>
                        <option value="ri-computer-line">Bilgisayar</option>
                        <option value="ri-camera-line">Kamera</option>
                        <option value="ri-headphone-line">Ses</option>
                        <option value="ri-tv-line">TV</option>
                        <option value="ri-game-line">Oyun Konsolu</option>
                        <option value="ri-tablet-line">Tablet</option>
                        <option value="ri-watch-line">Saat</option>
                        <option value="ri-basketball-line">Spor</option>
                        <option value="ri-plant-line">Bahçe</option>
                        <option value="ri-tools-line">Araçlar</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={apiLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <i className={showEditForm ? "ri-save-line" : "ri-add-line"}></i>
                    {apiLoading ? (showEditForm ? 'Güncelleniyor...' : 'Ekleniyor...') : (showEditForm ? 'Güncelle' : 'Kategori Ekle')}
                  </button>
                  
                  {showEditForm && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditForm(false);
                        setEditingCategory(null);
                        setNewCategory({
                          name: '',
                          color: '#6b7280',
                          icon: 'ri-more-line',
                          parent_id: null
                        });
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <i className="ri-close-line"></i>
                      İptal
                    </button>
                  )}
                  
                  {!showEditForm && (
                    <button
                      type="button"
                      onClick={() => setNewCategory({
                        name: '',
                        color: '#6b7280',
                        icon: 'ri-more-line',
                        parent_id: null
                      })}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <i className="ri-refresh-line"></i>
                      Temizle
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            {/* Categories List */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Mevcut Kategoriler</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Kategori ara..."
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm">
                    <i className="ri-search-line"></i>
                  </button>
                </div>
              </div>
              
              {/* Ana Kategoriler */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="ri-folder-line text-blue-600"></i>
                  Ana Kategoriler ({categories.filter(c => !c.parent_id).length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categories.filter(cat => !cat.parent_id).map(category => (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: category.color }}
                          >
                            <i className={`${category.icon} text-white text-sm`}></i>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">
                              {category.name}
                            </span>
                            <div className="text-xs text-gray-500">
                              {categories.filter(c => c.parent_id === category.id).length} alt kategori
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setNewCategory(prev => ({ 
                              ...prev, 
                              parent_id: category.id,
                              name: '',
                              color: '#6b7280',
                              icon: 'ri-more-line'
                            }))}
                            className="text-blue-500 hover:text-blue-700 text-sm p-1"
                            title="Alt Kategori Ekle"
                          >
                            <i className="ri-add-line"></i>
                          </button>
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-yellow-500 hover:text-yellow-700 text-sm p-1"
                            title="Kategoriyi Düzenle"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-500 hover:text-red-700 text-sm p-1"
                            title="Kategoriyi Sil"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                      
                      {/* Alt Kategoriler */}
                      {categories.filter(c => c.parent_id === category.id).length > 0 && (
                        <div className="ml-9 space-y-2">
                          {categories.filter(c => c.parent_id === category.id).map(subCategory => (
                            <div key={subCategory.id} className="flex items-center justify-between bg-gray-50 rounded p-2">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: subCategory.color }}
                                ></div>
                                <i className={`${subCategory.icon} text-sm`} style={{ color: subCategory.color }}></i>
                                <span className="text-sm text-gray-700">
                                  {subCategory.name}
                                </span>
                              </div>
                              <button
                                onClick={() => handleEditCategory(subCategory)}
                                className="text-yellow-400 hover:text-yellow-600 text-xs p-1"
                                title="Alt Kategoriyi Düzenle"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(subCategory.id)}
                                className="text-red-400 hover:text-red-600 text-xs p-1"
                                title="Alt Kategoriyi Sil"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Tüm Kategoriler Listesi */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="ri-list-check text-green-600"></i>
                  Tüm Kategoriler
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kategori
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tip
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Alt Kategori Sayısı
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Oluşturulma Tarihi
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categories.map(category => (
                        <tr key={category.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: category.color }}
                              >
                                <i className={`${category.icon} text-white text-sm`}></i>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {category.name}
                                </div>
                                {category.parent_id && (
                                  <div className="text-xs text-gray-500">
                                    Ana: {categories.find(c => c.id === category.parent_id)?.name}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              category.parent_id 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {category.parent_id ? 'Alt Kategori' : 'Ana Kategori'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {categories.filter(c => c.parent_id === category.id).length}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(category.created_at).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              {!category.parent_id && (
                                <button
                                  onClick={() => setNewCategory(prev => ({ 
                                    ...prev, 
                                    parent_id: category.id,
                                    name: '',
                                    color: '#6b7280',
                                    icon: 'ri-more-line'
                                  }))}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Alt Kategori Ekle"
                                >
                                  <i className="ri-add-line"></i>
                                </button>
                              )}
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Düzenle"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Sil"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Form */}
        {showAddForm && (
          <ProductForm
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            categories={categories}
            handleAddProduct={handleAddProduct}
            handleFileSelect={handleFileSelect}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            isDragOver={isDragOver}
            uploadProgress={uploadProgress}
            apiLoading={apiLoading}
          />
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Mevcut Ürünler</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ürün
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <Image
                            className="h-12 w-12 rounded-lg object-cover"
                            src={product.image || '/placeholder-image.jpg'}
                            alt={product.title}
                            width={48}
                            height={48}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category}</div>
                      {product.subcategory && (
                        <div className="text-sm text-gray-500">{product.subcategory}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₺{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminProtection>
  );
}
