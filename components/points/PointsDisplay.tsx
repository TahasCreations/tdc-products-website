'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Award, Star } from 'lucide-react';
import Link from 'next/link';

interface PointsData {
  totalPoints: number;
  availablePoints: number;
  lifetimePoints: number;
  level: number;
  tier: string;
  streakDays: number;
}

export default function PointsDisplay() {
  const [points, setPoints] = useState<PointsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [animatePoints, setAnimatePoints] = useState(false);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      const response = await fetch('/api/points');
      if (response.ok) {
        const data = await response.json();
        setPoints(data.points);
        setAnimatePoints(true);
        setTimeout(() => setAnimatePoints(false), 1000);
      } else if (response.status === 401) {
        // Not authenticated - don't show points
        setPoints(null);
      } else {
        // Other error - don't show points
        console.error('Failed to fetch points:', response.status);
        setPoints(null);
      }
    } catch (error) {
      console.error('Failed to fetch points:', error);
      setPoints(null);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything while loading or if points unavailable
  if (loading || !points) {
    return null;
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'PLATINUM': return 'from-purple-500 to-pink-500';
      case 'GOLD': return 'from-yellow-500 to-amber-500';
      case 'SILVER': return 'from-gray-400 to-gray-500';
      default: return 'from-amber-600 to-orange-600';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'PLATINUM': return '💎';
      case 'GOLD': return '👑';
      case 'SILVER': return '⭐';
      default: return '🥉';
    }
  };

  return (
    <div className="relative">
      <Link href="/profil/puanlarim">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-amber-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-800 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full" 
            style={{ transition: 'transform 1s' }}
          />

          {/* Tier Badge */}
          <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${getTierColor(points.tier)} shadow-lg`}>
            <span className="text-lg">{getTierIcon(points.tier)}</span>
          </div>

          {/* Points Display */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <motion.span
                key={points.availablePoints}
                initial={{ scale: animatePoints ? 1.5 : 1, color: animatePoints ? '#f59e0b' : '#000' }}
                animate={{ scale: 1, color: '#000' }}
                className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400"
              >
                {points.availablePoints.toLocaleString('tr-TR')}
              </motion.span>
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>
            <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium -mt-1">
              Puan
            </span>
          </div>

          {/* Level Badge */}
          {points.level > 1 && (
            <div className="flex items-center space-x-1 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <Award className="w-3 h-3 text-white" />
              <span className="text-xs font-bold text-white">Lv.{points.level}</span>
            </div>
          )}

          {/* Streak Indicator */}
          {points.streakDays > 0 && (
            <div className="flex items-center space-x-1 px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
              <span className="text-xs">🔥</span>
              <span className="text-xs font-bold text-white">{points.streakDays}</span>
            </div>
          )}
        </motion.div>
      </Link>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 right-0 z-50 w-64 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-amber-200 dark:border-amber-800"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Puan Özeti</span>
                </h4>
                <span className={`px-2 py-0.5 bg-gradient-to-r ${getTierColor(points.tier)} rounded-full text-xs font-bold text-white`}>
                  {points.tier}
                </span>
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Kullanılabilir:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {points.availablePoints.toLocaleString('tr-TR')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Toplam Kazanılan:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {points.lifetimePoints.toLocaleString('tr-TR')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Seviye:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>Level {points.level}</span>
                  </span>
                </div>
                {points.streakDays > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Ardışık Giriş:</span>
                    <span className="font-bold text-red-600 dark:text-red-400 flex items-center space-x-1">
                      <span>🔥</span>
                      <span>{points.streakDays} gün</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Value */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Değer:</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    ≈ {(points.availablePoints / 100).toFixed(2)} TL
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/profil/puanlarim"
                className="block w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Puanlarımı Yönet
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

