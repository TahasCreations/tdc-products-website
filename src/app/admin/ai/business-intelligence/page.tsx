'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import AdminProtection from '../../../../components/AdminProtection';
import { 
  ChartBarIcon,
  CpuChipIcon,
  LightBulbIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  DocumentChartBarIcon,
  PresentationChartLineIcon,
  ChartPieIcon,
  TableCellsIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'warning' | 'prediction';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  value: number;
  category: string;
  createdAt: string;
  actionRequired: boolean;
  suggestedActions: string[];
}

interface Prediction {
  id: string;
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string;
  trend: 'up' | 'down' | 'stable';
  factors: string[];
}

interface CustomerSegment {
  id: string;
  name: string;
  size: number;
  value: number;
  growth: number;
  characteristics: string[];
  recommendations: string[];
}

export default function BusinessIntelligence() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'insights' | 'predictions' | 'segments' | 'recommendations'>('insights');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // Mock data
  useEffect(() => {
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'opportunity',
        title: 'Yeni Müşteri Segmenti Keşfedildi',
        description: '25-35 yaş arası teknoloji meraklısı müşterilerin satın alma oranı %40 daha yüksek',
        impact: 'high',
        confidence: 92,
        value: 250000,
        category: 'Müşteri Analizi',
        createdAt: '2024-01-15',
        actionRequired: true,
        suggestedActions: [
          'Bu segment için özel kampanya oluştur',
          'Hedefli reklam stratejisi geliştir',
          'Ürün önerilerini optimize et'
        ]
      },
      {
        id: '2',
        type: 'anomaly',
        title: 'Anormal Satış Düşüşü Tespit Edildi',
        description: 'Son 3 günde elektronik kategorisinde %25 düşüş gözlemlendi',
        impact: 'high',
        confidence: 88,
        value: -75000,
        category: 'Satış Analizi',
        createdAt: '2024-01-14',
        actionRequired: true,
        suggestedActions: [
          'Rekabet analizi yap',
          'Fiyat stratejisini gözden geçir',
          'Stok durumunu kontrol et'
        ]
      },
      {
        id: '3',
        type: 'prediction',
        title: 'Q1 Gelir Tahmini',
        description: 'Yapay zeka modeli Q1 gelirini 1.2M TL olarak tahmin ediyor',
        impact: 'medium',
        confidence: 85,
        value: 1200000,
        category: 'Finansal Tahmin',
        createdAt: '2024-01-13',
        actionRequired: false,
        suggestedActions: [
          'Bütçe planlamasını güncelle',
          'Hedefleri gözden geçir'
        ]
      }
    ];

    const mockPredictions: Prediction[] = [
      {
        id: '1',
        metric: 'Aylık Gelir',
        currentValue: 1250000,
        predictedValue: 1450000,
        confidence: 89,
        timeframe: '30 gün',
        trend: 'up',
        factors: ['Mevsimsel artış', 'Yeni ürün lansmanı', 'Pazarlama kampanyası']
      },
      {
        id: '2',
        metric: 'Müşteri Memnuniyeti',
        currentValue: 4.2,
        predictedValue: 4.6,
        confidence: 76,
        timeframe: '60 gün',
        trend: 'up',
        factors: ['Hizmet kalitesi iyileştirmeleri', 'Müşteri geri bildirimleri']
      },
      {
        id: '3',
        metric: 'Stok Dönüş Hızı',
        currentValue: 2.1,
        predictedValue: 1.8,
        confidence: 82,
        timeframe: '45 gün',
        trend: 'down',
        factors: ['Tedarik zinciri gecikmeleri', 'Talep azalması']
      }
    ];

    const mockSegments: CustomerSegment[] = [
      {
        id: '1',
        name: 'Premium Müşteriler',
        size: 1250,
        value: 850000,
        growth: 15.2,
        characteristics: ['Yüksek harcama', 'Sadık müşteri', 'Online alışveriş'],
        recommendations: ['VIP programı', 'Özel indirimler', 'Erken erişim']
      },
      {
        id: '2',
        name: 'Genç Profesyoneller',
        size: 3200,
        value: 420000,
        growth: 28.5,
        characteristics: ['25-35 yaş', 'Teknoloji meraklısı', 'Mobil kullanıcı'],
        recommendations: ['Mobil optimizasyon', 'Sosyal medya pazarlama', 'Hızlı teslimat']
      },
      {
        id: '3',
        name: 'Aile Müşterileri',
        size: 2100,
        value: 380000,
        growth: 8.7,
        characteristics: ['35-50 yaş', 'Aile odaklı', 'Güvenlik odaklı'],
        recommendations: ['Güvenlik vurgusu', 'Aile paketleri', 'Güvenilir markalar']
      }
    ];

    setInsights(mockInsights);
    setPredictions(mockPredictions);
    setSegments(mockSegments);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return ArrowTrendingUpIcon;
      case 'anomaly': return ExclamationTriangleIcon;
      case 'opportunity': return LightBulbIcon;
      case 'warning': return ExclamationTriangleIcon;
      case 'prediction': return CpuChipIcon;
      default: return EyeIcon;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return 'text-blue-600 bg-blue-100';
      case 'anomaly': return 'text-red-600 bg-red-100';
      case 'opportunity': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'prediction': return 'text-purple-600 bg-purple-100';
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
                <h1 className="text-3xl font-bold text-gray-900">AI Business Intelligence</h1>
                <p className="mt-2 text-gray-600">Yapay zeka destekli iş zekası ve analitik</p>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="7d">Son 7 Gün</option>
                  <option value="30d">Son 30 Gün</option>
                  <option value="90d">Son 90 Gün</option>
                  <option value="1y">Son 1 Yıl</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Yeni Analiz
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
                { id: 'insights', name: 'AI Öngörüleri', icon: LightBulbIcon },
                { id: 'predictions', name: 'Tahminler', icon: CpuChipIcon },
                { id: 'segments', name: 'Müşteri Segmentleri', icon: UserGroupIcon },
                { id: 'recommendations', name: 'Öneriler', icon: SparklesIcon }
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

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {insights.map((insight) => {
                  const InsightIcon = getInsightIcon(insight.type);
                  
                  return (
                    <div key={insight.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg mr-3">
                              <InsightIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                              <p className="text-sm text-gray-600">{insight.category}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getInsightColor(insight.type)}`}>
                              {insight.type === 'trend' ? 'Trend' :
                               insight.type === 'anomaly' ? 'Anomali' :
                               insight.type === 'opportunity' ? 'Fırsat' :
                               insight.type === 'warning' ? 'Uyarı' :
                               'Tahmin'}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(insight.impact)}`}>
                              {insight.impact === 'high' ? 'Yüksek' :
                               insight.impact === 'medium' ? 'Orta' : 'Düşük'} Etki
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-4">{insight.description}</p>

                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Güven Skoru:</span>
                            <span className="text-sm font-medium text-gray-900">%{insight.confidence}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Değer:</span>
                            <span className={`text-sm font-medium ${insight.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(Math.abs(insight.value))}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Tarih:</span>
                            <span className="text-sm text-gray-900">{insight.createdAt}</span>
                          </div>
                        </div>

                        {insight.actionRequired && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Önerilen Aksiyonlar:</h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {insight.suggestedActions.map((action, index) => (
                                <li key={index} className="flex items-center">
                                  <CheckCircleIcon className="w-3 h-3 text-green-500 mr-2" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Predictions Tab */}
          {activeTab === 'predictions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {predictions.map((prediction) => (
                  <div key={prediction.id} className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{prediction.metric}</h3>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          prediction.trend === 'up' ? 'text-green-600 bg-green-100' :
                          prediction.trend === 'down' ? 'text-red-600 bg-red-100' :
                          'text-gray-600 bg-gray-100'
                        }`}>
                          {prediction.trend === 'up' ? 'Yükseliş' :
                           prediction.trend === 'down' ? 'Düşüş' : 'Sabit'}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Mevcut Değer:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {prediction.metric === 'Aylık Gelir' ? formatCurrency(prediction.currentValue) :
                             prediction.metric === 'Müşteri Memnuniyeti' ? prediction.currentValue.toFixed(1) :
                             prediction.currentValue.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tahmin Edilen:</span>
                          <span className="text-sm font-bold text-blue-600">
                            {prediction.metric === 'Aylık Gelir' ? formatCurrency(prediction.predictedValue) :
                             prediction.metric === 'Müşteri Memnuniyeti' ? prediction.predictedValue.toFixed(1) :
                             prediction.predictedValue.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Güven Skoru:</span>
                          <span className="text-sm font-medium text-gray-900">%{prediction.confidence}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Zaman Dilimi:</span>
                          <span className="text-sm text-gray-900">{prediction.timeframe}</span>
                        </div>
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Etkileyen Faktörler:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {prediction.factors.map((factor, index) => (
                            <li key={index} className="flex items-center">
                              <ArrowTrendingUpIcon className="w-3 h-3 text-blue-500 mr-2" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Segments Tab */}
          {activeTab === 'segments' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {segments.map((segment) => (
                  <div key={segment.id} className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{segment.name}</h3>
                        <span className="text-sm text-green-600 font-medium">+%{segment.growth}</span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Müşteri Sayısı:</span>
                          <span className="text-sm font-medium text-gray-900">{segment.size.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Toplam Değer:</span>
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(segment.value)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Büyüme Oranı:</span>
                          <span className="text-sm font-medium text-green-600">+%{segment.growth}</span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Özellikler:</h4>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {segment.characteristics.map((char, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {char}
                            </span>
                          ))}
                        </div>
                        
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Öneriler:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {segment.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-center">
                              <LightBulbIcon className="w-3 h-3 text-yellow-500 mr-2" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Önerileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Satış Optimizasyonu</h4>
                      <p className="text-sm text-green-700">Müşteri segmentlerine göre fiyatlandırma stratejisi uygulayın</p>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Pazarlama Kampanyası</h4>
                      <p className="text-sm text-blue-700">Genç profesyoneller için sosyal medya odaklı kampanya başlatın</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Stok Yönetimi</h4>
                      <p className="text-sm text-purple-700">Elektronik kategorisinde stok seviyelerini artırın</p>
                    </div>
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <h4 className="font-medium text-orange-900 mb-2">Müşteri Hizmetleri</h4>
                      <p className="text-sm text-orange-700">Premium müşteriler için VIP destek hattı oluşturun</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}

