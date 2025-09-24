'use client';

import { useState, useEffect, useCallback } from 'react';
import OptimizedLoader from '../../../components/OptimizedLoader';
import AdminProtection from '../../../components/AdminProtection';
import Link from 'next/link';

interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  status: string;
  payment_status: string;
  payment_method?: string;
  shipping_method?: string;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  currency_code: string;
  notes?: string;
  admin_notes?: string;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
  order_status_history: OrderStatusHistory[];
  order_payments: OrderPayment[];
  order_shipping: OrderShipping[];
}

interface OrderItem {
  id: string;
  product_name: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface OrderStatusHistory {
  id: string;
  status: string;
  notes?: string;
  changed_at: string;
}

interface OrderPayment {
  id: string;
  payment_method: string;
  amount: number;
  status: string;
  paid_at?: string;
}

interface OrderShipping {
  id: string;
  shipping_company?: string;
  tracking_number?: string;
  status: string;
  estimated_delivery_date?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [paymentData, setPaymentData] = useState({
    payment_status: '',
    payment_method: '',
    transaction_id: ''
  });
  const [shippingData, setShippingData] = useState({
    shipping_company: '',
    tracking_number: '',
    estimated_delivery_date: ''
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      
      // No orders available
      const mockOrders: Order[] = [];

      // Filter by status
      const filteredOrders = activeTab === 'all' 
        ? mockOrders 
        : mockOrders.filter(order => order.status === activeTab);
      
      setOrders(filteredOrders);
    } catch (error) {
      
      setMessage('Bağlantı hatası');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_status',
          order_id: selectedOrder.id,
          status: newStatus,
          notes: statusNotes
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Sipariş durumu güncellendi');
        setMessageType('success');
        setShowStatusModal(false);
        setNewStatus('');
        setStatusNotes('');
        fetchOrders();
      } else {
        setMessage(data.error || 'Durum güncellenemedi');
        setMessageType('error');
      }
    } catch (error) {
      
      setMessage('Durum güncellenirken hata oluştu');
      setMessageType('error');
    }
  };

