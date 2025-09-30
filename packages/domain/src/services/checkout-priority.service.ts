/**
 * Checkout Priority Service - Handles multiple promotion conflicts
 * Implements priority-based conflict resolution for checkout process
 */

import { 
  PromotionEligibilityContext, 
  PromotionResult, 
  ConflictResolutionResult,
  resolvePromotionConflicts,
  canPromotionsStack
} from './promotion.service.js';

export interface CheckoutContext extends PromotionEligibilityContext {
  orderId: string;
  tenantId: string;
  appliedPromotions: string[];
  appliedCoupons: string[];
  customerSegment?: string;
  customerLoyaltyLevel?: string;
  isFirstTimeBuyer?: boolean;
  orderHistory?: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
  };
}

export interface PromotionApplicationResult {
  success: boolean;
  appliedPromotions: Array<{
    promotionId: string;
    promotionCode?: string;
    discountAmount: number;
    discountType: string;
    appliedItems: string[];
    eligibilityScore: number;
  }>;
  rejectedPromotions: Array<{
    promotionId: string;
    reason: string;
  }>;
  totalDiscount: number;
  finalAmount: number;
  conflictResolution: ConflictResolutionResult;
  metadata?: any;
}

export interface PriorityRule {
  id: string;
  name: string;
  priority: number;
  conditions: {
    customerSegment?: string[];
    orderAmount?: { min?: number; max?: number };
    productCategories?: string[];
    timeOfDay?: { start: number; end: number };
    dayOfWeek?: number[];
    isFirstTimeBuyer?: boolean;
    loyaltyLevel?: string[];
  };
  actions: {
    boostPriority?: number;
    excludePromotions?: string[];
    requirePromotions?: string[];
    maxDiscountPercentage?: number;
  };
}

/**
 * Apply promotions with priority-based conflict resolution
 * Pure function - no side effects
 */
export function applyPromotionsWithPriority(
  context: CheckoutContext,
  availablePromotions: PromotionResult[],
  priorityRules: PriorityRule[] = []
): PromotionApplicationResult {
  // Step 1: Filter eligible promotions
  const eligiblePromotions = availablePromotions.filter(promotion => 
    isPromotionEligibleForContext(promotion, context)
  );

  // Step 2: Apply priority rules
  const prioritizedPromotions = applyPriorityRules(eligiblePromotions, context, priorityRules);

  // Step 3: Sort by priority and eligibility score
  const sortedPromotions = prioritizedPromotions.sort((a, b) => {
    // First by priority (higher number = higher priority)
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    // Then by eligibility score
    return b.eligibilityScore - a.eligibilityScore;
  });

  // Step 4: Apply stacking rules
  const stackablePromotions = applyStackingRules(sortedPromotions, context);

  // Step 5: Resolve conflicts
  const conflictResolution = resolvePromotionConflicts(stackablePromotions, []);

  // Step 6: Calculate final amounts
  const totalDiscount = conflictResolution.selectedPromotions.reduce((sum, promotionId) => {
    const promotion = stackablePromotions.find(p => p.promotionId === promotionId);
    return sum + (promotion?.discountAmount || 0);
  }, 0);

  const finalAmount = Math.max(0, context.orderAmount - totalDiscount);

  // Step 7: Prepare result
  const appliedPromotions = conflictResolution.selectedPromotions.map(promotionId => {
    const promotion = stackablePromotions.find(p => p.promotionId === promotionId);
    return {
      promotionId: promotion!.promotionId,
      promotionCode: promotion!.promotionCode,
      discountAmount: promotion!.discountAmount,
      discountType: promotion!.discountType,
      appliedItems: promotion!.appliedItems,
      eligibilityScore: promotion!.eligibilityScore
    };
  });

  const rejectedPromotions = conflictResolution.rejectedPromotions;

  return {
    success: true,
    appliedPromotions,
    rejectedPromotions,
    totalDiscount,
    finalAmount,
    conflictResolution,
    metadata: {
      totalEligible: eligiblePromotions.length,
      totalPrioritized: prioritizedPromotions.length,
      totalStackable: stackablePromotions.length,
      totalApplied: appliedPromotions.length,
      totalRejected: rejectedPromotions.length
    }
  };
}

/**
 * Check if promotion is eligible for checkout context
 * Pure function - no side effects
 */
function isPromotionEligibleForContext(
  promotion: PromotionResult,
  context: CheckoutContext
): boolean {
  // Basic eligibility checks
  if (context.appliedPromotions.includes(promotion.promotionId)) {
    return false; // Already applied
  }

  if (promotion.conflictReason) {
    return false; // Has conflicts
  }

  // Check if promotion is still valid
  if (promotion.eligibilityScore <= 0) {
    return false;
  }

  return true;
}

/**
 * Apply priority rules to promotions
 * Pure function - no side effects
 */
