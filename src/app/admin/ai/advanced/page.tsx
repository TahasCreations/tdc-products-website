'use client';

import { useState, useEffect } from 'react';
import { 
  CpuChipIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  SparklesIcon,
  EyeIcon,
  CogIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface AIInsight {
  id: string;
  type: 'sales' | 'customer' | 'inventory' | 'marketing' | 'finance';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  createdAt: string;
}

interface AIPrediction {
  id: string;
  category: string;
  prediction: string;
  accuracy: number;
  timeframe: string;
  dataPoints: number;
}

export default function AdvancedAIPage() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [isAIActive, setIsAIActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock AI data
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'sales',
        title: 'Satış Artış Fırsatı',
        description: 'Elektronik kategorisinde %23 artış potansiyeli tespit edildi',
        confidence: 87,
        impact: 'high',
        recommendation: 'Elektronik ürün stoklarını %30 artırın',
        createdAt: '2024-01-20T10:00:00Z'
      },
      {
        id: '2',
        type: 'customer',
        title: 'Müşteri Segmentasyonu',
        description: 'VIP müşteri grubunda yeni segmentasyon önerisi',
        confidence: 92,
        impact: 'medium',
        recommendation: 'Premium müşteri kampanyası başlatın',
        createdAt: '2024-01-20T09:30:00Z'
      }
    ];

    const mockPredictions: AIPrediction[] = [
      {
        id: '1',
        category: 'Satış Tahmini',
        prediction: 'Bu ay %15 satış artışı bekleniyor',
        accuracy: 89,
        timeframe: '30 gün',
        dataPoints: 1250
      },
      {
        id: '2',
        category: 'Stok Optimizasyonu',
        prediction: '3 ürün için stok alarmı öneriliyor',
        accuracy: 94,
        timeframe: '7 gün',
        dataPoints: 890
      }
    ];

    setTimeout(() => {
      setInsights(mockInsights);
      setPredictions(mockPredictions);
      setLoading(false);
    }, 1000);
  }, []);

  const getImpactColor = (impact: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[impact as keyof typeof colors] || colors.low;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      sales: ShoppingCartIcon,
      customer: UserGroupIcon,
      inventory: ChartBarIcon,
      marketing: DocumentTextIcon,
      finance: CurrencyDollarIcon
    };
    return icons[type as keyof typeof icons] || LightBulbIcon;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gelişmiş AI Modülü</h1>
              <p className="text-gray-600 mt-1">Makine öğrenmesi ile akıllı iş zekası</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsAIActive(!isAIActive)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isAIActive 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isAIActive ? (
                  <>
                    <PauseIcon className="w-4 h-4 mr-2 inline" />
                    AI&#39;yi Durdur
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-4 h-4 mr-2 inline" />
                    AI&#39;yi Başlat
                  </>
                )}
              </button>
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <CogIcon className="w-4 h-4 mr-2 inline" />
                Ayarlar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* AI Status */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${isAIActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <CpuChipIcon className={`w-6 h-6 ${isAIActive ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    AI Sistemi {isAIActive ? 'Aktif' : 'Pasif'}
                  </h3>
                  <p className="text-gray-600">
                    {isAIActive 
                      ? 'Makine öğrenmesi modelleri çalışıyor ve veri analizi yapıyor' 
                      : 'AI sistemi durdurulmuş durumda'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isAIActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-600">
                  {isAIActive ? 'Çalışıyor' : 'Durduruldu'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <SparklesIcon className="w-6 h-6 text-blue-600 mr-2" />
            AI Öngörüleri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.map((insight) => {
              const Icon = getTypeIcon(insight.type);
              return (
                <div key={insight.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                      {insight.impact === 'high' ? 'Yüksek' : insight.impact === 'medium' ? 'Orta' : 'Düşük'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Güven Skoru:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${insight.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{insight.confidence}%</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Öneri:</strong> {insight.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Predictions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <ChartBarIcon className="w-6 h-6 text-green-600 mr-2" />
            AI Tahminleri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {predictions.map((prediction) => (
              <div key={prediction.id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{prediction.category}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${prediction.accuracy}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{prediction.accuracy}%</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{prediction.prediction}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Zaman Dilimi: {prediction.timeframe}</span>
                  <span>Veri Noktası: {prediction.dataPoints}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Müşteri Analizi</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Müşteri davranışlarını analiz ederek kişiselleştirilmiş öneriler sunar
            </p>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Analizi Başlat
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Satış Optimizasyonu</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Satış verilerini analiz ederek fiyat ve stok optimizasyonu önerir
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Optimizasyonu Başlat
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">İçerik Üretimi</h3>
            </div>
            <p className="text-gray-600 mb-4">
              AI ile otomatik blog yazıları, ürün açıklamaları ve pazarlama içerikleri üretir
            </p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              İçerik Üret
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
