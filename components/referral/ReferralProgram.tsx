'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Share2, Users, TrendingUp, Award } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  pendingRewards: number;
  earnedRewards: number;
  conversionRate: number;
}

export default function ReferralProgram() {
  const [stats, setStats] = useState<ReferralStats>({
    referralCode: '',
    totalReferrals: 0,
    pendingRewards: 0,
    earnedRewards: 0,
    conversionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    try {
      const response = await fetch('/api/referral/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch referral stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(stats.referralCode);
    toast.success('Referans kodunuz kopyalandı! 📋');
  };

  const handleShare = async (platform: 'whatsapp' | 'twitter' | 'facebook' | 'email') => {
    const shareText = `TDC Market'e katıl ve ${stats.referralCode} kodumu kullan! İkimiz de 50₺ kazanalım! 🎁`;
    const shareUrl = `${window.location.origin}?ref=${stats.referralCode}`;

    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      email: `mailto:?subject=TDC Market'e Katıl&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
    toast.info(`${platform} ile paylaşılıyor...`);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-48 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <Gift className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Arkadaşını Getir, İkiniz de Kazanın!</h2>
          </div>
          
          <p className="text-lg mb-6 opacity-90">
            Her arkadaşın ilk alışverişinde <strong>50₺</strong> kazan, arkadaşın da <strong>50₺</strong> kazansın!
          </p>

          {/* Referral Code */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80 mb-1">Senin Referans Kodun</div>
              <div className="text-2xl font-bold tracking-wider">{stats.referralCode}</div>
            </div>
            <button
              onClick={handleCopyCode}
              className="p-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>

          {/* Share Buttons */}
          <div className="mt-6 grid grid-cols-4 gap-3">
            <button
              onClick={() => handleShare('whatsapp')}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all flex flex-col items-center space-y-1"
            >
              <span className="text-2xl">💬</span>
              <span className="text-xs">WhatsApp</span>
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all flex flex-col items-center space-y-1"
            >
              <span className="text-2xl">🐦</span>
              <span className="text-xs">Twitter</span>
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all flex flex-col items-center space-y-1"
            >
              <span className="text-2xl">📘</span>
              <span className="text-xs">Facebook</span>
            </button>
            <button
              onClick={() => handleShare('email')}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all flex flex-col items-center space-y-1"
            >
              <span className="text-2xl">📧</span>
              <span className="text-xs">Email</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Total Referrals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border-2 border-gray-200"
        >
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{stats.totalReferrals}</div>
              <div className="text-sm text-gray-600">Toplam Davet</div>
            </div>
          </div>
        </motion.div>

        {/* Pending Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border-2 border-gray-200"
        >
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 text-yellow-600" />
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{stats.pendingRewards}₺</div>
              <div className="text-sm text-gray-600">Bekleyen Ödül</div>
            </div>
          </div>
        </motion.div>

        {/* Earned Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border-2 border-gray-200"
        >
          <div className="flex items-center justify-between mb-3">
            <Award className="w-8 h-8 text-green-600" />
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{stats.earnedRewards}₺</div>
              <div className="text-sm text-gray-600">Kazandığın</div>
            </div>
          </div>
        </motion.div>

        {/* Conversion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border-2 border-gray-200"
        >
          <div className="flex items-center justify-between mb-3">
            <Share2 className="w-8 h-8 text-purple-600" />
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{stats.conversionRate}%</div>
              <div className="text-sm text-gray-600">Dönüşüm Oranı</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl p-8 border-2 border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Nasıl Çalışır?</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">1️⃣</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Kodunu Paylaş</h4>
            <p className="text-sm text-gray-600">
              Arkadaşlarınla referans kodunu paylaş (WhatsApp, sosyal medya)
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">2️⃣</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Arkadaşın Alışveriş Yapsın</h4>
            <p className="text-sm text-gray-600">
              Arkadaşın senin kodunla kayıt olup ilk alışverişini yapsın
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">3️⃣</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">İkiniz de Kazanın!</h4>
            <p className="text-sm text-gray-600">
              Sen 50₺, arkadaşın 50₺ bonus kazansın. Sınırsız!
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard Teaser */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-1">🏆 Aylık Lider Tablosu</h4>
            <p className="text-sm text-gray-600">
              En çok davet eden 10 kişiye ekstra 500₺ hediye!
            </p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
            Sıralamayı Gör
          </button>
        </div>
      </div>
    </div>
  );
}

