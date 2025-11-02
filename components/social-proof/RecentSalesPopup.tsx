"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';

interface Sale {
  id: string;
  productName: string;
  productImage: string;
  location: string;
  timeAgo: string;
  verified: boolean;
}

const SAMPLE_SALES: Sale[] = [
  {
    id: '1',
    productName: 'Premium Anime Figür',
    productImage: '/images/products/sample-1.jpg',
    location: 'İstanbul, Türkiye',
    timeAgo: '2 dakika önce',
    verified: true,
  },
  {
    id: '2',
    productName: 'Limited Edition Koleksiyon',
    productImage: '/images/products/sample-2.jpg',
    location: 'Ankara, Türkiye',
    timeAgo: '5 dakika önce',
    verified: true,
  },
  {
    id: '3',
    productName: 'Action Figure Set',
    productImage: '/images/products/sample-3.jpg',
    location: 'İzmir, Türkiye',
    timeAgo: '8 dakika önce',
    verified: true,
  },
];

export default function RecentSalesPopup() {
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [saleIndex, setSaleIndex] = useState(0);

  useEffect(() => {
    // İlk popup'ı 5 saniye sonra göster
    const initialTimeout = setTimeout(() => {
      showNextSale();
    }, 5000);

    return () => clearTimeout(initialTimeout);
  }, []);

  useEffect(() => {
    if (!currentSale) return;

    setIsVisible(true);

    // 5 saniye göster
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    // 6 saniye sonra kapat
    const closeTimeout = setTimeout(() => {
      setCurrentSale(null);
    }, 6000);

    // 20 saniye sonra bir sonrakini göster
    const nextTimeout = setTimeout(() => {
      showNextSale();
    }, 20000);

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(closeTimeout);
      clearTimeout(nextTimeout);
    };
  }, [currentSale]);

  const showNextSale = () => {
    // Gerçek uygulamada API'den çekilir
    const sale = SAMPLE_SALES[saleIndex % SAMPLE_SALES.length];
    setCurrentSale(sale);
    setSaleIndex(prev => prev + 1);
  };

  return (
    <AnimatePresence>
      {currentSale && isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          className="fixed bottom-6 left-6 z-40 max-w-sm"
        >
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-semibold">Yeni Satış</span>
              </div>
              {currentSale.verified && (
                <span className="text-xs text-white/90">✓ Doğrulandı</span>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 relative bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                  <ShoppingBag className="w-8 h-8 text-gray-400 absolute inset-0 m-auto" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium mb-1 truncate">
                    {currentSale.productName}
                  </p>
                  <div className="flex items-center text-xs text-gray-600 space-x-2">
                    <MapPin className="w-3 h-3" />
                    <span>{currentSale.location}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 space-x-2 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{currentSale.timeAgo}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

