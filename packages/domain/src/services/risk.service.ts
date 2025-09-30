/**
 * Risk service - Pure functions for risk assessment and scoring
 * Handles risk signal collection, rule evaluation, and scoring logic
 */

export interface RiskSignal {
  signalType: string;
  signalName: string;
  value: any;
  weight: number;
  source: string;
  timestamp: Date;
  metadata?: any;
}

export interface RiskContext {
  entityId: string;
  entityType: 'CUSTOMER' | 'SELLER' | 'ORDER' | 'PAYMENT';
  tenantId: string;
  signals: RiskSignal[];
  contextData: any;
  metadata?: any;
}

export interface RiskRule {
  id: string;
  name: string;
  ruleType: 'SCORING' | 'THRESHOLD' | 'BLACKLIST' | 'WHITELIST' | 'NOTIFICATION' | 'AUTO_ACTION';
  category: 'CUSTOMER' | 'SELLER' | 'ORDER' | 'PAYMENT' | 'FRAUD' | 'COMPLIANCE' | 'GEOGRAPHIC' | 'BEHAVIORAL' | 'FINANCIAL' | 'TECHNICAL';
  priority: number;
  conditions: any;
  threshold?: number;
  weight: number;
  action: 'SCORE' | 'BLOCK' | 'HOLD' | 'NOTIFY' | 'REVIEW' | 'APPROVE' | 'ESCALATE';
  actionParams?: any;
  isActive: boolean;
  isEnabled: boolean;
}

export interface RiskRuleEvaluation {
  ruleId: string;
  ruleName: string;
  matched: boolean;
  score: number;
  reason: string;
  action: string;
  actionParams?: any;
  metadata?: any;
}

export interface RiskScore {
  totalScore: number;
  maxPossibleScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ruleScores: Record<string, number>;
  confidence: number;
  shouldBlock: boolean;
  shouldHold: boolean;
  shouldReview: boolean;
  recommendations: string[];
}

