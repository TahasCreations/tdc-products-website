'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  StarIcon,
  TagIcon,
  TruckIcon,
  CreditCardIcon,
  GlobeAltIcon,
  CogIcon,
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  title: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  image: string;
  description?: string;
  slug?: string;
  sales?: number;
  rating?: number;
  createdAt: string;
  created_at?: string;
}

interface Order {
  id: string;
  order_number?: string;
  customer: string;
  customer_name?: string;
  customer_email?: string;
  total: number;
  total_amount?: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status?: string;
  items: number;
  createdAt: string;
  created_at?: string;
  paymentMethod: string;
  payment_method?: string;
}

interface EcommerceStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  conversionRate: number;
  averageOrderValue: number;
  monthlyGrowth: number;
  topSellingCategory: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'bank_transfer' | 'digital_wallet' | 'cash_on_delivery';
  isActive: boolean;
  fee: number;
  transactions: number;
}

export default function EcommercePage() {
  const [stats, setStats] = useState<EcommerceStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    subcategory: '',
    stock: '',
    description: '',
    image: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitMessageType, setSubmitMessageType] = useState<'success' | 'error' | ''>('');
  
  // Yeni gelişmiş özellikler
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [advancedFeatures, setAdvancedFeatures] = useState({
    inventoryManagement: false,
    priceOptimization: false,
    customerSegmentation: false,
    automatedMarketing: false,
    advancedAnalytics: false,
    multiVendorSupport: false,
    subscriptionManagement: false,
    loyaltyProgram: false,
    giftCards: false,
    bulkOperations: false,
    apiIntegration: false,
    mobileApp: false
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    pageLoadTime: 0,
    conversionRate: 0,
    bounceRate: 0,
    cartAbandonment: 0,
    customerSatisfaction: 0
  });
  
  // Category management states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    parentId: null,
    description: '',
    image: '',
    sortOrder: 0
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState(null);

  useEffect(() => {
    const fetchEcommerceData = async () => {
      try {
        // Paralel olarak tüm verileri çek
        const [statsResponse, productsResponse, ordersResponse, paymentMethodsResponse] = await Promise.all([
          fetch('/api/ecommerce?type=stats'),
          fetch('/api/ecommerce?type=products'),
          fetch('/api/ecommerce?type=orders'),
          fetch('/api/ecommerce?type=payment_methods')
        ]);

        const [statsData, productsData, ordersData, paymentMethodsData] = await Promise.all([
          statsResponse.json(),
          productsResponse.json(),
          ordersResponse.json(),
          paymentMethodsResponse.json()
        ]);

        if (statsData.success) {
          setStats(statsData.stats);
        } else {
          // No data available
          setStats({
            totalRevenue: 0,
            totalOrders: 0,
            totalProducts: 0,
            totalCustomers: 0,
            conversionRate: 0,
            averageOrderValue: 0,
            monthlyGrowth: 0,
            topSellingCategory: 'Henüz kategori yok'
          });
        }

        if (productsData.success) {
          setProducts(productsData.products || []);
        } else {
          setProducts([]);
        }

        if (ordersData.success) {
          setOrders(ordersData.orders || []);
        } else {
          setOrders([]);
        }

        if (paymentMethodsData.success) {
          setPaymentMethods(paymentMethodsData.methods || []);
        } else {
          // No data available
          setPaymentMethods([
            {
              id: '1',
              name: 'Kredi Kartı',
              type: 'credit_card',
              isActive: true,
              fee: 2.5,
              transactions: 0
            },
            {
              id: '2',
              name: 'Banka Havalesi',
              type: 'bank_transfer',
              isActive: true,
              fee: 0,
              transactions: 0
            },
            {
              id: '3',
              name: 'Kapıda Ödeme',
              type: 'cash_on_delivery',
              isActive: false,
              fee: 5,
              transactions: 0
            }
          ]);
        }

      } catch (error) {
        // Hata durumunda boş data kullan
        setStats({
          totalRevenue: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalCustomers: 0,
          conversionRate: 0,
          averageOrderValue: 0,
          monthlyGrowth: 0,
          topSellingCategory: 'Henüz kategori yok'
        });
        setProducts([]);
        setOrders([]);
        setPaymentMethods([
          {
            id: '1',
            name: 'Kredi Kartı',
            type: 'credit_card',
            isActive: true,
            fee: 2.5,
            transactions: 0
          },
          {
            id: '2',
            name: 'Banka Havalesi',
            type: 'bank_transfer',
            isActive: true,
            fee: 0,
            transactions: 0
          },
          {
            id: '3',
            name: 'Kapıda Ödeme',
            type: 'cash_on_delivery',
            isActive: false,
            fee: 5,
            transactions: 0
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEcommerceData();
    fetchCategories();
  }, []);

  // Fetch integration status
  const fetchIntegrationStatus = async () => {
    try {
      const response = await fetch('/api/integrations/status');
      const data = await response.json();
      
      if (data.success) {
        // Update integration status in UI
        console.log('Integration status updated:', data.data);
        // You can add state management for integration status here
      }
    } catch (error) {
      console.error('Error fetching integration status:', error);
    }
  };

  // Category management functions
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async (parentId) => {
    try {
      const response = await fetch(`/api/categories?parentId=${parentId}`);
      const data = await response.json();
      if (data.success) {
        setSubcategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitMessageType('');

    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const response = await fetch('/api/categories', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...categoryForm,
          id: editingCategory?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage(editingCategory ? 'Kategori güncellendi!' : 'Kategori oluşturuldu!');
        setSubmitMessageType('success');
        setShowCategoryModal(false);
        setCategoryForm({ name: '', slug: '', parentId: null, description: '', image: '', sortOrder: 0 });
        setEditingCategory(null);
        fetchCategories();
      } else {
        setSubmitMessage(data.message || 'Bir hata oluştu');
        setSubmitMessageType('error');
      }
    } catch (error) {
      setSubmitMessage('Bir hata oluştu');
      setSubmitMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      parentId: category.parentId,
      description: category.description,
      image: category.image,
      sortOrder: category.sortOrder
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/categories?id=${categoryId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          setSubmitMessage('Kategori silindi!');
          setSubmitMessageType('success');
          fetchCategories();
        } else {
          setSubmitMessage(data.message || 'Bir hata oluştu');
          setSubmitMessageType('error');
        }
      } catch (error) {
        setSubmitMessage('Bir hata oluştu');
        setSubmitMessageType('error');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: 'Aktif',
      inactive: 'Pasif',
      draft: 'Taslak',
      pending: 'Bekliyor',
      processing: 'İşleniyor',
      shipped: 'Kargoda',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getPaymentTypeText = (type: string) => {
    const texts = {
      credit_card: 'Kredi Kartı',
      bank_transfer: 'Banka Havalesi',
      digital_wallet: 'Dijital Cüzdan',
      cash_on_delivery: 'Kapıda Ödeme'
    };
    return texts[type as keyof typeof texts] || type;
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validasyonu
    if (!productForm.name || !productForm.price || !productForm.category) {
      setSubmitMessage('Lütfen tüm zorunlu alanları doldurun.');
      setSubmitMessageType('error');
      return;
    }

    if (parseFloat(productForm.price) <= 0) {
      setSubmitMessage('Fiyat 0\'dan büyük olmalıdır.');
      setSubmitMessageType('error');
      return;
    }

    if (parseInt(productForm.stock) < 0) {
      setSubmitMessage('Stok miktarı negatif olamaz.');
      setSubmitMessageType('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitMessageType('');
    
    try {
      const productData = {
        title: productForm.name,
        price: parseFloat(productForm.price),
        category: productForm.category,
        stock: parseInt(productForm.stock),
        description: productForm.description,
        image: productForm.image,
        slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        status: 'active'
      };

      const response = await fetch('/api/ecommerce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: editingProduct ? 'update_product' : 'create_product',
          id: editingProduct?.id,
          ...productData
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Başarılı - formu sıfırla ve modalı kapat
        setProductForm({
          name: '',
          price: '',
          category: '',
          subcategory: '',
          stock: '',
          description: '',
          image: ''
        });
        setShowProductModal(false);
        setEditingProduct(null);
        setSubmitMessage(editingProduct ? 'Ürün başarıyla güncellendi!' : 'Ürün başarıyla eklendi!');
        setSubmitMessageType('success');
        
        // Ürünleri yeniden yükle
        const productsResponse = await fetch('/api/ecommerce?type=products');
        const productsData = await productsResponse.json();
        if (productsData.success) {
          setProducts(productsData.products || []);
        }
      } else {
        setSubmitMessage('Hata: ' + (result.error || 'Bilinmeyen hata'));
        setSubmitMessageType('error');
      }
    } catch (error) {
      setSubmitMessage('Ürün kaydedilirken bir hata oluştu');
      setSubmitMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.title || product.name,
      price: product.price.toString(),
      category: product.category,
      subcategory: '',
      stock: product.stock.toString(),
      description: product.description || '',
      image: product.image
    });
    setSubmitMessage('');
    setSubmitMessageType('');
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch('/api/ecommerce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete_product',
          id: productId
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Ürünleri yeniden yükle
        const productsResponse = await fetch('/api/ecommerce?type=products');
        const productsData = await productsResponse.json();
        if (productsData.success) {
          setProducts(productsData.products || []);
        }
      } else {
        alert('Hata: ' + result.error);
      }
    } catch (error) {
      alert('Ürün silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">E-Ticaret Modülü</h1>
              <p className="text-gray-600 mt-1">İkas tarzı profesyonel e-ticaret yönetimi</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <CogIcon className="w-4 h-4 mr-2 inline" />
                Ayarlar
              </button>
              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    price: '',
                    category: '',
                    subcategory: '',
                    stock: '',
                    description: '',
                    image: ''
                  });
                  setSubmitMessage('');
                  setSubmitMessageType('');
                  setShowProductModal(true);
                }}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2 inline" />
                Yeni Ürün
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            {[
              { id: 'overview', label: 'Genel Bakış' },
              { id: 'products', label: 'Ürünler' },
              { id: 'orders', label: 'Siparişler' },
              { id: 'customers', label: 'Müşteriler' },
              { id: 'payments', label: 'Ödemeler' },
              { id: 'analytics', label: 'Analizler' },
              { id: 'inventory', label: 'Stok Yönetimi' },
              { id: 'marketing', label: 'Pazarlama' },
              { id: 'loyalty', label: 'Sadakat Programı' },
              { id: 'subscriptions', label: 'Abonelikler' },
              { id: 'giftcards', label: 'Hediye Kartları' },
              { id: 'bulk', label: 'Toplu İşlemler' },
              { id: 'integrations', label: 'Entegrasyonlar' },
              { id: 'mobile', label: 'Mobil Uygulama' },
              { id: 'categories', label: 'Kategori Yönetimi' },
              { id: 'advanced', label: 'Gelişmiş Özellikler' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  selectedTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        {selectedTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
                    <p className="text-sm text-gray-500">Bu ay</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                    <p className="text-sm text-gray-500">Bu ay</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
                    <p className="text-sm text-gray-500">Katalogda</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TagIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Müşteriler</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalCustomers || 0}</p>
                    <p className="text-sm text-gray-500">Kayıtlı</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <UsersIcon className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Link href="/admin/products" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <PlusIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Ürün Ekle</h3>
                    <p className="text-sm text-gray-600">Yeni ürün ekle ve katalogunu genişlet</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/orders" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <ShoppingCartIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sipariş Yönetimi</h3>
                    <p className="text-sm text-gray-600">Siparişleri takip et ve yönet</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/customers" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <UsersIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Müşteri Yönetimi</h3>
                    <p className="text-sm text-gray-600">Müşteri bilgilerini yönet</p>
                  </div>
                </div>
              </Link>
            </div>
          </>
        )}

        {/* Products Tab */}
        {selectedTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Ürünler</h3>
                <button 
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      name: '',
                      price: '',
                      category: '',
                      subcategory: '',
                      stock: '',
                      description: '',
                      image: ''
                    });
                    setSubmitMessage('');
                    setSubmitMessageType('');
                    setShowProductModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2 inline" />
                  Yeni Ürün
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <TagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz ürün yok</h3>
                  <p className="text-gray-600 mb-6">İlk ürününüzü eklemek için aşağıdaki butona tıklayın</p>
                  <button 
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: '',
                        price: '',
                        category: '',
                        subcategory: '',
                        stock: '',
                        description: '',
                        image: ''
                      });
                      setSubmitMessage('');
                      setSubmitMessageType('');
                      setShowProductModal(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5 mr-2 inline" />
                    İlk Ürünü Ekle
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <Image
                        src={product.image}
                        alt={product.title || product.name}
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h4 className="font-semibold text-gray-900 mb-2">{product.title || product.name}</h4>
                      <p className="text-lg font-bold text-blue-600 mb-2">{formatCurrency(product.price)}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {getStatusText(product.status)}
                        </span>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {selectedTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Siparişler</h3>
                <div className="flex space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Tüm Durumlar</option>
                    <option value="pending">Bekliyor</option>
                    <option value="processing">İşleniyor</option>
                    <option value="shipped">Kargoda</option>
                    <option value="delivered">Teslim Edildi</option>
                    <option value="cancelled">İptal Edildi</option>
                  </select>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <PlusIcon className="w-4 h-4 mr-2 inline" />
                    Yeni Sipariş
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz sipariş yok</h3>
                  <p className="text-gray-600 mb-6">Müşteriler sipariş vermeye başladığında burada görünecek</p>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">Henüz sipariş bulunmuyor.</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sipariş No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Müşteri
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tutar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ödeme
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.order_number || order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="font-medium">{order.customer_name || order.customer}</div>
                              <div className="text-gray-500">{order.customer_email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(order.total_amount || order.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.payment_status || 'pending')}`}>
                              {getStatusText(order.payment_status || 'pending')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(order.created_at || order.createdAt).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => {
                                  // Sipariş detayını göster
                                  alert(`Sipariş Detayı:\nSipariş No: ${order.order_number || order.id}\nMüşteri: ${order.customer_name || order.customer}\nTutar: ${formatCurrency(order.total_amount || order.total)}\nDurum: ${getStatusText(order.status)}`);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                                title="Detayları Görüntüle"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  // Sipariş durumunu güncelle
                                  const newStatus = prompt('Yeni durum seçin:', order.status);
                                  if (newStatus && newStatus !== order.status) {
                                    // API'ye durum güncelleme isteği gönder
                                  }
                                }}
                                className="text-gray-600 hover:text-gray-900"
                                title="Durumu Güncelle"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {selectedTab === 'customers' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Müşteriler</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Müşteri ara..."
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button 
                    onClick={() => window.location.href = '/admin/orders'}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mr-2"
                  >
                    Sipariş Yönetimi
                  </button>
                  <button 
                    onClick={() => window.location.href = '/admin/customers'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4 mr-2 inline" />
                    Müşteri Yönetimi
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-center py-12">
                <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Müşteri Yönetimi</h3>
                <p className="text-gray-600 mb-6">Müşteri bilgileri ve sipariş geçmişi burada görünecek</p>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">Özellikler:</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Müşteri profilleri ve iletişim bilgileri</li>
                    <li>• Sipariş geçmişi ve istatistikler</li>
                    <li>• Müşteri segmentasyonu</li>
                    <li>• E-posta ve SMS kampanyaları</li>
                    <li>• Müşteri geri bildirimleri</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {selectedTab === 'payments' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Ödeme Yöntemleri</h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <CreditCardIcon className="w-8 h-8 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900">{method.name}</h4>
                          <p className="text-sm text-gray-600">{getPaymentTypeText(method.type)}</p>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${method.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Komisyon:</span>
                        <span className="font-medium">{method.fee}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">İşlem Sayısı:</span>
                        <span className="font-medium">{method.transactions}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                        Düzenle
                      </button>
                      <button className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                        method.isActive 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}>
                        {method.isActive ? 'Pasifleştir' : 'Aktifleştir'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && (
          <div className="space-y-6">
            {/* Sales Chart */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Satış Analizi</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Satış grafikleri burada görünecek</p>
                  <p className="text-sm text-gray-500 mt-2">Günlük, haftalık ve aylık satış trendleri</p>
                </div>
              </div>
            </div>

            {/* Product Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Satan Ürünler</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Naruto Figürü</p>
                      <p className="text-sm text-gray-600">Anime Kategorisi</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">15 adet</p>
                      <p className="text-sm text-gray-500">₺4,485</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">One Piece Figürü</p>
                      <p className="text-sm text-gray-600">Anime Kategorisi</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">12 adet</p>
                      <p className="text-sm text-gray-500">₺3,588</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Dağılımı</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Anime</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">60%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Oyun</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '25%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">25%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Film</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: '15%'}}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Bu Ay</p>
                    <p className="text-2xl font-bold text-gray-900">₺0</p>
                    <p className="text-sm text-green-600">+0% önceki aya göre</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ortalama Sipariş</p>
                    <p className="text-2xl font-bold text-gray-900">₺0</p>
                    <p className="text-sm text-blue-600">+0% önceki aya göre</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Dönüşüm Oranı</p>
                    <p className="text-2xl font-bold text-gray-900">0%</p>
                    <p className="text-sm text-purple-600">+0% önceki aya göre</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <ChartBarIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Management Tab */}
        {selectedTab === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Stok Yönetimi</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Stok Güncelle
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-8 h-8 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm text-red-600">Düşük Stok</p>
                      <p className="text-2xl font-bold text-red-700">12 ürün</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <ClockIcon className="w-8 h-8 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm text-yellow-600">Yakında Tükenecek</p>
                      <p className="text-2xl font-bold text-yellow-700">8 ürün</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-green-600">Yeterli Stok</p>
                      <p className="text-2xl font-bold text-green-700">45 ürün</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mevcut Stok</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Minimum Stok</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Naruto Figürü</p>
                            <p className="text-sm text-gray-500">Anime</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">10</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Düşük Stok</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Stok Ekle</button>
                        <button className="text-gray-600 hover:text-gray-900">Detay</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Marketing Tab */}
        {selectedTab === 'marketing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">E-posta Kampanyaları</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Yeni Ürün Duyurusu</p>
                      <p className="text-sm text-blue-700">1,250 gönderildi</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">%12.5</p>
                      <p className="text-xs text-blue-500">Açılma Oranı</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">İndirim Kampanyası</p>
                      <p className="text-sm text-green-700">2,100 gönderildi</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">%18.3</p>
                      <p className="text-xs text-green-500">Açılma Oranı</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Yeni Kampanya Oluştur
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sosyal Medya</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Instagram Takipçi</span>
                    <span className="text-sm font-bold text-pink-600">12.5K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Facebook Beğeni</span>
                    <span className="text-sm font-bold text-blue-600">8.2K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Twitter Takipçi</span>
                    <span className="text-sm font-bold text-blue-400">3.1K</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
                  Sosyal Medya Yönetimi
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Analizi</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Organik Trafik</span>
                    <span className="text-sm font-bold text-green-600">+24%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Anahtar Kelime</span>
                    <span className="text-sm font-bold text-blue-600">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Backlink</span>
                    <span className="text-sm font-bold text-purple-600">89</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  SEO Raporu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loyalty Program Tab */}
        {selectedTab === 'loyalty' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Sadakat Programı</h3>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Program Ayarları
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <StarIcon className="w-8 h-8 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm text-purple-600">Aktif Üyeler</p>
                      <p className="text-2xl font-bold text-purple-700">1,247</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <TagIcon className="w-8 h-8 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm text-yellow-600">Kullanılan Puan</p>
                      <p className="text-2xl font-bold text-yellow-700">45,230</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-green-600">Kazanılan Puan</p>
                      <p className="text-2xl font-bold text-green-700">78,450</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Puan Sistemi</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Her ₺1 harcama</span>
                      <span className="text-sm font-bold text-blue-600">1 puan</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">100 puan</span>
                      <span className="text-sm font-bold text-green-600">₺5 indirim</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Referans</span>
                      <span className="text-sm font-bold text-purple-600">50 puan</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Seviye Sistemi</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm text-gray-600">Bronze (0-999 puan)</span>
                      <span className="text-sm font-bold text-yellow-600">%5 indirim</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Silver (1000-4999 puan)</span>
                      <span className="text-sm font-bold text-gray-600">%10 indirim</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-100 rounded-lg">
                      <span className="text-sm text-gray-600">Gold (5000+ puan)</span>
                      <span className="text-sm font-bold text-yellow-500">%15 indirim</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {selectedTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Abonelik Yönetimi</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => window.open('/subscriptions?type=seller', '_blank')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Satıcı Planları
                  </button>
                  <button 
                    onClick={() => window.open('/subscriptions?type=buyer', '_blank')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Alıcı Planları
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">A</span>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Aktif Abonelikler</p>
                      <p className="text-2xl font-bold text-blue-700">1,247</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">₺</span>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Aylık Gelir</p>
                      <p className="text-2xl font-bold text-green-700">₺45,230</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">%</span>
                    </div>
                    <div>
                      <p className="text-sm text-purple-600">İptal Oranı</p>
                      <p className="text-2xl font-bold text-purple-700">%3.2</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Abonelik Planları</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Temel Plan</p>
                        <p className="text-sm text-gray-600">Aylık ₺29.99</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-blue-600">856 abone</p>
                        <p className="text-xs text-gray-500">%68.7</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Pro Plan</p>
                        <p className="text-sm text-gray-600">Aylık ₺59.99</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">312 abone</p>
                        <p className="text-xs text-gray-500">%25.0</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Premium Plan</p>
                        <p className="text-sm text-gray-600">Aylık ₺99.99</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-purple-600">79 abone</p>
                        <p className="text-xs text-gray-500">%6.3</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Son Aktiviteler</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Yeni abonelik: Pro Plan</p>
                        <p className="text-xs text-gray-500">2 saat önce</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Abonelik iptal edildi</p>
                        <p className="text-xs text-gray-500">4 saat önce</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Plan yükseltme</p>
                        <p className="text-xs text-gray-500">1 gün önce</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gift Cards Tab */}
        {selectedTab === 'giftcards' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Hediye Kartları</h3>
                <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
                  Yeni Hediye Kartı
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-pink-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">🎁</span>
                    </div>
                    <div>
                      <p className="text-sm text-pink-600">Toplam Kart</p>
                      <p className="text-2xl font-bold text-pink-700">2,456</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">₺</span>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Kullanılan Tutar</p>
                      <p className="text-2xl font-bold text-green-700">₺89,450</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">⏰</span>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Bekleyen</p>
                      <p className="text-2xl font-bold text-blue-700">₺23,100</p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">📅</span>
                    </div>
                    <div>
                      <p className="text-sm text-orange-600">Süresi Dolan</p>
                      <p className="text-2xl font-bold text-orange-700">45</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kod</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oluşturulma</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Son Kullanım</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">GIFT-ABC123</code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₺100.00</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Aktif</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15 Aralık 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Detay</button>
                        <button className="text-red-600 hover:text-red-900">İptal</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Operations Tab */}
        {selectedTab === 'bulk' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Toplu İşlemler</h3>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Yeni Toplu İşlem
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">📦</span>
                    </div>
                    <div>
                      <p className="text-sm text-indigo-600">Toplu Güncelleme</p>
                      <p className="text-2xl font-bold text-indigo-700">156</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">📊</span>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Toplu İçe Aktarma</p>
                      <p className="text-2xl font-bold text-green-700">23</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">📤</span>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Toplu Dışa Aktarma</p>
                      <p className="text-2xl font-bold text-blue-700">8</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">🔄</span>
                    </div>
                    <div>
                      <p className="text-sm text-purple-600">Senkronizasyon</p>
                      <p className="text-2xl font-bold text-purple-700">12</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Hızlı İşlemler</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Ürün Fiyatlarını Güncelle</p>
                          <p className="text-sm text-gray-600">Toplu fiyat güncelleme</p>
                        </div>
                        <span className="text-blue-600">→</span>
                      </div>
                    </button>
                    <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Stok Durumunu Güncelle</p>
                          <p className="text-sm text-gray-600">Toplu stok güncelleme</p>
                        </div>
                        <span className="text-blue-600">→</span>
                      </div>
                    </button>
                    <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Kategori Ataması</p>
                          <p className="text-sm text-gray-600">Toplu kategori güncelleme</p>
                        </div>
                        <span className="text-blue-600">→</span>
                      </div>
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Son İşlemler</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Fiyat güncelleme tamamlandı</p>
                        <p className="text-xs text-gray-500">245 ürün güncellendi</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Stok senkronizasyonu</p>
                        <p className="text-xs text-gray-500">156 ürün senkronize edildi</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Kategori ataması</p>
                        <p className="text-xs text-gray-500">89 ürün kategorilendirildi</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {selectedTab === 'integrations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Entegrasyonlar</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => fetchIntegrationStatus()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Durumu Yenile
                  </button>
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                    Yeni Entegrasyon
                  </button>
                </div>
              </div>
              
              {/* Integration Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Aktif</p>
                      <p className="text-2xl font-bold text-green-700">8</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">○</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pasif</p>
                      <p className="text-2xl font-bold text-gray-700">2</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">T</span>
                    </div>
                    <div>
                      <p className="text-sm text-yellow-600">Test</p>
                      <p className="text-2xl font-bold text-yellow-700">2</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">B</span>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Beta</p>
                      <p className="text-2xl font-bold text-blue-700">1</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-lg font-bold">📧</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">E-posta Servisleri</h4>
                        <p className="text-sm text-gray-600">Mailchimp, SendGrid</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <span className="text-lg">⚙️</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Mailchimp</span>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                        <button className="text-blue-600 hover:text-blue-800 text-xs">Test</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">SendGrid</span>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Pasif</span>
                        <button className="text-blue-600 hover:text-blue-800 text-xs">Aktif Et</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-lg font-bold">💳</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Ödeme Sistemleri</h4>
                        <p className="text-sm text-gray-600">Stripe, PayPal, iyzico</p>
                      </div>
                    </div>
                    <button className="text-green-600 hover:text-green-800">
                      <span className="text-lg">⚙️</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Stripe</span>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                        <button className="text-green-600 hover:text-green-800 text-xs">Test</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">PayPal</span>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                        <button className="text-green-600 hover:text-green-800 text-xs">Test</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">iyzico</span>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Test</span>
                        <button className="text-green-600 hover:text-green-800 text-xs">Aktif Et</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-lg font-bold">📊</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Analitik</h4>
                        <p className="text-sm text-gray-600">Google Analytics, Mixpanel</p>
                      </div>
                    </div>
                    <button className="text-purple-600 hover:text-purple-800">
                      <span className="text-lg">⚙️</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Google Analytics</span>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                        <button className="text-purple-600 hover:text-purple-800 text-xs">Rapor</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Mixpanel</span>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Pasif</span>
                        <button className="text-purple-600 hover:text-purple-800 text-xs">Aktif Et</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-lg font-bold">🚚</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Kargo</h4>
                        <p className="text-sm text-gray-600">Aras Kargo, MNG</p>
                      </div>
                    </div>
                    <button className="text-orange-600 hover:text-orange-800">
                      <span className="text-lg">⚙️</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Aras Kargo</span>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                        <button className="text-orange-600 hover:text-orange-800 text-xs">Test</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">MNG Kargo</span>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                        <button className="text-orange-600 hover:text-orange-800 text-xs">Test</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-lg font-bold">📱</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Sosyal Medya</h4>
                        <p className="text-sm text-gray-600">Instagram, Facebook</p>
                      </div>
                    </div>
                    <button className="text-pink-600 hover:text-pink-800">
                      <span className="text-lg">⚙️</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Instagram</span>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                        <button className="text-pink-600 hover:text-pink-800 text-xs">Post</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Facebook</span>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                        <button className="text-pink-600 hover:text-pink-800 text-xs">Post</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-lg font-bold">🔧</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">API Yönetimi</h4>
                        <p className="text-sm text-gray-600">REST, GraphQL</p>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800">
                      <span className="text-lg">⚙️</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">REST API</span>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                        <button className="text-indigo-600 hover:text-indigo-800 text-xs">Docs</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">GraphQL</span>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Beta</span>
                        <button className="text-indigo-600 hover:text-indigo-800 text-xs">Test</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile App Tab */}
        {selectedTab === 'mobile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Mobil Uygulama</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Uygulama Ayarları
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">📱</span>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Toplam İndirme</p>
                      <p className="text-2xl font-bold text-blue-700">12.5K</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">⭐</span>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Ortalama Puan</p>
                      <p className="text-2xl font-bold text-green-700">4.7</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">🔄</span>
                    </div>
                    <div>
                      <p className="text-sm text-purple-600">Aktif Kullanıcı</p>
                      <p className="text-2xl font-bold text-purple-700">8.2K</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Platform Dağılımı</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-black rounded mr-3"></div>
                        <span className="text-sm text-gray-600">iOS</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">7,250</p>
                        <p className="text-xs text-gray-500">%58</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-green-500 rounded mr-3"></div>
                        <span className="text-sm text-gray-600">Android</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">5,250</p>
                        <p className="text-xs text-gray-500">%42</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Özellikler</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Push Bildirimleri</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Offline Senkronizasyon</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Biyometrik Giriş</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">AR Görüntüleme</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Sesli Arama</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Features Tab */}
        {selectedTab === 'advanced' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Gelişmiş Özellikler</h3>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700">
                  Özellik Ayarları
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg font-bold">🤖</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">AI Önerileri</h4>
                      <p className="text-sm text-gray-600">Akıllı ürün önerileri</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Durum</span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Doğruluk</span>
                      <span className="text-sm font-bold text-blue-600">%87.3</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg font-bold">💰</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Fiyat Optimizasyonu</h4>
                      <p className="text-sm text-gray-600">Dinamik fiyatlandırma</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Durum</span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Kar Artışı</span>
                      <span className="text-sm font-bold text-green-600">+%23.5</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg font-bold">📊</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Gelişmiş Analitik</h4>
                      <p className="text-sm text-gray-600">Derinlemesine analiz</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Durum</span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Raporlar</span>
                      <span className="text-sm font-bold text-purple-600">156</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg font-bold">🔄</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Otomasyon</h4>
                      <p className="text-sm text-gray-600">İş akışı otomasyonu</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Durum</span>
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Test</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Kurallar</span>
                      <span className="text-sm font-bold text-orange-600">23</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-lg border border-pink-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg font-bold">🎯</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Müşteri Segmentasyonu</h4>
                      <p className="text-sm text-gray-600">Akıllı müşteri grupları</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Durum</span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Segmentler</span>
                      <span className="text-sm font-bold text-pink-600">8</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-lg font-bold">🔒</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Güvenlik</h4>
                      <p className="text-sm text-gray-600">Gelişmiş güvenlik</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Durum</span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Güvenlik Skoru</span>
                      <span className="text-sm font-bold text-indigo-600">98/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kategori Yönetimi Tab */}
        {selectedTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Kategori Yönetimi</h3>
                <button 
                  onClick={() => setShowCategoryModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Yeni Kategori</span>
                </button>
              </div>

              {/* Ana Kategoriler */}
              <div className="mb-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Ana Kategoriler</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.filter(cat => cat.level === 0).map(category => (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{category.name}</h5>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>ID: {category.id}</span>
                        <span className={`px-2 py-1 rounded-full ${
                          category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alt Kategoriler */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Alt Kategoriler</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.filter(cat => cat.level === 1).map(subcategory => {
                    const parentCategory = categories.find(cat => cat.id === subcategory.parentId);
                    return (
                      <div key={subcategory.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{subcategory.name}</h5>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditCategory(subcategory)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(subcategory.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{subcategory.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Ana: {parentCategory?.name || 'Bilinmiyor'}</span>
                          <span className={`px-2 py-1 rounded-full ${
                            subcategory.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {subcategory.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Kategori Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
              </h3>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                  setCategoryForm({ name: '', slug: '', parentId: null, description: '', image: '', sortOrder: 0 });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kategori adını girin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="kategori-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ana Kategori
                  </label>
                  <select
                    value={categoryForm.parentId || ''}
                    onChange={(e) => setCategoryForm({...categoryForm, parentId: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Ana kategori (boş bırakın)</option>
                    {categories.filter(cat => cat.level === 0).map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sıralama
                  </label>
                  <input
                    type="number"
                    value={categoryForm.sortOrder}
                    onChange={(e) => setCategoryForm({...categoryForm, sortOrder: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Kategori açıklamasını girin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Görsel URL
                </label>
                <input
                  type="url"
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({...categoryForm, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                    setCategoryForm({ name: '', slug: '', parentId: null, description: '', image: '', sortOrder: 0 });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Kaydediliyor...' : (editingCategory ? 'Güncelle' : 'Ekle')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ürün Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Hata/Başarı Mesajı */}
            {submitMessage && (
              <div className={`mb-4 p-4 rounded-lg ${
                submitMessageType === 'error' 
                  ? 'bg-red-50 border border-red-200 text-red-700' 
                  : 'bg-green-50 border border-green-200 text-green-700'
              }`}>
                <div className="flex items-center">
                  {submitMessageType === 'error' ? (
                    <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                  ) : (
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                  )}
                  <span className="text-sm font-medium">{submitMessage}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ürün Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ürün adını girin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat (TL) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <select
                    required
                    value={productForm.category}
                    onChange={(e) => {
                      const selectedCategory = categories.find(cat => cat.name === e.target.value);
                      setProductForm({...productForm, category: e.target.value, subcategory: ''});
                      if (selectedCategory) {
                        fetchSubcategories(selectedCategory.id);
                      } else {
                        setSubcategories([]);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Kategori seçin</option>
                    {categories.filter(cat => cat.level === 0).map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Kategori
                  </label>
                  <select
                    value={productForm.subcategory || ''}
                    onChange={(e) => setProductForm({...productForm, subcategory: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Alt kategori seçin (opsiyonel)</option>
                    {subcategories.map(subcategory => (
                      <option key={subcategory.id} value={subcategory.name}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stok Miktarı *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ürün Açıklaması
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ürün açıklamasını girin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ürün Görseli URL
                </label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Kaydediliyor...' : (editingProduct ? 'Güncelle' : 'Ekle')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}