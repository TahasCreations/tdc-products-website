'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  images: string[];
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Form states
  const [newCategory, setNewCategory] = useState({ name: '', color: '#6b7280', icon: 'ri-more-line' });
  const [newProduct, setNewProduct] = useState({
    title: '', price: '', category: '', stock: '', image: '', images: [], description: '', slug: ''
  });

  // LocalStorage key'leri
  const CATEGORIES_STORAGE_KEY = 'tdc_categories';
  const PRODUCTS_STORAGE_KEY = 'tdc_products';

  // LocalStorage'dan veri yükle
  const loadFromLocalStorage = (key: string, defaultValue: any[]) => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
      } catch (error) {
        console.error(`Error loading from localStorage (${key}):`, error);
        return defaultValue;
      }
    }
    return defaultValue;
  };

  // LocalStorage'a veri kaydet
  const saveToLocalStorage = (key: string, data: any[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch (error) {
        console.error(`Error saving to localStorage (${key}):`, error);
        return false;
      }
    }
    return false;
  };

  // Default kategoriler
  const getDefaultCategories = (): Category[] => [
    { 
      id: '1', 
      name: 'Anime', 
      color: '#ec4899', 
      icon: 'ri-gamepad-line',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: '2', 
      name: 'Gaming', 
      color: '#3b82f6', 
      icon: 'ri-controller-line',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: '3', 
      name: 'Film', 
      color: '#8b5cf6', 
      icon: 'ri-movie-line',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: '4', 
      name: 'Diğer', 
      color: '#6b7280', 
      icon: 'ri-more-line',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Default ürünler
  const getDefaultProducts = (): Product[] => [
    {
      id: "1",
      slug: "naruto-uzumaki-figuru",
      title: "Naruto Uzumaki Figürü",
      price: 299.99,
      category: "Anime",
      stock: 15,
      image: "/uploads/naruto-figur.jpg",
      images: ["/uploads/naruto-figur.jpg", "/uploads/naruto-figur-2.jpg"],
      description: "Naruto anime serisinin baş karakteri olan Naruto Uzumaki'nin detaylı 3D baskı figürü.",
      status: "active",
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-01T00:00:00.000Z"
    },
    {
      id: "2",
      slug: "goku-super-saiyan-figuru",
      title: "Goku Super Saiyan Figürü",
      price: 349.99,
      category: "Anime",
      stock: 8,
      image: "/uploads/goku-figur.jpg",
      images: ["/uploads/goku-figur.jpg", "/uploads/goku-figur-2.jpg"],
      description: "Dragon Ball serisinin efsanevi karakteri Goku'nun Super Saiyan formundaki detaylı figürü.",
      status: "active",
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-01T00:00:00.000Z"
    }
  ];

  // Verileri yükle
  useEffect(() => {
    const loadData = () => {
      try {
        // LocalStorage'dan kategorileri yükle
        const storedCategories = loadFromLocalStorage(CATEGORIES_STORAGE_KEY, getDefaultCategories());
        setCategories(storedCategories);

        // LocalStorage'dan ürünleri yükle
        const storedProducts = loadFromLocalStorage(PRODUCTS_STORAGE_KEY, getDefaultProducts());
        setProducts(storedProducts);

        setLoading(false);
      } catch (error) {
        console.error('Data loading error:', error);
        setCategories(getDefaultCategories());
        setProducts(getDefaultProducts());
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Kategori ekle
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      setMessage('Kategori adı gerekli');
      setMessageType('error');
      return;
    }

    try {
      setApiLoading(true);
      setMessage('Kategori ekleniyor...');

      const categoryData = {
        name: newCategory.name.trim(),
        color: newCategory.color,
        icon: newCategory.icon
      };

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...categoryData, action: 'add' }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          const newCategoryItem = result.category;
          
          // LocalStorage'a kaydet
          const updatedCategories = [...categories, newCategoryItem];
          saveToLocalStorage(CATEGORIES_STORAGE_KEY, updatedCategories);
          
          // State'i güncelle
          setCategories(updatedCategories);
          setNewCategory({ name: '', color: '#6b7280', icon: 'ri-more-line' });
          
          setMessage('Kategori başarıyla eklendi! (localStorage\'da saklanıyor)');
          setMessageType('success');
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage(result.error || 'Kategori eklenemedi');
          setMessageType('error');
        }
      } else {
        const error = await response.json();
        setMessage(error.error || 'Kategori eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Bağlantı hatası');
      setMessageType('error');
    } finally {
      setApiLoading(false);
    }
  };

  // Ürün ekle
  const handleAddProduct = async () => {
    if (!newProduct.title.trim()) {
      setMessage('Ürün adı gerekli');
      setMessageType('error');
      return;
    }

    if (!newProduct.price || isNaN(parseFloat(newProduct.price))) {
      setMessage('Geçerli fiyat gerekli');
      setMessageType('error');
      return;
    }

    if (!newProduct.category.trim()) {
      setMessage('Kategori gerekli');
      setMessageType('error');
      return;
    }

    if (!newProduct.stock || isNaN(parseInt(newProduct.stock))) {
      setMessage('Geçerli stok miktarı gerekli');
      setMessageType('error');
      return;
    }

    try {
      setApiLoading(true);
      setMessage('Ürün ekleniyor...');

      const productData = {
        title: newProduct.title.trim(),
        price: parseFloat(newProduct.price),
        category: newProduct.category.trim(),
        stock: parseInt(newProduct.stock),
        image: newProduct.image,
        images: newProduct.images,
        description: newProduct.description.trim(),
        slug: newProduct.slug.trim()
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...productData, action: 'add' }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          const newProductItem = result.product;
          
          // LocalStorage'a kaydet
          const updatedProducts = [newProductItem, ...products];
          saveToLocalStorage(PRODUCTS_STORAGE_KEY, updatedProducts);
          
          // State'i güncelle
          setProducts(updatedProducts);
          setNewProduct({ title: '', price: '', category: '', stock: '', image: '', images: [], description: '', slug: '' });
          
          setMessage('Ürün başarıyla eklendi! (localStorage\'da saklanıyor)');
          setMessageType('success');
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage(result.error || 'Ürün eklenemedi');
          setMessageType('error');
        }
      } else {
        const error = await response.json();
        setMessage(error.error || 'Ürün eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Bağlantı hatası');
      setMessageType('error');
    } finally {
      setApiLoading(false);
    }
  };

  // Kategori sil
  const handleDeleteCategory = (id: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== id);
    saveToLocalStorage(CATEGORIES_STORAGE_KEY, updatedCategories);
    setCategories(updatedCategories);
    setMessage('Kategori silindi');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  };

  // Ürün sil
  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter(prod => prod.id !== id);
    saveToLocalStorage(PRODUCTS_STORAGE_KEY, updatedProducts);
    setProducts(updatedProducts);
    setMessage('Ürün silindi');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  };

  // Verileri sıfırla
  const handleResetData = () => {
    if (confirm('Tüm verileri sıfırlamak istediğinizden emin misiniz?')) {
      // LocalStorage'ı temizle
      localStorage.removeItem(CATEGORIES_STORAGE_KEY);
      localStorage.removeItem(PRODUCTS_STORAGE_KEY);
      
      // Default verileri yükle
      setCategories(getDefaultCategories());
      setProducts(getDefaultProducts());
      
      setMessage('Veriler sıfırlandı');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Yönetim Paneli</h1>
              <p className="text-gray-600">TDC Products yönetim sistemi</p>
              <p className="text-sm text-gray-500 mt-1">LocalStorage ile veri saklama sistemi</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4`}>
          <div className={`p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kategori Ekleme */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Kategori Ekle</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Adı
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Kategori adını girin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Renk
                </label>
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İkon
                </label>
                <select
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ri-more-line">Genel</option>
                  <option value="ri-gamepad-line">Oyun</option>
                  <option value="ri-movie-line">Film</option>
                  <option value="ri-controller-line">Kontrol</option>
                  <option value="ri-heart-line">Favori</option>
                  <option value="ri-star-line">Yıldız</option>
                </select>
              </div>
              <button
                onClick={handleAddCategory}
                disabled={apiLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {apiLoading ? 'Ekleniyor...' : 'Kategori Ekle'}
              </button>
            </div>
          </div>

          {/* Ürün Ekleme */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ürün Ekle</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün Adı
                </label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ürün adını girin"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fiyat
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stok
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Kategori seçin</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Görsel URL
                </label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ürün açıklaması"
                />
              </div>
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

        {/* Veri Yönetimi */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Veri Yönetimi</h2>
            <button
              onClick={handleResetData}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Verileri Sıfırla
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kategoriler */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Kategoriler ({categories.length})</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Ürünler */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Ürünler ({products.length})</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
                        <i className="ri-image-line text-gray-500"></i>
                      </div>
                      <div>
                        <span className="text-sm font-medium">{product.title}</span>
                        <p className="text-xs text-gray-500">{product.category} • ₺{product.price}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}