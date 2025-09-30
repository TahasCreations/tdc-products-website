/**
 * Competitor Analysis Service
 * Provides competitor analysis features for Pro subscribers
 */

import { PrismaClient } from '@prisma/client';
import { 
  calculateCompetitorAnalysis,
  calculateMarketAnalysis,
  type CompetitorData,
  type MarketAnalysis
} from '@tdc/domain';

export interface CompetitorAnalysisRequest {
  tenantId: string;
  sellerId?: string;
  competitorName: string;
  competitorUrl: string;
  competitorType: 'DIRECT' | 'INDIRECT' | 'MARKETPLACE' | 'BRAND';
  analysisPeriod: {
    start: Date;
    end: Date;
  };
}

export interface CompetitorAnalysisResult {
  id: string;
  competitorName: string;
  competitorUrl: string;
  competitorType: string;
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
  recommendations: string[];
  marketPosition: string;
}

export class CompetitorAnalysisService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Analyze a specific competitor
   */
  async analyzeCompetitor(request: CompetitorAnalysisRequest): Promise<CompetitorAnalysisResult> {
    const { tenantId, sellerId, competitorName, competitorUrl, competitorType, analysisPeriod } = request;

    // Check if user has Pro subscription
    const hasProAccess = await this.checkProSubscription(tenantId, sellerId);
    if (!hasProAccess) {
      throw new Error('Competitor analysis requires Pro subscription');
    }

    // Collect competitor data
    const competitorData = await this.collectCompetitorData(competitorUrl, analysisPeriod);
    
    // Get our data for comparison
    const ourData = await this.getOurData(tenantId, sellerId, analysisPeriod);
    
    // Calculate analysis
    const analysis = calculateCompetitorAnalysis(ourData, [competitorData]);
    
    // Save analysis to database
    const savedAnalysis = await this.prisma.competitorAnalysis.create({
      data: {
        tenantId,
        sellerId: sellerId || null,
        competitorName,
        competitorUrl,
        competitorType,
        analysisDate: new Date(),
        periodStart: analysisPeriod.start,
        periodEnd: analysisPeriod.end,
        marketShare: competitorData.marketShare,
        totalProducts: competitorData.totalProducts,
        averagePrice: competitorData.averagePrice,
        priceRange: competitorData.priceRange,
        commonProducts: competitorData.commonProducts,
        priceAdvantage: competitorData.priceAdvantage,
        trafficEstimate: competitorData.trafficEstimate,
        conversionRate: competitorData.conversionRate,
        customerSatisfaction: competitorData.customerSatisfaction,
        pricingStrategy: competitorData.pricingStrategy,
        discountPattern: competitorData.discountPattern,
        status: 'ACTIVE',
      },
    });

    return {
      id: savedAnalysis.id,
      competitorName: savedAnalysis.competitorName,
      competitorUrl: savedAnalysis.competitorUrl || '',
      competitorType: savedAnalysis.competitorType,
      marketShare: savedAnalysis.marketShare || 0,
      totalProducts: savedAnalysis.totalProducts,
      averagePrice: Number(savedAnalysis.averagePrice),
      priceRange: savedAnalysis.priceRange as { min: number; max: number },
      commonProducts: savedAnalysis.commonProducts,
      priceAdvantage: savedAnalysis.priceAdvantage || 0,
      trafficEstimate: savedAnalysis.trafficEstimate || 0,
      conversionRate: savedAnalysis.conversionRate || 0,
      customerSatisfaction: savedAnalysis.customerSatisfaction || 0,
      pricingStrategy: savedAnalysis.pricingStrategy || '',
      discountPattern: savedAnalysis.discountPattern as Record<string, any>,
      recommendations: analysis.recommendations,
      marketPosition: analysis.competitivePosition,
    };
  }

  /**
   * Get market analysis for all competitors
   */
  async getMarketAnalysis(
    tenantId: string,
    sellerId?: string,
    analysisPeriod?: { start: Date; end: Date }
  ): Promise<MarketAnalysis> {
    // Check Pro subscription
    const hasProAccess = await this.checkProSubscription(tenantId, sellerId);
    if (!hasProAccess) {
      throw new Error('Market analysis requires Pro subscription');
    }

    // Get all competitor analyses
    const competitorAnalyses = await this.prisma.competitorAnalysis.findMany({
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        status: 'ACTIVE',
        ...(analysisPeriod && {
          periodStart: { gte: analysisPeriod.start },
          periodEnd: { lte: analysisPeriod.end },
        }),
      },
      orderBy: {
        lastUpdated: 'desc',
      },
    });

    // Convert to CompetitorData format
    const competitorData: CompetitorData[] = competitorAnalyses.map(analysis => ({
      name: analysis.competitorName,
      url: analysis.competitorUrl || '',
      type: analysis.competitorType as any,
      marketShare: analysis.marketShare || 0,
      totalProducts: analysis.totalProducts,
      averagePrice: Number(analysis.averagePrice),
      priceRange: analysis.priceRange as { min: number; max: number },
      commonProducts: analysis.commonProducts,
      priceAdvantage: analysis.priceAdvantage || 0,
      trafficEstimate: analysis.trafficEstimate || 0,
      conversionRate: analysis.conversionRate || 0,
      customerSatisfaction: analysis.customerSatisfaction || 0,
      pricingStrategy: analysis.pricingStrategy || '',
      discountPattern: analysis.discountPattern as Record<string, any>,
    }));

    // Get our data
    const ourData = await this.getOurData(tenantId, sellerId, analysisPeriod);
    
    // Get historical data for trend analysis
    const historicalData = await this.getHistoricalData(tenantId, sellerId, 90); // Last 90 days

    // Calculate market analysis
    const marketAnalysis = calculateMarketAnalysis(ourData, competitorData, historicalData);

    return marketAnalysis;
  }

  /**
   * Get competitor insights and recommendations
   */
  async getCompetitorInsights(
    tenantId: string,
    sellerId?: string,
    competitorId?: string
  ): Promise<{
    insights: string[];
    recommendations: string[];
    alerts: string[];
    opportunities: string[];
  }> {
    // Check Pro subscription
    const hasProAccess = await this.checkProSubscription(tenantId, sellerId);
    if (!hasProAccess) {
      throw new Error('Competitor insights require Pro subscription');
    }

    // Get competitor analyses
    const analyses = await this.prisma.competitorAnalysis.findMany({
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        ...(competitorId && { id: competitorId }),
        status: 'ACTIVE',
      },
      orderBy: {
        lastUpdated: 'desc',
      },
    });

    const insights: string[] = [];
    const recommendations: string[] = [];
    const alerts: string[] = [];
    const opportunities: string[] = [];

    // Analyze each competitor
    for (const analysis of analyses) {
      // Price advantage insights
      if (analysis.priceAdvantage && analysis.priceAdvantage > 10) {
        insights.push(`${analysis.competitorName} has a ${analysis.priceAdvantage.toFixed(1)}% price advantage`);
        recommendations.push(`Consider competitive pricing strategies against ${analysis.competitorName}`);
      } else if (analysis.priceAdvantage && analysis.priceAdvantage < -10) {
        insights.push(`We have a ${Math.abs(analysis.priceAdvantage).toFixed(1)}% price advantage over ${analysis.competitorName}`);
        opportunities.push(`Leverage price advantage to gain market share from ${analysis.competitorName}`);
      }

      // Market share insights
      if (analysis.marketShare && analysis.marketShare > 20) {
        insights.push(`${analysis.competitorName} has significant market share (${analysis.marketShare.toFixed(1)}%)`);
        alerts.push(`Strong competitor ${analysis.competitorName} with high market share`);
      }

      // Traffic insights
      if (analysis.trafficEstimate && analysis.trafficEstimate > 50000) {
        insights.push(`${analysis.competitorName} has high traffic (${analysis.trafficEstimate.toLocaleString()} monthly visitors)`);
        recommendations.push(`Study ${analysis.competitorName}'s marketing strategies for traffic generation`);
      }

      // Conversion rate insights
      if (analysis.conversionRate && analysis.conversionRate > 3) {
        insights.push(`${analysis.competitorName} has high conversion rate (${analysis.conversionRate.toFixed(1)}%)`);
        recommendations.push(`Analyze ${analysis.competitorName}'s conversion optimization strategies`);
      }

      // Customer satisfaction insights
      if (analysis.customerSatisfaction && analysis.customerSatisfaction > 4.5) {
        insights.push(`${analysis.competitorName} has high customer satisfaction (${analysis.customerSatisfaction.toFixed(1)}/5)`);
        recommendations.push(`Study ${analysis.competitorName}'s customer service and product quality`);
      }

      // Pricing strategy insights
      if (analysis.pricingStrategy) {
        insights.push(`${analysis.competitorName} uses ${analysis.pricingStrategy} pricing strategy`);
        if (analysis.pricingStrategy === 'Premium' && analysis.priceAdvantage && analysis.priceAdvantage > 0) {
          opportunities.push(`Consider premium positioning against ${analysis.competitorName}`);
        }
      }
    }

    return {
      insights,
      recommendations,
      alerts,
      opportunities,
    };
  }

  /**
   * Get competitor price monitoring
   */
  async getPriceMonitoring(
    tenantId: string,
    sellerId?: string,
    productIds?: string[]
  ): Promise<{
    productId: string;
    productName: string;
    ourPrice: number;
    competitorPrices: {
      competitorName: string;
      price: number;
      priceDifference: number;
      lastUpdated: Date;
    }[];
    averageCompetitorPrice: number;
    priceRecommendation: string;
  }[]> {
    // Check Pro subscription
    const hasProAccess = await this.checkProSubscription(tenantId, sellerId);
    if (!hasProAccess) {
      throw new Error('Price monitoring requires Pro subscription');
    }

    // Get our products
    const products = await this.prisma.product.findMany({
      where: {
        enabled: true,
        ...(productIds && { id: { in: productIds } }),
      },
      select: {
        id: true,
        title: true,
        price: true,
      },
    });

    const results = [];

    for (const product of products) {
      // Get competitor prices for this product
      const competitorPrices = await this.getCompetitorPrices(product.id);
      
      const ourPrice = Number(product.price);
      const competitorPriceData = competitorPrices.map(cp => ({
        competitorName: cp.competitorName,
        price: cp.price,
        priceDifference: cp.price - ourPrice,
        lastUpdated: cp.lastUpdated,
      }));

      const averageCompetitorPrice = competitorPriceData.length > 0 ?
        competitorPriceData.reduce((sum, cp) => sum + cp.price, 0) / competitorPriceData.length : ourPrice;

      // Generate price recommendation
      let priceRecommendation = 'Maintain current price';
      if (averageCompetitorPrice < ourPrice * 0.9) {
        priceRecommendation = 'Consider price reduction to stay competitive';
      } else if (averageCompetitorPrice > ourPrice * 1.1) {
        priceRecommendation = 'Consider price increase - you are underpriced';
      }

      results.push({
        productId: product.id,
        productName: product.title,
        ourPrice,
        competitorPrices: competitorPriceData,
        averageCompetitorPrice,
        priceRecommendation,
      });
    }

    return results;
  }

  private async checkProSubscription(tenantId: string, sellerId?: string): Promise<boolean> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        status: 'ACTIVE',
        planType: 'PRO',
      },
    });

    return !!subscription;
  }

  private async collectCompetitorData(
    competitorUrl: string,
    analysisPeriod: { start: Date; end: Date }
  ): Promise<CompetitorData> {
    // In a real implementation, this would:
    // 1. Scrape competitor website
    // 2. Use competitor analysis APIs
    // 3. Collect pricing data
    // 4. Analyze product catalog
    // 5. Monitor traffic and conversion data

    // Mock implementation
    return {
      name: 'Competitor',
      url: competitorUrl,
      type: 'DIRECT',
      marketShare: Math.random() * 20 + 5, // 5-25%
      totalProducts: Math.floor(Math.random() * 2000) + 500,
      averagePrice: Math.random() * 200 + 50, // 50-250 TRY
      priceRange: { min: 10, max: 500 },
      commonProducts: Math.floor(Math.random() * 50) + 10,
      priceAdvantage: (Math.random() - 0.5) * 20, // -10% to +10%
      trafficEstimate: Math.floor(Math.random() * 100000) + 10000,
      conversionRate: Math.random() * 5 + 1, // 1-6%
      customerSatisfaction: Math.random() * 2 + 3, // 3-5
      pricingStrategy: ['Premium', 'Value', 'Budget'][Math.floor(Math.random() * 3)],
      discountPattern: {
        frequency: ['daily', 'weekly', 'monthly'][Math.floor(Math.random() * 3)],
        average: Math.random() * 30 + 10, // 10-40%
      },
    };
  }

  private async getOurData(
    tenantId: string,
    sellerId: string | undefined,
    analysisPeriod?: { start: Date; end: Date }
  ) {
    // Get our sales data for comparison
    const orders = await this.prisma.order.findMany({
      where: {
        // Add tenant/seller filters
        ...(analysisPeriod && {
          createdAt: {
            gte: analysisPeriod.start,
            lte: analysisPeriod.end,
          },
        }),
      },
    });

    // Mock our data structure
    return {
      tenantId,
      sellerId,
      snapshotDate: new Date(),
      products: [],
      orders: orders.map(order => ({
        id: order.id,
        productId: 'unknown',
        amount: Number(order.amount),
        quantity: 1,
        createdAt: order.createdAt,
      })),
      pageViews: 1000,
      uniqueVisitors: 700,
      bounceRate: 30,
      sessionDuration: 180,
    };
  }

  private async getHistoricalData(
    tenantId: string,
    sellerId: string | undefined,
    days: number
  ) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const snapshots = await this.prisma.dailySnapshot.findMany({
      where: {
        tenantId,
        sellerId: sellerId || null,
        snapshotDate: {
          gte: startDate,
          lte: endDate,
        },
        status: 'COMPLETED',
      },
      orderBy: {
        snapshotDate: 'asc',
      },
    });

    return snapshots.map(snapshot => ({
      tenantId: snapshot.tenantId,
      sellerId: snapshot.sellerId,
      snapshotDate: snapshot.snapshotDate,
      products: [],
      orders: [],
      pageViews: snapshot.pageViews,
      uniqueVisitors: snapshot.uniqueVisitors,
      bounceRate: snapshot.bounceRate,
      sessionDuration: snapshot.sessionDuration,
    }));
  }

  private async getCompetitorPrices(productId: string) {
    // Mock competitor price data
    return [
      {
        competitorName: 'Competitor A',
        price: Math.random() * 100 + 50,
        lastUpdated: new Date(),
      },
      {
        competitorName: 'Competitor B',
        price: Math.random() * 100 + 50,
        lastUpdated: new Date(),
      },
    ];
  }
}

