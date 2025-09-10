import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { period, includeReasoning } = await request.json();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Get historical sales data
    const daysBack = period === '30days' ? 30 : period === '7days' ? 7 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack * 2); // Get more data for better prediction

    const { data: salesData, error: salesError } = await supabase
      .from('orders')
      .select(`
        id,
        total_amount,
        created_at,
        status,
        order_items (
          quantity,
          price,
          products (
            name,
            category
          )
        )
      `)
      .gte('created_at', startDate.toISOString())
      .eq('status', 'completed');

    if (salesError) {
      throw salesError;
    }

    // AI Sales Prediction Algorithm
    const prediction = await generateSalesPrediction(salesData, daysBack, includeReasoning);

    return NextResponse.json(prediction);

  } catch (error) {
    console.error('Sales prediction error:', error);
    return NextResponse.json(
      { error: 'Satış tahmini oluşturulamadı' },
      { status: 500 }
    );
  }
}

async function generateSalesPrediction(salesData: any[], daysBack: number, includeReasoning: boolean) {
  // Calculate daily sales trends
  const dailySales = salesData.reduce((acc, order) => {
    const date = new Date(order.created_at).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { total: 0, count: 0, categories: {} };
    }
    acc[date].total += parseFloat(order.total_amount) || 0;
    acc[date].count += 1;
    
    // Category analysis
    order.order_items?.forEach((item: any) => {
      const category = item.products?.category || 'Diğer';
      if (!acc[date].categories[category]) {
        acc[date].categories[category] = 0;
      }
      acc[date].categories[category] += parseFloat(item.price) * item.quantity;
    });
    
    return acc;
  }, {} as any);

  // Calculate trends
  const dates = Object.keys(dailySales).sort();
  const recentDays = dates.slice(-Math.min(14, dates.length));
  const olderDays = dates.slice(0, -Math.min(14, dates.length));

  const recentAvg = recentDays.reduce((sum, date) => sum + dailySales[date].total, 0) / recentDays.length;
  const olderAvg = olderDays.length > 0 ? 
    olderDays.reduce((sum, date) => sum + dailySales[date].total, 0) / olderDays.length : recentAvg;

  const growthRate = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

  // Seasonal adjustments (simplified)
  const currentMonth = new Date().getMonth();
  const seasonalMultiplier = getSeasonalMultiplier(currentMonth);

  // Predict future sales
  const basePrediction = recentAvg * daysBack;
  const trendAdjustment = basePrediction * (growthRate / 100);
  const seasonalAdjustment = basePrediction * (seasonalMultiplier - 1);
  
  const totalSales = basePrediction + trendAdjustment + seasonalAdjustment;
  const confidence = calculateConfidence(salesData.length, growthRate, daysBack);

  // Category predictions
  const categoryPredictions = predictCategorySales(dailySales, daysBack, growthRate);

  const prediction = {
    totalSales: Math.round(totalSales),
    dailyAverage: Math.round(recentAvg),
    growthRate: Math.round(growthRate * 100) / 100,
    confidence: Math.round(confidence),
    categoryBreakdown: categoryPredictions,
    period: daysBack,
    seasonalFactor: seasonalMultiplier,
    reasoning: includeReasoning ? generateReasoning(growthRate, seasonalMultiplier, confidence) : null,
    recommendations: generateRecommendations(growthRate, categoryPredictions, confidence)
  };

  return prediction;
}

function getSeasonalMultiplier(month: number): number {
  // Simplified seasonal adjustments for Turkish market
  const seasonalFactors = {
    0: 0.9,   // January - post-holiday dip
    1: 0.95,  // February
    2: 1.1,   // March - spring start
    3: 1.05,  // April
    4: 1.0,   // May
    5: 0.95,  // June - summer start
    6: 0.9,   // July - vacation period
    7: 0.85,  // August - vacation period
    8: 1.1,   // September - back to school
    9: 1.15,  // October
    10: 1.2,  // November - pre-holiday
    11: 1.3   // December - holiday season
  };
  
  return seasonalFactors[month as keyof typeof seasonalFactors] || 1.0;
}

function calculateConfidence(dataPoints: number, growthRate: number, period: number): number {
  let confidence = 70; // Base confidence
  
  // More data points = higher confidence
  if (dataPoints > 100) confidence += 15;
  else if (dataPoints > 50) confidence += 10;
  else if (dataPoints > 20) confidence += 5;
  
  // Stable growth rate = higher confidence
  if (Math.abs(growthRate) < 10) confidence += 10;
  else if (Math.abs(growthRate) < 20) confidence += 5;
  
  // Shorter periods = higher confidence
  if (period <= 7) confidence += 10;
  else if (period <= 30) confidence += 5;
  
  return Math.min(95, Math.max(50, confidence));
}

function predictCategorySales(dailySales: any, daysBack: number, growthRate: number) {
  const categories = {} as any;
  
  Object.values(dailySales).forEach((day: any) => {
    Object.entries(day.categories).forEach(([category, amount]) => {
      if (!categories[category]) {
        categories[category] = { total: 0, days: 0 };
      }
      categories[category].total += amount as number;
      categories[category].days += 1;
    });
  });

  return Object.entries(categories).map(([category, data]: [string, any]) => ({
    category,
    currentAverage: Math.round(data.total / data.days),
    predictedTotal: Math.round((data.total / data.days) * daysBack * (1 + growthRate / 100)),
    growthTrend: growthRate > 0 ? 'artış' : growthRate < 0 ? 'azalış' : 'stabil'
  }));
}

function generateReasoning(growthRate: number, seasonalFactor: number, confidence: number): string {
  let reasoning = `Tahmin %${confidence} güvenle oluşturuldu. `;
  
  if (growthRate > 5) {
    reasoning += `Son dönemde %${growthRate.toFixed(1)} büyüme trendi gözlemlendi. `;
  } else if (growthRate < -5) {
    reasoning += `Son dönemde %${Math.abs(growthRate).toFixed(1)} azalma trendi gözlemlendi. `;
  } else {
    reasoning += `Satışlar stabil seyrediyor. `;
  }
  
  if (seasonalFactor > 1.1) {
    reasoning += `Mevsimsel faktörler satışları olumlu etkileyecek. `;
  } else if (seasonalFactor < 0.9) {
    reasoning += `Mevsimsel faktörler satışları olumsuz etkileyecek. `;
  }
  
  return reasoning;
}

function generateRecommendations(growthRate: number, categoryPredictions: any[], confidence: number): string[] {
  const recommendations = [];
  
  if (growthRate > 10) {
    recommendations.push('Yüksek büyüme trendi devam ediyor, stok seviyelerini artırın');
  } else if (growthRate < -10) {
    recommendations.push('Satış düşüşü var, pazarlama kampanyalarını gözden geçirin');
  }
  
  if (confidence < 70) {
    recommendations.push('Daha fazla veri toplamak için tahmin güvenilirliğini artırın');
  }
  
  const topCategory = categoryPredictions.reduce((max, cat) => 
    cat.predictedTotal > max.predictedTotal ? cat : max, categoryPredictions[0]);
  
  if (topCategory) {
    recommendations.push(`${topCategory.category} kategorisinde en yüksek satış bekleniyor`);
  }
  
  recommendations.push('Tahminleri düzenli olarak güncelleyin ve gerçek sonuçlarla karşılaştırın');
  
  return recommendations;
}
