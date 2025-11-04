'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Sparkles,
  Package,
  Truck,
  Star,
  Crown,
  Zap,
  Award,
  ShoppingBag,
  Check,
  Lock
} from 'lucide-react';
import Link from 'next/link';

interface Reward {
  id: string;
  type: string;
  title: string;
  description: string;
  pointsCost: number;
  value: number;
  stock: number;
  imageUrl?: string;
}

interface UserPoints {
  availablePoints: number;
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [points, setPoints] = useState<UserPoints | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rewardsRes, pointsRes] = await Promise.all([
        fetch('/api/points/rewards'),
        fetch('/api/points')
      ]);

      if (rewardsRes.ok) {
        const data = await rewardsRes.json();
        setRewards(data.rewards || mockRewards);
      }

      if (pointsRes.ok) {
        const data = await pointsRes.json();
        setPoints(data.points);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Use mock data for demo
      setRewards(mockRewards);
      setPoints({ availablePoints: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward: Reward) => {
    if (!points || points.availablePoints < reward.pointsCost) {
      alert('Yetersiz puan!');
      return;
    }

    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedeem = async () => {
    if (!selectedReward) return;

    try {
      const response = await fetch('/api/points/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId: selectedReward.id })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`🎉 ${data.message}\nKod: ${data.code}`);
        setShowRedeemModal(false);
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('Redeem failed:', error);
      alert('Bir hata oluştu');
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'FREE_SHIPPING': return <Truck className="w-6 h-6" />;
      case 'GIFT': return <Gift className="w-6 h-6" />;
      case 'CASHBACK': return <ShoppingBag className="w-6 h-6" />;
      case 'VOUCHER': return <Crown className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'FREE_SHIPPING': return 'from-blue-500 to-cyan-500';
      case 'GIFT': return 'from-pink-500 to-rose-500';
      case 'CASHBACK': return 'from-green-500 to-emerald-500';
      case 'VOUCHER': return 'from-purple-500 to-indigo-500';
      default: return 'from-amber-500 to-orange-500';
    }
  };

  const categories = [
    { id: 'all', name: 'Tümü', icon: '🎁' },
    { id: 'CASHBACK', name: 'Para İndirimi', icon: '💰' },
    { id: 'GIFT', name: 'Hediyeler', icon: '🎁' },
    { id: 'FREE_SHIPPING', name: 'Kargo', icon: '🚚' },
    { id: 'VOUCHER', name: 'Özel Ayrıcalıklar', icon: '👑' },
  ];

  const filteredRewards = selectedCategory === 'all'
    ? rewards
    : rewards.filter(r => r.type === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Ödüller Mağazası</h1>
                  <p className="text-white/90">Puanlarınızla harika ödüller kazanın!</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Kullanılabilir Puan</p>
                <p className="text-4xl font-bold text-white">{points?.availablePoints.toLocaleString('tr-TR')}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Rewards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRewards.map((reward, index) => {
            const canAfford = points && points.availablePoints >= reward.pointsCost;
            const isLimited = reward.stock > 0;

            return (
              <motion.div
                key={reward.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${
                  canAfford ? 'border-purple-200 dark:border-purple-800' : 'border-gray-200 dark:border-gray-700 opacity-75'
                }`}
              >
                {/* Reward Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getRewardColor(reward.type)} flex items-center justify-center text-white shadow-lg`}>
                    {getRewardIcon(reward.type)}
                  </div>
                  {isLimited && (
                    <div className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <Zap className="w-3 h-3" />
                      <span>Sınırlı: {reward.stock}</span>
                    </div>
                  )}
                </div>

                {/* Reward Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {reward.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {reward.description}
                </p>

                {/* Value Display */}
                {reward.value > 0 && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                      💵 {reward.value} TL Değerinde
                    </p>
                  </div>
                )}

                {/* Points Cost */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {reward.pointsCost.toLocaleString('tr-TR')}
                    </span>
                  </div>
                  {!canAfford && (
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-sm">
                      <Lock className="w-4 h-4" />
                      <span>Yetersiz puan</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canAfford}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    canAfford
                      ? `bg-gradient-to-r ${getRewardColor(reward.type)} text-white hover:shadow-lg hover:scale-105`
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>{canAfford ? 'Hemen Al' : 'Daha Fazla Puan Gerekli'}</span>
                  {canAfford && <Award className="w-5 h-5" />}
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredRewards.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Bu kategoride ödül bulunmuyor
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Başka kategorilere göz atın!
            </p>
          </div>
        )}

        {/* Redeem Modal */}
        {showRedeemModal && selectedReward && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${getRewardColor(selectedReward.type)} flex items-center justify-center text-white shadow-lg`}>
                  {getRewardIcon(selectedReward.type)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedReward.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedReward.description}
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Maliyet:</span>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 flex items-center space-x-1">
                    <Sparkles className="w-5 h-5" />
                    <span>{selectedReward.pointsCost.toLocaleString('tr-TR')}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-purple-200 dark:border-purple-800">
                  <span className="text-gray-700 dark:text-gray-300">Kalan Puan:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {((points?.availablePoints || 0) - selectedReward.pointsCost).toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={confirmRedeem}
                  className={`flex-1 py-3 px-4 bg-gradient-to-r ${getRewardColor(selectedReward.type)} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2`}
                >
                  <Check className="w-5 h-5" />
                  <span>Onayla</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mock rewards for demo
const mockRewards: Reward[] = [
  {
    id: '1',
    type: 'FREE_SHIPPING',
    title: 'Ücretsiz Kargo',
    description: 'Bir sonraki siparişinizde ücretsiz kargo (Min. 100 TL)',
    pointsCost: 300,
    value: 0,
    stock: -1
  },
  {
    id: '2',
    type: 'CASHBACK',
    title: '5 TL İndirim',
    description: '5 TL değerinde alışveriş indirimi (Min. 100 TL)',
    pointsCost: 500,
    value: 5,
    stock: -1
  },
  {
    id: '3',
    type: 'GIFT',
    title: 'Sürpriz Hediye Ürün',
    description: 'Siparişinize sürpriz aksesuar hediye (Min. 150 TL)',
    pointsCost: 500,
    value: 0,
    stock: -1
  }
];

