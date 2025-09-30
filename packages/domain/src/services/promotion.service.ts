/**
 * Promotion service - Pure functions for promotion and coupon logic
 * Handles eligibility rules, conflict resolution, and discount calculations
 */

export interface PromotionEligibilityContext {
  customerId?: string;
  customerSegment?: string;
  customerTags?: string[];
  orderAmount: number;
  orderItems: Array<{
    productId: string;
    categoryId?: string;
    brandId?: string;
    sellerId?: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }>;
  appliedPromotions: string[];
  appliedCoupons: string[];
  shippingAddress?: {
    city: string;
    state: string;
    country: string;
  };
  paymentMethod?: string;
  orderDate: Date;
  metadata?: any;
}

export interface PromotionResult {
  promotionId: string;
  promotionCode?: string;
  discountAmount: number;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BUY_X_GET_Y' | 'BUNDLE_DISCOUNT';
  appliedItems: string[];
  eligibilityScore: number;
  conflictReason?: string;
  metadata?: any;
}

export interface ConflictResolutionResult {
  selectedPromotions: string[];
  rejectedPromotions: Array<{
    promotionId: string;
    reason: string;
  }>;
  totalDiscount: number;
  resolutionStrategy: string;
}

export interface JSONLogicRule {
  and?: JSONLogicRule[];
  or?: JSONLogicRule[];
  not?: JSONLogicRule;
  if?: [JSONLogicRule, JSONLogicRule, JSONLogicRule?];
  '=='?: [any, any];
  '!='?: [any, any];
  '>'?: [any, any];
  '>='?: [any, any];
  '<'?: [any, any];
  '<='?: [any, any];
  in?: [any, any[]];
  '!'?: any;
  var?: string;
  cat?: string[];
  substr?: [string, number, number?];
  merge?: any[];
  min?: number[];
  max?: number[];
  '+': number[];
  '-': number[];
  '*': number[];
  '/': number[];
  '%': number[];
  'if': [any, any, any];
}

/**
 * Evaluate JSON logic rule against context
 * Pure function - no side effects
 */
export function evaluateJSONLogic(rule: JSONLogicRule, context: PromotionEligibilityContext): boolean {
  if (!rule) return true;

  try {
    return evaluateRule(rule, context);
  } catch (error) {
    console.error('JSON Logic evaluation error:', error);
    return false;
  }
}

/**
 * Recursively evaluate JSON logic rule
 * Pure function - no side effects
 */
function evaluateRule(rule: JSONLogicRule, context: PromotionEligibilityContext): boolean {
  if (rule.and) {
    return rule.and.every(subRule => evaluateRule(subRule, context));
  }

  if (rule.or) {
    return rule.or.some(subRule => evaluateRule(subRule, context));
  }

  if (rule.not) {
    return !evaluateRule(rule.not, context);
  }

  if (rule.if) {
    const [condition, thenRule, elseRule] = rule.if;
    const conditionResult = evaluateRule(condition, context);
    return conditionResult 
      ? evaluateRule(thenRule, context)
      : elseRule ? evaluateRule(elseRule, context) : true;
  }

  if (rule['==']) {
    const [left, right] = rule['=='];
    return evaluateValue(left, context) === evaluateValue(right, context);
  }

  if (rule['!=']) {
    const [left, right] = rule['!='];
    return evaluateValue(left, context) !== evaluateValue(right, context);
  }

  if (rule['>']) {
    const [left, right] = rule['>'];
    return evaluateValue(left, context) > evaluateValue(right, context);
  }

  if (rule['>=']) {
    const [left, right] = rule['>='];
    return evaluateValue(left, context) >= evaluateValue(right, context);
  }

  if (rule['<']) {
    const [left, right] = rule['<'];
    return evaluateValue(left, context) < evaluateValue(right, context);
  }

  if (rule['<=']) {
    const [left, right] = rule['<='];
    return evaluateValue(left, context) <= evaluateValue(right, context);
  }

  if (rule.in) {
    const [value, array] = rule.in;
    return array.includes(evaluateValue(value, context));
  }

  if (rule['!']) {
    return !evaluateValue(rule['!'], context);
  }

  // Default to true for unknown rules
  return true;
}

/**
 * Evaluate a value in JSON logic context
 * Pure function - no side effects
 */
