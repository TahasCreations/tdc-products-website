"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  Activity,
  Zap
} from 'lucide-react';

interface RealTimeMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export const RealTimeDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate WebSocket connection
    const ws = new WebSocket('ws://localhost:3001/realtime');
    
    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateMetrics(data);
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    // Initial metrics
    setMetrics([
      {
        id: 'visitors',
        label: 'Canlı Ziyaretçiler',
        value: 1247,
        change: 12.5,
        icon: <Users className="w-6 h-6" />,
        color: 'blue'
      },
      {
        id: 'orders',
        label: 'Bugünkü Siparişler',
        value: 342,
        change: 8.2,
        icon: <ShoppingCart className="w-6 h-6" />,
        color: 'green'
      },
      {
        id: 'revenue',
        label: 'Günlük Gelir',
        value: 45892,
        change: 15.3,
        icon: <DollarSign className="w-6 h-6" />,
        color: 'purple'
      },
      {
        id: 'conversion',
        label: 'Dönüşüm Oranı',
        value: 3.2,
        change: -2.1,
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'orange'
      },
    ]);

    return () => {
      ws.close();
    };
  }, []);

  const updateMetrics = (data: any) => {
    setMetrics(prev => prev.map(metric => {
      if (metric.id === data.metric) {
        return {
          ...metric,
          value: data.value,
          change: data.change || metric.change
        };
      }
      return metric;
    }));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Canlı Dashboard</h2>
          <p className="text-sm text-gray-600">Gerçek zamanlı metrikler</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Bağlı' : 'Bağlantı Yok'}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                metric.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                metric.color === 'green' ? 'bg-green-100 text-green-600' :
                metric.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {metric.icon}
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                metric.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
              <div className="text-3xl font-bold text-gray-900">
                {metric.id === 'revenue' ? `$${metric.value.toLocaleString()}` :
                 metric.id === 'conversion' ? `${metric.value}%` :
                 metric.value.toLocaleString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">Canlı Aktivite</h3>
        </div>
        <div className="space-y-3">
          {[
            { time: '2 saniye önce', action: 'Yeni sipariş', amount: '$125.00' },
            { time: '5 saniye önce', action: 'Ürün görüntüleme', product: 'Wireless Headphones' },
            { time: '12 saniye önce', action: 'Yeni kayıt', user: 'john@example.com' },
            { time: '18 saniye önce', action: 'Sepete ekleme', product: 'Mechanical Keyboard' },
            { time: '25 saniye önce', action: 'Yeni sipariş', amount: '$89.99' },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">{activity.action}</span>
                  {activity.product && <span className="text-gray-600"> - {activity.product}</span>}
                  {activity.amount && <span className="text-green-600 font-semibold"> {activity.amount}</span>}
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

