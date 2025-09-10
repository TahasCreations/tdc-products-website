'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './Toast';

interface AIPrediction {
  type: 'sales' | 'inventory' | 'pricing' | 'customer';
  confidence: number;
  prediction: any;
  reasoning: string;
  recommendations: string[];
}

interface AIConversation {
  id: string;
  message: string;
  response: string;
  timestamp: Date;
  context: any;
}

export default function AdvancedAISystem() {
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const { addToast } = useToast();

  // AI Sales Prediction
  const predictSales = useCallback(async (period: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/predictions/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period, includeReasoning: true })
      });

      const data = await response.json();
      
      const prediction: AIPrediction = {
        type: 'sales',
        confidence: data.confidence,
        prediction: data.prediction,
        reasoning: data.reasoning,
        recommendations: data.recommendations
      };

      setPredictions(prev => [prediction, ...prev]);
      addToast({
        type: 'success',
        title: 'Satış Tahmini Tamamlandı',
        message: `%${data.confidence} güvenle ${data.prediction.totalSales} TL tahmin edildi`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'AI Tahmin Hatası',
        message: 'Satış tahmini oluşturulamadı'
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [addToast]);

  // AI Inventory Optimization
  const optimizeInventory = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/predictions/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      const prediction: AIPrediction = {
        type: 'inventory',
        confidence: data.confidence,
        prediction: data.optimization,
        reasoning: data.reasoning,
        recommendations: data.recommendations
      };

      setPredictions(prev => [prediction, ...prev]);
      addToast({
        type: 'success',
        title: 'Stok Optimizasyonu Tamamlandı',
        message: `${data.optimization.itemsToReorder.length} ürün için sipariş önerisi`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Stok Optimizasyon Hatası',
        message: 'Stok analizi tamamlanamadı'
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [addToast]);

  // AI Dynamic Pricing
  const optimizePricing = useCallback(async (productId?: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/predictions/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, includeCompetitorAnalysis: true })
      });

      const data = await response.json();
      
      const prediction: AIPrediction = {
        type: 'pricing',
        confidence: data.confidence,
        prediction: data.pricing,
        reasoning: data.reasoning,
        recommendations: data.recommendations
      };

      setPredictions(prev => [prediction, ...prev]);
      addToast({
        type: 'success',
        title: 'Fiyat Optimizasyonu Tamamlandı',
        message: `${data.pricing.optimizedProducts.length} ürün için fiyat önerisi`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Fiyat Optimizasyon Hatası',
        message: 'Fiyat analizi tamamlanamadı'
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [addToast]);

  // AI Customer Segmentation
  const analyzeCustomers = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/predictions/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      const prediction: AIPrediction = {
        type: 'customer',
        confidence: data.confidence,
        prediction: data.segmentation,
        reasoning: data.reasoning,
        recommendations: data.recommendations
      };

      setPredictions(prev => [prediction, ...prev]);
      addToast({
        type: 'success',
        title: 'Müşteri Analizi Tamamlandı',
        message: `${data.segmentation.segments.length} müşteri segmenti tespit edildi`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Müşteri Analiz Hatası',
        message: 'Müşteri segmentasyonu tamamlanamadı'
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [addToast]);

  // AI Natural Language Query
  const processNaturalQuery = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query,
          context: {
            userRole: 'admin',
            currentPage: 'dashboard',
            recentActions: []
          }
        })
      });

      const data = await response.json();
      
      const conversation: AIConversation = {
        id: Date.now().toString(),
        message: query,
        response: data.response,
        timestamp: new Date(),
        context: data.context
      };

      setConversations(prev => [conversation, ...prev]);
      setCurrentQuery('');
    } catch (error) {
      addToast({
        type: 'error',
        title: 'AI Sorgu Hatası',
        message: 'Sorgunuz işlenemedi'
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [addToast]);

  return (
    <div className="space-y-6">
      {/* AI Query Interface */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <i className="ri-brain-line text-3xl text-purple-600 mr-3"></i>
          AI İş Zekası Sistemi
        </h2>
        
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              placeholder="AI'ya soru sorun: 'Bu ay satışlarım nasıl olacak?'"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && processNaturalQuery(currentQuery)}
            />
            <button
              onClick={() => processNaturalQuery(currentQuery)}
              disabled={isAnalyzing || !currentQuery.trim()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {isAnalyzing ? 'Analiz Ediliyor...' : 'Sorgula'}
            </button>
          </div>
        </div>

        {/* AI Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => predictSales('30days')}
            disabled={isAnalyzing}
            className="p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center mb-2">
              <i className="ri-line-chart-line text-2xl text-blue-600 mr-2"></i>
              <span className="font-semibold text-blue-900">Satış Tahmini</span>
            </div>
            <p className="text-sm text-blue-700">30 günlük satış tahmini</p>
          </button>

          <button
            onClick={optimizeInventory}
            disabled={isAnalyzing}
            className="p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center mb-2">
              <i className="ri-box-3-line text-2xl text-green-600 mr-2"></i>
              <span className="font-semibold text-green-900">Stok Optimizasyonu</span>
            </div>
            <p className="text-sm text-green-700">AI ile stok seviyesi analizi</p>
          </button>

          <button
            onClick={() => optimizePricing()}
            disabled={isAnalyzing}
            className="p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center mb-2">
              <i className="ri-price-tag-3-line text-2xl text-orange-600 mr-2"></i>
              <span className="font-semibold text-orange-900">Fiyat Optimizasyonu</span>
            </div>
            <p className="text-sm text-orange-700">Dinamik fiyatlandırma</p>
          </button>

          <button
            onClick={analyzeCustomers}
            disabled={isAnalyzing}
            className="p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center mb-2">
              <i className="ri-user-heart-line text-2xl text-purple-600 mr-2"></i>
              <span className="font-semibold text-purple-900">Müşteri Analizi</span>
            </div>
            <p className="text-sm text-purple-700">Müşteri segmentasyonu</p>
          </button>
        </div>
      </div>

      {/* AI Predictions Display */}
      {predictions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Tahminleri ve Öneriler</h3>
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <i className={`ri-${prediction.type === 'sales' ? 'line-chart' : 
                      prediction.type === 'inventory' ? 'box-3' : 
                      prediction.type === 'pricing' ? 'price-tag-3' : 'user-heart'}-line text-xl mr-2`}></i>
                    <span className="font-semibold text-gray-900">
                      {prediction.type === 'sales' ? 'Satış Tahmini' :
                       prediction.type === 'inventory' ? 'Stok Optimizasyonu' :
                       prediction.type === 'pricing' ? 'Fiyat Optimizasyonu' : 'Müşteri Analizi'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${prediction.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      %{prediction.confidence} güven
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>AI Açıklaması:</strong> {prediction.reasoning}
                  </p>
                </div>

                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 mb-2">Öneriler:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {prediction.recommendations.map((rec, recIndex) => (
                      <li key={recIndex} className="text-sm text-gray-600">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Conversations */}
      {conversations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Sohbet Geçmişi</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {conversations.map((conversation) => (
              <div key={conversation.id} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-2">
                  <div className="flex items-center mb-2">
                    <i className="ri-user-line text-blue-600 mr-2"></i>
                    <span className="font-medium text-gray-900">Sizin Sorunuz:</span>
                  </div>
                  <p className="text-gray-700 ml-6">{conversation.message}</p>
                </div>
                
                <div className="mb-2">
                  <div className="flex items-center mb-2">
                    <i className="ri-robot-line text-purple-600 mr-2"></i>
                    <span className="font-medium text-gray-900">AI Yanıtı:</span>
                  </div>
                  <p className="text-gray-700 ml-6">{conversation.response}</p>
                </div>
                
                <div className="text-xs text-gray-500 ml-6">
                  {conversation.timestamp.toLocaleString('tr-TR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