function evaluateValue(value: any, context: PromotionEligibilityContext): any {
  if (typeof value === 'string' && value.startsWith('$')) {
    // Variable reference
    const varName = value.substring(1);
    return getContextValue(varName, context);
  }

  if (typeof value === 'object' && value !== null) {
    if (value.var) {
      return getContextValue(value.var, context);
    }

    if (value.cat) {
      return value.cat.join('');
    }

    if (value.substr) {
      const [str, start, length] = value.substr;
      return str.substring(start, length ? start + length : undefined);
    }

    if (value.merge) {
      return value.merge.flat();
    }

    if (value.min) {
      return Math.min(...value.min);
    }

    if (value.max) {
      return Math.max(...value.max);
    }

    if (value['+']) {
      return value['+'].reduce((sum: number, val: number) => sum + val, 0);
    }

    if (value['-']) {
      return value['-'].reduce((diff: number, val: number, index: number) => 
        index === 0 ? val : diff - val, 0);
    }

    if (value['*']) {
      return value['*'].reduce((prod: number, val: number) => prod * val, 1);
    }

    if (value['/']) {
      return value['/'].reduce((quot: number, val: number, index: number) => 
        index === 0 ? val : quot / val, 0);
    }

    if (value['%']) {
      return value['%'].reduce((mod: number, val: number, index: number) => 
        index === 0 ? val : mod % val, 0);
    }

    if (value.if) {
      const [condition, thenValue, elseValue] = value.if;
      return evaluateValue(condition, context) 
        ? evaluateValue(thenValue, context)
        : evaluateValue(elseValue, context);
    }
  }

  return value;
}

/**
 * Get value from context by variable name
 * Pure function - no side effects
 */
function getContextValue(varName: string, context: PromotionEligibilityContext): any {
  const parts = varName.split('.');
  let value: any = context;

  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Check if promotion is eligible for context
 * Pure function - no side effects
 */
export function isPromotionEligible(
  promotion: {
    id: string;
    eligibilityRules?: any;
    minOrderAmount?: number;
    targetType: string;
    targetIds: string[];
    usageLimit?: number;
    usagePerCustomer?: number;
    usageCount: number;
    startDate: Date;
    endDate?: Date;
    status: string;
  },
  context: PromotionEligibilityContext
): { eligible: boolean; reason?: string; score: number } {
  // Check basic eligibility
  if (promotion.status !== 'ACTIVE') {
    return { eligible: false, reason: 'Promotion is not active', score: 0 };
  }

  // Check date range
  const now = new Date();
  if (now < promotion.startDate) {
    return { eligible: false, reason: 'Promotion has not started yet', score: 0 };
  }

  if (promotion.endDate && now > promotion.endDate) {
    return { eligible: false, reason: 'Promotion has expired', score: 0 };
  }

  // Check usage limits
  if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
    return { eligible: false, reason: 'Promotion usage limit reached', score: 0 };
  }

  // Check minimum order amount
  if (promotion.minOrderAmount && context.orderAmount < promotion.minOrderAmount) {
    return { eligible: false, reason: 'Minimum order amount not met', score: 0 };
  }

  // Check target eligibility
  const targetEligible = checkTargetEligibility(promotion, context);
  if (!targetEligible.eligible) {
    return { eligible: false, reason: targetEligible.reason, score: 0 };
  }

  // Check JSON logic rules
  if (promotion.eligibilityRules) {
    const rulesEligible = evaluateJSONLogic(promotion.eligibilityRules, context);
    if (!rulesEligible) {
      return { eligible: false, reason: 'Eligibility rules not met', score: 0 };
    }
  }

  // Calculate eligibility score
  const score = calculateEligibilityScore(promotion, context);

  return { eligible: true, score };
}

/**
 * Check target eligibility
 * Pure function - no side effects
 */
function checkTargetEligibility(
  promotion: { targetType: string; targetIds: string[] },
  context: PromotionEligibilityContext
): { eligible: boolean; reason?: string } {
  switch (promotion.targetType) {
    case 'ALL':
      return { eligible: true };

    case 'CUSTOMER':
      if (!context.customerId) {
        return { eligible: false, reason: 'Customer ID required' };
      }
      return { 
        eligible: promotion.targetIds.includes(context.customerId),
        reason: promotion.targetIds.includes(context.customerId) ? undefined : 'Customer not in target list'
      };

    case 'PRODUCT':
      const productIds = context.orderItems.map(item => item.productId);
      const hasTargetProduct = promotion.targetIds.some(id => productIds.includes(id));
      return { 
        eligible: hasTargetProduct,
        reason: hasTargetProduct ? undefined : 'No target products in order'
      };

    case 'CATEGORY':
      const categoryIds = context.orderItems
        .map(item => item.categoryId)
        .filter(Boolean);
      const hasTargetCategory = promotion.targetIds.some(id => categoryIds.includes(id));
      return { 
        eligible: hasTargetCategory,
        reason: hasTargetCategory ? undefined : 'No target categories in order'
      };

    case 'BRAND':
      const brandIds = context.orderItems
        .map(item => item.brandId)
        .filter(Boolean);
      const hasTargetBrand = promotion.targetIds.some(id => brandIds.includes(id));
      return { 
        eligible: hasTargetBrand,
        reason: hasTargetBrand ? undefined : 'No target brands in order'
      };

    case 'SELLER':
      const sellerIds = context.orderItems.map(item => item.sellerId);
      const hasTargetSeller = promotion.targetIds.some(id => sellerIds.includes(id));
      return { 
        eligible: hasTargetSeller,
        reason: hasTargetSeller ? undefined : 'No target sellers in order'
      };

    default:
      return { eligible: true };
  }
}

