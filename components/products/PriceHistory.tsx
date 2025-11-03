'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Bell, BellOff } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface PricePoint {
  date: string;
  price: number;
}

interface PriceHistoryProps {
  productId: string;
  currentPrice: number;
  className?: string;
}

export default function PriceHistory({ productId, currentPrice, className = '' }: PriceHistoryProps) {
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [isAlertEnabled, setIsAlertEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchPriceHistory();
    checkPriceAlert();
  }, [productId]);

  const fetchPriceHistory = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/price-history`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
      }
    } catch (error) {
      console.error('Failed to fetch price history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPriceAlert = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/price-alert/status`);
      if (response.ok) {
        const data = await response.json();
        setIsAlertEnabled(data.enabled);
      }
    } catch (error) {
      console.error('Failed to check price alert:', error);
    }
  };

  const togglePriceAlert = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/price-alert`, {
        method: isAlertEnabled ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setIsAlertEnabled(!isAlertEnabled);
        toast.success(
          isAlertEnabled 
            ? 'Fiyat bildirimi kapatıldı' 
            : 'Fiyat düşünce haber vereceğiz! 🔔'
        );
      }
    } catch (error) {
      console.error('Failed to toggle price alert:', error);
      toast.error('Bir hata oluştu');
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-48 bg-gray-200 rounded-xl"></div>;
  }

  const lowestPrice = history.length > 0 
    ? Math.min(...history.map(h => h.price))
    : currentPrice;

  const highestPrice = history.length > 0
    ? Math.max(...history.map(h => h.price))
    : currentPrice;

  const priceChange = history.length > 1
    ? ((currentPrice - history[0].price) / history[0].price) * 100
    : 0;

  const isLowestPrice = currentPrice === lowestPrice;
  const savings = highestPrice - currentPrice;

  return (
    <div className={`bg-white rounded-xl border-2 border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">📊 Fiyat Geçmişi</h3>
        <button
          onClick={togglePriceAlert}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isAlertEnabled
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isAlertEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          <span>{isAlertEnabled ? 'Bildirim Aktif' : 'Fiyat Düşünce Haber Ver'}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Current Price */}
        <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">Şu Anki Fiyat</div>
          <div className="text-2xl font-bold text-indigo-600">
            {currentPrice.toLocaleString('tr-TR')} ₺
          </div>
        </div>

        {/* Lowest Price */}
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">En Düşük Fiyat</div>
          <div className="text-2xl font-bold text-green-600">
            {lowestPrice.toLocaleString('tr-TR')} ₺
          </div>
          {isLowestPrice && (
            <div className="text-xs text-green-600 font-medium mt-1">🎉 Şu anda!</div>
          )}
        </div>

        {/* Highest Price */}
        <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">En Yüksek Fiyat</div>
          <div className="text-2xl font-bold text-red-600">
            {highestPrice.toLocaleString('tr-TR')} ₺
          </div>
          {savings > 0 && (
            <div className="text-xs text-green-600 font-medium mt-1">
              {savings.toLocaleString('tr-TR')} ₺ tasarruf
            </div>
          )}
        </div>
      </div>

      {/* Price Trend */}
      {priceChange !== 0 && (
        <div className={`flex items-center justify-center space-x-2 p-3 rounded-lg mb-6 ${
          priceChange < 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {priceChange < 0 ? (
            <TrendingDown className="w-5 h-5" />
          ) : (
            <TrendingUp className="w-5 h-5" />
          )}
          <span className="font-semibold">
            Son 30 günde %{Math.abs(priceChange).toFixed(1)} 
            {priceChange < 0 ? ' düştü 📉' : ' arttı 📈'}
          </span>
        </div>
      )}

      {/* Chart */}
      {history.length > 0 && (
        <div className="relative h-48 border-2 border-gray-200 rounded-xl p-4">
          <svg className="w-full h-full" viewBox="0 0 400 150">
            {/* Grid Lines */}
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1="0"
                y1={i * 37.5}
                x2="400"
                y2={i * 37.5}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4"
              />
            ))}

            {/* Price Line */}
            <polyline
              points={history.map((point, index) => {
                const x = (index / (history.length - 1)) * 380 + 10;
                const y = 140 - ((point.price - lowestPrice) / (highestPrice - lowestPrice)) * 120;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="url(#priceGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Gradient Definition */}
            <defs>
              <linearGradient id="priceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>

            {/* Data Points */}
            {history.map((point, index) => {
              const x = (index / (history.length - 1)) * 380 + 10;
              const y = 140 - ((point.price - lowestPrice) / (highestPrice - lowestPrice)) * 120;
              
              return (
                <g key={index}>
                  <circle cx={x} cy={y} r="4" fill="#8b5cf6" />
                  <title>{`${point.date}: ${point.price.toLocaleString('tr-TR')} ₺`}</title>
                </g>
              );
            })}
          </svg>

          {/* Timeline Labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{history[0]?.date || '30 gün önce'}</span>
            <span>{history[Math.floor(history.length / 2)]?.date || '15 gün önce'}</span>
            <span>{history[history.length - 1]?.date || 'Bugün'}</span>
          </div>
        </div>
      )}

      {/* Info */}
      {isLowestPrice && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-center"
        >
          <div className="text-lg font-bold mb-1">🎉 Fırsat!</div>
          <div className="text-sm">
            Bu ürün şu anda en düşük fiyatında! Kaçırma!
          </div>
        </motion.div>
      )}
    </div>
  );
}