  const handlePaymentUpdate = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_payment',
          order_id: selectedOrder.id,
          ...paymentData
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Ödeme durumu güncellendi');
        setMessageType('success');
        setShowPaymentModal(false);
        setPaymentData({ payment_status: '', payment_method: '', transaction_id: '' });
        fetchOrders();
      } else {
        setMessage(data.error || 'Ödeme durumu güncellenemedi');
        setMessageType('error');
      }
    } catch (error) {
      
      setMessage('Ödeme durumu güncellenirken hata oluştu');
      setMessageType('error');
    }
  };

  const handleShippingUpdate = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_shipping',
          order_id: selectedOrder.id,
          ...shippingData
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Kargo bilgileri güncellendi');
        setMessageType('success');
        setShowShippingModal(false);
        setShippingData({ shipping_company: '', tracking_number: '', estimated_delivery_date: '' });
        fetchOrders();
      } else {
        setMessage(data.error || 'Kargo bilgileri güncellenemedi');
        setMessageType('error');
      }
    } catch (error) {
      
      setMessage('Kargo bilgileri güncellenirken hata oluştu');
      setMessageType('error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'confirmed':
        return 'Onaylandı';
      case 'processing':
        return 'İşleniyor';
      case 'shipped':
        return 'Kargoya Verildi';
      case 'delivered':
        return 'Teslim Edildi';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Ödendi';
      case 'pending':
        return 'Beklemede';
      case 'failed':
        return 'Başarısız';
      case 'refunded':
        return 'İade Edildi';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <OptimizedLoader message="Siparişler yükleniyor..." />;
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => window.history.back()}
                  className="mr-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors group"
                  title="Önceki sayfaya dön"
                >
                  <i className="ri-close-line text-lg text-gray-600 group-hover:text-red-600 transition-colors"></i>
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Sipariş Yönetimi</h1>
                  <p className="text-gray-600 mt-2">Tüm siparişleri görüntüleyin ve yönetin</p>
                </div>
              </div>
              <Link
                href="/admin"
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Admin Paneli
              </Link>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <i className="ri-shopping-cart-line text-2xl text-blue-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                  <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <i className="ri-time-line text-2xl text-yellow-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <i className="ri-check-line text-2xl text-green-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Teslim Edilen</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {orders.filter(o => o.status === 'delivered').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <i className="ri-money-dollar-circle-line text-2xl text-purple-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Tutar</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(orders.reduce((sum, order) => sum + order.total_amount, 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
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

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'all'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tümü ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'pending'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Bekleyen ({orders.filter(o => o.status === 'pending').length})
                </button>
                <button
                  onClick={() => setActiveTab('processing')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'processing'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  İşleniyor ({orders.filter(o => o.status === 'processing').length})
                </button>
                <button
                  onClick={() => setActiveTab('shipped')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'shipped'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Kargoda ({orders.filter(o => o.status === 'shipped').length})
                </button>
                <button
                  onClick={() => setActiveTab('delivered')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'delivered'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Teslim Edilen ({orders.filter(o => o.status === 'delivered').length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <i className="ri-shopping-cart-line text-6xl text-gray-400 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz sipariş yok</h3>
                  <p className="text-gray-600">Müşteriler sipariş verdiğinde burada görünecek.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              #{order.order_number}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
                              {getPaymentStatusText(order.payment_status)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Müşteri</p>
                              <p className="text-sm text-gray-600">{order.customer_name}</p>
                              <p className="text-sm text-gray-500">{order.customer_email}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Sipariş Tarihi</p>
                              <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Toplam Tutar</p>
                              <p className="text-sm text-gray-600">{formatCurrency(order.total_amount, order.currency_code)}</p>
                            </div>
                          </div>

                          {/* Sipariş Öğeleri */}
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-900 mb-2">Sipariş Öğeleri:</p>
                            <div className="space-y-1">
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                                  <span>{item.product_name} x {item.quantity}</span>
                                  <span>{formatCurrency(item.total_price, order.currency_code)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Kargo Bilgileri */}
                          {order.tracking_number && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Takip No:</span> {order.tracking_number}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Detaylar
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowStatusModal(true);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Durum Değiştir
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowPaymentModal(true);
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Ödeme
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowShippingModal(true);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Kargo
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sipariş Detay Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Sipariş Detayları - #{selectedOrder.order_number}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Müşteri Bilgileri</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Ad:</strong> {selectedOrder.customer_name}</p>
                    <p><strong>E-posta:</strong> {selectedOrder.customer_email}</p>
                    {selectedOrder.customer_phone && <p><strong>Telefon:</strong> {selectedOrder.customer_phone}</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Sipariş Bilgileri</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Durum:</strong> {getStatusText(selectedOrder.status)}</p>
                    <p><strong>Ödeme Durumu:</strong> {getPaymentStatusText(selectedOrder.payment_status)}</p>
                    <p><strong>Ödeme Yöntemi:</strong> {selectedOrder.payment_method || 'Belirtilmemiş'}</p>
                    <p><strong>Kargo Yöntemi:</strong> {selectedOrder.shipping_method || 'Belirtilmemiş'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tutar Bilgileri</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Ara Toplam:</strong> {formatCurrency(selectedOrder.subtotal, selectedOrder.currency_code)}</p>
                    <p><strong>Kargo:</strong> {formatCurrency(selectedOrder.shipping_cost, selectedOrder.currency_code)}</p>
                    <p><strong>Vergi:</strong> {formatCurrency(selectedOrder.tax_amount, selectedOrder.currency_code)}</p>
                    <p><strong>İndirim:</strong> {formatCurrency(selectedOrder.discount_amount, selectedOrder.currency_code)}</p>
                    <p className="font-semibold"><strong>Toplam:</strong> {formatCurrency(selectedOrder.total_amount, selectedOrder.currency_code)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tarih Bilgileri</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Sipariş:</strong> {formatDate(selectedOrder.created_at)}</p>
                    {selectedOrder.shipped_at && <p><strong>Kargoya Verilme:</strong> {formatDate(selectedOrder.shipped_at)}</p>}
                    {selectedOrder.delivered_at && <p><strong>Teslim:</strong> {formatDate(selectedOrder.delivered_at)}</p>}
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Müşteri Notları</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                </div>
              )}

              {selectedOrder.admin_notes && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Admin Notları</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.admin_notes}</p>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Durum Değiştirme Modal */}
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sipariş Durumu Değiştir</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Durum</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Durum seçin...</option>
                    <option value="pending">Beklemede</option>
                    <option value="confirmed">Onaylandı</option>
                    <option value="processing">İşleniyor</option>
                    <option value="shipped">Kargoya Verildi</option>
                    <option value="delivered">Teslim Edildi</option>
                    <option value="cancelled">İptal Edildi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notlar</label>
                  <textarea
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Durum değişikliği hakkında notlar..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleStatusUpdate}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Güncelle
                </button>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ödeme Durumu Modal */}
        {showPaymentModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ödeme Durumu Güncelle</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ödeme Durumu</label>
                  <select
                    value={paymentData.payment_status}
                    onChange={(e) => setPaymentData({ ...paymentData, payment_status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Durum seçin...</option>
                    <option value="pending">Beklemede</option>
                    <option value="paid">Ödendi</option>
                    <option value="failed">Başarısız</option>
                    <option value="refunded">İade Edildi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ödeme Yöntemi</label>
                  <select
                    value={paymentData.payment_method}
                    onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Yöntem seçin...</option>
                    <option value="credit_card">Kredi Kartı</option>
                    <option value="bank_transfer">Banka Havalesi</option>
                    <option value="cash_on_delivery">Kapıda Ödeme</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İşlem ID</label>
                  <input
                    type="text"
                    value={paymentData.transaction_id}
                    onChange={(e) => setPaymentData({ ...paymentData, transaction_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="İşlem numarası..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handlePaymentUpdate}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Güncelle
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Kargo Bilgileri Modal */}
        {showShippingModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Kargo Bilgileri Güncelle</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kargo Şirketi</label>
                  <input
                    type="text"
                    value={shippingData.shipping_company}
                    onChange={(e) => setShippingData({ ...shippingData, shipping_company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kargo şirketi adı..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Takip Numarası</label>
                  <input
                    type="text"
                    value={shippingData.tracking_number}
                    onChange={(e) => setShippingData({ ...shippingData, tracking_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Takip numarası..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tahmini Teslimat Tarihi</label>
                  <input
                    type="date"
                    value={shippingData.estimated_delivery_date}
                    onChange={(e) => setShippingData({ ...shippingData, estimated_delivery_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleShippingUpdate}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Güncelle
                </button>
                <button
                  onClick={() => setShowShippingModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminProtection>
  );
}
