'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { approveSeller, rejectSeller } from './approve/actions';

interface SellerProfile {
  id: string;
  storeName: string;
  storeSlug: string;
  description?: string;
  taxNumber?: string;
  iban?: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    email?: string;
  };
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Mock data - gerçek uygulamada API'den gelecek
  useEffect(() => {
    const mockSellers: SellerProfile[] = [
      {
        id: '1',
        storeName: 'Anime Figür Dünyası',
        storeSlug: 'anime-figur-dunyasi',
        description: 'En kaliteli anime figürleri ve koleksiyon ürünleri',
        taxNumber: '1234567890',
        iban: 'TR12 0006 4000 0011 2345 6789 01',
        status: 'pending',
        createdAt: '2024-01-15T10:00:00Z',
        user: {
          id: 'user1',
          name: 'Ahmet Yılmaz',
          email: 'ahmet@example.com'
        }
      },
      {
        id: '2',
        storeName: 'Moda & Aksesuar Mağazası',
        storeSlug: 'moda-aksesuar-magazasi',
        description: 'Trendy moda ürünleri ve aksesuarlar',
        taxNumber: '0987654321',
        iban: 'TR34 0006 4000 0022 3456 7890 12',
        status: 'approved',
        createdAt: '2024-01-10T14:30:00Z',
        user: {
          id: 'user2',
          name: 'Ayşe Demir',
          email: 'ayse@example.com'
        }
      },
      {
        id: '3',
        storeName: 'Elektronik Hub',
        storeSlug: 'elektronik-hub',
        description: 'Teknoloji ürünleri ve elektronik aksesuarlar',
        taxNumber: '1122334455',
        iban: 'TR56 0006 4000 0033 4567 8901 23',
        status: 'rejected',
        createdAt: '2024-01-05T09:15:00Z',
        user: {
          id: 'user3',
          name: 'Mehmet Can',
          email: 'mehmet@example.com'
        }
      }
    ];
    
    setSellers(mockSellers);
    setLoading(false);
  }, []);

  const filteredSellers = sellers.filter(seller => {
    if (filter === 'all') return true;
    return seller.status === filter;
  });

  const handleApprove = async (sellerId: string) => {
    const result = await approveSeller(sellerId);
    if (result.ok) {
      setSellers(prev => prev.map(seller => 
        seller.id === sellerId 
          ? { ...seller, status: 'approved' }
          : seller
      ));
    }
  };

  const handleReject = async (sellerId: string) => {
    const result = await rejectSeller(sellerId);
    if (result.ok) {
      setSellers(prev => prev.map(seller => 
        seller.id === sellerId 
          ? { ...seller, status: 'rejected' }
          : seller
      ));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'approved': return 'Onaylandı';
      case 'rejected': return 'Reddedildi';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Satıcı Yönetimi</h1>
          <p className="text-gray-600">Satıcı başvurularını yönetin ve onaylayın</p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex space-x-1">
            {[
              { key: 'all', label: 'Tümü', count: sellers.length },
              { key: 'pending', label: 'Beklemede', count: sellers.filter(s => s.status === 'pending').length },
              { key: 'approved', label: 'Onaylandı', count: sellers.filter(s => s.status === 'approved').length },
              { key: 'rejected', label: 'Reddedildi', count: sellers.filter(s => s.status === 'rejected').length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Sellers List */}
        <div className="space-y-4">
          {filteredSellers.map((seller) => (
            <motion.div
              key={seller.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {seller.storeName}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(seller.status)}`}>
                      {getStatusText(seller.status)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    @{seller.storeSlug} • {seller.user.name} ({seller.user.email})
                  </p>
                  
                  {seller.description && (
                    <p className="text-gray-700 mb-3">{seller.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    {seller.taxNumber && (
                      <div>
                        <span className="font-medium">VKN/TCKN:</span> {seller.taxNumber}
                      </div>
                    )}
                    {seller.iban && (
                      <div>
                        <span className="font-medium">IBAN:</span> {seller.iban}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Başvuru Tarihi:</span> {new Date(seller.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                </div>

                {seller.status === 'pending' && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleApprove(seller.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Onayla
                    </button>
                    <button
                      onClick={() => handleReject(seller.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Reddet
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSellers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Satıcı bulunamadı</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'Henüz hiç satıcı başvurusu yok.'
                : `${filter === 'pending' ? 'Beklemede' : filter === 'approved' ? 'Onaylanmış' : 'Reddedilmiş'} satıcı bulunamadı.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
