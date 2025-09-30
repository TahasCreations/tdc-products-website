/**
 * Promotion Service Implementation
 * Orchestrates promotion and coupon operations using domain logic and repository
 */

import { PromotionRepository, CreatePromotionInput, CreateCouponInput, CreatePromotionUsageInput, CreateCouponUsageInput, PromotionSearchParams } from '../database/repositories/promotion.repository.js';
import { PrismaClient } from '../database/prisma-client.js';
import { 
  evaluateJSONLogic,
  isPromotionEligible,
  calculateDiscountAmount,
  resolvePromotionConflicts,
  generatePromotionCode,
  generateCouponCode,
  validatePromotionConfiguration,
  calculatePromotionMetrics,
  canPromotionsStack,
  createSampleEligibilityRules,
  PromotionEligibilityContext,
  PromotionResult,
  ConflictResolutionResult
} from '@tdc/domain';

export interface PromotionService {
  // Promotion management
  createPromotion(input: CreatePromotionInput): Promise<{ success: boolean; promotion?: any; error?: string }>;
  updatePromotion(id: string, input: any): Promise<{ success: boolean; promotion?: any; error?: string }>;
  getPromotion(id: string): Promise<any | null>;
  getPromotionByCode(code: string): Promise<any | null>;
  deletePromotion(id: string): Promise<{ success: boolean }>;
  
  // Coupon management
  createCoupon(input: CreateCouponInput): Promise<{ success: boolean; coupon?: any; error?: string }>;
  getCouponByCode(code: string): Promise<any | null>;
  getCouponsByCustomer(customerId: string, tenantId: string): Promise<any[]>;
  
  // Eligibility and application
  checkEligibility(promotionId: string, context: PromotionEligibilityContext): Promise<{ eligible: boolean; reason?: string; score: number }>;
  applyPromotions(context: PromotionEligibilityContext, promotionIds: string[]): Promise<ConflictResolutionResult>;
  
  // Statistics and analytics
  getPromotionStatistics(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<any>;
  getPromotionUsageStats(promotionId: string, dateFrom?: Date, dateTo?: Date): Promise<any>;
  
  // Conflict resolution
  createConflictRule(input: any): Promise<{ success: boolean; conflict?: any; error?: string }>;
  getConflictRules(tenantId: string): Promise<any[]>;
  
  // Health check
  healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string; details?: any }>;
}

export class PromotionServiceImpl implements PromotionService {
  private prisma: PrismaClient;
  private promotionRepo: PromotionRepository;

  constructor() {
    this.prisma = new PrismaClient();
    this.promotionRepo = new PromotionRepository(this.prisma);
  }

  async createPromotion(input: CreatePromotionInput): Promise<{ success: boolean; promotion?: any; error?: string }> {
    try {
      console.log('[Promotion Service] Creating promotion:', input.name);

      // Validate promotion configuration
      const validation = validatePromotionConfiguration({
        name: input.name,
        discountType: input.discountType,
        discountValue: input.discountValue,
        startDate: input.startDate,
        endDate: input.endDate,
        usageLimit: input.usageLimit,
        minOrderAmount: input.minOrderAmount
      });

      if (!validation.isValid) {
        return {
          success: false,
          error: `Invalid promotion configuration: ${validation.errors.join(', ')}`
        };
      }

      // Generate code if not provided
      if (!input.code) {
        input.code = generatePromotionCode();
      }

      // Check if code already exists
      const existingPromotion = await this.promotionRepo.getPromotionByCode(input.code);
      if (existingPromotion) {
        return {
          success: false,
          error: 'Promotion code already exists'
        };
      }

      const promotion = await this.promotionRepo.createPromotion(input);

      console.log('[Promotion Service] Promotion created successfully:', promotion.id);

      return {
        success: true,
        promotion: this.transformPromotion(promotion)
      };
    } catch (error) {
      console.error('[Promotion Service] Error creating promotion:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create promotion'
      };
    }
  }

  async updatePromotion(id: string, input: any): Promise<{ success: boolean; promotion?: any; error?: string }> {
    try {
      console.log('[Promotion Service] Updating promotion:', id);

      const promotion = await this.promotionRepo.updatePromotion(id, input);

      return {
        success: true,
        promotion: this.transformPromotion(promotion)
      };
    } catch (error) {
      console.error('[Promotion Service] Error updating promotion:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update promotion'
      };
    }
  }

  async getPromotion(id: string): Promise<any | null> {
    try {
      const promotion = await this.promotionRepo.getPromotionById(id);
      return promotion ? this.transformPromotion(promotion) : null;
    } catch (error) {
      console.error('[Promotion Service] Error getting promotion:', error);
      return null;
    }
  }

