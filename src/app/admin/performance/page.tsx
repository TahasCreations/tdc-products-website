'use client';

import { useState, useEffect } from 'react';
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
  TrashIcon,
  LightBulbIcon,
  WrenchScrewdriverIcon
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

interface PerformanceRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  actions: string[];
  createdAt: string;
  updatedAt: string;
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [pagePerformance, setPagePerformance] = useState<PagePerformance[]>([]);
  const [bundleAnalysis, setBundleAnalysis] = useState<BundleAnalysis[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [recommendations, setRecommendations] = useState<PerformanceRecommendation[]>([]);
  const [performanceStats, setPerformanceStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'bundles' | 'recommendations' | 'settings'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      
      // Paralel olarak tüm performans verilerini çek
      const [statsRes, pagesRes, recommendationsRes] = await Promise.all([
        fetch('/api/performance/stats'),
        fetch('/api/performance/pages'),
        fetch('/api/performance/recommendations')
      ]);

      // İstatistikleri işle
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setPerformanceStats(statsData.data);
          
          // Metrics'i oluştur
          const metricsData: PerformanceMetric[] = [
            {
              id: '1',
              name: 'Page Load Time',
              value: statsData.data.averageLoadTime,
              unit: 's',
              change: -0.2,
              changeType: 'decrease',
              status: statsData.data.averageLoadTime < 3 ? 'good' : statsData.data.averageLoadTime < 5 ? 'warning' : 'critical',
              trend: [2.5, 2.4, 2.3, 2.2, statsData.data.averageLoadTime],
              lastUpdated: new Date().toISOString(),
              threshold: { warning: 3.0, critical: 5.0 }
            },
            {
              id: '2',
              name: 'First Contentful Paint',
              value: statsData.data.fcp / 1000,
              unit: 's',
              change: 0.1,
              changeType: 'increase',
              status: statsData.data.fcp < 2000 ? 'good' : statsData.data.fcp < 3000 ? 'warning' : 'critical',
              trend: [1.7, 1.8, 1.9, 1.8, statsData.data.fcp / 1000],
              lastUpdated: new Date().toISOString(),
              threshold: { warning: 2.0, critical: 3.0 }
            },
            {
              id: '3',
              name: 'Largest Contentful Paint',
              value: statsData.data.lcp / 1000,
              unit: 's',
              change: -0.3,
              changeType: 'decrease',
              status: statsData.data.lcp < 2500 ? 'good' : statsData.data.lcp < 4000 ? 'warning' : 'critical',
              trend: [3.5, 3.4, 3.3, 3.2, statsData.data.lcp / 1000],
              lastUpdated: new Date().toISOString(),
              threshold: { warning: 2.5, critical: 4.0 }
            },
            {
              id: '4',
              name: 'Cumulative Layout Shift',
              value: statsData.data.cls,
              unit: '',
              change: -0.02,
              changeType: 'decrease',
              status: statsData.data.cls < 0.1 ? 'good' : statsData.data.cls < 0.25 ? 'warning' : 'critical',
              trend: [0.17, 0.16, 0.15, 0.14, statsData.data.cls],
              lastUpdated: new Date().toISOString(),
              threshold: { warning: 0.1, critical: 0.25 }
            },
            {
              id: '5',
              name: 'First Input Delay',
              value: statsData.data.fid,
              unit: 'ms',
              change: -20,
              changeType: 'decrease',
              status: statsData.data.fid < 100 ? 'good' : statsData.data.fid < 300 ? 'warning' : 'critical',
              trend: [140, 130, 120, 110, statsData.data.fid],
              lastUpdated: new Date().toISOString(),
              threshold: { warning: 100, critical: 300 }
            },
            {
              id: '6',
              name: 'Overall Performance Score',
              value: statsData.data.overallScore,
              unit: '/100',
              change: 5,
              changeType: 'increase',
              status: statsData.data.overallScore > 90 ? 'good' : statsData.data.overallScore > 70 ? 'warning' : 'critical',
              trend: [70, 75, 80, 85, statsData.data.overallScore],
              lastUpdated: new Date().toISOString(),
              threshold: { warning: 70, critical: 50 }
            }
          ];
          
          setMetrics(metricsData);
        }
      }

      // Sayfa performansını işle
      if (pagesRes.ok) {
        const pagesData = await pagesRes.json();
        if (pagesData.success) {
          setPagePerformance(pagesData.data);
        }
      }

      // Önerileri işle
      if (recommendationsRes.ok) {
        const recData = await recommendationsRes.json();
        if (recData.success) {
          setRecommendations(recData.data);
        }
      }

      // Mock bundle analysis ve alerts
      const mockBundleAnalysis: BundleAnalysis[] = [
        {
          id: '1',
          name: 'main.js',
          size: 1024000,
          gzipSize: 256000,
          chunks: 5,
          dependencies: 45,
          lastAnalyzed: '2024-01-20T10:00:00Z'
        },
        {
          id: '2',
          name: 'vendor.js',
          size: 2048000,
          gzipSize: 512000,
          chunks: 8,
          dependencies: 120,
          lastAnalyzed: '2024-01-20T10:00:00Z'
        }
      ];

      const mockAlerts: PerformanceAlert[] = [
        {
          id: '1',
          type: 'performance',
          title: 'High Load Time Detected',
          description: 'Admin dashboard load time exceeded 4 seconds',
          severity: 'high',
          timestamp: '2024-01-20T09:00:00Z',
          resolved: false,
          action: 'Optimize bundle size and implement lazy loading'
        },
        {
          id: '2',
          type: 'warning',
          title: 'Memory Usage High',
          description: 'Memory usage reached 85% of available capacity',
          severity: 'medium',
          timestamp: '2024-01-20T08:30:00Z',
          resolved: false,
          action: 'Review memory leaks and optimize data structures'
        }
      ];

      setBundleAnalysis(mockBundleAnalysis);
      setAlerts(mockAlerts);

    } catch (error) {
      console.error('Performance data fetch error:', error);
      
      // Fallback: Mock data
      const mockMetrics: PerformanceMetric[] = [
        {
          id: '1',
          name: 'Page Load Time',
          value: 2.3,
          unit: 's',
          change: -0.2,
          changeType: 'decrease',
          status: 'good',
          trend: [2.5, 2.4, 2.3, 2.2, 2.3],
          lastUpdated: '2024-01-20T10:00:00Z',
          threshold: { warning: 3.0, critical: 5.0 }
        }
      ];
      
      setMetrics(mockMetrics);
      setPerformanceStats({
        overallScore: 78,
        averageLoadTime: 2.3,
        totalRequests: 15420,
        errorRate: 2.1
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: 'overview',
      name: 'Genel Bakış',
      icon: ChartBarIcon,
      description: 'Performans metrikleri ve genel durum'
    },
    {
      id: 'pages',
      name: 'Sayfa Performansı',
      icon: GlobeAltIcon,
      description: 'Sayfa bazında performans analizi'
    },
    {
      id: 'bundles',
      name: 'Bundle Analizi',
      icon: DocumentTextIcon,
      description: 'JavaScript bundle analizi'
    },
    {
      id: 'recommendations',
      name: 'Optimizasyon Önerileri',
      icon: LightBulbIcon,
      description: 'Performans iyileştirme önerileri'
    },
    {
      id: 'settings',
      name: 'Ayarlar',
      icon: CogIcon,
      description: 'Performans izleme ayarları'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Performance Score */}
            {performanceStats && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Genel Performans Skoru
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(performanceStats.overallScore > 90 ? 'good' : performanceStats.overallScore > 70 ? 'warning' : 'critical')}`}>
                      {performanceStats.overallScore > 90 ? 'Mükemmel' : performanceStats.overallScore > 70 ? 'İyi' : 'Kötü'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {performanceStats.overallScore}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          performanceStats.overallScore > 90 ? 'bg-green-500' : 
                          performanceStats.overallScore > 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${performanceStats.overallScore}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Ortalama yükleme süresi: {performanceStats.averageLoadTime}s
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.map((metric) => (
                <div key={metric.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {metric.name}
                    </h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                      {metric.status === 'good' ? 'İyi' : metric.status === 'warning' ? 'Uyarı' : 'Kritik'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {metric.value}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {metric.unit}
                    </span>
                    <div className={`flex items-center text-sm ${
                      metric.changeType === 'increase' ? 'text-red-600' : 
                      metric.changeType === 'decrease' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {metric.changeType === 'increase' ? (
                        <ArrowTrendingUpIcon className="w-4 h-4" />
                      ) : metric.changeType === 'decrease' ? (
                        <ArrowTrendingDownIcon className="w-4 h-4" />
                      ) : null}
                      <span>{Math.abs(metric.change)}%</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Son güncelleme: {new Date(metric.lastUpdated).toLocaleString('tr-TR')}
                  </div>
                </div>
              ))}
            </div>

            {/* System Metrics */}
            {performanceStats && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Sistem Metrikleri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {performanceStats.cpuUsage}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">CPU Kullanımı</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {performanceStats.memoryUsage}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Bellek Kullanımı</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {performanceStats.diskUsage}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Disk Kullanımı</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {performanceStats.networkLatency}ms
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Ağ Gecikmesi</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'pages':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Sayfa Performansı
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Sayfa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Yükleme Süresi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        FCP
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        LCP
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        CLS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Skor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {pagePerformance.map((page) => (
                      <tr key={page.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {page.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {page.url}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {page.loadTime}s
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {page.firstContentfulPaint}ms
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {page.largestContentfulPaint}ms
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {page.cumulativeLayoutShift}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            page.performanceScore > 90 ? 'text-green-600 bg-green-100' :
                            page.performanceScore > 70 ? 'text-yellow-600 bg-yellow-100' :
                            'text-red-600 bg-red-100'
                          }`}>
                            {page.performanceScore}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'bundles':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Bundle Analizi
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Bundle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Boyut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Gzip Boyutu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Chunks
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Bağımlılıklar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {bundleAnalysis.map((bundle) => (
                      <tr key={bundle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {bundle.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {formatBytes(bundle.size)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {formatBytes(bundle.gzipSize)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {bundle.chunks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {bundle.dependencies}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'recommendations':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Optimizasyon Önerileri
                </h3>
                <button
                  onClick={fetchPerformanceData}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  <span>Yenile</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {rec.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {rec.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                          {rec.priority === 'critical' ? 'Kritik' : 
                           rec.priority === 'high' ? 'Yüksek' : 
                           rec.priority === 'medium' ? 'Orta' : 'Düşük'}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(rec.impact)}`}>
                          {rec.impact === 'high' ? 'Yüksek Etki' : 
                           rec.impact === 'medium' ? 'Orta Etki' : 'Düşük Etki'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Önerilen Aksiyonlar:
                      </h5>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {rec.actions.map((action, index) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Kategori: {rec.category} • 
                        Çaba: {rec.effort === 'high' ? 'Yüksek' : rec.effort === 'medium' ? 'Orta' : 'Düşük'} • 
                        Durum: {rec.status === 'pending' ? 'Beklemede' : 
                                rec.status === 'in_progress' ? 'İşlemde' : 
                                rec.status === 'completed' ? 'Tamamlandı' : 'İptal Edildi'}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                          Uygula
                        </button>
                        <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                          Detay
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Performans İzleme Ayarları
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Gerçek Zamanlı İzleme
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Performans metriklerini gerçek zamanlı olarak izle
                    </p>
                  </div>
                  <button
                    onClick={() => setIsMonitoring(!isMonitoring)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isMonitoring ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isMonitoring ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Zaman Aralığı
                  </label>
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="1h">Son 1 Saat</option>
                    <option value="24h">Son 24 Saat</option>
                    <option value="7d">Son 7 Gün</option>
                    <option value="30d">Son 30 Gün</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Performans & Optimizasyon
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Sistem performansı ve hız optimizasyonu
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Performans Durumu</p>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      performanceStats?.overallScore > 90 ? 'bg-green-500' : 
                      performanceStats?.overallScore > 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {performanceStats?.overallScore > 90 ? 'Mükemmel' : 
                       performanceStats?.overallScore > 70 ? 'İyi' : 'Kötü'}
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <BoltIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderTabContent()}
        </div>
      </div>
    </AdminProtection>
  );
}