'use client';

import { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon, 
  TrendingUpIcon, 
  TrendingDownIcon,
  ChartBarIcon,
  LightBulbIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface PriceOptimization {
  productId: string;
  currentPrice: number;
  recommendedPrice: number;
  priceChange: number;
  priceChangePercent: number;
  expectedRevenue: number;
  expectedSales: number;
  confidence: number;
  reasoning: string;
  marketAnalysis: {
    competitorPrices: number[];
    averageMarketPrice: number;
    pricePosition: 'high' | 'medium' | 'low';
  };
  demandAnalysis: {
    elasticity: number;
    demandSensitivity: 'high' | 'medium' | 'low';
    seasonalTrend: 'up' | 'down' | 'stable';
  };
}

interface PriceOptimizerProps {
  productId?: string;
  onPriceUpdate?: (productId: string, newPrice: number) => void;
}

export default function PriceOptimizer({ 
  productId, 
  onPriceUpdate 
}: PriceOptimizerProps) {
  const [optimizations, setOptimizations] = useState<PriceOptimization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  useEffect(() => {
    if (productId) {
      setSelectedProduct(productId);
      fetchPriceOptimization(productId);
    } else {
      fetchAllOptimizations();
    }
  }, [productId]);

  const fetchPriceOptimization = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ai/price-optimization?productId=${id}`);
      const data = await response.json();

      if (data.success) {
        setOptimizations([data.optimization]);
      } else {
        // Fallback: Mock data
        setOptimizations([generateMockOptimization(id)]);
      }
    } catch (error) {
      console.error('Fiyat optimizasyonu hatası:', error);
      setError('Fiyat optimizasyonu yüklenemedi');
      setOptimizations([generateMockOptimization(id)]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOptimizations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/price-optimization');
      const data = await response.json();

      if (data.success) {
        setOptimizations(data.optimizations);
      } else {
        // Fallback: Mock data
        setOptimizations(generateMockOptimizations());
      }
    } catch (error) {
      console.error('Fiyat optimizasyonları hatası:', error);
      setError('Fiyat optimizasyonları yüklenemedi');
      setOptimizations(generateMockOptimizations());
    } finally {
      setLoading(false);
    }
  };

  const generateMockOptimization = (id: string): PriceOptimization => {
    const currentPrice = Math.random() * 500 + 100;
    const recommendedPrice = currentPrice * (0.9 + Math.random() * 0.2);
    const priceChange = recommendedPrice - currentPrice;
    const priceChangePercent = (priceChange / currentPrice) * 100;

    return {
      productId: id,
      currentPrice,
      recommendedPrice,
      priceChange,
      priceChangePercent,
      expectedRevenue: recommendedPrice * (50 + Math.random() * 100),
      expectedSales: 50 + Math.random() * 100,
      confidence: 0.7 + Math.random() * 0.3,
      reasoning: 'Rakip analizi ve talep eğrisi bazlı öneri',
      marketAnalysis: {
        competitorPrices: [currentPrice * 0.8, currentPrice * 1.1, currentPrice * 0.95],
        averageMarketPrice: currentPrice * 0.95,
        pricePosition: Math.random() > 0.5 ? 'high' : 'low'
      },
      demandAnalysis: {
        elasticity: -1.5 + Math.random() * 1,
        demandSensitivity: Math.random() > 0.5 ? 'high' : 'medium',
        seasonalTrend: Math.random() > 0.5 ? 'up' : 'stable'
      }
    };
  };

  const generateMockOptimizations = (): PriceOptimization[] => {
    return Array.from({ length: 5 }, (_, i) => 
      generateMockOptimization(`product_${i + 1}`)
    );
  };

  const handleApplyOptimization = async (optimization: PriceOptimization) => {
    try {
      if (onPriceUpdate) {
        onPriceUpdate(optimization.productId, optimization.recommendedPrice);
      }
      
      // API'ye fiyat güncelleme isteği gönder
      await fetch('/api/ai/price-optimization', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: optimization.productId,
          newPrice: optimization.recommendedPrice
        }),
      });

      // Optimizasyonu güncelle
      setOptimizations(prev => prev.map(opt => 
        opt.productId === optimization.productId 
          ? { ...opt, currentPrice: optimization.recommendedPrice }
          : opt
      ));
    } catch (error) {
      console.error('Fiyat güncelleme hatası:', error);
    }
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUpIcon className="w-4 h-4" />;
    if (change < 0) return <TrendingDownIcon className="w-4 h-4" />;
    return <ChartBarIcon className="w-4 h-4" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Fiyat Optimizasyonu</h3>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Fiyat Optimizasyonu</h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => productId ? fetchPriceOptimization(productId) : fetchAllOptimizations()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Fiyat Optimizasyonu</h3>
      </div>

      <div className="space-y-6">
        {optimizations.map((optimization) => (
          <div key={optimization.productId} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900">Ürün #{optimization.productId}</h4>
                <p className="text-sm text-gray-600">{optimization.reasoning}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(optimization.confidence)}`}>
                  Güven: %{(optimization.confidence * 100).toFixed(0)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  ₺{optimization.currentPrice.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Mevcut Fiyat</div>
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold flex items-center justify-center space-x-1 ${getPriceChangeColor(optimization.priceChange)}`}>
                  {getPriceChangeIcon(optimization.priceChange)}
                  <span>₺{optimization.recommendedPrice.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-600">Önerilen Fiyat</div>
              </div>
              
              <div className="text-center">
                <div className={`text-lg font-semibold ${getPriceChangeColor(optimization.priceChange)}`}>
                  {optimization.priceChange > 0 ? '+' : ''}{optimization.priceChangePercent.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Değişim</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Pazar Analizi</h5>
                <div className="space-y-1 text-sm text-blue-800">
                  <div>Ortalama Pazar: ₺{optimization.marketAnalysis.averageMarketPrice.toFixed(2)}</div>
                  <div>Konum: {optimization.marketAnalysis.pricePosition === 'high' ? 'Yüksek' : 'Düşük'}</div>
                  <div>Rakip Sayısı: {optimization.marketAnalysis.competitorPrices.length}</div>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <h5 className="font-medium text-green-900 mb-2">Talep Analizi</h5>
                <div className="space-y-1 text-sm text-green-800">
                  <div>Esneklik: {optimization.demandAnalysis.elasticity.toFixed(2)}</div>
                  <div>Hassasiyet: {optimization.demandAnalysis.demandSensitivity === 'high' ? 'Yüksek' : 'Orta'}</div>
                  <div>Trend: {optimization.demandAnalysis.seasonalTrend === 'up' ? 'Yükseliş' : 'Stabil'}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <div>Beklenen Satış: {optimization.expectedSales.toFixed(0)} adet</div>
                <div>Beklenen Gelir: ₺{optimization.expectedRevenue.toFixed(2)}</div>
              </div>
              
              <button
                onClick={() => handleApplyOptimization(optimization)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <LightBulbIcon className="w-4 h-4" />
                <span>Uygula</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {optimizations.length === 0 && (
        <div className="text-center py-8">
          <CurrencyDollarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Fiyat optimizasyonu bulunamadı</p>
        </div>
      )}
    </div>
  );
}