function applyPriorityRules(
  promotions: PromotionResult[],
  context: CheckoutContext,
  priorityRules: PriorityRule[]
): Array<PromotionResult & { priority: number }> {
  return promotions.map(promotion => {
    let priority = 1; // Default priority

    // Apply priority rules
    for (const rule of priorityRules) {
      if (matchesPriorityRule(rule, context)) {
        // Apply rule actions
        if (rule.actions.boostPriority) {
          priority += rule.actions.boostPriority;
        }

        // Check if promotion should be excluded
        if (rule.actions.excludePromotions?.includes(promotion.promotionId)) {
          priority = -1; // Exclude this promotion
        }

        // Check if promotion is required
        if (rule.actions.requirePromotions?.includes(promotion.promotionId)) {
          priority += 100; // Boost required promotions
        }
      }
    }

    return {
      ...promotion,
      priority
    };
  }).filter(promotion => promotion.priority > 0); // Remove excluded promotions
}

/**
 * Check if context matches priority rule conditions
 * Pure function - no side effects
 */
function matchesPriorityRule(rule: PriorityRule, context: CheckoutContext): boolean {
  const { conditions } = rule;

  // Check customer segment
  if (conditions.customerSegment && context.customerSegment) {
    if (!conditions.customerSegment.includes(context.customerSegment)) {
      return false;
    }
  }

  // Check order amount
  if (conditions.orderAmount) {
    const { min, max } = conditions.orderAmount;
    if (min && context.orderAmount < min) return false;
    if (max && context.orderAmount > max) return false;
  }

  // Check product categories
  if (conditions.productCategories) {
    const orderCategories = context.orderItems
      .map(item => item.categoryId)
      .filter(Boolean);
    const hasMatchingCategory = conditions.productCategories.some(category => 
      orderCategories.includes(category)
    );
    if (!hasMatchingCategory) return false;
  }

  // Check time of day
  if (conditions.timeOfDay) {
    const currentHour = new Date().getHours();
    const { start, end } = conditions.timeOfDay;
    if (currentHour < start || currentHour > end) return false;
  }

  // Check day of week
  if (conditions.dayOfWeek) {
    const currentDay = new Date().getDay();
    if (!conditions.dayOfWeek.includes(currentDay)) return false;
  }

  // Check first time buyer
  if (conditions.isFirstTimeBuyer !== undefined) {
    if (context.isFirstTimeBuyer !== conditions.isFirstTimeBuyer) return false;
  }

  // Check loyalty level
  if (conditions.loyaltyLevel && context.customerLoyaltyLevel) {
    if (!conditions.loyaltyLevel.includes(context.customerLoyaltyLevel)) return false;
  }

  return true;
}

/**
 * Apply stacking rules to promotions
 * Pure function - no side effects
 */
function applyStackingRules(
  promotions: Array<PromotionResult & { priority: number }>,
  context: CheckoutContext
): Array<PromotionResult & { priority: number }> {
  const stackablePromotions: Array<PromotionResult & { priority: number }> = [];
  const nonStackablePromotions: Array<PromotionResult & { priority: number }> = [];

  // Separate stackable and non-stackable promotions
  for (const promotion of promotions) {
    if (isStackablePromotion(promotion, context)) {
      stackablePromotions.push(promotion);
    } else {
      nonStackablePromotions.push(promotion);
    }
  }

  // For non-stackable promotions, only keep the highest priority one
  const highestPriorityNonStackable = nonStackablePromotions
    .sort((a, b) => b.priority - a.priority)[0];

  // Combine stackable and highest priority non-stackable
  const result = [...stackablePromotions];
  if (highestPriorityNonStackable) {
    result.push(highestPriorityNonStackable);
  }

  return result;
}

/**
 * Check if promotion is stackable
 * Pure function - no side effects
 */
function isStackablePromotion(
  promotion: PromotionResult & { priority: number },
  context: CheckoutContext
): boolean {
  // Check if promotion is marked as stackable
  if (promotion.metadata?.stackable === false) {
    return false;
  }

  // Check if promotion conflicts with already applied promotions
  if (context.appliedPromotions.length > 0) {
    const hasConflict = context.appliedPromotions.some(appliedId => 
      !canPromotionsStack(
        { id: promotion.promotionId, stackable: true, stackableWith: [] },
        { id: appliedId, stackable: true, stackableWith: [] }
      )
    );
    if (hasConflict) return false;
  }

  return true;
}

/**
 * Create default priority rules
 * Pure function - no side effects
 */
