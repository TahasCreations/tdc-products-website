"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PricingOffer {
  originalPrice: number;
  personalizedPrice: number;
  discount: number;
  reason: string;
  expiry: number; // minutes until expiry
  eligibility: string;
}

interface PersonalizedPricingProps {
  productId: string;
  productPrice: number;
  userId?: string;
}

export default function PersonalizedPricing({ productId, productPrice, userId }: PersonalizedPricingProps) {
  const [offer, setOffer] = useState<PricingOffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    checkPersonalizedPricing();
  }, [productId, userId]);

  useEffect(() => {
    if (offer && offer.expiry > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [offer]);

  const checkPersonalizedPricing = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/ai/personalized-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId,
          basePrice: productPrice,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.offer) {
          setOffer(data.offer);
          setTimeLeft(data.offer.expiry * 60); // Convert to seconds
        }
      }
    } catch (error) {
      console.error('Personalized pricing error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !offer) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* VIP Price Badge */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 opacity-50 animate-pulse" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full blur-lg opacity-30 animate-ping" />
                <Crown className="w-6 h-6 relative" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wide">
                Kişiye Özel Fiyat
              </span>
            </div>
            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Price Comparison */}
          <div className="mb-4">
            <div className="flex items-baseline space-x-3 mb-2">
              <span className="text-3xl font-black">
                ₺{offer.personalizedPrice.toFixed(2)}
              </span>
              <span className="text-xl line-through text-white/70">
                ₺{offer.originalPrice.toFixed(2)}
              </span>
              <span className="px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full text-sm font-bold">
                -%{offer.discount.toFixed(0)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>{offer.reason}</span>
            </div>
          </div>

          {/* Eligibility */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-4">
            <div className="flex items-start space-x-2">
              <TrendingDown className="w-4 h-4 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold mb-1">{offer.eligibility}</p>
                <p className="text-xs text-white/90">
                  Bu fiyat sadece size özel hazırlandı
                </p>
              </div>
            </div>
          </div>

          {/* Timer */}
          {timeLeft > 0 && (
            <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-semibold">Fiyat Geçerlilik Süresi</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-white/30 rounded-full px-2 py-1">
                  <span className="text-lg font-black tabular-nums">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 py-3 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-white/90 transition-all shadow-lg"
          >
            Özel Fiyatla Satın Al
          </motion.button>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-600 flex items-center justify-center space-x-1">
          <CheckCircle2 className="w-3 h-3 text-green-600" />
          <span>Garantili en iyi fiyat</span>
        </p>
      </div>
    </motion.div>
  );
}


