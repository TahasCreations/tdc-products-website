'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import { StatCard } from '../../components/AnalyticsCharts';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const DailyOrdersChart = dynamic(() => import('../../components/AnalyticsCharts').then(mod => ({ default: mod.DailyOrdersChart })), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
});

const DailySalesChart = dynamic(() => import('../../components/AnalyticsCharts').then(mod => ({ default: mod.DailySalesChart })), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
});

const AnalyticsTable = dynamic(() => import('../../components/AnalyticsCharts').then(mod => ({ default: mod.AnalyticsTable })), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
});

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
  stock: number;
  image: string;
  images: string[];
  description: string;
  status: string;
  variations?: string[]; // Varyasyonlar (S, M, L, XL, vb.)
  created_at: string;
  updated_at: string;
}

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_amount?: number;
  max_uses?: number;
  used_count: number;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface StockMovement {
  id: string;
  product_id: string;
  product_title: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason: string;
  notes?: string;
  created_by: string;
  created_at: string;
}

interface StockAlert {
  id: string;
  product_id: string;
  product_title: string;
  alert_type: 'low_stock' | 'out_of_stock' | 'overstock';
  threshold: number;
  current_stock: number;
  is_active: boolean;
  created_at: string;
}

// Client-side Supabase client
const createClientSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Admin kullanıcı kontrolü
const checkAdminUser = async (email: string) => {
  const supabase = createClientSupabaseClient();
  if (!supabase) return false;

  try {
    // Admin kullanıcıları kontrol et
    const { data, error } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Admin user check error:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Admin user check error:', error);
    return false;
  }
};

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form states
  const [newCategory, setNewCategory] = useState({ name: '', color: '#6b7280', icon: 'ri-more-line', parent_id: null as string | null });
  const [newProduct, setNewProduct] = useState({
    title: '', price: '', category: '', stock: '', image: '', images: [] as string[], description: '', slug: '', variations: [] as string[]
  });
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    min_amount: '',
    max_uses: '',
    expires_at: '',
    is_active: true
  });
  const [stockOperation, setStockOperation] = useState({
    product_id: '',
    type: 'in' as 'in' | 'out' | 'adjustment',
    quantity: '',
    reason: '',
    notes: ''
  });
  const [stockAlert, setStockAlert] = useState({
    product_id: '',
    alert_type: 'low_stock' as 'low_stock' | 'out_of_stock' | 'overstock',
    threshold: ''
  });

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

  // Verileri yükleme fonksiyonu
  const fetchData = async () => {
    try {
      const supabase = createClientSupabaseClient();
      if (!supabase) {
        console.error('Supabase client could not be created');
        setCategories(getDefaultCategories());
        setProducts(getDefaultProducts());
        return;
      }

      // Supabase'den kategorileri yükle
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (categoriesError) {
        console.error('Categories loading error:', categoriesError);
        setCategories(getDefaultCategories());
      } else {
        setCategories(categoriesData || getDefaultCategories());
      }

      // Supabase'den ürünleri yükle
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Products loading error:', productsError);
        setProducts(getDefaultProducts());
      } else {
        setProducts(productsData || getDefaultProducts());
      }

      // Siparişleri getir
      await fetchOrders();
      
      // Müşterileri getir
      await fetchCustomers();
      
      // Kuponları getir
      await fetchCoupons();
      
      // Stok hareketlerini getir
      await fetchStockMovements();
      
      // Stok uyarılarını getir
      await fetchStockAlerts();
    } catch (error) {
      console.error('Data loading error:', error);
      setCategories(getDefaultCategories());
      setProducts(getDefaultProducts());
    }
  };

  const fetchOrders = async () => {
    try {
      const supabase = createClientSupabaseClient();
      if (!supabase) {
        console.error('Supabase client could not be created');
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Sipariş getirme hatası:', error);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Sipariş getirme hatası:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const supabase = createClientSupabaseClient();
      if (!supabase) {
        console.error('Supabase client could not be created');
        return;
      }

      const { data, error } = await supabase.auth.admin.listUsers();

      if (error) {
        console.error('Müşteri getirme hatası:', error);
        return;
      }

      setCustomers(data.users || []);
    } catch (error) {
      console.error('Müşteri getirme hatası:', error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const supabase = createClientSupabaseClient();
      if (!supabase) {
        console.error('Supabase client could not be created');
        return;
      }

      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Kupon getirme hatası:', error);
        return;
      }

      setCoupons(data || []);
    } catch (error) {
      console.error('Kupon getirme hatası:', error);
    }
  };

  const fetchStockMovements = async () => {
    try {
      const supabase = createClientSupabaseClient();
      if (!supabase) {
        console.error('Supabase client could not be created');
        return;
      }

      const { data, error } = await supabase
        .from('stock_movements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Stok hareketi getirme hatası:', error);
        return;
      }

      setStockMovements(data || []);
    } catch (error) {
      console.error('Stok hareketi getirme hatası:', error);
    }
  };

  const fetchStockAlerts = async () => {
    try {
      const supabase = createClientSupabaseClient();
      if (!supabase) {
        console.error('Supabase client could not be created');
        return;
      }

      const { data, error } = await supabase
        .from('stock_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Stok uyarısı getirme hatası:', error);
        return;
      }

      setStockAlerts(data || []);
    } catch (error) {
      console.error('Stok uyarısı getirme hatası:', error);
    }
  };

  // Kupon ekle
  const handleAddCoupon = async () => {
    if (!newCoupon.code.trim()) {
      setMessage('Kupon kodu gerekli');
      setMessageType('error');
      return;
    }

    if (!newCoupon.value || parseFloat(newCoupon.value) <= 0) {
      setMessage('Geçerli bir değer girin');
      setMessageType('error');
      return;
    }

    try {
      setApiLoading(true);
      setMessage('Kupon ekleniyor...');

      const couponData = {
        code: newCoupon.code.trim().toUpperCase(),
        type: newCoupon.type,
        value: parseFloat(newCoupon.value),
        min_amount: newCoupon.min_amount ? parseFloat(newCoupon.min_amount) : null,
        max_uses: newCoupon.max_uses ? parseInt(newCoupon.max_uses) : null,
        expires_at: newCoupon.expires_at || null,
        is_active: newCoupon.is_active,
        used_count: 0
      };

      const supabase = createClientSupabaseClient();
      if (!supabase) {
        setMessage('Supabase client oluşturulamadı');
        setMessageType('error');
        return;
      }

      const { data, error } = await supabase
        .from('coupons')
        .insert([couponData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        setMessage('Kupon eklenemedi: ' + error.message);
        setMessageType('error');
      } else {
        const newCouponItem = data[0];
        setCoupons([newCouponItem, ...coupons]);
        setNewCoupon({
          code: '',
          type: 'percentage',
          value: '',
          min_amount: '',
          max_uses: '',
          expires_at: '',
          is_active: true
        });
        setMessage('Kupon başarıyla eklendi!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Kupon ekleme hatası:', error);
      setMessage('Kupon eklenemedi');
      setMessageType('error');
    } finally {
      setApiLoading(false);
    }
  };

  // Kupon sil
  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('Bu kuponu silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      setApiLoading(true);
      setMessage('Kupon siliniyor...');

      const supabase = createClientSupabaseClient();
      if (!supabase) {
        setMessage('Supabase client oluşturulamadı');
        setMessageType('error');
        return;
      }

      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId);

      if (error) {
        console.error('Supabase error:', error);
        setMessage('Kupon silinemedi: ' + error.message);
        setMessageType('error');
      } else {
        setCoupons(coupons.filter(coupon => coupon.id !== couponId));
        setMessage('Kupon başarıyla silindi!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Kupon silme hatası:', error);
      setMessage('Kupon silinemedi');
      setMessageType('error');
    } finally {
      setApiLoading(false);
    }
  };

  // Stok işlemi yap
  const handleStockOperation = async () => {
    if (!stockOperation.product_id || !stockOperation.quantity || !stockOperation.reason) {
      setMessage('Tüm alanları doldurun');
      setMessageType('error');
      return;
    }

    try {
      setApiLoading(true);
      setMessage('Stok işlemi yapılıyor...');

      const supabase = createClientSupabaseClient();
      if (!supabase) {
        setMessage('Supabase client oluşturulamadı');
        setMessageType('error');
        return;
      }

      // Önce mevcut stok miktarını al
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('stock, title')
        .eq('id', stockOperation.product_id)
        .single();

      if (productError || !product) {
        setMessage('Ürün bulunamadı');
        setMessageType('error');
        return;
      }

      const previousStock = product.stock;
      const quantity = parseInt(stockOperation.quantity);
      let newStock = previousStock;

      // Stok işlemi tipine göre hesapla
      switch (stockOperation.type) {
        case 'in':
          newStock = previousStock + quantity;
          break;
        case 'out':
          if (previousStock < quantity) {
            setMessage('Yetersiz stok');
            setMessageType('error');
            return;
          }
          newStock = previousStock - quantity;
          break;
        case 'adjustment':
          newStock = quantity;
          break;
      }

      // Ürün stokunu güncelle
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          stock: newStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', stockOperation.product_id);

      if (updateError) {
        setMessage('Stok güncellenemedi');
        setMessageType('error');
        return;
      }

      // Stok hareketini kaydet
      const { error: movementError } = await supabase
        .from('stock_movements')
        .insert([{
          product_id: stockOperation.product_id,
          product_title: product.title,
          type: stockOperation.type,
          quantity: quantity,
          previous_stock: previousStock,
          new_stock: newStock,
          reason: stockOperation.reason,
          notes: stockOperation.notes,
          created_by: currentUser?.email || 'admin'
        }]);

      if (movementError) {
        console.error('Stok hareketi kaydedilemedi:', movementError);
      }

      // Local state'leri güncelle
      setProducts(prev => 
        prev.map(p => 
          p.id === stockOperation.product_id 
            ? { ...p, stock: newStock }
            : p
        )
      );

      // Stok hareketlerini yenile
      await fetchStockMovements();

      setStockOperation({
        product_id: '',
        type: 'in',
        quantity: '',
        reason: '',
        notes: ''
      });

      setMessage('Stok işlemi başarıyla tamamlandı!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Stok işlemi hatası:', error);
      setMessage('Stok işlemi yapılamadı');
      setMessageType('error');
    } finally {
      setApiLoading(false);
    }
  };

  // Stok uyarısı ekle
  const handleAddStockAlert = async () => {
    if (!stockAlert.product_id || !stockAlert.threshold) {
      setMessage('Tüm alanları doldurun');
      setMessageType('error');
      return;
    }

    try {
      setApiLoading(true);
      setMessage('Stok uyarısı ekleniyor...');

      const supabase = createClientSupabaseClient();
      if (!supabase) {
        setMessage('Supabase client oluşturulamadı');
        setMessageType('error');
        return;
      }

      const { data: product, error: productError } = await supabase
        .from('products')
        .select('title')
        .eq('id', stockAlert.product_id)
        .single();

      if (productError || !product) {
        setMessage('Ürün bulunamadı');
        setMessageType('error');
        return;
      }

      const { error } = await supabase
        .from('stock_alerts')
        .insert([{
          product_id: stockAlert.product_id,
          product_title: product.title,
          alert_type: stockAlert.alert_type,
          threshold: parseInt(stockAlert.threshold),
          current_stock: 0, // Bu otomatik güncellenecek
          is_active: true
        }]);

      if (error) {
        setMessage('Stok uyarısı eklenemedi');
        setMessageType('error');
        return;
      }

      await fetchStockAlerts();

      setStockAlert({
        product_id: '',
        alert_type: 'low_stock',
        threshold: ''
      });

      setMessage('Stok uyarısı başarıyla eklendi!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Stok uyarısı ekleme hatası:', error);
      setMessage('Stok uyarısı eklenemedi');
      setMessageType('error');
    } finally {
      setApiLoading(false);
    }
  };

  // Analitik state'leri
  const [analyticsPeriod, setAnalyticsPeriod] = useState('7d');
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>({});

  // Analitik verilerini getir
  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await fetch(`/api/analytics?period=${analyticsPeriod}&type=overview`);
      const result = await response.json();

      if (result.success) {
        setAnalyticsData(result.data);
      } else {
        setMessage('Analitik veriler yüklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Analitik veri hatası:', error);
      setMessage('Analitik veriler yüklenemedi');
      setMessageType('error');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Test e-postası gönder
  const handleTestEmail = async () => {
    const testEmail = (document.getElementById('testEmail') as HTMLInputElement)?.value;
    const emailTemplate = (document.getElementById('emailTemplate') as HTMLSelectElement)?.value;

    if (!testEmail || !emailTemplate) {
      setMessage('E-posta adresi ve şablon seçin');
      setMessageType('error');
      return;
    }

    try {
      setApiLoading(true);
      setMessage('Test e-postası gönderiliyor...');

      let testData: any = 'Test Kullanıcı';

      // Şablona göre test verisi oluştur
      switch (emailTemplate) {
        case 'orderConfirmed':
          testData = {
            orderNumber: 'TEST123',
            customerName: 'Test Müşteri',
            totalAmount: 299.99,
            items: [{ title: 'Test Ürün', quantity: 1 }]
          };
          break;
        case 'orderShipped':
          testData = {
            orderNumber: 'TEST123',
            customerName: 'Test Müşteri',
            trackingNumber: 'TRK123456789'
          };
          break;
        case 'orderDelivered':
          testData = {
            orderNumber: 'TEST123',
            customerName: 'Test Müşteri'
          };
          break;
        case 'lowStockAlert':
          testData = {
            productName: 'Test Ürün',
            currentStock: 2,
            threshold: 5
          };
          break;
        case 'newCoupon':
          testData = {
            couponCode: 'TEST2024',
            discountValue: '%20 İndirim',
            expiryDate: '31.12.2024'
          };
          break;
      }

      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: testEmail,
          template: emailTemplate,
          data: testData
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Test e-postası başarıyla gönderildi!');
        setMessageType('success');
        // Form'u temizle
        (document.getElementById('testEmail') as HTMLInputElement).value = '';
      } else {
        setMessage('Test e-postası gönderilemedi: ' + result.error);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Test e-posta hatası:', error);
      setMessage('Test e-postası gönderilemedi');
      setMessageType('error');
    } finally {
      setApiLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // Stok uyarısı sil
  const handleDeleteStockAlert = async (alertId: string) => {
    if (!confirm('Bu stok uyarısını silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      setApiLoading(true);
      setMessage('Stok uyarısı siliniyor...');

      const supabase = createClientSupabaseClient();
      if (!supabase) {
        setMessage('Supabase client oluşturulamadı');
        setMessageType('error');
        return;
      }

      const { error } = await supabase
        .from('stock_alerts')
        .delete()
        .eq('id', alertId);

      if (error) {
        setMessage('Stok uyarısı silinemedi');
        setMessageType('error');
        return;
      }

      setStockAlerts(prev => prev.filter(alert => alert.id !== alertId));
      setMessage('Stok uyarısı başarıyla silindi!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error('Stok uyarısı silme hatası:', error);
      setMessage('Stok uyarısı silinemedi');
      setMessageType('error');
    } finally {
      setApiLoading(false);
    }
  };

  // Kupon durumu güncelle
  const updateCouponStatus = async (couponId: string, isActive: boolean) => {
    try {
      setApiLoading(true);
      setMessage('Kupon durumu güncelleniyor...');

      const supabase = createClientSupabaseClient();
      if (!supabase) {
        setMessage('Supabase client oluşturulamadı');
        setMessageType('error');
        return;
      }

      const { error } = await supabase
        .from('coupons')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', couponId);

      if (error) {
        console.error('Kupon güncelleme hatası:', error);
        setMessage('Kupon güncellenemedi: ' + error.message);
        setMessageType('error');
      } else {
        // Local state'i güncelle
        setCoupons(prev => 
          prev.map(coupon => 
            coupon.id === couponId 
              ? { ...coupon, is_active: isActive, updated_at: new Date().toISOString() }
              : coupon
          )
        );
        setMessage('Kupon durumu başarıyla güncellendi!');
        setMessageType('success');
      }
    } catch (error) {
      console.error('Kupon güncelleme hatası:', error);
      setMessage('Kupon güncellenemedi');
      setMessageType('error');
    } finally {
      setApiLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Sipariş durumu güncelle
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setApiLoading(true);
      setMessage('Sipariş durumu güncelleniyor...');

      const supabase = createClientSupabaseClient();
      if (!supabase) {
        setMessage('Supabase client oluşturulamadı');
        setMessageType('error');
        return;
      }

      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('Sipariş güncelleme hatası:', error);
        setMessage('Sipariş güncellenemedi: ' + error.message);
        setMessageType('error');
      } else {
        // Local state'i güncelle
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
              : order
          )
        );
        setMessage('Sipariş durumu başarıyla güncellendi!');
        setMessageType('success');
      }
    } catch (error) {
      console.error('Sipariş güncelleme hatası:', error);
      setMessage('Sipariş güncellenemedi');
      setMessageType('error');
    } finally {
      setApiLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Session kontrolü ve verileri yükle
  useEffect(() => {
    const checkSessionAndLoadData = async () => {
      try {
        // Mevcut session'ı kontrol et
        const supabase = createClientSupabaseClient();
        if (!supabase) {
          console.error('Supabase client could not be created');
          setCategories(getDefaultCategories());
          setProducts(getDefaultProducts());
          setLoading(false);
          return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (session && !sessionError) {
          console.log('Mevcut session bulundu:', session.user.email);
          setIsAuthenticated(true);
          setCurrentUser(session.user);
        }

        await fetchData();
        setLoading(false);
      } catch (error) {
        console.error('Data loading error:', error);
        setCategories(getDefaultCategories());
        setProducts(getDefaultProducts());
        setLoading(false);
      }
    };

    checkSessionAndLoadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Analitik verilerini yükle
  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated, analyticsPeriod]); // eslint-disable-line react-hooks/exhaustive-deps

  // Giriş yap
  const handleLogin = async () => {
    try {
      setApiLoading(true);
      setMessage('Giriş yapılıyor...');

      // Demo giriş kaldırıldı - sadece admin kullanıcılar giriş yapabilir

      // Supabase authentication ile giriş
      const supabase = createClientSupabaseClient();
      if (!supabase) {
        setMessage('Supabase client oluşturulamadı');
        setMessageType('error');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password
      });

      if (error) {
        console.error('Supabase auth error:', error);
        setMessage('Giriş hatası: ' + error.message);
        setMessageType('error');
        setTimeout(() => setMessage(''), 5000);
        return;
      }

      // Admin kullanıcı kontrolü
      const isAdminUser = await checkAdminUser(data.user.email || '');
      if (!isAdminUser) {
        setMessage('Bu hesap admin paneline erişim yetkisine sahip değil!');
        setMessageType('error');
        // Kullanıcıyı çıkış yap
        await supabase.auth.signOut();
        setTimeout(() => setMessage(''), 5000);
        return;
      }

      setIsAuthenticated(true);
      setIsAdmin(true);
      setCurrentUser(data.user);
      setMessage('Admin paneline başarıyla giriş yapıldı!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setApiLoading(false);
    }
  };

  // Çıkış yap
  const handleLogout = async () => {
    try {
      setApiLoading(true);
      setMessage('Çıkış yapılıyor...');

      // Supabase'den çıkış yap
      const supabase = createClientSupabaseClient();
      if (!supabase) {
        setMessage('Supabase client oluşturulamadı');
        setMessageType('error');
        return;
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error);
        setMessage('Çıkış hatası: ' + error.message);
        setMessageType('error');
      } else {
        setMessage('Başarıyla çıkış yapıldı!');
        setMessageType('success');
      }

      // State'i temizle
      setIsAuthenticated(false);
      setCurrentUser(null);
      setUsername('');
      setPassword('');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Logout error:', error);
      setMessage('Çıkış hatası');
      setMessageType('error');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setApiLoading(false);
    }
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
        icon: newCategory.icon,
        parent_id: newCategory.parent_id,
        level: newCategory.parent_id ? 1 : 0
      };

      const supabase = createClientSupabaseClient();
      if (!supabase) {
        setMessage('Supabase client oluşturulamadı');
        setMessageType('error');
        return;
      }

      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        setMessage('Kategori eklenemedi: ' + error.message);
        setMessageType('error');
      } else {
        const newCategoryItem = data[0];
        setCategories([newCategoryItem, ...categories]);
        setNewCategory({ name: '', color: '#6b7280', icon: 'ri-more-line', parent_id: null });
        setMessage('Kategori başarıyla eklendi!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
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
        slug: newProduct.slug.trim() || newProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        variations: newProduct.variations || []
      };

      const supabase = createClientSupabaseClient();
      if (!supabase) {
        setMessage('Supabase client oluşturulamadı');
        setMessageType('error');
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        setMessage('Ürün eklenemedi: ' + error.message);
        setMessageType('error');
      } else {
        const newProductItem = data[0];
        setProducts([newProductItem, ...products]);
        setNewProduct({ title: '', price: '', category: '', stock: '', image: '', images: [], description: '', slug: '', variations: [] });
        setMessage('Ürün başarıyla eklendi!');
        setMessageType('success');
        
        // Verileri yenile
        setTimeout(() => {
          fetchData();
          setMessage('');
        }, 1000);
      }
    } catch (error) {
      setMessage('Bağlantı hatası');
      setMessageType('error');
    } finally {
      setApiLoading(false);
    }
  };

  // Ürün kopyala
  const handleCopyProduct = async (product: Product) => {
    try {
      setApiLoading(true);
      setMessage('Ürün kopyalanıyor...');

      // Kopya ürün verisi oluştur
      const copiedProductData = {
        title: `${product.title} - Kopya`,
        price: product.price,
        category: product.category,
        stock: product.stock,
        image: product.image,
        images: product.images,
        description: product.description,
        slug: `${product.slug}-kopya-${Date.now()}`,
        variations: product.variations || []
      };

      const supabase = createClientSupabaseClient();
      if (!supabase) {
        setMessage('Supabase client oluşturulamadı');
        setMessageType('error');
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .insert([copiedProductData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        setMessage('Ürün kopyalanamadı: ' + error.message);
        setMessageType('error');
      } else {
        const newCopiedProduct = data[0];
        setProducts([newCopiedProduct, ...products]);
        setMessage('Ürün başarıyla kopyalandı!');
        setMessageType('success');
        
        // Verileri yenile
        setTimeout(() => {
          fetchData();
          setMessage('');
        }, 1000);
      }
    } catch (error) {
      setMessage('Kopyalama hatası');
      setMessageType('error');
    } finally {
      setApiLoading(false);
    }
  };

  // Kategori sil
  const handleDeleteCategory = async (id: string) => {
    try {
      const supabase = createClientSupabaseClient();
      if (!supabase) {
        setMessage('Supabase client oluşturulamadı');
        setMessageType('error');
        return;
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        setMessage('Kategori silinemedi: ' + error.message);
        setMessageType('error');
      } else {
        const updatedCategories = categories.filter(cat => cat.id !== id);
        setCategories(updatedCategories);
        setMessage('Kategori silindi');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Silme hatası');
      setMessageType('error');
    }
  };

  // Görsel yükleme fonksiyonları
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setMessage('Sadece görsel dosyaları yükleyebilirsiniz');
      setMessageType('error');
      return;
    }

    await uploadImages(imageFiles);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await uploadImages(files);
    }
  };

  const uploadImages = async (files: File[]) => {
    try {
      setApiLoading(true);
      setUploadProgress(0);
      setMessage('Görseller yükleniyor...');

      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Dosya boyutu kontrolü (5MB)
        if (file.size > 5 * 1024 * 1024) {
          setMessage(`${file.name} dosyası çok büyük (max 5MB)`);
          setMessageType('error');
          continue;
        }

        // Dosya adını benzersiz yap
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;
        const filePath = `products/${fileName}`;

        try {
          console.log('Görsel yükleniyor:', fileName);

          // Supabase Storage'a yükle
          const supabase = createClientSupabaseClient();
          if (!supabase) {
            setMessage('Supabase client oluşturulamadı');
            setMessageType('error');
            continue;
          }

          const { data, error } = await supabase.storage
            .from('images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) {
            console.error('Upload error:', error);
            
            // RLS hatası ise alternatif yöntem dene
            if (error.message.includes('row-level security') || error.message.includes('policy')) {
              console.log('RLS politikası hatası, alternatif yöntem deneniyor...');
              
              // API route üzerinden yükleme dene
              try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('path', filePath);
                
                const response = await fetch('/api/upload', {
                  method: 'POST',
                  body: formData
                });
                
                if (response.ok) {
                  const result = await response.json();
                  uploadedUrls.push(result.url);
                  setUploadProgress(((i + 1) / files.length) * 100);
                  continue;
                }
              } catch (apiError) {
                console.error('API upload error:', apiError);
              }
              
              setMessage('Storage politikası hatası. Lütfen Supabase Dashboard\'da storage politikalarını kontrol edin.');
              setMessageType('error');
              continue;
            }
            
            setMessage(`Görsel yüklenemedi: ${error.message}`);
            setMessageType('error');
            continue;
          }

          // Public URL al
          const { data: urlData } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

          console.log('Görsel başarıyla yüklendi:', urlData.publicUrl);
          
          // URL'yi test et
          try {
            const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
            if (response.ok) {
              uploadedUrls.push(urlData.publicUrl);
              console.log('Görsel URL doğrulandı:', urlData.publicUrl);
            } else {
              console.error('Görsel URL erişilemez:', urlData.publicUrl);
              setMessage(`Görsel yüklendi ama erişilemez: ${fileName}`);
              setMessageType('error');
            }
          } catch (urlError) {
            console.error('URL test hatası:', urlError);
            uploadedUrls.push(urlData.publicUrl); // Yine de ekle, belki çalışır
          }
          setUploadProgress(((i + 1) / files.length) * 100);

        } catch (uploadError) {
          console.error('Upload process error:', uploadError);
          setMessage(`Görsel yükleme hatası: ${uploadError}`);
          setMessageType('error');
          continue;
        }
      }

      if (uploadedUrls.length > 0) {
        // İlk görseli ana görsel olarak ayarla
        setNewProduct(prev => ({
          ...prev,
          image: uploadedUrls[0],
          images: [...prev.images, ...uploadedUrls]
        }));

        setMessage(`${uploadedUrls.length} görsel başarıyla yüklendi!`);
        setMessageType('success');
        
        // Ürünler listesini yenile
        setTimeout(() => {
          fetchData();
        }, 1000);
      }

    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Görsel yükleme hatası');
      setMessageType('error');
    } finally {
      setApiLoading(false);
      setUploadProgress(0);
    }
  };

  // Ürün sil
  const handleDeleteProduct = async (id: string) => {
    try {
      const supabase = createClientSupabaseClient();
      if (!supabase) {
        setMessage('Supabase client oluşturulamadı');
        setMessageType('error');
        return;
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        setMessage('Ürün silinemedi: ' + error.message);
        setMessageType('error');
      } else {
        const updatedProducts = products.filter(prod => prod.id !== id);
        setProducts(updatedProducts);
        setMessage('Ürün silindi');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Silme hatası');
      setMessageType('error');
    }
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
                  Email veya Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email adresinizi veya kullanıcı adınızı girin"
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
                disabled={apiLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {apiLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
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
                <strong>Giriş Seçenekleri:</strong><br />
                <strong>Demo Hesabı:</strong><br />
                Kullanıcı Adı: <code>admin</code><br />
                Şifre: <code>admin123</code><br /><br />
                <strong>Supabase Hesabı:</strong><br />
                Email: <code>your-email@example.com</code><br />
                Şifre: <code>your-password</code>
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
              <div className="text-right">
                <span className="text-sm text-gray-500">
                  Hoş geldin, {currentUser?.user_metadata?.name || currentUser?.email || 'Admin'}
                </span>
                {currentUser?.email && currentUser.email !== 'admin@demo.com' && (
                  <div className="text-xs text-gray-400">
                    {currentUser.email}
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                disabled={apiLoading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {apiLoading ? 'Çıkış Yapılıyor...' : 'Çıkış Yap'}
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
              { id: 'blogs', name: 'Blog Yönetimi', icon: 'ri-article-line' },
        { id: 'comments', name: 'Yorum Yönetimi', icon: 'ri-chat-3-line' },
              { id: 'orders', name: 'Siparişler', icon: 'ri-shopping-cart-line' },
              { id: 'customers', name: 'Müşteriler', icon: 'ri-user-line' },
              { id: 'coupons', name: 'Kuponlar', icon: 'ri-coupon-line' },
              { id: 'stock', name: 'Stok Takibi', icon: 'ri-store-line' },
              { id: 'email', name: 'E-posta Yönetimi', icon: 'ri-mail-line' },
              { id: 'analytics', name: 'Analitik', icon: 'ri-bar-chart-line' },
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
          <div className="space-y-6">
            {/* İstatistik Kartları */}
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
                    <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
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
                    <p className="text-2xl font-semibold text-gray-900">
                      ₺{orders.reduce((total, order) => total + (order.total_amount || 0), 0).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Müşteri Kartı */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                    <i className="ri-user-line text-2xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                    <p className="text-2xl font-semibold text-gray-900">{customers.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                    <i className="ri-time-line text-2xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Bekleyen Sipariş</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {orders.filter(order => order.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 text-red-600">
                    <i className="ri-truck-line text-2xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Kargoda</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {orders.filter(order => order.status === 'shipped').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                    <i className="ri-check-line text-2xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {orders.filter(order => order.status === 'delivered').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stok İstatistikleri */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <i className="ri-error-warning-line text-2xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Düşük Stok</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {products.filter(p => p.stock <= 5).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 text-red-600">
                    <i className="ri-close-circle-line text-2xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Stok Tükendi</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {products.filter(p => p.stock === 0).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                    <i className="ri-exchange-line text-2xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Stok Hareketi</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stockMovements.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Son Siparişler */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Son Siparişler</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sipariş No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id.slice(-8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.shipping_address?.first_name} {order.shipping_address?.last_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₺{order.total_amount?.toLocaleString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status === 'pending' ? 'Beklemede' :
                             order.status === 'confirmed' ? 'Onaylandı' :
                             order.status === 'shipped' ? 'Kargoda' :
                             order.status === 'delivered' ? 'Teslim Edildi' :
                             'İptal Edildi'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('tr-TR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                        {newProduct.images.map((image, index) => (
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
                                setNewProduct(prev => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== index),
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Varyasyonlar (Opsiyonel)</label>
                  <div className="space-y-4">
                    {/* Manuel Varyasyon Girişi */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Manuel Varyasyon Ekle</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Varyasyon adı (örn: Büyük Boy, Kırmızı)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              const value = input.value.trim();
                              if (value && !newProduct.variations?.includes(value)) {
                                setNewProduct({
                                  ...newProduct,
                                  variations: [...(newProduct.variations || []), value]
                                });
                                input.value = '';
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            const value = input.value.trim();
                            if (value && !newProduct.variations?.includes(value)) {
                              setNewProduct({
                                ...newProduct,
                                variations: [...(newProduct.variations || []), value]
                              });
                              input.value = '';
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Ekle
                        </button>
                      </div>
                    </div>

                    {/* Hızlı Varyasyon Seçimi */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hızlı Seçim</label>
                      <div className="flex flex-wrap gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              const currentVariations = newProduct.variations || [];
                              if (currentVariations.includes(size)) {
                                setNewProduct({
                                  ...newProduct,
                                  variations: currentVariations.filter(v => v !== size)
                                });
                              } else {
                                setNewProduct({
                                  ...newProduct,
                                  variations: [...currentVariations, size]
                                });
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                              (newProduct.variations || []).includes(size)
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['Kırmızı', 'Mavi', 'Yeşil', 'Sarı', 'Siyah', 'Beyaz', 'Gri', 'Pembe'].map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => {
                              const currentVariations = newProduct.variations || [];
                              if (currentVariations.includes(color)) {
                                setNewProduct({
                                  ...newProduct,
                                  variations: currentVariations.filter(v => v !== color)
                                });
                              } else {
                                setNewProduct({
                                  ...newProduct,
                                  variations: [...currentVariations, color]
                                });
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                              (newProduct.variations || []).includes(color)
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Seçilen Varyasyonlar */}
                    {newProduct.variations && newProduct.variations.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Seçilen Varyasyonlar</label>
                        <div className="flex flex-wrap gap-2">
                          {newProduct.variations.map((variation, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              <span>{variation}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setNewProduct({
                                    ...newProduct,
                                    variations: newProduct.variations?.filter((_, i) => i !== index)
                                  });
                                }}
                                className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Varyasyonlar</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <Image className="h-10 w-10 rounded-full object-cover" src={product.image} alt={product.title} width={40} height={40} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₺{product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.variations && product.variations.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {product.variations.slice(0, 3).map((variation, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {variation}
                                </span>
                              ))}
                              {product.variations.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{product.variations.length - 3}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">Yok</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleCopyProduct(product)}
                              disabled={apiLoading}
                              className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Ürünü kopyala"
                            >
                              <i className="ri-file-copy-line"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Ürünü sil"
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

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Kategori Ekle</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ana Kategori</label>
                  <select
                    value={newCategory.parent_id || ''}
                    onChange={(e) => setNewCategory({ ...newCategory, parent_id: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Ana Kategori (Seviye 0)</option>
                    {categories.filter(cat => !cat.parent_id || cat.level === 0).map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
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

        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Blog Yönetimi</h2>
                <a
                  href="/admin/blogs"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Blog Yönetimi Sayfasına Git
                </a>
              </div>
              <p className="text-gray-600">
                Blog yazılarını yönetmek, kullanıcı blog&apos;larını onaylamak ve yeni blog oluşturmak için 
                blog yönetimi sayfasını kullanın.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Yorum Yönetimi</h2>
                <a
                  href="/admin/comments"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Yorum Yönetimi Sayfasına Git
                </a>
              </div>
              <p className="text-gray-600">
                Kullanıcı yorumlarını onaylamak, reddetmek, spam olarak işaretlemek ve moderasyon yapmak için 
                yorum yönetimi sayfasını kullanın.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Müşteriler ({customers.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Henüz müşteri bulunmuyor
                        </td>
                      </tr>
                    ) : (
                      customers.map((customer) => (
                        <tr key={customer.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {customer.user_metadata?.first_name || customer.user_metadata?.name || 'İsimsiz'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {customer.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(customer.created_at).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              customer.email_confirmed_at 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {customer.email_confirmed_at ? 'Onaylı' : 'Onay Bekliyor'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                // Müşteri detaylarını göster
                                alert(`Müşteri Detayları:\n\nAd: ${customer.user_metadata?.first_name || customer.user_metadata?.name || 'İsimsiz'}\nE-posta: ${customer.email}\nKayıt Tarihi: ${new Date(customer.created_at).toLocaleDateString('tr-TR')}\nDurum: ${customer.email_confirmed_at ? 'Onaylı' : 'Onay Bekliyor'}`);
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Detay
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="space-y-6">
            {/* Yeni Kupon Ekleme */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Kupon Ekle</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kupon Kodu *</label>
                  <input
                    type="text"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Örn: YILBASI2024"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kupon Tipi *</label>
                  <select
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Yüzde (%)</option>
                    <option value="fixed">Sabit Tutar (₺)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Değer *</label>
                  <input
                    type="number"
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={newCoupon.type === 'percentage' ? '20' : '50'}
                    min="0"
                    step={newCoupon.type === 'percentage' ? '1' : '0.01'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Tutar (₺)</label>
                  <input
                    type="number"
                    value={newCoupon.min_amount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, min_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Kullanım</label>
                  <input
                    type="number"
                    value={newCoupon.max_uses}
                    onChange={(e) => setNewCoupon({ ...newCoupon, max_uses: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Son Kullanım Tarihi</label>
                  <input
                    type="datetime-local"
                    value={newCoupon.expires_at}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expires_at: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2 lg:col-span-3">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newCoupon.is_active}
                        onChange={(e) => setNewCoupon({ ...newCoupon, is_active: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Aktif</span>
                    </label>
                  </div>
                </div>
                
                <div className="md:col-span-2 lg:col-span-3">
                  <button
                    onClick={handleAddCoupon}
                    disabled={apiLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {apiLoading ? 'Ekleniyor...' : 'Kupon Ekle'}
                  </button>
                </div>
              </div>
            </div>

            {/* Mevcut Kuponlar */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Mevcut Kuponlar ({coupons.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kod</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Değer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanım</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Tarih</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coupons.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          Henüz kupon bulunmuyor
                        </td>
                      </tr>
                    ) : (
                      coupons.map((coupon) => (
                        <tr key={coupon.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">{coupon.code}</code>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              coupon.type === 'percentage' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {coupon.type === 'percentage' ? `${coupon.value}%` : `₺${coupon.value}`}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {coupon.type === 'percentage' ? `${coupon.value}%` : `₺${coupon.value.toLocaleString('tr-TR')}`}
                            {coupon.min_amount && (
                              <div className="text-xs text-gray-500">
                                Min: ₺{coupon.min_amount.toLocaleString('tr-TR')}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {coupon.used_count}
                            {coupon.max_uses && (
                              <span className="text-gray-500"> / {coupon.max_uses}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={coupon.is_active}
                                onChange={(e) => updateCouponStatus(coupon.id, e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                {coupon.is_active ? 'Aktif' : 'Pasif'}
                              </span>
                            </label>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {coupon.expires_at 
                              ? new Date(coupon.expires_at).toLocaleDateString('tr-TR')
                              : 'Süresiz'
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Siparişler ({orders.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sipariş No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Henüz sipariş bulunmuyor
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id.slice(-8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.shipping_address?.first_name} {order.shipping_address?.last_name}
                            <br />
                            <span className="text-gray-500">{order.shipping_address?.email}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₺{order.total_amount?.toLocaleString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="pending">Beklemede</option>
                              <option value="confirmed">Onaylandı</option>
                              <option value="shipped">Kargoda</option>
                              <option value="delivered">Teslim Edildi</option>
                              <option value="cancelled">İptal Edildi</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                // Sipariş detaylarını göster
                                alert(`Sipariş Detayları:\n\nSipariş No: #${order.id.slice(-8)}\nMüşteri: ${order.shipping_address?.first_name} ${order.shipping_address?.last_name}\nTutar: ₺${order.total_amount?.toLocaleString('tr-TR')}\nDurum: ${order.status}\nTarih: ${new Date(order.created_at).toLocaleDateString('tr-TR')}`);
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Detay
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Periyot Seçimi */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Analitik Dashboard</h2>
                <div className="flex space-x-2">
                  <select
                    value={analyticsPeriod}
                    onChange={(e) => setAnalyticsPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7d">Son 7 Gün</option>
                    <option value="30d">Son 30 Gün</option>
                    <option value="90d">Son 90 Gün</option>
                    <option value="1y">Son 1 Yıl</option>
                  </select>
                  <button
                    onClick={fetchAnalytics}
                    disabled={analyticsLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {analyticsLoading ? 'Yükleniyor...' : 'Yenile'}
                  </button>
                </div>
              </div>

              {/* İstatistik Kartları */}
              {analyticsData.overview && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <StatCard
                    title="Toplam Sipariş"
                    value={analyticsData.overview.totalOrders}
                    icon="ri-shopping-cart-line"
                    color="bg-blue-500"
                  />
                  <StatCard
                    title="Toplam Gelir"
                    value={`₺${analyticsData.overview.totalRevenue.toLocaleString('tr-TR')}`}
                    icon="ri-money-dollar-circle-line"
                    color="bg-green-500"
                  />
                  <StatCard
                    title="Toplam Müşteri"
                    value={analyticsData.overview.totalCustomers}
                    icon="ri-user-line"
                    color="bg-purple-500"
                  />
                  <StatCard
                    title="Ortalama Sipariş"
                    value={`₺${analyticsData.overview.averageOrderValue.toLocaleString('tr-TR')}`}
                    icon="ri-calculator-line"
                    color="bg-orange-500"
                  />
                </div>
              )}

              {/* Grafikler */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analyticsData.dailyOrders && (
                  <DailyOrdersChart
                    data={analyticsData.dailyOrders}
                    title="Günlük Sipariş Trendi"
                  />
                )}
                {analyticsData.dailySales && (
                  <DailySalesChart
                    data={analyticsData.dailySales}
                    title="Günlük Satış Trendi"
                  />
                )}
              </div>

              {/* En Çok Satan Ürünler */}
              {analyticsData.topProducts && (
                <AnalyticsTable
                  title="En Çok Satan Ürünler"
                  data={analyticsData.topProducts}
                  columns={[
                    { key: 'title', label: 'Ürün Adı' },
                    { key: 'quantity', label: 'Satış Adedi' },
                    { 
                      key: 'revenue', 
                      label: 'Toplam Gelir',
                      render: (value) => `₺${value.toLocaleString('tr-TR')}`
                    }
                  ]}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-6">
            {/* E-posta Test */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">E-posta Test</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test E-posta Adresi</label>
                  <input
                    type="email"
                    id="testEmail"
                    placeholder="test@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Şablonu</label>
                  <select
                    id="emailTemplate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="welcome">Hoş Geldin E-postası</option>
                    <option value="orderConfirmed">Sipariş Onayı</option>
                    <option value="orderShipped">Kargoya Verildi</option>
                    <option value="orderDelivered">Teslim Edildi</option>
                    <option value="lowStockAlert">Düşük Stok Uyarısı</option>
                    <option value="newCoupon">Yeni Kupon</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <button
                    onClick={handleTestEmail}
                    disabled={apiLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {apiLoading ? 'Gönderiliyor...' : 'Test E-postası Gönder'}
                  </button>
                </div>
              </div>
            </div>

            {/* E-posta İstatistikleri */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">E-posta İstatistikleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-mail-send-line text-2xl text-blue-600 mr-3"></i>
                    <div>
                      <p className="text-sm text-gray-600">Toplam Gönderilen</p>
                      <p className="text-xl font-semibold text-gray-900">0</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-check-line text-2xl text-green-600 mr-3"></i>
                    <div>
                      <p className="text-sm text-gray-600">Başarılı</p>
                      <p className="text-xl font-semibold text-gray-900">0</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <i className="ri-close-line text-2xl text-red-600 mr-3"></i>
                    <div>
                      <p className="text-sm text-gray-600">Başarısız</p>
                      <p className="text-xl font-semibold text-gray-900">0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* E-posta Şablonları */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">E-posta Şablonları</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Hoş Geldin E-postası</h3>
                  <p className="text-sm text-gray-600 mb-2">Yeni kayıt olan müşterilere gönderilir</p>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Önizle</button>
                    <button className="text-green-600 hover:text-green-800 text-sm">Düzenle</button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Sipariş Onayı</h3>
                  <p className="text-sm text-gray-600 mb-2">Sipariş onaylandığında gönderilir</p>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Önizle</button>
                    <button className="text-green-600 hover:text-green-800 text-sm">Düzenle</button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Kargoya Verildi</h3>
                  <p className="text-sm text-gray-600 mb-2">Sipariş kargoya verildiğinde gönderilir</p>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Önizle</button>
                    <button className="text-green-600 hover:text-green-800 text-sm">Düzenle</button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Teslim Edildi</h3>
                  <p className="text-sm text-gray-600 mb-2">Sipariş teslim edildiğinde gönderilir</p>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Önizle</button>
                    <button className="text-green-600 hover:text-green-800 text-sm">Düzenle</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="space-y-6">
            {/* Stok İşlemleri */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Stok İşlemleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ürün *</label>
                  <select
                    value={stockOperation.product_id}
                    onChange={(e) => setStockOperation({ ...stockOperation, product_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Ürün seçin</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.title} (Stok: {product.stock})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İşlem Tipi *</label>
                  <select
                    value={stockOperation.type}
                    onChange={(e) => setStockOperation({ ...stockOperation, type: e.target.value as 'in' | 'out' | 'adjustment' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="in">Stok Girişi</option>
                    <option value="out">Stok Çıkışı</option>
                    <option value="adjustment">Stok Düzeltme</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Miktar *</label>
                  <input
                    type="number"
                    value={stockOperation.quantity}
                    onChange={(e) => setStockOperation({ ...stockOperation, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sebep *</label>
                  <select
                    value={stockOperation.reason}
                    onChange={(e) => setStockOperation({ ...stockOperation, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sebep seçin</option>
                    <option value="purchase">Satın Alma</option>
                    <option value="sale">Satış</option>
                    <option value="return">İade</option>
                    <option value="damage">Hasar</option>
                    <option value="adjustment">Düzeltme</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notlar</label>
                  <input
                    type="text"
                    value={stockOperation.notes}
                    onChange={(e) => setStockOperation({ ...stockOperation, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ek notlar..."
                  />
                </div>
                
                <div className="md:col-span-3">
                  <button
                    onClick={handleStockOperation}
                    disabled={apiLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {apiLoading ? 'İşleniyor...' : 'Stok İşlemi Yap'}
                  </button>
                </div>
              </div>
            </div>

            {/* Stok Uyarıları */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Stok Uyarıları</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ürün</label>
                  <select
                    value={stockAlert.product_id}
                    onChange={(e) => setStockAlert({ ...stockAlert, product_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Ürün seçin</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Uyarı Tipi</label>
                  <select
                    value={stockAlert.alert_type}
                    onChange={(e) => setStockAlert({ ...stockAlert, alert_type: e.target.value as 'low_stock' | 'out_of_stock' | 'overstock' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low_stock">Düşük Stok</option>
                    <option value="out_of_stock">Stok Tükendi</option>
                    <option value="overstock">Aşırı Stok</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Eşik Değeri</label>
                  <input
                    type="number"
                    value={stockAlert.threshold}
                    onChange={(e) => setStockAlert({ ...stockAlert, threshold: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div className="md:col-span-3">
                  <button
                    onClick={handleAddStockAlert}
                    disabled={apiLoading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {apiLoading ? 'Ekleniyor...' : 'Uyarı Ekle'}
                  </button>
                </div>
              </div>
            </div>

            {/* Stok Hareketleri */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Son Stok Hareketleri</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miktar</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Önceki Stok</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yeni Stok</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sebep</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockMovements.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          Henüz stok hareketi bulunmuyor
                        </td>
                      </tr>
                    ) : (
                      stockMovements.map((movement) => (
                        <tr key={movement.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {movement.product_title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              movement.type === 'in' 
                                ? 'bg-green-100 text-green-800' 
                                : movement.type === 'out'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {movement.type === 'in' ? 'Giriş' : movement.type === 'out' ? 'Çıkış' : 'Düzeltme'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {movement.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {movement.previous_stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {movement.new_stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {movement.reason}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(movement.created_at).toLocaleDateString('tr-TR')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
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