"use client";

import { useState, useEffect } from 'react';
import { Eye, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveViewersProps {
  productId?: string;
  baseCount?: number;
}

export default function LiveViewers({ productId, baseCount = 15 }: LiveViewersProps) {
  const [viewerCount, setViewerCount] = useState(baseCount);
  const [isIncreasing, setIsIncreasing] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        // Rastgele değişim
        const change = Math.floor(Math.random() * 5) - 2; // -2 ile +2 arası
        const newCount = Math.max(baseCount - 5, Math.min(baseCount + 20, prev + change));
        setIsIncreasing(newCount > prev);
        return newCount;
      });
    }, 8000); // Her 8 saniyede bir güncelle

    return () => clearInterval(interval);
  }, [baseCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-full px-4 py-2"
    >
      <div className="relative">
        <Eye className="w-4 h-4 text-orange-600" />
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-900">
        <motion.span
          key={viewerCount}
          initial={{ opacity: 0, y: isIncreasing ? 10 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewerCount}
        </motion.span>
        <span className="text-gray-600 ml-1">kişi bakıyor</span>
      </span>
      {isIncreasing && (
        <TrendingUp className="w-4 h-4 text-green-600 animate-pulse" />
      )}
    </motion.div>
  );
}

export function StockAlert({ stock }: { stock: number }) {
  if (stock > 10) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-2 bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3"
    >
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      <span className="text-sm font-semibold text-red-700">
        {stock > 0
          ? `Son ${stock} ürün! Hemen sipariş verin`
          : 'Stokta kalmadı - Bildirim al'}
      </span>
    </motion.div>
  );
}

export function PopularityBadge({ salesCount }: { salesCount: number }) {
  if (salesCount < 50) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full px-4 py-2 shadow-lg"
    >
      <Users className="w-4 h-4" />
      <span className="text-sm font-bold">
        Çok Satan! {salesCount}+ kişi satın aldı
      </span>
    </motion.div>
  );
}

