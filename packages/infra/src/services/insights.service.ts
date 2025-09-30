/**
 * Insights Service - Business logic for insights and analytics
 * Handles snapshot generation, product analytics, and competitor analysis
 */

import { InsightsRepository } from '../database/repositories/insights.repository';
import { SubscriptionRepository } from '../database/repositories/subscription.repository';
import { InsightsService as DomainInsightsService } from '@tdc/domain';

export class InsightsService {
  private domainService: DomainInsightsService;

  constructor(
    private insightsRepo: InsightsRepository,
    private subscriptionRepo: SubscriptionRepository
  ) {
    this.domainService = new DomainInsightsService(insightsRepo);
  }

  // ===========================================
  // DAILY SNAPSHOTS
  // ===========================================

  async generateDailySnapshot(input: {
    tenantId: string;
    sellerId?: string;
    date: Date;
  }) {
    console.log(`📊 Generating daily snapshot for ${input.date.toISOString().split('T')[0]}`);
    
    try {
      // Check if snapshot already exists
      const existingSnapshot = await this.insightsRepo.getDailySnapshots(
        input.tenantId,
        input.sellerId,
        {
          start: input.date,
          end: input.date,
        },
        'DAILY',
        'COMPLETED',
        1
      );

      if (existingSnapshot.length > 0) {
        console.log(`⚠️ Snapshot already exists for ${input.date.toISOString().split('T')[0]}`);
        return existingSnapshot[0];
      }

      // Create pending snapshot
      const snapshot = await this.insightsRepo.createDailySnapshot({
        tenantId: input.tenantId,
        sellerId: input.sellerId,
        snapshotDate: input.date,
        snapshotType: 'DAILY',
        status: 'PROCESSING',
      });

      // Update snapshot with data
      const updatedSnapshot = await this.domainService.generateDailySnapshot({
        tenantId: input.tenantId,
        sellerId: input.sellerId,
        date: input.date,
      });

      if (updatedSnapshot) {
        await this.insightsRepo.updateDailySnapshot(snapshot.id, {
          status: 'COMPLETED',
          processedAt: new Date(),
          ...updatedSnapshot,
        });

        console.log(`✅ Daily snapshot completed for ${input.date.toISOString().split('T')[0]}`);
        return { ...snapshot, ...updatedSnapshot, status: 'COMPLETED' };
      } else {
        throw new Error('Failed to generate snapshot data');
      }
    } catch (error: any) {
      console.error(`❌ Error generating daily snapshot:`, error.message);
      
      // Update snapshot with error status
      const snapshots = await this.insightsRepo.getDailySnapshots(
        input.tenantId,
        input.sellerId,
        {
          start: input.date,
          end: input.date,
        },
        'DAILY',
        'PROCESSING',
        1
      );

      if (snapshots.length > 0) {
        await this.insightsRepo.updateDailySnapshot(snapshots[0].id, {
          status: 'FAILED',
          errorMessage: error.message,
          processedAt: new Date(),
        });
      }

      throw error;
    }
  }

  async getDailySnapshots(
    tenantId: string,
    sellerId?: string,
    dateRange?: { start: Date; end: Date },
    limit = 100,
    offset = 0
  ) {
    return this.insightsRepo.getDailySnapshots(
      tenantId,
      sellerId,
      dateRange,
      'DAILY',
      'COMPLETED',
      limit,
      offset
    );
  }

  async getSnapshotSummary(
    tenantId: string,
    sellerId?: string,
    dateRange: { start: Date; end: Date }
  ) {
    return this.insightsRepo.getInsightsSummary(tenantId, sellerId, dateRange);
  }

  // ===========================================
  // PRODUCT ANALYTICS
  // ===========================================

  async generateProductAnalytics(input: {
    tenantId: string;
    sellerId?: string;
    productId: string;
    periodStart: Date;
    periodEnd: Date;
    periodType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  }) {
    console.log(`📈 Generating product analytics for product ${input.productId}`);
    
    try {
      const analytics = await this.domainService.getProductAnalytics({
        tenantId: input.tenantId,
        sellerId: input.sellerId,
        productId: input.productId,
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
        periodType: input.periodType || 'DAILY',
      });

      if (analytics) {
        const created = await this.insightsRepo.createProductAnalytics({
          tenantId: input.tenantId,
          sellerId: input.sellerId,
          productId: input.productId,
          periodStart: input.periodStart,
          periodEnd: input.periodEnd,
          periodType: input.periodType || 'DAILY',
          ...analytics,
        });

        console.log(`✅ Product analytics generated for product ${input.productId}`);
        return created;
      } else {
        throw new Error('Failed to generate product analytics');
      }
    } catch (error: any) {
      console.error(`❌ Error generating product analytics:`, error.message);
      throw error;
    }
  }

  async getProductAnalytics(
    tenantId: string,
    sellerId?: string,
    productId?: string,
    periodType?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
    dateRange?: { start: Date; end: Date },
    limit = 100,
    offset = 0
  ) {
    if (productId) {
      return this.insightsRepo.getProductAnalyticsByProduct(
        productId,
        periodType,
        dateRange,
        limit,
        offset
      );
    } else {
      return this.insightsRepo.getProductAnalyticsByTenant(
        tenantId,
        sellerId,
        periodType,
        dateRange,
        limit,
        offset
      );
    }
  }

  async getTopProducts(
    tenantId: string,
    sellerId?: string,
    dateRange: { start: Date; end: Date },
    limit = 10
  ) {
    return this.insightsRepo.getTopProducts(tenantId, sellerId, dateRange, limit);
  }

  async getTopCategories(
    tenantId: string,
    sellerId?: string,
    dateRange: { start: Date; end: Date },
    limit = 10
  ) {
    return this.insightsRepo.getTopCategories(tenantId, sellerId, dateRange, limit);
  }

