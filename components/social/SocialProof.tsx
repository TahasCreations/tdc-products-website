"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  ShoppingCart,
  Clock,
  Users
} from 'lucide-react';

interface SocialProofProps {
  productId: string;
}

export const SocialProof: React.FC<SocialProofProps> = () => {
  const [proof, setProof] = React.useState({
    recentPurchases: [
      { name: 'Ahmet Y.', time: '2 dakika önce', location: 'Istanbul' },
      { name: 'Ayşe D.', time: '15 dakika önce', location: 'Ankara' },
      { name: 'Mehmet K.', time: '1 saat önce', location: 'Izmir' },
    ],
    viewers: Math.floor(Math.random() * 50) + 20,
    lastPurchase: '5 dakika önce',
  });

  return (
    <div className="space-y-4">
      {/* Recent Purchases */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingCart className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-900">Son Satın Alımlar</span>
        </div>
        <div className="space-y-2">
          {proof.recentPurchases.map((purchase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-semibold">
                  {purchase.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{purchase.name}</div>
                  <div className="text-xs text-gray-600">{purchase.location}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {purchase.time}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live Viewers */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Şu anda bu ürünü inceliyorlar</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{proof.viewers}</span>
          </div>
        </div>
      </div>

      {/* Stock Alert */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <div>
            <div className="font-semibold text-orange-900">Stok azalıyor!</div>
            <div className="text-sm text-orange-700">Son {proof.lastPurchase} içinde 12 kişi satın aldı</div>
          </div>
        </div>
      </div>
    </div>
  );
};

