/**
 * Subscription Service - Business logic for subscription management
 * Handles subscription lifecycle, billing, and plan management
 */

import { SubscriptionRepository } from '../database/repositories/subscription.repository';
import { SubscriptionPort } from '@tdc/domain';

export class SubscriptionService {
  constructor(
    private subscriptionRepo: SubscriptionRepository,
    private subscriptionPort: SubscriptionPort
  ) {}

  // ===========================================
  // SUBSCRIPTION PLANS
  // ===========================================

  async createSubscriptionPlan(input: {
    tenantId: string;
    name: string;
    description?: string;
    planType: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE' | 'CUSTOM';
    isActive?: boolean;
    isDefault?: boolean;
    amount: number;
    currency?: string;
    billingCycle: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    features?: string[];
    limits?: Record<string, any>;
    maxProducts?: number;
    maxOrders?: number;
    maxStorage?: number;
    maxUsers?: number;
    trialDays?: number;
    trialFeatures?: string[];
    status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
    sortOrder?: number;
    metadata?: Record<string, any>;
  }) {
    console.log(`📋 Creating subscription plan: ${input.name} (${input.planType})`);
    
    try {
      const plan = await this.subscriptionRepo.createSubscriptionPlan(input);
      console.log(`✅ Subscription plan created: ${plan.id}`);
      return plan;
    } catch (error: any) {
      console.error(`❌ Error creating subscription plan:`, error.message);
      throw error;
    }
  }

  async getSubscriptionPlans(
    tenantId: string,
    planType?: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE' | 'CUSTOM',
    isActive?: boolean,
    status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED',
    limit = 100,
    offset = 0
  ) {
    return this.subscriptionRepo.getSubscriptionPlans(
      tenantId,
      planType,
      isActive,
      status,
      limit,
      offset
    );
  }

  async getDefaultSubscriptionPlan(tenantId: string) {
    return this.subscriptionRepo.getDefaultSubscriptionPlan(tenantId);
  }

  async updateSubscriptionPlan(
    id: string,
    data: {
      name?: string;
      description?: string;
      planType?: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE' | 'CUSTOM';
      isActive?: boolean;
      isDefault?: boolean;
      amount?: number;
      currency?: string;
      billingCycle?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
      features?: string[];
      limits?: Record<string, any>;
      maxProducts?: number;
      maxOrders?: number;
      maxStorage?: number;
      maxUsers?: number;
      trialDays?: number;
      trialFeatures?: string[];
      status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
      sortOrder?: number;
      metadata?: Record<string, any>;
    }
  ) {
    console.log(`📋 Updating subscription plan: ${id}`);
    
    try {
      const plan = await this.subscriptionRepo.updateSubscriptionPlan(id, data);
      console.log(`✅ Subscription plan updated: ${id}`);
      return plan;
    } catch (error: any) {
      console.error(`❌ Error updating subscription plan:`, error.message);
      throw error;
    }
  }

  async deleteSubscriptionPlan(id: string) {
    console.log(`📋 Deleting subscription plan: ${id}`);
    
    try {
      await this.subscriptionRepo.deleteSubscriptionPlan(id);
      console.log(`✅ Subscription plan deleted: ${id}`);
      return { success: true };
    } catch (error: any) {
      console.error(`❌ Error deleting subscription plan:`, error.message);
      throw error;
    }
  }

  // ===========================================
  // SUBSCRIPTIONS
  // ===========================================

