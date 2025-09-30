// Payment Domain Port
export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerId: string;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'digital_wallet';
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  message?: string;
  redirectUrl?: string;
  paymentUrl?: string;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
}

export interface PaymentStatus {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutSession {
  sessionId: string;
  paymentUrl: string;
  expiresAt: Date;
}

// Payment Port Interface
export interface PaymentPort {
  // Create checkout session
  createCheckoutSession(request: PaymentRequest): Promise<CheckoutSession>;
  
  // Capture payment
  capturePayment(transactionId: string): Promise<PaymentResult>;
  
  // Process payment
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
  
  // Refund payment
  refundPayment(transactionId: string, amount?: number): Promise<RefundResult>;
  
  // Get payment status
  getPaymentStatus(transactionId: string): Promise<PaymentStatus>;
  
  // Verify webhook
  verifyWebhook(payload: any, signature: string): Promise<boolean>;
}



