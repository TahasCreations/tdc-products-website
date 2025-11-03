'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, Clock, Gift, Flame } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  reward: number;
  progress: number;
  target: number;
  isCompleted: boolean;
  expiresAt: string;
  icon: string;
}

export default function DailyChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [streak, setStreak] = useState(0);
  const toast = useToast();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/challenges/active');
      if (response.ok) {
        const data = await response.json();
        setChallenges(data.challenges || []);
        setStreak(data.streak || 0);
      }
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    }
  };

  const completedCount = challenges.filter(c => c.isCompleted).length;
  const totalRewards = challenges
    .filter(c => c.isCompleted)
    .reduce((sum, c) => sum + c.reward, 0);

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} gün`;
    }
    
    return `${hours}s ${minutes}dk`;
  };

  return (
    <>
      {/* Floating Challenges Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-40 right-6 z-40 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-2xl p-4 hover:shadow-xl transition-all"
      >
        <div className="relative">
          <Target className="w-6 h-6" />
          {completedCount > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">
              {completedCount}
            </div>
          )}
        </div>
      </motion.button>

      {/* Challenges Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed top-20 right-6 z-50 w-96 max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border-2 border-gray-200"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">🎯 Günlük Görevler</h3>
                  <p className="text-sm opacity-90">Tamamla ve ödül kazan!</p>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Streak */}
              <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Flame className="w-5 h-5" />
                  <span className="font-semibold">Seri: {streak} gün</span>
                </div>
                <div className="text-sm">
                  {completedCount}/{challenges.length} tamamlandı
                </div>
              </div>
            </div>

            {/* Challenges List */}
            <div className="p-6 space-y-4">
              {challenges.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Henüz görev yok</p>
                </div>
              ) : (
                challenges.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border-2 ${
                      challenge.isCompleted
                        ? 'bg-green-50 border-green-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className={`text-3xl ${challenge.isCompleted ? 'grayscale' : ''}`}>
                        {challenge.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900">{challenge.title}</h4>
                            <p className="text-sm text-gray-600">{challenge.description}</p>
                          </div>
                          {challenge.isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <div className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-bold">
                              +{challenge.reward}
                            </div>
                          )}
                        </div>

                        {/* Progress */}
                        {!challenge.isCompleted && (
                          <>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div
                                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all"
                                style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>{challenge.progress}/{challenge.target}</span>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{getTimeRemaining(challenge.expiresAt)}</span>
                              </div>
                            </div>
                          </>
                        )}

                        {challenge.isCompleted && (
                          <div className="text-sm text-green-600 font-medium">
                            ✅ {challenge.reward} puan kazandın!
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}

              {/* Total Rewards */}
              {totalRewards > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl text-center"
                >
                  <Gift className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-lg font-bold">Bugün Kazandın:</div>
                  <div className="text-3xl font-bold">{totalRewards} Puan!</div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