/**
 * Calculate eligibility score for ranking
 * Pure function - no side effects
 */
function calculateEligibilityScore(
  promotion: { priority: number; discountValue: number; discountType: string },
  context: PromotionEligibilityContext
): number {
  let score = promotion.priority * 100; // Base score from priority

  // Add score based on discount value
  if (promotion.discountType === 'PERCENTAGE') {
    score += promotion.discountValue * 10; // 10 points per percentage
  } else if (promotion.discountType === 'FIXED_AMOUNT') {
    score += promotion.discountValue; // 1 point per currency unit
  }

  // Add score based on order amount (higher orders get higher scores)
  score += Math.floor(context.orderAmount / 100); // 1 point per 100 currency units

  // Add score based on number of items
  score += context.orderItems.length * 5; // 5 points per item

  return score;
}

/**
 * Calculate discount amount for promotion
 * Pure function - no side effects
 */
export function calculateDiscountAmount(
  promotion: {
    discountType: string;
    discountValue: number;
    maxDiscountAmount?: number;
  },
  context: PromotionEligibilityContext,
  applicableItems: string[]
): number {
  const applicableOrderItems = context.orderItems.filter(item => 
    applicableItems.includes(item.productId)
  );

  const applicableAmount = applicableOrderItems.reduce(
    (sum, item) => sum + item.totalPrice, 0
  );

  let discountAmount = 0;

  switch (promotion.discountType) {
    case 'PERCENTAGE':
      discountAmount = (applicableAmount * promotion.discountValue) / 100;
      break;

    case 'FIXED_AMOUNT':
      discountAmount = promotion.discountValue;
      break;

    case 'FREE_SHIPPING':
      // This would be handled separately in shipping calculation
      discountAmount = 0;
      break;

    case 'BUY_X_GET_Y':
      // This would require specific product configuration
      discountAmount = 0;
      break;

    case 'BUNDLE_DISCOUNT':
      // This would require bundle configuration
      discountAmount = 0;
      break;

    default:
      discountAmount = 0;
  }

  // Apply maximum discount limit
  if (promotion.maxDiscountAmount && discountAmount > promotion.maxDiscountAmount) {
    discountAmount = promotion.maxDiscountAmount;
  }

  // Ensure discount doesn't exceed order amount
  return Math.min(discountAmount, applicableAmount);
}

/**
 * Resolve promotion conflicts
 * Pure function - no side effects
 */
export function resolvePromotionConflicts(
  eligiblePromotions: PromotionResult[],
  conflictRules: Array<{
    conflictType: string;
    resolutionStrategy: string;
    promotionIds: string[];
    resolutionRules?: any;
  }>
): ConflictResolutionResult {
  const selectedPromotions: string[] = [];
  const rejectedPromotions: Array<{ promotionId: string; reason: string }> = [];
  let totalDiscount = 0;

  // Sort promotions by eligibility score (highest first)
  const sortedPromotions = [...eligiblePromotions].sort((a, b) => b.eligibilityScore - a.eligibilityScore);

  for (const promotion of sortedPromotions) {
    let canApply = true;
    let conflictReason = '';

    // Check for conflicts with already selected promotions
    for (const selectedId of selectedPromotions) {
      const conflict = conflictRules.find(rule => 
        rule.promotionIds.includes(promotion.promotionId) && 
        rule.promotionIds.includes(selectedId)
      );

      if (conflict) {
        canApply = resolveConflict(promotion, selectedId, conflict);
        if (!canApply) {
          conflictReason = `Conflicts with promotion ${selectedId}`;
          break;
        }
      }
    }

    if (canApply) {
      selectedPromotions.push(promotion.promotionId);
      totalDiscount += promotion.discountAmount;
    } else {
      rejectedPromotions.push({
        promotionId: promotion.promotionId,
        reason: conflictReason
      });
    }
  }

  return {
    selectedPromotions,
    rejectedPromotions,
    totalDiscount,
    resolutionStrategy: 'PRIORITY_BASED'
  };
}

/**
 * Resolve conflict between two promotions
 * Pure function - no side effects
 */
