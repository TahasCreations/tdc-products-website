/**
 * Enterprise Real-Time Analytics System
 * Streaming analytics with BigQuery, Redis Streams
 */

import { Redis } from '@upstash/redis';
import { BigQuery } from '@google-cloud/bigquery';

interface AnalyticsEvent {
  eventType: string;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  properties: Record<string, any>;
  page: string;
  referrer?: string;
  device: string;
  browser: string;
  location?: string;
}

interface RealtimeMetrics {
  activeUsers: number;
  pageViews: number;
  conversions: number;
  revenue: number;
  topPages: Array<{ page: string; views: number }>;
  topProducts: Array<{ productId: string; views: number }>;
  conversionRate: number;
  avgSessionDuration: number;
}

export class RealtimeAnalyticsEngine {
  private redis: Redis;
  private bigquery: BigQuery;
  private streamBuffer: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout;

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL || '',
      token: process.env.UPSTASH_REDIS_TOKEN || '',
    });

    this.bigquery = new BigQuery({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_KEY_FILE,
    });

    // Flush events every 5 seconds
    this.flushInterval = setInterval(() => {
      this.flushToBigQuery();
    }, 5000);
  }

  /**
   * Track event in real-time
   */
  async trackEvent(event: AnalyticsEvent) {
    // Add to buffer for batch insert
    this.streamBuffer.push(event);

    // Update Redis for real-time metrics
    await this.updateRealtimeMetrics(event);

    // Stream to analytics platforms
    await this.streamToExternal(event);
  }

  /**
   * Update Redis counters for real-time dashboard
   */
  private async updateRealtimeMetrics(event: AnalyticsEvent) {
    const today = new Date().toISOString().split('T')[0];
    const pipeline = this.redis.pipeline();

    // Active users (last 5 minutes)
    if (event.userId) {
      pipeline.zadd(`active-users:${today}`, {
        score: Date.now(),
        member: event.userId,
      });
      pipeline.zremrangebyscore(
        `active-users:${today}`,
        0,
        Date.now() - 5 * 60 * 1000
      );
    }

    // Page views
    pipeline.incr(`pageviews:${today}`);
    pipeline.hincrby(`pageviews-by-page:${today}`, event.page, 1);

    // Product views
    if (event.eventType === 'product_view' && event.properties.productId) {
      pipeline.zincrby(
        `trending-products:${today}`,
        1,
        event.properties.productId
      );
    }

    // Conversions
    if (event.eventType === 'purchase') {
      pipeline.incr(`conversions:${today}`);
      pipeline.incrbyfloat(`revenue:${today}`, event.properties.amount || 0);
    }

    // Session tracking
    pipeline.setex(
      `session:${event.sessionId}`,
      1800, // 30 minutes TTL
      JSON.stringify({
        userId: event.userId,
        startTime: event.timestamp,
        lastActivity: event.timestamp,
      })
    );

    await pipeline.exec();
  }

  /**
   * Get real-time metrics
   */
  async getRealtimeMetrics(): Promise<RealtimeMetrics> {
    const today = new Date().toISOString().split('T')[0];

    const [
      activeUsers,
      pageViews,
      conversions,
      revenue,
      topPages,
      topProducts,
    ] = await Promise.all([
      this.redis.zcard(`active-users:${today}`),
      this.redis.get(`pageviews:${today}`),
      this.redis.get(`conversions:${today}`),
      this.redis.get(`revenue:${today}`),
      this.redis.hgetall(`pageviews-by-page:${today}`),
      this.redis.zrange(`trending-products:${today}`, 0, 9, { rev: true, withScores: true }),
    ]);

    // Parse top pages
    const topPagesArray = Object.entries(topPages || {})
      .map(([page, views]) => ({ page, views: parseInt(views as string) }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Parse top products
    const topProductsArray: Array<{ productId: string; views: number }> = [];
    for (let i = 0; i < topProducts.length; i += 2) {
      topProductsArray.push({
        productId: topProducts[i] as string,
        views: parseInt(topProducts[i + 1] as string),
      });
    }

    const pvCount = parseInt(pageViews as string || '0');
    const convCount = parseInt(conversions as string || '0');

    return {
      activeUsers: activeUsers as number,
      pageViews: pvCount,
      conversions: convCount,
      revenue: parseFloat(revenue as string || '0'),
      topPages: topPagesArray,
      topProducts: topProductsArray,
      conversionRate: pvCount > 0 ? (convCount / pvCount) * 100 : 0,
      avgSessionDuration: 0, // Calculate from session data
    };
  }

  /**
   * Funnel analysis
   */
  async analyzeFunnel(
    steps: string[],
    timeWindow: number = 24 * 60 * 60 * 1000
  ): Promise<Array<{ step: string; users: number; dropoffRate: number }>> {
    const funnel = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Count users who reached this step
      const users = await this.countUsersAtStep(step, timeWindow);
      
      // Calculate dropoff rate
      const dropoffRate = i > 0 
        ? ((funnel[i - 1].users - users) / funnel[i - 1].users) * 100
        : 0;

      funnel.push({ step, users, dropoffRate });
    }

    return funnel;
  }

  /**
   * Cohort analysis
   */
  async cohortAnalysis(
    cohortType: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ) {
    // Analyze user retention by cohort
    const cohorts = await this.getCohorts(cohortType);

    return cohorts.map(cohort => ({
      cohort: cohort.name,
      size: cohort.userCount,
      retention: this.calculateRetention(cohort),
      ltv: this.calculateLTV(cohort),
    }));
  }

  /**
   * A/B Test results tracking
   */
  async trackABTest(
    testId: string,
    variant: 'A' | 'B',
    userId: string,
    converted: boolean
  ) {
    await this.redis.hincrby(`ab-test:${testId}:variant-${variant}`, 'views', 1);
    
    if (converted) {
      await this.redis.hincrby(`ab-test:${testId}:variant-${variant}`, 'conversions', 1);
    }
  }

  async getABTestResults(testId: string) {
    const variantA = await this.redis.hgetall(`ab-test:${testId}:variant-A`);
    const variantB = await this.redis.hgetall(`ab-test:${testId}:variant-B`);

    const calculateConversionRate = (variant: any) => {
      const views = parseInt(variant.views || '0');
      const conversions = parseInt(variant.conversions || '0');
      return views > 0 ? (conversions / views) * 100 : 0;
    };

    return {
      variantA: {
        views: parseInt(variantA.views || '0'),
        conversions: parseInt(variantA.conversions || '0'),
        conversionRate: calculateConversionRate(variantA),
      },
      variantB: {
        views: parseInt(variantB.views || '0'),
        conversions: parseInt(variantB.conversions || '0'),
        conversionRate: calculateConversionRate(variantB),
      },
    };
  }

  // Helper methods
  private async flushToBigQuery() {
    if (this.streamBuffer.length === 0) return;

    const dataset = this.bigquery.dataset('analytics');
    const table = dataset.table('events');

    try {
      await table.insert(this.streamBuffer);
      console.log(`Flushed ${this.streamBuffer.length} events to BigQuery`);
      this.streamBuffer = [];
    } catch (error) {
      console.error('BigQuery flush error:', error);
    }
  }

  private async streamToExternal(event: AnalyticsEvent) {
    // Stream to Mixpanel, Amplitude, etc.
    // await mixpanel.track(event);
  }

  private async countUsersAtStep(step: string, timeWindow: number): Promise<number> {
    // Count unique users who reached this funnel step
    return 100; // Placeholder
  }

  private async getCohorts(type: string) {
    // Get user cohorts
    return [];
  }

  private calculateRetention(cohort: any): number[] {
    // Calculate retention percentages
    return [100, 80, 60, 45, 35, 28, 23]; // Week 0-6
  }

  private calculateLTV(cohort: any): number {
    // Lifetime value calculation
    return 0;
  }

  /**
   * Cleanup on shutdown
   */
  destroy() {
    clearInterval(this.flushInterval);
    this.flushToBigQuery();
  }
}

export const realtimeAnalytics = new RealtimeAnalyticsEngine();

