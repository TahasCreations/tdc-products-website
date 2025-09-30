/**
 * Loyalty service - Pure functions for loyalty points system
 * Handles points earning, redemption, tier management, and cost sharing
 */

import type {
  LoyaltyPoint,
  LoyaltyTier,
  LoyaltyTransaction,
  LoyaltyRedemption,
  PointsEarningRule,
  PointsRedemptionRule,
  CostSharingRule
} from '../ports/services/loyalty.port.js';

export interface OrderItem {
  id: string;
  productId: string;
  categoryId: string;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderContext {
  id: string;
  customerId: string;
  amount: number;
  items: OrderItem[];
  sellerType: string;
  categories: string[];
  customerTier?: string;
  metadata?: Record<string, any>;
}

/**
 * Calculate points earned from an order
 */
export function calculatePointsEarned(
  orderAmount: number,
  orderItems: OrderItem[],
  rules: PointsEarningRule[],
  customerTier?: LoyaltyTier
): {
  pointsEarned: number;
  appliedRules: string[];
  breakdown: {
    basePoints: number;
    categoryBonus: number;
    tierMultiplier: number;
    totalPoints: number;
  };
} {
  let totalPoints = 0;
  const appliedRules: string[] = [];
  
  // Find applicable earning rules
  const applicableRules = rules.filter(rule => 
    rule.isActive && 
    (!rule.conditions.minOrderAmount || orderAmount >= rule.conditions.minOrderAmount) &&
    (!rule.conditions.maxOrderAmount || orderAmount <= rule.conditions.maxOrderAmount)
  );

  if (applicableRules.length === 0) {
    return {
      pointsEarned: 0,
      appliedRules: [],
      breakdown: {
        basePoints: 0,
        categoryBonus: 0,
        tierMultiplier: 1,
        totalPoints: 0
      }
    };
  }

  // Use the rule with highest base rate
  const bestRule = applicableRules.reduce((best, current) => 
    current.earning.baseRate > best.earning.baseRate ? current : best
  );

  appliedRules.push(bestRule.id);

  // Calculate base points
  const basePoints = Math.floor(orderAmount * bestRule.earning.baseRate);
  
  // Calculate category bonus points
  let categoryBonus = 0;
  if (bestRule.earning.bonusCategories && bestRule.earning.bonusCategories.length > 0) {
    for (const item of orderItems) {
      const bonusCategory = bestRule.earning.bonusCategories.find(
        bc => bc.category === item.categoryId
      );
      if (bonusCategory) {
        categoryBonus += Math.floor(item.total * bestRule.earning.baseRate * (bonusCategory.multiplier - 1));
      }
    }
  }

  // Apply tier multiplier
  const tierMultiplier = customerTier?.earningMultiplier || 1;
  
  // Calculate total points
  totalPoints = Math.floor((basePoints + categoryBonus) * bestRule.earning.multiplier * tierMultiplier);
  
  // Apply maximum points limit
  if (bestRule.earning.maxPoints && totalPoints > bestRule.earning.maxPoints) {
    totalPoints = bestRule.earning.maxPoints;
  }

  return {
    pointsEarned: totalPoints,
    appliedRules,
    breakdown: {
      basePoints,
      categoryBonus,
      tierMultiplier,
      totalPoints
    }
  };
}

/**
 * Calculate points redemption for an order
 */
export function calculatePointsRedemption(
  customerPoints: number,
  orderAmount: number,
  pointsToRedeem: number,
  rules: PointsRedemptionRule[],
  customerTier?: LoyaltyTier
): {
  canRedeem: boolean;
  pointsUsed: number;
  discountAmount: number;
  reason?: string;
  appliedRules: string[];
} {
  // Check if customer has enough points
  if (customerPoints < pointsToRedeem) {
    return {
      canRedeem: false,
      pointsUsed: 0,
      discountAmount: 0,
      reason: 'Insufficient points',
      appliedRules: []
    };
  }

  // Find applicable redemption rules
  const applicableRules = rules.filter(rule => 
    rule.isActive &&
    (!rule.conditions.minOrderAmount || orderAmount >= rule.conditions.minOrderAmount) &&
    (!rule.conditions.maxOrderAmount || orderAmount <= rule.conditions.maxOrderAmount) &&
    (!rule.conditions.tiers || !customerTier || rule.conditions.tiers.includes(customerTier.id))
  );

  if (applicableRules.length === 0) {
    return {
      canRedeem: false,
      pointsUsed: 0,
      discountAmount: 0,
      reason: 'No applicable redemption rules',
      appliedRules: []
    };
  }

  // Use the rule with best redemption rate
  const bestRule = applicableRules.reduce((best, current) => 
    current.redemption.rate > best.redemption.rate ? current : best
  );

  // Check minimum points requirement
  if (bestRule.redemption.minPoints && pointsToRedeem < bestRule.redemption.minPoints) {
    return {
      canRedeem: false,
      pointsUsed: 0,
      discountAmount: 0,
      reason: `Minimum ${bestRule.redemption.minPoints} points required`,
      appliedRules: []
    };
  }

  // Check maximum points requirement
  const maxPoints = bestRule.redemption.maxPoints || pointsToRedeem;
  const actualPointsUsed = Math.min(pointsToRedeem, maxPoints);

  // Calculate discount amount
  const discountAmount = actualPointsUsed * bestRule.redemption.rate;

  // Check maximum redemption rate
  const maxDiscountAmount = orderAmount * (bestRule.redemption.maxRedemptionRate || 1);
  const finalDiscountAmount = Math.min(discountAmount, maxDiscountAmount);
  const finalPointsUsed = Math.floor(finalDiscountAmount / bestRule.redemption.rate);

  return {
    canRedeem: true,
    pointsUsed: finalPointsUsed,
    discountAmount: finalDiscountAmount,
    appliedRules: [bestRule.id]
  };
}

/**
 * Calculate tier upgrade based on points
 */
export function calculateTierUpgrade(
  currentPoints: number,
  additionalPoints: number,
  tiers: LoyaltyTier[]
): {
  currentTier: LoyaltyTier | null;
  nextTier: LoyaltyTier | null;
  pointsNeeded: number;
  willUpgrade: boolean;
  newTier: LoyaltyTier | null;
} {
  const totalPoints = currentPoints + additionalPoints;
  
  // Sort tiers by level
  const sortedTiers = [...tiers].sort((a, b) => a.level - b.level);
  
  // Find current tier
  const currentTier = sortedTiers.find(tier => 
    tier.isActive && 
    totalPoints >= tier.minPoints && 
    (!tier.maxPoints || totalPoints < tier.maxPoints)
  ) || null;

  // Find next tier
  const nextTier = sortedTiers.find(tier => 
    tier.isActive && 
    tier.level > (currentTier?.level || 0) &&
    totalPoints >= tier.minPoints
  ) || null;

  // Calculate points needed for next tier
  const pointsNeeded = nextTier ? nextTier.minPoints - totalPoints : 0;
  
  // Check if will upgrade
  const willUpgrade = nextTier !== null && totalPoints >= nextTier.minPoints;
  
  // Determine new tier
  const newTier = willUpgrade ? nextTier : currentTier;

  return {
    currentTier,
    nextTier,
    pointsNeeded: Math.max(0, pointsNeeded),
    willUpgrade,
    newTier
  };
}

/**
 * Calculate cost sharing for loyalty points
 */
export function calculateCostSharing(
  pointsUsed: number,
  discountAmount: number,
  orderAmount: number,
  sellerType: string,
  categories: string[],
  customerTier?: string,
  rules: CostSharingRule[]
): {
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
} {
  // Find applicable cost sharing rules
  const applicableRules = rules.filter(rule => 
    rule.isActive &&
    (!rule.conditions.sellerTypes || rule.conditions.sellerTypes.includes(sellerType)) &&
    (!rule.conditions.categories || rule.conditions.categories.some(cat => categories.includes(cat))) &&
    (!rule.conditions.tiers || !customerTier || rule.conditions.tiers.includes(customerTier))
  );

  if (applicableRules.length === 0) {
    // Default cost sharing: Platform pays 100%
    return {
      platformShare: 100,
      sellerShare: 0,
      customerShare: 0,
      totalCost: discountAmount,
      breakdown: {
        pointsCost: discountAmount,
        platformCost: discountAmount,
        sellerCost: 0,
        customerCost: 0
      }
    };
  }

  // Use the most specific rule (highest priority)
  const rule = applicableRules[0];
  
  const platformCost = (discountAmount * rule.sharing.platformShare) / 100;
  const sellerCost = (discountAmount * rule.sharing.sellerShare) / 100;
  const customerCost = (discountAmount * rule.sharing.customerShare) / 100;

  return {
    platformShare: rule.sharing.platformShare,
    sellerShare: rule.sharing.sellerShare,
    customerShare: rule.sharing.customerShare,
    totalCost: discountAmount,
    breakdown: {
      pointsCost: discountAmount,
      platformCost,
      sellerCost,
      customerCost
    }
  };
}

/**
 * Calculate points expiration
 */
export function calculatePointsExpiration(
  points: LoyaltyPoint,
  expirationDays: number
): {
  pointsToExpire: number;
  expirationDate: Date;
  remainingPoints: number;
} {
  if (!points.pointsExpire || !expirationDays) {
    return {
      pointsToExpire: 0,
      expirationDate: new Date(),
      remainingPoints: points.points
    };
  }

  // Calculate points that should expire
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDays);
  
