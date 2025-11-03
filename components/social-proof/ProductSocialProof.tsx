'use client';

import { useState, useEffect } from 'react';
import { Eye, ShoppingCart, TrendingUp, Fire } from 'lucide-react';

interface ProductSocialProofProps {
  productId: string;
  className?: string;
}

export default function ProductSocialProof({ productId, className = '' }: ProductSocialProofProps) {
  const [stats, setStats] = useState({
    currentViewers: 0,
    cartAdds: 0,
    recentPurchases: 0,
    trending: false
  });

  useEffect(() => {
    fetchProductStats();

    // Update every 30 seconds
    const interval = setInterval(() => {
      fetchProductStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [productId]);

  const fetchProductStats = async () => {
    try {
      const response = await fetch(`/api/social-proof/product/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch product stats:', error);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Current Viewers */}
      {stats.currentViewers > 0 && (
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full">
            <Eye className="w-4 h-4" />
            <span className="font-medium">
              {stats.currentViewers} kişi şu anda bu ürüne bakıyor
            </span>
          </div>
        </div>
      )}

      {/* Cart Adds */}
      {stats.cartAdds > 0 && (
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full">
            <ShoppingCart className="w-4 h-4" />
            <span className="font-medium">
              Son 24 saatte {stats.cartAdds} kişi sepetine ekledi
            </span>
          </div>
        </div>
      )}

      {/* Recent Purchases */}
      {stats.recentPurchases > 0 && (
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-full">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">
              Son 1 saatte {stats.recentPurchases} adet satıldı
            </span>
          </div>
        </div>
      )}

      {/* Trending */}
      {stats.trending && (
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full animate-pulse">
            <Fire className="w-4 h-4" />
            <span className="font-bold">
              🔥 Trend Ürün - Çok Satan!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

