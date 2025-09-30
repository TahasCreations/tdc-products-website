/**
 * Subscription Repository - Data access layer for subscription management
 * Handles CRUD operations for subscriptions, plans, and invoices
 */

import { PrismaClient } from '@prisma/client';

export class SubscriptionRepository {
  constructor(private prisma: PrismaClient) {}

  // ===========================================
  // SUBSCRIPTION PLANS
  // ===========================================

  async createSubscriptionPlan(data: {
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
    return this.prisma.subscriptionPlan.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        description: data.description,
        planType: data.planType,
        isActive: data.isActive ?? true,
        isDefault: data.isDefault ?? false,
        amount: data.amount,
        currency: data.currency || 'TRY',
        billingCycle: data.billingCycle,
        features: data.features || [],
        limits: data.limits,
        maxProducts: data.maxProducts,
        maxOrders: data.maxOrders,
        maxStorage: data.maxStorage,
        maxUsers: data.maxUsers,
        trialDays: data.trialDays,
        trialFeatures: data.trialFeatures || [],
        status: data.status || 'ACTIVE',
        sortOrder: data.sortOrder || 0,
        metadata: data.metadata,
      },
    });
  }

  async getSubscriptionPlan(id: string) {
    return this.prisma.subscriptionPlan.findUnique({
      where: { id },
    });
  }

  async getSubscriptionPlans(
    tenantId: string,
    planType?: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE' | 'CUSTOM',
    isActive?: boolean,
    status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED',
    limit = 100,
    offset = 0
  ) {
    return this.prisma.subscriptionPlan.findMany({
      where: {
        tenantId,
        ...(planType && { planType }),
        ...(isActive !== undefined && { isActive }),
        ...(status && { status }),
      },
      orderBy: { sortOrder: 'asc' },
      take: limit,
      skip: offset,
    });
  }

  async getDefaultSubscriptionPlan(tenantId: string) {
    return this.prisma.subscriptionPlan.findFirst({
      where: {
        tenantId,
        isDefault: true,
        isActive: true,
        status: 'ACTIVE',
      },
    });
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
    return this.prisma.subscriptionPlan.update({
      where: { id },
      data,
    });
  }

  async deleteSubscriptionPlan(id: string) {
    return this.prisma.subscriptionPlan.delete({
      where: { id },
    });
  }

  // ===========================================
  // SUBSCRIPTIONS
  // ===========================================

  async createSubscription(data: {
    tenantId: string;
    sellerId?: string;
    planId: string;
    planName: string;
    planType: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE' | 'CUSTOM';
    status?: 'ACTIVE' | 'INACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELLED' | 'UNPAID' | 'SUSPENDED';
    billingCycle: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    amount: number;
    currency?: string;
    startDate: Date;
    endDate?: Date;
    trialEndDate?: Date;
    nextBillingDate?: Date;
    provider: 'STRIPE' | 'IYZICO' | 'PAYPAL' | 'MANUAL';
    providerId: string;
    providerData?: Record<string, any>;
    features?: string[];
    limits?: Record<string, any>;
    lastPaymentDate?: Date;
    lastPaymentAmount?: number;
    failedPayments?: number;
    cancellationReason?: string;
    metadata?: Record<string, any>;
  }) {
    return this.prisma.subscription.create({
      data: {
        tenantId: data.tenantId,
        sellerId: data.sellerId || null,
        planId: data.planId,
        planName: data.planName,
        planType: data.planType,
        status: data.status || 'ACTIVE',
        billingCycle: data.billingCycle,
        amount: data.amount,
        currency: data.currency || 'TRY',
        startDate: data.startDate,
        endDate: data.endDate,
        trialEndDate: data.trialEndDate,
        nextBillingDate: data.nextBillingDate,
        provider: data.provider,
        providerId: data.providerId,
        providerData: data.providerData,
        features: data.features || [],
        limits: data.limits,
        lastPaymentDate: data.lastPaymentDate,
        lastPaymentAmount: data.lastPaymentAmount,
        failedPayments: data.failedPayments || 0,
        cancellationReason: data.cancellationReason,
        metadata: data.metadata,
      },
    });
  }

  async getSubscription(id: string) {
    return this.prisma.subscription.findUnique({
      where: { id },
      include: {
        plan: true,
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
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
    return this.prisma.subscription.findMany({
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        ...(status && { status }),
        ...(planType && { planType }),
        ...(provider && { provider }),
      },
      include: {
        plan: true,
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getSubscriptionByProviderId(providerId: string, provider: 'STRIPE' | 'IYZICO' | 'PAYPAL' | 'MANUAL') {
    return this.prisma.subscription.findFirst({
      where: {
        providerId,
        provider,
      },
      include: {
        plan: true,
      },
    });
  }

  async getActiveSubscriptions(
    tenantId: string,
    sellerId?: string,
    planType?: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE' | 'CUSTOM'
  ) {
    return this.prisma.subscription.findMany({
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        status: 'ACTIVE',
        ...(planType && { planType }),
      },
      include: {
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTrialSubscriptions(tenantId: string, sellerId?: string) {
    return this.prisma.subscription.findMany({
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        status: 'TRIALING',
        trialEndDate: {
          gte: new Date(),
        },
      },
      include: {
        plan: true,
      },
      orderBy: { trialEndDate: 'asc' },
    });
  }

  async getExpiringSubscriptions(tenantId: string, days = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.prisma.subscription.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        nextBillingDate: {
          lte: futureDate,
        },
      },
      include: {
        plan: true,
      },
      orderBy: { nextBillingDate: 'asc' },
    });
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
    return this.prisma.subscription.update({
      where: { id },
      data,
    });
  }

  async cancelSubscription(id: string, reason?: string) {
    return this.prisma.subscription.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason,
        endDate: new Date(),
      },
    });
  }

  async deleteSubscription(id: string) {
    return this.prisma.subscription.delete({
      where: { id },
    });
  }

  // ===========================================
  // SUBSCRIPTION INVOICES
  // ===========================================

  async createSubscriptionInvoice(data: {
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
    return this.prisma.subscriptionInvoice.create({
      data: {
        subscriptionId: data.subscriptionId,
        tenantId: data.tenantId,
        sellerId: data.sellerId || null,
        invoiceNumber: data.invoiceNumber,
        amount: data.amount,
        currency: data.currency || 'TRY',
        taxAmount: data.taxAmount || 0,
        totalAmount: data.totalAmount,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        provider: data.provider,
        providerId: data.providerId,
        providerUrl: data.providerUrl,
        status: data.status || 'PENDING',
        dueDate: data.dueDate,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        metadata: data.metadata,
      },
    });
  }

  async getSubscriptionInvoice(id: string) {
    return this.prisma.subscriptionInvoice.findUnique({
      where: { id },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });
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
    return this.prisma.subscriptionInvoice.findMany({
      where: {
        ...(subscriptionId && { subscriptionId }),
        ...(tenantId && { tenantId }),
        ...(sellerId && { sellerId }),
        ...(status && { status }),
        ...(provider && { provider }),
        ...(dateRange && {
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        }),
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getOverdueInvoices(tenantId?: string, days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.prisma.subscriptionInvoice.findMany({
      where: {
        ...(tenantId && { tenantId }),
        status: 'OVERDUE',
        dueDate: {
          lte: cutoffDate,
        },
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
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
    return this.prisma.subscriptionInvoice.update({
      where: { id },
      data,
    });
  }

  async markInvoiceAsPaid(id: string, paymentMethod: string, transactionId: string) {
    return this.prisma.subscriptionInvoice.update({
      where: { id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        paymentMethod,
        transactionId,
      },
    });
  }

  async deleteSubscriptionInvoice(id: string) {
    return this.prisma.subscriptionInvoice.delete({
      where: { id },
    });
  }

  // ===========================================
  // ANALYTICS & REPORTING
  // ===========================================

  async getSubscriptionStats(tenantId: string, sellerId?: string) {
    const [totalSubscriptions, activeSubscriptions, trialSubscriptions, cancelledSubscriptions] = await Promise.all([
      this.prisma.subscription.count({
        where: {
          tenantId,
          ...(sellerId && { sellerId }),
        },
      }),
      this.prisma.subscription.count({
        where: {
          tenantId,
          ...(sellerId && { sellerId }),
          status: 'ACTIVE',
        },
      }),
      this.prisma.subscription.count({
        where: {
          tenantId,
          ...(sellerId && { sellerId }),
          status: 'TRIALING',
        },
      }),
      this.prisma.subscription.count({
        where: {
          tenantId,
          ...(sellerId && { sellerId }),
          status: 'CANCELLED',
        },
      }),
    ]);

    const totalRevenue = await this.prisma.subscriptionInvoice.aggregate({
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        status: 'PAID',
      },
      _sum: {
        totalAmount: true,
      },
    });

    const monthlyRevenue = await this.prisma.subscriptionInvoice.aggregate({
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        status: 'PAID',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    return {
      totalSubscriptions,
      activeSubscriptions,
      trialSubscriptions,
      cancelledSubscriptions,
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
      monthlyRevenue: Number(monthlyRevenue._sum.totalAmount || 0),
    };
  }

  async getPlanDistribution(tenantId: string, sellerId?: string) {
    const distribution = await this.prisma.subscription.groupBy({
      by: ['planType'],
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        status: 'ACTIVE',
      },
      _count: {
        id: true,
      },
    });

    return distribution.map(item => ({
      planType: item.planType,
      count: item._count.id,
    }));
  }

  async getRevenueByPlan(tenantId: string, sellerId?: string, dateRange?: { start: Date; end: Date }) {
    const revenue = await this.prisma.subscriptionInvoice.groupBy({
      by: ['subscriptionId'],
      where: {
        tenantId,
        ...(sellerId && { sellerId }),
        status: 'PAID',
        ...(dateRange && {
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        }),
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Get subscription details for each revenue entry
    const subscriptionIds = revenue.map(r => r.subscriptionId);
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        id: { in: subscriptionIds },
      },
      select: {
        id: true,
        planType: true,
        planName: true,
      },
    });

    const subscriptionMap = new Map(subscriptions.map(s => [s.id, s]));

    return revenue.map(item => {
      const subscription = subscriptionMap.get(item.subscriptionId);
      return {
        planType: subscription?.planType || 'UNKNOWN',
        planName: subscription?.planName || 'Unknown Plan',
        revenue: Number(item._sum.totalAmount || 0),
      };
    });
  }

  async getChurnRate(tenantId: string, sellerId?: string, months = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const [cancelledThisPeriod, activeAtStart] = await Promise.all([
      this.prisma.subscription.count({
        where: {
          tenantId,
          ...(sellerId && { sellerId }),
          status: 'CANCELLED',
          createdAt: {
            gte: startDate,
          },
        },
      }),
      this.prisma.subscription.count({
        where: {
          tenantId,
          ...(sellerId && { sellerId }),
          status: 'ACTIVE',
          createdAt: {
            lte: startDate,
          },
        },
      }),
    ]);

    return activeAtStart > 0 ? (cancelledThisPeriod / activeAtStart) * 100 : 0;
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
    return this.prisma.$transaction(
      updates.map(update =>
        this.prisma.subscription.update({
          where: { id: update.id },
          data: {
            status: update.status,
            nextBillingDate: update.nextBillingDate,
            lastPaymentDate: update.lastPaymentDate,
            failedPayments: update.failedPayments,
          },
        })
      )
    );
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
    return this.prisma.subscriptionInvoice.createMany({
      data: invoices.map(invoice => ({
        subscriptionId: invoice.subscriptionId,
        tenantId: invoice.tenantId,
        sellerId: invoice.sellerId || null,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.amount,
        currency: invoice.currency || 'TRY',
        taxAmount: invoice.taxAmount || 0,
        totalAmount: invoice.totalAmount,
        periodStart: invoice.periodStart,
        periodEnd: invoice.periodEnd,
        provider: invoice.provider,
        dueDate: invoice.dueDate,
        metadata: invoice.metadata,
      })),
    });
  }
}

