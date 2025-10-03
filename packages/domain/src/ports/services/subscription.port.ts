import { z } from 'zod';
import { 
  SubscriptionInput, 
  SubscriptionOutput, 
  EntitlementInput, 
  EntitlementOutput,
  SubscriptionPlanInput,
  SubscriptionPlanOutput,
  FeatureAccess,
  TenantEntitlements,
  PaymentProvider,
  CreateSubscriptionData,
  UpdateSubscriptionData,
  ProviderSubscriptionResult,
  ProviderCancelResult,
  BillingInfo,
  PlanComparison,
  UsageAnalytics,
  SubscriptionStatus,
  BillingCycle,
  FeatureName
} from '../../types/subscription.types.js';

// Validation schemas
export const SubscriptionStatusSchema = z.enum(['ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED', 'UNPAID', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'PAUSED']);
export const BillingCycleSchema = z.enum(['MONTHLY', 'YEARLY', 'WEEKLY', 'DAILY', 'ONE_TIME']);
export const FeatureNameSchema = z.enum(['custom_domains', 'page_builder', 'advanced_analytics', 'priority_support', 'api_access', 'webhooks', 'multi_store', 'custom_themes', 'unlimited_products', 'unlimited_orders']);

export const SubscriptionInputSchema = z.object({
  tenantId: z.string().min(1),
  customerId: z.string().optional(),
  planId: z.string().min(1),
  planName: z.string().min(1),
  status: SubscriptionStatusSchema.default('ACTIVE'),
  billingCycle: BillingCycleSchema.default('MONTHLY'),
  price: z.number().min(0),
  currency: z.string().default('USD'),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  trialEndDate: z.date().optional(),
  nextBillingDate: z.date().optional(),
  provider: z.string().min(1),
  providerId: z.string().optional(),
  providerData: z.record(z.any()).optional(),
  features: z.record(z.any()).optional(),
  limits: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional()
});

export const EntitlementInputSchema = z.object({
  tenantId: z.string().min(1),
  subscriptionId: z.string().min(1),
  feature: FeatureNameSchema,
  enabled: z.boolean().default(true),
  limit: z.number().int().min(0).optional(),
  used: z.number().int().min(0).default(0),
  config: z.record(z.any()).optional(),
  expiresAt: z.date().optional(),
  metadata: z.record(z.any()).optional()
});

export const SubscriptionPlanInputSchema = z.object({
  tenantId: z.string().optional(),
  name: z.string().min(1),
  displayName: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  currency: z.string().default('USD'),
  billingCycle: BillingCycleSchema.default('MONTHLY'),
  features: z.record(z.any()),
  limits: z.record(z.any()),
  isActive: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  isTrial: z.boolean().default(false),
  trialDays: z.number().int().min(0).optional(),
  metadata: z.record(z.any()).optional()
});

// Subscription Port Interface
export interface SubscriptionPort {
  // Subscription Management
  createSubscription(input: SubscriptionInput): Promise<SubscriptionOutput>;
  getSubscription(id: string, tenantId: string): Promise<SubscriptionOutput | null>;
  getActiveSubscription(tenantId: string): Promise<SubscriptionOutput | null>;
  updateSubscription(id: string, tenantId: string, input: Partial<SubscriptionInput>): Promise<SubscriptionOutput>;
  cancelSubscription(id: string, tenantId: string, cancelAtPeriodEnd?: boolean): Promise<SubscriptionOutput>;
  reactivateSubscription(id: string, tenantId: string): Promise<SubscriptionOutput>;
  getSubscriptions(tenantId: string, filters?: {
    status?: SubscriptionStatus;
    planId?: string;
    limit?: number;
    offset?: number;
  }): Promise<SubscriptionOutput[]>;

  // Entitlement Management
  createEntitlement(input: EntitlementInput): Promise<EntitlementOutput>;
  getEntitlement(id: string, tenantId: string): Promise<EntitlementOutput | null>;
  getEntitlements(tenantId: string, filters?: {
    subscriptionId?: string;
    feature?: string;
    enabled?: boolean;
  }): Promise<EntitlementOutput[]>;
  updateEntitlement(id: string, tenantId: string, input: Partial<EntitlementInput>): Promise<EntitlementOutput>;
  deleteEntitlement(id: string, tenantId: string): Promise<boolean>;
  incrementUsage(tenantId: string, feature: string, amount?: number): Promise<EntitlementOutput>;
  resetUsage(tenantId: string, feature: string): Promise<EntitlementOutput>;

  // Plan Management
  createPlan(input: SubscriptionPlanInput): Promise<SubscriptionPlanOutput>;
  getPlan(id: string, tenantId?: string): Promise<SubscriptionPlanOutput | null>;
  getPlans(tenantId?: string, filters?: {
    isActive?: boolean;
    isPublic?: boolean;
    isTrial?: boolean;
  }): Promise<SubscriptionPlanOutput[]>;
  updatePlan(id: string, tenantId: string, input: Partial<SubscriptionPlanInput>): Promise<SubscriptionPlanOutput>;
  deletePlan(id: string, tenantId: string): Promise<boolean>;