  async getPromotionByCode(code: string): Promise<any | null> {
    try {
      const promotion = await this.promotionRepo.getPromotionByCode(code);
      return promotion ? this.transformPromotion(promotion) : null;
    } catch (error) {
      console.error('[Promotion Service] Error getting promotion by code:', error);
      return null;
    }
  }

  async deletePromotion(id: string): Promise<{ success: boolean }> {
    try {
      const result = await this.promotionRepo.deletePromotion(id);
      return result;
    } catch (error) {
      console.error('[Promotion Service] Error deleting promotion:', error);
      return { success: false };
    }
  }

  async createCoupon(input: CreateCouponInput): Promise<{ success: boolean; coupon?: any; error?: string }> {
    try {
      console.log('[Promotion Service] Creating coupon for promotion:', input.promotionId);

      // Generate code if not provided
      if (!input.code) {
        input.code = generateCouponCode();
      }

      // Check if code already exists
      const existingCoupon = await this.promotionRepo.getCouponByCode(input.code);
      if (existingCoupon) {
        return {
          success: false,
          error: 'Coupon code already exists'
        };
      }

      const coupon = await this.promotionRepo.createCoupon(input);

      console.log('[Promotion Service] Coupon created successfully:', coupon.id);

      return {
        success: true,
        coupon: this.transformCoupon(coupon)
      };
    } catch (error) {
      console.error('[Promotion Service] Error creating coupon:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create coupon'
      };
    }
  }

  async getCouponByCode(code: string): Promise<any | null> {
    try {
      const coupon = await this.promotionRepo.getCouponByCode(code);
      return coupon ? this.transformCoupon(coupon) : null;
    } catch (error) {
      console.error('[Promotion Service] Error getting coupon by code:', error);
      return null;
    }
  }

  async getCouponsByCustomer(customerId: string, tenantId: string): Promise<any[]> {
    try {
      const coupons = await this.promotionRepo.getCouponsByCustomer(customerId, tenantId);
      return coupons.map(coupon => this.transformCoupon(coupon));
    } catch (error) {
      console.error('[Promotion Service] Error getting customer coupons:', error);
      return [];
    }
  }

  async checkEligibility(promotionId: string, context: PromotionEligibilityContext): Promise<{ eligible: boolean; reason?: string; score: number }> {
    try {
      console.log('[Promotion Service] Checking eligibility for promotion:', promotionId);

      const promotion = await this.promotionRepo.getPromotionById(promotionId);
      if (!promotion) {
        return { eligible: false, reason: 'Promotion not found', score: 0 };
      }

      const result = isPromotionEligible(promotion, context);

      console.log('[Promotion Service] Eligibility check result:', {
        promotionId,
        eligible: result.eligible,
        score: result.score
      });

      return result;
    } catch (error) {
      console.error('[Promotion Service] Error checking eligibility:', error);
      return { eligible: false, reason: 'Error checking eligibility', score: 0 };
    }
  }

  async applyPromotions(context: PromotionEligibilityContext, promotionIds: string[]): Promise<ConflictResolutionResult> {
    try {
      console.log('[Promotion Service] Applying promotions:', promotionIds);

      // Get all eligible promotions
      const eligiblePromotions: PromotionResult[] = [];

      for (const promotionId of promotionIds) {
        const eligibility = await this.checkEligibility(promotionId, context);
        if (eligibility.eligible) {
          const promotion = await this.promotionRepo.getPromotionById(promotionId);
          if (promotion) {
            const applicableItems = context.orderItems.map(item => item.productId);
            const discountAmount = calculateDiscountAmount(promotion, context, applicableItems);

            eligiblePromotions.push({
              promotionId: promotion.id,
              promotionCode: promotion.code || undefined,
              discountAmount,
              discountType: promotion.discountType as any,
              appliedItems: applicableItems,
              eligibilityScore: eligibility.score,
              metadata: {
                promotionName: promotion.name,
                priority: promotion.priority
              }
            });
          }
        }
      }

      // Get conflict rules
      const conflictRules = await this.promotionRepo.getConflictRulesForPromotions(promotionIds);

      // Resolve conflicts
      const resolution = resolvePromotionConflicts(eligiblePromotions, conflictRules);

      // Record usage for selected promotions
      for (const promotionId of resolution.selectedPromotions) {
        const promotion = eligiblePromotions.find(p => p.promotionId === promotionId);
        if (promotion) {
          await this.promotionRepo.incrementPromotionUsage(promotionId);
          
          // Record usage history
          await this.promotionRepo.createPromotionUsage({
            tenantId: context.tenantId || '',
            promotionId,
            orderId: context.orderId,
            customerId: context.customerId,
            discountAmount: promotion.discountAmount,
            originalAmount: context.orderAmount,
            finalAmount: context.orderAmount - promotion.discountAmount,
            appliedItems: promotion.appliedItems,
            metadata: promotion.metadata
          });
        }
      }

      console.log('[Promotion Service] Promotions applied successfully:', {
        selected: resolution.selectedPromotions.length,
        rejected: resolution.rejectedPromotions.length,
        totalDiscount: resolution.totalDiscount
      });

      return resolution;
    } catch (error) {
      console.error('[Promotion Service] Error applying promotions:', error);
      return {
        selectedPromotions: [],
        rejectedPromotions: [],
        totalDiscount: 0,
        resolutionStrategy: 'ERROR'
      };
    }
  }

