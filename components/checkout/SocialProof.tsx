"use client";

import { motion } from 'framer-motion';
import { Users, ShoppingBag, TrendingUp, Eye, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SocialProof() {
  const [stats, setStats] = useState({
    activeViewers: 0,
    recentPurchases: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    // Simüle edilmiş istatistikler - gerçek API'den alınabilir
    const interval = setInterval(() => {
      setStats({
        activeViewers: Math.floor(Math.random() * 50) + 20, // 20-70 arası
        recentPurchases: Math.floor(Math.random() * 10) + 5, // 5-15 arası
        totalOrders: Math.floor(Math.random() * 1000) + 5000, // 5000+
      });
    }, 5000);

    // İlk yükleme
    setStats({
      activeViewers: Math.floor(Math.random() * 50) + 20,
      recentPurchases: Math.floor(Math.random() * 10) + 5,
      totalOrders: Math.floor(Math.random() * 1000) + 5000,
    });

    return () => clearInterval(interval);
  }, []);

  const proofs = [
    {
      icon: Eye,
      text: `${stats.activeViewers} kişi şu anda alışveriş yapıyor`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: ShoppingBag,
      text: `Son 24 saatte ${stats.recentPurchases} sipariş verildi`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      icon: TrendingUp,
      text: `${stats.totalOrders.toLocaleString()}+ mutlu müşteri`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className="space-y-3">
      {proofs.map((proof, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15 }}
          className={`flex items-center space-x-3 p-3 ${proof.bgColor} rounded-lg border ${proof.borderColor}`}
        >
          <proof.icon className={`w-5 h-5 ${proof.color}`} />
          <p className="text-sm font-medium text-gray-700">{proof.text}</p>
        </motion.div>
      ))}

      {/* Recent Purchase Notification */}
      <RecentPurchaseNotification />
    </div>
  );
}

function RecentPurchaseNotification() {
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({
    customerName: '',
    product: '',
    time: '',
  });

  useEffect(() => {
    const notifications = [
      { customerName: 'Ahmet K.', product: 'Premium Kulaklık', time: '2 dakika önce' },
      { customerName: 'Zeynep M.', product: 'Akıllı Saat', time: '5 dakika önce' },
      { customerName: 'Mehmet Y.', product: 'Telefon Kılıfı', time: '8 dakika önce' },
      { customerName: 'Ayşe D.', product: 'Powerbank', time: '12 dakika önce' },
      { customerName: 'Can S.', product: 'Bluetooth Hoparlör', time: '15 dakika önce' },
    ];

    const showRandomNotification = () => {
      const random = notifications[Math.floor(Math.random() * notifications.length)];
      setNotification(random);
      setShow(true);

      setTimeout(() => {
        setShow(false);
      }, 5000);
    };

    // İlk bildirimi göster
    setTimeout(showRandomNotification, 3000);

    // Her 15 saniyede bir yeni bildirim
    const interval = setInterval(showRandomNotification, 15000);

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-lg"
    >
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Yeni Sipariş! 🎉</p>
          <p className="text-xs opacity-90 mt-0.5">
            <span className="font-medium">{notification.customerName}</span>
            {' '}{notification.product} satın aldı
          </p>
          <div className="flex items-center space-x-1 mt-1">
            <Clock className="w-3 h-3" />
            <span className="text-xs opacity-75">{notification.time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


