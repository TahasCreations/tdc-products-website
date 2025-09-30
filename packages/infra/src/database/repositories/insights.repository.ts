/**
 * Insights Repository - Data access layer for insights and analytics
 * Handles CRUD operations for snapshots, product analytics, and competitor analysis
 */

import { PrismaClient } from '@prisma/client';

export class InsightsRepository {
  constructor(private prisma: PrismaClient) {}

  // ===========================================
  // DAILY SNAPSHOTS
  // ===========================================

  async createDailySnapshot(data: {
    tenantId: string;
    sellerId?: string;
    snapshotDate: Date;
    snapshotType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
    status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    totalProducts?: number;
    activeProducts?: number;
    newProducts?: number;
    updatedProducts?: number;
    totalOrders?: number;
    totalRevenue?: number;
    averageOrderValue?: number;
    conversionRate?: number;
    topProducts?: any[];
    topCategories?: any[];
    topPriceRanges?: any[];
    topTags?: any[];
    pageViews?: number;
    uniqueVisitors?: number;
    bounceRate?: number;
    sessionDuration?: number;
    competitorData?: any;
    marketShare?: number;
    priceComparison?: any;
    processedAt?: Date;
    processingTime?: number;
    errorMessage?: string;
    metadata?: Record<string, any>;
  }) {
    return this.prisma.dailySnapshot.create({
      data: {
        tenantId: data.tenantId,
        sellerId: data.sellerId || null,
        snapshotDate: data.snapshotDate,
        snapshotType: data.snapshotType,
        status: data.status || 'PENDING',
        totalProducts: data.totalProducts || 0,
        activeProducts: data.activeProducts || 0,
        newProducts: data.newProducts || 0,
        updatedProducts: data.updatedProducts || 0,
        totalOrders: data.totalOrders || 0,
        totalRevenue: data.totalRevenue || 0,
        averageOrderValue: data.averageOrderValue || 0,
        conversionRate: data.conversionRate || 0,
        topProducts: data.topProducts,
        topCategories: data.topCategories,
        topPriceRanges: data.topPriceRanges,
        topTags: data.topTags,
        pageViews: data.pageViews || 0,
        uniqueVisitors: data.uniqueVisitors || 0,
        bounceRate: data.bounceRate || 0,
        sessionDuration: data.sessionDuration || 0,
        competitorData: data.competitorData,
        marketShare: data.marketShare,
        priceComparison: data.priceComparison,
        processedAt: data.processedAt,
        processingTime: data.processingTime,
        errorMessage: data.errorMessage,
        metadata: data.metadata,
      },
    });
  }

  async getDailySnapshot(id: string) {
    return this.prisma.dailySnapshot.findUnique({
      where: { id },
    });
  }

