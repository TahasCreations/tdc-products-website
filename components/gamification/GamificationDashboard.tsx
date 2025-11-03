'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, TrendingUp, Gift, Zap } from 'lucide-react';
import { useGamification } from '@/lib/gamification/gamification-engine';
import type { UserGamificationData } from '@/lib/gamification/gamification-engine';

export default function GamificationDashboard() {
  const [data, setData] = useState<UserGamificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const gamification = useGamification();

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    try {
      const response = await fetch('/api/gamification/user-data');
      if (response.ok) {
        const userData = await response.json();
        setData(userData);
      }
    } catch (error) {
      console.error('Failed to fetch gamification data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !data) {
    return <div className="animate-pulse h-64 bg-gray-200 rounded-xl"></div>;
  }

  const currentLevel = gamification.getUserLevel(data.totalPoints);
  const nextLevel = gamification.getNextLevel(data.totalPoints);
  const progress = nextLevel 
    ? ((data.totalPoints - currentLevel.minPoints) / (nextLevel.level.minPoints - currentLevel.minPoints)) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* Level & Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm opacity-80 mb-1">Seviye {currentLevel.level}</div>
              <h2 className="text-4xl font-bold">{currentLevel.name}</h2>
            </div>
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: currentLevel.color }}>
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>{data.totalPoints} puan</span>
              {nextLevel && <span>{nextLevel.level.minPoints} puan (Sonraki seviye)</span>}
            </div>
            <div className="h-4 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap gap-2">
            {currentLevel.benefits.map((benefit, index) => (
              <div key={index} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                ✨ {benefit}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border-2 border-gray-200"
        >
          <Star className="w-8 h-8 text-yellow-500 mb-3" />
          <div className="text-3xl font-bold text-gray-900">{data.totalPoints}</div>
          <div className="text-sm text-gray-600">Toplam Puan</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border-2 border-gray-200"
        >
          <Trophy className="w-8 h-8 text-purple-500 mb-3" />
          <div className="text-3xl font-bold text-gray-900">
            {data.achievements.filter(a => a.isUnlocked).length}
          </div>
          <div className="text-sm text-gray-600">Başarım</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border-2 border-gray-200"
        >
          <Target className="w-8 h-8 text-blue-500 mb-3" />
          <div className="text-3xl font-bold text-gray-900">{data.completedChallenges}</div>
          <div className="text-sm text-gray-600">Tamamlanan Görev</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border-2 border-gray-200"
        >
          <Zap className="w-8 h-8 text-orange-500 mb-3" />
          <div className="text-3xl font-bold text-gray-900">{data.loginStreak}</div>
          <div className="text-sm text-gray-600">Gün Serisi 🔥</div>
        </motion.div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Başarımlar</h3>
          <span className="text-sm text-gray-600">
            {data.achievements.filter(a => a.isUnlocked).length} / {data.achievements.length}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {data.achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl border-2 ${
                achievement.isUnlocked
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-4xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{achievement.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  
                  {achievement.isUnlocked ? (
                    <div className="flex items-center space-x-2 text-sm">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <span className="text-yellow-600 font-medium">+{achievement.points} puan kazandın!</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                          style={{ width: `${Math.min(achievement.progress, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600">
                        {Math.round(achievement.progress)}% tamamlandı
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Active Challenges */}
      {data.activeChallenges.length > 0 && (
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Aktif Görevler</h3>
            <Gift className="w-6 h-6 text-purple-600" />
          </div>

          <div className="space-y-4">
            {data.activeChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">{challenge.title}</h4>
                    <p className="text-sm text-gray-600">{challenge.description}</p>
                  </div>
                  <div className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-bold">
                    +{challenge.reward} puan
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="w-full bg-white rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                        style={{ width: `${(challenge.progress / challenge.requirement.target) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {challenge.progress}/{challenge.requirement.target}
                  </div>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  Süre: {new Date(challenge.expiresAt).toLocaleDateString('tr-TR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

