"use client";

import { useState, useEffect } from 'react';
import { BILLING_PLANS as PLANS, ENTITLEMENTS_DESC } from '@/lib/billing';

interface Subscription {
  id: string;
  plan: string;
  status: string;
  billingCycle: string;
  price: number;
  periodEnd: string;
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      // Mock data - gerçek uygulamada API'den gelecek
      setSubscription({
        id: 'sub1',
        plan: 'FREE',
        status: 'active',
        billingCycle: 'MONTHLY',
        price: 0,
        periodEnd: '2024-12-31T23:59:59Z'
      });
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (sku: string) => {
    setPurchasing(sku);
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku })
      });
      
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.checkoutUrl;
      } else {
        alert('Ödeme işlemi başarısız. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Ödeme işlemi başarısız. Lütfen tekrar deneyin.');
    } finally {
      setPurchasing(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'past_due': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Abonelik & Faturalama</h1>
      
      {/* Mevcut Abonelik */}
      {subscription && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Mevcut Abonelik</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Plan</p>
              <p className="text-lg font-semibold">{subscription.plan}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Durum</p>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subscription.status)}`}>
                {subscription.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bitiş Tarihi</p>
              <p className="text-sm">{new Date(subscription.periodEnd).toLocaleDateString('tr-TR')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Plan Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(PLANS).map(([sku, plan]) => (
          <div key={sku} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.uiName}</h3>
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                ₺{plan.priceTRY.toLocaleString()}
                {plan.perMonthTRY && (
                  <span className="text-lg text-gray-500 font-normal">
                    /ay (₺{plan.perMonthTRY}/ay)
                  </span>
                )}
              </div>
              {plan.billingCycle === 'YEARLY' && (
                <p className="text-sm text-gray-600">
                  {plan.commitmentMonths} ay taahhüt
                </p>
              )}
            </div>

            {/* Özellikler */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Dahil Özellikler:</h4>
              <ul className="space-y-2">
                {plan.entitlements.map((entitlement) => (
                  <li key={entitlement} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {ENTITLEMENTS_DESC[entitlement] || entitlement}
                  </li>
                ))}
                {plan.includesDomain && (
                  <li className="flex items-center text-sm text-indigo-600 font-semibold">
                    <svg className="w-4 h-4 text-indigo-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Domain dâhil (1 yıl)
                  </li>
                )}
              </ul>
            </div>

            {/* Satın Al Butonu */}
            <button
              onClick={() => handlePurchase(sku)}
              disabled={purchasing === sku}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {purchasing === sku ? 'İşleniyor...' : 'Satın Al'}
            </button>
          </div>
        ))}
      </div>

      {/* Bilgi Notu */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Önemli Bilgiler</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Yıllık planda 1 yıllık alan adı hakkı dâhildir.</li>
          <li>• Erken iptalde domain bedeli tahsil edilir/transfer öncesi istenir.</li>
          <li>• Tüm fiyatlar KDV dahil değildir.</li>
          <li>• Abonelik iptali için 7 gün önceden bildirim gereklidir.</li>
        </ul>
      </div>
    </div>
  );
}