  async getPromotionStatistics(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<any> {
    try {
      const stats = await this.promotionRepo.getPromotionStatistics(tenantId, dateFrom, dateTo);
      return stats;
    } catch (error) {
      console.error('[Promotion Service] Error getting promotion statistics:', error);
      return null;
    }
  }

  async getPromotionUsageStats(promotionId: string, dateFrom?: Date, dateTo?: Date): Promise<any> {
    try {
      const stats = await this.promotionRepo.getPromotionUsageStats(promotionId, dateFrom, dateTo);
      return stats;
    } catch (error) {
      console.error('[Promotion Service] Error getting promotion usage stats:', error);
      return null;
    }
  }

  async createConflictRule(input: any): Promise<{ success: boolean; conflict?: any; error?: string }> {
    try {
      console.log('[Promotion Service] Creating conflict rule');

      const conflict = await this.promotionRepo.createPromotionConflict(input);

      return {
        success: true,
        conflict: this.transformConflict(conflict)
      };
    } catch (error) {
      console.error('[Promotion Service] Error creating conflict rule:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create conflict rule'
      };
    }
  }

  async getConflictRules(tenantId: string): Promise<any[]> {
    try {
      const conflicts = await this.promotionRepo.getPromotionConflicts(tenantId);
      return conflicts.map(conflict => this.transformConflict(conflict));
    } catch (error) {
      console.error('[Promotion Service] Error getting conflict rules:', error);
      return [];
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string; details?: any }> {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;

      // Check if we have any active promotions
      const activePromotions = await this.promotionRepo.getActivePromotions('default-tenant');

      return {
        status: 'healthy',
        message: 'Promotion service is healthy',
        details: {
          activePromotions: activePromotions.length,
          databaseConnected: true
        }
      };
    } catch (error) {
      console.error('[Promotion Service] Health check failed:', error);
      return {
        status: 'unhealthy',
        message: `Promotion service health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  // Private helper methods

  private transformPromotion(promotion: any): any {
    return {
      id: promotion.id,
      name: promotion.name,
      description: promotion.description,
      code: promotion.code,
      type: promotion.type,
      status: promotion.status,
      discountType: promotion.discountType,
      discountValue: promotion.discountValue,
      maxDiscountAmount: promotion.maxDiscountAmount,
      minOrderAmount: promotion.minOrderAmount,
      usageLimit: promotion.usageLimit,
      usagePerCustomer: promotion.usagePerCustomer,
      usageCount: promotion.usageCount,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      priority: promotion.priority,
      stackable: promotion.stackable,
      stackableWith: promotion.stackableWith,
      eligibilityRules: promotion.eligibilityRules,
      targetType: promotion.targetType,
      targetIds: promotion.targetIds,
      displayName: promotion.displayName,
      displayDescription: promotion.displayDescription,
      bannerImage: promotion.bannerImage,
      iconImage: promotion.iconImage,
      tags: promotion.tags,
      metadata: promotion.metadata,
      createdAt: promotion.createdAt,
      updatedAt: promotion.updatedAt,
      createdBy: promotion.createdBy,
      coupons: promotion.coupons?.map((coupon: any) => this.transformCoupon(coupon)) || [],
      usageHistory: promotion.usageHistory || []
    };
  }

  private transformCoupon(coupon: any): any {
    return {
      id: coupon.id,
      code: coupon.code,
      status: coupon.status,
      usageLimit: coupon.usageLimit,
      usageCount: coupon.usageCount,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      assignedTo: coupon.assignedTo,
      assignedBy: coupon.assignedBy,
      metadata: coupon.metadata,
      createdAt: coupon.createdAt,
      updatedAt: coupon.updatedAt,
      promotion: coupon.promotion ? this.transformPromotion(coupon.promotion) : undefined,
      usageHistory: coupon.usageHistory || []
    };
  }

  private transformConflict(conflict: any): any {
    return {
      id: conflict.id,
      conflictType: conflict.conflictType,
      priority: conflict.priority,
      promotionIds: conflict.promotionIds,
      resolutionStrategy: conflict.resolutionStrategy,
      resolutionRules: conflict.resolutionRules,
      isActive: conflict.isActive,
      description: conflict.description,
      metadata: conflict.metadata,
      createdAt: conflict.createdAt,
      updatedAt: conflict.updatedAt
    };
  }

  async cleanup() {
    await this.prisma.$disconnect();
  }
}

