/**
 * Insights service - Pure functions for analytics and insights
 * Handles daily snapshots, product analytics, and competitor analysis
 */

export interface ProductData {
  id: string;
  title: string;
  price: number;
  category: string;
  tags: string[];
  views: number;
  clicks: number;
  orders: number;
  revenue: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderData {
  id: string;
  productId: string;
  amount: number;
  quantity: number;
  createdAt: Date;
}

export interface SnapshotData {
  tenantId: string;
  sellerId?: string;
  snapshotDate: Date;
  products: ProductData[];
  orders: OrderData[];
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  sessionDuration: number;
}

export interface TopProduct {
  productId: string;
  title: string;
  orders: number;
  revenue: number;
  conversionRate: number;
  rank: number;
}

export interface TopCategory {
  category: string;
  orders: number;
  revenue: number;
  productCount: number;
  rank: number;
}

export interface TopPriceRange {
  range: string;
  minPrice: number;
  maxPrice: number;
  orders: number;
  revenue: number;
  productCount: number;
  rank: number;
}

export interface TopTag {
  tag: string;
  orders: number;
  revenue: number;
  productCount: number;
  rank: number;
}

export interface CompetitorData {
  name: string;
  url: string;
  type: 'DIRECT' | 'INDIRECT' | 'MARKETPLACE' | 'BRAND';
  marketShare: number;
  totalProducts: number;
  averagePrice: number;
  priceRange: { min: number; max: number };
  commonProducts: number;
  priceAdvantage: number;
  trafficEstimate: number;
  conversionRate: number;
  customerSatisfaction: number;
  pricingStrategy: string;
  discountPattern: Record<string, any>;
}

export interface MarketAnalysis {
  totalMarketSize: number;
  ourMarketShare: number;
  competitorCount: number;
  averageMarketPrice: number;
  priceCompetitiveness: number;
  marketTrends: {
    growth: number;
    seasonality: number;
    volatility: number;
  };
  opportunities: string[];
  threats: string[];
}

/**
 * Calculate daily snapshot analytics
 */
export function calculateDailySnapshot(data: SnapshotData): {
  totalProducts: number;
  activeProducts: number;
  newProducts: number;
  updatedProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: TopProduct[];
  topCategories: TopCategory[];
  topPriceRanges: TopPriceRange[];
  topTags: TopTag[];
} {
  const { products, orders, pageViews, uniqueVisitors } = data;
  
  // Basic product metrics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.views > 0).length;
  const newProducts = products.filter(p => 
    p.createdAt.toDateString() === data.snapshotDate.toDateString()
  ).length;
  const updatedProducts = products.filter(p => 
    p.updatedAt.toDateString() === data.snapshotDate.toDateString()
  ).length;

  // Sales metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const conversionRate = uniqueVisitors > 0 ? (totalOrders / uniqueVisitors) * 100 : 0;

  // Top products
  const productStats = products.map(product => {
    const productOrders = orders.filter(o => o.productId === product.id);
    const productRevenue = productOrders.reduce((sum, order) => sum + order.amount, 0);
    const productConversionRate = product.views > 0 ? (productOrders.length / product.views) * 100 : 0;

    return {
      productId: product.id,
      title: product.title,
      orders: productOrders.length,
      revenue: productRevenue,
      conversionRate: productConversionRate,
    };
  });

  const topProducts = productStats
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 10)
    .map((product, index) => ({
      ...product,
      rank: index + 1,
    }));

  // Top categories
  const categoryStats = new Map<string, {
    orders: number;
    revenue: number;
    productCount: number;
  }>();

  products.forEach(product => {
    const productOrders = orders.filter(o => o.productId === product.id);
    const productRevenue = productOrders.reduce((sum, order) => sum + order.amount, 0);
    
    const existing = categoryStats.get(product.category) || { orders: 0, revenue: 0, productCount: 0 };
    categoryStats.set(product.category, {
      orders: existing.orders + productOrders.length,
      revenue: existing.revenue + productRevenue,
      productCount: existing.productCount + 1,
    });
  });

