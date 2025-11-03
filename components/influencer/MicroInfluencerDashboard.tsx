'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Link2, BarChart3, Share2, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface InfluencerStats {
  totalClicks: number;
  totalSales: number;
  totalEarnings: number;
  conversionRate: number;
  activeLinks: number;
  followers: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  commissionRate: number;
}

export default function MicroInfluencerDashboard() {
  const [stats, setStats] = useState<InfluencerStats | null>(null);
  const [affiliateLinks, setAffiliateLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchStats();
    fetchAffiliateLinks();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/micro-influencer/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch influencer stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAffiliateLinks = async () => {
    try {
      const response = await fetch('/api/micro-influencer/links');
      if (response.ok) {
        const data = await response.json();
        setAffiliateLinks(data.links || []);
      }
    } catch (error) {
      console.error('Failed to fetch affiliate links:', error);
    }
  };

  const generateAffiliateLink = async (productId: string) => {
    try {
      const response = await fetch('/api/micro-influencer/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });

      if (response.ok) {
        const data = await response.json();
        navigator.clipboard.writeText(data.affiliateUrl);
        toast.success('Affiliate link kopyalandı! 🔗');
        fetchAffiliateLinks();
      }
    } catch (error) {
      console.error('Failed to generate affiliate link:', error);
      toast.error('Link oluşturulamadı');
    }
  };

  const tierInfo = {
    bronze: { name: 'Bronz', color: '#CD7F32', minFollowers: 1000, commission: 5 },
    silver: { name: 'Gümüş', color: '#C0C0C0', minFollowers: 5000, commission: 7 },
    gold: { name: 'Altın', color: '#FFD700', minFollowers: 10000, commission: 10 },
    platinum: { name: 'Platin', color: '#E5E4E2', minFollowers: 50000, commission: 15 }
  };

  if (isLoading || !stats) {
    return <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
      </div>
    </div>;
  }

  const tier = tierInfo[stats.tier];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-sm opacity-80 mb-1">Micro-Influencer</div>
            <h2 className="text-4xl font-bold">{tier.name} Seviye</h2>
            <p className="text-sm opacity-90 mt-1">%{stats.commissionRate} Komisyon Oranı</p>
          </div>
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ backgroundColor: tier.color }}
          >
            {stats.tier.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <Users className="w-6 h-6 mb-2" />
            <div className="text-2xl font-bold">{stats.followers.toLocaleString()}</div>
            <div className="text-sm opacity-80">Takipçi</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <DollarSign className="w-6 h-6 mb-2" />
            <div className="text-2xl font-bold">{stats.totalEarnings.toLocaleString()} ₺</div>
            <div className="text-sm opacity-80">Toplam Kazanç</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <Link2 className="w-8 h-8 text-blue-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900">{stats.totalClicks}</div>
          <div className="text-sm text-gray-600">Toplam Tıklama</div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900">{stats.totalSales}</div>
          <div className="text-sm text-gray-600">Toplam Satış</div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <BarChart3 className="w-8 h-8 text-purple-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900">{stats.conversionRate}%</div>
          <div className="text-sm text-gray-600">Dönüşüm Oranı</div>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <Link2 className="w-8 h-8 text-orange-600 mb-3" />
          <div className="text-3xl font-bold text-gray-900">{stats.activeLinks}</div>
          <div className="text-sm text-gray-600">Aktif Link</div>
        </div>
      </div>

      {/* Affiliate Links */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">🔗 Affiliate Linklerim</h3>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
            + Yeni Link Oluştur
          </button>
        </div>

        {affiliateLinks.length === 0 ? (
          <div className="text-center py-12">
            <Link2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Henüz affiliate linkin yok</p>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              İlk Linkini Oluştur
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {affiliateLinks.map((link) => (
              <div
                key={link.id}
                className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">{link.productTitle}</h4>
                    <p className="text-sm text-gray-600">{link.url}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(link.url);
                      toast.success('Link kopyalandı!');
                    }}
                    className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-purple-600" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{link.clicks}</div>
                    <div className="text-xs text-gray-600">Tıklama</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{link.sales}</div>
                    <div className="text-xs text-gray-600">Satış</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{link.earnings} ₺</div>
                    <div className="text-xs text-gray-600">Kazanç</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How to Qualify */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Seviye Atlama Kriterleri</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {Object.entries(tierInfo).map(([key, tier]) => (
            <div key={key} className="text-center p-4 bg-white rounded-lg">
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: tier.color }}
              >
                {tier.commission}%
              </div>
              <div className="font-bold text-gray-900">{tier.name}</div>
              <div className="text-sm text-gray-600">{tier.minFollowers.toLocaleString()}+ takipçi</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

