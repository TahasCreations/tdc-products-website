import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Server-side Supabase client
const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    if (productId) {
      // Tek ürün için fiyat optimizasyonu
      const optimization = await getProductPriceOptimization(supabase, productId);
      return NextResponse.json({
        success: true,
        optimization
      });
    } else {
      // Tüm ürünler için fiyat optimizasyonu
      const optimizations = await getAllPriceOptimizations(supabase);
      return NextResponse.json({
        success: true,
        optimizations
      });
    }

  } catch (error) {
    console.error('Fiyat optimizasyonu hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Fiyat optimizasyonu oluşturulamadı' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { productId, newPrice } = await request.json();

    if (!productId || !newPrice) {
      return NextResponse.json({ 
        success: false, 
        error: 'Ürün ID ve yeni fiyat gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    // Ürün fiyatını güncelle
    const { error } = await supabase
      .from('products')
      .update({ 
        price: newPrice,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Fiyat güncellenemedi' 
      }, { status: 500 });
    }

    // Fiyat değişikliğini logla
    await supabase
      .from('price_changes')
      .insert([{
        product_id: productId,
        old_price: 0, // Önceki fiyatı almak için ayrı sorgu gerekir
        new_price: newPrice,
        change_reason: 'AI Optimization',
        created_at: new Date().toISOString()
      }]);

    return NextResponse.json({
      success: true,
      message: 'Fiyat başarıyla güncellendi'
    });

  } catch (error) {
    console.error('Fiyat güncelleme hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Fiyat güncellenemedi' 
    }, { status: 500 });
  }
}

async function getProductPriceOptimization(supabase: any, productId: string) {
  // Ürün bilgilerini al
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (!product) {
    throw new Error('Ürün bulunamadı');
  }

  // Ürünün satış geçmişini al
  const { data: salesHistory } = await supabase
    .from('order_items')
    .select(`
      quantity,
      price,
      orders!inner(created_at)
    `)
    .eq('product_id', productId)
    .gte('orders.created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()); // Son 90 gün

  // Rakip analizi (aynı kategorideki ürünler)
  const { data: competitors } = await supabase
    .from('products')
    .select('price')
    .eq('category', product.category)
    .neq('id', productId)
    .eq('is_active', true);

  // Fiyat optimizasyonu hesapla
  const optimization = calculatePriceOptimization(product, salesHistory || [], competitors || []);

  return optimization;
}

async function getAllPriceOptimizations(supabase: any) {
  // Aktif ürünleri al
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .limit(20); // Performans için limit

  const optimizations = [];

  for (const product of products || []) {
    try {
      const optimization = await getProductPriceOptimization(supabase, product.id);
      optimizations.push(optimization);
    } catch (error) {
      console.error(`Ürün ${product.id} için optimizasyon hatası:`, error);
    }
  }

  return optimizations;
}

function calculatePriceOptimization(product: any, salesHistory: any[], competitors: any[]) {
  const currentPrice = product.price;
  
  // Rakip fiyat analizi
  const competitorPrices = competitors.map(c => c.price);
  const averageCompetitorPrice = competitorPrices.length > 0 
    ? competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length 
    : currentPrice;

  // Talep esnekliği hesapla (basit versiyon)
  const totalSales = salesHistory.reduce((sum, sale) => sum + sale.quantity, 0);
  const averagePrice = salesHistory.length > 0 
    ? salesHistory.reduce((sum, sale) => sum + sale.price, 0) / salesHistory.length 
    : currentPrice;

  // Fiyat önerisi hesapla
  let recommendedPrice = currentPrice;
  let reasoning = 'Mevcut fiyat optimal görünüyor';

  if (competitorPrices.length > 0) {
    const minCompetitorPrice = Math.min(...competitorPrices);
    const maxCompetitorPrice = Math.max(...competitorPrices);
    
    if (currentPrice > maxCompetitorPrice * 1.1) {
      // Fiyat çok yüksek
      recommendedPrice = maxCompetitorPrice * 0.95;
      reasoning = 'Rakip analizi: Fiyat çok yüksek, rekabetçi fiyata düşürülmeli';
    } else if (currentPrice < minCompetitorPrice * 0.9) {
      // Fiyat çok düşük
      recommendedPrice = minCompetitorPrice * 1.05;
      reasoning = 'Rakip analizi: Fiyat çok düşük, karlılık artırılabilir';
    } else {
      // Fiyat uygun, küçük optimizasyon
      recommendedPrice = averageCompetitorPrice;
      reasoning = 'Rakip analizi: Pazar ortalamasına göre optimizasyon';
    }
  }

  // Talep analizi
  const priceChange = recommendedPrice - currentPrice;
  const priceChangePercent = (priceChange / currentPrice) * 100;

  // Beklenen satış ve gelir tahmini
  const elasticity = -1.2; // Varsayılan esneklik
  const expectedSalesChange = priceChangePercent * elasticity / 100;
  const currentSales = totalSales / 90; // Günlük ortalama
  const expectedSales = currentSales * (1 + expectedSalesChange);
  const expectedRevenue = expectedSales * recommendedPrice;

  // Güven skoru
  const confidence = calculateConfidence(competitors.length, salesHistory.length, totalSales);

  return {
    productId: product.id,
    currentPrice,
    recommendedPrice: Math.round(recommendedPrice * 100) / 100,
    priceChange: Math.round(priceChange * 100) / 100,
    priceChangePercent: Math.round(priceChangePercent * 100) / 100,
    expectedRevenue: Math.round(expectedRevenue * 100) / 100,
    expectedSales: Math.round(expectedSales * 100) / 100,
    confidence,
    reasoning,
    marketAnalysis: {
      competitorPrices,
      averageMarketPrice: Math.round(averageCompetitorPrice * 100) / 100,
      pricePosition: currentPrice > averageCompetitorPrice ? 'high' : 'low'
    },
    demandAnalysis: {
      elasticity,
      demandSensitivity: Math.abs(elasticity) > 1.5 ? 'high' : 'medium',
      seasonalTrend: 'stable' // Basit versiyon, gerçekte daha karmaşık hesaplama gerekir
    }
  };
}

function calculateConfidence(competitorCount: number, salesDataPoints: number, totalSales: number) {
  let confidence = 0.5; // Base confidence

  // Rakip sayısı etkisi
  if (competitorCount >= 5) confidence += 0.2;
  else if (competitorCount >= 3) confidence += 0.1;

  // Satış verisi etkisi
  if (salesDataPoints >= 20) confidence += 0.2;
  else if (salesDataPoints >= 10) confidence += 0.1;

  // Toplam satış etkisi
  if (totalSales >= 100) confidence += 0.1;

  return Math.min(confidence, 0.95); // Max %95 güven
}
