"use client";

import { motion } from 'framer-motion';
import {
  Heart, Users, DollarSign, TrendingUp, Target, Star,
  MessageSquare, Eye, Share2, Award, ArrowUp, Sparkles,
  Instagram, CheckCircle2, Clock
} from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  collaborations: number;
  earnings: number;
  followers: number;
  platform: string;
  name: string;
  rating: number;
}

interface InfluencerDashboardContentProps {
  data: DashboardData;
}

export default function InfluencerDashboardContent({ data }: InfluencerDashboardContentProps) {
  const kpiCards = [
    {
      label: 'Toplam İş Birliği',
      value: data.collaborations,
      change: '+8%',
      trend: 'up',
      icon: Heart,
      color: 'from-pink-600 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50',
    },
    {
      label: 'Toplam Kazanç',
      value: `₺${data.earnings.toLocaleString('tr-TR')}`,
      change: '+32%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
    },
    {
      label: 'Takipçi Sayısı',
      value: `${(data.followers / 1000).toFixed(1)}K`,
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
    },
    {
      label: 'Performans Puanı',
      value: data.rating.toFixed(1),
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'from-yellow-600 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
    },
  ];

  const activeCampaigns = [
    { id: '1', brand: 'Nike', product: 'Air Max 2024', commission: 2500, deadline: '5 gün', status: 'active' },
    { id: '2', brand: 'Apple', product: 'iPhone 15 Pro', commission: 3200, deadline: '12 gün', status: 'active' },
    { id: '3', brand: 'Adidas', product: 'Ultraboost', commission: 1800, deadline: '3 gün', status: 'urgent' },
  ];

  const recentEarnings = [
    { campaign: 'Nike Air Max Kampanyası', amount: 2500, date: '2 gün önce', status: 'completed' },
    { campaign: 'Apple iPhone Tanıtımı', amount: 3200, date: '5 gün önce', status: 'completed' },
    { campaign: 'Samsung Galaxy Lansman', amount: 2800, date: '1 hafta önce', status: 'pending' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Influencer Paneli
            </h1>
            <p className="text-gray-600 mt-1">
              Hoş geldiniz, <span className="font-semibold text-pink-600">{data.name}</span>!
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold flex items-center space-x-2">
              <Instagram className="w-4 h-4" />
              <span>{data.platform}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-gradient-to-br ${card.bgColor}`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-sm font-semibold text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  <span>{card.change}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-1">{card.label}</p>
              <p className="text-3xl font-black text-gray-900">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl border-2 border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Aktif Kampanyalar</h2>
            <Link
              href="/partner/influencer/campaigns"
              className="text-sm text-pink-600 hover:text-pink-700 font-semibold"
            >
              Tümünü Gör →
            </Link>
          </div>

          <div className="space-y-3">
            {activeCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  campaign.status === 'urgent'
                    ? 'border-red-200 bg-red-50 hover:border-red-300'
                    : 'border-gray-100 bg-gray-50 hover:border-pink-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-900">{campaign.brand}</p>
                    <p className="text-sm text-gray-600">{campaign.product}</p>
                  </div>
                  {campaign.status === 'urgent' && (
                    <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full font-bold">
                      ACİL!
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{campaign.deadline} kaldı</span>
                  </div>
                  <p className="font-bold text-green-600">
                    +₺{campaign.commission.toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border-2 border-gray-100 p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Son Kazançlar</h2>
          </div>

          <div className="space-y-3">
            {recentEarnings.map((earning, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900 text-sm mb-1">{earning.campaign}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{earning.date}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-green-600">
                      ₺{earning.amount.toLocaleString('tr-TR')}
                    </span>
                    {earning.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/partner/influencer/earnings"
            className="mt-4 w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <DollarSign className="w-4 h-4" />
            <span>Tüm Kazançlar</span>
          </Link>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Link
          href="/partner/influencer/campaigns"
          className="p-6 bg-gradient-to-br from-pink-600 to-rose-600 text-white rounded-2xl hover:shadow-xl transition-all group"
        >
          <Target className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-bold">Yeni Kampanya</p>
          <p className="text-sm text-white/80">Fırsatları keşfet</p>
        </Link>

        <Link
          href="/partner/influencer/performance"
          className="p-6 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-2xl hover:shadow-xl transition-all group"
        >
          <TrendingUp className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-bold">Performans</p>
          <p className="text-sm text-white/80">İstatistikleri gör</p>
        </Link>

        <Link
          href="/partner/influencer/content"
          className="p-6 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl hover:shadow-xl transition-all group"
        >
          <Share2 className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-bold">İçerikler</p>
          <p className="text-sm text-white/80">Paylaş ve kazan</p>
        </Link>

        <Link
          href="/partner/influencer/collaborations"
          className="p-6 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-xl transition-all group"
        >
          <Heart className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-bold">İş Birlikleri</p>
          <p className="text-sm text-white/80">Markalarla çalış</p>
        </Link>
      </motion.div>
    </div>
  );
}


