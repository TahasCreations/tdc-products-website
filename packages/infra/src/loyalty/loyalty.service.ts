/**
 * Loyalty Service - Concrete implementation of loyalty points system
 * Orchestrates domain logic, database interactions, and event processing
 */

import { PrismaClient } from '@prisma/client';
import { LoyaltyRepository } from '../database/repositories/loyalty.repository.js';
import type { LoyaltyPort } from '@tdc/domain';
import type {
  LoyaltyPoint,
  LoyaltyTier,
  LoyaltyTransaction,
  LoyaltyRedemption,
  PointsEarningRule,
  PointsRedemptionRule,
  CostSharingRule
} from '@tdc/domain';
import {
  calculatePointsEarned,
  calculatePointsRedemption,
  calculateTierUpgrade,
  calculateCostSharing,
  calculatePointsExpiration,
  generateLoyaltyInsights,
  validateLoyaltyRules,
  calculateLoyaltyROI
} from '@tdc/domain';

export class LoyaltyService implements LoyaltyPort {
  private loyaltyRepository: LoyaltyRepository;

  constructor(private prisma: PrismaClient) {
    this.loyaltyRepository = new LoyaltyRepository(prisma);
  }

  // ===========================================
  // POINTS MANAGEMENT
  // ===========================================

  async getCustomerPoints(tenantId: string, customerId: string): Promise<LoyaltyPoint | null> {
    return this.loyaltyRepository.getLoyaltyPoint(tenantId, customerId);
  }

  async createCustomerPoints(tenantId: string, customerId: string): Promise<LoyaltyPoint> {
    // Get default tier
    const defaultTier = await this.loyaltyRepository.getDefaultTier(tenantId);
    
    return this.loyaltyRepository.createLoyaltyPoint({
      tenantId,
      customerId,
      points: 0,
      currentTierId: defaultTier?.id,
      status: 'ACTIVE',
      pointsExpire: true,
      expirationDays: 365, // 1 year default
    });
  }

  async updateCustomerPoints(tenantId: string, customerId: string, points: number): Promise<LoyaltyPoint> {
    const currentPoints = await this.getCustomerPoints(tenantId, customerId);
    if (!currentPoints) {
      throw new Error('Customer loyalty points not found');
    }

    return this.loyaltyRepository.updateLoyaltyPoint(tenantId, customerId, {
      points,
    });
  }

  // ===========================================
  // POINTS EARNING
  // ===========================================