  const topCategories = Array.from(categoryStats.entries())
    .map(([category, stats]) => ({ category, ...stats }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 10)
    .map((category, index) => ({
      ...category,
      rank: index + 1,
    }));

  // Top price ranges
  const priceRanges = [
    { name: '0-50 TRY', min: 0, max: 50 },
    { name: '50-100 TRY', min: 50, max: 100 },
    { name: '100-250 TRY', min: 100, max: 250 },
    { name: '250-500 TRY', min: 250, max: 500 },
    { name: '500-1000 TRY', min: 500, max: 1000 },
    { name: '1000+ TRY', min: 1000, max: Infinity },
  ];

  const priceRangeStats = priceRanges.map(range => {
    const rangeProducts = products.filter(p => p.price >= range.min && p.price < range.max);
    const rangeOrders = orders.filter(o => {
      const product = products.find(p => p.id === o.productId);
      return product && product.price >= range.min && product.price < range.max;
    });
    const rangeRevenue = rangeOrders.reduce((sum, order) => sum + order.amount, 0);

    return {
      range: range.name,
      minPrice: range.min,
      maxPrice: range.max === Infinity ? 1000 : range.max,
      orders: rangeOrders.length,
      revenue: rangeRevenue,
      productCount: rangeProducts.length,
    };
  });

  const topPriceRanges = priceRangeStats
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 6)
    .map((range, index) => ({
      ...range,
      rank: index + 1,
    }));

  // Top tags
  const tagStats = new Map<string, {
    orders: number;
    revenue: number;
    productCount: number;
  }>();

  products.forEach(product => {
    const productOrders = orders.filter(o => o.productId === product.id);
    const productRevenue = productOrders.reduce((sum, order) => sum + order.amount, 0);
    
    product.tags.forEach(tag => {
      const existing = tagStats.get(tag) || { orders: 0, revenue: 0, productCount: 0 };
      tagStats.set(tag, {
        orders: existing.orders + productOrders.length,
        revenue: existing.revenue + productRevenue,
        productCount: existing.productCount + 1,
      });
    });
  });

