/**
 * CRM service - Pure functions for customer relationship management
 * Handles segmentation, campaign management, and communication
 */

export interface CustomerSegment {
  id: string;
  name: string;
  description?: string;
  segmentType: 'MANUAL' | 'DYNAMIC' | 'BEHAVIORAL' | 'DEMOGRAPHIC' | 'GEOGRAPHIC' | 'PURCHASE' | 'ENGAGEMENT';
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  criteria: any; // JSON logic
  filters?: any;
  customerCount: number;
  isDynamic: boolean;
  updateFrequency: 'REAL_TIME' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  tags: string[];
  metadata?: any;
}

export interface Customer {
  id: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: string;
  location?: {
    country: string;
    city: string;
    region: string;
  };
  preferences?: {
    language: string;
    currency: string;
    notifications: boolean;
    marketing: boolean;
  };
  purchaseHistory?: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
    favoriteCategories: string[];
  };
  engagementHistory?: {
    lastLoginDate?: Date;
    emailOpens: number;
    emailClicks: number;
    smsOpens: number;
    whatsappOpens: number;
    pushOpens: number;
  };
  metadata?: any;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  campaignType: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' | 'COUPON' | 'PROMOTIONAL' | 'TRANSACTIONAL' | 'WELCOME' | 'ABANDONED_CART' | 'BIRTHDAY' | 'ANNIVERSARY';
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  messageType: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' | 'COUPON' | 'PROMOTIONAL' | 'TRANSACTIONAL';
  deliveryMethod: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' | 'IN_APP';
  targetSegments: string[];
  targetCustomers: string[];
  subject?: string;
  content: string;
  templateId?: string;
  attachments: string[];
  images: string[];
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  batchSize: number;
  delayBetweenBatches: number;
  couponId?: string;
  couponCode?: string;
  startDate?: Date;
  endDate?: Date;
  isScheduled: boolean;
  scheduledAt?: Date;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalConverted: number;
  totalBounced: number;
  totalUnsubscribed: number;
  deliveryRate?: number;
  openRate?: number;
  clickRate?: number;
  conversionRate?: number;
  bounceRate?: number;
  tags: string[];
  metadata?: any;
}

export interface SegmentCriteria {
  type: 'AND' | 'OR';
  conditions: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'greater_than_or_equal' | 'less_than_or_equal' | 'in' | 'not_in' | 'is_null' | 'is_not_null' | 'between' | 'not_between';
    value: any;
    values?: any[];
  }>;
}

export interface CampaignContext {
  campaignId: string;
  customerId: string;
  segmentId?: string;
  messageType: string;
  deliveryMethod: string;
  templateId?: string;
  variables?: Record<string, any>;
  metadata?: any;
}

/**
 * Evaluate customer against segment criteria
 * Pure function - no side effects
 */
export function evaluateCustomerSegment(
  customer: Customer,
  criteria: SegmentCriteria
): boolean {
  return evaluateCriteria(customer, criteria);
}

/**
 * Evaluate criteria recursively
 * Pure function - no side effects
 */
function evaluateCriteria(customer: Customer, criteria: SegmentCriteria): boolean {
  if (criteria.type === 'AND') {
    return criteria.conditions.every(condition => evaluateCondition(customer, condition));
  } else {
    return criteria.conditions.some(condition => evaluateCondition(customer, condition));
  }
}

/**
 * Evaluate single condition
 * Pure function - no side effects
 */
function evaluateCondition(customer: Customer, condition: any): boolean {
  const { field, operator, value, values } = condition;
  const customerValue = getCustomerFieldValue(customer, field);

  switch (operator) {
    case 'equals':
      return customerValue === value;
    case 'not_equals':
      return customerValue !== value;
    case 'contains':
      return String(customerValue).toLowerCase().includes(String(value).toLowerCase());
    case 'not_contains':
      return !String(customerValue).toLowerCase().includes(String(value).toLowerCase());
    case 'starts_with':
      return String(customerValue).toLowerCase().startsWith(String(value).toLowerCase());
    case 'ends_with':
      return String(customerValue).toLowerCase().endsWith(String(value).toLowerCase());
    case 'greater_than':
      return Number(customerValue) > Number(value);
    case 'less_than':
      return Number(customerValue) < Number(value);
    case 'greater_than_or_equal':
      return Number(customerValue) >= Number(value);
    case 'less_than_or_equal':
      return Number(customerValue) <= Number(value);
    case 'in':
      return values && values.includes(customerValue);
    case 'not_in':
      return values && !values.includes(customerValue);
    case 'is_null':
      return customerValue === null || customerValue === undefined;
    case 'is_not_null':
      return customerValue !== null && customerValue !== undefined;
    case 'between':
      return values && values.length === 2 && 
        Number(customerValue) >= Number(values[0]) && 
        Number(customerValue) <= Number(values[1]);
    case 'not_between':
      return values && values.length === 2 && 
        (Number(customerValue) < Number(values[0]) || 
         Number(customerValue) > Number(values[1]));
    default:
      return false;
  }
}

