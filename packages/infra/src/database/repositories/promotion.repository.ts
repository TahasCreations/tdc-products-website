import { PrismaClient } from '../prisma-client.js';
import { 
  Promotion, 
  Coupon, 
  PromotionUsage, 
  CouponUsage,
  PromotionConflict,
  PromotionType,
  PromotionStatus,
  DiscountType,
  TargetType,
  CouponStatus,
  ConflictType,
  ResolutionStrategy
} from '@prisma/client';

export interface CreatePromotionInput {
  tenantId: string;
  name: string;
  description?: string;
  code?: string;
  type: PromotionType;
  status?: PromotionStatus;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  usageLimit?: number;
  usagePerCustomer?: number;
  startDate: Date;
  endDate?: Date;
  priority?: number;
  stackable?: boolean;
  stackableWith?: string[];
  eligibilityRules?: any;
  targetType?: TargetType;
  targetIds?: string[];
  displayName?: string;
  displayDescription?: string;
  bannerImage?: string;
  iconImage?: string;
  tags?: string[];
  metadata?: any;
  createdBy?: string;
}

export interface UpdatePromotionInput {
  name?: string;
  description?: string;
  code?: string;
  type?: PromotionType;
  status?: PromotionStatus;
  discountType?: DiscountType;
  discountValue?: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  usageLimit?: number;
  usagePerCustomer?: number;
  startDate?: Date;
  endDate?: Date;
  priority?: number;
  stackable?: boolean;
  stackableWith?: string[];
  eligibilityRules?: any;
  targetType?: TargetType;
  targetIds?: string[];
  displayName?: string;
  displayDescription?: string;
  bannerImage?: string;
  iconImage?: string;
  tags?: string[];
  metadata?: any;
}

export interface CreateCouponInput {
  tenantId: string;
  promotionId: string;
  code: string;
  status?: CouponStatus;
  usageLimit?: number;
  startDate: Date;
  endDate?: Date;
  assignedTo?: string;
  assignedBy?: string;
  metadata?: any;
}

export interface CreatePromotionUsageInput {
  tenantId: string;
  promotionId: string;
  orderId?: string;
  customerId?: string;
  discountAmount: number;
  originalAmount: number;
  finalAmount: number;
  appliedItems?: any;
  metadata?: any;
}

export interface CreateCouponUsageInput {
  tenantId: string;
  couponId: string;
  orderId?: string;
  customerId?: string;
  discountAmount: number;
  originalAmount: number;
  finalAmount: number;
  appliedItems?: any;
  metadata?: any;
}

