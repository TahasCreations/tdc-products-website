'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Lazy load heavy AI components
const AIRecommendationEngine = dynamic(() => import('../../../components/ai/AIRecommendationEngine'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
  ssr: false
});

const AIChatbot = dynamic(() => import('../../../components/ai/AIChatbot'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />,
  ssr: false
});
import AdminProtection from '../../../components/AdminProtection';
import { 
  SparklesIcon,
  CpuChipIcon,
  ChartBarIcon,
  UserGroupIcon,
  LightBulbIcon,
  CogIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

interface AIStats {
  totalRecommendations: number;
  recommendationAccuracy: number;
  userEngagement: number;
  conversionRate: number;
  chatbotInteractions: number;
  averageResponseTime: number;
  popularAlgorithms: Record<string, number>;
  userSatisfaction: number;
}

interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'warning';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionRequired: boolean;
  createdAt: string;
}

export default function AdminAIPage() {
  const [stats, setStats] = useState<AIStats | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'chatbot' | 'analytics' | 'settings'>('overview');

  useEffect(() => {
    fetchAIStats();
    fetchAIInsights();
  }, []);

  const fetchAIStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        // Fallback: Mock data
        setStats({
          totalRecommendations: 15420,
          recommendationAccuracy: 87.5,
          userEngagement: 73.2,
          conversionRate: 12.8,
          chatbotInteractions: 8934,
          averageResponseTime: 1.2,
          popularAlgorithms: {
            'hybrid': 45,
            'collaborative': 30,
            'content-based': 20,
            'trending': 5
          },
          userSatisfaction: 4.6
        });
      }
    } catch (error) {
      console.error('Error fetching AI stats:', error);
      // Mock data for demo
      setStats({
        totalRecommendations: 15420,
        recommendationAccuracy: 87.5,
        userEngagement: 73.2,
        conversionRate: 12.8,
        chatbotInteractions: 8934,
        averageResponseTime: 1.2,
        popularAlgorithms: {
          'hybrid': 45,
          'collaborative': 30,
          'content-based': 20,
          'trending': 5
        },
        userSatisfaction: 4.6
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAIInsights = async () => {
    try {
      const response = await fetch('/api/ai/insights');
      const data = await response.json();
      
      if (data.success) {
        setInsights(data.data || []);
      } else {
        // Fallback: Mock data
        setInsights([
          {
            id: '1',
            type: 'trend',
            title: 'Kullanıcı Tercihleri Değişiyor',
            description: 'Son 30 günde kullanıcıların %23\'ü daha fazla mobil cihaz kullanmaya başladı',
            impact: 'high',
            confidence: 89,
            actionRequired: true,
            createdAt: '2024-01-20T10:00:00Z'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      // Mock insights for demo
      setInsights([
        {
          id: '1',
          type: 'opportunity',
          title: 'Yeni Kategori Keşfi',
          description: 'Kullanıcılar "gaming" kategorisinde artan ilgi gösteriyor. Bu kategoriye odaklanarak %15 daha fazla satış elde edebilirsiniz.',
          impact: 'high',
          confidence: 89,
          actionRequired: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'trend',
          title: 'Fiyat Hassasiyeti Artışı',
          description: 'Son 30 günde kullanıcıların fiyat hassasiyeti %12 arttı. İndirim kampanyaları daha etkili olabilir.',
          impact: 'medium',
          confidence: 76,
          actionRequired: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          type: 'anomaly',
          title: 'Anormal Satış Düşüşü',
          description: 'Elektronik kategorisinde beklenmeyen satış düşüşü tespit edildi. Rekabet analizi önerilir.',
          impact: 'high',
          confidence: 92,
          actionRequired: true,
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <ArrowTrendingUpIcon className="w-5 h-5" />;
      case 'anomaly': return <EyeIcon className="w-5 h-5" />;
      case 'opportunity': return <LightBulbIcon className="w-5 h-5" />;
      case 'warning': return <CogIcon className="w-5 h-5" />;
      default: return <ChartBarIcon className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return 'text-blue-600 bg-blue-100';
      case 'anomaly': return 'text-orange-600 bg-orange-100';
      case 'opportunity': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-red-600 bg-red-100';
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Yönetimi</h1>
          <p className="text-gray-600 mt-2">Yapay zeka sistemlerini yönetin ve analiz edin</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <SparklesIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Öneri</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRecommendations.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Öneri Doğruluğu</p>
                  <p className="text-2xl font-bold text-gray-900">%{stats.recommendationAccuracy}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserGroupIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Kullanıcı Etkileşimi</p>
                  <p className="text-2xl font-bold text-gray-900">%{stats.userEngagement}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <ShoppingBagIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Dönüşüm Oranı</p>
                  <p className="text-2xl font-bold text-gray-900">%{stats.conversionRate}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Genel Bakış', icon: ChartBarIcon },
                { id: 'recommendations', name: 'Öneri Sistemi', icon: SparklesIcon },
                { id: 'chatbot', name: 'Chatbot', icon: ChatBubbleLeftRightIcon },
                { id: 'analytics', name: 'Analitik', icon: CpuChipIcon },
                { id: 'settings', name: 'Ayarlar', icon: CogIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">AI Sistem Genel Bakış</h3>
                
                {/* AI Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">AI İçgörüleri</h4>
                    <div className="space-y-4">
                      {insights.map((insight) => (
                        <div key={insight.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-lg mr-3 ${getInsightColor(insight.type)}`}>
                                {getInsightIcon(insight.type)}
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{insight.title}</h5>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(insight.impact)}`}>
                                    {insight.impact}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    %{insight.confidence} güven
                                  </span>
                                </div>
                              </div>
                            </div>
                            {insight.actionRequired && (
                              <span className="text-xs text-red-600 font-semibold">Aksiyon Gerekli</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{insight.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Algoritma Dağılımı</h4>
                    <div className="space-y-3">
                      {stats && Object.entries(stats.popularAlgorithms).map(([algorithm, percentage]) => (
                        <div key={algorithm} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 capitalize">{algorithm}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">%{percentage}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <h5 className="font-semibold text-gray-900 mb-3">Performans Metrikleri</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Chatbot Etkileşimi</p>
                          <p className="text-lg font-bold text-gray-900">{stats?.chatbotInteractions.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Ort. Yanıt Süresi</p>
                          <p className="text-lg font-bold text-gray-900">{stats?.averageResponseTime}s</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Kullanıcı Memnuniyeti</p>
                          <p className="text-lg font-bold text-gray-900">{stats?.userSatisfaction}/5</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Dönüşüm Oranı</p>
                          <p className="text-lg font-bold text-gray-900">%{stats?.conversionRate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">AI Öneri Sistemi</h3>
                <AIRecommendationEngine limit={8} showReasons={true} showConfidence={true} />
              </div>
            )}

            {activeTab === 'chatbot' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">AI Chatbot Yönetimi</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">Chatbot Test</h4>
                    <div className="h-96 bg-white rounded-lg border border-gray-200 p-4">
                      <AIChatbot 
                        context={{ userType: 'admin' }}
                        position="bottom-right"
                        theme="light"
                        language="tr"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Chatbot İstatistikleri</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Toplam Konuşma</span>
                          <span className="font-semibold">{stats?.chatbotInteractions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ortalama Yanıt Süresi</span>
                          <span className="font-semibold">{stats?.averageResponseTime}s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Çözüm Oranı</span>
                          <span className="font-semibold">%87</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Kullanıcı Memnuniyeti</span>
                          <span className="font-semibold">{stats?.userSatisfaction}/5</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">En Popüler Sorular</h4>
                      <div className="space-y-2">
                        {[
                          'Ürün önerisi ver',
                          'Sepetimdeki ürünleri göster',
                          'Kampanyaları listele',
                          'Sipariş durumu sorgula',
                          'İade işlemi nasıl yapılır?'
                        ].map((question, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{question}</span>
                            <span className="text-xs text-gray-500">{Math.floor(Math.random() * 1000)} kez</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">AI Analitikleri</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Öneri Performansı</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Hibrit Algoritma</span>
                          <span className="text-sm font-medium">%45</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">İşbirlikçi Filtreleme</span>
                          <span className="text-sm font-medium">%30</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">İçerik Tabanlı</span>
                          <span className="text-sm font-medium">%20</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Trend Ürünler</span>
                          <span className="text-sm font-medium">%5</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Kullanıcı Segmentasyonu</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-blue-900">Yüksek Değerli Müşteriler</p>
                          <p className="text-sm text-blue-700">Premium ürünlere ilgi gösteren</p>
                        </div>
                        <span className="text-lg font-bold text-blue-900">23%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-green-900">Fiyat Bilinçli</p>
                          <p className="text-sm text-green-700">İndirimleri takip eden</p>
                        </div>
                        <span className="text-lg font-bold text-green-900">34%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <p className="font-medium text-purple-900">Trend Takipçileri</p>
                          <p className="text-sm text-purple-700">Yeni ürünleri seven</p>
                        </div>
                        <span className="text-lg font-bold text-purple-900">28%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <p className="font-medium text-orange-900">Sadık Müşteriler</p>
                          <p className="text-sm text-orange-700">Düzenli alışveriş yapan</p>
                        </div>
                        <span className="text-lg font-bold text-orange-900">15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">AI Ayarları</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Öneri Sistemi</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">AI Önerileri Etkin</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Gerçek Zamanlı Öneriler</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Kişiselleştirme</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Öneri Sayısı
                        </label>
                        <input
                          type="number"
                          defaultValue="8"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Chatbot Ayarları</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Chatbot Etkin</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Otomatik Yanıtlar</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Çok Dilli Destek</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Yanıt Süresi (saniye)
                        </label>
                        <input
                          type="number"
                          defaultValue="2"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </AdminProtection>
  );
}
