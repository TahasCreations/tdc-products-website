import { PaymentProvider, CreateSubscriptionData, UpdateSubscriptionData, ProviderSubscriptionResult, ProviderCancelResult, CreateCustomerData, ProviderCustomerResult, PaymentMethodData, ProviderPaymentMethodResult, WebhookEvent } from '../../types/subscription.types.js';

export class IyzicoAdapter implements PaymentProvider {
  name = 'iyzico';
  private iyzico: any;
  private apiKey: string;
  private secretKey: string;
  private baseUrl: string;

  constructor(iyzico: any, apiKey: string, secretKey: string, baseUrl: string) {
    this.iyzico = iyzico;
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.baseUrl = baseUrl;
  }

  async createSubscription(data: CreateSubscriptionData): Promise<ProviderSubscriptionResult> {
    try {
      // Create or get customer
      let customerId = data.customerId;
      if (!customerId) {
        const customerResult = await this.createCustomer({
          tenantId: data.tenantId,
          email: `tenant-${data.tenantId}@example.com`,
          name: `Tenant ${data.tenantId}`
        });
        
        if (!customerResult.success) {
          throw new Error(customerResult.error);
        }
        
        customerId = customerResult.customerId;
      }

      // Create subscription using Iyzico's recurring payment
      const subscriptionData = {
        locale: 'tr',
        conversationId: `sub_${data.tenantId}_${Date.now()}`,
        price: (data.price / 100).toFixed(2), // Convert cents to currency
        paidPrice: (data.price / 100).toFixed(2),
        currency: data.currency,
        installment: 1,
        paymentChannel: 'WEB',
        paymentGroup: 'SUBSCRIPTION',
        callbackUrl: `${this.baseUrl}/api/webhooks/iyzico`,
        enabledInstallments: [1],
        buyer: {
          id: customerId,
          name: `Tenant ${data.tenantId}`,
          surname: 'User',
          email: `tenant-${data.tenantId}@example.com`,
          identityNumber: '11111111111',
          city: 'Istanbul',
          country: 'Turkey',
          zipCode: '34000',
          registrationAddress: 'Istanbul',
          ip: '127.0.0.1'
        },
        billingAddress: {
          contactName: `Tenant ${data.tenantId}`,
          city: 'Istanbul',
          country: 'Turkey',
          address: 'Istanbul'
        },
        shippingAddress: {
          contactName: `Tenant ${data.tenantId}`,
          city: 'Istanbul',
          country: 'Turkey',
          address: 'Istanbul'
        },
        items: [{
          id: data.planId,
          name: data.planId,
          category1: 'Subscription',
          itemType: 'VIRTUAL',
          price: (data.price / 100).toFixed(2)
        }]
      };

      const checkoutForm = await this.iyzico.checkoutFormInitialize.create(subscriptionData);

      return {
        success: true,
        subscriptionId: checkoutForm.token,
        customerId: customerId,
        status: 'INCOMPLETE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + (data.billingCycle === 'MONTHLY' ? 30 : 365) * 24 * 60 * 60 * 1000),
        providerData: checkoutForm
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
      // Iyzico doesn't have direct subscription cancellation
      // This would typically involve canceling future payments
      const cancelData = {
        locale: 'tr',
        conversationId: `cancel_${subscriptionId}_${Date.now()}`,
        paymentId: subscriptionId
      };

      const result = await this.iyzico.cancel.create(cancelData);

      return {
        success: result.status === 'success',
        canceledAt: new Date(),
        cancelAtPeriodEnd: true,
        error: result.status !== 'success' ? result.errorMessage : undefined
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
      // Iyzico doesn't support subscription updates directly
      // This would typically involve creating a new subscription
      return {
        success: false,
        subscriptionId: subscriptionId,
        customerId: '',
        status: 'INCOMPLETE' as any,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        error: 'Iyzico does not support subscription updates'
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
      const retrieveData = {
        locale: 'tr',
        conversationId: `retrieve_${subscriptionId}_${Date.now()}`,
        paymentId: subscriptionId
      };

      const result = await this.iyzico.payment.retrieve(retrieveData);

      return {
        success: result.status === 'success',
        subscriptionId: subscriptionId,
        customerId: result.buyerId || '',
        status: this.mapIyzicoStatus(result.paymentStatus),
        currentPeriodStart: new Date(result.createdDate),
        currentPeriodEnd: new Date(result.createdDate),
        providerData: result
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
      // Iyzico doesn't have a separate customer creation API
      // We'll use a combination of buyer ID and email
      const customerId = `iyzico_${data.tenantId}_${Date.now()}`;

      return {
        success: true,
        customerId: customerId,
        providerData: {
          id: customerId,
          email: data.email,
          name: data.name,
          tenantId: data.tenantId
        }
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
      // Iyzico handles payment methods through checkout forms
      // This is a simplified implementation
      const paymentMethodId = `iyzico_pm_${customerId}_${Date.now()}`;

      return {
        success: true,
        paymentMethodId: paymentMethodId,
        providerData: {
          id: paymentMethodId,
          customerId: customerId,
          type: data.type
        }
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
      // Iyzico webhook verification
      const isValid = this.iyzico.webhook.verify(payload, signature);
      
      if (!isValid) {
        throw new Error('Invalid webhook signature');
      }

      const event = JSON.parse(payload);
      
      return {
        type: event.eventType,
        subscriptionId: event.paymentId,
        customerId: event.buyerId,
        data: event,
        timestamp: new Date(event.createdDate)
      };
    } catch (error: any) {
      throw new Error(`Webhook verification failed: ${error.message}`);
    }
  }

  private mapIyzicoStatus(status: string): any {
    const statusMap: Record<string, string> = {
      'SUCCESS': 'ACTIVE',
      'FAILURE': 'UNPAID',
      'INIT_THREEDS': 'INCOMPLETE',
      'CALLBACK_THREEDS': 'INCOMPLETE',
      'BKM': 'INCOMPLETE'
    };
    
    return statusMap[status] || 'INCOMPLETE';
  }
}

