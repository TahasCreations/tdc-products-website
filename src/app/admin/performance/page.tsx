'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import AdminProtection from '../../../components/AdminProtection';
import { 
  ChartBarIcon,
  ClockIcon,
  CpuChipIcon,
  ServerIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CogIcon,
  BoltIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  TableCellsIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowPathIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  status: 'good' | 'warning' | 'critical';
  trend: number[];
  lastUpdated: string;
  threshold: {
    warning: number;
    critical: number;
  };
}

interface PagePerformance {
  id: string;
  name: string;
  url: string;
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  totalBlockingTime: number;
  speedIndex: number;
  performanceScore: number;
  lastTested: string;
}

interface BundleAnalysis {
  id: string;
  name: string;
  size: number;
  gzipSize: number;
  chunks: number;
  dependencies: number;
  lastAnalyzed: string;
}

interface PerformanceAlert {
  id: string;
  type: 'performance' | 'error' | 'warning' | 'info';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved: boolean;
  action?: string;
}

export default function PerformanceDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [pagePerformance, setPagePerformance] = useState<PagePerformance[]>([]);
  const [bundleAnalysis, setBundleAnalysis] = useState<BundleAnalysis[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'bundles' | 'alerts' | 'settings'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    const mockMetrics: PerformanceMetric[] = [
      {
        id: '1',
        name: 'Sayfa Yükleme Süresi',
        value: 1.2,
        unit: 'saniye',
        change: -15.2,
        changeType: 'decrease',
        status: 'good',
        trend: [2.1, 1.8, 1.5, 1.3, 1.2],
        lastUpdated: '2024-01-15T14:30:00Z',
        threshold: { warning: 2.0, critical: 3.0 }
      },
      {
        id: '2',
        name: 'First Contentful Paint',
        value: 0.8,
        unit: 'saniye',
        change: -22.5,
        changeType: 'decrease',
        status: 'good',
        trend: [1.2, 1.0, 0.9, 0.8, 0.8],
        lastUpdated: '2024-01-15T14:30:00Z',
        threshold: { warning: 1.5, critical: 2.5 }
      },
      {
        id: '3',
        name: 'Largest Contentful Paint',
        value: 1.5,
        unit: 'saniye',
        change: -18.7,
        changeType: 'decrease',
        status: 'good',
        trend: [2.1, 1.9, 1.7, 1.6, 1.5],
        lastUpdated: '2024-01-15T14:30:00Z',
        threshold: { warning: 2.5, critical: 4.0 }
      },
      {
        id: '4',
        name: 'Cumulative Layout Shift',
        value: 0.05,
        unit: 'CLS',
        change: -45.0,
        changeType: 'decrease',
        status: 'good',
        trend: [0.12, 0.09, 0.07, 0.06, 0.05],
        lastUpdated: '2024-01-15T14:30:00Z',
        threshold: { warning: 0.1, critical: 0.25 }
      },
      {
        id: '5',
        name: 'First Input Delay',
        value: 45,
        unit: 'ms',
        change: -30.0,
        changeType: 'decrease',
        status: 'good',
        trend: [80, 70, 60, 50, 45],
        lastUpdated: '2024-01-15T14:30:00Z',
        threshold: { warning: 100, critical: 300 }
      },
      {
        id: '6',
        name: 'Bundle Boyutu',
        value: 87.8,
        unit: 'KB',
        change: 5.2,
        changeType: 'increase',
        status: 'warning',
        trend: [75, 78, 82, 85, 87.8],
        lastUpdated: '2024-01-15T14:30:00Z',
        threshold: { warning: 80, critical: 100 }
      }
    ];

    const mockPagePerformance: PagePerformance[] = [
      {
        id: '1',
        name: 'Ana Sayfa',
        url: '/',
        loadTime: 1.2,
        firstContentfulPaint: 0.8,
        largestContentfulPaint: 1.5,
        cumulativeLayoutShift: 0.05,
        firstInputDelay: 45,
        totalBlockingTime: 120,
        speedIndex: 1.1,
        performanceScore: 95,
        lastTested: '2024-01-15T14:30:00Z'
      },
      {
        id: '2',
        name: 'Ürünler',
        url: '/products',
        loadTime: 1.8,
        firstContentfulPaint: 1.2,
        largestContentfulPaint: 2.1,
        cumulativeLayoutShift: 0.08,
        firstInputDelay: 65,
        totalBlockingTime: 180,
        speedIndex: 1.6,
        performanceScore: 88,
        lastTested: '2024-01-15T14:25:00Z'
      },
      {
        id: '3',
        name: 'Admin Dashboard',
        url: '/admin',
        loadTime: 2.1,
        firstContentfulPaint: 1.5,
        largestContentfulPaint: 2.5,
        cumulativeLayoutShift: 0.12,
        firstInputDelay: 85,
        totalBlockingTime: 220,
        speedIndex: 1.9,
        performanceScore: 82,
        lastTested: '2024-01-15T14:20:00Z'
      }
    ];

    const mockBundleAnalysis: BundleAnalysis[] = [
      {
        id: '1',
        name: 'Ana Bundle',
        size: 87.8,
        gzipSize: 31.2,
        chunks: 3,
        dependencies: 45,
        lastAnalyzed: '2024-01-15T14:30:00Z'
      },
      {
        id: '2',
        name: 'Admin Bundle',
        size: 148.5,
        gzipSize: 52.1,
        chunks: 8,
        dependencies: 78,
        lastAnalyzed: '2024-01-15T14:25:00Z'
      },
      {
        id: '3',
        name: 'Vendor Bundle',
        size: 156.2,
        gzipSize: 48.7,
        chunks: 5,
        dependencies: 120,
        lastAnalyzed: '2024-01-15T14:20:00Z'
      }
    ];

    const mockAlerts: PerformanceAlert[] = [
      {
        id: '1',
        type: 'warning',
        title: 'Bundle Boyutu Artışı',
        description: 'Ana bundle boyutu %5.2 arttı ve uyarı eşiğini aştı',
        severity: 'medium',
        timestamp: '2024-01-15T14:30:00Z',
        resolved: false,
        action: 'Bundle analizi yapın ve gereksiz bağımlılıkları kaldırın'
      },
      {
        id: '2',
        type: 'performance',
        title: 'Admin Dashboard Yavaşlığı',
        description: 'Admin dashboard sayfası 2.1s yükleme süresi ile yavaş',
        severity: 'high',
        timestamp: '2024-01-15T14:25:00Z',
        resolved: false,
        action: 'Lazy loading ve kod bölme uygulayın'
      },
      {
        id: '3',
        type: 'info',
        title: 'Performans İyileştirmesi',
        description: 'Ana sayfa performansı %15.2 iyileşti',
        severity: 'low',
        timestamp: '2024-01-15T14:20:00Z',
        resolved: true
      }
    ];

    setMetrics(mockMetrics);
    setPagePerformance(mockPagePerformance);
    setBundleAnalysis(mockBundleAnalysis);
    setAlerts(mockAlerts);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return CheckCircleIcon;
      case 'warning': return ExclamationTriangleIcon;
      case 'critical': return XCircleIcon;
      default: return ClockIcon;
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return ArrowTrendingUpIcon;
      case 'decrease': return ArrowTrendingDownIcon;
      default: return ClockIcon;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-red-600';
      case 'decrease': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600 bg-blue-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Performans Dashboard</h1>
                <p className="mt-2 text-gray-600">Sistem performansı izleme ve optimizasyon</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-gray-600">
                    {isMonitoring ? 'İzleme Aktif' : 'İzleme Pasif'}
                  </span>
                </div>
                <button
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                    isMonitoring 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isMonitoring ? (
                    <>
                      <PauseIcon className="w-5 h-5 mr-2" />
                      Durdur
                    </>
                  ) : (
                    <>
                      <PlayIcon className="w-5 h-5 mr-2" />
                      Başlat
                    </>
                  )}
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <ArrowPathIcon className="w-5 h-5 mr-2" />
                  Yenile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', name: 'Genel Bakış', icon: ChartBarIcon },
                { id: 'pages', name: 'Sayfa Performansı', icon: GlobeAltIcon },
                { id: 'bundles', name: 'Bundle Analizi', icon: CpuChipIcon },
                { id: 'alerts', name: 'Uyarılar', icon: ExclamationTriangleIcon },
                { id: 'settings', name: 'Ayarlar', icon: AdjustmentsHorizontalIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Time Range Selector */}
          <div className="mb-6">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1h">Son 1 Saat</option>
              <option value="24h">Son 24 Saat</option>
              <option value="7d">Son 7 Gün</option>
              <option value="30d">Son 30 Gün</option>
            </select>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metrics.map((metric) => {
                  const StatusIcon = getStatusIcon(metric.status);
                  const ChangeIcon = getChangeIcon(metric.changeType);
                  
                  return (
                    <div key={metric.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{metric.name}</h3>
                            <p className="text-3xl font-bold text-gray-900">
                              {metric.value} {metric.unit}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(metric.status)}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {metric.status === 'good' ? 'İyi' :
                               metric.status === 'warning' ? 'Uyarı' : 'Kritik'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Değişim:</span>
                            <span className={`flex items-center ${getChangeColor(metric.changeType)}`}>
                              <ChangeIcon className="w-3 h-3 mr-1" />
                              {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Son Güncelleme:</span>
                            <span>{new Date(metric.lastUpdated).toLocaleTimeString('tr-TR')}</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                metric.status === 'good' ? 'bg-green-500' :
                                metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ 
                                width: `${Math.min(100, (metric.value / metric.threshold.critical) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Performance Trends */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performans Trendleri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Sayfa Yükleme Süresi</h4>
                    <div className="h-32 bg-gray-50 rounded-lg flex items-end space-x-1 p-2">
                      {metrics[0]?.trend.map((value, index) => (
                        <div
                          key={index}
                          className="bg-blue-500 rounded-t"
                          style={{ 
                            height: `${(value / Math.max(...metrics[0].trend)) * 100}%`,
                            width: '20%'
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Bundle Boyutu</h4>
                    <div className="h-32 bg-gray-50 rounded-lg flex items-end space-x-1 p-2">
                      {metrics[5]?.trend.map((value, index) => (
                        <div
                          key={index}
                          className="bg-red-500 rounded-t"
                          style={{ 
                            height: `${(value / Math.max(...metrics[5].trend)) * 100}%`,
                            width: '20%'
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pages Tab */}
          {activeTab === 'pages' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Sayfa Performans Analizi</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sayfa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Yükleme Süresi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          FCP
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          LCP
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CLS
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performans Skoru
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Son Test
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pagePerformance.map((page) => (
                        <tr key={page.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{page.name}</div>
                              <div className="text-sm text-gray-500">{page.url}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {page.loadTime}s
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {page.firstContentfulPaint}s
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {page.largestContentfulPaint}s
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {page.cumulativeLayoutShift}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPerformanceScoreColor(page.performanceScore)}`}>
                              {page.performanceScore}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(page.lastTested).toLocaleString('tr-TR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Bundles Tab */}
          {activeTab === 'bundles' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bundleAnalysis.map((bundle) => (
                  <div key={bundle.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{bundle.name}</h3>
                        <span className="text-sm text-gray-500">{bundle.size} KB</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Gzip Boyutu:</span>
                          <span className="text-sm font-medium text-gray-900">{bundle.gzipSize} KB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Chunk Sayısı:</span>
                          <span className="text-sm font-medium text-gray-900">{bundle.chunks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Bağımlılık:</span>
                          <span className="text-sm font-medium text-gray-900">{bundle.dependencies}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Sıkıştırma Oranı:</span>
                          <span className="text-sm font-medium text-gray-900">
                            %{((1 - bundle.gzipSize / bundle.size) * 100).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (bundle.size / 200) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${
                    alert.resolved ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {alert.type === 'performance' && <BoltIcon className="w-5 h-5 text-orange-600" />}
                          {alert.type === 'error' && <XCircleIcon className="w-5 h-5 text-red-600" />}
                          {alert.type === 'warning' && <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />}
                          {alert.type === 'info' && <CheckCircleIcon className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                              {alert.severity === 'low' ? 'Düşük' :
                               alert.severity === 'medium' ? 'Orta' :
                               alert.severity === 'high' ? 'Yüksek' : 'Kritik'}
                            </span>
                            {alert.resolved && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                Çözüldü
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                          {alert.action && (
                            <p className="text-xs text-blue-600">{alert.action}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleString('tr-TR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Performans Ayarları</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Otomatik Performans İzleme</p>
                      <p className="text-xs text-gray-500">Sistem performansını otomatik olarak izler</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Gerçek Zamanlı Uyarılar</p>
                      <p className="text-xs text-gray-500">Performans sorunları için anında bildirim</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Bundle Analizi</p>
                      <p className="text-xs text-gray-500">Her build sonrası bundle analizi yap</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Ayarları Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}
