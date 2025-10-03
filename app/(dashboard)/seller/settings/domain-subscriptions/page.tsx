"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Subscription {
  id: string;
  plan: string;
  status: string;
  billingCycle: string;
  price: number;
  periodEnd: string;
}

interface DomainAllowance {
  id: string;
  years: number;
  consumed: boolean;
  createdAt: string;
  consumedAt?: string;
}

export default function DomainSubscriptionsPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [allowances, setAllowances] = useState<DomainAllowance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Mock data - gerçek uygulamada API'den gelecek
      setSubscription({
        id: 'sub1',
        plan: 'PRO',
        status: 'active',
        billingCycle: 'YEARLY',
        price: 6000,
        periodEnd: '2024-12-31T23:59:59Z'
      });

      setAllowances([
        {
          id: 'allowance1',
          years: 1,
          consumed: true,
          createdAt: '2024-01-15T10:00:00Z',
          consumedAt: '2024-01-20T14:30:00Z'
        },
        {
          id: 'allowance2',
          years: 1,
          consumed: false,
          createdAt: '2024-01-15T10:00:00Z'
        }
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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

  const getAllowanceStatus = (allowance: DomainAllowance) => {
    if (allowance.consumed) {
      return { text: 'Kullanıldı', color: 'bg-gray-100 text-gray-800' };
    }
    return { text: 'Kullanılabilir', color: 'bg-green-100 text-green-800' };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Domain Abonelikleri</h1>
      
      {/* Aktif Abonelik */}
      {subscription && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Aktif Abonelik</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <p className="text-sm text-gray-600">Faturalama</p>
              <p className="text-sm">{subscription.billingCycle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bitiş Tarihi</p>
              <p className="text-sm">{new Date(subscription.periodEnd).toLocaleDateString('tr-TR')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Domain Hakları */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Domain Hakların</h2>
          <Link
            href="/seller/settings/domain"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm"
          >
            Domain Talep Et
          </Link>
        </div>
        
        {allowances.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Süre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oluşturulma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanılma
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allowances.map((allowance) => {
                  const status = getAllowanceStatus(allowance);
                  return (
                    <tr key={allowance.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {allowance.years} yıl
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(allowance.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {allowance.consumedAt 
                          ? new Date(allowance.consumedAt).toLocaleDateString('tr-TR')
                          : '-'
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">🌐</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Domain hakkınız yok</h3>
            <p className="text-gray-500 mb-4">
              Yıllık plana geçerek 1 yıllık alan adı hakkı kazanabilirsiniz.
            </p>
            <Link
              href="/seller/billing"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Abonelik Yönetimi
            </Link>
          </div>
        )}
      </div>

      {/* Bilgi Notu */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">Önemli Bilgiler</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Yıllık planda 1 yıllık alan adı hakkı dâhildir.</li>
          <li>• Erken iptalde domain bedeli tahsil edilir/transfer öncesi istenir.</li>
          <li>• Domain hakkı bir kez kullanılabilir.</li>
          <li>• Yeni domain hakkı için yıllık plan yenilemesi gereklidir.</li>
        </ul>
      </div>
    </div>
  );
}
