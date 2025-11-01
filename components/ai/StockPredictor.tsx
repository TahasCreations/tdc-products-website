"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface StockPrediction {
  currentStock: number;
  predictedDepletion: number; // days
  demandForecast: number; // units/day
  restockRecommendation: number; // units
  urgency: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // percentage
}

interface StockPredictorProps {
  productId: string;
  currentStock: number;
  onRestockClick?: () => void;
}

export default function StockPredictor({ 
  productId, 
  currentStock,
  onRestockClick 
}: StockPredictorProps) {
  const [prediction, setPrediction] = useState<StockPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStockPrediction();
  }, [productId, currentStock]);

  const fetchStockPrediction = async () => {
    if (currentStock === 0) {
      setPrediction({
        currentStock: 0,
        predictedDepletion: 0,
        demandForecast: 0,
        restockRecommendation: 0,
        urgency: 'critical',
        confidence: 100,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/predict-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, currentStock }),
      });

      if (response.ok) {
        const data = await response.json();
        setPrediction(data.prediction);
      }
    } catch (error) {
      console.error('Stock prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!prediction) {
    return null;
  }

  const getUrgencyColor = () => {
    switch (prediction.urgency) {
      case 'critical':
        return 'from-red-600 to-orange-600';
      case 'high':
        return 'from-orange-600 to-yellow-600';
      case 'medium':
        return 'from-yellow-600 to-blue-600';
      case 'low':
        return 'from-green-600 to-blue-600';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getUrgencyText = () => {
    switch (prediction.urgency) {
      case 'critical':
        return 'ACİL YENİLEME GEREKLİ';
      case 'high':
        return 'Yakında Tükenecek';
      case 'medium':
        return 'Planlı Yenileme';
      case 'low':
        return 'Stok Durumu İyi';
      default:
        return 'Stok Durumu';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">AI Stok Tahmini</h3>
            <p className="text-xs text-gray-600">Yapay zeka destekli analiz</p>
          </div>
        </div>
        {isLoading && <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />}
      </div>

      {/* Urgency Badge */}
      <div className={`mb-4 p-3 bg-gradient-to-r ${getUrgencyColor()} rounded-lg`}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-bold text-sm">{getUrgencyText()}</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            {prediction.confidence}% kesin
          </span>
        </div>
      </div>

      {/* Predictions */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <p className="text-xs text-gray-600 mb-1">Mevcut Stok</p>
          <p className="text-2xl font-black text-gray-900">{prediction.currentStock}</p>
          <p className="text-xs text-gray-500">adet</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <p className="text-xs text-gray-600 mb-1">Tahmini Tükenme</p>
          <p className="text-2xl font-black text-orange-600">
            {prediction.predictedDepletion <= 0 ? 'ŞİMDİ' : prediction.predictedDepletion}
          </p>
          <p className="text-xs text-gray-500">
            {prediction.predictedDepletion <= 0 ? 'Stokta Yok' : 'gün sonra'}
          </p>
        </div>
      </div>

      {/* Demand Forecast */}
      <div className="bg-white rounded-lg p-4 border border-blue-100 mb-4">
        <p className="text-xs text-gray-600 mb-2">Günlük Talep Tahmini</p>
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-blue-50 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(prediction.demandForecast / 50 * 100, 100)}%` }}
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
            />
          </div>
          <span className="text-sm font-bold text-gray-900">
            {prediction.demandForecast.toFixed(1)} adet/gün
          </span>
        </div>
      </div>

      {/* Restock Recommendation */}
      {prediction.urgency !== 'low' && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900 mb-1">Önerilen Yenileme</p>
              <p className="text-2xl font-black text-orange-600 mb-1">
                {prediction.restockRecommendation} adet
              </p>
              <p className="text-xs text-gray-600">
                Bu miktar {Math.ceil(prediction.restockRecommendation / prediction.demandForecast)} gün yeterli olacak
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {(prediction.urgency === 'critical' || prediction.urgency === 'high') && onRestockClick && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestockClick}
          className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Hemen Yenile</span>
        </motion.button>
      )}
    </motion.div>
  );
}


