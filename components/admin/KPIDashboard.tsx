'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { trackEvent, AnalyticsEvent } from '../../lib/analytics/events';

interface KPIMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export default function KPIDashboard() {
  const [metrics, setMetrics] = useState<KPIMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadKPIData();
  }, [timeRange]);

  const loadKPIData = async () => {
    try {
      setLoading(true);
      
      // Mock KPI data
      const mockMetrics: KPIMetric[] = [
        {
          id: 'gmv',
          title: 'Toplam Satış (GMV)',
          value: '₺2,450,000',
          change: 12.5,
          changeType: 'positive',
          icon: '💰',
          color: 'text-green-600',
        },
        {
          id: 'revenue',
          title: 'Net Gelir',
          value: '₺245,000',
          change: 8.3,
          changeType: 'positive',
          icon: '📈',
          color: 'text-blue-600',
        },
        {
          id: 'orders',
          title: 'Toplam Sipariş',
          value: '1,234',
          change: 15.2,
          changeType: 'positive',
          icon: '📦',
          color: 'text-purple-600',
        },
        {
          id: 'aov',
          title: 'Ortalama Sipariş Değeri',
          value: '₺1,985',
          change: -2.1,
          changeType: 'negative',
          icon: '💳',
          color: 'text-orange-600',
        },
        {
          id: 'cvr',
          title: 'Dönüşüm Oranı',
          value: '3.2%',
          change: 0.5,
          changeType: 'positive',
          icon: '🎯',
          color: 'text-indigo-600',
        },
        {
          id: 'customers',
          title: 'Aktif Müşteri',
          value: '8,456',
          change: 22.7,
          changeType: 'positive',
          icon: '👥',
          color: 'text-pink-600',
        },
        {
          id: 'sellers',
          title: 'Aktif Satıcı',
          value: '342',
          change: 5.8,
          changeType: 'positive',
          icon: '🏪',
          color: 'text-cyan-600',
        },
        {
          id: 'rma',
          title: 'İade Oranı',
          value: '2.1%',
          change: -0.3,
          changeType: 'positive',
          icon: '↩️',
          color: 'text-red-600',
        },
      ];

      setMetrics(mockMetrics);
      
      // Track dashboard view
      trackEvent(AnalyticsEvent.ADMIN_ACTION, {
        action: 'kpi_dashboard_view',
        timeRange,
      });
      
    } catch (error) {
      console.error('Failed to load KPI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return '↗️';
      case 'negative':
        return '↘️';
      default:
        return '➡️';
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Performans Metrikleri</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="1d">Son 1 Gün</option>
          <option value="7d">Son 7 Gün</option>
          <option value="30d">Son 30 Gün</option>
          <option value="90d">Son 90 Gün</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{metric.icon}</div>
              <div className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                {getChangeIcon(metric.changeType)} {Math.abs(metric.change)}%
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              <div className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Satış Trendi
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>Grafik verisi yükleniyor...</p>
            </div>
          </div>
        </motion.div>

        {/* Top Categories Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            En Popüler Kategoriler
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Figür & Koleksiyon', value: 35, color: 'bg-indigo-500' },
              { name: 'Moda & Aksesuar', value: 28, color: 'bg-pink-500' },
              { name: 'Elektronik', value: 22, color: 'bg-green-500' },
              { name: 'Ev & Yaşam', value: 15, color: 'bg-yellow-500' },
            ].map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {category.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${category.color}`}
                    style={{ width: `${category.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Son Aktiviteler
        </h3>
        <div className="space-y-4">
          {[
            {
              action: 'Yeni sipariş alındı',
              details: 'Sipariş #1234 - ₺1,250',
              time: '2 dakika önce',
              type: 'order',
            },
            {
              action: 'Blog yazısı onaylandı',
              details: 'TDC Market\'te En Trend Ürünler',
              time: '15 dakika önce',
              type: 'blog',
            },
            {
              action: 'Yeni satıcı kaydı',
              details: 'Vintage Collection',
              time: '1 saat önce',
              type: 'seller',
            },
            {
              action: 'Ödeme işlendi',
              details: 'Sipariş #1233 - ₺890',
              time: '2 saat önce',
              type: 'payment',
            },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.details}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
