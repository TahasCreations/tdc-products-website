// Payment Port Interface
export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'digital_wallet';
  last4?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
}

export interface PaymentOptions {
  amount: number;
  currency: string;
  orderId: string;
  customerId?: string;
  paymentMethodId?: string;
  metadata?: Record<string, string>;
  storeId?: string;
}

export interface PaymentResult {
  id: string;
  status: 'succeeded' | 'failed' | 'pending';
  transactionId?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface RefundOptions {
  paymentId: string;
  amount?: number;
  reason?: string;
  metadata?: Record<string, string>;
}

export interface RefundResult {
  id: string;
  status: 'succeeded' | 'failed' | 'pending';
  amount: number;
  error?: string;
}

export interface PaymentPort {
  createPaymentIntent(options: PaymentOptions): Promise<PaymentIntent>;
  confirmPayment(paymentIntentId: string, paymentMethodId?: string): Promise<PaymentResult>;
  capturePayment(paymentIntentId: string, amount?: number): Promise<PaymentResult>;
  refundPayment(options: RefundOptions): Promise<RefundResult>;
  getPayment(paymentId: string): Promise<PaymentResult>;
  listPaymentMethods(customerId: string): Promise<PaymentMethod[]>;
  createCustomer(email: string, name?: string): Promise<string>;
  updateCustomer(customerId: string, data: any): Promise<void>;
}