  async getTopPriceRanges(
    tenantId: string,
    sellerId?: string,
    dateRange: { start: Date; end: Date },
    limit = 6
  ) {
    return this.insightsRepo.getTopPriceRanges(tenantId, sellerId, dateRange, limit);
  }

  async getTopTags(
    tenantId: string,
    sellerId?: string,
    dateRange: { start: Date; end: Date },
    limit = 10
  ) {
    return this.insightsRepo.getTopTags(tenantId, sellerId, dateRange, limit);
  }

  async getTrends(
    tenantId: string,
    sellerId?: string,
    dateRange: { start: Date; end: Date },
    metric: 'revenue' | 'orders' | 'conversion' | 'products'
  ) {
    return this.insightsRepo.getTrends(tenantId, sellerId, dateRange, metric);
  }

  // ===========================================
  // COMPETITOR ANALYSIS
  // ===========================================

  async runCompetitorAnalysis(input: {
    tenantId: string;
    sellerId?: string;
    competitorName: string;
    competitorUrl?: string;
    competitorType?: 'DIRECT' | 'INDIRECT' | 'MARKETPLACE' | 'BRAND';
    analysisDate: Date;
    periodStart: Date;
    periodEnd: Date;
  }) {
    console.log(`🔍 Running competitor analysis for ${input.competitorName}`);
    
    try {
      const analysis = await this.domainService.getCompetitorAnalysis({
        tenantId: input.tenantId,
        sellerId: input.sellerId,
        competitorName: input.competitorName,
        competitorUrl: input.competitorUrl,
        competitorType: input.competitorType || 'DIRECT',
        analysisDate: input.analysisDate,
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
      });

      if (analysis) {
        const created = await this.insightsRepo.createCompetitorAnalysis({
          tenantId: input.tenantId,
          sellerId: input.sellerId,
          competitorName: input.competitorName,
          competitorUrl: input.competitorUrl,
          competitorType: input.competitorType || 'DIRECT',
          analysisDate: input.analysisDate,
          periodStart: input.periodStart,
          periodEnd: input.periodEnd,
          ...analysis,
        });

        console.log(`✅ Competitor analysis completed for ${input.competitorName}`);
        return created;
      } else {
        throw new Error('Failed to generate competitor analysis');
      }
    } catch (error: any) {
      console.error(`❌ Error running competitor analysis:`, error.message);
      throw error;
    }
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
    return this.insightsRepo.getCompetitorAnalyses(
      tenantId,
      sellerId,
      competitorName,
      competitorType,
      status,
      dateRange,
      limit,
      offset
    );
  }

  // ===========================================
  // SUBSCRIPTION ANALYTICS
  // ===========================================

  async getSubscriptionStats(tenantId: string, sellerId?: string) {
    return this.subscriptionRepo.getSubscriptionStats(tenantId, sellerId);
  }

  async getPlanDistribution(tenantId: string, sellerId?: string) {
    return this.subscriptionRepo.getPlanDistribution(tenantId, sellerId);
  }

  async getRevenueByPlan(
    tenantId: string,
    sellerId?: string,
    dateRange?: { start: Date; end: Date }
  ) {
    return this.subscriptionRepo.getRevenueByPlan(tenantId, sellerId, dateRange);
  }

  async getChurnRate(tenantId: string, sellerId?: string, months = 12) {
    return this.subscriptionRepo.getChurnRate(tenantId, sellerId, months);
  }

  // ===========================================
  // BULK OPERATIONS
  // ===========================================

  async bulkGenerateSnapshots(
    tenantId: string,
    sellerId?: string,
    dateRange: { start: Date; end: Date }
  ) {
    console.log(`📊 Bulk generating snapshots for ${dateRange.start.toISOString().split('T')[0]} to ${dateRange.end.toISOString().split('T')[0]}`);
    
    const snapshots = [];
    const currentDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    while (currentDate <= endDate) {
      try {
        const snapshot = await this.generateDailySnapshot({
          tenantId,
          sellerId,
          date: new Date(currentDate),
        });
        snapshots.push(snapshot);
      } catch (error: any) {
        console.error(`❌ Error generating snapshot for ${currentDate.toISOString().split('T')[0]}:`, error.message);
        // Continue with next date
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`✅ Bulk snapshot generation completed. Generated ${snapshots.length} snapshots`);
    return snapshots;
  }

  async bulkGenerateProductAnalytics(
    tenantId: string,
    sellerId?: string,
    productIds: string[],
    periodStart: Date,
    periodEnd: Date,
    periodType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' = 'DAILY'
  ) {
    console.log(`📈 Bulk generating product analytics for ${productIds.length} products`);
    
    const analytics = [];
    
    for (const productId of productIds) {
      try {
        const analytic = await this.generateProductAnalytics({
          tenantId,
          sellerId,
          productId,
          periodStart,
          periodEnd,
          periodType,
        });
        analytics.push(analytic);
      } catch (error: any) {
        console.error(`❌ Error generating analytics for product ${productId}:`, error.message);
        // Continue with next product
      }
    }

    console.log(`✅ Bulk product analytics generation completed. Generated ${analytics.length} analytics`);
    return analytics;
  }

  // ===========================================
  // HEALTH CHECKS
  // ===========================================

  async healthCheck() {
    try {
      // Check if we can access the database
      await this.insightsRepo.getDailySnapshots('test', undefined, undefined, 1);
      await this.subscriptionRepo.getSubscriptionPlans('test', undefined, undefined, undefined, 1);
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          insights: 'ok',
          subscriptions: 'ok',
        },
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        services: {
          insights: 'error',
          subscriptions: 'error',
        },
      };
    }
  }
}

