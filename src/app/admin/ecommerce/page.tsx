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
    stock: '',
    description: '',
    image: ''
  });

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
        console.error('E-ticaret verileri yüklenirken hata:', error);
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
  }, []);

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
      alert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    if (parseFloat(productForm.price) <= 0) {
      alert('Fiyat 0\'dan büyük olmalıdır.');
      return;
    }

    if (parseInt(productForm.stock) < 0) {
      alert('Stok miktarı negatif olamaz.');
      return;
    }
    
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
          stock: '',
          description: '',
          image: ''
        });
        setShowProductModal(false);
        setEditingProduct(null);
        
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
      console.error('Ürün kaydetme hatası:', error);
      alert('Ürün kaydedilirken bir hata oluştu');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.title || product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      description: product.description || '',
      image: product.image
    });
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
      console.error('Ürün silme hatası:', error);
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
                    stock: '',
                    description: '',
                    image: ''
                  });
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
          <div className="flex space-x-2">
            {[
              { id: 'overview', label: 'Genel Bakış' },
              { id: 'products', label: 'Ürünler' },
              { id: 'orders', label: 'Siparişler' },
              { id: 'customers', label: 'Müşteriler' },
              { id: 'payments', label: 'Ödemeler' },
              { id: 'analytics', label: 'Analizler' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
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
                      stock: '',
                      description: '',
                      image: ''
                    });
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
                        stock: '',
                        description: '',
                        image: ''
                      });
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
                                    console.log('Sipariş durumu güncelleniyor:', order.id, newStatus);
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
      </div>

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
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Kategori seçin</option>
                    <option value="Anime">Anime</option>
                    <option value="Manga">Manga</option>
                    <option value="Oyun">Oyun</option>
                    <option value="Film">Film</option>
                    <option value="Diğer">Diğer</option>
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
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingProduct ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}