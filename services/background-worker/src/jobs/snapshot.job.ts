/**
 * Daily Snapshot Job
 * Collects and processes daily analytics data for insights
 */

import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { 
  calculateDailySnapshot,
  calculateProductAnalytics,
  calculateCompetitorAnalysis,
  generateInsights,
  type SnapshotData,
  type CompetitorData
} from '@tdc/domain';

export interface SnapshotJobData {
  tenantId: string;
  sellerId?: string;
  snapshotDate: string; // YYYY-MM-DD format
  snapshotType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  forceReprocess?: boolean;
}

export class SnapshotJob {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async process(job: Job<SnapshotJobData>): Promise<void> {
    const { tenantId, sellerId, snapshotDate, snapshotType, forceReprocess } = job.data;
    
    console.log(`📊 Processing ${snapshotType} snapshot for ${tenantId}${sellerId ? ` (seller: ${sellerId})` : ''} on ${snapshotDate}`);

    try {
      // Check if snapshot already exists
      const existingSnapshot = await this.prisma.dailySnapshot.findFirst({
        where: {
          tenantId,
          sellerId: sellerId || null,
          snapshotDate: new Date(snapshotDate),
          snapshotType,
        },
      });

      if (existingSnapshot && !forceReprocess) {
        console.log(`   Snapshot already exists, skipping...`);
        return;
      }

      // Update or create snapshot status
      const snapshot = await this.upsertSnapshot(tenantId, sellerId, snapshotDate, snapshotType);

      // Collect data for the snapshot period
      const snapshotData = await this.collectSnapshotData(tenantId, sellerId, snapshotDate);
      
      // Calculate analytics
      const analytics = calculateDailySnapshot(snapshotData);
      
      // Get competitor data for Pro subscribers
      let competitorData: CompetitorData[] = [];
      let competitorAnalysis = null;
      
      if (await this.hasProSubscription(tenantId, sellerId)) {
        competitorData = await this.collectCompetitorData(tenantId, sellerId, snapshotDate);
        competitorAnalysis = calculateCompetitorAnalysis(snapshotData, competitorData);
      }

      // Generate insights
      const historicalData = await this.getHistoricalData(tenantId, sellerId, snapshotDate, 30);
      const insights = generateInsights(analytics, competitorData, historicalData);

      // Update snapshot with results
      await this.updateSnapshot(snapshot.id, {
        status: 'COMPLETED',
        processedAt: new Date(),
        processingTime: Date.now() - job.timestamp,
        ...analytics,
        competitorData: competitorAnalysis,
        marketShare: competitorAnalysis?.marketShare,
        priceComparison: competitorAnalysis?.priceComparison,
        metadata: {
          insights,
          competitorCount: competitorData.length,
        },
      });

      // Create product analytics records
      await this.createProductAnalytics(tenantId, sellerId, snapshotData, snapshotDate);

      // Create competitor analysis records (Pro only)
      if (competitorData.length > 0) {
        await this.createCompetitorAnalyses(tenantId, sellerId, competitorData, snapshotDate);
      }

      console.log(`✅ Snapshot completed successfully`);
      console.log(`   Products: ${analytics.totalProducts} (${analytics.activeProducts} active)`);
      console.log(`   Orders: ${analytics.totalOrders}`);
      console.log(`   Revenue: ${analytics.totalRevenue} TRY`);
      console.log(`   Conversion: ${analytics.conversionRate.toFixed(2)}%`);
      console.log(`   Competitors: ${competitorData.length}`);

    } catch (error: any) {
      console.error(`❌ Snapshot processing failed:`, error);
      
      // Update snapshot with error
      await this.updateSnapshot(snapshot.id, {
        status: 'FAILED',
        errorMessage: error.message,
        processedAt: new Date(),
      });
      
      throw error;
    }
  }

