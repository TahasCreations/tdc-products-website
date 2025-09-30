// Payment Domain Port - Interface tanımı
export interface PaymentRequest {
  amount: number
  currency: string
  orderId: string
  customerId: string
  paymentMethod: 'credit_card' | 'bank_transfer' | 'digital_wallet'
  metadata?: Record<string, any>
}

export interface PaymentResult {
  success: boolean
  transactionId: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  message?: string
  redirectUrl?: string
}

export interface RefundResult {
  success: boolean
  refundId: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
}

export interface PaymentStatus {
  transactionId: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  amount: number
  currency: string
  createdAt: Date
  updatedAt: Date
}

// Port Interface - Payment işlemleri için
export interface PaymentPort {
  processPayment(request: PaymentRequest): Promise<PaymentResult>
  refundPayment(transactionId: string, amount?: number): Promise<RefundResult>
  getPaymentStatus(transactionId: string): Promise<PaymentStatus>
  verifyWebhook(payload: any, signature: string): Promise<boolean>
}