  async createSubscription(input: {
    tenantId: string;
    sellerId?: string;
    planId: string;
    planName: string;
    planType: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE' | 'CUSTOM';
    billingCycle: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    amount: number;
    currency?: string;
    startDate: Date;
    endDate?: Date;
    trialEndDate?: Date;
    nextBillingDate?: Date;
    provider: 'STRIPE' | 'IYZICO' | 'PAYPAL' | 'MANUAL';
    customerEmail: string;
    customerName?: string;
    redirectUrl: string;
    metadata?: Record<string, any>;
  }) {
    console.log(`💳 Creating subscription for plan: ${input.planName} (${input.planType})`);
    
    try {
      // Create checkout session with external provider
      const checkoutResult = await this.subscriptionPort.createCheckoutSession({
        tenantId: input.tenantId,
        sellerId: input.sellerId,
        planId: input.planId,
        planName: input.planName,
        planType: input.planType,
        billingCycle: input.billingCycle,
        amount: input.amount,
        currency: input.currency || 'TRY',
        startDate: input.startDate,
        trialEndDate: input.trialEndDate,
        provider: input.provider,
        customerEmail: input.customerEmail,
        customerName: input.customerName,
        redirectUrl: input.redirectUrl,
        metadata: input.metadata,
      });

      if (!checkoutResult.success) {
        throw new Error(checkoutResult.error || 'Failed to create checkout session');
      }

      // If checkout session was created, return the URL
      if (checkoutResult.checkoutUrl) {
        return {
          success: true,
          checkoutUrl: checkoutResult.checkoutUrl,
          sessionId: checkoutResult.sessionId,
        };
      }

      // If subscription was created directly, return the subscription
      if (checkoutResult.subscriptionId) {
        const subscription = await this.subscriptionRepo.getSubscription(checkoutResult.subscriptionId);
        return {
          success: true,
          subscription,
        };
      }

      throw new Error('Unexpected response from subscription provider');
    } catch (error: any) {
      console.error(`❌ Error creating subscription:`, error.message);
      throw error;
    }
  }

  async getSubscription(id: string) {
    return this.subscriptionRepo.getSubscription(id);
  }

  async getSubscriptions(
    tenantId: string,
    sellerId?: string,
    status?: 'ACTIVE' | 'INACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELLED' | 'UNPAID' | 'SUSPENDED',
    planType?: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE' | 'CUSTOM',
    provider?: 'STRIPE' | 'IYZICO' | 'PAYPAL' | 'MANUAL',
    limit = 100,
    offset = 0
  ) {
    return this.subscriptionRepo.getSubscriptions(
      tenantId,
      sellerId,
      status,
      planType,
      provider,
      limit,
      offset
    );
  }

  async getActiveSubscriptions(
    tenantId: string,
    sellerId?: string,
    planType?: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE' | 'CUSTOM'
  ) {
    return this.subscriptionRepo.getActiveSubscriptions(tenantId, sellerId, planType);
  }

  async getTrialSubscriptions(tenantId: string, sellerId?: string) {
    return this.subscriptionRepo.getTrialSubscriptions(tenantId, sellerId);
  }

  async getExpiringSubscriptions(tenantId: string, days = 7) {
    return this.subscriptionRepo.getExpiringSubscriptions(tenantId, days);
  }

  async updateSubscription(
    id: string,
    data: {
      status?: 'ACTIVE' | 'INACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELLED' | 'UNPAID' | 'SUSPENDED';
      planId?: string;
      planName?: string;
      amount?: number;
      nextBillingDate?: Date;
      lastPaymentDate?: Date;
      lastPaymentAmount?: number;
      failedPayments?: number;
      cancellationReason?: string;
      metadata?: Record<string, any>;
    }
  ) {
    console.log(`💳 Updating subscription: ${id}`);
    
    try {
      // Update subscription with external provider if needed
      if (data.status || data.planId || data.amount) {
        const subscription = await this.subscriptionRepo.getSubscription(id);
        if (subscription) {
          const updateResult = await this.subscriptionPort.updateSubscription({
            subscriptionId: id,
            status: data.status,
            planId: data.planId,
            planName: data.planName,
            amount: data.amount,
            nextBillingDate: data.nextBillingDate,
            cancellationReason: data.cancellationReason,
            metadata: data.metadata,
          });

          if (!updateResult.success) {
            console.warn(`⚠️ Failed to update subscription with provider: ${updateResult.error}`);
          }
        }
      }

      const updated = await this.subscriptionRepo.updateSubscription(id, data);
      console.log(`✅ Subscription updated: ${id}`);
      return updated;
    } catch (error: any) {
      console.error(`❌ Error updating subscription:`, error.message);
      throw error;
    }
  }

