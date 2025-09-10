import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { query, context } = await request.json();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Simple AI query processing
    const response = await processAIQuery(query, context);

    return NextResponse.json(response);

  } catch (error) {
    console.error('AI query error:', error);
    return NextResponse.json(
      { error: 'AI sorgusu işlenemedi' },
      { status: 500 }
    );
  }
}

async function processAIQuery(query: string, context: any) {
  // Simple keyword-based response generation
  const lowerQuery = query.toLowerCase();
  
  let response = '';
  let contextData = {};
  
  if (lowerQuery.includes('satış') || lowerQuery.includes('sales')) {
    response = 'Bu ay toplam satışlarınız ₺125,430. Geçen aya göre %12.5 artış var. En çok satan kategoriler: Elektronik (%35), Ev & Yaşam (%28), Moda (%22).';
    contextData = {
      totalSales: 125430,
      growthRate: 12.5,
      topCategories: ['Elektronik', 'Ev & Yaşam', 'Moda']
    };
  } else if (lowerQuery.includes('müşteri') || lowerQuery.includes('customer')) {
    response = 'Toplam 1,247 aktif müşteriniz var. VIP müşteriler: 15 (%1.2), Premium: 45 (%3.6), Standard: 120 (%9.6), Basic: 200 (%16). Risk altındaki müşteriler: 35.';
    contextData = {
      totalCustomers: 1247,
      vipCustomers: 15,
      premiumCustomers: 45,
      standardCustomers: 120,
      basicCustomers: 200,
      atRiskCustomers: 35
    };
  } else if (lowerQuery.includes('stok') || lowerQuery.includes('inventory')) {
    response = 'Toplam 892 ürününüz var. Düşük stoklu: 23 ürün, Stokta olmayan: 5 ürün, Fazla stoklu: 12 ürün. Stok devir hızı: 2.3x.';
    contextData = {
      totalProducts: 892,
      lowStock: 23,
      outOfStock: 5,
      overstocked: 12,
      turnoverRate: 2.3
    };
  } else if (lowerQuery.includes('gelir') || lowerQuery.includes('revenue')) {
    response = 'Bu ay geliriniz ₺45,230. Geçen aya göre %15.3 artış. Ortalama sipariş değeri: ₺1,800. Dönüşüm oranı: %15.2.';
    contextData = {
      monthlyRevenue: 45230,
      growthRate: 15.3,
      averageOrderValue: 1800,
      conversionRate: 15.2
    };
  } else if (lowerQuery.includes('tahmin') || lowerQuery.includes('prediction')) {
    response = 'Gelecek ay için satış tahminimiz ₺138,500 (%95 güven). Stok optimizasyonu ile ₺12,000 tasarruf sağlanabilir. Müşteri churn riski: %8.';
    contextData = {
      nextMonthPrediction: 138500,
      confidence: 95,
      potentialSavings: 12000,
      churnRisk: 8
    };
  } else {
    response = 'Merhaba! Size nasıl yardımcı olabilirim? Satışlar, müşteriler, stok, gelir veya tahminler hakkında soru sorabilirsiniz.';
    contextData = {};
  }
  
  return {
    response,
    context: contextData,
    confidence: 85,
    suggestions: [
      'Satış trendlerini analiz et',
      'Müşteri segmentasyonunu göster',
      'Stok optimizasyonu öner',
      'Gelir analizi yap'
    ]
  };
}
