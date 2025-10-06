import crypto from 'crypto';

interface PayTRConfig {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: boolean;
}

interface PayTRPaymentRequest {
  merchantId: string;
  userIp: string;
  merchantOrderId: string;
  email: string;
  paymentAmount: number;
  currency: string;
  productName: string;
  productCount: number;
  userName: string;
  userAddress: string;
  userPhone: string;
  merchantOkUrl: string;
  merchantFailUrl: string;
  timeoutLimit: number;
  debugOn: number;
  noInstallment: number;
  maxInstallment: number;
  userBasket: string;
}

class PayTRService {
  private config: PayTRConfig;

  constructor() {
    this.config = {
      merchantId: process.env.PAYTR_MERCHANT_ID || '',
      merchantKey: process.env.PAYTR_MERCHANT_KEY || '',
      merchantSalt: process.env.PAYTR_MERCHANT_SALT || '',
      testMode: process.env.NODE_ENV !== 'production',
    };
  }

  private generateHash(params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    return crypto
      .createHmac('sha256', this.config.merchantKey)
      .update(sortedParams)
      .digest('base64');
  }

  createPaymentToken(paymentData: {
    orderId: string;
    amount: number;
    currency: string;
    customerEmail: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    productName: string;
    productCount: number;
    basket: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
    successUrl: string;
    failUrl: string;
    userIp: string;
  }): Promise<{
    token: string;
    iframeUrl: string;
    paymentUrl: string;
  }> {
    return new Promise((resolve, reject) => {
      const params: PayTRPaymentRequest = {
        merchantId: this.config.merchantId,
        userIp: paymentData.userIp,
        merchantOrderId: paymentData.orderId,
        email: paymentData.customerEmail,
        paymentAmount: Math.round(paymentData.amount * 100), // PayTR kuruş cinsinden ister
        currency: paymentData.currency,
        productName: paymentData.productName,
        productCount: paymentData.productCount,
        userName: paymentData.customerName,
        userAddress: paymentData.customerAddress,
        userPhone: paymentData.customerPhone,
        merchantOkUrl: paymentData.successUrl,
        merchantFailUrl: paymentData.failUrl,
        timeoutLimit: 30,
        debugOn: this.config.testMode ? 1 : 0,
        noInstallment: 0,
        maxInstallment: 12,
        userBasket: Buffer.from(JSON.stringify(paymentData.basket)).toString('base64'),
      };

      // Hash oluştur
      const hash = this.generateHash(params);
      params['paytr_token'] = hash;

      // PayTR API'sine istek gönder
      const formData = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      fetch('https://www.paytr.com/odeme/api/get-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            resolve({
              token: data.token,
              iframeUrl: `https://www.paytr.com/odeme/guvenli/${data.token}`,
              paymentUrl: `https://www.paytr.com/odeme/guvenli/${data.token}`,
            });
          } else {
            reject(new Error(data.reason || 'PayTR token oluşturulamadı'));
          }
        })
        .catch(reject);
    });
  }

  verifyCallback(data: {
    merchantOrderId: string;
    status: string;
    totalAmount: string;
    hash: string;
  }): boolean {
    const expectedHash = crypto
      .createHmac('sha256', this.config.merchantSalt)
      .update(`${data.merchantOrderId}${this.config.merchantSalt}${data.status}${data.totalAmount}`)
      .digest('base64');

    return expectedHash === data.hash;
  }

  refundPayment(transactionId: string, amount: number): Promise<{
    success: boolean;
    message: string;
    refundId?: string;
  }> {
    return new Promise((resolve, reject) => {
      const params = {
        merchantId: this.config.merchantId,
        merchantOrderId: transactionId,
        returnAmount: Math.round(amount * 100),
      };

      const hash = this.generateHash(params);
      params['paytr_token'] = hash;

      const formData = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      fetch('https://www.paytr.com/odeme/api/iade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          resolve({
            success: data.status === 'success',
            message: data.message || data.reason,
            refundId: data.refundId,
          });
        })
        .catch(reject);
    });
  }
}

export const paytrService = new PayTRService();
export default paytrService;