  async cancelSubscription(id: string, reason?: string) {
    console.log(`💳 Cancelling subscription: ${id}`);
    
    try {
      // Cancel subscription with external provider
      const cancelResult = await this.subscriptionPort.cancelSubscription(id, reason);
      if (!cancelResult.success) {
        console.warn(`⚠️ Failed to cancel subscription with provider: ${cancelResult.error}`);
      }

      const cancelled = await this.subscriptionRepo.cancelSubscription(id, reason);
      console.log(`✅ Subscription cancelled: ${id}`);
      return cancelled;
    } catch (error: any) {
      console.error(`❌ Error cancelling subscription:`, error.message);
      throw error;
    }
  }

  async deleteSubscription(id: string) {
    console.log(`💳 Deleting subscription: ${id}`);
    
    try {
      await this.subscriptionRepo.deleteSubscription(id);
      console.log(`✅ Subscription deleted: ${id}`);
      return { success: true };
    } catch (error: any) {
      console.error(`❌ Error deleting subscription:`, error.message);
      throw error;
    }
  }

  // ===========================================
  // SUBSCRIPTION INVOICES
  // ===========================================

  async createSubscriptionInvoice(input: {
    subscriptionId: string;
    tenantId: string;
    sellerId?: string;
    invoiceNumber: string;
    amount: number;
    currency?: string;
    taxAmount?: number;
    totalAmount: number;
    periodStart: Date;
    periodEnd: Date;
    provider: 'STRIPE' | 'IYZICO' | 'PAYPAL' | 'MANUAL';
    providerId?: string;
    providerUrl?: string;
    status?: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'REFUNDED';
    dueDate: Date;
    paymentMethod?: string;
    transactionId?: string;
    metadata?: Record<string, any>;
  }) {
    console.log(`🧾 Creating subscription invoice: ${input.invoiceNumber}`);
    
    try {
      const invoice = await this.subscriptionRepo.createSubscriptionInvoice(input);
      console.log(`✅ Subscription invoice created: ${invoice.id}`);
      return invoice;
    } catch (error: any) {
      console.error(`❌ Error creating subscription invoice:`, error.message);
      throw error;
    }
  }

  async getSubscriptionInvoice(id: string) {
    return this.subscriptionRepo.getSubscriptionInvoice(id);
  }

  async getSubscriptionInvoices(
    subscriptionId?: string,
    tenantId?: string,
    sellerId?: string,
    status?: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'REFUNDED',
    provider?: 'STRIPE' | 'IYZICO' | 'PAYPAL' | 'MANUAL',
    dateRange?: { start: Date; end: Date },
    limit = 100,
    offset = 0
  ) {
    return this.subscriptionRepo.getSubscriptionInvoices(
      subscriptionId,
      tenantId,
      sellerId,
      status,
      provider,
      dateRange,
      limit,
      offset
    );
  }

  async getOverdueInvoices(tenantId?: string, days = 30) {
    return this.subscriptionRepo.getOverdueInvoices(tenantId, days);
  }

  async markInvoiceAsPaid(id: string, paymentMethod: string, transactionId: string) {
    console.log(`🧾 Marking invoice as paid: ${id}`);
    
    try {
      const invoice = await this.subscriptionRepo.markInvoiceAsPaid(id, paymentMethod, transactionId);
      console.log(`✅ Invoice marked as paid: ${id}`);
      return invoice;
    } catch (error: any) {
      console.error(`❌ Error marking invoice as paid:`, error.message);
      throw error;
    }
  }

  async updateSubscriptionInvoice(
    id: string,
    data: {
      status?: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'REFUNDED';
      paidAt?: Date;
      paymentMethod?: string;
      transactionId?: string;
      providerId?: string;
      providerUrl?: string;
      metadata?: Record<string, any>;
    }
  ) {
    console.log(`🧾 Updating subscription invoice: ${id}`);
    
    try {
      const invoice = await this.subscriptionRepo.updateSubscriptionInvoice(id, data);
      console.log(`✅ Subscription invoice updated: ${id}`);
      return invoice;
    } catch (error: any) {
      console.error(`❌ Error updating subscription invoice:`, error.message);
      throw error;
    }
  }