  // For simplicity, expire oldest points first (FIFO)
  // In a real implementation, you'd track point ages
  const pointsToExpire = Math.min(points.points, points.totalEarned * 0.1); // Expire 10% of earned points
  const remainingPoints = Math.max(0, points.points - pointsToExpire);

  return {
    pointsToExpire,
    expirationDate,
    remainingPoints
  };
}

/**
 * Generate loyalty insights
 */
export function generateLoyaltyInsights(
  customerPoints: LoyaltyPoint,
  customerTier: LoyaltyTier | null,
  allTiers: LoyaltyTier[],
  recentTransactions: LoyaltyTransaction[]
): {
  currentTier: LoyaltyTier | null;
  nextTier: LoyaltyTier | null;
  pointsToNextTier: number;
  tierProgress: number;
  recentActivity: {
    earned: number;
    redeemed: number;
    expired: number;
  };
  recommendations: string[];
  benefits: any[];
} {
  const sortedTiers = [...allTiers].sort((a, b) => a.level - b.level);
  
  // Find next tier
  const nextTier = sortedTiers.find(tier => 
    tier.isActive && 
    tier.level > (customerTier?.level || 0) &&
    customerPoints.points >= tier.minPoints
  ) || null;

  // Calculate progress to next tier
  const pointsToNextTier = nextTier ? nextTier.minPoints - customerPoints.points : 0;
  const tierProgress = nextTier ? 
    ((customerPoints.points - (customerTier?.minPoints || 0)) / (nextTier.minPoints - (customerTier?.minPoints || 0))) * 100 : 100;

  // Calculate recent activity (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentActivity = recentTransactions
    .filter(t => t.createdAt >= thirtyDaysAgo)
    .reduce((acc, t) => {
      if (t.type === 'EARNED' || t.type === 'BONUS') {
        acc.earned += t.points;
      } else if (t.type === 'REDEEMED') {
        acc.redeemed += Math.abs(t.points);
      } else if (t.type === 'EXPIRED') {
        acc.expired += Math.abs(t.points);
      }
      return acc;
    }, { earned: 0, redeemed: 0, expired: 0 });

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (pointsToNextTier > 0 && pointsToNextTier < 1000) {
    recommendations.push(`You're ${pointsToNextTier} points away from the next tier!`);
  }
  
  if (customerPoints.points > 10000 && recentActivity.redeemed === 0) {
    recommendations.push('Consider redeeming some points for discounts on your next order.');
  }
  
  if (recentActivity.earned < 100) {
    recommendations.push('Shop more to earn bonus points and reach higher tiers.');
  }

  // Get current tier benefits
  const benefits = customerTier?.benefits || [];

  return {
    currentTier: customerTier,
    nextTier,
    pointsToNextTier: Math.max(0, pointsToNextTier),
    tierProgress: Math.min(100, Math.max(0, tierProgress)),
    recentActivity,
    recommendations,
    benefits
  };
}

