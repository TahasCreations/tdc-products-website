// Subscription Types
export interface SubscriptionInput {
  tenantId: string;
  customerId?: string;
  planId: string;
  planName: string;
  status?: SubscriptionStatus;
  billingCycle?: BillingCycle;
  price: number;
  currency?: string;
  startDate?: Date;
  endDate?: Date;
  trialEndDate?: Date;
  nextBillingDate?: Date;
  provider: string;
  providerId?: string;
  providerData?: Record<string, any>;
  features?: Record<string, any>;
  limits?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface SubscriptionOutput {
  id: string;
  tenantId: string;
  customerId?: string;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  price: number;
  currency: string;
  startDate: Date;
  endDate?: Date;
  trialEndDate?: Date;
  nextBillingDate?: Date;
  provider: string;
  providerId?: string;
  providerData?: Record<string, any>;
  features?: Record<string, any>;
  limits?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  entitlements: EntitlementOutput[];
}

export interface EntitlementInput {
  tenantId: string;
  subscriptionId: string;
  feature: string;
  enabled?: boolean;
  limit?: number;
  used?: number;
  config?: Record<string, any>;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface EntitlementOutput {
  id: string;
  tenantId: string;
  subscriptionId: string;
  feature: string;
  enabled: boolean;
  limit?: number;
  used: number;
  config?: Record<string, any>;
  expiresAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPlanInput {
  tenantId?: string;
  name: string;
  displayName: string;
  description?: string;
  price: number;
  currency?: string;
  billingCycle?: BillingCycle;
  features: Record<string, any>;
  limits: Record<string, any>;
  isActive?: boolean;
  isPublic?: boolean;
  isTrial?: boolean;
  trialDays?: number;
  metadata?: Record<string, any>;
}

export interface SubscriptionPlanOutput {
  id: string;
  tenantId?: string;
  name: string;
  displayName: string;
  description?: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  features: Record<string, any>;
  limits: Record<string, any>;
  isActive: boolean;
  isPublic: boolean;
  isTrial: boolean;
  trialDays?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Feature Access Control
export interface FeatureAccess {
  feature: string;
  enabled: boolean;
  limit?: number;
  used: number;
  remaining?: number;
  expiresAt?: Date;
  config?: Record<string, any>;
}

export interface TenantEntitlements {
  tenantId: string;
  activeSubscription?: SubscriptionOutput;
  entitlements: FeatureAccess[];
  hasFeature: (feature: string) => boolean;
  getFeatureLimit: (feature: string) => number | null;
  getFeatureUsage: (feature: string) => number;
  getFeatureRemaining: (feature: string) => number | null;
  canUseFeature: (feature: string, amount?: number) => boolean;
}

// Payment Provider Integration
export interface PaymentProvider {
  name: string;
  createSubscription: (data: CreateSubscriptionData) => Promise<ProviderSubscriptionResult>;
  cancelSubscription: (subscriptionId: string) => Promise<ProviderCancelResult>;
  updateSubscription: (subscriptionId: string, data: UpdateSubscriptionData) => Promise<ProviderSubscriptionResult>;
  getSubscription: (subscriptionId: string) => Promise<ProviderSubscriptionResult>;
  createCustomer: (data: CreateCustomerData) => Promise<ProviderCustomerResult>;
  createPaymentMethod: (customerId: string, data: PaymentMethodData) => Promise<ProviderPaymentMethodResult>;
  webhookHandler: (payload: any, signature: string) => Promise<WebhookEvent>;
}

export interface CreateSubscriptionData {
  tenantId: string;
  planId: string;
  customerId?: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  trialDays?: number;
  metadata?: Record<string, any>;
}

export interface UpdateSubscriptionData {
  planId?: string;
  price?: number;
  billingCycle?: BillingCycle;
  status?: SubscriptionStatus;
  metadata?: Record<string, any>;
}

export interface CreateCustomerData {
  tenantId: string;
  email: string;
  name?: string;
  metadata?: Record<string, any>;
}

export interface PaymentMethodData {
  type: 'card' | 'bank_account' | 'paypal';
  card?: {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  };
  bankAccount?: {
    accountNumber: string;
    routingNumber: string;
    accountHolderName: string;
  };
  metadata?: Record<string, any>;
}

export interface ProviderSubscriptionResult {
  success: boolean;
  subscriptionId: string;
  customerId?: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEnd?: Date;
  providerData?: Record<string, any>;
  error?: string;
}

export interface ProviderCancelResult {
  success: boolean;
  canceledAt: Date;
  cancelAtPeriodEnd: boolean;
  error?: string;
}

export interface ProviderCustomerResult {
  success: boolean;
  customerId: string;
  providerData?: Record<string, any>;
  error?: string;
}

export interface ProviderPaymentMethodResult {
  success: boolean;
  paymentMethodId: string;
  providerData?: Record<string, any>;
  error?: string;
}

export interface WebhookEvent {
  type: string;
  subscriptionId?: string;
  customerId?: string;
  data: Record<string, any>;
  timestamp: Date;
}

// Subscription Management
export interface SubscriptionSummary {
  id: string;
  planName: string;
  status: SubscriptionStatus;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  nextBillingDate?: Date;
  trialEndDate?: Date;
  features: string[];
  limits: Record<string, number>;
}

export interface BillingInfo {
  subscription: SubscriptionSummary;
  paymentMethod?: {
    type: string;
    last4: string;
    brand?: string;
    expMonth?: number;
    expYear?: number;
  };
  billingHistory: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    date: Date;
    description?: string;
  }>;
  upcomingInvoice?: {
    amount: number;
    currency: string;
    date: Date;
    description?: string;
  };
}

// Plan Comparison
export interface PlanComparison {
  currentPlan?: SubscriptionPlanOutput;
  availablePlans: SubscriptionPlanOutput[];
  recommendedPlan?: SubscriptionPlanOutput;
  upgradePath?: Array<{
    from: SubscriptionPlanOutput;
    to: SubscriptionPlanOutput;
    priceDifference: number;
    featuresGained: string[];
    featuresLost: string[];
  }>;
}

// Usage Analytics
export interface UsageAnalytics {
  feature: string;
  currentUsage: number;
  limit?: number;
  usagePercentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  projectedOverage?: number;
  recommendations: string[];
}

// Enums
export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  TRIALING = 'TRIALING',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  UNPAID = 'UNPAID',
  INCOMPLETE = 'INCOMPLETE',
  INCOMPLETE_EXPIRED = 'INCOMPLETE_EXPIRED',
  PAUSED = 'PAUSED'
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  WEEKLY = 'WEEKLY',
  DAILY = 'DAILY',
  ONE_TIME = 'ONE_TIME'
}

export enum FeatureName {
  CUSTOM_DOMAINS = 'custom_domains',
  PAGE_BUILDER = 'page_builder',
  ADVANCED_ANALYTICS = 'advanced_analytics',
  PRIORITY_SUPPORT = 'priority_support',
  API_ACCESS = 'api_access',
  WEBHOOKS = 'webhooks',
  MULTI_STORE = 'multi_store',
  CUSTOM_THEMES = 'custom_themes',
  UNLIMITED_PRODUCTS = 'unlimited_products',
  UNLIMITED_ORDERS = 'unlimited_orders'
}

// Predefined Plans
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'free',
    displayName: 'Free',
    price: 0,
    features: {
      [FeatureName.UNLIMITED_PRODUCTS]: { limit: 10 },
      [FeatureName.UNLIMITED_ORDERS]: { limit: 100 }
    }
  },
  BASIC: {
    name: 'basic',
    displayName: 'Basic',
    price: 2900, // $29.00
    features: {
      [FeatureName.UNLIMITED_PRODUCTS]: { limit: 100 },
      [FeatureName.UNLIMITED_ORDERS]: { limit: 1000 },
      [FeatureName.API_ACCESS]: { enabled: true }
    }
  },
  CUSTOM_DOMAIN_PRO: {
    name: 'custom_domain_pro',
    displayName: 'Custom Domain Pro',
    price: 9900, // $99.00
    features: {
      [FeatureName.CUSTOM_DOMAINS]: { limit: 5 },
      [FeatureName.PAGE_BUILDER]: { enabled: true },
      [FeatureName.UNLIMITED_PRODUCTS]: { limit: null },
      [FeatureName.UNLIMITED_ORDERS]: { limit: null },
      [FeatureName.API_ACCESS]: { enabled: true },
      [FeatureName.WEBHOOKS]: { enabled: true },
      [FeatureName.ADVANCED_ANALYTICS]: { enabled: true },
      [FeatureName.PRIORITY_SUPPORT]: { enabled: true }
    }
  },
  ENTERPRISE: {
    name: 'enterprise',
    displayName: 'Enterprise',
    price: 29900, // $299.00
    features: {
      [FeatureName.CUSTOM_DOMAINS]: { limit: null },
      [FeatureName.PAGE_BUILDER]: { enabled: true },
      [FeatureName.UNLIMITED_PRODUCTS]: { limit: null },
      [FeatureName.UNLIMITED_ORDERS]: { limit: null },
      [FeatureName.API_ACCESS]: { enabled: true },
      [FeatureName.WEBHOOKS]: { enabled: true },
      [FeatureName.ADVANCED_ANALYTICS]: { enabled: true },
      [FeatureName.PRIORITY_SUPPORT]: { enabled: true },
      [FeatureName.MULTI_STORE]: { limit: 10 },
      [FeatureName.CUSTOM_THEMES]: { enabled: true }
    }
  }
} as const;

