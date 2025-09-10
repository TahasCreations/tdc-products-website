import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { productId, includeCompetitorAnalysis } = await request.json();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Get product data
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        current_price,
        cost_price,
        category,
        sales_data (
          quantity_sold,
          date,
          price_at_sale
        ),
        inventory_data (
          current_stock,
          min_stock,
          max_stock
        )
      `)
      .eq(productId ? 'id' : 'id', productId || 'id')
      .limit(productId ? 1 : 50);

    if (productError) {
      throw productError;
    }

    // AI Dynamic Pricing Algorithm
    const pricing = await generateDynamicPricing(productData, includeCompetitorAnalysis);

    return NextResponse.json(pricing);

  } catch (error) {
    console.error('Pricing optimization error:', error);
    return NextResponse.json(
      { error: 'Fiyat optimizasyonu oluşturulamadı' },
      { status: 500 }
    );
  }
}

async function generateDynamicPricing(productData: any[], includeCompetitorAnalysis: boolean) {
  const optimizedProducts = [];
  
  for (const product of productData) {
    const currentPrice = product.current_price || 0;
    const costPrice = product.cost_price || 0;
    const salesData = product.sales_data || [];
    const inventoryData = product.inventory_data || [];
    
    // Calculate sales metrics
    const totalSales = salesData.reduce((sum: number, sale: any) => sum + (sale.quantity_sold || 0), 0);
    const avgPrice = salesData.length > 0 ? 
      salesData.reduce((sum: number, sale: any) => sum + (sale.price_at_sale || currentPrice), 0) / salesData.length : 
      currentPrice;
    
    // Calculate price elasticity
    const priceChanges = salesData.filter((sale: any, index: number) => 
      index > 0 && sale.price_at_sale !== salesData[index - 1].price_at_sale
    );
    
    let priceElasticity = -1.5; // Default elasticity
    if (priceChanges.length > 0) {
      const avgPriceChange = priceChanges.reduce((sum: number, change: any) => 
        sum + Math.abs(change.price_at_sale - currentPrice), 0) / priceChanges.length;
      const avgSalesChange = priceChanges.reduce((sum: number, change: any) => 
        sum + Math.abs(change.quantity_sold - (totalSales / salesData.length)), 0) / priceChanges.length;
      
      if (avgPriceChange > 0) {
        priceElasticity = -(avgSalesChange / avgPriceChange);
      }
    }
    
    // Calculate inventory pressure
    const currentStock = inventoryData[0]?.current_stock || 0;
    const minStock = inventoryData[0]?.min_stock || 0;
    const maxStock = inventoryData[0]?.max_stock || 0;
    
    const stockPressure = currentStock <= minStock ? 1.2 : // High pressure - increase price
                        currentStock > maxStock ? 0.8 : // Low pressure - decrease price
                        1.0; // Normal pressure
    
    // Calculate demand trend
    const recentSales = salesData.slice(-7); // Last 7 sales
    const olderSales = salesData.slice(-14, -7); // Previous 7 sales
    
    const recentAvg = recentSales.reduce((sum: number, sale: any) => sum + (sale.quantity_sold || 0), 0) / Math.max(recentSales.length, 1);
    const olderAvg = olderSales.reduce((sum: number, sale: any) => sum + (sale.quantity_sold || 0), 0) / Math.max(olderSales.length, 1);
    
    const demandTrend = olderAvg > 0 ? (recentAvg - olderAvg) / olderAvg : 0;
    
    // Calculate optimal price
    const baseMargin = 0.3; // 30% base margin
    const demandMultiplier = 1 + (demandTrend * 0.1); // Adjust based on demand trend
    const stockMultiplier = stockPressure;
    
    const optimalPrice = costPrice * (1 + baseMargin) * demandMultiplier * stockMultiplier;
    
    // Determine price action
    const priceChange = optimalPrice - currentPrice;
    const priceChangePercent = (priceChange / currentPrice) * 100;
    
    let action = 'maintain';
    if (priceChangePercent > 5) {
      action = 'increase';
    } else if (priceChangePercent < -5) {
      action = 'decrease';
    }
    
    // Calculate confidence
    let confidence = 70;
    if (salesData.length > 10) confidence += 10;
    if (priceChanges.length > 2) confidence += 10;
    if (Math.abs(demandTrend) > 0.1) confidence += 5;
    if (currentStock <= minStock || currentStock > maxStock) confidence += 5;
    
    confidence = Math.min(95, confidence);
    
    optimizedProducts.push({
      productId: product.id,
      productName: product.name,
      currentPrice: Math.round(currentPrice * 100) / 100,
      optimalPrice: Math.round(optimalPrice * 100) / 100,
      priceChange: Math.round(priceChange * 100) / 100,
      priceChangePercent: Math.round(priceChangePercent * 100) / 100,
      action,
      confidence,
      metrics: {
        priceElasticity: Math.round(priceElasticity * 100) / 100,
        demandTrend: Math.round(demandTrend * 100) / 100,
        stockPressure: Math.round(stockPressure * 100) / 100,
        totalSales,
        avgPrice: Math.round(avgPrice * 100) / 100
      },
      reasoning: generatePricingReasoning(action, priceChangePercent, demandTrend, stockPressure, currentStock, minStock, maxStock)
    });
  }
  
  return {
    confidence: Math.round(optimizedProducts.reduce((sum, prod) => sum + prod.confidence, 0) / optimizedProducts.length),
    pricing: {
      optimizedProducts,
      totalProducts: optimizedProducts.length,
      productsToIncrease: optimizedProducts.filter(prod => prod.action === 'increase').length,
      productsToDecrease: optimizedProducts.filter(prod => prod.action === 'decrease').length,
      productsToMaintain: optimizedProducts.filter(prod => prod.action === 'maintain').length,
      estimatedRevenueImpact: optimizedProducts.reduce((sum, prod) => {
        const impact = prod.priceChange * (prod.metrics.totalSales || 0);
        return sum + impact;
      }, 0)
    },
    reasoning: `Toplam ${optimizedProducts.length} ürün analiz edildi. ${optimizedProducts.filter(prod => prod.action === 'increase').length} ürün için fiyat artışı, ${optimizedProducts.filter(prod => prod.action === 'decrease').length} ürün için fiyat azaltma önerisi.`,
    recommendations: [
      'Yüksek talep gören ürünler için fiyat artışı düşünün',
      'Düşük stoklu ürünler için fiyat optimizasyonu yapın',
      'Düşük talep gören ürünler için promosyon fiyatları uygulayın',
      'Fiyat değişikliklerini kademeli olarak uygulayın'
    ]
  };
}

function generatePricingReasoning(action: string, priceChangePercent: number, demandTrend: number, stockPressure: number, currentStock: number, minStock: number, maxStock: number): string {
  let reasoning = '';
  
  if (action === 'increase') {
    reasoning = `Fiyat artışı öneriliyor (%${Math.abs(priceChangePercent).toFixed(1)}). `;
    if (demandTrend > 0.1) reasoning += 'Talep artışı gözlemlendi. ';
    if (stockPressure > 1.1) reasoning += 'Stok baskısı var. ';
    if (currentStock <= minStock) reasoning += 'Stok seviyesi düşük. ';
  } else if (action === 'decrease') {
    reasoning = `Fiyat azaltma öneriliyor (%${Math.abs(priceChangePercent).toFixed(1)}). `;
    if (demandTrend < -0.1) reasoning += 'Talep azalışı gözlemlendi. ';
    if (stockPressure < 0.9) reasoning += 'Stok fazlası var. ';
    if (currentStock > maxStock) reasoning += 'Stok seviyesi yüksek. ';
  } else {
    reasoning = 'Mevcut fiyat optimal seviyede. ';
    reasoning += 'Talep ve stok durumu dengeli. ';
  }
  
  return reasoning.trim();
}
