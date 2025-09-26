import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // AI istatistiklerini hesapla
    const stats = {
      totalRecommendations: 0,
      recommendationAccuracy: 0,
      userEngagement: 0,
      conversionRate: 0,
      chatbotInteractions: 0,
      averageResponseTime: 0,
      popularAlgorithms: {
        'hybrid': 0,
        'collaborative': 0,
        'content-based': 0,
        'trending': 0
      },
      userSatisfaction: 0
    };

    if (supabase) {
      // Gerçek verilerden hesapla
      const [recommendationsResult, chatbotResult, analyticsResult] = await Promise.all([
        supabase.from('ai_recommendations').select('id, algorithm_type, accuracy, created_at'),
        supabase.from('ai_chatbot_interactions').select('id, response_time, satisfaction_score, created_at'),
        supabase.from('analytics_sessions').select('id, duration, page_views, created_at')
      ]);

      const recommendations = recommendationsResult.data || [];
      const chatbotInteractions = chatbotResult.data || [];
      const analytics = analyticsResult.data || [];

      // Öneri istatistikleri
      stats.totalRecommendations = recommendations.length;
      
      // Ortalama doğruluk
      const totalAccuracy = recommendations.reduce((sum, rec) => sum + (rec.accuracy || 0), 0);
      stats.recommendationAccuracy = recommendations.length > 0 ? totalAccuracy / recommendations.length : 0;

      // Chatbot istatistikleri
      stats.chatbotInteractions = chatbotInteractions.length;
      
      // Ortalama yanıt süresi
      const totalResponseTime = chatbotInteractions.reduce((sum, chat) => sum + (chat.response_time || 0), 0);
      stats.averageResponseTime = chatbotInteractions.length > 0 ? totalResponseTime / chatbotInteractions.length : 0;

      // Kullanıcı memnuniyeti
      const totalSatisfaction = chatbotInteractions.reduce((sum, chat) => sum + (chat.satisfaction_score || 0), 0);
      stats.userSatisfaction = chatbotInteractions.length > 0 ? totalSatisfaction / chatbotInteractions.length : 0;

      // Algoritma dağılımı
      recommendations.forEach(rec => {
        const algorithm = rec.algorithm_type || 'hybrid';
        if (stats.popularAlgorithms[algorithm as keyof typeof stats.popularAlgorithms] !== undefined) {
          stats.popularAlgorithms[algorithm as keyof typeof stats.popularAlgorithms]++;
        }
      });

      // Kullanıcı etkileşimi (basit hesaplama)
      const totalSessions = analytics.length;
      const engagedSessions = analytics.filter(session => session.duration > 60).length; // 1 dakikadan uzun oturumlar
      stats.userEngagement = totalSessions > 0 ? (engagedSessions / totalSessions) * 100 : 0;

      // Dönüşüm oranı (basit hesaplama)
      const convertedSessions = analytics.filter(session => session.page_views > 5).length; // 5'ten fazla sayfa görüntüleyen oturumlar
      stats.conversionRate = totalSessions > 0 ? (convertedSessions / totalSessions) * 100 : 0;

    } else {
      // Fallback: Mock data
      stats.totalRecommendations = 15420;
      stats.recommendationAccuracy = 87.5;
      stats.userEngagement = 73.2;
      stats.conversionRate = 12.8;
      stats.chatbotInteractions = 8934;
      stats.averageResponseTime = 1.2;
      stats.popularAlgorithms = {
        'hybrid': 45,
        'collaborative': 30,
        'content-based': 20,
        'trending': 5
      };
      stats.userSatisfaction = 4.6;
    }

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('AI stats error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch AI statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
