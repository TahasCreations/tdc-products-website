'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Tag, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Percent,
  DollarSign,
  Truck
} from 'lucide-react';
import Link from 'next/link';

interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string | null;
  type: string;
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usageLimitPerUser: number;
  usedCount: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string | null;
  applicableTo: string | null;
  productIds: string[];
  categoryIds: string[];
  firstTimeOnly: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SellerCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, [statusFilter]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await fetch(`/api/seller/coupons?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Kuponlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm('Bu kuponu silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/seller/coupons/${couponId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchCoupons();
        alert('Kupon silindi');
      }
    } catch (error) {
      console.error('Kupon silinirken hata:', error);
      alert('Bir hata oluştu');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="w-5 h-5" />;
      case 'fixed': return <DollarSign className="w-5 h-5" />;
      case 'free_shipping': return <Truck className="w-5 h-5" />;
      default: return <Tag className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      percentage: 'Yüzde',
      fixed: 'Sabit Tutar',
      free_shipping: 'Ücretsiz Kargo',
    };
    return labels[type] || type;
  };

  const formatDiscount = (coupon: Coupon) => {
    switch (coupon.type) {
      case 'percentage':
        return `%${coupon.discountValue}`;
      case 'fixed':
        return `${coupon.discountValue}₺`;
      case 'free_shipping':
        return 'Ücretsiz Kargo';
      default:
        return coupon.discountValue.toString();
    }
  };

  const isExpired = (coupon: Coupon) => {
    if (!coupon.validUntil) return false;
    return new Date(coupon.validUntil) < new Date();
  };

  const isActive = (coupon: Coupon) => {
    return coupon.isActive && !isExpired(coupon);
  };

  const filteredCoupons = coupons.filter(c => {
    if (searchTerm) {
      return (
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kupon Yönetimi</h1>
            <p className="text-gray-600">Satıcı kuponlarınızı oluşturun ve yönetin</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Yeni Kupon
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Kupon kodu veya adı ile ara..."
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
                <option value="all">Tüm Kuponlar</option>
                <option value="active">Aktif</option>
                <option value="expired">Süresi Dolmuş</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Coupons Grid */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Henüz kupon oluşturulmamış</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              İlk Kuponunuzu Oluşturun
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map((coupon) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(coupon.type)}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{coupon.code}</h3>
                        <p className="text-sm text-gray-500">{coupon.name}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      isActive(coupon) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isActive(coupon) ? 'Aktif' : isExpired(coupon) ? 'Süresi Dolmuş' : 'Pasif'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-indigo-600 mb-1">
                      {formatDiscount(coupon)}
                    </div>
                    <p className="text-sm text-gray-500">{getTypeLabel(coupon.type)}</p>
                  </div>

                  {coupon.minOrderAmount && (
                    <div className="text-sm text-gray-600 mb-2">
                      Min. Sipariş: {coupon.minOrderAmount}₺
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(coupon.validFrom).toLocaleDateString('tr-TR')} - {
                        coupon.validUntil 
                          ? new Date(coupon.validUntil).toLocaleDateString('tr-TR')
                          : 'Sınırsız'
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-600">Kullanım:</span>
                    <span className="font-semibold">
                      {coupon.usedCount} / {coupon.usageLimit || '∞'}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => setSelectedCoupon(coupon)}
                      className="flex-1 text-indigo-600 hover:text-indigo-900 flex items-center justify-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Detay
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-600 hover:text-red-900 p-2"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Modal - Placeholder */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Yeni Kupon Oluştur</h2>
              <p className="text-gray-600 mb-4">
                Kupon oluşturma formu yakında eklenecek. Şimdilik API endpoint'i hazır.
              </p>
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Kapat
              </button>
            </motion.div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedCoupon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Kupon Detayı</h2>
                <button
                  onClick={() => setSelectedCoupon(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Kupon Kodu</h3>
                  <p className="text-2xl font-bold text-indigo-600">{selectedCoupon.code}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Ad</h3>
                  <p className="text-gray-900">{selectedCoupon.name}</p>
                </div>

                {selectedCoupon.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Açıklama</h3>
                    <p className="text-gray-900">{selectedCoupon.description}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500">İndirim</h3>
                  <p className="text-2xl font-bold text-gray-900">{formatDiscount(selectedCoupon)}</p>
                  <p className="text-sm text-gray-500">{getTypeLabel(selectedCoupon.type)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Kullanım</h3>
                    <p className="text-gray-900">
                      {selectedCoupon.usedCount} / {selectedCoupon.usageLimit || '∞'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Kullanıcı Başına</h3>
                    <p className="text-gray-900">{selectedCoupon.usageLimitPerUser} kez</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Geçerlilik</h3>
                  <p className="text-gray-900">
                    {new Date(selectedCoupon.validFrom).toLocaleDateString('tr-TR')} - {
                      selectedCoupon.validUntil 
                        ? new Date(selectedCoupon.validUntil).toLocaleDateString('tr-TR')
                        : 'Sınırsız'
                    }
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Durum</h3>
                  <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                    isActive(selectedCoupon) 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isActive(selectedCoupon) ? 'Aktif' : isExpired(selectedCoupon) ? 'Süresi Dolmuş' : 'Pasif'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