  // Feature Access Control
  getTenantEntitlements(tenantId: string): Promise<TenantEntitlements>;
  hasFeature(tenantId: string, feature: string): Promise<boolean>;
  canUseFeature(tenantId: string, feature: string, amount?: number): Promise<boolean>;
  getFeatureAccess(tenantId: string, feature: string): Promise<FeatureAccess | null>;
  getFeatureUsage(tenantId: string, feature: string): Promise<{
    used: number;
    limit?: number;
    remaining?: number;
  }>;

  // Payment Provider Integration
  subscribeToPlan(tenantId: string, planId: string, paymentData: {
    provider: string;
    customerId?: string;
    paymentMethodId?: string;
    trialDays?: number;
  }): Promise<SubscriptionOutput>;
  cancelSubscription(tenantId: string, subscriptionId: string, cancelAtPeriodEnd?: boolean): Promise<SubscriptionOutput>;
  updatePaymentMethod(tenantId: string, subscriptionId: string, paymentMethodId: string): Promise<SubscriptionOutput>;
  retryPayment(tenantId: string, subscriptionId: string): Promise<SubscriptionOutput>;

  // Billing & Invoicing
  getBillingInfo(tenantId: string): Promise<BillingInfo>;
  getBillingHistory(tenantId: string, limit?: number, offset?: number): Promise<Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    date: Date;
    description?: string;
  }>>;
  getUpcomingInvoice(tenantId: string): Promise<{
    amount: number;
    currency: string;
    date: Date;
    description?: string;
  } | null>;

  // Plan Comparison & Recommendations
  getPlanComparison(tenantId: string): Promise<PlanComparison>;
  getRecommendedPlan(tenantId: string, usageData?: Record<string, number>): Promise<SubscriptionPlanOutput | null>;
  getUpgradePath(tenantId: string, targetPlanId: string): Promise<{
    from: SubscriptionPlanOutput;
    to: SubscriptionPlanOutput;
    priceDifference: number;
    featuresGained: string[];
    featuresLost: string[];
  } | null>;

  // Usage Analytics
  getUsageAnalytics(tenantId: string, feature?: string): Promise<UsageAnalytics[]>;
  getUsageTrends(tenantId: string, feature: string, period: 'day' | 'week' | 'month'): Promise<Array<{
    date: Date;
    usage: number;
    limit?: number;
  }>>;
  getUsageProjections(tenantId: string, feature: string): Promise<{
    projectedUsage: number;
    projectedOverage?: number;
    recommendations: string[];
  }>;

  // Webhook Handling
  handleWebhook(provider: string, payload: any, signature: string): Promise<{
    success: boolean;
    event: string;
    subscriptionId?: string;
    customerId?: string;
  }>;
  validateWebhookSignature(provider: string, payload: any, signature: string): Promise<boolean>;

  // Trial Management
  startTrial(tenantId: string, planId: string, trialDays: number): Promise<SubscriptionOutput>;
  endTrial(tenantId: string, subscriptionId: string): Promise<SubscriptionOutput>;
  getTrialStatus(tenantId: string): Promise<{
    isTrial: boolean;
    trialEndDate?: Date;
    daysRemaining?: number;
    planName?: string;
  }>;

  // Feature Limits & Enforcement
  enforceFeatureLimits(tenantId: string, feature: string, requestedAmount?: number): Promise<{
    allowed: boolean;
    reason?: string;
    currentUsage: number;
    limit?: number;
    remaining?: number;
  }>;
  getFeatureViolations(tenantId: string): Promise<Array<{
    feature: string;
    currentUsage: number;
    limit: number;
    overage: number;
    lastViolation: Date;
  }>>;

  // Subscription Lifecycle
  processSubscriptionLifecycle(): Promise<{
    processed: number;
    errors: string[];
  }>;
  handleExpiredSubscriptions(): Promise<{
    expired: number;
    errors: string[];
  }>;
  handleFailedPayments(): Promise<{
    retried: number;
    failed: number;
    errors: string[];
  }>;

  // Reporting & Analytics
  getSubscriptionMetrics(tenantId: string, period: 'day' | 'week' | 'month' | 'year'): Promise<{
    totalRevenue: number;
    activeSubscriptions: number;
    churnRate: number;
    mrr: number;
    arr: number;
    averageRevenuePerUser: number;
  }>;
  getFeatureUsageReport(tenantId: string, feature: string, period: 'day' | 'week' | 'month'): Promise<{
    totalUsage: number;
    uniqueUsers: number;
    averageUsagePerUser: number;
    peakUsage: number;
    trends: Array<{
      date: Date;
      usage: number;
    }>;
  }>;

  // Admin Functions
  getSystemMetrics(): Promise<{
    totalSubscriptions: number;
    activeSubscriptions: number;
    totalRevenue: number;
    topPlans: Array<{
      planId: string;
      planName: string;
      count: number;
      revenue: number;
    }>;
    featureUsage: Array<{
      feature: string;
      usage: number;
      limit: number;
      utilization: number;
    }>;
  }>;
  getTenantSubscriptionHistory(tenantId: string): Promise<Array<{
    id: string;
    planName: string;
    status: SubscriptionStatus;
    startDate: Date;
    endDate?: Date;
    price: number;
    currency: string;
  }>>;
}
