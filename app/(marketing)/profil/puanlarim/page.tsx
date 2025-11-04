'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Trophy,
  TrendingUp,
  Gift,
  Coins,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Zap,
  Target,
  Star,
  Wallet,
  History,
  CreditCard,
  Download
} from 'lucide-react';
import Link from 'next/link';

interface PointsData {
  totalPoints: number;
  availablePoints: number;
  lifetimePoints: number;
  level: number;
  tier: string;
  streakDays: number;
  lastLoginDate: string;
}

interface Task {
  id: string;
  type: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  requirement: number;
  isRepeatable: boolean;
  status?: string;
  progress?: number;
  userTaskId?: string;
  completedAt?: string;
}

interface Withdrawal {
  id: string;
  points: number;
  amount: number;
  status: string;
  method: string;
  createdAt: string;
  processedAt?: string;
}

export default function PointsPage() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'rewards' | 'wallet'>('tasks');
  const [points, setPoints] = useState<PointsData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [iban, setIban] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pointsRes, tasksRes, withdrawalsRes] = await Promise.all([
        fetch('/api/points'),
        fetch('/api/points/tasks'),
        fetch('/api/points/withdraw')
      ]);

      if (pointsRes.ok) {
        const data = await pointsRes.json();
        setPoints(data.points);
      }

      if (tasksRes.ok) {
        const data = await tasksRes.json();
        setTasks(data.tasks);
      }

      if (withdrawalsRes.ok) {
        const data = await withdrawalsRes.json();
        setWithdrawals(data.withdrawals);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/points/tasks/${taskId}/complete`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        // Reload data
        fetchData();
        // Show success notification
        alert(`🎉 ${data.message}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Görev tamamlanamadı');
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
      alert('Bir hata oluştu');
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !iban) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    const pointsAmount = parseInt(withdrawAmount);
    if (pointsAmount < 1000) {
      alert('Minimum 1000 puan gerekli');
      return;
    }

    if (!points || pointsAmount > points.availablePoints) {
      alert('Yetersiz puan');
      return;
    }

    try {
      const response = await fetch('/api/points/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          points: pointsAmount,
          method: 'IBAN',
          accountDetails: { iban }
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message}`);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setIban('');
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('Withdrawal failed:', error);
      alert('Bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header - Puan Özeti */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Puanlarım</h1>
                  <p className="text-white/80">Puan kazan, ödül kazan!</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-white">
                  {points?.availablePoints.toLocaleString('tr-TR')}
                </div>
                <p className="text-white/90 font-medium mt-1">Kullanılabilir Puan</p>
                <p className="text-white/70 text-sm">
                  ≈ {((points?.availablePoints || 0) / 100).toFixed(2)} TL
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <span className="text-white/80 text-sm">Toplam Kazanılan</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {points?.lifetimePoints.toLocaleString('tr-TR')}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-white" />
                  <span className="text-white/80 text-sm">Seviye</span>
                </div>
                <p className="text-2xl font-bold text-white flex items-center space-x-2">
                  <span>Level {points?.level}</span>
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-5 h-5 text-white" />
                  <span className="text-white/80 text-sm">Tier</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {points?.tier}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-white" />
                  <span className="text-white/80 text-sm">Ardışık Giriş</span>
                </div>
                <p className="text-2xl font-bold text-white flex items-center space-x-1">
                  <span>🔥</span>
                  <span>{points?.streakDays || 0} gün</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-lg">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
              activeTab === 'tasks'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Target className="w-5 h-5" />
            <span>Görevler</span>
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
              activeTab === 'rewards'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Gift className="w-5 h-5" />
            <span>Ödüller</span>
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
              activeTab === 'wallet'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span>Cüzdan</span>
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{task.icon}</div>
                    {task.status === 'COMPLETED' ? (
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Tamamlandı</span>
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>+{task.points}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {task.description}
                  </p>

                  {task.status !== 'COMPLETED' && (
                    <button
                      onClick={() => completeTask(task.id)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Tamamla</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'wallet' && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Withdraw Card */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
                    <CreditCard className="w-6 h-6" />
                    <span>Para Çek</span>
                  </h2>
                  <p className="text-white/90 mb-6">
                    Puanlarınızı TL'ye dönüştürün ve hesabınıza çekin
                  </p>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="px-8 py-3 bg-white text-green-600 font-bold rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Çekim Yap
                  </button>
                </div>
              </div>

              {/* Withdrawal History */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <History className="w-5 h-5" />
                  <span>Çekim Geçmişi</span>
                </h3>
                {withdrawals.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Henüz çekim işleminiz bulunmuyor
                  </p>
                ) : (
                  <div className="space-y-3">
                    {withdrawals.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                      >
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {w.amount.toFixed(2)} TL
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {w.points.toLocaleString('tr-TR')} puan
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            w.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                            w.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {w.status === 'COMPLETED' ? '✅ Tamamlandı' :
                             w.status === 'PENDING' ? '⏳ Beklemede' : '❌ Reddedildi'}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(w.createdAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Para Çek
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Çekmek İstediğiniz Puan
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Min. 1000 puan"
                  />
                  {withdrawAmount && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      = {(parseInt(withdrawAmount) / 100).toFixed(2)} TL
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    IBAN Numarası
                  </label>
                  <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="TR00 0000 0000 0000 0000 0000 00"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleWithdraw}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Çek
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