export interface RiskThresholds {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

/**
 * Collect risk signals from order data
 * Pure function - no side effects
 */
export function collectOrderRiskSignals(orderData: {
  orderId: string;
  customerId: string;
  sellerId: string;
  totalAmount: number;
  itemCount: number;
  paymentMethod: string;
  shippingAddress: any;
  billingAddress: any;
  customerHistory?: any;
  sellerHistory?: any;
  deviceInfo?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}): RiskSignal[] {
  const signals: RiskSignal[] = [];
  const now = new Date();

  // Order value signals
  if (orderData.totalAmount > 10000) {
    signals.push({
      signalType: 'HIGH_VALUE_ORDER',
      signalName: 'High Value Order',
      value: orderData.totalAmount,
      weight: 0.8,
      source: 'ORDER',
      timestamp: now,
      metadata: { threshold: 10000 }
    });
  }

  if (orderData.totalAmount > 50000) {
    signals.push({
      signalType: 'VERY_HIGH_VALUE_ORDER',
      signalName: 'Very High Value Order',
      value: orderData.totalAmount,
      weight: 1.0,
      source: 'ORDER',
      timestamp: now,
      metadata: { threshold: 50000 }
    });
  }

  // Item count signals
  if (orderData.itemCount > 10) {
    signals.push({
      signalType: 'HIGH_ITEM_COUNT',
      signalName: 'High Item Count',
      value: orderData.itemCount,
      weight: 0.3,
      source: 'ORDER',
      timestamp: now
    });
  }

  // Payment method signals
  if (orderData.paymentMethod === 'CASH_ON_DELIVERY') {
    signals.push({
      signalType: 'CASH_ON_DELIVERY',
      signalName: 'Cash on Delivery',
      value: orderData.paymentMethod,
      weight: 0.4,
      source: 'PAYMENT',
      timestamp: now
    });
  }

  if (orderData.paymentMethod === 'BANK_TRANSFER') {
    signals.push({
      signalType: 'BANK_TRANSFER',
      signalName: 'Bank Transfer',
      value: orderData.paymentMethod,
      weight: 0.2,
      source: 'PAYMENT',
      timestamp: now
    });
  }

  // Address signals
  if (orderData.shippingAddress && orderData.billingAddress) {
    const addressMatch = compareAddresses(orderData.shippingAddress, orderData.billingAddress);
    if (!addressMatch) {
      signals.push({
        signalType: 'ADDRESS_MISMATCH',
        signalName: 'Shipping/Billing Address Mismatch',
        value: { shipping: orderData.shippingAddress, billing: orderData.billingAddress },
        weight: 0.6,
        source: 'ORDER',
        timestamp: now
      });
    }
  }

  // Customer history signals
  if (orderData.customerHistory) {
    const { orderCount, totalSpent, lastOrderDate, chargebackCount, refundCount } = orderData.customerHistory;

    // New customer
    if (orderCount === 0) {
      signals.push({
        signalType: 'NEW_CUSTOMER',
        signalName: 'New Customer',
        value: { orderCount },
        weight: 0.3,
        source: 'CUSTOMER',
        timestamp: now
      });
    }

    // High spending customer
    if (totalSpent > 100000) {
      signals.push({
        signalType: 'HIGH_VALUE_CUSTOMER',
        signalName: 'High Value Customer',
        value: { totalSpent },
        weight: -0.2, // Negative weight for good signal
        source: 'CUSTOMER',
        timestamp: now
      });
    }

    // Customer with chargebacks
    if (chargebackCount > 0) {
      signals.push({
        signalType: 'CHARGEBACK_HISTORY',
        signalName: 'Chargeback History',
        value: { chargebackCount },
        weight: 0.9,
        source: 'CUSTOMER',
        timestamp: now
      });
    }

    // Customer with high refund rate
    if (orderCount > 0 && refundCount / orderCount > 0.3) {
      signals.push({
        signalType: 'HIGH_REFUND_RATE',
        signalName: 'High Refund Rate',
        value: { refundRate: refundCount / orderCount },
        weight: 0.7,
        source: 'CUSTOMER',
        timestamp: now
      });
    }

    // Rapid orders
    if (lastOrderDate && (now.getTime() - lastOrderDate.getTime()) < 24 * 60 * 60 * 1000) {
      signals.push({
        signalType: 'RAPID_ORDERS',
        signalName: 'Rapid Order Placement',
        value: { timeSinceLastOrder: now.getTime() - lastOrderDate.getTime() },
        weight: 0.5,
        source: 'CUSTOMER',
        timestamp: now
      });
    }
  }

  // Seller history signals
  if (orderData.sellerHistory) {
    const { sellerRating, totalSales, complaintCount, isNewSeller } = orderData.sellerHistory;

    // New seller
    if (isNewSeller) {
      signals.push({
        signalType: 'NEW_SELLER',
        signalName: 'New Seller',
        value: { isNewSeller },
        weight: 0.4,
        source: 'SELLER',
        timestamp: now
      });
    }

    // Low rated seller
    if (sellerRating < 3.0) {
      signals.push({
        signalType: 'LOW_RATED_SELLER',
        signalName: 'Low Rated Seller',
        value: { sellerRating },
        weight: 0.6,
        source: 'SELLER',
        timestamp: now
      });
    }

    // Seller with complaints
    if (complaintCount > 5) {
      signals.push({
        signalType: 'HIGH_COMPLAINT_SELLER',
        signalName: 'High Complaint Seller',
        value: { complaintCount },
        weight: 0.8,
        source: 'SELLER',
        timestamp: now
      });
    }
  }

  // Device and location signals
  if (orderData.deviceInfo) {
    const { deviceType, isMobile, isTablet } = orderData.deviceInfo;

    if (isMobile) {
      signals.push({
        signalType: 'MOBILE_DEVICE',
        signalName: 'Mobile Device',
        value: { deviceType, isMobile },
        weight: 0.1,
        source: 'TECHNICAL',
        timestamp: now
      });
    }
  }

  if (orderData.ipAddress) {
    // Check for suspicious IP patterns (simplified)
    const isSuspiciousIP = checkSuspiciousIP(orderData.ipAddress);
    if (isSuspiciousIP) {
      signals.push({
        signalType: 'SUSPICIOUS_IP',
        signalName: 'Suspicious IP Address',
        value: { ipAddress: orderData.ipAddress },
        weight: 0.7,
        source: 'TECHNICAL',
        timestamp: now
      });
    }
  }

  return signals;
}

/**
 * Evaluate risk rules against context
 * Pure function - no side effects
 */
export function evaluateRiskRules(context: RiskContext, rules: RiskRule[]): RiskRuleEvaluation[] {
  const evaluations: RiskRuleEvaluation[] = [];

  for (const rule of rules) {
    if (!rule.isActive || !rule.isEnabled) {
      continue;
    }

    const evaluation = evaluateRule(rule, context);
    evaluations.push(evaluation);
  }

  // Sort by priority (lower number = higher priority)
  return evaluations.sort((a, b) => {
    const ruleA = rules.find(r => r.id === a.ruleId);
    const ruleB = rules.find(r => r.id === b.ruleId);
    return (ruleA?.priority || 999) - (ruleB?.priority || 999);
  });
}

/**
 * Evaluate a single rule against context
 * Pure function - no side effects
 */
function evaluateRule(rule: RiskRule, context: RiskContext): RiskRuleEvaluation {
  let matched = false;
  let score = 0;
  let reason = '';

  try {
    switch (rule.ruleType) {
      case 'SCORING':
        const scoringResult = evaluateScoringRule(rule, context);
        matched = scoringResult.matched;
        score = scoringResult.score;
        reason = scoringResult.reason;
        break;

      case 'THRESHOLD':
        const thresholdResult = evaluateThresholdRule(rule, context);
        matched = thresholdResult.matched;
        score = thresholdResult.score;
        reason = thresholdResult.reason;
        break;

      case 'BLACKLIST':
        const blacklistResult = evaluateBlacklistRule(rule, context);
        matched = blacklistResult.matched;
        score = blacklistResult.score;
        reason = blacklistResult.reason;
        break;

      case 'WHITELIST':
        const whitelistResult = evaluateWhitelistRule(rule, context);
        matched = whitelistResult.matched;
        score = whitelistResult.score;
        reason = whitelistResult.reason;
        break;

      default:
        matched = false;
        score = 0;
        reason = 'Unknown rule type';
    }
  } catch (error) {
    matched = false;
    score = 0;
    reason = `Rule evaluation error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }

  return {
    ruleId: rule.id,
    ruleName: rule.name,
    matched,
    score: score * rule.weight,
    reason,
    action: rule.action,
    actionParams: rule.actionParams,
    metadata: {
      ruleType: rule.ruleType,
      category: rule.category,
      priority: rule.priority,
      weight: rule.weight
    }
  };
}

/**
 * Evaluate scoring rule
 * Pure function - no side effects
 */
function evaluateScoringRule(rule: RiskRule, context: RiskContext): { matched: boolean; score: number; reason: string } {
  const { conditions } = rule;
  let score = 0;
  let matchedConditions = 0;
  const totalConditions = Object.keys(conditions).length;

  for (const [conditionKey, conditionValue] of Object.entries(conditions)) {
    if (evaluateCondition(conditionKey, conditionValue, context)) {
      matchedConditions++;
      score += conditionValue.score || 1;
    }
  }

  const matched = matchedConditions > 0;
  const reason = matched 
    ? `Matched ${matchedConditions}/${totalConditions} conditions, score: ${score}`
    : 'No conditions matched';

  return { matched, score, reason };
}

/**
 * Evaluate threshold rule
 * Pure function - no side effects
 */
function evaluateThresholdRule(rule: RiskRule, context: RiskContext): { matched: boolean; score: number; reason: string } {
  const { conditions, threshold = 0 } = rule;
  let totalValue = 0;

  for (const [conditionKey, conditionValue] of Object.entries(conditions)) {
    const value = getContextValue(conditionKey, context);
    if (typeof value === 'number') {
      totalValue += value * (conditionValue.weight || 1);
    }
  }

  const matched = totalValue >= threshold;
  const score = matched ? totalValue : 0;
  const reason = matched 
    ? `Value ${totalValue} exceeds threshold ${threshold}`
    : `Value ${totalValue} below threshold ${threshold}`;

  return { matched, score, reason };
}

/**
 * Evaluate blacklist rule
 * Pure function - no side effects
 */
function evaluateBlacklistRule(rule: RiskRule, context: RiskContext): { matched: boolean; score: number; reason: string } {
  const { conditions } = rule;
  let matched = false;

  for (const [conditionKey, conditionValue] of Object.entries(conditions)) {
    const contextValue = getContextValue(conditionKey, context);
    if (contextValue === conditionValue) {
      matched = true;
      break;
    }
  }

  const score = matched ? 100 : 0; // High score for blacklist matches
  const reason = matched ? 'Entity matches blacklist criteria' : 'Entity not in blacklist';

  return { matched, score, reason };
}

/**
 * Evaluate whitelist rule
 * Pure function - no side effects
 */
function evaluateWhitelistRule(rule: RiskRule, context: RiskContext): { matched: boolean; score: number; reason: string } {
  const { conditions } = rule;
  let matched = false;

  for (const [conditionKey, conditionValue] of Object.entries(conditions)) {
    const contextValue = getContextValue(conditionKey, context);
    if (contextValue === conditionValue) {
      matched = true;
      break;
    }
  }

  const score = matched ? -50 : 0; // Negative score for whitelist matches
  const reason = matched ? 'Entity matches whitelist criteria' : 'Entity not in whitelist';

  return { matched, score, reason };
}

/**
 * Evaluate a single condition
 * Pure function - no side effects
 */
function evaluateCondition(conditionKey: string, conditionValue: any, context: RiskContext): boolean {
  const contextValue = getContextValue(conditionKey, context);

  if (conditionValue.operator) {
    switch (conditionValue.operator) {
      case 'equals':
        return contextValue === conditionValue.value;
      case 'not_equals':
        return contextValue !== conditionValue.value;
      case 'greater_than':
        return typeof contextValue === 'number' && contextValue > conditionValue.value;
      case 'less_than':
        return typeof contextValue === 'number' && contextValue < conditionValue.value;
      case 'greater_than_or_equal':
        return typeof contextValue === 'number' && contextValue >= conditionValue.value;
      case 'less_than_or_equal':
        return typeof contextValue === 'number' && contextValue <= conditionValue.value;
      case 'contains':
        return typeof contextValue === 'string' && contextValue.includes(conditionValue.value);
      case 'not_contains':
        return typeof contextValue === 'string' && !contextValue.includes(conditionValue.value);
      case 'in':
        return Array.isArray(conditionValue.value) && conditionValue.value.includes(contextValue);
      case 'not_in':
        return Array.isArray(conditionValue.value) && !conditionValue.value.includes(contextValue);
      default:
        return false;
    }
  }

  return contextValue === conditionValue;
}

/**
 * Get value from context by key
 * Pure function - no side effects
 */
function getContextValue(key: string, context: RiskContext): any {
  const keys = key.split('.');
  let value: any = context;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Calculate risk score from rule evaluations
 * Pure function - no side effects
 */
export function calculateRiskScore(evaluations: RiskRuleEvaluation[], context: RiskContext): RiskScore {
  let totalScore = 0;
  let maxPossibleScore = 0;
  const ruleScores: Record<string, number> = {};
  const recommendations: string[] = [];
  let shouldBlock = false;
  let shouldHold = false;
  let shouldReview = false;

  for (const evaluation of evaluations) {
    ruleScores[evaluation.ruleId] = evaluation.score;
    totalScore += evaluation.score;

    // Calculate max possible score (simplified)
    maxPossibleScore += Math.abs(evaluation.score) * 2;

    // Check for blocking conditions
    if (evaluation.action === 'BLOCK' && evaluation.matched) {
      shouldBlock = true;
      recommendations.push(`Block: ${evaluation.reason}`);
    }

    // Check for hold conditions
    if (evaluation.action === 'HOLD' && evaluation.matched) {
      shouldHold = true;
      recommendations.push(`Hold: ${evaluation.reason}`);
    }

    // Check for review conditions
    if (evaluation.action === 'REVIEW' && evaluation.matched) {
      shouldReview = true;
      recommendations.push(`Review: ${evaluation.reason}`);
    }
  }

  // Determine risk level
  const riskLevel = determineRiskLevel(totalScore, maxPossibleScore);

  // Calculate confidence based on number of matched rules
  const matchedRules = evaluations.filter(e => e.matched).length;
  const confidence = Math.min(matchedRules / Math.max(evaluations.length, 1), 1);

  // Add general recommendations based on risk level
  if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
    recommendations.push('Consider additional verification');
    recommendations.push('Monitor closely for suspicious activity');
  }

  if (riskLevel === 'CRITICAL') {
    recommendations.push('Immediate manual review required');
  }

  return {
    totalScore,
    maxPossibleScore,
    riskLevel,
    ruleScores,
    confidence,
    shouldBlock,
    shouldHold,
    shouldReview,
    recommendations
  };
}

/**
 * Determine risk level from score
 * Pure function - no side effects
 */
export function determineRiskLevel(score: number, maxScore: number, thresholds?: RiskThresholds): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const defaultThresholds: RiskThresholds = {
    low: 0.2,
    medium: 0.4,
    high: 0.7,
    critical: 0.9
  };

  const thresh = thresholds || defaultThresholds;
  const normalizedScore = maxScore > 0 ? Math.abs(score) / maxScore : 0;

  if (normalizedScore >= thresh.critical) {
    return 'CRITICAL';
  } else if (normalizedScore >= thresh.high) {
    return 'HIGH';
  } else if (normalizedScore >= thresh.medium) {
    return 'MEDIUM';
  } else {
    return 'LOW';
  }
}

/**
 * Compare two addresses for similarity
 * Pure function - no side effects
 */
function compareAddresses(address1: any, address2: any): boolean {
  if (!address1 || !address2) return false;

  const normalize = (addr: any) => {
    return {
      street: (addr.street || '').toLowerCase().trim(),
      city: (addr.city || '').toLowerCase().trim(),
      state: (addr.state || '').toLowerCase().trim(),
      postalCode: (addr.postalCode || '').toLowerCase().trim(),
      country: (addr.country || '').toLowerCase().trim()
    };
  };

  const norm1 = normalize(address1);
  const norm2 = normalize(address2);

  return norm1.street === norm2.street &&
         norm1.city === norm2.city &&
         norm1.state === norm2.state &&
         norm1.postalCode === norm2.postalCode &&
         norm1.country === norm2.country;
}

/**
 * Check if IP address is suspicious
 * Pure function - no side effects
 */
function checkSuspiciousIP(ipAddress: string): boolean {
  // Simplified suspicious IP detection
  // In a real implementation, this would check against known bad IP lists
  
  // Check for private IPs (simplified)
  if (ipAddress.startsWith('192.168.') || 
      ipAddress.startsWith('10.') || 
      ipAddress.startsWith('172.')) {
    return false; // Private IPs are usually not suspicious
  }

  // Check for localhost
  if (ipAddress === '127.0.0.1' || ipAddress === '::1') {
    return false;
  }

  // Check for known suspicious patterns (simplified)
  const suspiciousPatterns = [
    /^0\.0\.0\./,  // Invalid IPs
    /^255\.255\.255\./,  // Broadcast IPs
  ];

  return suspiciousPatterns.some(pattern => pattern.test(ipAddress));
}

/**
 * Validate risk assessment input
 * Pure function - no side effects
 */
export function validateRiskAssessmentInput(input: {
  entityId: string;
  entityType: string;
  tenantId: string;
  context: RiskContext;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.entityId || input.entityId.trim().length === 0) {
    errors.push('Entity ID is required');
  }

  if (!input.entityType || !['CUSTOMER', 'SELLER', 'ORDER', 'PAYMENT'].includes(input.entityType)) {
    errors.push('Valid entity type is required');
  }

  if (!input.tenantId || input.tenantId.trim().length === 0) {
    errors.push('Tenant ID is required');
  }

  if (!input.context || !input.context.signals || !Array.isArray(input.context.signals)) {
    errors.push('Valid context with signals is required');
  }

  if (input.context && input.context.signals) {
    input.context.signals.forEach((signal, index) => {
      if (!signal.signalType || !signal.signalName) {
        errors.push(`Signal ${index + 1}: signalType and signalName are required`);
      }
      if (typeof signal.weight !== 'number') {
        errors.push(`Signal ${index + 1}: weight must be a number`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate risk assessment summary
 * Pure function - no side effects
 */
export function generateRiskSummary(riskScore: RiskScore): {
  summary: string;
  details: string[];
  actions: string[];
} {
  const details: string[] = [];
  const actions: string[] = [];

  // Risk level summary
  details.push(`Risk Level: ${riskScore.riskLevel}`);
  details.push(`Total Score: ${riskScore.totalScore.toFixed(2)}`);
  details.push(`Max Possible Score: ${riskScore.maxPossibleScore.toFixed(2)}`);
  details.push(`Confidence: ${(riskScore.confidence * 100).toFixed(1)}%`);

  // Rule scores breakdown
  const topRules = Object.entries(riskScore.ruleScores)
    .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))
    .slice(0, 5);

  if (topRules.length > 0) {
    details.push('Top Contributing Rules:');
    topRules.forEach(([ruleId, score]) => {
      details.push(`  ${ruleId}: ${score.toFixed(2)}`);
    });
  }

  // Actions
  if (riskScore.shouldBlock) {
    actions.push('BLOCK - Entity should be blocked');
  }
  if (riskScore.shouldHold) {
    actions.push('HOLD - Entity should be held for review');
  }
  if (riskScore.shouldReview) {
    actions.push('REVIEW - Manual review required');
  }

  // Recommendations
  if (riskScore.recommendations.length > 0) {
    actions.push('Recommendations:');
    riskScore.recommendations.forEach(rec => {
      actions.push(`  - ${rec}`);
    });
  }

  const summary = `Risk Assessment: ${riskScore.riskLevel} risk (${riskScore.totalScore.toFixed(2)}/${riskScore.maxPossibleScore.toFixed(2)})`;

  return { summary, details, actions };
}

