"use client";

import { useState, useEffect } from 'react';
import { requireInfluencerApproved } from '@/lib/guards';
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
          productTitle: 'Gaming Headset',
          sellerName: 'GameGear',
          agreedPrice: 800,
          status: 'DELIVERED',
          createdAt: '2024-01-12T14:30:00Z'
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
      case 'REQUESTED': return 'Beklemede';
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
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl p-8 border border-white/50 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">+2</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Toplam İşbirlik</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.totalCollabs || 0}</p>
              <p className="text-xs text-purple-500">Bu ay artış</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl p-8 border border-white/50 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">Aktif</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Aktif İşbirlikler</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.activeCollabs || 0}</p>
              <p className="text-xs text-green-500">Devam ediyor</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl p-8 border border-white/50 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">₺{stats?.pendingEarnings?.toLocaleString() || 0}</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Bekleyen Ödeme</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">₺{stats?.totalEarnings?.toLocaleString() || 0}</p>
              <p className="text-xs text-blue-500">Toplam kazanç</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl p-8 border border-white/50 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">4.8★</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Müşteri Puanı</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.completedCollabs || 0}</p>
              <p className="text-xs text-orange-500">Tamamlanan iş</p>
            </div>
          </motion.div>
        </div>

        {/* Son İşbirlikler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/50"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Son İşbirlikler</h2>
          <div className="space-y-4">
            {recentCollabs.map((collab, index) => (
              <motion.div
                key={collab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📦</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{collab.productTitle}</h3>
                    <p className="text-sm text-gray-600">{collab.sellerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₺{collab.agreedPrice.toLocaleString()}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(collab.status)}`}>
                    {getStatusText(collab.status)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