  async earnPoints(
    tenantId: string,
    customerId: string,
    orderId: string,
    orderAmount: number,
    orderItems: any[],
    rules: PointsEarningRule[]
  ): Promise<{
    pointsEarned: number;
    transaction: LoyaltyTransaction;
    tierUpgraded: boolean;
    newTier?: LoyaltyTier;
  }> {
    // Get or create customer points
    let customerPoints = await this.getCustomerPoints(tenantId, customerId);
    if (!customerPoints) {
      customerPoints = await this.createCustomerPoints(tenantId, customerId);
    }

    // Get customer tier
    const customerTier = customerPoints.currentTierId ? 
      await this.loyaltyRepository.getLoyaltyTier(customerPoints.currentTierId) : null;

    // Calculate points earned
    const earningResult = calculatePointsEarned(orderAmount, orderItems, rules, customerTier);
    
    if (earningResult.pointsEarned === 0) {
      // Create transaction record even if no points earned
      const transaction = await this.loyaltyRepository.createLoyaltyTransaction({
        tenantId,
        customerId,
        loyaltyPointId: customerPoints.id,
        tierId: customerTier?.id,
        type: 'EARNED',
        points: 0,
        description: 'No points earned for this order',
        reference: orderId,
        orderId,
        orderAmount,
        orderItems,
        status: 'COMPLETED',
      });

      return {
        pointsEarned: 0,
        transaction,
        tierUpgraded: false,
      };
    }

    // Update customer points
    const newTotalPoints = customerPoints.points + earningResult.pointsEarned;
    const newTotalEarned = customerPoints.totalEarned + earningResult.pointsEarned;

    // Check for tier upgrade
    const allTiers = await this.loyaltyRepository.getLoyaltyTiersByTenant(tenantId);
    const tierUpgradeResult = calculateTierUpgrade(
      customerPoints.points,
      earningResult.pointsEarned,
      allTiers
    );

    let tierUpgraded = false;
    let newTier: LoyaltyTier | undefined;

    if (tierUpgradeResult.willUpgrade && tierUpgradeResult.newTier) {
      tierUpgraded = true;
      newTier = tierUpgradeResult.newTier;

      // Update customer tier
      await this.loyaltyRepository.updateLoyaltyPoint(tenantId, customerId, {
        points: newTotalPoints,
        totalEarned: newTotalEarned,
        currentTierId: newTier.id,
        tierPoints: newTotalPoints - newTier.minPoints,
        nextTierId: tierUpgradeResult.nextTier?.id,
        nextTierPoints: tierUpgradeResult.pointsNeeded,
        lastEarnedAt: new Date(),
        tierUpgradedAt: new Date(),
      });
    } else {
      // Update points without tier change
      await this.loyaltyRepository.updateLoyaltyPoint(tenantId, customerId, {
        points: newTotalPoints,
        totalEarned: newTotalEarned,
        lastEarnedAt: new Date(),
      });
    }

    // Create transaction record
    const transaction = await this.loyaltyRepository.createLoyaltyTransaction({
      tenantId,
      customerId,
      loyaltyPointId: customerPoints.id,
      tierId: customerTier?.id,
      type: 'EARNED',
      points: earningResult.pointsEarned,
      description: `Earned ${earningResult.pointsEarned} points from order`,
      reference: orderId,
      orderId,
      orderAmount,
      orderItems,
      status: 'COMPLETED',
      metadata: {
        appliedRules: earningResult.appliedRules,
        breakdown: earningResult.breakdown,
      },
    });

    return {
      pointsEarned: earningResult.pointsEarned,
      transaction,
      tierUpgraded,
      newTier,
    };
  }

  // ===========================================
  // POINTS REDEMPTION
  // ===========================================

  async redeemPoints(
    tenantId: string,
    customerId: string,
    orderId: string,
    orderAmount: number,
    pointsToRedeem: number,
    rules: PointsRedemptionRule[]
  ): Promise<{
    pointsUsed: number;
    discountAmount: number;
    redemption: LoyaltyRedemption;
    canRedeem: boolean;
    reason?: string;
  }> {
    // Get customer points
    const customerPoints = await this.getCustomerPoints(tenantId, customerId);
    if (!customerPoints) {
      return {
        pointsUsed: 0,
        discountAmount: 0,
        redemption: {} as LoyaltyRedemption,
        canRedeem: false,
        reason: 'Customer loyalty points not found',
      };
    }

    // Get customer tier
    const customerTier = customerPoints.currentTierId ? 
      await this.loyaltyRepository.getLoyaltyTier(customerPoints.currentTierId) : null;

    // Calculate redemption
    const redemptionResult = calculatePointsRedemption(
      customerPoints.points,
      orderAmount,
      pointsToRedeem,
      rules,
      customerTier
    );

    if (!redemptionResult.canRedeem) {
      return {
        pointsUsed: 0,
        discountAmount: 0,
        redemption: {} as LoyaltyRedemption,
        canRedeem: false,
        reason: redemptionResult.reason,
      };
    }

    // Update customer points
    const newTotalPoints = customerPoints.points - redemptionResult.pointsUsed;
    const newTotalRedeemed = customerPoints.totalRedeemed + redemptionResult.pointsUsed;

    await this.loyaltyRepository.updateLoyaltyPoint(tenantId, customerId, {
      points: newTotalPoints,
      totalRedeemed: newTotalRedeemed,
      lastRedeemedAt: new Date(),
    });

    // Create redemption record
    const redemption = await this.loyaltyRepository.createLoyaltyRedemption({
      tenantId,
      customerId,
      loyaltyPointId: customerPoints.id,
      tierId: customerTier?.id,
      pointsUsed: redemptionResult.pointsUsed,
      discountAmount: redemptionResult.discountAmount,
      discountRate: redemptionResult.discountAmount / orderAmount,
      orderId,
      orderAmount,
      status: 'COMPLETED',
      metadata: {
        appliedRules: redemptionResult.appliedRules,
      },
    });

    // Create transaction record
    await this.loyaltyRepository.createLoyaltyTransaction({
      tenantId,
      customerId,
      loyaltyPointId: customerPoints.id,
      tierId: customerTier?.id,
      type: 'REDEEMED',
      points: -redemptionResult.pointsUsed,
      description: `Redeemed ${redemptionResult.pointsUsed} points for ${redemptionResult.discountAmount} TRY discount`,
      reference: orderId,
      orderId,
      orderAmount,
      status: 'COMPLETED',
      metadata: {
        redemptionId: redemption.id,
        appliedRules: redemptionResult.appliedRules,
      },
    });

    return {
      pointsUsed: redemptionResult.pointsUsed,
      discountAmount: redemptionResult.discountAmount,
      redemption,
      canRedeem: true,
    };
  }

