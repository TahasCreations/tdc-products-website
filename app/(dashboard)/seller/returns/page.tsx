'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  RefreshCw
} from 'lucide-react';

interface ReturnRequest {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  product: {
    id: string;
    title: string;
    quantity: number;
    price: number;
    image: string | null;
  } | null;
  reason: string;
  description: string | null;
  status: string;
  refundAmount: number | null;
  trackingNumber: string | null;
  images: string[];
  createdAt: string;
  processedAt: string | null;
}

interface ReturnStats {
  pending: number;
  approved: number;
  processing: number;
  completed: number;
  rejected: number;
  cancelled: number;
  total: number;
}

export default function SellerReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [stats, setStats] = useState<ReturnStats>({
    pending: 0,
    approved: 0,
    processing: 0,
    completed: 0,
    rejected: 0,
    cancelled: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);

  useEffect(() => {
    fetchReturns();
  }, [statusFilter]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      const response = await fetch(`/api/seller/returns?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setReturns(data.returnRequests);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('İade talepleri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (returnId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const response = await fetch(`/api/seller/returns/${returnId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchReturns();
        setSelectedReturn(null);
        alert(status === 'approved' ? 'İade talebi onaylandı' : 'İade talebi reddedildi');
      }
    } catch (error) {
      console.error('İade talebi güncellenirken hata:', error);
      alert('Bir hata oluştu');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Beklemede',
      approved: 'Onaylandı',
      rejected: 'Reddedildi',
      processing: 'İşleniyor',
      completed: 'Tamamlandı',
      cancelled: 'İptal Edildi',
    };
    return labels[status] || status;
  };

  const filteredReturns = returns.filter(r => {
    if (searchTerm) {
      return (
        r.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">İade Talepleri</h1>
          <p className="text-gray-600">Satıcıya ait iade taleplerini yönetin</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bekleyen</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
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
                <p className="text-sm text-gray-600">Onaylanan</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
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
                <p className="text-sm text-gray-600">İşleniyor</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-blue-600" />
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
                <p className="text-sm text-gray-600">Toplam</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-gray-600" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Sipariş no, müşteri adı veya e-posta ile ara..."
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
                <option value="approved">Onaylandı</option>
                <option value="rejected">Reddedildi</option>
                <option value="processing">İşleniyor</option>
                <option value="completed">Tamamlandı</option>
                <option value="cancelled">İptal Edildi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Returns List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        ) : filteredReturns.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">İade talebi bulunamadı</p>
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
                    Ürün
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
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
                {filteredReturns.map((returnRequest) => (
                  <tr key={returnRequest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {returnRequest.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{returnRequest.customer.name}</div>
                      <div className="text-sm text-gray-500">{returnRequest.customer.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {returnRequest.product?.title || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {returnRequest.product ? `${returnRequest.product.quantity} adet` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(returnRequest.status)}`}>
                        {getStatusLabel(returnRequest.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(returnRequest.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedReturn(returnRequest)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {returnRequest.status === 'pending' && (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleStatusUpdate(returnRequest.id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                            title="Onayla"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(returnRequest.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                            title="Reddet"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail Modal */}
        {selectedReturn && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">İade Talebi Detayı</h2>
                  <button
                    onClick={() => setSelectedReturn(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Sipariş No</h3>
                    <p className="text-lg font-semibold text-gray-900">{selectedReturn.orderNumber}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Müşteri</h3>
                    <p className="text-gray-900">{selectedReturn.customer.name}</p>
                    <p className="text-sm text-gray-500">{selectedReturn.customer.email}</p>
                  </div>

                  {selectedReturn.product && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Ürün</h3>
                      <p className="text-gray-900">{selectedReturn.product.title}</p>
                      <p className="text-sm text-gray-500">
                        {selectedReturn.product.quantity} adet × {selectedReturn.product.price}₺
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">İade Sebebi</h3>
                    <p className="text-gray-900">{selectedReturn.reason}</p>
                    {selectedReturn.description && (
                      <p className="text-sm text-gray-600 mt-1">{selectedReturn.description}</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Durum</h3>
                    <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(selectedReturn.status)}`}>
                      {getStatusLabel(selectedReturn.status)}
                    </span>
                  </div>

                  {selectedReturn.refundAmount && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">İade Tutarı</h3>
                      <p className="text-lg font-semibold text-gray-900">{selectedReturn.refundAmount}₺</p>
                    </div>
                  )}

                  {selectedReturn.images && selectedReturn.images.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Görseller</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedReturn.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`İade görseli ${idx + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedReturn.status === 'pending' && (
                    <div className="flex gap-2 pt-4 border-t">
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedReturn.id, 'approved');
                        }}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedReturn.id, 'rejected');
                        }}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      >
                        Reddet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

