export interface PriceOptimization {
  productId: string;
  currentPrice: number;
  recommendedPrice: number;
  minPrice: number;
  maxPrice: number;
  confidence: number;
  reason: string;
  expectedImpact: {
    salesChange: number; // percentage
    revenueChange: number; // percentage
  };
}

export interface MarketData {
  demandLevel: 'low' | 'medium' | 'high';
  competitorPrice: number;
  stockLevel: number;
  historicalSales: number[];
  seasonalityFactor: number;
  priceElasticity: number;
}

export class DynamicPricingEngine {
  /**
   * Optimize product price
   */
  static async optimizePrice(
    productId: string,
    currentPrice: number,
    marketData: MarketData
  ): Promise<PriceOptimization> {
    const recommendedPrice = this.calculateOptimalPrice(
      currentPrice,
      marketData
    );

    const expectedImpact = this.calculateExpectedImpact(
      currentPrice,
      recommendedPrice,
      marketData
    );

    return {
      productId,
      currentPrice,
      recommendedPrice,
      minPrice: currentPrice * 0.7,
      maxPrice: currentPrice * 1.3,
      confidence: 0.85,
      reason: this.generateReason(marketData),
      expectedImpact,
    };
  }

  /**
   * Calculate optimal price
   */
  private static calculateOptimalPrice(
    currentPrice: number,
    marketData: MarketData
  ): number {
    let price = currentPrice;

    // Adjust based on demand
    if (marketData.demandLevel === 'high') {
      price *= 1.1; // Increase 10%
    } else if (marketData.demandLevel === 'low') {
      price *= 0.9; // Decrease 10%
    }

    // Adjust based on competitor
    if (marketData.competitorPrice < currentPrice) {
      price = Math.min(price, marketData.competitorPrice * 1.05);
    }

    // Adjust based on stock
    if (marketData.stockLevel < 10) {
      price *= 1.05; // Increase for low stock
    }

    // Apply seasonality
    price *= marketData.seasonalityFactor;

    // Apply elasticity
    const elasticityAdjustment = 1 + (marketData.priceElasticity * 0.1);
    price *= elasticityAdjustment;

    return Math.round(price * 100) / 100;
  }

  /**
   * Calculate expected impact
   */
  private static calculateExpectedImpact(
    currentPrice: number,
    newPrice: number,
    marketData: MarketData
  ): { salesChange: number; revenueChange: number } {
    const priceChange = ((newPrice - currentPrice) / currentPrice) * 100;
    const salesChange = -priceChange * marketData.priceElasticity;
    const revenueChange = salesChange + priceChange;

    return {
      salesChange,
      revenueChange,
    };
  }

  /**
   * Generate reason
   */
  private static generateReason(marketData: MarketData): string {
    const reasons: string[] = [];

    if (marketData.demandLevel === 'high') {
      reasons.push('High demand detected');
    }

    if (marketData.competitorPrice < marketData.currentPrice) {
      reasons.push('Competitive pricing');
    }

    if (marketData.stockLevel < 10) {
      reasons.push('Low stock level');
    }

    return reasons.join(', ') || 'Price optimization based on market data';
  }

  /**
   * Batch optimize prices
   */
  static async batchOptimize(
    products: Array<{ id: string; price: number; marketData: MarketData }>
  ): Promise<PriceOptimization[]> {
    return Promise.all(
      products.map(p => this.optimizePrice(p.id, p.price, p.marketData))
    );
  }
}

