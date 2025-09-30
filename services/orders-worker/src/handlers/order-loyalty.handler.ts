/**
 * Order Loyalty Handler - Handles loyalty points for order events
 * Processes points earning, redemption, and tier management
 */

import { PrismaClient } from '@prisma/client';
import { LoyaltyService } from '@tdc/infra';

export interface OrderLoyaltyData {
  orderId: string;
  tenantId: string;
  customerId: string;
  sellerId: string;
  sellerType: string;
  orderAmount: number;
  orderItems: Array<{
    id: string;
    productId: string;
    categoryId: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  categories: string[];
  loyaltyPointsUsed?: number;
  loyaltyDiscount?: number;
  completedAt?: Date;
  cancelledAt?: Date;
}

export interface LoyaltyResult {
  success: boolean;
  message: string;
  pointsEarned?: number;
  pointsRedeemed?: number;
  tierUpgraded?: boolean;
  newTier?: string;
  costSharing?: {
    platformShare: number;
    sellerShare: number;
    customerShare: number;
  };
}

export class OrderLoyaltyHandler {
  private loyaltyService: LoyaltyService;

  constructor() {
    const prisma = new PrismaClient();
    this.loyaltyService = new LoyaltyService(prisma);
  }

  /**
   * Handle loyalty points when order is created
   */
  async handleOrderCreated(data: OrderLoyaltyData): Promise<LoyaltyResult> {
    console.log('🎯 Processing loyalty for OrderCreated');
    console.log(`   Order: ${data.orderId}, Customer: ${data.customerId}, Amount: ${data.orderAmount}`);

    try {
      // Get earning rules
      const earningRules = await this.loyaltyService.getEarningRules(data.tenantId);
      
      // Calculate points earned
      const earningResult = await this.loyaltyService.earnPoints(
        data.tenantId,
        data.customerId,
        data.orderId,
        data.orderAmount,
        data.orderItems,
        earningRules
      );

      console.log(`   Points earned: ${earningResult.pointsEarned}`);
      if (earningResult.tierUpgraded) {
        console.log(`   Tier upgraded to: ${earningResult.newTier?.name}`);
      }

      return {
        success: true,
        message: `Earned ${earningResult.pointsEarned} loyalty points`,
        pointsEarned: earningResult.pointsEarned,
        tierUpgraded: earningResult.tierUpgraded,
        newTier: earningResult.newTier?.name,
      };

    } catch (error: any) {
      console.error('❌ Error processing loyalty for OrderCreated:', error);
      return {
        success: false,
        message: `Failed to process loyalty points: ${error.message}`,
      };
    }
  }

  /**
   * Handle loyalty points when order is completed
   */
  async handleOrderCompleted(data: OrderLoyaltyData): Promise<LoyaltyResult> {
    console.log('🎯 Processing loyalty for OrderCompleted');
    console.log(`   Order: ${data.orderId}, Customer: ${data.customerId}, Amount: ${data.orderAmount}`);

    try {
      // Get earning rules
      const earningRules = await this.loyaltyService.getEarningRules(data.tenantId);
      
      // Calculate points earned (if not already processed)
      const earningResult = await this.loyaltyService.earnPoints(
        data.tenantId,
        data.customerId,
        data.orderId,
        data.orderAmount,
        data.orderItems,
        earningRules
      );

      // Calculate cost sharing for loyalty points
      const costSharingRules = await this.loyaltyService.getCostSharingRules(data.tenantId);
      const costSharingResult = await this.loyaltyService.calculateCostSharing(
        data.tenantId,
        data.orderId,
        data.orderAmount,
        data.sellerType,
        data.categories,
        undefined, // customerTier will be determined by service
        costSharingRules
      );

      console.log(`   Points earned: ${earningResult.pointsEarned}`);
      console.log(`   Cost sharing - Platform: ${costSharingResult.platformShare}%, Seller: ${costSharingResult.sellerShare}%`);

      return {
        success: true,
        message: `Order completed - ${earningResult.pointsEarned} points earned`,
        pointsEarned: earningResult.pointsEarned,
        tierUpgraded: earningResult.tierUpgraded,
        newTier: earningResult.newTier?.name,
        costSharing: {
          platformShare: costSharingResult.platformShare,
          sellerShare: costSharingResult.sellerShare,
          customerShare: costSharingResult.customerShare,
        },
      };

    } catch (error: any) {
      console.error('❌ Error processing loyalty for OrderCompleted:', error);
      return {
        success: false,
        message: `Failed to process loyalty completion: ${error.message}`,
      };
    }
  }

