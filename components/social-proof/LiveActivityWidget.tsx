'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Eye, Heart, TrendingUp } from 'lucide-react';

interface ActivityData {
  type: 'purchase' | 'view' | 'cart' | 'wishlist';
  user: string;
  product: string;
  location: string;
  time: string;
}

export default function LiveActivityWidget() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [currentActivity, setCurrentActivity] = useState<ActivityData | null>(null);
  const [stats, setStats] = useState({
    activeBuyers: 0,
    todayOrders: 0,
    currentViewers: 0
  });

  useEffect(() => {
    // Fetch initial stats
    fetchStats();

    // Simulate live activities
    const interval = setInterval(() => {
      generateActivity();
    }, 8000); // Every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/social-proof/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const generateActivity = () => {
    const types: ActivityData['type'][] = ['purchase', 'view', 'cart', 'wishlist'];
    const users = ['Ahmet B.', 'Ayşe K.', 'Mehmet Y.', 'Zeynep D.', 'Ali T.', 'Fatma S.'];
    const products = [
      'Naruto Figürü',
      'Anime Poster',
      'Gaming Mouse',
      'Bluetooth Kulaklık',
      'LED Strip',
      'Mekanik Klavye'
    ];
    const locations = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana'];

    const activity: ActivityData = {
      type: types[Math.floor(Math.random() * types.length)],
      user: users[Math.floor(Math.random() * users.length)],
      product: products[Math.floor(Math.random() * products.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      time: 'Az önce'
    };

    setCurrentActivity(activity);
    setActivities(prev => [activity, ...prev].slice(0, 5));

    // Clear after 5 seconds
    setTimeout(() => {
      setCurrentActivity(null);
    }, 5000);
  };

  const getActivityIcon = (type: ActivityData['type']) => {
    switch (type) {
      case 'purchase':
        return <ShoppingBag className="w-4 h-4" />;
      case 'view':
        return <Eye className="w-4 h-4" />;
      case 'cart':
        return <ShoppingBag className="w-4 h-4" />;
      case 'wishlist':
        return <Heart className="w-4 h-4" />;
    }
  };

  const getActivityText = (activity: ActivityData) => {
    switch (activity.type) {
      case 'purchase':
        return `${activity.user} ${activity.product} ürününü satın aldı`;
      case 'view':
        return `${activity.user} ${activity.product} ürününü inceliyor`;
      case 'cart':
        return `${activity.user} sepetine ${activity.product} ekledi`;
      case 'wishlist':
        return `${activity.user} ${activity.product} ürününü favoriledi`;
    }
  };

  const getActivityColor = (type: ActivityData['type']) => {
    switch (type) {
      case 'purchase':
        return 'from-green-500 to-emerald-500';
      case 'view':
        return 'from-blue-500 to-cyan-500';
      case 'cart':
        return 'from-purple-500 to-pink-500';
      case 'wishlist':
        return 'from-red-500 to-pink-500';
    }
  };

  return (
    <>
      {/* Floating Activity Notification */}
      <AnimatePresence>
        {currentActivity && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: -50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -50, x: -50 }}
            className="fixed bottom-24 left-6 z-40 max-w-sm"
          >
            <div className={`bg-gradient-to-r ${getActivityColor(currentActivity.type)} p-4 rounded-xl shadow-2xl text-white`}>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  {getActivityIcon(currentActivity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {getActivityText(currentActivity)}
                  </p>
                  <p className="text-xs opacity-80 mt-1">
                    {currentActivity.location} • {currentActivity.time}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Stats Bar */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span><strong>{stats.currentViewers}</strong> kişi şu anda alışveriş yapıyor</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Bugün <strong>{stats.todayOrders}</strong> sipariş verildi</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span><strong>{stats.activeBuyers}</strong> aktif alıcı</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

