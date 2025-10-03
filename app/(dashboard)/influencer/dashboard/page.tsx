"use client";

import { useState, useEffect } from 'react';
import { requireInfluencerApproved } from '@/src/lib/guards';
import { motion } from 'framer-motion';

interface InfluencerStats {
  totalCollabs: number;
  activeCollabs: number;
  completedCollabs: number;
  totalEarnings: number;
  pendingEarnings: number;
}

interface RecentCollab {
  id: string;
  productTitle: string;
  sellerName: string;
  agreedPrice: number;
  status: string;
  createdAt: string;
}

export default function InfluencerDashboardPage() {
  const [stats, setStats] = useState<InfluencerStats | null>(null);
  const [recentCollabs, setRecentCollabs] = useState<RecentCollab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - gerçek uygulamada API'den gelecek
      setStats({
        totalCollabs: 12,
        activeCollabs: 3,
        completedCollabs: 8,
        totalEarnings: 15750,
        pendingEarnings: 2250
      });

      setRecentCollabs([
        {
          id: 'collab1',
          productTitle: 'Akıllı Saat Pro',
          sellerName: 'TechStore',
          agreedPrice: 1500,
          status: 'ACTIVE',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 'collab2',
          productTitle: 'Kablosuz Kulaklık',
          sellerName: 'AudioTech',
          agreedPrice: 800,
          status: 'DELIVERED',
          createdAt: '2024-01-10T14:30:00Z'
        },
        {
          id: 'collab3',
          productTitle: 'Gaming Mouse',
          sellerName: 'GameGear',
          agreedPrice: 1200,
          status: 'PENDING_PAYMENT',
          createdAt: '2024-01-08T09:15:00Z'
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REQUESTED': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING_PAYMENT': return 'bg-blue-100 text-blue-800';
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'DELIVERED': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'REQUESTED': return 'Talep Edildi';
      case 'PENDING_PAYMENT': return 'Ödeme Bekliyor';
      case 'ACTIVE': return 'Aktif';
      case 'DELIVERED': return 'Teslim Edildi';
      case 'COMPLETED': return 'Tamamlandı';
      case 'CANCELED': return 'İptal Edildi';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-3">
                Influencer Paneli
              </h1>
              <p className="text-xl text-gray-600">
                İşbirliklerinizi yönetin ve <span className="font-semibold text-purple-600">kazançlarınızı</span> takip edin.
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Fiyatlarımı Güncelle
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                Profil Düzenle
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam İşbirliği</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalCollabs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aktif İşbirliği</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.activeCollabs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Kazanç</p>
              <p className="text-2xl font-semibold text-gray-900">₺{stats?.totalEarnings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bekleyen Ödeme</p>
              <p className="text-2xl font-semibold text-gray-900">₺{stats?.pendingEarnings.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Son İşbirlikleri */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Son İşbirlikleri</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentCollabs.map((collab) => (
            <div key={collab.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{collab.productTitle}</h3>
                  <p className="text-sm text-gray-500">Satıcı: {collab.sellerName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(collab.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₺{collab.agreedPrice.toLocaleString()}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(collab.status)}`}>
                      {getStatusText(collab.status)}
                    </span>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    Detaylar →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
