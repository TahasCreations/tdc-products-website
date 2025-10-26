"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gift,
  TrendingUp,
  Award,
  Star,
  Coins,
  Crown,
  Sparkles,
  Zap
} from 'lucide-react';

export const LoyaltyDashboard: React.FC = () => {
  const [currentPoints, setCurrentPoints] = useState(3420);
  const [userTier, setUserTier] = useState<'bronze' | 'silver' | 'gold' | 'platinum'>('silver');

  const getTierInfo = () => {
    const tiers = {
      bronze: { name: 'Bronze', color: 'from-orange-500 to-yellow-500', icon: Coins, minPoints: 0, nextTier: 1000 },
      silver: { name: 'Silver', color: 'from-gray-400 to-gray-500', icon: Star, minPoints: 1000, nextTier: 5000 },
      gold: { name: 'Gold', color: 'from-yellow-500 to-orange-500', icon: Award, minPoints: 5000, nextTier: 10000 },
      platinum: { name: 'Platinum', color: 'from-purple-500 to-pink-500', icon: Crown, minPoints: 10000, nextTier: 10000 },
    };
    return tiers[userTier];
  };

  const tierInfo = getTierInfo();
  const progress = ((currentPoints - tierInfo.minPoints) / (tierInfo.nextTier - tierInfo.minPoints)) * 100;

  return (
    <div className="p-6">
      {/* Tier Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <tierInfo.icon className="w-10 h-10" />
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">Mevcut Seviye</div>
              <div className="text-3xl font-bold">{tierInfo.name} Üye</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90 mb-1">Toplam Puanların</div>
            <div className="text-4xl font-bold">{currentPoints.toLocaleString()}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-white rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs mt-2 opacity-90">
            <span>{tierInfo.minPoints.toLocaleString()} puan</span>
            <span>Sonraki seviye: {tierInfo.nextTier.toLocaleString()} puan</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Toplam Puan', value: currentPoints, icon: Coins, color: 'blue' },
          { label: 'Seviye', value: userTier.charAt(0).toUpperCase() + userTier.slice(1), icon: Award, color: 'purple' },
          { label: 'Kazanç Artışı', value: '+15%', icon: TrendingUp, color: 'green' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
              stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
              stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
              'bg-green-100 text-green-600'
            }`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Rewards */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-gray-900">Ödülleri İncele</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: '%10 İndirim', points: 500, icon: Zap },
            { name: 'Bedava Kargo', points: 750, icon: Sparkles },
            { name: '%20 İndirim', points: 1000, icon: Award },
            { name: 'Hediye Ürün', points: 2000, icon: Gift },
          ].map((reward, index) => (
            <button
              key={index}
              className="p-4 border border-gray-200 rounded-xl hover:border-purple-500 transition-all text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <reward.icon className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">{reward.name}</span>
              </div>
              <div className="text-sm text-gray-600">
                {reward.points.toLocaleString()} puan
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

