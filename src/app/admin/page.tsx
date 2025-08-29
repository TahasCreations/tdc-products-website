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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
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

  // Giriş yap
  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setMessage('Başarıyla giriş yapıldı!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Kullanıcı adı veya şifre hatalı!');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Çıkış yap
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setMessage('Çıkış yapıldı!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  };

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
          
          setMessage('Kategori başarıyla eklendi!');
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
          
          setMessage('Ürün başarıyla eklendi!');
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

  // Giriş ekranı
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-admin-line text-2xl text-white"></i>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Girişi</h1>
              <p className="text-gray-600">TDC Products yönetim paneline hoş geldiniz</p>
            </div>

            {message && (
              <div className={`p-4 rounded-lg mb-6 ${
                messageType === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Kullanıcı adınızı girin"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Şifrenizi girin"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                Giriş Yap
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/')}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                <i className="ri-arrow-left-line mr-1"></i>
                Ana Sayfaya Dön
              </button>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Giriş Bilgileri:</strong><br />
                Kullanıcı Adı: <code>admin</code><br />
                Şifre: <code>admin123</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ana admin paneli
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">TDC Admin Panel</h1>
              <p className="text-gray-600">Yönetim ve kontrol merkezi</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Hoş geldin, Admin</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Çıkış Yap
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Siteyi Görüntüle
              </button>
            </div>
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: 'ri-dashboard-line' },
              { id: 'products', name: 'Ürünler', icon: 'ri-shopping-bag-line' },
              { id: 'categories', name: 'Kategoriler', icon: 'ri-folder-line' },
              { id: 'coupons', name: 'Kuponlar', icon: 'ri-coupon-line' },
              { id: 'orders', name: 'Siparişler', icon: 'ri-shopping-cart-line' },
              { id: 'bist', name: 'BİST Kontrol', icon: 'ri-line-chart-line' },
              { id: 'finance', name: 'Finans', icon: 'ri-money-dollar-circle-line' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={tab.icon}></i>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <i className="ri-shopping-bag-line text-2xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                  <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <i className="ri-folder-line text-2xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Kategoriler</p>
                  <p className="text-2xl font-semibold text-gray-900">{categories.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <i className="ri-shopping-cart-line text-2xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                  <p className="text-2xl font-semibold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <i className="ri-money-dollar-circle-line text-2xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                  <p className="text-2xl font-semibold text-gray-900">₺0</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Görsel URL</label>
                  <input
                    type="text"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ürün açıklaması"
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

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Mevcut Ürünler ({products.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt={product.title} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₺{product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
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
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Kategori Ekle</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Adı</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Kategori adını girin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Renk</label>
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İkon</label>
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
                <div className="md:col-span-3">
                  <button
                    onClick={handleAddCategory}
                    disabled={apiLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {apiLoading ? 'Ekleniyor...' : 'Kategori Ekle'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Mevcut Kategoriler ({categories.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renk</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İkon</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded-full mr-2"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span className="text-sm text-gray-900">{category.color}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <i className={category.icon}></i>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
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
        )}

        {activeTab === 'coupons' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Kupon Yönetimi</h2>
            <p className="text-gray-600">Bu özellik yakında eklenecek...</p>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sipariş Yönetimi</h2>
            <p className="text-gray-600">Bu özellik yakında eklenecek...</p>
          </div>
        )}

        {activeTab === 'bist' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">BİST Kontrol</h2>
            <p className="text-gray-600">Bu özellik yakında eklenecek...</p>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Finans Yönetimi</h2>
            <p className="text-gray-600">Bu özellik yakında eklenecek...</p>
          </div>
        )}
      </div>
    </div>
  );
}