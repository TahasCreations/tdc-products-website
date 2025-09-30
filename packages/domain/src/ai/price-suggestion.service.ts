/**
 * AI-powered price suggestion service
 * Pure functions for suggesting optimal product prices
 */

export interface PriceSuggestionInput {
  category: string;
  competitorPrices: number[];
  cost: number;
  brand?: string;
  condition?: 'NEW' | 'USED' | 'REFURBISHED';
  marketTrend?: 'RISING' | 'STABLE' | 'FALLING';
  seasonality?: 'HIGH' | 'MEDIUM' | 'LOW';
  demandLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PriceSuggestionResult {
  min: number;
  max: number;
  recommended: number;
  confidence: number;
  reasoning: string[];
  marketPosition: 'PREMIUM' | 'COMPETITIVE' | 'BUDGET';
  profitMargin: number;
  competitorAnalysis: {
    average: number;
    median: number;
    lowest: number;
    highest: number;
    count: number;
  };
}

/**
 * Calculate competitor price statistics
 * Pure function - no side effects
 */
export function calculateCompetitorStats(prices: number[]): {
  average: number;
  median: number;
  lowest: number;
  highest: number;
  count: number;
} {
  if (prices.length === 0) {
    return {
      average: 0,
      median: 0,
      lowest: 0,
      highest: 0,
      count: 0
    };
  }

  const sortedPrices = [...prices].sort((a, b) => a - b);
  const count = prices.length;
  const average = prices.reduce((sum, price) => sum + price, 0) / count;
  const median = count % 2 === 0
    ? (sortedPrices[count / 2 - 1] + sortedPrices[count / 2]) / 2
    : sortedPrices[Math.floor(count / 2)];
  const lowest = sortedPrices[0];
  const highest = sortedPrices[count - 1];

  return {
    average,
    median,
    lowest,
    highest,
    count
  };
}

/**
 * Get category-specific pricing multipliers
 * Pure function - no side effects
 */
export function getCategoryMultipliers(category: string): {
  minMultiplier: number;
  maxMultiplier: number;
  recommendedMultiplier: number;
} {
  const categoryMap: Record<string, { minMultiplier: number; maxMultiplier: number; recommendedMultiplier: number }> = {
    'electronics': { minMultiplier: 1.2, maxMultiplier: 2.5, recommendedMultiplier: 1.8 },
    'clothing': { minMultiplier: 1.5, maxMultiplier: 3.0, recommendedMultiplier: 2.2 },
    'home-garden': { minMultiplier: 1.3, maxMultiplier: 2.8, recommendedMultiplier: 2.0 },
    'beauty-health': { minMultiplier: 1.4, maxMultiplier: 2.6, recommendedMultiplier: 2.0 },
    'sports': { minMultiplier: 1.2, maxMultiplier: 2.4, recommendedMultiplier: 1.8 },
    'books': { minMultiplier: 1.1, maxMultiplier: 2.0, recommendedMultiplier: 1.5 },
    'toys': { minMultiplier: 1.3, maxMultiplier: 2.5, recommendedMultiplier: 1.9 },
    'automotive': { minMultiplier: 1.1, maxMultiplier: 2.2, recommendedMultiplier: 1.6 },
    'food': { minMultiplier: 1.2, maxMultiplier: 2.0, recommendedMultiplier: 1.6 },
    'jewelry': { minMultiplier: 1.5, maxMultiplier: 4.0, recommendedMultiplier: 2.5 }
  };

  return categoryMap[category.toLowerCase()] || {
    minMultiplier: 1.3,
    maxMultiplier: 2.5,
    recommendedMultiplier: 1.9
  };
}

/**
 * Apply market trend adjustments
 * Pure function - no side effects
 */
export function applyMarketTrendAdjustment(
  basePrice: number,
  trend: 'RISING' | 'STABLE' | 'FALLING' = 'STABLE'
): number {
  const trendMultipliers = {
    'RISING': 1.05,   // 5% increase
    'STABLE': 1.0,    // No change
    'FALLING': 0.95   // 5% decrease
  };

  return basePrice * trendMultipliers[trend];
}

/**
 * Apply seasonality adjustments
 * Pure function - no side effects
 */
export function applySeasonalityAdjustment(
  basePrice: number,
  seasonality: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM'
): number {
  const seasonalityMultipliers = {
    'HIGH': 1.1,      // 10% increase
    'MEDIUM': 1.0,    // No change
    'LOW': 0.9        // 10% decrease
  };

  return basePrice * seasonalityMultipliers[seasonality];
}

/**
 * Apply demand level adjustments
 * Pure function - no side effects
 */
export function applyDemandAdjustment(
  basePrice: number,
  demand: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM'
): number {
  const demandMultipliers = {
    'HIGH': 1.08,     // 8% increase
    'MEDIUM': 1.0,    // No change
    'LOW': 0.92       // 8% decrease
  };

  return basePrice * demandMultipliers[demand];
}

/**
 * Determine market position based on price
 * Pure function - no side effects
 */
export function determineMarketPosition(
  price: number,
  competitorStats: ReturnType<typeof calculateCompetitorStats>
): 'PREMIUM' | 'COMPETITIVE' | 'BUDGET' {
  if (competitorStats.count === 0) return 'COMPETITIVE';

  const { average, median } = competitorStats;
  
  if (price > average * 1.2) return 'PREMIUM';
  if (price < average * 0.8) return 'BUDGET';
  return 'COMPETITIVE';
}

/**
 * Generate pricing reasoning
 * Pure function - no side effects
 */
export function generatePricingReasoning(
  input: PriceSuggestionInput,
  result: PriceSuggestionResult
): string[] {
  const reasoning: string[] = [];

  // Cost-based reasoning
  const costMargin = ((result.recommended - input.cost) / input.cost) * 100;
  reasoning.push(`Önerilen fiyat maliyetin %${costMargin.toFixed(1)} üzerinde`);

  // Competitor analysis
  if (result.competitorAnalysis.count > 0) {
    const competitorDiff = ((result.recommended - result.competitorAnalysis.average) / result.competitorAnalysis.average) * 100;
    if (competitorDiff > 0) {
      reasoning.push(`Rekabetçi fiyatların %${competitorDiff.toFixed(1)} üzerinde`);
    } else {
      reasoning.push(`Rekabetçi fiyatların %${Math.abs(competitorDiff).toFixed(1)} altında`);
    }
  }

  // Market position
  reasoning.push(`Pazar konumu: ${result.marketPosition}`);

  // Category-specific reasoning
  const categoryMultipliers = getCategoryMultipliers(input.category);
  reasoning.push(`${input.category} kategorisi için ${categoryMultipliers.recommendedMultiplier}x maliyet çarpanı uygulandı`);

  // Trend adjustments
  if (input.marketTrend && input.marketTrend !== 'STABLE') {
    reasoning.push(`Pazar trendi: ${input.marketTrend}`);
  }

  if (input.seasonality && input.seasonality !== 'MEDIUM') {
    reasoning.push(`Sezonluk etki: ${input.seasonality}`);
  }

  if (input.demandLevel && input.demandLevel !== 'MEDIUM') {
    reasoning.push(`Talep seviyesi: ${input.demandLevel}`);
  }

  return reasoning;
}

/**
 * Main price suggestion function
 * Pure function - no side effects, deterministic
 */
export function suggestPrice(input: PriceSuggestionInput): PriceSuggestionResult {
  // Validate input
  if (input.cost <= 0) {
    throw new Error('Cost must be greater than 0');
  }

  if (input.competitorPrices.some(price => price <= 0)) {
    throw new Error('All competitor prices must be greater than 0');
  }

  // Calculate competitor statistics
  const competitorStats = calculateCompetitorStats(input.competitorPrices);

  // Get category-specific multipliers
  const categoryMultipliers = getCategoryMultipliers(input.category);

  // Calculate base prices
  let baseMin = input.cost * categoryMultipliers.minMultiplier;
  let baseMax = input.cost * categoryMultipliers.maxMultiplier;
  let baseRecommended = input.cost * categoryMultipliers.recommendedMultiplier;

  // Apply market trend adjustment
  baseMin = applyMarketTrendAdjustment(baseMin, input.marketTrend);
  baseMax = applyMarketTrendAdjustment(baseMax, input.marketTrend);
  baseRecommended = applyMarketTrendAdjustment(baseRecommended, input.marketTrend);

  // Apply seasonality adjustment
  baseMin = applySeasonalityAdjustment(baseMin, input.seasonality);
  baseMax = applySeasonalityAdjustment(baseMax, input.seasonality);
  baseRecommended = applySeasonalityAdjustment(baseRecommended, input.seasonality);

  // Apply demand adjustment
  baseMin = applyDemandAdjustment(baseMin, input.demandLevel);
  baseMax = applyDemandAdjustment(baseMax, input.demandLevel);
  baseRecommended = applyDemandAdjustment(baseRecommended, input.demandLevel);

  // Adjust based on competitor prices if available
  if (competitorStats.count > 0) {
    const competitorInfluence = 0.3; // 30% influence from competitors
    const competitorAdjustedMin = baseMin * (1 - competitorInfluence) + competitorStats.lowest * competitorInfluence;
    const competitorAdjustedMax = baseMax * (1 - competitorInfluence) + competitorStats.highest * competitorInfluence;
    const competitorAdjustedRecommended = baseRecommended * (1 - competitorInfluence) + competitorStats.average * competitorInfluence;

    baseMin = Math.max(baseMin, competitorAdjustedMin);
    baseMax = Math.max(baseMax, competitorAdjustedMax);
    baseRecommended = Math.max(baseRecommended, competitorAdjustedRecommended);
  }

  // Ensure min < recommended < max
  const min = Math.min(baseMin, baseRecommended, baseMax);
  const max = Math.max(baseMin, baseRecommended, baseMax);
  const recommended = Math.max(min, Math.min(baseRecommended, max));

  // Calculate confidence based on data availability
  let confidence = 0.5; // Base confidence
  if (competitorStats.count > 0) confidence += 0.2;
  if (input.brand) confidence += 0.1;
  if (input.marketTrend) confidence += 0.1;
  if (input.seasonality) confidence += 0.1;
  confidence = Math.min(confidence, 1.0);

  // Determine market position
  const marketPosition = determineMarketPosition(recommended, competitorStats);

  // Calculate profit margin
  const profitMargin = ((recommended - input.cost) / recommended) * 100;

  // Create result
  const result: PriceSuggestionResult = {
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    recommended: Math.round(recommended * 100) / 100,
    confidence,
    reasoning: [],
    marketPosition,
    profitMargin: Math.round(profitMargin * 100) / 100,
    competitorAnalysis: competitorStats
  };

  // Generate reasoning
  result.reasoning = generatePricingReasoning(input, result);

  return result;
}

/**
 * Suggest price for multiple products
 * Pure function - no side effects
 */
export function suggestPricesForMultiple(
  inputs: PriceSuggestionInput[]
): PriceSuggestionResult[] {
  return inputs.map(input => suggestPrice(input));
}

/**
 * Get price suggestion summary
 * Pure function - no side effects
 */
export function getPriceSuggestionSummary(
  results: PriceSuggestionResult[]
): {
  totalProducts: number;
  averageRecommended: number;
  averageProfitMargin: number;
  marketPositionDistribution: Record<string, number>;
  averageConfidence: number;
} {
  if (results.length === 0) {
    return {
      totalProducts: 0,
      averageRecommended: 0,
      averageProfitMargin: 0,
      marketPositionDistribution: {},
      averageConfidence: 0
    };
  }

  const totalProducts = results.length;
  const averageRecommended = results.reduce((sum, r) => sum + r.recommended, 0) / totalProducts;
  const averageProfitMargin = results.reduce((sum, r) => sum + r.profitMargin, 0) / totalProducts;
  const averageConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / totalProducts;

  const marketPositionDistribution = results.reduce((acc, r) => {
    acc[r.marketPosition] = (acc[r.marketPosition] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalProducts,
    averageRecommended,
    averageProfitMargin,
    marketPositionDistribution,
    averageConfidence
  };
}

