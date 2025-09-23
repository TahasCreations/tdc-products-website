'use client';

import { useState, useEffect } from 'react';
import { 
  TagIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface Coupon {
  id: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  status: 'active' | 'inactive' | 'expired';
  applicableProducts?: string[];
  applicableCategories?: string[];
  createdAt: string;
}

interface CouponManagerProps {
  onSave: (coupon: Coupon) => void;
  onUpdate: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
}

export default function CouponManager({ onSave, onUpdate, onDelete }: CouponManagerProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'percentage' as const,
    value: 0,
    minAmount: 0,
    maxDiscount: 0,
    usageLimit: 0,
    validFrom: '',
    validUntil: '',
    applicableProducts: [] as string[],
    applicableCategories: [] as string[]
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/coupons');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const couponData: Coupon = {
      id: editingCoupon?.id || `coupon_${Date.now()}`,
      code: formData.code,
      name: formData.name,
      type: formData.type,
      value: formData.value,
      minAmount: formData.minAmount || undefined,
      maxDiscount: formData.maxDiscount || undefined,
      usageLimit: formData.usageLimit || undefined,
      usedCount: editingCoupon?.usedCount || 0,
      validFrom: formData.validFrom,
      validUntil: formData.validUntil,
      status: 'active',
      applicableProducts: formData.applicableProducts,
      applicableCategories: formData.applicableCategories,
      createdAt: editingCoupon?.createdAt || new Date().toISOString()
    };

    try {
      if (editingCoupon) {
        await onUpdate(couponData);
        setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? couponData : c));
      } else {
        await onSave(couponData);
        setCoupons(prev => [...prev, couponData]);
      }
      
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Kupon kaydetme hatası:', error);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      name: coupon.name,
      type: coupon.type,
      value: coupon.value,
      minAmount: coupon.minAmount || 0,
      maxDiscount: coupon.maxDiscount || 0,
      usageLimit: coupon.usageLimit || 0,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      applicableProducts: coupon.applicableProducts || [],
      applicableCategories: coupon.applicableCategories || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu kuponu silmek istediğinizden emin misiniz?')) {
      try {
        await onDelete(id);
        setCoupons(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        console.error('Kupon silme hatası:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      type: 'percentage',
      value: 0,
      minAmount: 0,
      maxDiscount: 0,
      usageLimit: 0,
      validFrom: '',
      validUntil: '',
      applicableProducts: [],
      applicableCategories: []
    });
    setEditingCoupon(null);
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Kuponlar yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TagIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Kupon Yönetimi</h3>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Yeni Kupon</span>
        </button>
      </div>

      {/* Kupon Listesi */}
      <div className="space-y-4">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{coupon.name}</h4>
                    <p className="text-sm text-gray-600">Kod: {coupon.code}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {coupon.type === 'percentage' ? (
                      <span className="text-blue-600 font-bold">%</span>
                    ) : (
                      <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                    )}
                    <span className="text-sm font-medium">
                      {coupon.type === 'percentage' ? `%${coupon.value}` : `₺${coupon.value}`}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(coupon.status)}`}>
                    {coupon.status === 'active' ? 'Aktif' : 
                     coupon.status === 'inactive' ? 'Pasif' : 'Süresi Dolmuş'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatDate(coupon.validFrom)} - {formatDate(coupon.validUntil)}</span>
                  </div>
                  <span>Kullanım: {coupon.usedCount}/{coupon.usageLimit || '∞'}</span>
                  {coupon.minAmount && <span>Min: ₺{coupon.minAmount}</span>}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(coupon)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(coupon.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Kupon Formu */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {editingCoupon ? 'Kupon Düzenle' : 'Yeni Kupon Oluştur'}
            </h4>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kupon Kodu *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="KUPON123"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateCode}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Rastgele
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kupon Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Özel İndirim"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İndirim Türü
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="percentage">Yüzde (%)</option>
                    <option value="fixed">Sabit Tutar (₺)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İndirim Değeri *
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                    placeholder={formData.type === 'percentage' ? '20' : '50'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Sipariş Tutarı (₺)
                  </label>
                  <input
                    type="number"
                    value={formData.minAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, minAmount: Number(e.target.value) }))}
                    placeholder="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maksimum İndirim (₺)
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: Number(e.target.value) }))}
                    placeholder="200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kullanım Limiti
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: Number(e.target.value) }))}
                    placeholder="100 (0 = sınırsız)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Geçerlilik Başlangıcı *
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Geçerlilik Bitişi *
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCoupon ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
