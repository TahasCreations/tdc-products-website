/**
 * Loyalty Repository - Data access layer for loyalty points system
 * Handles CRUD operations for loyalty points, tiers, transactions, and redemptions
 */

import { PrismaClient } from '@prisma/client';
import type {
  LoyaltyPoint,
  LoyaltyTier,
  LoyaltyTransaction,
  LoyaltyRedemption,
  PointsEarningRule,
  PointsRedemptionRule,
  CostSharingRule
} from '@tdc/domain';

export class LoyaltyRepository {
  constructor(private prisma: PrismaClient) {}

  // ===========================================
  // LOYALTY POINTS
  // ===========================================

  async createLoyaltyPoint(data: {
    tenantId: string;
    customerId: string;
    points?: number;
    currentTierId?: string;
    status?: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED';
    pointsExpire?: boolean;
    expirationDays?: number;
    metadata?: Record<string, any>;
  }): Promise<LoyaltyPoint> {
    return this.prisma.loyaltyPoint.create({
      data: {
        tenantId: data.tenantId,
        customerId: data.customerId,
        points: data.points || 0,
        totalEarned: 0,
        totalRedeemed: 0,
        totalExpired: 0,
        currentTierId: data.currentTierId,
        tierPoints: 0,
        status: data.status || 'ACTIVE',
        pointsExpire: data.pointsExpire ?? true,
        expirationDays: data.expirationDays,
        metadata: data.metadata,
      },
    });
  }

  async getLoyaltyPoint(tenantId: string, customerId: string): Promise<LoyaltyPoint | null> {
    return this.prisma.loyaltyPoint.findFirst({
      where: {
        tenantId,
        customerId,
      },
      include: {
        currentTier: true,
        nextTier: true,
      },
    });
  }

  async updateLoyaltyPoint(
    tenantId: string,
    customerId: string,
    data: {
      points?: number;
      totalEarned?: number;
      totalRedeemed?: number;
      totalExpired?: number;
      currentTierId?: string;
      tierPoints?: number;
      nextTierId?: string;
      nextTierPoints?: number;
      status?: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED';
      lastEarnedAt?: Date;
      lastRedeemedAt?: Date;
      lastExpiredAt?: Date;
      tierUpgradedAt?: Date;
      tierDowngradedAt?: Date;
      nextExpirationAt?: Date;
      metadata?: Record<string, any>;
    }
  ): Promise<LoyaltyPoint> {
    return this.prisma.loyaltyPoint.updateMany({
      where: {
        tenantId,
        customerId,
      },
      data,
    }).then(() => this.getLoyaltyPoint(tenantId, customerId)) as Promise<LoyaltyPoint>;
  }

  async deleteLoyaltyPoint(tenantId: string, customerId: string): Promise<void> {
    await this.prisma.loyaltyPoint.deleteMany({
      where: {
        tenantId,
        customerId,
      },
    });
  }

