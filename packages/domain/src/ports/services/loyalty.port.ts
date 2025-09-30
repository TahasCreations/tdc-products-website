/**
 * Loyalty Port - Interface for loyalty points system
 * Handles points earning, redemption, tier management, and cost sharing
 */

export interface LoyaltyPoint {
  id: string;
  tenantId: string;
  customerId: string;
  points: number;
  totalEarned: number;
  totalRedeemed: number;
  totalExpired: number;
  currentTierId?: string;
  tierPoints: number;
  nextTierId?: string;
  nextTierPoints?: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED';
  lastEarnedAt?: Date;
  lastRedeemedAt?: Date;
  lastExpiredAt?: Date;
  tierUpgradedAt?: Date;
  tierDowngradedAt?: Date;
  pointsExpire: boolean;
  expirationDays?: number;
  nextExpirationAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyTier {
  id: string;
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
  freeShipping: boolean;
  prioritySupport: boolean;
  exclusiveAccess: boolean;
  earningMultiplier: number;
  bonusCategories: string[];
  redemptionRate?: number;
  maxRedemptionRate?: number;
  isActive: boolean;
  isDefault: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyTransaction {
  id: string;
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
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  processedAt: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface LoyaltyRedemption {
  id: string;
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
  applicableItems: string[];
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  processedAt: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface PointsEarningRule {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  conditions: {
    minOrderAmount?: number;
    maxOrderAmount?: number;
    categories?: string[];
    products?: string[];
    customerSegments?: string[];
    timeRange?: {
      start: Date;
      end: Date;
    };
  };
  earning: {
    baseRate: number; // Points per currency unit
    multiplier: number;
    maxPoints?: number;
    bonusCategories?: { category: string; multiplier: number }[];
  };
  metadata?: Record<string, any>;
}

export interface PointsRedemptionRule {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  conditions: {
    minOrderAmount?: number;
    maxOrderAmount?: number;
    categories?: string[];
    products?: string[];
    customerSegments?: string[];
    tiers?: string[];
  };
  redemption: {
    rate: number; // Currency per point
    maxRedemptionRate?: number; // Max percentage of order
    minPoints?: number;
    maxPoints?: number;
  };
  metadata?: Record<string, any>;
}

export interface CostSharingRule {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  conditions: {
    sellerTypes?: string[];
    orderAmount?: {
      min?: number;
      max?: number;
    };
    categories?: string[];
    tiers?: string[];
  };
  sharing: {
    platformShare: number; // Percentage platform pays
    sellerShare: number; // Percentage seller pays
    customerShare: number; // Percentage customer pays (if any)
  };
  metadata?: Record<string, any>;
}

export interface LoyaltyPort {
  // Points Management
  getCustomerPoints(tenantId: string, customerId: string): Promise<LoyaltyPoint | null>;
  createCustomerPoints(tenantId: string, customerId: string): Promise<LoyaltyPoint>;
  updateCustomerPoints(tenantId: string, customerId: string, points: number): Promise<LoyaltyPoint>;
  
  // Points Earning
  earnPoints(
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
  }>;
  
  // Points Redemption
  redeemPoints(
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
  }>;
  
  // Tier Management
  getCustomerTier(tenantId: string, customerId: string): Promise<LoyaltyTier | null>;
  calculateTierUpgrade(tenantId: string, customerId: string, additionalPoints: number): Promise<{
    currentTier: LoyaltyTier;
    nextTier?: LoyaltyTier;
    pointsNeeded?: number;
    willUpgrade: boolean;
  }>;
  upgradeCustomerTier(tenantId: string, customerId: string): Promise<{
    oldTier?: LoyaltyTier;
    newTier: LoyaltyTier;
    benefits: any[];
  }>;
  
  // Points Expiration
  expirePoints(tenantId: string, customerId: string): Promise<{
    expiredPoints: number;
    transactions: LoyaltyTransaction[];
  }>;
  
  // Cost Sharing
  calculateCostSharing(
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
  }>;
  
  // Analytics
  getCustomerLoyaltyHistory(tenantId: string, customerId: string, limit?: number): Promise<LoyaltyTransaction[]>;
  getLoyaltyAnalytics(tenantId: string, dateRange: { start: Date; end: Date }): Promise<{
    totalPointsEarned: number;
    totalPointsRedeemed: number;
    totalPointsExpired: number;
    activeCustomers: number;
    tierDistribution: { tier: string; count: number }[];
    redemptionRate: number;
    averageOrderValue: number;
    customerLifetimeValue: number;
  }>;
  
  // Rules Management
  getEarningRules(tenantId: string): Promise<PointsEarningRule[]>;
  getRedemptionRules(tenantId: string): Promise<PointsRedemptionRule[]>;
  getCostSharingRules(tenantId: string): Promise<CostSharingRule[]>;
  
  // Validation
  validatePointsEarning(
    tenantId: string,
    customerId: string,
    orderAmount: number,
    orderItems: any[],
    rules: PointsEarningRule[]
  ): Promise<{
    canEarn: boolean;
    pointsEarned: number;
    reason?: string;
  }>;
  
  validatePointsRedemption(
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
  }>;
}

