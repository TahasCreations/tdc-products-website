import { 
  PaymentPort, 
  PaymentRequest, 
  PaymentResult, 
  RefundResult, 
  PaymentStatus, 
  CheckoutSession 
} from '@tdc/domain';
import { env } from '@tdc/config';

export class PayTRAdapter implements PaymentPort {
  private readonly apiUrl: string;
  private readonly merchantId: string;
  private readonly merchantKey: string;
  private readonly merchantSalt: string;
  private readonly baseUrl: string;

  constructor() {
    const paymentConfig = env.getPaymentConfig();
    this.apiUrl = 'https://www.paytr.com/odeme/api';
    this.merchantId = paymentConfig.merchantId;
    this.merchantKey = paymentConfig.key;
    this.merchantSalt = paymentConfig.secret;
    this.baseUrl = env.getSiteConfig().url;
  }

  async createCheckoutSession(request: PaymentRequest): Promise<CheckoutSession> {
    try {
      const sessionId = `paytr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const paytrRequest = {
        merchant_id: this.merchantId,
        user_ip: request.metadata?.userIp || '127.0.0.1',
        merchant_oid: request.orderId,
        email: request.metadata?.email || '',
        payment_amount: Math.round(request.amount * 100), // Convert to kuruş
        paytr_token: this.generatePayTRToken(request),
        user_basket: JSON.stringify(request.metadata?.basket || []),
        debug_on: process.env.NODE_ENV === 'development' ? 1 : 0,
        no_installment: 0,
        max_installment: 0,
        user_name: request.metadata?.userName || '',
        user_address: request.metadata?.userAddress || '',
        user_phone: request.metadata?.userPhone || '',
        merchant_ok_url: `${this.baseUrl}/payment/success`,
        merchant_fail_url: `${this.baseUrl}/payment/fail`,
        timeout_limit: 30,
        currency: request.currency === 'TRY' ? 'TL' : request.currency
      };

      const response = await fetch(`${this.apiUrl}/get-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(paytrRequest)
      });

      const result = await response.json();

      if (result.status === 'success') {
        return {
          sessionId,
          paymentUrl: result.paytr_token_url,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        };
      } else {
        throw new Error(result.reason || 'Failed to create checkout session');
      }
    } catch (error) {
      throw new Error(`PayTR checkout session creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async capturePayment(transactionId: string): Promise<PaymentResult> {
    try {
      // PayTR doesn't have separate capture, payment is captured on success
      const status = await this.getPaymentStatus(transactionId);
      
      return {
        success: status.status === 'completed',
        transactionId,
        status: status.status,
        message: status.status === 'completed' ? 'Payment captured successfully' : 'Payment not completed'
      };
    } catch (error) {
      return {
        success: false,
        transactionId,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Capture failed'
      };
    }
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      const session = await this.createCheckoutSession(request);
      
      return {
        success: true,
        transactionId: session.sessionId,
        status: 'pending',
        redirectUrl: session.paymentUrl
      };
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<RefundResult> {
    try {
      // PayTR refund implementation would go here
      // This is a simplified version
      return {
        success: false,
        refundId: '',
        amount: amount || 0,
        status: 'failed'
      };
    } catch (error) {
      return {
        success: false,
        refundId: '',
        amount: amount || 0,
        status: 'failed'
      };
    }
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      // PayTR status check implementation would go here
      // This is a simplified version
      return {
        transactionId,
        status: 'pending',
        amount: 0,
        currency: 'TRY',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to get payment status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async verifyWebhook(payload: any, signature: string): Promise<boolean> {
    try {
      // PayTR webhook verification would go here
      // This is a simplified version
      return true;
    } catch (error) {
      return false;
    }
  }

  private generatePayTRToken(request: PaymentRequest): string {
    const hashString = `${this.merchantId}${request.orderId}${request.customerId}${Math.round(request.amount * 100)}${this.merchantSalt}`;
    // In real implementation, use proper hash generation
    return Buffer.from(hashString).toString('base64');
  }
}