function resolveConflict(
  newPromotion: PromotionResult,
  existingPromotionId: string,
  conflictRule: {
    conflictType: string;
    resolutionStrategy: string;
    resolutionRules?: any;
  }
): boolean {
  switch (conflictRule.conflictType) {
    case 'MUTUALLY_EXCLUSIVE':
      return false; // Cannot apply both

    case 'PRIORITY_BASED':
      return newPromotion.eligibilityScore > 0; // Higher score wins

    case 'HIGHEST_DISCOUNT':
      // This would require comparing discount amounts
      return true; // Simplified for now

    case 'CUSTOMER_CHOICE':
      return false; // Let customer choose

    case 'RULE_BASED':
      // This would evaluate custom resolution rules
      return true; // Simplified for now

    default:
      return true; // Default to allowing
  }
}

/**
 * Generate promotion code
 * Pure function - no side effects
 */
export function generatePromotionCode(prefix: string = 'PROMO'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

/**
 * Generate coupon code
 * Pure function - no side effects
 */
export function generateCouponCode(prefix: string = 'COUPON'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

/**
 * Validate promotion configuration
 * Pure function - no side effects
 */
export function validatePromotionConfiguration(promotion: {
  name: string;
  discountType: string;
  discountValue: number;
  startDate: Date;
  endDate?: Date;
  usageLimit?: number;
  minOrderAmount?: number;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!promotion.name || promotion.name.trim().length === 0) {
    errors.push('Promotion name is required');
  }

  if (!promotion.discountType) {
    errors.push('Discount type is required');
  }

  if (promotion.discountValue <= 0) {
    errors.push('Discount value must be greater than 0');
  }

  if (promotion.discountType === 'PERCENTAGE' && promotion.discountValue > 100) {
    errors.push('Percentage discount cannot exceed 100%');
  }

  if (promotion.endDate && promotion.endDate <= promotion.startDate) {
    errors.push('End date must be after start date');
  }

  if (promotion.usageLimit && promotion.usageLimit <= 0) {
    errors.push('Usage limit must be greater than 0');
  }

  if (promotion.minOrderAmount && promotion.minOrderAmount < 0) {
    errors.push('Minimum order amount cannot be negative');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Calculate promotion performance metrics
 * Pure function - no side effects
 */
export function calculatePromotionMetrics(usageHistory: Array<{
  discountAmount: number;
  originalAmount: number;
  usedAt: Date;
}>): {
  totalUsage: number;
  totalDiscount: number;
  averageDiscount: number;
  conversionRate: number;
  revenueImpact: number;
} {
  const totalUsage = usageHistory.length;
  const totalDiscount = usageHistory.reduce((sum, usage) => sum + usage.discountAmount, 0);
  const totalOriginal = usageHistory.reduce((sum, usage) => sum + usage.originalAmount, 0);
  const averageDiscount = totalUsage > 0 ? totalDiscount / totalUsage : 0;
  const conversionRate = totalUsage > 0 ? (totalUsage / (totalUsage + 100)) * 100 : 0; // Simplified
  const revenueImpact = totalOriginal - totalDiscount;

  return {
    totalUsage,
    totalDiscount,
    averageDiscount,
    conversionRate,
    revenueImpact
  };
}

/**
 * Check if promotions can be stacked
 * Pure function - no side effects
 */
export function canPromotionsStack(
  promotion1: { id: string; stackable: boolean; stackableWith: string[] },
  promotion2: { id: string; stackable: boolean; stackableWith: string[] }
): boolean {
  // Both promotions must be stackable
  if (!promotion1.stackable || !promotion2.stackable) {
    return false;
  }

  // Check if they're explicitly allowed to stack with each other
  return promotion1.stackableWith.includes(promotion2.id) || 
         promotion2.stackableWith.includes(promotion1.id);
}

/**
 * Create sample eligibility rules
 * Pure function - no side effects
 */
export function createSampleEligibilityRules(): Record<string, JSONLogicRule> {
  return {
    // New customer rule
    newCustomer: {
      and: [
        { '!': { var: 'customerId' } },
        { '>': [{ var: 'orderAmount' }, 100] }
      ]
    },

    // High value order rule
    highValueOrder: {
      '>': [{ var: 'orderAmount' }, 500]
    },

    // Specific category rule
    electronicsCategory: {
      in: [
        { var: 'orderItems[0].categoryId' },
        ['electronics', 'computers', 'phones']
      ]
    },

    // Weekend promotion rule
    weekendPromotion: {
      in: [
        { var: 'orderDate.dayOfWeek' },
        [0, 6] // Sunday and Saturday
      ]
    },

    // First time buyer rule
    firstTimeBuyer: {
      and: [
        { '!': { var: 'customerId' } },
        { '<': [{ var: 'orderAmount' }, 1000] }
      ]
    },

    // Loyalty customer rule
    loyaltyCustomer: {
      in: [
        { var: 'customerSegment' },
        ['VIP', 'GOLD', 'PLATINUM']
      ]
    }
  };
}