  // ===========================================
  // TIER MANAGEMENT
  // ===========================================

  async getCustomerTier(tenantId: string, customerId: string): Promise<LoyaltyTier | null> {
    const customerPoints = await this.getCustomerPoints(tenantId, customerId);
    if (!customerPoints || !customerPoints.currentTierId) {
      return null;
    }

    return this.loyaltyRepository.getLoyaltyTier(customerPoints.currentTierId);
  }

  async calculateTierUpgrade(tenantId: string, customerId: string, additionalPoints: number): Promise<{
    currentTier: LoyaltyTier;
    nextTier?: LoyaltyTier;
    pointsNeeded?: number;
    willUpgrade: boolean;
  }> {
    const customerPoints = await this.getCustomerPoints(tenantId, customerId);
    if (!customerPoints) {
      throw new Error('Customer loyalty points not found');
    }

    const allTiers = await this.loyaltyRepository.getLoyaltyTiersByTenant(tenantId);
    const currentTier = customerPoints.currentTierId ? 
      await this.loyaltyRepository.getLoyaltyTier(customerPoints.currentTierId) : null;

    if (!currentTier) {
      throw new Error('Customer tier not found');
    }

    const upgradeResult = calculateTierUpgrade(
      customerPoints.points,
      additionalPoints,
      allTiers
    );

    return {
      currentTier,
      nextTier: upgradeResult.nextTier,
      pointsNeeded: upgradeResult.pointsNeeded,
      willUpgrade: upgradeResult.willUpgrade,
    };
  }

  async upgradeCustomerTier(tenantId: string, customerId: string): Promise<{
    oldTier: LoyaltyTier;
    newTier: LoyaltyTier;
    benefits: any[];
  }> {
    const customerPoints = await this.getCustomerPoints(tenantId, customerId);
    if (!customerPoints) {
      throw new Error('Customer loyalty points not found');
    }

    const allTiers = await this.loyaltyRepository.getLoyaltyTiersByTenant(tenantId);
    const upgradeResult = calculateTierUpgrade(customerPoints.points, 0, allTiers);

    if (!upgradeResult.willUpgrade || !upgradeResult.newTier) {
      throw new Error('Customer is not eligible for tier upgrade');
    }

    const oldTier = customerPoints.currentTierId ? 
      await this.loyaltyRepository.getLoyaltyTier(customerPoints.currentTierId) : null;

    if (!oldTier) {
      throw new Error('Current tier not found');
    }

    // Update customer tier
    await this.loyaltyRepository.updateLoyaltyPoint(tenantId, customerId, {
      currentTierId: upgradeResult.newTier.id,
      tierPoints: customerPoints.points - upgradeResult.newTier.minPoints,
      nextTierId: upgradeResult.nextTier?.id,
      nextTierPoints: upgradeResult.pointsNeeded,
      tierUpgradedAt: new Date(),
    });

    return {
      oldTier,
      newTier: upgradeResult.newTier,
      benefits: upgradeResult.newTier.benefits || [],
    };
  }

