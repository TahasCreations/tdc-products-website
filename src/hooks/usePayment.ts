"use client";
import { useState, useCallback } from 'react';

interface PaymentMethod {
  id: string;
  name: string;
  provider: 'paytr' | 'iyzico';
  type: 'credit_card' | 'bank_transfer' | 'mobile_payment';
}

interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  productName: string;
  basket: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  successUrl: string;
  failUrl: string;
}

interface CardPaymentRequest extends PaymentRequest {
  cardHolderName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvv: string;
  installment: number;
  buyer: {
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
}

interface PaymentResult {
  success: boolean;
  paymentUrl?: string;
  iframeUrl?: string;
  token?: string;
  paymentId?: string;
  error?: string;
  errorMessage?: string;
}

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayTRPayment = useCallback(async (paymentData: PaymentRequest): Promise<PaymentResult> => {
    try {
      setIsProcessing(true);
      setError(null);

      const response = await fetch('/api/payment/paytr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'PayTR ödeme işlemi başarısız');
      }

      return {
        success: true,
        paymentUrl: result.paymentUrl,
        iframeUrl: result.iframeUrl,
        token: result.token,
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processIyzicoPayment = useCallback(async (paymentData: CardPaymentRequest): Promise<PaymentResult> => {
    try {
      setIsProcessing(true);
      setError(null);

      const response = await fetch('/api/payment/iyzico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Iyzico ödeme işlemi başarısız');
      }

      return {
        success: result.success,
        paymentId: result.paymentId,
        error: result.errorMessage,
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processPayment = useCallback(async (
    method: PaymentMethod,
    paymentData: PaymentRequest | CardPaymentRequest
  ): Promise<PaymentResult> => {
    switch (method.provider) {
      case 'paytr':
        return await processPayTRPayment(paymentData as PaymentRequest);
      
      case 'iyzico':
        return await processIyzicoPayment(paymentData as CardPaymentRequest);
      
      default:
        const errorMessage = 'Desteklenmeyen ödeme yöntemi';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
    }
  }, [processPayTRPayment, processIyzicoPayment]);

  const createOrder = useCallback(async (orderData: {
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    customerInfo: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      postalCode: string;
    };
    shippingInfo: {
      method: string;
      cost: number;
    };
    totalAmount: number;
  }): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    try {
      setIsProcessing(true);
      setError(null);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Sipariş oluşturulamadı');
      }

      return {
        success: true,
        orderId: result.orderId,
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const redirectToPayment = useCallback((paymentResult: PaymentResult) => {
    if (paymentResult.success && paymentResult.paymentUrl) {
      // PayTR için iframe veya redirect
      if (paymentResult.iframeUrl) {
        // Iframe kullanımı için
        window.open(paymentResult.iframeUrl, '_blank');
      } else if (paymentResult.paymentUrl) {
        // Direct redirect
        window.location.href = paymentResult.paymentUrl;
      }
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isProcessing,
    error,
    processPayment,
    processPayTRPayment,
    processIyzicoPayment,
    createOrder,
    redirectToPayment,
    clearError,
  };
}