  /**
   * Handle loyalty points when order is cancelled
   */
  async handleOrderCancelled(data: OrderLoyaltyData): Promise<LoyaltyResult> {
    console.log('🎯 Processing loyalty for OrderCancelled');
    console.log(`   Order: ${data.orderId}, Customer: ${data.customerId}`);

    try {
      // Get customer points
      const customerPoints = await this.loyaltyService.getCustomerPoints(data.tenantId, data.customerId);
      if (!customerPoints) {
        return {
          success: true,
          message: 'No loyalty points to refund',
        };
      }

      // Get order transactions to find points earned
      const orderTransactions = await this.loyaltyService.getCustomerLoyaltyHistory(
        data.tenantId,
        data.customerId,
        100
      );

      const orderEarnedTransactions = orderTransactions.filter(
        t => t.orderId === data.orderId && t.type === 'EARNED'
      );

      if (orderEarnedTransactions.length === 0) {
        return {
          success: true,
          message: 'No points earned for this order to refund',
        };
      }

      // Calculate total points to refund
      const totalPointsToRefund = orderEarnedTransactions.reduce(
        (sum, t) => sum + t.points, 0
      );

      if (totalPointsToRefund === 0) {
        return {
          success: true,
          message: 'No points to refund',
        };
      }

      // Create refund transaction
      const refundTransaction = await this.loyaltyService.loyaltyRepository.createLoyaltyTransaction({
        tenantId: data.tenantId,
        customerId: data.customerId,
        loyaltyPointId: customerPoints.id,
        type: 'REFUNDED',
        points: -totalPointsToRefund,
        description: `Refunded ${totalPointsToRefund} points due to order cancellation`,
        reference: data.orderId,
        orderId: data.orderId,
        status: 'COMPLETED',
      });

      // Update customer points
      await this.loyaltyService.updateCustomerPoints(
        data.tenantId,
        data.customerId,
        customerPoints.points - totalPointsToRefund
      );

      console.log(`   Refunded ${totalPointsToRefund} loyalty points`);

      return {
        success: true,
        message: `Refunded ${totalPointsToRefund} loyalty points`,
        pointsRedeemed: totalPointsToRefund,
      };

    } catch (error: any) {
      console.error('❌ Error processing loyalty for OrderCancelled:', error);
      return {
        success: false,
        message: `Failed to process loyalty refund: ${error.message}`,
      };
    }
  }

  /**
   * Handle loyalty points redemption during checkout
   */
  async handlePointsRedemption(data: OrderLoyaltyData): Promise<LoyaltyResult> {
    console.log('🎯 Processing loyalty points redemption');
    console.log(`   Order: ${data.orderId}, Points to redeem: ${data.loyaltyPointsUsed}`);

    if (!data.loyaltyPointsUsed || data.loyaltyPointsUsed <= 0) {
      return {
        success: true,
        message: 'No points to redeem',
      };
    }

    try {
      // Get redemption rules
      const redemptionRules = await this.loyaltyService.getRedemptionRules(data.tenantId);
      
      // Process points redemption
      const redemptionResult = await this.loyaltyService.redeemPoints(
        data.tenantId,
        data.customerId,
        data.orderId,
        data.orderAmount,
        data.loyaltyPointsUsed,
        redemptionRules
      );

      if (!redemptionResult.canRedeem) {
        return {
          success: false,
          message: redemptionResult.reason || 'Cannot redeem points',
        };
      }

      console.log(`   Redeemed ${redemptionResult.pointsUsed} points for ${redemptionResult.discountAmount} TRY discount`);

      return {
        success: true,
        message: `Redeemed ${redemptionResult.pointsUsed} points for ${redemptionResult.discountAmount} TRY discount`,
        pointsRedeemed: redemptionResult.pointsUsed,
      };

    } catch (error: any) {
      console.error('❌ Error processing loyalty redemption:', error);
      return {
        success: false,
        message: `Failed to process loyalty redemption: ${error.message}`,
      };
    }
  }

  /**
   * Get customer loyalty status
   */
  async getCustomerLoyaltyStatus(tenantId: string, customerId: string): Promise<{
    points: number;
    tier: string | null;
    nextTier: string | null;
    pointsToNextTier: number;
    canRedeem: boolean;
    maxRedemption: number;
  }> {
    try {
      const customerPoints = await this.loyaltyService.getCustomerPoints(tenantId, customerId);
      if (!customerPoints) {
        return {
          points: 0,
          tier: null,
          nextTier: null,
          pointsToNextTier: 0,
          canRedeem: false,
          maxRedemption: 0,
        };
      }

      const customerTier = await this.loyaltyService.getCustomerTier(tenantId, customerId);
      const tierUpgrade = await this.loyaltyService.calculateTierUpgrade(tenantId, customerId, 0);

      // Get redemption rules to check if customer can redeem
      const redemptionRules = await this.loyaltyService.getRedemptionRules(tenantId);
      const redemptionValidation = await this.loyaltyService.validatePointsRedemption(
        tenantId,
        customerId,
        100, // Test with 100 TRY order
        customerPoints.points,
        redemptionRules
      );

      return {
        points: customerPoints.points,
        tier: customerTier?.name || null,
        nextTier: tierUpgrade.nextTier?.name || null,
        pointsToNextTier: tierUpgrade.pointsNeeded || 0,
        canRedeem: redemptionValidation.canRedeem,
        maxRedemption: redemptionValidation.maxPoints,
      };

    } catch (error: any) {
      console.error('❌ Error getting customer loyalty status:', error);
      return {
        points: 0,
        tier: null,
        nextTier: null,
        pointsToNextTier: 0,
        canRedeem: false,
        maxRedemption: 0,
      };
    }
  }

  /**
   * Process points expiration
   */
  async processPointsExpiration(tenantId: string, customerId: string): Promise<LoyaltyResult> {
    console.log('🎯 Processing points expiration');
    console.log(`   Customer: ${customerId}`);

    try {
      const expirationResult = await this.loyaltyService.expirePoints(tenantId, customerId);

      if (expirationResult.expiredPoints === 0) {
        return {
          success: true,
          message: 'No points expired',
        };
      }

      console.log(`   Expired ${expirationResult.expiredPoints} points`);

      return {
        success: true,
        message: `Expired ${expirationResult.expiredPoints} loyalty points`,
        pointsRedeemed: expirationResult.expiredPoints,
      };

    } catch (error: any) {
      console.error('❌ Error processing points expiration:', error);
      return {
        success: false,
        message: `Failed to process points expiration: ${error.message}`,
      };
    }
  }
}