export interface PromotionSearchParams {
  tenantId: string;
  status?: PromotionStatus;
  type?: PromotionType;
  targetType?: TargetType;
  customerId?: string;
  productId?: string;
  categoryId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export class PromotionRepository {
  constructor(private prisma: PrismaClient) {}

  // Promotion methods
  async createPromotion(input: CreatePromotionInput): Promise<Promotion> {
    return this.prisma.promotion.create({
      data: {
        tenantId: input.tenantId,
        name: input.name,
        description: input.description,
        code: input.code,
        type: input.type,
        status: input.status || 'ACTIVE',
        discountType: input.discountType,
        discountValue: input.discountValue,
        maxDiscountAmount: input.maxDiscountAmount,
        minOrderAmount: input.minOrderAmount,
        usageLimit: input.usageLimit,
        usagePerCustomer: input.usagePerCustomer,
        startDate: input.startDate,
        endDate: input.endDate,
        priority: input.priority || 1,
        stackable: input.stackable || false,
        stackableWith: input.stackableWith || [],
        eligibilityRules: input.eligibilityRules,
        targetType: input.targetType || 'ALL',
        targetIds: input.targetIds || [],
        displayName: input.displayName,
        displayDescription: input.displayDescription,
        bannerImage: input.bannerImage,
        iconImage: input.iconImage,
        tags: input.tags || [],
        metadata: input.metadata,
        createdBy: input.createdBy
      }
    });
  }

  async updatePromotion(id: string, input: UpdatePromotionInput): Promise<Promotion> {
    return this.prisma.promotion.update({
      where: { id },
      data: {
        ...input,
        updatedAt: new Date()
      }
    });
  }

  async getPromotionById(id: string): Promise<Promotion | null> {
    return this.prisma.promotion.findUnique({
      where: { id },
      include: {
        coupons: true,
        usageHistory: {
          orderBy: { usedAt: 'desc' },
          take: 10
        }
      }
    });
  }

  async getPromotionByCode(code: string): Promise<Promotion | null> {
    return this.prisma.promotion.findUnique({
      where: { code },
      include: {
        coupons: true,
        usageHistory: {
          orderBy: { usedAt: 'desc' },
          take: 10
        }
      }
    });
  }

  async getActivePromotions(tenantId: string): Promise<Promotion[]> {
    const now = new Date();
    return this.prisma.promotion.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } }
        ]
      },
      orderBy: { priority: 'desc' }
    });
  }

  async searchPromotions(params: PromotionSearchParams): Promise<{
    promotions: Promotion[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const {
      tenantId,
      status,
      type,
      targetType,
      customerId,
      productId,
      categoryId,
      dateFrom,
      dateTo,
      page = 1,
      limit = 50
    } = params;

    const where: any = {
      tenantId,
      ...(status && { status }),
      ...(type && { type }),
      ...(targetType && { targetType }),
      ...(dateFrom && dateTo && {
        startDate: { gte: dateFrom },
        endDate: { lte: dateTo }
      })
    };

    // Add target-specific filters
    if (customerId) {
      where.OR = [
        { targetType: 'ALL' },
        { targetType: 'CUSTOMER', targetIds: { has: customerId } }
      ];
    }

    if (productId) {
      where.OR = [
        { targetType: 'ALL' },
        { targetType: 'PRODUCT', targetIds: { has: productId } }
      ];
    }

    if (categoryId) {
      where.OR = [
        { targetType: 'ALL' },
        { targetType: 'CATEGORY', targetIds: { has: categoryId } }
      ];
    }

    const skip = (page - 1) * limit;

    const [promotions, total] = await Promise.all([
      this.prisma.promotion.findMany({
        where,
        include: {
          coupons: true,
          usageHistory: {
            orderBy: { usedAt: 'desc' },
            take: 5
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.promotion.count({ where })
    ]);

    return {
      promotions,
      total,
      page,
      limit,
      hasMore: (page * limit) < total
    };
  }

  async deletePromotion(id: string): Promise<{ success: boolean }> {
    try {
      await this.prisma.promotion.delete({
        where: { id }
      });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  // Coupon methods
  async createCoupon(input: CreateCouponInput): Promise<Coupon> {
    return this.prisma.coupon.create({
      data: {
        tenantId: input.tenantId,
        promotionId: input.promotionId,
        code: input.code,
        status: input.status || 'ACTIVE',
        usageLimit: input.usageLimit,
        startDate: input.startDate,
        endDate: input.endDate,
        assignedTo: input.assignedTo,
        assignedBy: input.assignedBy,
        metadata: input.metadata
      }
    });
  }

  async getCouponByCode(code: string): Promise<Coupon | null> {
    return this.prisma.coupon.findUnique({
      where: { code },
      include: {
        promotion: true,
        usageHistory: {
          orderBy: { usedAt: 'desc' },
          take: 10
        }
      }
    });
  }

  async getCouponsByPromotion(promotionId: string): Promise<Coupon[]> {
    return this.prisma.coupon.findMany({
      where: { promotionId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getCouponsByCustomer(customerId: string, tenantId: string): Promise<Coupon[]> {
    return this.prisma.coupon.findMany({
      where: {
        tenantId,
        OR: [
          { assignedTo: customerId },
          { assignedTo: null } // General coupons
        ],
        status: 'ACTIVE'
      },
      include: {
        promotion: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateCouponStatus(id: string, status: CouponStatus): Promise<Coupon> {
    return this.prisma.coupon.update({
      where: { id },
      data: { status }
    });
  }

  // Usage tracking methods
  async createPromotionUsage(input: CreatePromotionUsageInput): Promise<PromotionUsage> {
    return this.prisma.promotionUsage.create({
      data: {
        tenantId: input.tenantId,
        promotionId: input.promotionId,
        orderId: input.orderId,
        customerId: input.customerId,
        discountAmount: input.discountAmount,
        originalAmount: input.originalAmount,
        finalAmount: input.finalAmount,
        appliedItems: input.appliedItems,
        metadata: input.metadata
      }
    });
  }

  async createCouponUsage(input: CreateCouponUsageInput): Promise<CouponUsage> {
    return this.prisma.couponUsage.create({
      data: {
        tenantId: input.tenantId,
        couponId: input.couponId,
        orderId: input.orderId,
        customerId: input.customerId,
        discountAmount: input.discountAmount,
        originalAmount: input.originalAmount,
        finalAmount: input.finalAmount,
        appliedItems: input.appliedItems,
        metadata: input.metadata
      }
    });
  }

  async getPromotionUsageStats(promotionId: string, dateFrom?: Date, dateTo?: Date): Promise<{
    totalUsage: number;
    totalDiscount: number;
    averageDiscount: number;
    uniqueCustomers: number;
    revenueImpact: number;
  }> {
    const where: any = { promotionId };
    if (dateFrom && dateTo) {
      where.usedAt = { gte: dateFrom, lte: dateTo };
    }

    const [usage, uniqueCustomers] = await Promise.all([
      this.prisma.promotionUsage.findMany({
        where,
        select: {
          discountAmount: true,
          originalAmount: true,
          customerId: true
        }
      }),
      this.prisma.promotionUsage.findMany({
        where,
        select: { customerId: true },
        distinct: ['customerId']
      })
    ]);

    const totalUsage = usage.length;
    const totalDiscount = usage.reduce((sum, u) => sum + u.discountAmount, 0);
    const totalOriginal = usage.reduce((sum, u) => sum + u.originalAmount, 0);
    const averageDiscount = totalUsage > 0 ? totalDiscount / totalUsage : 0;
    const uniqueCustomersCount = uniqueCustomers.length;
    const revenueImpact = totalOriginal - totalDiscount;

    return {
      totalUsage,
      totalDiscount,
      averageDiscount,
      uniqueCustomers: uniqueCustomersCount,
      revenueImpact
    };
  }

  async getCouponUsageStats(couponId: string, dateFrom?: Date, dateTo?: Date): Promise<{
    totalUsage: number;
    totalDiscount: number;
    averageDiscount: number;
    uniqueCustomers: number;
    revenueImpact: number;
  }> {
    const where: any = { couponId };
    if (dateFrom && dateTo) {
      where.usedAt = { gte: dateFrom, lte: dateTo };
    }

    const [usage, uniqueCustomers] = await Promise.all([
      this.prisma.couponUsage.findMany({
        where,
        select: {
          discountAmount: true,
          originalAmount: true,
          customerId: true
        }
      }),
      this.prisma.couponUsage.findMany({
        where,
        select: { customerId: true },
        distinct: ['customerId']
      })
    ]);

    const totalUsage = usage.length;
    const totalDiscount = usage.reduce((sum, u) => sum + u.discountAmount, 0);
    const totalOriginal = usage.reduce((sum, u) => sum + u.originalAmount, 0);
    const averageDiscount = totalUsage > 0 ? totalDiscount / totalUsage : 0;
    const uniqueCustomersCount = uniqueCustomers.length;
    const revenueImpact = totalOriginal - totalDiscount;

    return {
      totalUsage,
      totalDiscount,
      averageDiscount,
      uniqueCustomers: uniqueCustomersCount,
      revenueImpact
    };
  }

  // Conflict resolution methods
  async createPromotionConflict(input: {
    tenantId: string;
    conflictType: ConflictType;
    priority: number;
    promotionIds: string[];
    resolutionStrategy: ResolutionStrategy;
    resolutionRules?: any;
    description?: string;
    metadata?: any;
  }): Promise<PromotionConflict> {
    return this.prisma.promotionConflict.create({
      data: {
        tenantId: input.tenantId,
        conflictType: input.conflictType,
        priority: input.priority,
        promotionIds: input.promotionIds,
        resolutionStrategy: input.resolutionStrategy,
        resolutionRules: input.resolutionRules,
        description: input.description,
        metadata: input.metadata
      }
    });
  }

  async getPromotionConflicts(tenantId: string): Promise<PromotionConflict[]> {
    return this.prisma.promotionConflict.findMany({
      where: {
        tenantId,
        isActive: true
      },
      orderBy: { priority: 'desc' }
    });
  }

  async getConflictsForPromotions(promotionIds: string[]): Promise<PromotionConflict[]> {
    return this.prisma.promotionConflict.findMany({
      where: {
        isActive: true,
        promotionIds: {
          hasSome: promotionIds
        }
      },
      orderBy: { priority: 'desc' }
    });
  }

  // Statistics methods
  async getPromotionStatistics(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<{
    totalPromotions: number;
    activePromotions: number;
    totalUsage: number;
    totalDiscount: number;
    averageDiscount: number;
    topPromotions: Array<{
      promotionId: string;
      name: string;
      usageCount: number;
      totalDiscount: number;
    }>;
    promotionsByType: Record<string, number>;
    promotionsByStatus: Record<string, number>;
  }> {
    const where: any = { tenantId };
    if (dateFrom && dateTo) {
      where.createdAt = { gte: dateFrom, lte: dateTo };
    }

    const [promotions, usageStats] = await Promise.all([
      this.prisma.promotion.findMany({
        where,
        select: {
          id: true,
          name: true,
          type: true,
          status: true,
          usageCount: true
        }
      }),
      this.prisma.promotionUsage.findMany({
        where: {
          tenantId,
          ...(dateFrom && dateTo && {
            usedAt: { gte: dateFrom, lte: dateTo }
          })
        },
        select: {
          promotionId: true,
          discountAmount: true
        }
      })
    ]);

    const totalPromotions = promotions.length;
    const activePromotions = promotions.filter(p => p.status === 'ACTIVE').length;
    const totalUsage = usageStats.length;
    const totalDiscount = usageStats.reduce((sum, u) => sum + u.discountAmount, 0);
    const averageDiscount = totalUsage > 0 ? totalDiscount / totalUsage : 0;

    // Top promotions by usage
    const promotionUsageMap = new Map<string, { count: number; discount: number }>();
    usageStats.forEach(usage => {
      const existing = promotionUsageMap.get(usage.promotionId) || { count: 0, discount: 0 };
      promotionUsageMap.set(usage.promotionId, {
        count: existing.count + 1,
        discount: existing.discount + usage.discountAmount
      });
    });

    const topPromotions = Array.from(promotionUsageMap.entries())
      .map(([promotionId, stats]) => {
        const promotion = promotions.find(p => p.id === promotionId);
        return {
          promotionId,
          name: promotion?.name || 'Unknown',
          usageCount: stats.count,
          totalDiscount: stats.discount
        };
      })
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10);

    // Promotions by type
    const promotionsByType = promotions.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Promotions by status
    const promotionsByStatus = promotions.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPromotions,
      activePromotions,
      totalUsage,
      totalDiscount,
      averageDiscount,
      topPromotions,
      promotionsByType,
      promotionsByStatus
    };
  }

  // Utility methods
  async incrementPromotionUsage(promotionId: string): Promise<void> {
    await this.prisma.promotion.update({
      where: { id: promotionId },
      data: {
        usageCount: { increment: 1 }
      }
    });
  }

  async incrementCouponUsage(couponId: string): Promise<void> {
    await this.prisma.coupon.update({
      where: { id: couponId },
      data: {
        usageCount: { increment: 1 }
      }
    });
  }

  async getPromotionsByPriority(tenantId: string): Promise<Promotion[]> {
    return this.prisma.promotion.findMany({
      where: {
        tenantId,
        status: 'ACTIVE'
      },
      orderBy: { priority: 'desc' }
    });
  }

  async getExpiredPromotions(tenantId: string): Promise<Promotion[]> {
    const now = new Date();
    return this.prisma.promotion.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        endDate: { lt: now }
      }
    });
  }

  async updateExpiredPromotions(tenantId: string): Promise<number> {
    const now = new Date();
    const result = await this.prisma.promotion.updateMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        endDate: { lt: now }
      },
      data: {
        status: 'EXPIRED'
      }
    });
    return result.count;
  }
}