  private async upsertSnapshot(
    tenantId: string,
    sellerId: string | undefined,
    snapshotDate: string,
    snapshotType: string
  ) {
    const snapshot = await this.prisma.dailySnapshot.upsert({
      where: {
        tenantId_sellerId_snapshotDate_snapshotType: {
          tenantId,
          sellerId: sellerId || null,
          snapshotDate: new Date(snapshotDate),
          snapshotType: snapshotType as any,
        },
      },
      update: {
        status: 'PROCESSING',
        updatedAt: new Date(),
      },
      create: {
        tenantId,
        sellerId: sellerId || null,
        snapshotDate: new Date(snapshotDate),
        snapshotType: snapshotType as any,
        status: 'PROCESSING',
      },
    });

    return snapshot;
  }

  private async collectSnapshotData(
    tenantId: string,
    sellerId: string | undefined,
    snapshotDate: string
  ): Promise<SnapshotData> {
    const date = new Date(snapshotDate);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get products
    const products = await this.prisma.product.findMany({
      where: {
        enabled: true,
        // Add seller filter if provided
        ...(sellerId && {
          // This would need a sellerId field in Product model
        }),
      },
      select: {
        id: true,
        title: true,
        price: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get orders for the day
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        // Add seller filter if provided
        ...(sellerId && {
          // This would need a sellerId field in Order model
        }),
      },
      select: {
        id: true,
        amount: true,
        createdAt: true,
      },
    });

    // Mock analytics data (in real implementation, this would come from analytics service)
    const pageViews = Math.floor(Math.random() * 1000) + 100;
    const uniqueVisitors = Math.floor(pageViews * 0.7);
    const bounceRate = Math.random() * 30 + 20; // 20-50%
    const sessionDuration = Math.random() * 300 + 60; // 1-6 minutes

    // Convert products to the expected format
    const productData = products.map(product => ({
      id: product.id,
      title: product.title,
      price: Number(product.price),
      category: product.categoryId || 'uncategorized',
      tags: [], // Would need tags field in Product model
      views: Math.floor(Math.random() * 100) + 10,
      clicks: Math.floor(Math.random() * 20) + 1,
      orders: orders.filter(o => o.id === product.id).length,
      revenue: orders.filter(o => o.id === product.id).reduce((sum, o) => sum + Number(o.amount), 0),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    // Convert orders to the expected format
    const orderData = orders.map(order => ({
      id: order.id,
      productId: 'unknown', // Would need productId in Order model
      amount: Number(order.amount),
      quantity: 1,
      createdAt: order.createdAt,
    }));

    return {
      tenantId,
      sellerId,
      snapshotDate: date,
      products: productData,
      orders: orderData,
      pageViews,
      uniqueVisitors,
      bounceRate,
      sessionDuration,
    };
  }

  private async collectCompetitorData(
    tenantId: string,
    sellerId: string | undefined,
    snapshotDate: string
  ): Promise<CompetitorData[]> {
    // In a real implementation, this would:
    // 1. Fetch competitor data from external APIs
    // 2. Scrape competitor websites
    // 3. Use market research services
    // 4. Analyze competitor pricing and products

    // Mock competitor data
    return [
      {
        name: 'Competitor A',
        url: 'https://competitor-a.com',
        type: 'DIRECT',
        marketShare: 15.5,
        totalProducts: 1250,
        averagePrice: 85.50,
        priceRange: { min: 10, max: 500 },
        commonProducts: 45,
        priceAdvantage: -5.2,
        trafficEstimate: 50000,
        conversionRate: 2.8,
        customerSatisfaction: 4.2,
        pricingStrategy: 'Premium',
        discountPattern: { frequency: 'monthly', average: 15 },
      },
      {
        name: 'Competitor B',
        url: 'https://competitor-b.com',
        type: 'MARKETPLACE',
        marketShare: 22.3,
        totalProducts: 2100,
        averagePrice: 65.20,
        priceRange: { min: 5, max: 300 },
        commonProducts: 38,
        priceAdvantage: 12.8,
        trafficEstimate: 75000,
        conversionRate: 3.2,
        customerSatisfaction: 4.0,
        pricingStrategy: 'Value',
        discountPattern: { frequency: 'weekly', average: 20 },
      },
    ];
  }

  private async getHistoricalData(
    tenantId: string,
    sellerId: string | undefined,
    snapshotDate: string,
    days: number
  ): Promise<SnapshotData[]> {
    // Get historical snapshots for trend analysis
    const endDate = new Date(snapshotDate);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    const snapshots = await this.prisma.dailySnapshot.findMany({
      where: {
        tenantId,
        sellerId: sellerId || null,
        snapshotDate: {
          gte: startDate,
          lt: endDate,
        },
        status: 'COMPLETED',
      },
      orderBy: {
        snapshotDate: 'asc',
      },
    });

    // Convert to SnapshotData format
    return snapshots.map(snapshot => ({
      tenantId: snapshot.tenantId,
      sellerId: snapshot.sellerId,
      snapshotDate: snapshot.snapshotDate,
      products: [], // Would need to reconstruct from snapshot data
      orders: [], // Would need to reconstruct from snapshot data
      pageViews: snapshot.pageViews,
      uniqueVisitors: snapshot.uniqueVisitors,
      bounceRate: snapshot.bounceRate,
      sessionDuration: snapshot.sessionDuration,
    }));
  }

  private async hasProSubscription(tenantId: string, sellerId?: string): Promise<boolean> {
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

  private async updateSnapshot(
    snapshotId: string,
    data: {
      status: string;
      processedAt: Date;
      processingTime?: number;
      errorMessage?: string;
      [key: string]: any;
    }
  ) {
    await this.prisma.dailySnapshot.update({
      where: { id: snapshotId },
      data,
    });
  }

  private async createProductAnalytics(
    tenantId: string,
    sellerId: string | undefined,
    snapshotData: SnapshotData,
    snapshotDate: string
  ) {
    const date = new Date(snapshotDate);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    for (const product of snapshotData.products) {
      const analytics = calculateProductAnalytics(
        product.id,
        snapshotData.products,
        snapshotData.orders,
        startOfDay,
        endOfDay
      );

      await this.prisma.productAnalytics.upsert({
        where: {
          tenantId_sellerId_productId_periodStart_periodEnd: {
            tenantId,
            sellerId: sellerId || null,
            productId: product.id,
            periodStart: startOfDay,
            periodEnd: endOfDay,
          },
        },
        update: analytics,
        create: {
          tenantId,
          sellerId: sellerId || null,
          productId: product.id,
          periodStart: startOfDay,
          periodEnd: endOfDay,
          periodType: 'DAILY',
          ...analytics,
        },
      });
    }
  }

  private async createCompetitorAnalyses(
    tenantId: string,
    sellerId: string | undefined,
    competitorData: CompetitorData[],
    snapshotDate: string
  ) {
    const date = new Date(snapshotDate);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    for (const competitor of competitorData) {
      await this.prisma.competitorAnalysis.create({
        data: {
          tenantId,
          sellerId: sellerId || null,
          competitorName: competitor.name,
          competitorUrl: competitor.url,
          competitorType: competitor.type,
          analysisDate: date,
          periodStart: startOfDay,
          periodEnd: endOfDay,
          marketShare: competitor.marketShare,
          totalProducts: competitor.totalProducts,
          averagePrice: competitor.averagePrice,
          priceRange: competitor.priceRange,
          commonProducts: competitor.commonProducts,
          priceAdvantage: competitor.priceAdvantage,
          trafficEstimate: competitor.trafficEstimate,
          conversionRate: competitor.conversionRate,
          customerSatisfaction: competitor.customerSatisfaction,
          pricingStrategy: competitor.pricingStrategy,
          discountPattern: competitor.discountPattern,
          status: 'ACTIVE',
        },
      });
    }
  }
}

