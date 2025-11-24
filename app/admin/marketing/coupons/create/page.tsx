"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function CreateCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed' | 'free_shipping',
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscountAmount: undefined as number | undefined,
    usageLimit: undefined as number | undefined,
    usageLimitPerUser: 1,
    isActive: true,
    isPublic: true,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: undefined as string | undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : undefined,
          validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/marketing/coupons');
      } else {
        alert(data.error || 'Kupon oluşturulamadı');
      }
    } catch (error) {
      console.error('Kupon oluşturma hatası:', error);
      alert('Kupon oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/marketing/coupons"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kupon Listesine Dön
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Yeni Kupon Oluştur</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kupon Kodu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kupon Kodu *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="HOSGELDIN"
              required
            />
          </div>

          {/* Kupon Adı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kupon Adı *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Hoş Geldin İndirimi"
              required
            />
          </div>

          {/* Açıklama */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              placeholder="Kupon açıklaması..."
            />
          </div>

          {/* İndirim Tipi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İndirim Tipi *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="percentage">Yüzde İndirim (%)</option>
              <option value="fixed">Sabit Tutar (₺)</option>
              <option value="free_shipping">Ücretsiz Kargo</option>
            </select>
          </div>

          {/* İndirim Değeri */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İndirim Değeri *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={formData.type === 'percentage' ? '10' : '50'}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.type === 'percentage' ? 'Yüzde olarak (örn: 10 = %10)' : 'Sabit tutar (örn: 50 = ₺50)'}
            </p>
          </div>

          {/* Minimum Sipariş Tutarı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Sipariş Tutarı (₺)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.minOrderAmount}
              onChange={(e) => setFormData({ ...formData, minOrderAmount: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0"
            />
          </div>

          {/* Maksimum İndirim Tutarı (sadece yüzde için) */}
          {formData.type === 'percentage' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maksimum İndirim Tutarı (₺)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.maxDiscountAmount || ''}
                onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Sınırsız"
              />
            </div>
          )}

          {/* Kullanım Limiti */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Toplam Kullanım Limiti
            </label>
            <input
              type="number"
              min="1"
              value={formData.usageLimit || ''}
              onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Sınırsız"
            />
          </div>

          {/* Kullanıcı Başına Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kullanıcı Başına Limit *
            </label>
            <input
              type="number"
              min="1"
              value={formData.usageLimitPerUser}
              onChange={(e) => setFormData({ ...formData, usageLimitPerUser: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Geçerlilik Başlangıç */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Geçerlilik Başlangıç Tarihi *
            </label>
            <input
              type="date"
              value={formData.validFrom}
              onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Geçerlilik Bitiş */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Geçerlilik Bitiş Tarihi
            </label>
            <input
              type="date"
              value={formData.validUntil || ''}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Durum */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Aktif</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Herkese Açık</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <Link
            href="/admin/marketing/coupons"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Kaydediliyor...' : 'Kupon Oluştur'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}