  const topTags = Array.from(tagStats.entries())
    .map(([tag, stats]) => ({ tag, ...stats }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 10)
    .map((tag, index) => ({
      ...tag,
      rank: index + 1,
    }));

  return {
    totalProducts,
    activeProducts,
    newProducts,
    updatedProducts,
    totalOrders,
    totalRevenue,
    averageOrderValue,
    conversionRate,
    topProducts,
    topCategories,
    topPriceRanges,
    topTags,
  };
}

/**
 * Calculate product analytics for a specific period
 */
export function calculateProductAnalytics(
  productId: string,
  products: ProductData[],
  orders: OrderData[],
  periodStart: Date,
  periodEnd: Date
): {
  views: number;
  clicks: number;
  orders: number;
  revenue: number;
  conversionRate: number;
  averagePrice: number;
  priceChanges: number;
  discountRate: number;
  topTags: string[];
  tagPerformance: Record<string, number>;
} {
  const product = products.find(p => p.id === productId);
  if (!product) {
    return {
      views: 0,
      clicks: 0,
      orders: 0,
      revenue: 0,
      conversionRate: 0,
      averagePrice: 0,
      priceChanges: 0,
      discountRate: 0,
      topTags: [],
      tagPerformance: {},
    };
  }

  const periodOrders = orders.filter(o => 
    o.productId === productId &&
    o.createdAt >= periodStart &&
    o.createdAt <= periodEnd
  );

  const revenue = periodOrders.reduce((sum, order) => sum + order.amount, 0);
  const conversionRate = product.views > 0 ? (periodOrders.length / product.views) * 100 : 0;

  // Calculate price changes (simplified - would need historical data)
  const priceChanges = 0; // This would require price history tracking
  const discountRate = 0; // This would require original price tracking

  // Tag performance
  const tagPerformance: Record<string, number> = {};
  product.tags.forEach(tag => {
    tagPerformance[tag] = periodOrders.length;
  });

  const topTags = product.tags.slice(0, 5);

  return {
    views: product.views,
    clicks: product.clicks,
    orders: periodOrders.length,
    revenue,
    conversionRate,
    averagePrice: product.price,
    priceChanges,
    discountRate,
    topTags,
    tagPerformance,
  };
}

/**
 * Calculate competitor analysis
 */
export function calculateCompetitorAnalysis(
  ourData: SnapshotData,
  competitors: CompetitorData[]
): {
  marketShare: number;
  priceComparison: Record<string, any>;
  competitivePosition: string;
  recommendations: string[];
} {
  const ourRevenue = ourData.orders.reduce((sum, order) => sum + order.amount, 0);
  const totalMarketRevenue = competitors.reduce((sum, comp) => sum + comp.marketShare, 0) + ourRevenue;
  const ourMarketShare = totalMarketRevenue > 0 ? (ourRevenue / totalMarketRevenue) * 100 : 0;

  // Price comparison
  const ourAveragePrice = ourData.orders.length > 0 ? 
    ourData.orders.reduce((sum, order) => sum + order.amount, 0) / ourData.orders.length : 0;
  
  const competitorPrices = competitors.map(comp => ({
    name: comp.name,
    averagePrice: comp.averagePrice,
    priceAdvantage: ourAveragePrice - comp.averagePrice,
    priceAdvantagePercent: comp.averagePrice > 0 ? 
      ((ourAveragePrice - comp.averagePrice) / comp.averagePrice) * 100 : 0,
  }));

  // Competitive position
  let competitivePosition = 'UNKNOWN';
  if (ourMarketShare > 20) {
    competitivePosition = 'MARKET_LEADER';
  } else if (ourMarketShare > 10) {
    competitivePosition = 'STRONG_COMPETITOR';
  } else if (ourMarketShare > 5) {
    competitivePosition = 'GROWING_COMPETITOR';
  } else {
    competitivePosition = 'NICHE_PLAYER';
  }

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (ourMarketShare < 5) {
    recommendations.push('Focus on market penetration and brand awareness');
  }
  
  const priceAdvantages = competitorPrices.filter(cp => cp.priceAdvantagePercent > 0);
  if (priceAdvantages.length > 0) {
    recommendations.push('Consider competitive pricing strategies');
  }
  
  const highGrowthCompetitors = competitors.filter(c => c.trafficEstimate && c.trafficEstimate > 10000);
  if (highGrowthCompetitors.length > 0) {
    recommendations.push('Monitor high-growth competitors closely');
  }

  return {
    marketShare: ourMarketShare,
    priceComparison: {
      ourAveragePrice,
      competitorPrices,
      priceAdvantage: competitorPrices.reduce((sum, cp) => sum + cp.priceAdvantage, 0) / competitorPrices.length,
    },
    competitivePosition,
    recommendations,
  };
}

/**
 * Calculate market analysis
 */
export function calculateMarketAnalysis(
  ourData: SnapshotData,
  competitors: CompetitorData[],
  historicalData: SnapshotData[]
): MarketAnalysis {
  const ourRevenue = ourData.orders.reduce((sum, order) => sum + order.amount, 0);
  const totalMarketRevenue = competitors.reduce((sum, comp) => sum + comp.marketShare, 0) + ourRevenue;
  const ourMarketShare = totalMarketRevenue > 0 ? (ourRevenue / totalMarketRevenue) * 100 : 0;

  // Calculate market trends
  const revenueHistory = historicalData.map(data => 
    data.orders.reduce((sum, order) => sum + order.amount, 0)
  );
  
  const growth = revenueHistory.length > 1 ? 
    ((revenueHistory[revenueHistory.length - 1] - revenueHistory[0]) / revenueHistory[0]) * 100 : 0;
  
  const seasonality = calculateSeasonality(revenueHistory);
  const volatility = calculateVolatility(revenueHistory);

  // Price competitiveness
  const ourAveragePrice = ourData.orders.length > 0 ? 
    ourData.orders.reduce((sum, order) => sum + order.amount, 0) / ourData.orders.length : 0;
  const marketAveragePrice = competitors.reduce((sum, comp) => sum + comp.averagePrice, 0) / competitors.length;
  const priceCompetitiveness = marketAveragePrice > 0 ? 
    ((marketAveragePrice - ourAveragePrice) / marketAveragePrice) * 100 : 0;

  // Opportunities and threats
  const opportunities: string[] = [];
  const threats: string[] = [];

  if (ourMarketShare < 10) {
    opportunities.push('Significant market share growth potential');
  }
  
  if (priceCompetitiveness > 10) {
    opportunities.push('Price advantage can be leveraged for market expansion');
  }
  
  if (growth > 20) {
    opportunities.push('High growth market with expansion opportunities');
  }

  const strongCompetitors = competitors.filter(c => c.marketShare > 20);
  if (strongCompetitors.length > 0) {
    threats.push('Strong competitors with significant market share');
  }
  
  if (volatility > 30) {
    threats.push('High market volatility requires careful planning');
  }

  return {
    totalMarketSize: totalMarketRevenue,
    ourMarketShare,
    competitorCount: competitors.length,
    averageMarketPrice: marketAveragePrice,
    priceCompetitiveness,
    marketTrends: {
      growth,
      seasonality,
      volatility,
    },
    opportunities,
    threats,
  };
}

/**
 * Calculate seasonality from revenue history
 */
function calculateSeasonality(revenueHistory: number[]): number {
  if (revenueHistory.length < 12) return 0; // Need at least 12 months of data

  const monthlyRevenue = revenueHistory.slice(-12); // Last 12 months
  const averageRevenue = monthlyRevenue.reduce((sum, rev) => sum + rev, 0) / 12;
  
  let seasonality = 0;
  for (let i = 0; i < 12; i++) {
    const deviation = Math.abs(monthlyRevenue[i] - averageRevenue) / averageRevenue;
    seasonality += deviation;
  }
  
  return (seasonality / 12) * 100;
}

/**
 * Calculate volatility from revenue history
 */
function calculateVolatility(revenueHistory: number[]): number {
  if (revenueHistory.length < 2) return 0;

  const returns = [];
  for (let i = 1; i < revenueHistory.length; i++) {
    const returnValue = (revenueHistory[i] - revenueHistory[i - 1]) / revenueHistory[i - 1];
    returns.push(returnValue);
  }

  const averageReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / returns.length;
  
  return Math.sqrt(variance) * 100;
}

/**
 * Generate insights and recommendations
 */
export function generateInsights(
  snapshotData: any,
  competitorData: CompetitorData[],
  historicalData: SnapshotData[]
): {
  keyMetrics: {
    revenue: number;
    orders: number;
    conversionRate: number;
    averageOrderValue: number;
  };
  trends: {
    revenueGrowth: number;
    orderGrowth: number;
    conversionTrend: number;
  };
  recommendations: string[];
  alerts: string[];
} {
  const keyMetrics = {
    revenue: snapshotData.totalRevenue,
    orders: snapshotData.totalOrders,
    conversionRate: snapshotData.conversionRate,
    averageOrderValue: snapshotData.averageOrderValue,
  };

  // Calculate trends
  const currentRevenue = snapshotData.totalRevenue;
  const previousRevenue = historicalData.length > 0 ? 
    historicalData[historicalData.length - 1].orders.reduce((sum, order) => sum + order.amount, 0) : currentRevenue;
  const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  const currentOrders = snapshotData.totalOrders;
  const previousOrders = historicalData.length > 0 ? 
    historicalData[historicalData.length - 1].orders.length : currentOrders;
  const orderGrowth = previousOrders > 0 ? ((currentOrders - previousOrders) / previousOrders) * 100 : 0;

  const currentConversion = snapshotData.conversionRate;
  const previousConversion = historicalData.length > 0 ? 
    (historicalData[historicalData.length - 1].orders.length / historicalData[historicalData.length - 1].uniqueVisitors) * 100 : currentConversion;
  const conversionTrend = previousConversion > 0 ? ((currentConversion - previousConversion) / previousConversion) * 100 : 0;

  const trends = {
    revenueGrowth,
    orderGrowth,
    conversionTrend,
  };

  // Generate recommendations
  const recommendations: string[] = [];
  const alerts: string[] = [];

  if (revenueGrowth < -10) {
    alerts.push('Revenue declining significantly');
    recommendations.push('Review pricing strategy and marketing campaigns');
  }

  if (conversionTrend < -20) {
    alerts.push('Conversion rate dropping');
    recommendations.push('Optimize product pages and checkout process');
  }

  if (snapshotData.conversionRate < 2) {
    recommendations.push('Focus on improving conversion rate');
  }

  if (snapshotData.averageOrderValue < 100) {
    recommendations.push('Consider upselling and cross-selling strategies');
  }

  const topProducts = snapshotData.topProducts || [];
  if (topProducts.length > 0 && topProducts[0].orders < 5) {
    recommendations.push('Promote best-selling products more prominently');
  }

  return {
    keyMetrics,
    trends,
    recommendations,
    alerts,
  };
}

/**
 * Calculate subscription analytics
 */
export function calculateSubscriptionAnalytics(
  subscriptions: any[],
  invoices: any[],
  dateRange: { start: Date; end: Date }
): {
  totalSubscriptions: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  cancelledSubscriptions: number;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  churnRate: number;
  planDistribution: { planType: string; count: number }[];
  revenueByPlan: { planType: string; revenue: number }[];
} {
  const periodSubscriptions = subscriptions.filter(sub => 
    sub.createdAt >= dateRange.start && sub.createdAt <= dateRange.end
  );

  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'ACTIVE').length;
  const trialSubscriptions = subscriptions.filter(sub => sub.status === 'TRIALING').length;
  const cancelledSubscriptions = subscriptions.filter(sub => sub.status === 'CANCELLED').length;

