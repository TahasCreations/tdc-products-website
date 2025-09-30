import { PaymentPort, PaymentRequest, PaymentResult, RefundResult, PaymentStatus } from '../../../domain/ports/payment.port'

export class PayTRAdapter implements PaymentPort {
  private readonly apiUrl: string
  private readonly merchantId: string
  private readonly merchantKey: string
  private readonly merchantSalt: string

  constructor(
    apiUrl: string,
    merchantId: string,
    merchantKey: string,
    merchantSalt: string
  ) {
    this.apiUrl = apiUrl
    this.merchantId = merchantId
    this.merchantKey = merchantKey
    this.merchantSalt = merchantSalt
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      // PayTR API integration
      const paytrRequest = {
        merchant_id: this.merchantId,
        user_ip: request.metadata?.userIp || '127.0.0.1',
        merchant_oid: request.orderId,
        email: request.metadata?.email,
        payment_amount: Math.round(request.amount * 100), // Convert to kuruş
        paytr_token: this.generatePayTRToken(request),
        user_basket: request.metadata?.basket || '[]',
        debug_on: process.env.NODE_ENV === 'development' ? 1 : 0,
        no_installment: 0,
        max_installment: 0,
        user_name: request.metadata?.userName,
        user_address: request.metadata?.userAddress,
        user_phone: request.metadata?.userPhone,
        merchant_ok_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        merchant_fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/fail`,
        timeout_limit: 30,
        currency: request.currency === 'TRY' ? 'TL' : request.currency
      }

      const response = await fetch(`${this.apiUrl}/odeme/api/get-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(paytrRequest)
      })

      const result = await response.json()

      if (result.status === 'success') {
        return {
          success: true,
          transactionId: result.token,
          status: 'pending',
          redirectUrl: result.paytr_token_url
        }
      } else {
        return {
          success: false,
          transactionId: '',
          status: 'failed',
          message: result.reason || 'Payment failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        status: 'failed',
        message: 'Payment service unavailable'
      }
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<RefundResult> {
    // PayTR refund implementation
    return {
      success: false,
      refundId: '',
      amount: amount || 0,
      status: 'failed'
    }
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    // PayTR status check implementation
    return {
      transactionId,
      status: 'pending',
      amount: 0,
      currency: 'TRY',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async verifyWebhook(payload: any, signature: string): Promise<boolean> {
    // PayTR webhook verification
    return true
  }

  private generatePayTRToken(request: PaymentRequest): string {
    // PayTR token generation logic
    const hashString = `${this.merchantId}${request.orderId}${request.customerId}${Math.round(request.amount * 100)}${this.merchantSalt}`
    // Implement actual hash generation
    return Buffer.from(hashString).toString('base64')
  }
}