  async getLoyaltyPointsByTenant(tenantId: string, limit = 100, offset = 0): Promise<LoyaltyPoint[]> {
    return this.prisma.loyaltyPoint.findMany({
      where: { tenantId },
      include: {
        currentTier: true,
        nextTier: true,
      },
      orderBy: { points: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getLoyaltyPointsByTier(tenantId: string, tierId: string): Promise<LoyaltyPoint[]> {
    return this.prisma.loyaltyPoint.findMany({
      where: {
        tenantId,
        currentTierId: tierId,
      },
      include: {
        currentTier: true,
        nextTier: true,
      },
    });
  }

  // ===========================================
  // LOYALTY TIERS
  // ===========================================

  async createLoyaltyTier(data: {
    tenantId: string;
    name: string;
    description?: string;
    level: number;
    color?: string;
    icon?: string;
    minPoints: number;
    maxPoints?: number;
    benefits?: any[];
    discountRate?: number;
    freeShipping?: boolean;
    prioritySupport?: boolean;
    exclusiveAccess?: boolean;
    earningMultiplier?: number;
    bonusCategories?: string[];
    redemptionRate?: number;
    maxRedemptionRate?: number;
    isActive?: boolean;
    isDefault?: boolean;
    metadata?: Record<string, any>;
  }): Promise<LoyaltyTier> {
    return this.prisma.loyaltyTier.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        description: data.description,
        level: data.level,
        color: data.color,
        icon: data.icon,
        minPoints: data.minPoints,
        maxPoints: data.maxPoints,
        benefits: data.benefits,
        discountRate: data.discountRate,
        freeShipping: data.freeShipping ?? false,
        prioritySupport: data.prioritySupport ?? false,
        exclusiveAccess: data.exclusiveAccess ?? false,
        earningMultiplier: data.earningMultiplier ?? 1.0,
        bonusCategories: data.bonusCategories || [],
        redemptionRate: data.redemptionRate,
        maxRedemptionRate: data.maxRedemptionRate,
        isActive: data.isActive ?? true,
        isDefault: data.isDefault ?? false,
        metadata: data.metadata,
      },
    });
  }

  async getLoyaltyTier(id: string): Promise<LoyaltyTier | null> {
    return this.prisma.loyaltyTier.findUnique({
      where: { id },
    });
  }

  async getLoyaltyTiersByTenant(tenantId: string, activeOnly = true): Promise<LoyaltyTier[]> {
    return this.prisma.loyaltyTier.findMany({
      where: {
        tenantId,
        ...(activeOnly && { isActive: true }),
      },
      orderBy: { level: 'asc' },
    });
  }

  async getDefaultTier(tenantId: string): Promise<LoyaltyTier | null> {
    return this.prisma.loyaltyTier.findFirst({
      where: {
        tenantId,
        isDefault: true,
        isActive: true,
      },
    });
  }

  async updateLoyaltyTier(
    id: string,
    data: {
      name?: string;
      description?: string;
      level?: number;
      color?: string;
      icon?: string;
      minPoints?: number;
      maxPoints?: number;
      benefits?: any[];
      discountRate?: number;
      freeShipping?: boolean;
      prioritySupport?: boolean;
      exclusiveAccess?: boolean;
      earningMultiplier?: number;
      bonusCategories?: string[];
      redemptionRate?: number;
      maxRedemptionRate?: number;
      isActive?: boolean;
      isDefault?: boolean;
      metadata?: Record<string, any>;
    }
  ): Promise<LoyaltyTier> {
    return this.prisma.loyaltyTier.update({
      where: { id },
      data,
    });
  }

  async deleteLoyaltyTier(id: string): Promise<void> {
    await this.prisma.loyaltyTier.delete({
      where: { id },
    });
  }

  // ===========================================
  // LOYALTY TRANSACTIONS
  // ===========================================

  async createLoyaltyTransaction(data: {
    tenantId: string;
    customerId: string;
    loyaltyPointId: string;
    tierId?: string;
    type: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'ADJUSTED' | 'BONUS' | 'REFUNDED' | 'TRANSFERRED';
    points: number;
    description: string;
    reference?: string;
    orderId?: string;
    orderAmount?: number;
    orderItems?: any[];
    promotionId?: string;
    promotionCode?: string;
    multiplier?: number;
    expiresAt?: Date;
    expiredAt?: Date;
    status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    metadata?: Record<string, any>;
  }): Promise<LoyaltyTransaction> {
    return this.prisma.loyaltyTransaction.create({
      data: {
        tenantId: data.tenantId,
        customerId: data.customerId,
        loyaltyPointId: data.loyaltyPointId,
        tierId: data.tierId,
        type: data.type,
        points: data.points,
        description: data.description,
        reference: data.reference,
        orderId: data.orderId,
        orderAmount: data.orderAmount,
        orderItems: data.orderItems,
        promotionId: data.promotionId,
        promotionCode: data.promotionCode,
        multiplier: data.multiplier,
        expiresAt: data.expiresAt,
        expiredAt: data.expiredAt,
        status: data.status || 'COMPLETED',
        metadata: data.metadata,
      },
    });
  }

  async getLoyaltyTransaction(id: string): Promise<LoyaltyTransaction | null> {
    return this.prisma.loyaltyTransaction.findUnique({
      where: { id },
      include: {
        tier: true,
        order: true,
      },
    });
  }

  async getLoyaltyTransactionsByCustomer(
    tenantId: string,
    customerId: string,
    limit = 50,
    offset = 0
  ): Promise<LoyaltyTransaction[]> {
    return this.prisma.loyaltyTransaction.findMany({
      where: {
        tenantId,
        customerId,
      },
      include: {
        tier: true,
        order: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getLoyaltyTransactionsByOrder(tenantId: string, orderId: string): Promise<LoyaltyTransaction[]> {
    return this.prisma.loyaltyTransaction.findMany({
      where: {
        tenantId,
        orderId,
      },
      include: {
        tier: true,
        order: true,
      },
    });
  }

  async getLoyaltyTransactionsByType(
    tenantId: string,
    type: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'ADJUSTED' | 'BONUS' | 'REFUNDED' | 'TRANSFERRED',
    limit = 100,
    offset = 0
  ): Promise<LoyaltyTransaction[]> {
    return this.prisma.loyaltyTransaction.findMany({
      where: {
        tenantId,
        type,
      },
      include: {
        tier: true,
        order: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async updateLoyaltyTransaction(
    id: string,
    data: {
      status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
      expiredAt?: Date;
      metadata?: Record<string, any>;
    }
  ): Promise<LoyaltyTransaction> {
    return this.prisma.loyaltyTransaction.update({
      where: { id },
      data,
    });
  }

  // ===========================================
  // LOYALTY REDEMPTIONS
  // ===========================================

  async createLoyaltyRedemption(data: {
    tenantId: string;
    customerId: string;
    loyaltyPointId: string;
    tierId?: string;
    pointsUsed: number;
    discountAmount: number;
    discountRate: number;
    orderId: string;
    orderAmount: number;
    orderItems?: any[];
    maxRedemptionRate?: number;
    minOrderAmount?: number;
    applicableItems?: string[];
    status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
    metadata?: Record<string, any>;
  }): Promise<LoyaltyRedemption> {
    return this.prisma.loyaltyRedemption.create({
      data: {
        tenantId: data.tenantId,
        customerId: data.customerId,
        loyaltyPointId: data.loyaltyPointId,
        tierId: data.tierId,
        pointsUsed: data.pointsUsed,
        discountAmount: data.discountAmount,
        discountRate: data.discountRate,
        orderId: data.orderId,
        orderAmount: data.orderAmount,
        orderItems: data.orderItems,
        maxRedemptionRate: data.maxRedemptionRate,
        minOrderAmount: data.minOrderAmount,
        applicableItems: data.applicableItems || [],
        status: data.status || 'COMPLETED',
        metadata: data.metadata,
      },
    });
  }

  async getLoyaltyRedemption(id: string): Promise<LoyaltyRedemption | null> {
    return this.prisma.loyaltyRedemption.findUnique({
      where: { id },
      include: {
        tier: true,
        order: true,
      },
    });
  }

  async getLoyaltyRedemptionsByCustomer(
    tenantId: string,
    customerId: string,
    limit = 50,
    offset = 0
  ): Promise<LoyaltyRedemption[]> {
    return this.prisma.loyaltyRedemption.findMany({
      where: {
        tenantId,
        customerId,
      },
      include: {
        tier: true,
        order: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getLoyaltyRedemptionsByOrder(tenantId: string, orderId: string): Promise<LoyaltyRedemption[]> {
    return this.prisma.loyaltyRedemption.findMany({
      where: {
        tenantId,
        orderId,
      },
      include: {
        tier: true,
        order: true,
      },
    });
  }

  async updateLoyaltyRedemption(
    id: string,
    data: {
      status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
      metadata?: Record<string, any>;
    }
  ): Promise<LoyaltyRedemption> {
    return this.prisma.loyaltyRedemption.update({
      where: { id },
      data,
    });
  }

  // ===========================================
  // ANALYTICS & REPORTING
  // ===========================================

  async getLoyaltyAnalytics(
    tenantId: string,
    dateRange: { start: Date; end: Date }
  ): Promise<{
    totalPointsEarned: number;
    totalPointsRedeemed: number;
    totalPointsExpired: number;
    activeCustomers: number;
    tierDistribution: { tier: string; count: number }[];
    redemptionRate: number;
    averageOrderValue: number;
    customerLifetimeValue: number;
  }> {
    const [earned, redeemed, expired, activeCustomers, tierDistribution, orders] = await Promise.all([
      this.prisma.loyaltyTransaction.aggregate({
        where: {
          tenantId,
          type: 'EARNED',
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        },
        _sum: { points: true },
      }),
      this.prisma.loyaltyTransaction.aggregate({
        where: {
          tenantId,
          type: 'REDEEMED',
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        },
        _sum: { points: true },
      }),
      this.prisma.loyaltyTransaction.aggregate({
        where: {
          tenantId,
          type: 'EXPIRED',
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        },
        _sum: { points: true },
      }),
      this.prisma.loyaltyPoint.count({
        where: {
          tenantId,
          status: 'ACTIVE',
          points: { gt: 0 },
        },
      }),
      this.prisma.loyaltyPoint.groupBy({
        by: ['currentTierId'],
        where: {
          tenantId,
          status: 'ACTIVE',
        },
        _count: { currentTierId: true },
      }),
      this.prisma.loyaltyTransaction.aggregate({
        where: {
          tenantId,
          orderAmount: { not: null },
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        },
        _avg: { orderAmount: true },
      }),
    ]);

    const totalPointsEarned = earned._sum.points || 0;
    const totalPointsRedeemed = Math.abs(redeemed._sum.points || 0);
    const totalPointsExpired = Math.abs(expired._sum.points || 0);
    const redemptionRate = totalPointsEarned > 0 ? (totalPointsRedeemed / totalPointsEarned) * 100 : 0;
    const averageOrderValue = orders._avg.orderAmount || 0;
    const customerLifetimeValue = activeCustomers > 0 ? (totalPointsEarned * 0.01) / activeCustomers : 0;

    return {
      totalPointsEarned,
      totalPointsRedeemed,
      totalPointsExpired,
      activeCustomers,
      tierDistribution: tierDistribution.map(t => ({
        tier: t.currentTierId || 'No Tier',
        count: t._count.currentTierId,
      })),
      redemptionRate,
      averageOrderValue: Number(averageOrderValue),
      customerLifetimeValue,
    };
  }

  async getCustomerLoyaltyHistory(
    tenantId: string,
    customerId: string,
    limit = 50
  ): Promise<LoyaltyTransaction[]> {
    return this.prisma.loyaltyTransaction.findMany({
      where: {
        tenantId,
        customerId,
      },
      include: {
        tier: true,
        order: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  // ===========================================
  // POINTS EXPIRATION
  // ===========================================

  async getExpiringPoints(tenantId: string, expirationDate: Date): Promise<LoyaltyPoint[]> {
    return this.prisma.loyaltyPoint.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        points: { gt: 0 },
        nextExpirationAt: {
          lte: expirationDate,
        },
      },
      include: {
        currentTier: true,
      },
    });
  }

  async updateExpirationDate(
    tenantId: string,
    customerId: string,
    nextExpirationAt: Date
  ): Promise<void> {
    await this.prisma.loyaltyPoint.updateMany({
      where: {
        tenantId,
        customerId,
      },
      data: {
        nextExpirationAt,
      },
    });
  }

  // ===========================================
  // BULK OPERATIONS
  // ===========================================

  async bulkUpdateTiers(tenantId: string, updates: Array<{
    customerId: string;
    currentTierId: string;
    tierPoints: number;
    nextTierId?: string;
    nextTierPoints?: number;
  }>): Promise<void> {
    await this.prisma.$transaction(
      updates.map(update =>
        this.prisma.loyaltyPoint.updateMany({
          where: {
            tenantId,
            customerId: update.customerId,
          },
          data: {
            currentTierId: update.currentTierId,
            tierPoints: update.tierPoints,
            nextTierId: update.nextTierId,
            nextTierPoints: update.nextTierPoints,
            tierUpgradedAt: new Date(),
          },
        })
      )
    );
  }

  async bulkCreateTransactions(transactions: Array<{
    tenantId: string;
    customerId: string;
    loyaltyPointId: string;
    tierId?: string;
    type: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'ADJUSTED' | 'BONUS' | 'REFUNDED' | 'TRANSFERRED';
    points: number;
    description: string;
    reference?: string;
    orderId?: string;
    orderAmount?: number;
    orderItems?: any[];
    promotionId?: string;
    promotionCode?: string;
    multiplier?: number;
    expiresAt?: Date;
    status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    metadata?: Record<string, any>;
  }>): Promise<void> {
    await this.prisma.loyaltyTransaction.createMany({
      data: transactions,
    });
  }
}

