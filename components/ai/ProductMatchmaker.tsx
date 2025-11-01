"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, Target, CheckCircle2, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface MatchResult {
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  matchScore: number;
  reasons: string[];
  category: string;
}

export default function ProductMatchmaker() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [userProfile, setUserProfile] = useState<{
    interests: string[];
    budget: { min: number; max: number };
    preferences: string[];
  } | null>(null);

  useEffect(() => {
    // Mock: Analyze user behavior and create profile
    analyzeUserProfile();
  }, []);

  const analyzeUserProfile = async () => {
    setIsAnalyzing(true);

    try {
      // Get user's browsing history from localStorage
      const recentViews = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');

      // Analyze behavior
      const categories = [...recentViews, ...wishlist, ...cart]
        .map(item => item.category)
        .filter(Boolean);
      
      const popularCategory = getMostFrequent(categories);
      
      const prices = [...recentViews, ...wishlist, ...cart]
        .map(item => item.price)
        .filter(Boolean);
      
      const avgPrice = prices.length > 0 
        ? prices.reduce((a, b) => a + b, 0) / prices.length 
        : 500;

      // Create profile
      const profile = {
        interests: [popularCategory || 'electronics'],
        budget: { 
          min: avgPrice * 0.5, 
          max: avgPrice * 1.5 
        },
        preferences: ['trending', 'featured', 'high-rated'],
      };

      setUserProfile(profile);

      // Get AI recommendations
      const response = await fetch('/api/ai/match-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
      }
    } catch (error) {
      console.error('Profile analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMostFrequent = (arr: string[]) => {
    return arr.sort((a, b) =>
      arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop();
  };

  if (!matches || matches.length === 0) {
    return null;
  }

  return (
    <div className="my-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 px-6 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white font-bold text-sm">AI İLE EŞLEŞTİRİLDİ</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Sizin İçin Mükemmel Eşleşmeler
          </h2>
          <p className="text-gray-600 text-lg">
            Yapay zeka algoritmalarımız ilgi alanlarınızı analiz ederek size en uygun ürünleri buldu
          </p>
        </motion.div>

        {/* Match Score Indicator */}
        {userProfile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 flex justify-center"
          >
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-6 border-2 border-purple-200 max-w-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">AI Match Skoru</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  %{matches[0]?.matchScore || 95}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${matches[0]?.matchScore || 95}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600"
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {matches[0]?.reasons?.[0] || 'Size özel öneriler hazır'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Match Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {matches.map((match, index) => (
            <motion.div
              key={match.productId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/products/${match.productId}`}>
                <div className="bg-white rounded-2xl border-2 border-purple-100 hover:border-purple-400 hover:shadow-xl transition-all overflow-hidden group cursor-pointer">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100">
                    {match.productImage ? (
                      <Image
                        src={match.productImage}
                        alt={match.productName}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Target className="w-12 h-12" />
                      </div>
                    )}
                    
                    {/* Match Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-md opacity-75 animate-pulse" />
                        <div className="relative px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="text-xs font-bold">
                            {match.matchScore}% EŞLEŞME
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Trending Badge */}
                    {match.matchScore > 90 && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-orange-500 text-white px-2 py-1 rounded-full flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-xs font-bold">TRENDING</span>
                        </div>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-center text-white">
                        <Zap className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm font-semibold">Detayları Gör</p>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                        {match.category}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3rem]">
                      {match.productName}
                    </h3>
                    
                    {/* Match Reasons */}
                    <div className="space-y-1 mb-3">
                      {match.reasons.slice(0, 2).map((reason, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-600">{reason}</p>
                        </div>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        ₺{match.productPrice.toFixed(2)}
                      </span>
                      <ChevronRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-600 mb-3">
            Daha fazla kişiselleştirilmiş öneri için profilinizi oluşturun
          </p>
          <button
            onClick={analyzeUserProfile}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            {isAnalyzing ? 'Analiz Ediliyor...' : 'Daha Fazla Öneri'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}


