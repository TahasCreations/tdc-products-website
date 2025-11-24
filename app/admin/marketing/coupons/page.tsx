"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Copy, Eye, TrendingUp, Calendar, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageLimitPerUser: number;
  usedCount: number;
  isActive: boolean;
  isPublic: boolean;
  validFrom: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, [activeTab, search]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeTab !== 'all') {
        params.append('status', activeTab);
      }
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/coupons?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Kuponlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kuponu silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCoupons();
      }
    } catch (error) {
      console.error('Kupon silinemedi:', error);
      alert('Kupon silinemedi');
    }
  };

  const getStatusColor = (coupon: Coupon) => {
    if (!coupon.isActive) return 'bg-gray-100 text-gray-800';
    
    const now = new Date();
    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      return 'bg-gray-100 text-gray-800';
    }
    
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (coupon: Coupon) => {
    if (!coupon.isActive) return 'Pasif';
    
    const now = new Date();
    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      return 'Süresi Doldu';
    }
    
    return 'Aktif';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return 'bg-purple-100 text-purple-800';
      case 'fixed': return 'bg-blue-100 text-blue-800';
      case 'free_shipping': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'percentage': return 'Yüzde';
      case 'fixed': return 'Sabit';
      case 'free_shipping': return 'Ücretsiz Kargo';
      default: return type;
    }
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.type === 'percentage') {
      return `%${coupon.discountValue}`;
    } else if (coupon.type === 'fixed') {
      return `₺${coupon.discountValue.toFixed(2)}`;
    } else {
      return 'Ücretsiz Kargo';
    }
  };

  const stats = {
    active: coupons.filter(c => c.isActive && (!c.validUntil || new Date(c.validUntil) >= new Date())).length,
    expired: coupons.filter(c => c.validUntil && new Date(c.validUntil) < new Date()).length,
    totalDiscount: coupons.reduce((sum, c) => sum + (c.usedCount * (c.type === 'percentage' ? 50 : c.discountValue)), 0),
    totalUsage: coupons.reduce((sum, c) => sum + c.usedCount, 0),
  };

  const filteredCoupons = coupons.filter(coupon => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return coupon.isActive && (!coupon.validUntil || new Date(coupon.validUntil) >= new Date());
    if (activeTab === 'expired') return coupon.validUntil && new Date(coupon.validUntil) < new Date();
    if (activeTab === 'inactive') return !coupon.isActive;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Kupon Yönetimi</h1>
        <div className="flex space-x-2">
          <Link
            href="/admin/marketing/coupons/create"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Kupon</span>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-green-600">{stats.active}</div>
              <div className="text-sm text-gray-600">Aktif Kupon</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-blue-600">₺{stats.totalDiscount.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Toplam İndirim</div>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-purple-600">{stats.totalUsage}</div>
              <div className="text-sm text-gray-600">Kullanım Sayısı</div>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-orange-600">{stats.expired}</div>
              <div className="text-sm text-gray-600">Süresi Dolan</div>
            </div>
            <Calendar className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Kupon kodu veya isim ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'all', label: 'Tümü', count: coupons.length },
              { key: 'active', label: 'Aktif', count: stats.active },
              { key: 'expired', label: 'Süresi Doldu', count: stats.expired },
              { key: 'inactive', label: 'Pasif', count: coupons.filter(c => !c.isActive).length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Coupons Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
          ) : filteredCoupons.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Kupon bulunamadı</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kupon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İndirim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanım</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Geçerlilik</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                        <div className="text-sm text-gray-500">{coupon.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(coupon.type)}`}>
                        {getTypeText(coupon.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatDiscount(coupon)}</div>
                      {coupon.minOrderAmount > 0 && (
                        <div className="text-xs text-gray-500">Min: ₺{coupon.minOrderAmount.toFixed(2)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.usedCount} / {coupon.usageLimit || '∞'}
                      </div>
                      {coupon.usageLimit && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{new Date(coupon.validFrom).toLocaleDateString('tr-TR')}</div>
                      {coupon.validUntil && (
                        <div>{new Date(coupon.validUntil).toLocaleDateString('tr-TR')}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(coupon)}`}>
                        {getStatusText(coupon)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/marketing/coupons/${coupon.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/marketing/coupons/${coupon.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
