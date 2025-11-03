"use client";

export const dynamic = 'force-dynamic';

import React, { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Gift, TrendingUp, Award, Zap, Crown } from 'lucide-react';

const TIERS = [
  { name: 'Bronze', min: 0, max: 999, color: 'from-orange-700 to-amber-600', icon: Award },
  { name: 'Silver', min: 1000, max: 4999, color: 'from-gray-400 to-gray-500', icon: Star },
  { name: 'Gold', min: 5000, max: 9999, color: 'from-yellow-400 to-amber-500', icon: Trophy },
  { name: 'Platinum', min: 10000, max: Infinity, color: 'from-purple-500 to-pink-500', icon: Crown },
];

const REWARDS = [
  { id: '1', name: '10% İndirim Kuponu', points: 500, type: 'discount', icon: Gift },
  { id: '2', name: 'Ücretsiz Kargo', points: 200, type: 'shipping', icon: Zap },
  { id: '3', name: '50 TL Hediye Kartı', points: 1000, type: 'giftCard', icon: Trophy },
  { id: '4', name: 'VIP Erken Erişim', points: 2000, type: 'vip', icon: Crown },
];

export default function LoyaltyPage() {
  const [userPoints, setUserPoints] = useState(1250);
  const [userLevel, setUserLevel] = useState('Silver');

  const currentTier = TIERS.find(t => t.name === userLevel) || TIERS[0];
  const nextTier = TIERS[TIERS.findIndex(t => t.name === userLevel) + 1];
  const progressToNext = nextTier 
    ? ((userPoints - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sadakat Programı
          </h1>
          <p className="text-lg text-gray-600">
            Alışveriş yapın, puan kazanın, ödüller alın!
          </p>
        </div>

        {/* Points Card */}
        <div className={`bg-gradient-to-r ${currentTier.color} rounded-3xl p-8 text-white mb-8 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 opacity-10">
            {React.createElement(currentTier.icon, { className: 'w-64 h-64' })}
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/80 text-sm mb-1">Seviyeniz</p>
                <h2 className="text-3xl font-bold">{userLevel}</h2>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm mb-1">Toplam Puanınız</p>
                <h2 className="text-4xl font-bold">{userPoints.toLocaleString()}</h2>
              </div>
            </div>

            {nextTier && (
              <div>
                <div className="flex justify-between text-sm text-white/80 mb-2">
                  <span>Sonraki seviye: {nextTier.name}</span>
                  <span>{nextTier.min - userPoints} puan kaldı</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNext}%` }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tier Benefits */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Award className="w-6 h-6 text-purple-600" />
              <span>Seviye Avantajları</span>
            </h3>
            <div className="space-y-4">
              {TIERS.map((tier, index) => {
                const TierIcon = tier.icon;
                const isUnlocked = userPoints >= tier.min;
                
                return (
                  <div
                    key={tier.name}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      tier.name === userLevel
                        ? 'border-purple-600 bg-purple-50'
                        : isUnlocked
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${tier.color} rounded-full flex items-center justify-center`}>
                          <TierIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{tier.name}</h4>
                          <p className="text-xs text-gray-600">
                            {tier.min.toLocaleString()} - {tier.max === Infinity ? '∞' : tier.max.toLocaleString()} puan
                          </p>
                        </div>
                      </div>
                      {tier.name === userLevel && (
                        <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                          Mevcut
                        </span>
                      )}
                    </div>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm text-gray-700">✓ Her 100₺'de {index + 1}x puan</p>
                      <p className="text-sm text-gray-700">✓ Özel {tier.name} indirimleri</p>
                      {index >= 2 && <p className="text-sm text-gray-700">✓ Ücretsiz kargo</p>}
                      {index >= 3 && <p className="text-sm text-gray-700">✓ VIP destek hattı</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Gift className="w-6 h-6 text-purple-600" />
              <span>Ödüller</span>
            </h3>
            <div className="space-y-4">
              {REWARDS.map((reward) => {
                const RewardIcon = reward.icon;
                const canRedeem = userPoints >= reward.points;
                
                return (
                  <div
                    key={reward.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      canRedeem
                        ? 'border-green-200 bg-green-50 hover:border-green-300'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          canRedeem ? 'bg-green-100' : 'bg-gray-200'
                        }`}>
                          <RewardIcon className={`w-5 h-5 ${canRedeem ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                          <p className="text-sm text-gray-600">{reward.points} puan</p>
                        </div>
                      </div>
                    </div>
                    <button
                      disabled={!canRedeem}
                      className={`w-full px-4 py-2 rounded-xl font-semibold transition-all ${
                        canRedeem
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {canRedeem ? 'Kullan' : `${reward.points - userPoints} puan daha gerekli`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* How to Earn Points */}
        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">Nasıl Puan Kazanırım?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h4 className="font-bold mb-2">Alışveriş Yapın</h4>
              <p className="text-sm text-white/80">Her 10₺'lik alışverişte 1 puan kazanın</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h4 className="font-bold mb-2">Yorum Yapın</h4>
              <p className="text-sm text-white/80">Her yorum için 50 puan kazanın</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8" />
              </div>
              <h4 className="font-bold mb-2">Arkadaş Davet Edin</h4>
              <p className="text-sm text-white/80">Her davet için 200 puan kazanın</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

