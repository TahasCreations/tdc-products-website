"use client";

import { useState, useEffect } from 'react';

interface Domain {
  id: string;
  hostname: string;
  status: string;
  dnsTarget: string;
  createdAt: string;
  seller: {
    storeName: string;
  };
}

export default function AdminDomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<string | null>(null);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      // Mock data - gerçek uygulamada API'den gelecek
      setDomains([
        {
          id: '1',
          hostname: 'rsdecors.com',
          status: 'PENDING',
          dnsTarget: 'tdc-products-website.vercel.app',
          createdAt: '2024-01-15T10:00:00Z',
          seller: { storeName: 'RS Decors' }
        },
        {
          id: '2',
          hostname: 'artisanstore.com',
          status: 'PENDING',
          dnsTarget: 'tdc-products-website.vercel.app',
          createdAt: '2024-01-14T15:30:00Z',
          seller: { storeName: 'Artisan Store' }
        }
      ]);
    } catch (error) {
      console.error('Error fetching domains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (hostname: string) => {
    setActivating(hostname);
    try {
      const response = await fetch('/api/domains/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostname })
      });
      
      if (response.ok) {
        setDomains(prev => prev.map(d => 
          d.hostname === hostname 
            ? { ...d, status: 'ACTIVE' }
            : d
        ));
      }
    } catch (error) {
      console.error('Error activating domain:', error);
    } finally {
      setActivating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Domain Yönetimi</h1>
      
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Bekleyen Domain Talepleri</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DNS Hedefi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {domains.map((domain) => (
                <tr key={domain.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{domain.hostname}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{domain.seller.storeName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(domain.status)}`}>
                      {domain.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {domain.dnsTarget}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(domain.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {domain.status === 'PENDING' && (
                      <button
                        onClick={() => handleActivate(domain.hostname)}
                        disabled={activating === domain.hostname}
                        className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                      >
                        {activating === domain.hostname ? 'Aktifleştiriliyor...' : 'Aktif Et'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