/**
 * Get customer field value by path
 * Pure function - no side effects
 */
function getCustomerFieldValue(customer: Customer, field: string): any {
  const parts = field.split('.');
  let value: any = customer;

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
 * Calculate segment customer count
 * Pure function - no side effects
 */
export function calculateSegmentCustomerCount(
  customers: Customer[],
  criteria: SegmentCriteria
): number {
  return customers.filter(customer => evaluateCustomerSegment(customer, criteria)).length;
}

/**
 * Generate segment insights
 * Pure function - no side effects
 */
export function generateSegmentInsights(
  segment: CustomerSegment,
  customers: Customer[]
): {
  totalCustomers: number;
  segmentSize: number;
  segmentPercentage: number;
  averageAge?: number;
  topLocations: Array<{ location: string; count: number }>;
  topCategories: Array<{ category: string; count: number }>;
  averageOrderValue?: number;
  engagementLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
} {
  const segmentCustomers = customers.filter(customer => 
    evaluateCustomerSegment(customer, segment.criteria)
  );

  const totalCustomers = customers.length;
  const segmentSize = segmentCustomers.length;
  const segmentPercentage = totalCustomers > 0 ? (segmentSize / totalCustomers) * 100 : 0;

  // Calculate average age
  const customersWithAge = segmentCustomers.filter(c => c.dateOfBirth);
  const averageAge = customersWithAge.length > 0 
    ? customersWithAge.reduce((sum, c) => {
        const age = new Date().getFullYear() - new Date(c.dateOfBirth!).getFullYear();
        return sum + age;
      }, 0) / customersWithAge.length
    : undefined;

  // Top locations
  const locationCounts: Record<string, number> = {};
  segmentCustomers.forEach(customer => {
    if (customer.location?.city) {
      const location = `${customer.location.city}, ${customer.location.country}`;
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    }
  });
  const topLocations = Object.entries(locationCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top categories
  const categoryCounts: Record<string, number> = {};
  segmentCustomers.forEach(customer => {
    customer.purchaseHistory?.favoriteCategories?.forEach(category => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
  });
  const topCategories = Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Average order value
  const customersWithOrders = segmentCustomers.filter(c => c.purchaseHistory?.totalSpent);
  const averageOrderValue = customersWithOrders.length > 0
    ? customersWithOrders.reduce((sum, c) => sum + (c.purchaseHistory?.totalSpent || 0), 0) / customersWithOrders.length
    : undefined;

  // Engagement level
  const totalEngagement = segmentCustomers.reduce((sum, c) => {
    const engagement = c.engagementHistory || {};
    return sum + (engagement.emailOpens || 0) + (engagement.emailClicks || 0) + 
           (engagement.smsOpens || 0) + (engagement.whatsappOpens || 0) + (engagement.pushOpens || 0);
  }, 0);
  const averageEngagement = segmentSize > 0 ? totalEngagement / segmentSize : 0;
  const engagementLevel = averageEngagement > 10 ? 'HIGH' : averageEngagement > 5 ? 'MEDIUM' : 'LOW';

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (engagementLevel === 'LOW') {
    recommendations.push('Consider re-engagement campaigns for this segment');
  }
  
  if (averageOrderValue && averageOrderValue < 100) {
    recommendations.push('Target with value-focused promotions');
  }
  
  if (topCategories.length > 0) {
    recommendations.push(`Focus marketing on top categories: ${topCategories.slice(0, 3).map(c => c.category).join(', ')}`);
  }
  
  if (segmentSize < 50) {
    recommendations.push('Consider expanding segment criteria to reach more customers');
  }

  return {
    totalCustomers,
    segmentSize,
    segmentPercentage,
    averageAge,
    topLocations,
    topCategories,
    averageOrderValue,
    engagementLevel,
    recommendations
  };
}

/**
 * Calculate campaign performance metrics
 * Pure function - no side effects
 */
export function calculateCampaignMetrics(campaign: Campaign): {
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  roi?: number;
  costPerMessage: number;
  revenuePerMessage: number;
} {
  const deliveryRate = campaign.totalSent > 0 ? (campaign.totalDelivered / campaign.totalSent) * 100 : 0;
  const openRate = campaign.totalDelivered > 0 ? (campaign.totalOpened / campaign.totalDelivered) * 100 : 0;
  const clickRate = campaign.totalDelivered > 0 ? (campaign.totalClicked / campaign.totalDelivered) * 100 : 0;
  const conversionRate = campaign.totalDelivered > 0 ? (campaign.totalConverted / campaign.totalDelivered) * 100 : 0;
  const bounceRate = campaign.totalSent > 0 ? (campaign.totalBounced / campaign.totalSent) * 100 : 0;
  const unsubscribeRate = campaign.totalSent > 0 ? (campaign.totalUnsubscribed / campaign.totalSent) * 100 : 0;

  // Mock cost calculation (would be based on provider rates)
  const costPerMessage = getCostPerMessage(campaign.deliveryMethod);
  const totalCost = campaign.totalSent * costPerMessage;
  const revenuePerMessage = campaign.totalConverted > 0 ? (totalCost / campaign.totalConverted) : 0;
  const roi = totalCost > 0 ? ((campaign.totalConverted * revenuePerMessage) - totalCost) / totalCost : 0;

  return {
    deliveryRate,
    openRate,
    clickRate,
    conversionRate,
    bounceRate,
    unsubscribeRate,
    roi,
    costPerMessage,
    revenuePerMessage
  };
}

/**
 * Get cost per message by delivery method
 * Pure function - no side effects
 */
function getCostPerMessage(deliveryMethod: string): number {
  const costs: Record<string, number> = {
    'EMAIL': 0.001, // $0.001 per email
    'SMS': 0.05,    // $0.05 per SMS
    'WHATSAPP': 0.02, // $0.02 per WhatsApp message
    'PUSH': 0.0001, // $0.0001 per push notification
    'IN_APP': 0.0001 // $0.0001 per in-app message
  };
  
  return costs[deliveryMethod] || 0.001;
}

/**
 * Generate campaign recommendations
 * Pure function - no side effects
 */
export function generateCampaignRecommendations(
  campaign: Campaign,
  metrics: ReturnType<typeof calculateCampaignMetrics>
): string[] {
  const recommendations: string[] = [];

  if (metrics.deliveryRate < 90) {
    recommendations.push('Low delivery rate - check email list quality and sender reputation');
  }

  if (metrics.openRate < 20) {
    recommendations.push('Low open rate - improve subject lines and send timing');
  }

  if (metrics.clickRate < 2) {
    recommendations.push('Low click rate - improve content and call-to-action');
  }

  if (metrics.bounceRate > 5) {
    recommendations.push('High bounce rate - clean email list and verify addresses');
  }

  if (metrics.unsubscribeRate > 2) {
    recommendations.push('High unsubscribe rate - review content relevance and frequency');
  }

  if (campaign.deliveryMethod === 'EMAIL' && metrics.openRate > 30) {
    recommendations.push('Good open rate - consider A/B testing different content');
  }

  if (campaign.deliveryMethod === 'SMS' && metrics.clickRate > 5) {
    recommendations.push('Good SMS performance - consider expanding SMS campaigns');
  }

  if (metrics.roi && metrics.roi < 0) {
    recommendations.push('Negative ROI - review campaign targeting and content');
  }

  return recommendations;
}

/**
 * Determine optimal send time for customer
 * Pure function - no side effects
 */
export function determineOptimalSendTime(
  customer: Customer,
  deliveryMethod: string,
  timezone?: string
): {
  bestHour: number;
  bestDay: number;
  reasoning: string;
} {
  // Mock implementation - would use customer's engagement history
  const engagement = customer.engagementHistory || {};
  
  // Default to business hours
  let bestHour = 10; // 10 AM
  let bestDay = 1; // Monday
  let reasoning = 'Default business hours';

  // Adjust based on engagement history
  if (engagement.emailOpens > 10) {
    bestHour = 14; // 2 PM
    reasoning = 'Based on high email engagement';
  }

  if (engagement.smsOpens > 5) {
    bestHour = 18; // 6 PM
    reasoning = 'Based on SMS engagement patterns';
  }

  if (engagement.whatsappOpens > 3) {
    bestHour = 20; // 8 PM
    reasoning = 'Based on WhatsApp usage patterns';
  }

  // Adjust for timezone if provided
  if (timezone) {
    // Would adjust for timezone offset
    reasoning += ` (adjusted for ${timezone})`;
  }

  return { bestHour, bestDay, reasoning };
}

/**
 * Generate personalized content
 * Pure function - no side effects
 */
export function generatePersonalizedContent(
  template: string,
  customer: Customer,
  variables: Record<string, any> = {}
): string {
  let content = template;

  // Default variables
  const defaultVariables = {
    '{{customer_name}}': customer.firstName || 'Valued Customer',
    '{{customer_email}}': customer.email,
    '{{customer_phone}}': customer.phone || '',
    '{{first_name}}': customer.firstName || '',
    '{{last_name}}': customer.lastName || '',
    '{{full_name}}': `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
    '{{location}}': customer.location ? `${customer.location.city}, ${customer.location.country}` : '',
    '{{total_orders}}': customer.purchaseHistory?.totalOrders || 0,
    '{{total_spent}}': customer.purchaseHistory?.totalSpent || 0,
    '{{last_order_date}}': customer.purchaseHistory?.lastOrderDate?.toLocaleDateString() || '',
    '{{favorite_categories}}': customer.purchaseHistory?.favoriteCategories?.join(', ') || ''
  };

  // Merge with provided variables
  const allVariables = { ...defaultVariables, ...variables };

  // Replace variables in content
  Object.entries(allVariables).forEach(([key, value]) => {
    const regex = new RegExp(key.replace(/[{}]/g, '\\$&'), 'gi');
    content = content.replace(regex, String(value));
  });

  return content;
}

/**
 * Validate campaign before sending
 * Pure function - no side effects
 */
export function validateCampaign(campaign: Campaign): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!campaign.name) {
    errors.push('Campaign name is required');
  }

  if (!campaign.content) {
    errors.push('Campaign content is required');
  }

  if (campaign.targetSegments.length === 0 && campaign.targetCustomers.length === 0) {
    errors.push('At least one target segment or customer must be specified');
  }

  // Email-specific validations
  if (campaign.deliveryMethod === 'EMAIL' && !campaign.subject) {
    errors.push('Email subject is required for email campaigns');
  }

  // Content length validations
  if (campaign.deliveryMethod === 'SMS' && campaign.content.length > 160) {
    warnings.push('SMS content exceeds 160 characters');
  }

  if (campaign.deliveryMethod === 'WHATSAPP' && campaign.content.length > 4096) {
    warnings.push('WhatsApp content exceeds 4096 characters');
  }

  // Schedule validations
  if (campaign.isScheduled && !campaign.scheduledAt) {
    errors.push('Scheduled time is required for scheduled campaigns');
  }

  if (campaign.isScheduled && campaign.scheduledAt && campaign.scheduledAt < new Date()) {
    errors.push('Scheduled time cannot be in the past');
  }

  // Batch size validations
  if (campaign.batchSize < 1) {
    errors.push('Batch size must be at least 1');
  }

  if (campaign.batchSize > 1000) {
    warnings.push('Large batch size may cause delivery issues');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Calculate campaign budget
 * Pure function - no side effects
 */
export function calculateCampaignBudget(
  targetCount: number,
  deliveryMethod: string,
  additionalCosts: number = 0
): {
  estimatedCost: number;
  costBreakdown: Record<string, number>;
  recommendations: string[];
} {
  const costPerMessage = getCostPerMessage(deliveryMethod);
  const messageCost = targetCount * costPerMessage;
  const totalCost = messageCost + additionalCosts;

  const costBreakdown = {
    'Message Cost': messageCost,
    'Additional Costs': additionalCosts,
    'Total Cost': totalCost
  };

  const recommendations: string[] = [];

  if (deliveryMethod === 'EMAIL' && totalCost > 100) {
    recommendations.push('Consider using email templates to reduce costs');
  }

  if (deliveryMethod === 'SMS' && totalCost > 500) {
    recommendations.push('SMS costs are high - consider email or WhatsApp alternatives');
  }

  if (targetCount > 10000) {
    recommendations.push('Large campaign - consider sending in batches');
  }

  return {
    estimatedCost: totalCost,
    costBreakdown,
    recommendations
  };
}

