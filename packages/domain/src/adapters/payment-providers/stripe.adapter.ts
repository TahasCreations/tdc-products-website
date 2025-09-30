import { PaymentProvider, CreateSubscriptionData, UpdateSubscriptionData, ProviderSubscriptionResult, ProviderCancelResult, CreateCustomerData, ProviderCustomerResult, PaymentMethodData, ProviderPaymentMethodResult, WebhookEvent } from '../../types/subscription.types.js';

export class StripeAdapter implements PaymentProvider {
  name = 'stripe';
  private stripe: any;
  private webhookSecret: string;

  constructor(stripe: any, webhookSecret: string) {
    this.stripe = stripe;
    this.webhookSecret = webhookSecret;
  }

  async createSubscription(data: CreateSubscriptionData): Promise<ProviderSubscriptionResult> {
    try {
      // Create or get customer
      let customerId = data.customerId;
      if (!customerId) {
        const customer = await this.stripe.customers.create({
          metadata: {
            tenantId: data.tenantId
          }
        });
        customerId = customer.id;
      }

      // Create subscription
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price_data: {
            currency: data.currency.toLowerCase(),
            product_data: {
              name: data.planId,
            },
            unit_amount: data.price,
            recurring: {
              interval: data.billingCycle === 'MONTHLY' ? 'month' : 'year'
            }
          }
        }],
        trial_period_days: data.trialDays,
        metadata: {
          tenantId: data.tenantId,
          planId: data.planId
        }
      });

      return {
        success: true,
        subscriptionId: subscription.id,
        customerId: customerId,
        status: this.mapStripeStatus(subscription.status),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
        providerData: subscription
      };
    } catch (error: any) {
      return {
        success: false,
        subscriptionId: '',
        customerId: '',
        status: 'INCOMPLETE' as any,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        error: error.message
      };
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<ProviderCancelResult> {
    try {
      const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
      
      return {
        success: true,
        canceledAt: new Date(subscription.canceled_at * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      };
    } catch (error: any) {
      return {
        success: false,
        canceledAt: new Date(),
        cancelAtPeriodEnd: false,
        error: error.message
      };
    }
  }

  async updateSubscription(subscriptionId: string, data: UpdateSubscriptionData): Promise<ProviderSubscriptionResult> {
    try {
      const updateData: any = {};
      
      if (data.status) {
        updateData.status = this.mapToStripeStatus(data.status);
      }
      
      if (data.metadata) {
        updateData.metadata = data.metadata;
      }

      const subscription = await this.stripe.subscriptions.update(subscriptionId, updateData);

      return {
        success: true,
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        status: this.mapStripeStatus(subscription.status),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
        providerData: subscription
      };
    } catch (error: any) {
      return {
        success: false,
        subscriptionId: subscriptionId,
        customerId: '',
        status: 'INCOMPLETE' as any,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        error: error.message
      };
    }
  }

  async getSubscription(subscriptionId: string): Promise<ProviderSubscriptionResult> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

      return {
        success: true,
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        status: this.mapStripeStatus(subscription.status),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
        providerData: subscription
      };
    } catch (error: any) {
      return {
        success: false,
        subscriptionId: subscriptionId,
        customerId: '',
        status: 'INCOMPLETE' as any,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        error: error.message
      };
    }
  }

  async createCustomer(data: CreateCustomerData): Promise<ProviderCustomerResult> {
    try {
      const customer = await this.stripe.customers.create({
        email: data.email,
        name: data.name,
        metadata: {
          tenantId: data.tenantId,
          ...data.metadata
        }
      });

      return {
        success: true,
        customerId: customer.id,
        providerData: customer
      };
    } catch (error: any) {
      return {
        success: false,
        customerId: '',
        error: error.message
      };
    }
  }

  async createPaymentMethod(customerId: string, data: PaymentMethodData): Promise<ProviderPaymentMethodResult> {
    try {
      let paymentMethodData: any = {};

      if (data.type === 'card' && data.card) {
        paymentMethodData = {
          type: 'card',
          card: {
            number: data.card.number,
            exp_month: data.card.expMonth,
            exp_year: data.card.expYear,
            cvc: data.card.cvc
          }
        };
      } else if (data.type === 'bank_account' && data.bankAccount) {
        paymentMethodData = {
          type: 'bank_account',
          bank_account: {
            account_number: data.bankAccount.accountNumber,
            routing_number: data.bankAccount.routingNumber,
            account_holder_name: data.bankAccount.accountHolderName
          }
        };
      }

      const paymentMethod = await this.stripe.paymentMethods.create({
        ...paymentMethodData,
        customer: customerId,
        metadata: data.metadata
      });

      return {
        success: true,
        paymentMethodId: paymentMethod.id,
        providerData: paymentMethod
      };
    } catch (error: any) {
      return {
        success: false,
        paymentMethodId: '',
        error: error.message
      };
    }
  }

  async webhookHandler(payload: any, signature: string): Promise<WebhookEvent> {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
      
      return {
        type: event.type,
        subscriptionId: event.data.object?.id,
        customerId: event.data.object?.customer,
        data: event.data.object,
        timestamp: new Date(event.created * 1000)
      };
    } catch (error: any) {
      throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
  }

  private mapStripeStatus(stripeStatus: string): any {
    const statusMap: Record<string, string> = {
      'active': 'ACTIVE',
      'trialing': 'TRIALING',
      'past_due': 'PAST_DUE',
      'canceled': 'CANCELED',
      'unpaid': 'UNPAID',
      'incomplete': 'INCOMPLETE',
      'incomplete_expired': 'INCOMPLETE_EXPIRED',
      'paused': 'PAUSED'
    };
    
    return statusMap[stripeStatus] || 'INCOMPLETE';
  }

  private mapToStripeStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'ACTIVE': 'active',
      'TRIALING': 'trialing',
      'PAST_DUE': 'past_due',
      'CANCELED': 'canceled',
      'UNPAID': 'unpaid',
      'INCOMPLETE': 'incomplete',
      'INCOMPLETE_EXPIRED': 'incomplete_expired',
      'PAUSED': 'paused'
    };
    
    return statusMap[status] || 'incomplete';
  }
}

