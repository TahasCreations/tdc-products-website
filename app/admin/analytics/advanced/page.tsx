"use client";

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, ShoppingCart, Eye, MousePointerClick } from 'lucide-react';

export default function AdvancedAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Gelişmiş Analitik Dashboard
        </h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Toplam Ziyaretçi', value: '12,547', change: '+12%', icon: Users, color: 'blue' },
            { label: 'Dönüşüm Oranı', value: '%3.2', change: '+0.8%', icon: TrendingUp, color: 'green' },
            { label: 'Ortalama Sepet', value: '₺458', change: '+₺23', icon: ShoppingCart, color: 'purple' },
            { label: 'Sayfa Görüntüleme', value: '45,234', change: '+8%', icon: Eye, color: 'orange' },
          ].map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${metric.color}-100 rounded-full flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                  </div>
                  <span className="text-sm font-semibold text-green-600">{metric.change}</span>
                </div>
                <p className="text-gray-600 text-sm mb-1">{metric.label}</p>
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Satış Trendi (Son 30 Gün)
            </h3>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-24 h-24 text-gray-300" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              En Çok Tıklanan Ürünler
            </h3>
            <div className="space-y-3">
              {['Anime Figür Set', 'Limited Edition', 'Premium Collection'].map((product, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold">{product}</span>
                  <span className="text-purple-600 font-bold">{234 - i * 30} tıklama</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap Placeholder */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Kullanıcı Etkileşim Haritası (Heatmap)
          </h3>
          <div className="h-96 bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 rounded-xl flex items-center justify-center">
            <MousePointerClick className="w-32 h-32 text-gray-300" />
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Microsoft Clarity veya Hotjar entegrasyonu için hazır
          </p>
        </div>
      </div>
    </div>
  );
}