  const monthlyRecurringRevenue = subscriptions
    .filter(sub => sub.status === 'ACTIVE')
    .reduce((sum, sub) => sum + sub.amount, 0);

  const averageRevenuePerUser = activeSubscriptions > 0 ? monthlyRecurringRevenue / activeSubscriptions : 0;

  const churnRate = totalSubscriptions > 0 ? (cancelledSubscriptions / totalSubscriptions) * 100 : 0;

  // Plan distribution
  const planCounts = new Map<string, number>();
  subscriptions.forEach(sub => {
    const count = planCounts.get(sub.planType) || 0;
    planCounts.set(sub.planType, count + 1);
  });

  const planDistribution = Array.from(planCounts.entries()).map(([planType, count]) => ({
    planType,
    count,
  }));

  // Revenue by plan
  const planRevenue = new Map<string, number>();
  subscriptions.forEach(sub => {
    const revenue = planRevenue.get(sub.planType) || 0;
    planRevenue.set(sub.planType, revenue + sub.amount);
  });

  const revenueByPlan = Array.from(planRevenue.entries()).map(([planType, revenue]) => ({
    planType,
    revenue,
  }));

  return {
    totalSubscriptions,
    activeSubscriptions,
    trialSubscriptions,
    cancelledSubscriptions,
    monthlyRecurringRevenue,
    averageRevenuePerUser,
    churnRate,
    planDistribution,
    revenueByPlan,
  };
}

