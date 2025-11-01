"use client";

import { motion } from 'framer-motion';
import { Package, AlertTriangle, Clock, TrendingUp, Zap } from 'lucide-react';

interface StockIndicatorProps {
  stock: number;
  soldCount?: number;
  isPopular?: boolean;
  showUrgency?: boolean;
}

export default function StockIndicator({ 
  stock, 
  soldCount = 0,
  isPopular = false,
  showUrgency = true 
}: StockIndicatorProps) {
  // Stok durumuna göre renk ve mesaj
  const getStockStatus = () => {
    if (stock === 0) {
      return {
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        textColor: 'text-red-700',
        message: 'Tükendi',
        icon: AlertTriangle,
        urgency: 'high',
      };
    }
    
    if (stock <= 5) {
      return {
        color: 'orange',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300',
        textColor: 'text-orange-700',
        message: `Son ${stock} adet!`,
        icon: AlertTriangle,
        urgency: 'high',
      };
    }
    
    if (stock <= 10) {
      return {
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-300',
        textColor: 'text-yellow-700',
        message: `Stokta ${stock} adet`,
        icon: Package,
        urgency: 'medium',
      };
    }
    
    return {
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-700',
      message: 'Stokta',
      icon: Package,
      urgency: 'low',
    };
  };

  const status = getStockStatus();
  const Icon = status.icon;
  
  // Stok doluluk yüzdesi (maksimum 100 kabul edilerek)
  const stockPercentage = Math.min((stock / 100) * 100, 100);

  return (
    <div className="space-y-3">
      {/* Stok Durumu Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border-2 ${status.bgColor} ${status.borderColor}`}
      >
        <Icon className={`w-4 h-4 ${status.textColor}`} />
        <span className={`text-sm font-semibold ${status.textColor}`}>
          {status.message}
        </span>
      </motion.div>

      {/* Stok Göstergesi Bar (sadece düşük stokta) */}
      {stock > 0 && stock <= 20 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Stok Durumu</span>
            <span className="font-semibold">{stock} adet</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stockPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full ${
                stock <= 5 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                stock <= 10 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}
            />
          </div>
        </div>
      )}

      {/* Popülerlik Rozeti */}
      {isPopular && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-xs font-bold"
        >
          <TrendingUp className="w-3 h-3" />
          <span>ÇOK SATAN</span>
          <Zap className="w-3 h-3" />
        </motion.div>
      )}

      {/* Son Satış Bilgisi */}
      {soldCount > 0 && showUrgency && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2 text-xs text-gray-600"
        >
          <Clock className="w-3 h-3" />
          <span>Son 24 saatte <span className="font-bold text-[#CBA135]">{soldCount} kişi</span> satın aldı</span>
        </motion.div>
      )}

      {/* Aciliyet Mesajı */}
      {status.urgency === 'high' && showUrgency && stock > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg shadow-lg"
        >
          <p className="text-sm font-bold flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 animate-pulse" />
            Acele Edin! Stok Tükenmek Üzere
          </p>
          <p className="text-xs mt-1 opacity-90">
            ⚡ Bu ürün çok talep görüyor, hemen sipariş verin!
          </p>
        </motion.div>
      )}

      {/* Hızlı Teslimat */}
      {stock > 0 && (
        <div className="flex items-center space-x-2 text-xs text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
          <Zap className="w-3 h-3 text-blue-600" />
          <span>
            <span className="font-semibold text-blue-700">Bugün sipariş verin</span>
            {' '}yarın kargoda! 🚀
          </span>
        </div>
      )}
    </div>
  );
}