  // ===========================================
  // POINTS EXPIRATION
  // ===========================================

  async expirePoints(tenantId: string, customerId: string): Promise<{
    expiredPoints: number;
    transactions: LoyaltyTransaction[];
  }> {
    const customerPoints = await this.getCustomerPoints(tenantId, customerId);
    if (!customerPoints) {
      throw new Error('Customer loyalty points not found');
    }

    const expirationResult = calculatePointsExpiration(
      customerPoints,
      customerPoints.expirationDays || 365
    );

    if (expirationResult.pointsToExpire === 0) {
      return {
        expiredPoints: 0,
        transactions: [],
      };
    }

    // Update customer points
    await this.loyaltyRepository.updateLoyaltyPoint(tenantId, customerId, {
      points: expirationResult.remainingPoints,
      totalExpired: customerPoints.totalExpired + expirationResult.pointsToExpire,
      lastExpiredAt: new Date(),
      nextExpirationAt: expirationResult.expirationDate,
    });

    // Create expiration transaction
    const transaction = await this.loyaltyRepository.createLoyaltyTransaction({
      tenantId,
      customerId,
      loyaltyPointId: customerPoints.id,
      type: 'EXPIRED',
      points: -expirationResult.pointsToExpire,
      description: `Expired ${expirationResult.pointsToExpire} points`,
      status: 'COMPLETED',
      expiredAt: new Date(),
    });

    return {
      expiredPoints: expirationResult.pointsToExpire,
      transactions: [transaction],
    };
  }

  // ===========================================
  // COST SHARING
  // ===========================================

  async calculateCostSharing(
    tenantId: string,
    orderId: string,
    orderAmount: number,
    sellerType: string,
    categories: string[],
    customerTier?: string,
    rules: CostSharingRule[]
  ): Promise<{
    platformShare: number;
    sellerShare: number;
    customerShare: number;
    totalCost: number;
    breakdown: {
      pointsCost: number;
      platformCost: number;
      sellerCost: number;
      customerCost: number;
    };
  }> {
    // Get order redemptions to calculate total discount
    const redemptions = await this.loyaltyRepository.getLoyaltyRedemptionsByOrder(tenantId, orderId);
    const totalDiscount = redemptions.reduce((sum, r) => sum + Number(r.discountAmount), 0);

    if (totalDiscount === 0) {
      return {
        platformShare: 0,
        sellerShare: 0,
        customerShare: 0,
        totalCost: 0,
        breakdown: {
          pointsCost: 0,
          platformCost: 0,
          sellerCost: 0,
          customerCost: 0,
        },
      };
    }

    // Calculate cost sharing
    const costSharingResult = calculateCostSharing(
      totalDiscount,
      totalDiscount,
      orderAmount,
      sellerType,
      categories,
      customerTier,
      rules
    );

    return costSharingResult;
  }

  // ===========================================
  // ANALYTICS
  // ===========================================

  async getCustomerLoyaltyHistory(tenantId: string, customerId: string, limit = 50): Promise<LoyaltyTransaction[]> {
    return this.loyaltyRepository.getCustomerLoyaltyHistory(tenantId, customerId, limit);
  }

