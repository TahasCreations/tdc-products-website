'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  EyeIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

interface BIMetric {
  id: string;
  name: string;
  category: 'revenue' | 'traffic' | 'conversion' | 'retention' | 'satisfaction';
  currentValue: number;
  previousValue: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
  benchmark: number;
  benchmarkPercentage: number;
  unit: string;
  target: number;
  targetAchievement: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

interface BIInsight {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  recommendation: string;
  actionRequired: boolean;
  priority: 'urgent' | 'high' | 'medium' | 'low';
}

interface BIData {
  metrics: BIMetric[];
  insights: BIInsight[];
  kpiSummary: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    conversionRate: number;
    avgOrderValue: number;
    customerLifetimeValue: number;
  };
  performanceTrends: {
    date: string;
    revenue: number;
    orders: number;
    users: number;
  }[];
  categoryPerformance: {
    category: string;
    revenue: number;
    orders: number;
    growth: number;
  }[];
}

export default function BusinessIntelligence() {
  const [data, setData] = useState<BIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchBIData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/business-intelligence?period=${selectedPeriod}&category=${selectedCategory}`);
      
      if (response.ok) {
        const biData = await response.json();
        setData(biData);
      }
    } catch (error) {
      console.error('Business Intelligence fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod, selectedCategory]);

  useEffect(() => {
    fetchBIData();
  }, [fetchBIData]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue':
        return <CurrencyDollarIcon className="w-6 h-6" />;
      case 'traffic':
        return <EyeIcon className="w-6 h-6" />;
      case 'conversion':
        return <ArrowTrendingUpIcon className="w-6 h-6" />;
      case 'retention':
        return <UserGroupIcon className="w-6 h-6" />;
      case 'satisfaction':
        return <ChartBarIcon className="w-6 h-6" />;
      default:
        return <ChartBarIcon className="w-6 h-6" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
      default:
        return <MinusIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatValue = (value: number, unit: string) => {
    switch (unit) {
      case 'currency':
        return new Intl.NumberFormat('tr-TR', {
          style: 'currency',
          currency: 'TRY',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return new Intl.NumberFormat('tr-TR').format(value);
      default:
        return value.toString();
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-12">
          <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            İş Zekası Verisi Bulunamadı
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Veri toplama işlemi devam ediyor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            İş Zekası Dashboard
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kapsamlı iş analitikleri ve performans metrikleri
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="7d">Son 7 Gün</option>
            <option value="30d">Son 30 Gün</option>
            <option value="90d">Son 90 Gün</option>
            <option value="1y">Son 1 Yıl</option>
          </select>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="revenue">Gelir</option>
            <option value="traffic">Trafik</option>
            <option value="conversion">Dönüşüm</option>
            <option value="retention">Sadakat</option>
            <option value="satisfaction">Memnuniyet</option>
          </select>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
              <CurrencyDollarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Gelir</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatValue(data.kpiSummary.totalRevenue, 'currency')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
              <ShoppingCartIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Sipariş</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatValue(data.kpiSummary.totalOrders, 'number')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg mr-3">
              <UserGroupIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Kullanıcı</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatValue(data.kpiSummary.totalUsers, 'number')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg mr-3">
              <ArrowTrendingUpIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dönüşüm Oranı</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatValue(data.kpiSummary.conversionRate, 'percentage')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg mr-3">
              <ChartBarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ort. Sipariş Değeri</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatValue(data.kpiSummary.avgOrderValue, 'currency')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg mr-3">
              <ClockIcon className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Müşteri Yaşam Değeri</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatValue(data.kpiSummary.customerLifetimeValue, 'currency')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.metrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                  {getCategoryIcon(metric.category)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {metric.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {metric.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {getTrendIcon(metric.trend)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Mevcut Değer:</span>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {formatValue(metric.currentValue, metric.unit)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Önceki Dönem:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatValue(metric.previousValue, metric.unit)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Değişim:</span>
                <span className={`font-medium ${
                  metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change >= 0 ? '+' : ''}{metric.changePercentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Hedef:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatValue(metric.target, metric.unit)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Hedef Başarımı:</span>
                <span className={`font-medium ${
                  metric.targetAchievement >= 100 ? 'text-green-600' : 
                  metric.targetAchievement >= 80 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {metric.targetAchievement.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Durum:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(metric.status)}`}>
                  {metric.status === 'excellent' ? 'Mükemmel' :
                   metric.status === 'good' ? 'İyi' :
                   metric.status === 'warning' ? 'Uyarı' : 'Kritik'}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Hedef İlerlemesi</span>
                <span>{metric.targetAchievement.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    metric.targetAchievement >= 100 ? 'bg-green-500' :
                    metric.targetAchievement >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(metric.targetAchievement, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Business Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          İş İçgörüleri ve Öneriler
        </h3>
        <div className="space-y-4">
          {data.insights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">
                  {insight.title}
                </h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(insight.impact)}`}>
                    {insight.impact === 'high' ? 'Yüksek Etki' :
                     insight.impact === 'medium' ? 'Orta Etki' : 'Düşük Etki'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(insight.priority)}`}>
                    {insight.priority === 'urgent' ? 'Acil' :
                     insight.priority === 'high' ? 'Yüksek' :
                     insight.priority === 'medium' ? 'Orta' : 'Düşük'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {insight.description}
              </p>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border-l-4 border-blue-500">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Öneri:</strong> {insight.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
