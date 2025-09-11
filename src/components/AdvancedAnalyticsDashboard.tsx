'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './Toast';

interface AnalyticsData {
  sales: {
    total: number;
    growth: number;
    daily: number[];
    monthly: number[];
    byCategory: { category: string; amount: number; percentage: number }[];
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    segments: { segment: string; count: number; value: number }[];
  };
  inventory: {
    totalProducts: number;
    lowStock: number;
    outOfStock: number;
    turnoverRate: number;
  };
  performance: {
    conversionRate: number;
    averageOrderValue: number;
    cartAbandonmentRate: number;
    customerLifetimeValue: number;
  };
  predictions: {
    nextMonthSales: number;
    confidence: number;
    recommendations: string[];
  };
}

interface TimeRange {
  label: string;
  value: string;
  days: number;
}

export default function AdvancedAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>({
    label: 'Son 30 Gün',
    value: '30days',
    days: 30
  });
  const [selectedMetric, setSelectedMetric] = useState<string>('sales');
  const { addToast } = useToast();

  const timeRanges: TimeRange[] = [
    { label: 'Son 7 Gün', value: '7days', days: 7 },
    { label: 'Son 30 Gün', value: '30days', days: 30 },
    { label: 'Son 90 Gün', value: '90days', days: 90 },
    { label: 'Son 1 Yıl', value: '1year', days: 365 }
  ];

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/advanced?range=${timeRange.value}`);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Analytics fetch error:', error);
      addToast({
        type: 'error',
        title: 'Analitik Hatası',
        message: 'Veriler yüklenirken hata oluştu'
      });
    } finally {
      setLoading(false);
    }
  }, [timeRange, addToast]);

  const exportReport = async (format: 'pdf' | 'excel') => {
    try {
      const response = await fetch(`/api/analytics/export?format=${format}&range=${timeRange.value}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${timeRange.value}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        addToast({
          type: 'success',
          title: 'Rapor İndirildi',
          message: `${format.toUpperCase()} formatında rapor indirildi`
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Export Hatası',
        message: 'Rapor indirilemedi'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analitik veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center p-8">
        <i className="ri-bar-chart-line text-6xl text-gray-300 mb-4"></i>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Veri Bulunamadı</h3>
        <p className="text-gray-600">Seçilen dönem için analitik veri bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <i className="ri-dashboard-3-line text-3xl text-blue-600 mr-3"></i>
            Gelişmiş Analitik Dashboard
          </h2>
          
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <select
              value={timeRange.value}
              onChange={(e) => {
                const selected = timeRanges.find(tr => tr.value === e.target.value);
                if (selected) setTimeRange(selected);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            
            {/* Export Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => exportReport('pdf')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center"
              >
                <i className="ri-file-pdf-line mr-2"></i>
                PDF
              </button>
              <button
                onClick={() => exportReport('excel')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center"
              >
                <i className="ri-file-excel-line mr-2"></i>
                Excel
              </button>
            </div>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'sales', label: 'Satışlar', icon: 'ri-line-chart-line' },
            { key: 'customers', label: 'Müşteriler', icon: 'ri-user-line' },
            { key: 'inventory', label: 'Stok', icon: 'ri-box-3-line' },
            { key: 'performance', label: 'Performans', icon: 'ri-speed-up-line' }
          ].map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                selectedMetric === metric.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className={`${metric.icon} mr-2`}></i>
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
            </div>
            <div className={`text-sm font-medium ${(analyticsData.sales?.growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(analyticsData.sales?.growth || 0) >= 0 ? '+' : ''}{(analyticsData.sales?.growth || 0).toFixed(1)}%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            ₺{(analyticsData.sales?.total || 0).toLocaleString('tr-TR')}
          </div>
          <div className="text-sm text-gray-600">Toplam Satış</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <i className="ri-user-line text-2xl text-blue-600"></i>
            </div>
            <div className="text-sm font-medium text-blue-600">
              {analyticsData.customers?.returning || 0} dönen
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {(analyticsData.customers?.total || 0).toLocaleString('tr-TR')}
          </div>
          <div className="text-sm text-gray-600">Toplam Müşteri</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <i className="ri-box-3-line text-2xl text-orange-600"></i>
            </div>
            <div className="text-sm font-medium text-orange-600">
              {(analyticsData.inventory?.turnoverRate || 0).toFixed(1)}x
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {(analyticsData.inventory?.totalProducts || 0).toLocaleString('tr-TR')}
          </div>
          <div className="text-sm text-gray-600">Toplam Ürün</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <i className="ri-percent-line text-2xl text-purple-600"></i>
            </div>
            <div className="text-sm font-medium text-purple-600">
              {(analyticsData.performance?.conversionRate || 0).toFixed(1)}%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            ₺{(analyticsData.performance?.averageOrderValue || 0).toLocaleString('tr-TR')}
          </div>
          <div className="text-sm text-gray-600">Ortalama Sipariş</div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Satış Trendi</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {(analyticsData.sales?.daily || []).slice(-14).map((value, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${(value / Math.max(...(analyticsData.sales?.daily || [1]))) * 200}px` }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(Date.now() - (13 - index) * 24 * 60 * 60 * 1000).getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Kategori Dağılımı</h3>
          <div className="space-y-3">
            {(analyticsData.sales?.byCategory || []).map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded mr-3"
                    style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                  ></div>
                  <span className="text-gray-700">{category.category}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ₺{category.amount.toLocaleString('tr-TR')}
                  </div>
                  <div className="text-sm text-gray-500">
                    %{category.percentage.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Predictions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <i className="ri-brain-line text-2xl text-purple-600 mr-2"></i>
          AI Tahminleri ve Öneriler
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-900 mb-2">
              ₺{(analyticsData.predictions?.nextMonthSales || 0).toLocaleString('tr-TR')}
            </div>
            <div className="text-sm text-purple-700 mb-2">Gelecek Ay Tahmini</div>
            <div className="text-xs text-purple-600">
              %{analyticsData.predictions?.confidence || 0} güven
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-semibold text-gray-900 mb-3">AI Önerileri:</h4>
            <ul className="space-y-2">
              {(analyticsData.predictions?.recommendations || []).map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <i className="ri-lightbulb-line text-yellow-500 mr-2 mt-1"></i>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Müşteri Segmentleri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(analyticsData.customers?.segments || []).map((segment, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {segment.count.toLocaleString('tr-TR')}
              </div>
              <div className="text-sm text-gray-600 mb-2">{segment.segment}</div>
              <div className="text-lg font-semibold text-green-600">
                ₺{segment.value.toLocaleString('tr-TR')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}