  async getDailySnapshots(
    tenantId: string,
    sellerId?: string,
    dateRange?: { start: Date; end: Date },
    snapshotType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM',
    status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED',
    limit = 100,
    offset = 0
  ) {
    return this.prisma.dailySnapshot.findMany({
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        ...(dateRange && {
          snapshotDate: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        }),
        ...(snapshotType && { snapshotType }),
        ...(status && { status }),
      },
      orderBy: { snapshotDate: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async updateDailySnapshot(
    id: string,
    data: {
      status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
      totalProducts?: number;
      activeProducts?: number;
      newProducts?: number;
      updatedProducts?: number;
      totalOrders?: number;
      totalRevenue?: number;
      averageOrderValue?: number;
      conversionRate?: number;
      topProducts?: any[];
      topCategories?: any[];
      topPriceRanges?: any[];
      topTags?: any[];
      pageViews?: number;
      uniqueVisitors?: number;
      bounceRate?: number;
      sessionDuration?: number;
      competitorData?: any;
      marketShare?: number;
      priceComparison?: any;
      processedAt?: Date;
      processingTime?: number;
      errorMessage?: string;
      metadata?: Record<string, any>;
    }
  ) {
    return this.prisma.dailySnapshot.update({
      where: { id },
      data,
    });
  }

  async deleteDailySnapshot(id: string) {
    return this.prisma.dailySnapshot.delete({
      where: { id },
    });
  }

  // ===========================================
  // PRODUCT ANALYTICS
  // ===========================================

  async createProductAnalytics(data: {
    tenantId: string;
    sellerId?: string;
    productId: string;
    periodStart: Date;
    periodEnd: Date;
    periodType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    views?: number;
    clicks?: number;
    orders?: number;
    revenue?: number;
    conversionRate?: number;
    categoryRank?: number;
    overallRank?: number;
    searchRank?: number;
    averagePrice?: number;
    priceChanges?: number;
    discountRate?: number;
    topTags?: string[];
    tagPerformance?: any;
    competitorPrices?: any;
    marketPosition?: string;
    metadata?: Record<string, any>;
  }) {
    return this.prisma.productAnalytics.create({
      data: {
        tenantId: data.tenantId,
        sellerId: data.sellerId || null,
        productId: data.productId,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        periodType: data.periodType || 'DAILY',
        views: data.views || 0,
        clicks: data.clicks || 0,
        orders: data.orders || 0,
        revenue: data.revenue || 0,
        conversionRate: data.conversionRate || 0,
        categoryRank: data.categoryRank,
        overallRank: data.overallRank,
        searchRank: data.searchRank,
        averagePrice: data.averagePrice || 0,
        priceChanges: data.priceChanges || 0,
        discountRate: data.discountRate || 0,
        topTags: data.topTags || [],
        tagPerformance: data.tagPerformance,
        competitorPrices: data.competitorPrices,
        marketPosition: data.marketPosition,
        metadata: data.metadata,
      },
    });
  }

  async getProductAnalytics(id: string) {
    return this.prisma.productAnalytics.findUnique({
      where: { id },
      include: {
        product: true,
        seller: true,
      },
    });
  }

  async getProductAnalyticsByProduct(
    productId: string,
    periodType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
    dateRange?: { start: Date; end: Date },
    limit = 100,
    offset = 0
  ) {
    return this.prisma.productAnalytics.findMany({
      where: {
        productId,
        ...(periodType && { periodType }),
        ...(dateRange && {
          periodStart: { gte: dateRange.start },
          periodEnd: { lte: dateRange.end },
        }),
      },
      orderBy: { periodStart: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getProductAnalyticsByTenant(
    tenantId: string,
    sellerId?: string,
    periodType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
    dateRange?: { start: Date; end: Date },
    limit = 100,
    offset = 0
  ) {
    return this.prisma.productAnalytics.findMany({
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        ...(periodType && { periodType }),
        ...(dateRange && {
          periodStart: { gte: dateRange.start },
          periodEnd: { lte: dateRange.end },
        }),
      },
      include: {
        product: true,
        seller: true,
      },
      orderBy: { periodStart: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async updateProductAnalytics(
    id: string,
    data: {
      views?: number;
      clicks?: number;
      orders?: number;
      revenue?: number;
      conversionRate?: number;
      categoryRank?: number;
      overallRank?: number;
      searchRank?: number;
      averagePrice?: number;
      priceChanges?: number;
      discountRate?: number;
      topTags?: string[];
      tagPerformance?: any;
      competitorPrices?: any;
      marketPosition?: string;
      metadata?: Record<string, any>;
    }
  ) {
    return this.prisma.productAnalytics.update({
      where: { id },
      data,
    });
  }

  async deleteProductAnalytics(id: string) {
    return this.prisma.productAnalytics.delete({
      where: { id },
    });
  }

  // ===========================================
  // COMPETITOR ANALYSIS
  // ===========================================

  async createCompetitorAnalysis(data: {
    tenantId: string;
    sellerId?: string;
    competitorName: string;
    competitorUrl?: string;
    competitorType?: 'DIRECT' | 'INDIRECT' | 'MARKETPLACE' | 'BRAND';
    analysisDate: Date;
    periodStart: Date;
    periodEnd: Date;
    marketShare?: number;
    totalProducts?: number;
    averagePrice?: number;
    priceRange?: any;
    commonProducts?: number;
    priceAdvantage?: number;
    featureAdvantage?: any;
    trafficEstimate?: number;
    conversionRate?: number;
    customerSatisfaction?: number;
    pricingStrategy?: string;
    discountPattern?: any;
    status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
    metadata?: Record<string, any>;
  }) {
    return this.prisma.competitorAnalysis.create({
      data: {
        tenantId: data.tenantId,
        sellerId: data.sellerId || null,
        competitorName: data.competitorName,
        competitorUrl: data.competitorUrl,
        competitorType: data.competitorType || 'DIRECT',
        analysisDate: data.analysisDate,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        marketShare: data.marketShare,
        totalProducts: data.totalProducts || 0,
        averagePrice: data.averagePrice || 0,
        priceRange: data.priceRange,
        commonProducts: data.commonProducts || 0,
        priceAdvantage: data.priceAdvantage,
        featureAdvantage: data.featureAdvantage,
        trafficEstimate: data.trafficEstimate,
        conversionRate: data.conversionRate,
        customerSatisfaction: data.customerSatisfaction,
        pricingStrategy: data.pricingStrategy,
        discountPattern: data.discountPattern,
        status: data.status || 'ACTIVE',
        metadata: data.metadata,
      },
    });
  }

  async getCompetitorAnalysis(id: string) {
    return this.prisma.competitorAnalysis.findUnique({
      where: { id },
    });
  }

  async getCompetitorAnalyses(
    tenantId: string,
    sellerId?: string,
    competitorName?: string,
    competitorType?: 'DIRECT' | 'INDIRECT' | 'MARKETPLACE' | 'BRAND',
    status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED',
    dateRange?: { start: Date; end: Date },
    limit = 100,
    offset = 0
  ) {
    return this.prisma.competitorAnalysis.findMany({
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        ...(competitorName && { competitorName: { contains: competitorName, mode: 'insensitive' } }),
        ...(competitorType && { competitorType }),
        ...(status && { status }),
        ...(dateRange && {
          analysisDate: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        }),
      },
      orderBy: { lastUpdated: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async updateCompetitorAnalysis(
    id: string,
    data: {
      competitorName?: string;
      competitorUrl?: string;
      competitorType?: 'DIRECT' | 'INDIRECT' | 'MARKETPLACE' | 'BRAND';
      marketShare?: number;
      totalProducts?: number;
      averagePrice?: number;
      priceRange?: any;
      commonProducts?: number;
      priceAdvantage?: number;
      featureAdvantage?: any;
      trafficEstimate?: number;
      conversionRate?: number;
      customerSatisfaction?: number;
      pricingStrategy?: string;
      discountPattern?: any;
      status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
      metadata?: Record<string, any>;
    }
  ) {
    return this.prisma.competitorAnalysis.update({
      where: { id },
      data: {
        ...data,
        lastUpdated: new Date(),
      },
    });
  }

  async deleteCompetitorAnalysis(id: string) {
    return this.prisma.competitorAnalysis.delete({
      where: { id },
    });
  }

  // ===========================================
  // ANALYTICS & REPORTING
  // ===========================================

  async getInsightsSummary(
    tenantId: string,
    sellerId?: string,
    dateRange: { start: Date; end: Date }
  ) {
    const [snapshots, productAnalytics, competitorAnalyses] = await Promise.all([
      this.prisma.dailySnapshot.findMany({
        where: {
          tenantId,
          ...(sellerId && { sellerId }),
          snapshotDate: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
          status: 'COMPLETED',
        },
        orderBy: { snapshotDate: 'desc' },
      }),
      this.prisma.productAnalytics.findMany({
        where: {
          tenantId,
          ...(sellerId && { sellerId }),
          periodStart: { gte: dateRange.start },
          periodEnd: { lte: dateRange.end },
        },
      }),
      this.prisma.competitorAnalysis.findMany({
        where: {
          tenantId,
          ...(sellerId && { sellerId }),
          status: 'ACTIVE',
          analysisDate: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        },
      }),
    ]);

    // Calculate summary metrics
    const totalRevenue = snapshots.reduce((sum, s) => sum + Number(s.totalRevenue), 0);
    const totalOrders = snapshots.reduce((sum, s) => sum + s.totalOrders, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const averageConversionRate = snapshots.length > 0 ? 
      snapshots.reduce((sum, s) => sum + s.conversionRate, 0) / snapshots.length : 0;

    const totalProducts = snapshots.length > 0 ? snapshots[0].totalProducts : 0;
    const activeProducts = snapshots.length > 0 ? snapshots[0].activeProducts : 0;

    const competitorCount = competitorAnalyses.length;
    const averageMarketShare = competitorAnalyses.length > 0 ?
      competitorAnalyses.reduce((sum, c) => sum + (c.marketShare || 0), 0) / competitorAnalyses.length : 0;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      averageConversionRate,
      totalProducts,
      activeProducts,
      competitorCount,
      averageMarketShare,
      snapshotCount: snapshots.length,
      productAnalyticsCount: productAnalytics.length,
    };
  }

  async getTopProducts(
    tenantId: string,
    sellerId?: string,
    dateRange: { start: Date; end: Date },
    limit = 10
  ) {
    const snapshots = await this.prisma.dailySnapshot.findMany({
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        snapshotDate: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
        status: 'COMPLETED',
      },
      orderBy: { snapshotDate: 'desc' },
      take: 1,
    });

    if (snapshots.length === 0) return [];

    const latestSnapshot = snapshots[0];
    return latestSnapshot.topProducts || [];
  }

  async getTopCategories(
    tenantId: string,
    sellerId?: string,
    dateRange: { start: Date; end: Date },
    limit = 10
  ) {
    const snapshots = await this.prisma.dailySnapshot.findMany({
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        snapshotDate: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
        status: 'COMPLETED',
      },
      orderBy: { snapshotDate: 'desc' },
      take: 1,
    });

    if (snapshots.length === 0) return [];

    const latestSnapshot = snapshots[0];
    return latestSnapshot.topCategories || [];
  }

  async getTopPriceRanges(
    tenantId: string,
    sellerId?: string,
    dateRange: { start: Date; end: Date },
    limit = 6
  ) {
    const snapshots = await this.prisma.dailySnapshot.findMany({
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        snapshotDate: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
        status: 'COMPLETED',
      },
      orderBy: { snapshotDate: 'desc' },
      take: 1,
    });

    if (snapshots.length === 0) return [];

    const latestSnapshot = snapshots[0];
    return latestSnapshot.topPriceRanges || [];
  }

  async getTopTags(
    tenantId: string,
    sellerId?: string,
    dateRange: { start: Date; end: Date },
    limit = 10
  ) {
    const snapshots = await this.prisma.dailySnapshot.findMany({
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        snapshotDate: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
        status: 'COMPLETED',
      },
      orderBy: { snapshotDate: 'desc' },
      take: 1,
    });

    if (snapshots.length === 0) return [];

    const latestSnapshot = snapshots[0];
    return latestSnapshot.topTags || [];
  }

  async getTrends(
    tenantId: string,
    sellerId?: string,
    dateRange: { start: Date; end: Date },
    metric: 'revenue' | 'orders' | 'conversion' | 'products'
  ) {
    const snapshots = await this.prisma.dailySnapshot.findMany({
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        snapshotDate: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
        status: 'COMPLETED',
      },
      orderBy: { snapshotDate: 'asc' },
    });

    return snapshots.map(snapshot => ({
      date: snapshot.snapshotDate,
      value: metric === 'revenue' ? Number(snapshot.totalRevenue) :
             metric === 'orders' ? snapshot.totalOrders :
             metric === 'conversion' ? snapshot.conversionRate :
             snapshot.totalProducts,
    }));
  }

  // ===========================================
  // BULK OPERATIONS
  // ===========================================

  async bulkCreateProductAnalytics(analytics: Array<{
    tenantId: string;
    sellerId?: string;
    productId: string;
    periodStart: Date;
    periodEnd: Date;
    periodType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    views?: number;
    clicks?: number;
    orders?: number;
    revenue?: number;
    conversionRate?: number;
    averagePrice?: number;
    topTags?: string[];
    metadata?: Record<string, any>;
  }>) {
    return this.prisma.productAnalytics.createMany({
      data: analytics.map(a => ({
        tenantId: a.tenantId,
        sellerId: a.sellerId || null,
        productId: a.productId,
        periodStart: a.periodStart,
        periodEnd: a.periodEnd,
        periodType: a.periodType || 'DAILY',
        views: a.views || 0,
        clicks: a.clicks || 0,
        orders: a.orders || 0,
        revenue: a.revenue || 0,
        conversionRate: a.conversionRate || 0,
        averagePrice: a.averagePrice || 0,
        topTags: a.topTags || [],
        metadata: a.metadata,
      })),
    });
  }

  async bulkUpdateSnapshots(
    updates: Array<{
      id: string;
      status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
      processedAt?: Date;
      errorMessage?: string;
    }>
  ) {
    return this.prisma.$transaction(
      updates.map(update =>
        this.prisma.dailySnapshot.update({
          where: { id: update.id },
          data: {
            status: update.status,
            processedAt: update.processedAt,
            errorMessage: update.errorMessage,
          },
        })
      )
    );
  }
}