  async getLoyaltyAnalytics(tenantId: string, dateRange: { start: Date; end: Date }): Promise<{
    totalPointsEarned: number;
    totalPointsRedeemed: number;
    totalPointsExpired: number;
    activeCustomers: number;
    tierDistribution: { tier: string; count: number }[];
    redemptionRate: number;
    averageOrderValue: number;
    customerLifetimeValue: number;
  }> {
    return this.loyaltyRepository.getLoyaltyAnalytics(tenantId, dateRange);
  }

  // ===========================================
  // RULES MANAGEMENT
  // ===========================================

  async getEarningRules(tenantId: string): Promise<PointsEarningRule[]> {
    // In a real implementation, these would be stored in the database
    // For now, return default rules
    return [
      {
        id: 'default-earning',
        name: 'Default Earning Rule',
        description: '1 point per 1 TRY spent',
        isActive: true,
        conditions: {
          minOrderAmount: 0,
        },
        earning: {
          baseRate: 1,
          multiplier: 1,
        },
      },
    ];
  }

  async getRedemptionRules(tenantId: string): Promise<PointsRedemptionRule[]> {
    // In a real implementation, these would be stored in the database
    return [
      {
        id: 'default-redemption',
        name: 'Default Redemption Rule',
        description: '100 points = 1 TRY discount',
        isActive: true,
        conditions: {
          minOrderAmount: 50,
        },
        redemption: {
          rate: 0.01,
          maxRedemptionRate: 0.5, // Max 50% of order
        },
      },
    ];
  }

  async getCostSharingRules(tenantId: string): Promise<CostSharingRule[]> {
    // In a real implementation, these would be stored in the database
    return [
      {
        id: 'default-cost-sharing',
        name: 'Default Cost Sharing',
        description: 'Platform pays 100% of loyalty costs',
        isActive: true,
        conditions: {},
        sharing: {
          platformShare: 100,
          sellerShare: 0,
          customerShare: 0,
        },
      },
    ];
  }

  // ===========================================
  // VALIDATION
  // ===========================================

  async validatePointsEarning(
    tenantId: string,
    customerId: string,
    orderAmount: number,
    orderItems: any[],
    rules: PointsEarningRule[]
  ): Promise<{
    canEarn: boolean;
    pointsEarned: number;
    reason?: string;
  }> {
    const customerPoints = await this.getCustomerPoints(tenantId, customerId);
    if (!customerPoints) {
      return {
        canEarn: false,
        pointsEarned: 0,
        reason: 'Customer loyalty points not found',
      };
    }

    const customerTier = customerPoints.currentTierId ? 
      await this.loyaltyRepository.getLoyaltyTier(customerPoints.currentTierId) : null;

    const earningResult = calculatePointsEarned(orderAmount, orderItems, rules, customerTier);

    return {
      canEarn: earningResult.pointsEarned > 0,
      pointsEarned: earningResult.pointsEarned,
      reason: earningResult.pointsEarned === 0 ? 'No applicable earning rules' : undefined,
    };
  }

  async validatePointsRedemption(
    tenantId: string,
    customerId: string,
    orderAmount: number,
    pointsToRedeem: number,
    rules: PointsRedemptionRule[]
  ): Promise<{
    canRedeem: boolean;
    maxPoints: number;
    discountAmount: number;
    reason?: string;
  }> {
    const customerPoints = await this.getCustomerPoints(tenantId, customerId);
    if (!customerPoints) {
      return {
        canRedeem: false,
        maxPoints: 0,
        discountAmount: 0,
        reason: 'Customer loyalty points not found',
      };
    }

    const customerTier = customerPoints.currentTierId ? 
      await this.loyaltyRepository.getLoyaltyTier(customerPoints.currentTierId) : null;

    const redemptionResult = calculatePointsRedemption(
      customerPoints.points,
      orderAmount,
      pointsToRedeem,
      rules,
      customerTier
    );

    return {
      canRedeem: redemptionResult.canRedeem,
      maxPoints: redemptionResult.pointsUsed,
      discountAmount: redemptionResult.discountAmount,
      reason: redemptionResult.reason,
    };
  }
}

