'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface Prediction {
  id: string;
  type: 'revenue' | 'conversion' | 'churn' | 'lifetime_value' | 'demand' | 'traffic';
  title: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string;
  trend: 'up' | 'down' | 'stable';
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  riskFactors: string[];
  opportunities: string[];
}

interface ModelPerformance {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrained: string;
  status: 'active' | 'training' | 'needs_update';
}

interface PredictiveData {
  predictions: Prediction[];
  modelPerformance: ModelPerformance[];
  accuracyTrend: {
    date: string;
    accuracy: number;
  }[];
  featureImportance: {
    feature: string;
    importance: number;
  }[];
}

export default function PredictiveAnalytics() {
  const [data, setData] = useState<PredictiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedModel, setSelectedModel] = useState('all');

  useEffect(() => {
    fetchPredictiveData();
  }, [selectedTimeframe, selectedModel]);

  const fetchPredictiveData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/predictive?timeframe=${selectedTimeframe}&model=${selectedModel}`);
      
      if (response.ok) {
        const predictiveData = await response.json();
        setData(predictiveData);
      }
    } catch (error) {
      console.error('Predictive analytics fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTimeframe, selectedModel]);

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'revenue':
        return <CurrencyDollarIcon className="w-6 h-6" />;
      case 'conversion':
        return <ArrowTrendingUpIcon className="w-6 h-6" />;
      case 'churn':
        return <UserGroupIcon className="w-6 h-6" />;
      case 'lifetime_value':
        return <ChartBarIcon className="w-6 h-6" />;
      case 'demand':
        return <ShoppingCartIcon className="w-6 h-6" />;
      case 'traffic':
        return <EyeIcon className="w-6 h-6" />;
      default:
        return <ChartBarIcon className="w-6 h-6" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />;
      case 'down':
        return <ArrowTrendingDownIcon className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 bg-gray-400 rounded-full" />;
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'revenue':
      case 'lifetime_value':
        return new Intl.NumberFormat('tr-TR', {
          style: 'currency',
          currency: 'TRY',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'conversion':
      case 'churn':
        return `${value.toFixed(1)}%`;
      case 'demand':
      case 'traffic':
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
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48"></div>
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
            Tahmine Dayalı Analiz Verisi Bulunamadı
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Model eğitimi tamamlanana kadar bekleyin.
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
            Tahmine Dayalı Analiz
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            AI destekli gelecek tahminleri ve trend analizi
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="7d">Son 7 Gün</option>
            <option value="30d">Son 30 Gün</option>
            <option value="90d">Son 90 Gün</option>
            <option value="1y">Son 1 Yıl</option>
          </select>
          
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">Tüm Modeller</option>
            <option value="revenue">Gelir Modeli</option>
            <option value="conversion">Dönüşüm Modeli</option>
            <option value="churn">Churn Modeli</option>
            <option value="demand">Talep Modeli</option>
          </select>
        </div>
      </div>

      {/* Model Performance Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Model Performansı
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.modelPerformance.map((model) => (
            <div
              key={model.modelName}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {model.modelName}
                </h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  model.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : model.status === 'training'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {model.status === 'active' ? 'Aktif' : 
                   model.status === 'training' ? 'Eğitiliyor' : 'Güncelleme Gerekli'}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Doğruluk:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {(model.accuracy * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">F1 Skoru:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {model.f1Score.toFixed(3)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Son eğitim: {new Date(model.lastTrained).toLocaleDateString('tr-TR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.predictions.map((prediction) => (
          <div
            key={prediction.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                  {getPredictionIcon(prediction.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {prediction.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {prediction.timeframe}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {getTrendIcon(prediction.trend)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Mevcut:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatValue(prediction.currentValue, prediction.type)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tahmin:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatValue(prediction.predictedValue, prediction.type)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Güven:</span>
                <span className={`font-medium ${getConfidenceColor(prediction.confidence)}`}>
                  {prediction.confidence.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Etki:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(prediction.impact)}`}>
                  {prediction.impact === 'high' ? 'Yüksek' : 
                   prediction.impact === 'medium' ? 'Orta' : 'Düşük'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Öneri:
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {prediction.recommendation}
              </p>
            </div>

            {prediction.riskFactors.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500 mr-1" />
                  Risk Faktörleri:
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {prediction.riskFactors.map((risk, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {prediction.opportunities.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
                  Fırsatlar:
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {prediction.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {opportunity}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feature Importance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Özellik Önem Sıralaması
        </h3>
        <div className="space-y-3">
          {data.featureImportance.map((feature, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {index + 1}
                  </span>
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {feature.feature}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${feature.importance * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-12 text-right">
                  {(feature.importance * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
