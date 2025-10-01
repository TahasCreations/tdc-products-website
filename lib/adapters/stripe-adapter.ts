// Stripe Payment Adapter
import Stripe from 'stripe';
import { PaymentPort, PaymentOptions, PaymentResult, RefundOptions, RefundResult, PaymentMethod } from '../ports/PaymentPort';

export class StripeAdapter implements PaymentPort {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
      apiVersion: '2025-09-30.clover',
    });
  }

  async createPaymentIntent(options: PaymentOptions): Promise<any> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(options.amount * 100), // Convert to cents
        currency: options.currency.toLowerCase(),
        metadata: {
          orderId: options.orderId,
          storeId: options.storeId || '',
          ...options.metadata,
        },
        customer: options.customerId,
        payment_method: options.paymentMethodId,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: options.amount,
        currency: options.currency,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error('Stripe payment intent creation error:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId?: string): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      return {
        id: paymentIntent.id,
        status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'failed',
        transactionId: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message,
        metadata: {
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        },
      };
    } catch (error) {
      console.error('Stripe payment confirmation error:', error);
      return {
        id: paymentIntentId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Payment confirmation failed',
      };
    }
  }

  async capturePayment(paymentIntentId: string, amount?: number): Promise<PaymentResult> {
    try {
      const captureOptions: any = {};
      if (amount) {
        captureOptions.amount_to_capture = Math.round(amount * 100);
      }

      const paymentIntent = await this.stripe.paymentIntents.capture(paymentIntentId, captureOptions);

      return {
        id: paymentIntent.id,
        status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'failed',
        transactionId: paymentIntent.id,
        metadata: {
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        },
      };
    } catch (error) {
      console.error('Stripe payment capture error:', error);
      return {
        id: paymentIntentId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Payment capture failed',
      };
    }
  }

  async refundPayment(options: RefundOptions): Promise<RefundResult> {
    try {
      const refundOptions: any = {
        payment_intent: options.paymentId,
        metadata: options.metadata,
      };

      if (options.amount) {
        refundOptions.amount = Math.round(options.amount * 100);
      }

      if (options.reason) {
        refundOptions.reason = options.reason as any;
      }

      const refund = await this.stripe.refunds.create(refundOptions);

      return {
        id: refund.id,
        status: refund.status === 'succeeded' ? 'succeeded' : 'failed',
        amount: refund.amount / 100, // Convert from cents
        error: refund.failure_reason,
      };
    } catch (error) {
      console.error('Stripe refund error:', error);
      return {
        id: `refund_${Date.now()}`,
        status: 'failed',
        amount: options.amount || 0,
        error: error instanceof Error ? error.message : 'Refund failed',
      };
    }
  }

  async getPayment(paymentId: string): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);

      return {
        id: paymentIntent.id,
        status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'failed',
        transactionId: paymentIntent.id,
        metadata: {
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        },
      };
    } catch (error) {
      console.error('Stripe payment retrieval error:', error);
      throw new Error('Failed to retrieve payment');
    }
  }

  async listPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      return paymentMethods.data.map(pm => ({
        id: pm.id,
        type: 'card',
        last4: pm.card?.last4,
        brand: pm.card?.brand,
        expMonth: pm.card?.exp_month,
        expYear: pm.card?.exp_year,
      }));
    } catch (error) {
      console.error('Stripe payment methods list error:', error);
      return [];
    }
  }

  async createCustomer(email: string, name?: string): Promise<string> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
      });

      return customer.id;
    } catch (error) {
      console.error('Stripe customer creation error:', error);
      throw new Error('Failed to create customer');
    }
  }

  async updateCustomer(customerId: string, data: any): Promise<void> {
    try {
      await this.stripe.customers.update(customerId, data);
    } catch (error) {
      console.error('Stripe customer update error:', error);
      throw new Error('Failed to update customer');
    }
  }
}