export function createDefaultPriorityRules(): PriorityRule[] {
  return [
    {
      id: 'vip-customer-boost',
      name: 'VIP Customer Priority Boost',
      priority: 100,
      conditions: {
        customerSegment: ['VIP', 'PLATINUM']
      },
      actions: {
        boostPriority: 50
      }
    },
    {
      id: 'first-time-buyer-boost',
      name: 'First Time Buyer Boost',
      priority: 90,
      conditions: {
        isFirstTimeBuyer: true
      },
      actions: {
        boostPriority: 30
      }
    },
    {
      id: 'high-value-order-boost',
      name: 'High Value Order Boost',
      priority: 80,
      conditions: {
        orderAmount: { min: 1000 }
      },
      actions: {
        boostPriority: 20
      }
    },
    {
      id: 'weekend-promotion-boost',
      name: 'Weekend Promotion Boost',
      priority: 70,
      conditions: {
        dayOfWeek: [0, 6] // Sunday and Saturday
      },
      actions: {
        boostPriority: 10
      }
    },
    {
      id: 'electronics-category-boost',
      name: 'Electronics Category Boost',
      priority: 60,
      conditions: {
        productCategories: ['electronics', 'computers', 'phones']
      },
      actions: {
        boostPriority: 15
      }
    },
    {
      id: 'loyalty-customer-boost',
      name: 'Loyalty Customer Boost',
      priority: 50,
      conditions: {
        loyaltyLevel: ['GOLD', 'SILVER']
      },
      actions: {
        boostPriority: 25
      }
    }
  ];
}

/**
 * Validate checkout context
 * Pure function - no side effects
 */
export function validateCheckoutContext(context: CheckoutContext): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!context.orderId) {
    errors.push('Order ID is required');
  }

  if (!context.tenantId) {
    errors.push('Tenant ID is required');
  }

  if (context.orderAmount <= 0) {
    errors.push('Order amount must be greater than 0');
  }

  if (!context.orderItems || context.orderItems.length === 0) {
    errors.push('Order must have at least one item');
  }

  // Validate order items
  if (context.orderItems) {
    for (const item of context.orderItems) {
      if (!item.productId) {
        errors.push('All order items must have a product ID');
      }
      if (item.quantity <= 0) {
        errors.push('All order items must have quantity greater than 0');
      }
      if (item.price <= 0) {
        errors.push('All order items must have price greater than 0');
      }
    }
  }

  // Warnings
  if (context.orderAmount < 50) {
    warnings.push('Order amount is very low, limited promotions may be available');
  }

  if (context.appliedPromotions.length > 5) {
    warnings.push('Many promotions already applied, conflicts may occur');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Calculate promotion effectiveness score
 * Pure function - no side effects
 */
export function calculatePromotionEffectiveness(
  promotion: PromotionResult,
  context: CheckoutContext
): number {
  let score = 0;

  // Base score from eligibility
  score += promotion.eligibilityScore;

  // Boost for high-value orders
  if (context.orderAmount > 500) {
    score += 20;
  }

  // Boost for first-time buyers
  if (context.isFirstTimeBuyer) {
    score += 30;
  }

  // Boost for VIP customers
  if (context.customerSegment === 'VIP') {
    score += 50;
  }

  // Boost for weekend orders
  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    score += 10;
  }

  // Boost for electronics
  const hasElectronics = context.orderItems.some(item => 
    item.categoryId === 'electronics'
  );
  if (hasElectronics) {
    score += 15;
  }

  // Penalty for low discount amount
  if (promotion.discountAmount < 10) {
    score -= 10;
  }

  return Math.max(0, score);
}

/**
 * Generate promotion recommendations
 * Pure function - no side effects
 */
export function generatePromotionRecommendations(
  context: CheckoutContext,
  availablePromotions: PromotionResult[]
): Array<{
  promotionId: string;
  reason: string;
  effectivenessScore: number;
  expectedDiscount: number;
}> {
  const recommendations: Array<{
    promotionId: string;
    reason: string;
    effectivenessScore: number;
    expectedDiscount: number;
  }> = [];

  for (const promotion of availablePromotions) {
    if (isPromotionEligibleForContext(promotion, context)) {
      const effectivenessScore = calculatePromotionEffectiveness(promotion, context);
      const reason = generateRecommendationReason(promotion, context);
      
      recommendations.push({
        promotionId: promotion.promotionId,
        reason,
        effectivenessScore,
        expectedDiscount: promotion.discountAmount
      });
    }
  }

  // Sort by effectiveness score
  return recommendations.sort((a, b) => b.effectivenessScore - a.effectivenessScore);
}

/**
 * Generate recommendation reason
 * Pure function - no side effects
 */
function generateRecommendationReason(
  promotion: PromotionResult,
  context: CheckoutContext
): string {
  const reasons: string[] = [];

  if (context.isFirstTimeBuyer) {
    reasons.push('First-time buyer discount');
  }

  if (context.customerSegment === 'VIP') {
    reasons.push('VIP customer exclusive');
  }

  if (context.orderAmount > 500) {
    reasons.push('High-value order bonus');
  }

  if (promotion.discountAmount > 50) {
    reasons.push('High discount amount');
  }

  if (context.orderItems.some(item => item.categoryId === 'electronics')) {
    reasons.push('Electronics category promotion');
  }

  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    reasons.push('Weekend special');
  }

  return reasons.length > 0 ? reasons.join(', ') : 'General promotion available';
}