/**
 * Validate loyalty rules
 */
export function validateLoyaltyRules(
  earningRules: PointsEarningRule[],
  redemptionRules: PointsRedemptionRule[],
  costSharingRules: CostSharingRule[]
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate earning rules
  for (const rule of earningRules) {
    if (rule.earning.baseRate <= 0) {
      errors.push(`Earning rule "${rule.name}" has invalid base rate: ${rule.earning.baseRate}`);
    }
    if (rule.earning.multiplier <= 0) {
      errors.push(`Earning rule "${rule.name}" has invalid multiplier: ${rule.earning.multiplier}`);
    }
    if (rule.conditions.minOrderAmount && rule.conditions.maxOrderAmount && 
        rule.conditions.minOrderAmount >= rule.conditions.maxOrderAmount) {
      errors.push(`Earning rule "${rule.name}" has invalid order amount range`);
    }
  }

  // Validate redemption rules
  for (const rule of redemptionRules) {
    if (rule.redemption.rate <= 0) {
      errors.push(`Redemption rule "${rule.name}" has invalid rate: ${rule.redemption.rate}`);
    }
    if (rule.redemption.maxRedemptionRate && rule.redemption.maxRedemptionRate > 1) {
      errors.push(`Redemption rule "${rule.name}" has invalid max redemption rate: ${rule.redemption.maxRedemptionRate}`);
    }
    if (rule.redemption.minPoints && rule.redemption.maxPoints && 
        rule.redemption.minPoints > rule.redemption.maxPoints) {
      errors.push(`Redemption rule "${rule.name}" has invalid points range`);
    }
  }

  // Validate cost sharing rules
  for (const rule of costSharingRules) {
    const totalShare = rule.sharing.platformShare + rule.sharing.sellerShare + rule.sharing.customerShare;
    if (Math.abs(totalShare - 100) > 0.01) {
      errors.push(`Cost sharing rule "${rule.name}" shares don't add up to 100%: ${totalShare}%`);
    }
    if (rule.sharing.platformShare < 0 || rule.sharing.sellerShare < 0 || rule.sharing.customerShare < 0) {
      errors.push(`Cost sharing rule "${rule.name}" has negative share values`);
    }
  }

  // Check for overlapping rules
  const activeEarningRules = earningRules.filter(r => r.isActive);
  if (activeEarningRules.length > 1) {
    warnings.push('Multiple active earning rules may cause conflicts. Consider prioritizing rules.');
  }

  const activeRedemptionRules = redemptionRules.filter(r => r.isActive);
  if (activeRedemptionRules.length > 1) {
    warnings.push('Multiple active redemption rules may cause conflicts. Consider prioritizing rules.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Calculate loyalty program ROI
 */
export function calculateLoyaltyROI(
  totalPointsEarned: number,
  totalPointsRedeemed: number,
  totalDiscountGiven: number,
  totalRevenue: number,
  programCosts: number
): {
  redemptionRate: number;
  averageDiscount: number;
  revenueImpact: number;
  programROI: number;
  costPerPoint: number;
  valuePerPoint: number;
} {
  const redemptionRate = totalPointsEarned > 0 ? (totalPointsRedeemed / totalPointsEarned) * 100 : 0;
  const averageDiscount = totalPointsRedeemed > 0 ? totalDiscountGiven / totalPointsRedeemed : 0;
  const revenueImpact = totalRevenue > 0 ? (totalDiscountGiven / totalRevenue) * 100 : 0;
  const programROI = programCosts > 0 ? ((totalRevenue - totalDiscountGiven - programCosts) / programCosts) * 100 : 0;
  const costPerPoint = totalPointsEarned > 0 ? programCosts / totalPointsEarned : 0;
  const valuePerPoint = totalPointsRedeemed > 0 ? totalDiscountGiven / totalPointsRedeemed : 0;

  return {
    redemptionRate,
    averageDiscount,
    revenueImpact,
    programROI,
    costPerPoint,
    valuePerPoint
  };
}

