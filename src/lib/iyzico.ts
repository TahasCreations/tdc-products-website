import crypto from 'crypto';

interface IyzicoConfig {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
}

interface IyzicoPaymentRequest {
  locale: string;
  conversationId: string;
  price: string;
  paidPrice: string;
  currency: string;
  installment: string;
  paymentChannel: string;
  paymentGroup: string;
  paymentCard: {
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
    registerCard: string;
  };
  buyer: {
    id: string;
    name: string;
    surname: string;
    gsmNumber: string;
    email: string;
    identityNumber: string;
    lastLoginDate: string;
    registrationDate: string;
    registrationAddress: string;
    ip: string;
    city: string;
    country: string;
    zipCode: string;
  };
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    category2: string;
    itemType: string;
    price: string;
    subMerchantKey: string;
    subMerchantPrice: string;
  }>;
}

class IyzicoService {
  private config: IyzicoConfig;

  constructor() {
    this.config = {
      apiKey: process.env.IYZICO_API_KEY || '',
      secretKey: process.env.IYZICO_SECRET_KEY || '',
      baseUrl: process.env.NODE_ENV === 'production' 
        ? 'https://api.iyzipay.com' 
        : 'https://sandbox-api.iyzipay.com',
    };
  }

  private generateAuthorizationString(requestString: string): string {
    const randomString = Math.random().toString(36).substring(2, 15);
    const dataString = `${this.config.apiKey}:${randomString}:${requestString}`;
    const hash = crypto
      .createHmac('sha256', this.config.secretKey)
      .update(dataString)
      .digest('base64');
    
    return `IYZWS ${this.config.apiKey}:${hash}`;
  }

  async createPayment(requestData: {
    conversationId: string;
    price: number;
    paidPrice: number;
    currency: string;
    installment: number;
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
    buyer: {
      id: string;
      name: string;
      surname: string;
      gsmNumber: string;
      email: string;
      identityNumber: string;
      registrationAddress: string;
      ip: string;
      city: string;
      country: string;
      zipCode: string;
    };
    shippingAddress: {
      contactName: string;
      city: string;
      country: string;
      address: string;
      zipCode: string;
    };
    billingAddress: {
      contactName: string;
      city: string;
      country: string;
      address: string;
      zipCode: string;
    };
    basketItems: Array<{
      id: string;
      name: string;
      category1: string;
      category2: string;
      itemType: string;
      price: number;
    }>;
  }): Promise<{
    success: boolean;
    paymentId?: string;
    status?: string;
    errorMessage?: string;
    htmlContent?: string;
  }> {
    try {
      const paymentRequest: IyzicoPaymentRequest = {
        locale: 'tr',
        conversationId: requestData.conversationId,
        price: requestData.price.toFixed(2),
        paidPrice: requestData.paidPrice.toFixed(2),
        currency: requestData.currency,
        installment: requestData.installment.toString(),
        paymentChannel: 'WEB',
        paymentGroup: 'PRODUCT',
        paymentCard: {
          cardHolderName: requestData.cardHolderName,
          cardNumber: requestData.cardNumber,
          expireMonth: requestData.expireMonth,
          expireYear: requestData.expireYear,
          cvc: requestData.cvc,
          registerCard: '0',
        },
        buyer: {
          id: requestData.buyer.id,
          name: requestData.buyer.name,
          surname: requestData.buyer.surname,
          gsmNumber: requestData.buyer.gsmNumber,
          email: requestData.buyer.email,
          identityNumber: requestData.buyer.identityNumber,
          lastLoginDate: new Date().toISOString(),
          registrationDate: new Date().toISOString(),
          registrationAddress: requestData.buyer.registrationAddress,
          ip: requestData.buyer.ip,
          city: requestData.buyer.city,
          country: requestData.buyer.country,
          zipCode: requestData.buyer.zipCode,
        },
        shippingAddress: requestData.shippingAddress,
        billingAddress: requestData.billingAddress,
        basketItems: requestData.basketItems.map(item => ({
          id: item.id,
          name: item.name,
          category1: item.category1,
          category2: item.category2,
          itemType: item.itemType,
          price: item.price.toFixed(2),
          subMerchantKey: '',
          subMerchantPrice: item.price.toFixed(2),
        })),
      };

      const requestString = JSON.stringify(paymentRequest);
      const authorization = this.generateAuthorizationString(requestString);

      const response = await fetch(`${this.config.baseUrl}/payment/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorization,
        },
        body: requestString,
      });

      const result = await response.json();

      return {
        success: result.status === 'success',
        paymentId: result.paymentId,
        status: result.status,
        errorMessage: result.errorMessage,
        htmlContent: result.htmlContent,
      };

    } catch (error) {
      console.error('Iyzico payment error:', error);
      return {
        success: false,
        errorMessage: 'Ödeme işlemi sırasında bir hata oluştu.',
      };
    }
  }

  async refundPayment(paymentId: string, amount: number): Promise<{
    success: boolean;
    refundId?: string;
    errorMessage?: string;
  }> {
    try {
      const refundRequest = {
        locale: 'tr',
        conversationId: `refund_${paymentId}_${Date.now()}`,
        paymentId: paymentId,
        price: amount.toFixed(2),
        ip: '127.0.0.1',
      };

      const requestString = JSON.stringify(refundRequest);
      const authorization = this.generateAuthorizationString(requestString);

      const response = await fetch(`${this.config.baseUrl}/payment/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorization,
        },
        body: requestString,
      });

      const result = await response.json();

      return {
        success: result.status === 'success',
        refundId: result.paymentId,
        errorMessage: result.errorMessage,
      };

    } catch (error) {
      console.error('Iyzico refund error:', error);
      return {
        success: false,
        errorMessage: 'İade işlemi sırasında bir hata oluştu.',
      };
    }
  }

  async getPaymentDetails(paymentId: string): Promise<{
    success: boolean;
    payment?: any;
    errorMessage?: string;
  }> {
    try {
      const request = {
        locale: 'tr',
        conversationId: `details_${paymentId}_${Date.now()}`,
        paymentId: paymentId,
      };

      const requestString = JSON.stringify(request);
      const authorization = this.generateAuthorizationString(requestString);

      const response = await fetch(`${this.config.baseUrl}/payment/detail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorization,
        },
        body: requestString,
      });

      const result = await response.json();

      return {
        success: result.status === 'success',
        payment: result,
        errorMessage: result.errorMessage,
      };

    } catch (error) {
      console.error('Iyzico payment details error:', error);
      return {
        success: false,
        errorMessage: 'Ödeme detayları alınırken bir hata oluştu.',
      };
    }
  }
}

export const iyzicoService = new IyzicoService();
export default iyzicoService;