  async deleteSubscriptionInvoice(id: string) {
    console.log(`🧾 Deleting subscription invoice: ${id}`);
    
    try {
      await this.subscriptionRepo.deleteSubscriptionInvoice(id);
      console.log(`✅ Subscription invoice deleted: ${id}`);
      return { success: true };
    } catch (error: any) {
      console.error(`❌ Error deleting subscription invoice:`, error.message);
      throw error;
    }
  }

  // ===========================================
  // WEBHOOK HANDLING
  // ===========================================

  async handleWebhook(
    provider: 'STRIPE' | 'IYZICO' | 'PAYPAL' | 'MANUAL',
    payload: any,
    signature: string
  ) {
    console.log(`🔗 Handling webhook from ${provider}`);
    
    try {
      const result = await this.subscriptionPort.handleWebhook(provider, payload, signature);
      
      if (result.success) {
        console.log(`✅ Webhook handled successfully: ${result.eventId}`);
      } else {
        console.error(`❌ Webhook handling failed: ${result.error}`);
      }
      
      return result;
    } catch (error: any) {
      console.error(`❌ Error handling webhook:`, error.message);
      throw error;
    }
  }

  // ===========================================
  // ANALYTICS & REPORTING
  // ===========================================

  async getSubscriptionStats(tenantId: string, sellerId?: string) {
    return this.subscriptionRepo.getSubscriptionStats(tenantId, sellerId);
  }

  async getPlanDistribution(tenantId: string, sellerId?: string) {
    return this.subscriptionRepo.getPlanDistribution(tenantId, sellerId);
  }

  async getRevenueByPlan(
    tenantId: string,
    sellerId?: string,
    dateRange?: { start: Date; end: Date }
  ) {
    return this.subscriptionRepo.getRevenueByPlan(tenantId, sellerId, dateRange);
  }

  async getChurnRate(tenantId: string, sellerId?: string, months = 12) {
    return this.subscriptionRepo.getChurnRate(tenantId, sellerId, months);
  }

  // ===========================================
  // BULK OPERATIONS
  // ===========================================

  async bulkUpdateSubscriptions(
    updates: Array<{
      id: string;
      status?: 'ACTIVE' | 'INACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELLED' | 'UNPAID' | 'SUSPENDED';
      nextBillingDate?: Date;
      lastPaymentDate?: Date;
      failedPayments?: number;
    }>
  ) {
    console.log(`💳 Bulk updating ${updates.length} subscriptions`);
    
    try {
      const result = await this.subscriptionRepo.bulkUpdateSubscriptions(updates);
      console.log(`✅ Bulk subscription update completed`);
      return result;
    } catch (error: any) {
      console.error(`❌ Error bulk updating subscriptions:`, error.message);
      throw error;
    }
  }

  async bulkCreateInvoices(invoices: Array<{
    subscriptionId: string;
    tenantId: string;
    sellerId?: string;
    invoiceNumber: string;
    amount: number;
    currency?: string;
    taxAmount?: number;
    totalAmount: number;
    periodStart: Date;
    periodEnd: Date;
    provider: 'STRIPE' | 'IYZICO' | 'PAYPAL' | 'MANUAL';
    dueDate: Date;
    metadata?: Record<string, any>;
  }>) {
    console.log(`🧾 Bulk creating ${invoices.length} invoices`);
    
    try {
      const result = await this.subscriptionRepo.bulkCreateInvoices(invoices);
      console.log(`✅ Bulk invoice creation completed`);
      return result;
    } catch (error: any) {
      console.error(`❌ Error bulk creating invoices:`, error.message);
      throw error;
    }
  }

  // ===========================================
  // HEALTH CHECKS
  // ===========================================

  async healthCheck() {
    try {
      // Check if we can access the database
      await this.subscriptionRepo.getSubscriptionPlans('test', undefined, undefined, undefined, 1);
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          subscriptions: 'ok',
          externalProvider: 'ok',
        },
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        services: {
          subscriptions: 'error',
          externalProvider: 'error',
        },
      };
    }
  }
}

