'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';

interface User {
  id: string;
  email: string;
  name: string;
  level: number;
  experience: number;
  points: number;
  badges: string[];
  achievements: string[];
  streak: number;
  lastActivity: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'shopping' | 'social' | 'engagement' | 'loyalty';
  requirement: {
    type: string;
    value: number;
  };
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: string[];
}

interface LeaderboardEntry {
  id: string;
  name: string;
  level: number;
  points: number;
  rank: number;
}

const GamificationDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'badges' | 'leaderboard'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/gamification?userId=demo-user');
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setAchievements(data.achievements);
        setBadges(data.badges);
        setLeaderboard(data.leaderboard || []);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Gamification data fetch error:', error);
      addToast({
        type: 'error',
        title: 'Hata',
        message: 'Gamification verileri yüklenemedi'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-500';
      case 'rare': return 'text-blue-500';
      case 'epic': return 'text-purple-500';
      case 'legendary': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100';
      case 'rare': return 'bg-blue-100';
      case 'epic': return 'bg-purple-100';
      case 'legendary': return 'bg-yellow-100';
      default: return 'bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'shopping': return 'text-green-600 bg-green-100';
      case 'social': return 'text-blue-600 bg-blue-100';
      case 'engagement': return 'text-purple-600 bg-purple-100';
      case 'loyalty': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateProgressToNextLevel = () => {
    if (!user) return 0;
    const currentLevelExp = user.level * 1000;
    const nextLevelExp = (user.level + 1) * 1000;
    const progress = ((user.experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <i className="ri-error-warning-line text-4xl text-red-500 mb-2"></i>
        <p className="text-gray-600">Gamification verileri yüklenemedi</p>
        <button
          onClick={fetchGamificationData}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <i className="ri-trophy-line text-yellow-500 mr-2"></i>
          Gamification Dashboard
        </h2>
        <div className="flex space-x-2">
          {['overview', 'achievements', 'badges', 'leaderboard'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab === 'overview' && 'Genel Bakış'}
              {tab === 'achievements' && 'Başarılar'}
              {tab === 'badges' && 'Rozetler'}
              {tab === 'leaderboard' && 'Liderlik'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Seviye</p>
                  <p className="text-2xl font-bold">{user.level}</p>
                </div>
                <i className="ri-trophy-line text-3xl text-blue-200"></i>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Puan</p>
                  <p className="text-2xl font-bold">{user.points.toLocaleString()}</p>
                </div>
                <i className="ri-star-line text-3xl text-green-200"></i>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Deneyim</p>
                  <p className="text-2xl font-bold">{user.experience.toLocaleString()}</p>
                </div>
                <i className="ri-flashlight-line text-3xl text-purple-200"></i>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Seri</p>
                  <p className="text-2xl font-bold">{user.streak} gün</p>
                </div>
                <i className="ri-fire-line text-3xl text-orange-200"></i>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Seviye {user.level} → {user.level + 1}</span>
              <span className="text-sm text-gray-500">{user.experience} / {(user.level + 1) * 1000} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${calculateProgressToNextLevel()}%` }}
              ></div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Son Başarılar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.slice(0, 4).map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    user.achievements.includes(achievement.id)
                      ? 'bg-green-50 border-green-500'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <i className={`${achievement.icon} text-xl ${
                      user.achievements.includes(achievement.id) ? 'text-green-600' : 'text-gray-400'
                    }`}></i>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getCategoryColor(achievement.category)}`}>
                        +{achievement.points} puan
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Tüm Başarılar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  user.achievements.includes(achievement.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <i className={`${achievement.icon} text-2xl ${
                    user.achievements.includes(achievement.id) ? 'text-green-600' : 'text-gray-400'
                  }`}></i>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(achievement.category)}`}>
                        {achievement.category}
                      </span>
                      <span className="text-sm font-medium text-blue-600">+{achievement.points}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Rozetler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  user.badges.includes(badge.id)
                    ? `${getRarityBg(badge.rarity)} border-current`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <i className={`${badge.icon} text-2xl ${getRarityColor(badge.rarity)}`}></i>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{badge.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)} bg-current bg-opacity-20`}>
                        {badge.rarity}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Gereksinimler:</p>
                      <ul className="text-xs text-gray-600 mt-1">
                        {badge.requirements.map((req, index) => (
                          <li key={index}>• {req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Liderlik Tablosu</h3>
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  entry.id === user.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' :
                      'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{entry.name}</h4>
                      <p className="text-sm text-gray-600">Seviye {entry.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{entry.points.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">puan</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationDashboard;
