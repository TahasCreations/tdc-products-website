'use client';

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import Auth from './auth';
import { useRouter } from 'next/navigation';

// Dynamic export - admin sayfası static generation yapılmasın
export const dynamic = 'force-dynamic';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  stock: number;
  status: string;
  slug: string;
  image: string;
  images?: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
  status: 'active' | 'inactive';
  expiryDate: string;
  usageCount: number;
  maxUsage: number;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [apiLoading, setApiLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [supabaseReady, setSupabaseReady] = useState<boolean | null>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);

  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    category: '',
    stock: '',
    image: '',
    images: [] as string[],
    description: '',
    slug: ''
  });

  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', type: 'percent', expiryDate: '', maxUsage: '' });

  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#6b7280',
    icon: 'ri-more-line'
  });
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Supabase bağlantısını kontrol et
  const checkSupabaseConfig = () => {
    return isSupabaseConfigured();
  };

  // Auth state kontrolü
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch('/api/test-supabase', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setSupabaseReady(!!json.configured);
        } else {
          setSupabaseReady(false);
        }
      } catch (error) {
        setSupabaseReady(false);
      }

      if (isSupabaseConfigured()) {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setLoading(false);
        
        if (user) {
          await loadCategories();
          await loadProducts();
        }
      } else {
        setLoading(false);
      }
    };

    getUser();

    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadCategories().then(() => loadProducts());
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Ürünleri yükle
  const loadProducts = async () => {
    try {
      setApiLoading(true);
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
          setMessage('Ürün verisi geçersiz');
        }
      } else {
        setProducts([]);
        setMessage('Ürünler yüklenemedi');
      }
    } catch (error) {
      setProducts([]);
      setMessage('Bağlantı hatası');
    } finally {
      setApiLoading(false);
    }
  };

  // Kategorileri yükle
  const loadCategories = async () => {
    try {
      setApiLoading(true);
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
          setMessage('Kategori verisi geçersiz');
        }
      } else {
        setCategories([]);
        setMessage('Kategoriler yüklenemedi');
      }
    } catch (error) {
      setCategories([]);
      setMessage('Kategoriler yüklenemedi');
    } finally {
      setApiLoading(false);
    }
  };

  // Resim yükle
  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        const error = await response.json();
        setMessage(error.error || 'Resim yüklenemedi');
        return null;
      }
    } catch (error) {
      setMessage('Resim yükleme hatası');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Çoklu görsel yükleme (drag & drop ve multi-select desteği)
  const maxImages = 10;
  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const currentImages = editingProduct ? (editingProduct.images || []) : (newProduct.images || []);
    const availableSlots = Math.max(0, maxImages - currentImages.length);
    const filesToUpload = Array.from(files).slice(0, availableSlots);
    if (filesToUpload.length === 0) {
      setMessage(`En fazla ${maxImages} görsel yükleyebilirsiniz.`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setUploading(true);
    const uploaded: string[] = [];
    for (const f of filesToUpload) {
      const url = await handleImageUpload(f);
      if (url) uploaded.push(url);
    }
    if (editingProduct) {
      const nextImages = [...currentImages, ...uploaded];
      setEditingProduct({
        ...editingProduct,
        image: editingProduct.image || uploaded[0] || '',
        images: nextImages
      } as Product);
    } else {
      setNewProduct(prev => ({
        ...prev,
        image: prev.image || uploaded[0] || '',
        images: [...(prev.images || []), ...uploaded]
      }));
    }
    setUploading(false);
  };

  const removeImageAt = (index: number) => {
    if (editingProduct) {
      const imgs = editingProduct.images || [];
      const next = imgs.filter((_, i) => i !== index);
      const cover = index === 0 ? (next[0] || '') : editingProduct.image;
      setEditingProduct({ ...(editingProduct as Product), images: next, image: cover });
    } else {
      const imgs = newProduct.images || [];
      const next = imgs.filter((_, i) => i !== index);
      const cover = index === 0 ? (next[0] || '') : newProduct.image;
      setNewProduct(prev => ({ ...prev, images: next, image: cover }));
    }
  };

  const setAsCover = (index: number) => {
    if (editingProduct) {
      const imgs = editingProduct.images || [];
      if (!imgs[index]) return;
      const next = [imgs[index], ...imgs.filter((_, i) => i !== index)];
      setEditingProduct({ ...(editingProduct as Product), images: next, image: next[0] });
    } else {
      const imgs = newProduct.images || [];
      if (!imgs[index]) return;
      const next = [imgs[index], ...imgs.filter((_, i) => i !== index)];
      setNewProduct(prev => ({ ...prev, images: next, image: next[0] }));
    }
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const reorder = (arr: string[]) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= arr.length) return arr;
      const copy = [...arr];
      const [item] = copy.splice(index, 1);
      copy.splice(newIndex, 0, item);
      return copy;
    };
    if (editingProduct) {
      const imgs = editingProduct.images || [];
      const next = reorder(imgs);
      setEditingProduct({ ...(editingProduct as Product), images: next, image: next[0] || editingProduct.image });
    } else {
      const imgs = newProduct.images || [];
      const next = reorder(imgs);
      setNewProduct(prev => ({ ...prev, images: next, image: next[0] || prev.image }));
    }
  };

  const reorderByDrag = (from: number, to: number) => {
    if (from === to) return;
    const apply = (arr: string[]) => {
      const copy = [...arr];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    };
    if (editingProduct) {
      const imgs = editingProduct.images || [];
      const next = apply(imgs);
      setEditingProduct({ ...(editingProduct as Product), images: next, image: next[0] || editingProduct.image });
    } else {
      const imgs = newProduct.images || [];
      const next = apply(imgs);
      setNewProduct(prev => ({ ...prev, images: next, image: next[0] || prev.image }));
    }
  };

  // Ürün ekle
  const handleAddProduct = async () => {
    if (!newProduct.title.trim()) {
      setMessage('Ürün adı gerekli');
      return;
    }
    if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
      setMessage('Geçerli bir fiyat girin');
      return;
    }
    if (!newProduct.category.trim()) {
      setMessage('Kategori seçin');
      return;
    }
    if (!newProduct.stock || parseInt(newProduct.stock) < 0) {
      setMessage('Geçerli bir stok miktarı girin');
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
        image: newProduct.image || (newProduct.images && newProduct.images.length > 0 ? newProduct.images[0] : ''),
        images: newProduct.images || [],
        description: newProduct.description.trim(),
        slug: newProduct.slug.trim() || newProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const addedProduct = await response.json();
        setProducts([addedProduct, ...products]);
        setNewProduct({ title: '', price: '', category: '', stock: '', image: '', images: [], description: '', slug: '' });
        setMessage('Ürün başarıyla eklendi!');
        setTimeout(() => setMessage(''), 3000);
        
        if (addedProduct?.slug) {
          router.push(`/products/${addedProduct.slug}`);
        }
      } else {
        const error = await response.json();
        setMessage(error.error || 'Ürün eklenemedi');
      }
    } catch (error) {
      setMessage('Bağlantı hatası');
    } finally {
      setApiLoading(false);
    }
  };

  // Ürün güncelle
  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    try {
      setApiLoading(true);
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        setEditingProduct(null);
        setMessage('Ürün başarıyla güncellendi!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await response.json();
        setMessage(error.error || 'Ürün güncellenemedi');
      }
    } catch (error) {
      setMessage('Bağlantı hatası');
    } finally {
      setApiLoading(false);
    }
  };

  // Ürün sil
  const deleteProduct = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    
    try {
      setApiLoading(true);
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
        setMessage('Ürün başarıyla silindi!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Ürün silinemedi');
      }
    } catch (error) {
      setMessage('Bağlantı hatası');
    } finally {
      setApiLoading(false);
    }
  };

  // Çıkış yap
  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const handleAddCoupon = () => {
    if (newCoupon.code && newCoupon.discount && newCoupon.expiryDate && newCoupon.maxUsage) {
      const coupon: Coupon = {
        id: Date.now().toString(),
        code: newCoupon.code,
        discount: parseFloat(newCoupon.discount),
        type: newCoupon.type as 'percent' | 'fixed',
        status: 'active',
        expiryDate: newCoupon.expiryDate,
        usageCount: 0,
        maxUsage: parseInt(newCoupon.maxUsage)
      };
      setCoupons([...coupons, coupon]);
      setNewCoupon({ code: '', discount: '', type: 'percent', expiryDate: '', maxUsage: '' });
    }
  };

  // Kategori ekle
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      setMessage('Kategori adı gerekli');
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
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const addedCategory = await response.json();
        setCategories([...categories, addedCategory]);
        setNewCategory({ name: '', color: '#6b7280', icon: 'ri-more-line' });
        setMessage('Kategori başarıyla eklendi!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await response.json();
        setMessage(error.error || 'Kategori eklenemedi');
      }
    } catch (error) {
      setMessage('Bağlantı hatası');
    } finally {
      setApiLoading(false);
    }
  };

  // Kategori güncelle
  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      setMessage('Kategori adı gerekli');
      return;
    }

    try {
      setApiLoading(true);
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingCategory),
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories(categories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
        setEditingCategory(null);
        setMessage('Kategori başarıyla güncellendi!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await response.json();
        setMessage(error.error || 'Kategori güncellenemedi');
      }
    } catch (error) {
      setMessage('Bağlantı hatası');
    } finally {
      setApiLoading(false);
    }
  };

  // Kategori sil
  const deleteCategory = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;
    
    try {
      setApiLoading(true);
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories(categories.filter(cat => cat.id !== id));
        setMessage('Kategori başarıyla silindi!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Kategori silinemedi');
      }
    } catch (error) {
      setMessage('Bağlantı hatası');
    } finally {
      setApiLoading(false);
    }
  };

  const deleteCoupon = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  const updateOrderStatus = (id: string, newStatus: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const tabs = [
    { id: 'dashboard', name: 'Panel', icon: 'ri-dashboard-line' },
    { id: 'products', name: 'Ürünler', icon: 'ri-shopping-bag-line' },
    { id: 'categories', name: 'Kategoriler', icon: 'ri-price-tag-3-line' },
    { id: 'coupons', name: 'Kuponlar', icon: 'ri-coupon-line' },
    { id: 'orders', name: 'Siparişler', icon: 'ri-file-list-line' },
    { id: 'bistcontrol', name: 'BİST Kontrol', icon: 'ri-line-chart-line' },
    { id: 'finance', name: 'Finans', icon: 'ri-money-dollar-circle-line' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Supabase yapılandırılmamışsa hata göster
  if (supabaseReady === false || (!isSupabaseConfigured() && supabaseReady !== null)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-error-warning-line text-2xl text-red-600"></i>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Yapılandırma Hatası</h1>
              <p className="text-gray-600">Supabase bağlantısı yapılandırılmamış</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Hata:</strong> Supabase environment variables ayarlanmamış.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-semibold mb-2">Çözüm:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Vercel Dashboard'da Environment Variables ayarla</li>
                  <li>• Supabase projesini yapılandır</li>
                  <li>• Admin kullanıcısı oluştur</li>
                </ul>
                <div className="mt-3 text-xs text-blue-700">
                  <a href="/api/public-supabase" className="underline">/api/public-supabase</a> ile prod ortamda URL/ANON key var mı kontrol edin.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Kullanıcı yoksa login göster
  if (!user) {
    return <Auth onLogin={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Yönetim Paneli</h1>
            <p className="text-gray-600">TDC Products yönetim sistemi</p>
            <p className="text-sm text-gray-500 mt-1">Hoş geldin, {user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
          >
            <i className="ri-logout-box-line"></i>
            <span>Çıkış Yap</span>
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            message.includes('başarıyla') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <i className={`${message.includes('başarıyla') ? 'ri-check-line text-green-500' : 'ri-error-warning-line text-red-500'}`}></i>
            <span className={message.includes('başarıyla') ? 'text-green-700' : 'text-red-700'}>{message}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-300
                    ${activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <i className={`${tab.icon} text-lg`}></i>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className="ri-shopping-bag-line text-xl text-orange-600"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                    <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-file-list-line text-xl text-green-600"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aktif Kupon</p>
                    <p className="text-2xl font-bold text-gray-900">{coupons.filter(c => c.status === 'active').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="ri-coupon-line text-xl text-blue-600"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                    <p className="text-2xl font-bold text-gray-900">₺{orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="ri-money-dollar-circle-line text-xl text-purple-600"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Son Siparişler</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <i className="ri-shopping-bag-line text-orange-600"></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.customer}</p>
                          <p className="text-sm text-gray-600">{order.id} • {order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₺{order.total}</p>
                        <span className={`
                          inline-flex px-2 py-1 text-xs font-semibold rounded-full
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'}
                        `}>
                          {order.status === 'delivered' ? 'Teslim Edildi' :
                           order.status === 'shipped' ? 'Kargoda' :
                           order.status === 'processing' ? 'Hazırlanıyor' :
                           order.status === 'pending' ? 'Beklemede' : 'İptal'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Add Product Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                </h3>
                {editingProduct && (
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setNewProduct({ title: '', price: '', category: '', stock: '', image: '', images: [], description: '', slug: '' });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Ürün Adı"
                  value={editingProduct ? editingProduct.title : newProduct.title}
                  onChange={(e) => editingProduct 
                    ? setEditingProduct({...editingProduct, title: e.target.value})
                    : setNewProduct({...newProduct, title: e.target.value})
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <input
                  type="number"
                  placeholder="Fiyat (₺)"
                  value={editingProduct ? editingProduct.price : newProduct.price}
                  onChange={(e) => editingProduct 
                    ? setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})
                    : setNewProduct({...newProduct, price: e.target.value})
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <select
                  value={editingProduct ? editingProduct.category : newProduct.category}
                  onChange={(e) => editingProduct 
                    ? setEditingProduct({...editingProduct, category: e.target.value})
                    : setNewProduct({...newProduct, category: e.target.value})
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-8"
                >
                  <option value="">Kategori Seç</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Stok"
                  value={editingProduct ? editingProduct.stock : newProduct.stock}
                  onChange={(e) => editingProduct 
                    ? setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})
                    : setNewProduct({...newProduct, stock: e.target.value})
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Görsel Yükleme (Sürükle-Bırak, Çoklu) */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Görseller (max 10)</label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={async (e) => {
                    e.preventDefault();
                    await handleFiles(e.dataTransfer.files);
                  }}
                  className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50"
                  onClick={() => (document.getElementById('multi-image-input') as HTMLInputElement)?.click()}
                >
                  <div className="flex flex-col items-center justify-center text-gray-600">
                    <i className="ri-upload-cloud-2-line text-2xl mb-1"></i>
                    <div>Dosyaları sürükleyip bırakın veya tıklayıp seçin</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">JPEG, PNG, WEBP — boyut sınırı yok</div>
                </div>
                <input
                  id="multi-image-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => { await handleFiles(e.target.files); }}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading && (
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Görseller yükleniyor...
                  </div>
                )}
                {((editingProduct && (editingProduct.images || []).length > 0) || (!editingProduct && newProduct.images.length > 0)) && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {(editingProduct ? (editingProduct.images || []) : newProduct.images).map((src, idx) => (
                      <div
                        key={idx}
                        className="relative group"
                        draggable
                        onDragStart={() => setDragIndex(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => { if (dragIndex !== null) { reorderByDrag(dragIndex, idx); setDragIndex(null); } }}
                      >
                        <img src={src} alt={`img-${idx}`} className="w-full h-20 object-cover rounded-lg border" />
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => setAsCover(idx)} className="bg-white/90 rounded-full px-2 text-xs" title="Kapak Yap">★</button>
                          <button onClick={() => moveImage(idx, -1)} className="bg-white/90 rounded-full px-2 text-xs" title="Sola">←</button>
                          <button onClick={() => moveImage(idx, 1)} className="bg-white/90 rounded-full px-2 text-xs" title="Sağa">→</button>
                          <button onClick={() => removeImageAt(idx)} className="bg-white/90 rounded-full px-2 text-xs" title="Kaldır">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <textarea
                placeholder="Ürün Açıklaması"
                value={editingProduct ? editingProduct.description : newProduct.description}
                onChange={(e) => editingProduct 
                  ? setEditingProduct({...editingProduct, description: e.target.value})
                  : setNewProduct({...newProduct, description: e.target.value})
                }
                rows={3}
                className="mt-4 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              />
              
              <div className="mt-4 flex gap-3">
                <button
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  disabled={apiLoading}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 whitespace-nowrap flex items-center space-x-2"
                >
                  {apiLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      <span>İşleniyor...</span>
                    </>
                  ) : (
                    <>
                      <i className={`${editingProduct ? 'ri-save-line' : 'ri-add-line'} mr-2`}></i>
                      <span>{editingProduct ? 'Güncelle' : 'Ürün Ekle'}</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => loadProducts()}
                  disabled={apiLoading}
                  className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                >
                  <i className="ri-refresh-line mr-2"></i>
                  Yenile
                </button>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Ürün Listesi ({products.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          <div className="text-sm text-gray-500">{product.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₺{product.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Aktif
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                              title="Düzenle"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200"
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
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Add Category Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
                </h3>
                {editingCategory && (
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setNewCategory({ name: '', color: '#6b7280', icon: 'ri-more-line' });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Kategori Adı"
                  value={editingCategory ? editingCategory.name : newCategory.name}
                  onChange={(e) => editingCategory 
                    ? setEditingCategory({...editingCategory, name: e.target.value})
                    : setNewCategory({...newCategory, name: e.target.value})
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <input
                  type="color"
                  value={editingCategory ? editingCategory.color : newCategory.color}
                  onChange={(e) => editingCategory 
                    ? setEditingCategory({...editingCategory, color: e.target.value})
                    : setNewCategory({...newCategory, color: e.target.value})
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-10"
                />
                <select
                  value={editingCategory ? editingCategory.icon : newCategory.icon}
                  onChange={(e) => editingCategory 
                    ? setEditingCategory({...editingCategory, icon: e.target.value})
                    : setNewCategory({...newCategory, icon: e.target.value})
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-8"
                >
                  <option value="ri-more-line">Genel</option>
                  <option value="ri-gamepad-line">Oyun</option>
                  <option value="ri-controller-line">Kontrol</option>
                  <option value="ri-movie-line">Film</option>
                  <option value="ri-user-star-line">Kullanıcı</option>
                  <option value="ri-heart-line">Kalp</option>
                  <option value="ri-star-line">Yıldız</option>
                  <option value="ri-gift-line">Hediye</option>
                  <option value="ri-shopping-bag-line">Alışveriş</option>
                  <option value="ri-home-line">Ev</option>
                </select>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button
                  onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                  disabled={apiLoading}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 whitespace-nowrap flex items-center space-x-2"
                >
                  {apiLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      <span>İşleniyor...</span>
                    </>
                  ) : (
                    <>
                      <i className={`${editingCategory ? 'ri-save-line' : 'ri-add-line'} mr-2`}></i>
                      <span>{editingCategory ? 'Güncelle' : 'Kategori Ekle'}</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => loadCategories()}
                  disabled={apiLoading}
                  className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                >
                  <i className="ri-refresh-line mr-2"></i>
                  Yenile
                </button>
              </div>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Kategori Listesi ({categories.length})</h3>
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
                      <tr key={category.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-6 h-6 rounded-full border border-gray-300"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span className="text-sm text-gray-500">{category.color}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <i className={`${category.icon} text-xl`} style={{ color: category.color }}></i>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingCategory(category)}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                              title="Düzenle"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => deleteCategory(category.id)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200"
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
        )}

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            {/* Add Coupon Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Kupon Oluştur</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="Kupon Kodu"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <input
                  type="number"
                  placeholder="İndirim Miktarı"
                  value={newCoupon.discount}
                  onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <select
                  value={newCoupon.type}
                  onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-8"
                >
                  <option value="percent">Yüzde (%)</option>
                  <option value="fixed">Sabit Tutar (₺)</option>
                </select>
                <input
                  type="date"
                  value={newCoupon.expiryDate}
                  onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <input
                  type="number"
                  placeholder="Max Kullanım"
                  value={newCoupon.maxUsage}
                  onChange={(e) => setNewCoupon({...newCoupon, maxUsage: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <button
                onClick={handleAddCoupon}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 whitespace-nowrap"
              >
                <i className="ri-coupon-line mr-2"></i>
                Kupon Oluştur
              </button>
            </div>

            {/* Coupons List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Kupon Listesi</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kod</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İndirim</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanım</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Tarih</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coupons.map((coupon) => (
                      <tr key={coupon.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {coupon.code}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {coupon.discount}{coupon.type === 'percent' ? '%' : '₺'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {coupon.usageCount}/{coupon.maxUsage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {coupon.expiryDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            coupon.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {coupon.status === 'active' ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteCoupon(coupon.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            <i className="ri-delete-bin-line"></i>
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

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Sipariş Yönetimi</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sipariş No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono font-bold text-gray-900">{order.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">₺{order.total}</div>
                        <div className="text-sm text-gray-500">{order.items} ürün</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className={`
                            text-xs font-semibold rounded-full px-3 py-1 border-0 pr-8
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'}
                          `}
                        >
                          <option value="pending">Beklemede</option>
                          <option value="processing">Hazırlanıyor</option>
                          <option value="shipped">Kargoda</option>
                          <option value="delivered">Teslim Edildi</option>
                          <option value="cancelled">İptal</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200 mr-3">
                          <i className="ri-eye-line"></i>
                        </button>
                        <button className="text-green-600 hover:text-green-900 transition-colors duration-200">
                          <i className="ri-printer-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {(activeTab === 'bistcontrol' || activeTab === 'finance') && (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <i className="ri-settings-line text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'bistcontrol' && 'BİST Kontrol Paneli'}
              {activeTab === 'finance' && 'Finans Yönetimi'}
            </h3>
            <p className="text-gray-600">Bu özellik yakında eklenecek...</p>
          </div>
        )}
      </div>
    </div>
  );
}