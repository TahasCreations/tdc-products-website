'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Search, 
  Filter,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign
} from 'lucide-react';

interface SellerOrder {
  id: string;
  orderId: string;
  orderNumber: string;
  status: string;
  total: number;
  commission: number;
  commissionRate: number;
  payoutAmount: number;
  trackingNumber: string | null;
  notes: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  } | null;
  items: Array<{
    id: string;
    productId: string;
    title: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    image: string | null;
  }>;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrderStats {
  byStatus: Record<string, {
    count: number;
    total: number;
    payoutAmount: number;
    commission: number;
  }>;
  total: {
    orders: number;
    totalRevenue: number;
    totalPayout: number;
    totalCommission: number;
  };
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    trackingNumber: '',
    notes: '',
  });

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      const response = await fetch(`/api/seller/orders?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(`/api/seller/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusUpdate),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchOrders();
        setShowStatusModal(false);
        setSelectedOrder(null);
        setStatusUpdate({ status: '', trackingNumber: '', notes: '' });
        alert('Sipariş durumu güncellendi');
      }
    } catch (error) {
      console.error('Sipariş durumu güncellenirken hata:', error);
      alert('Bir hata oluştu');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Beklemede',
      confirmed: 'Onaylandı',
      processing: 'İşleniyor',
      shipped: 'Kargoya Verildi',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(o => {
    if (searchTerm) {
      return (
        o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.customer && o.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Siparişlerim</h1>
          <p className="text-gray-600">Satıcıya ait sub-orders (alt siparişler)</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Toplam Sipariş</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total.orders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-gray-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Toplam Gelir</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.total.totalRevenue.toLocaleString('tr-TR')}₺
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ödenecek Tutar</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.total.totalPayout.toLocaleString('tr-TR')}₺
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Komisyon</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.total.totalCommission.toLocaleString('tr-TR')}₺
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Sipariş no, müşteri adı veya takip no ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="pending">Beklemede</option>
                <option value="confirmed">Onaylandı</option>
                <option value="processing">İşleniyor</option>
                <option value="shipped">Kargoya Verildi</option>
                <option value="delivered">Teslim Edildi</option>
                <option value="cancelled">İptal Edildi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Sipariş bulunamadı</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    Takip No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.customer ? (
                        <>
                          <div className="text-sm text-gray-900">{order.customer.name}</div>
                          <div className="text-sm text-gray-500">{order.customer.email}</div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {order.total.toLocaleString('tr-TR')}₺
                      </div>
                      <div className="text-xs text-gray-500">
                        Ödenecek: {order.payoutAmount.toLocaleString('tr-TR')}₺
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.trackingNumber ? (
                        <div className="text-sm text-gray-900">{order.trackingNumber}</div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Sipariş Detayı</h2>
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    setShowStatusModal(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Sipariş No</h3>
                    <p className="text-lg font-semibold text-gray-900">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Durum</h3>
                    <span className={`px-3 py-1 inline-flex items-center gap-1 text-sm font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                </div>

                {selectedOrder.customer && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Müşteri</h3>
                    <p className="text-gray-900">{selectedOrder.customer.name}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.customer.email}</p>
                    {selectedOrder.customer.phone && (
                      <p className="text-sm text-gray-500">{selectedOrder.customer.phone}</p>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Ürünler</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} adet × {item.unitPrice.toLocaleString('tr-TR')}₺
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {item.subtotal.toLocaleString('tr-TR')}₺
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Toplam Tutar</h3>
                    <p className="text-xl font-bold text-gray-900">
                      {selectedOrder.total.toLocaleString('tr-TR')}₺
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Komisyon</h3>
                    <p className="text-xl font-bold text-orange-600">
                      {selectedOrder.commission.toLocaleString('tr-TR')}₺
                    </p>
                    <p className="text-xs text-gray-500">
                      (%{(selectedOrder.commissionRate * 100).toFixed(2)})
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Ödenecek Tutar</h3>
                    <p className="text-xl font-bold text-blue-600">
                      {selectedOrder.payoutAmount.toLocaleString('tr-TR')}₺
                    </p>
                  </div>
                </div>

                {selectedOrder.trackingNumber && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Kargo Takip No</h3>
                    <p className="text-gray-900">{selectedOrder.trackingNumber}</p>
                  </div>
                )}

                {selectedOrder.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Notlar</h3>
                    <p className="text-gray-900">{selectedOrder.notes}</p>
                  </div>
                )}

                {['pending', 'confirmed', 'processing'].includes(selectedOrder.status) && (
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => {
                        setStatusUpdate({
                          status: selectedOrder.status === 'pending' ? 'confirmed' : 
                                  selectedOrder.status === 'confirmed' ? 'processing' : 'shipped',
                          trackingNumber: selectedOrder.trackingNumber || '',
                          notes: selectedOrder.notes || '',
                        });
                        setShowStatusModal(true);
                      }}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Durum Güncelle
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sipariş Durumu Güncelle</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yeni Durum
                  </label>
                  <select
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="confirmed">Onaylandı</option>
                    <option value="processing">İşleniyor</option>
                    <option value="shipped">Kargoya Verildi</option>
                    <option value="delivered">Teslim Edildi</option>
                  </select>
                </div>

                {statusUpdate.status === 'shipped' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kargo Takip No
                    </label>
                    <input
                      type="text"
                      value={statusUpdate.trackingNumber}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, trackingNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="TR123456789"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notlar (Opsiyonel)
                  </label>
                  <textarea
                    value={statusUpdate.notes}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    placeholder="Notlar..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleStatusUpdate}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Güncelle
                  </button>
                  <button
                    onClick={() => {
                      setShowStatusModal(false);
                      setStatusUpdate({ status: '', trackingNumber: '', notes: '' });
                    }}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
