"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BillingSuccessPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // URL'den plan bilgisini al
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan') || 'Yıllık Plan';
    
    // Mock subscription data
    setSubscription({
      plan,
      status: 'active',
      periodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center">
        {/* Başarı İkonu */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Ödeme Başarılı!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Aboneliğiniz başarıyla aktifleştirildi.
        </p>

        {/* Abonelik Detayları */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Abonelik Detayları</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-semibold">{subscription?.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Durum:</span>
              <span className="text-green-600 font-semibold">Aktif</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bitiş Tarihi:</span>
              <span className="font-semibold">
                {new Date(subscription?.periodEnd).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>
        </div>

        {/* Sonraki Adımlar */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Sonraki Adımlar</h3>
          <ul className="text-left text-blue-800 space-y-2">
            <li>• Abonelik özelliklerini hemen kullanmaya başlayabilirsiniz</li>
            <li>• Yıllık planda domain hakkınız varsa, domain talep edebilirsiniz</li>
            <li>• Reklam kampanyalarınızı oluşturabilirsiniz</li>
            <li>• Anahtar kelime analiz aracını kullanabilirsiniz</li>
          </ul>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/seller/settings/domain"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Domain Talep Et
          </Link>
          <Link
            href="/seller/ads/campaigns"
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Reklam Kampanyaları
          </Link>
          <Link
            href="/seller/billing"
            className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
          >
            Abonelik Yönetimi
          </Link>
        </div>
      </div>
    </div>
  );
}
