'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCardIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

interface PayPalPaymentProps {
  amount: number;
  currency: string;
  onSuccess: (paymentData: any) => void;
  onError: (error: any) => void;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PayPalPayment({ 
  amount, 
  currency, 
  onSuccess, 
  onError, 
  customerInfo 
}: PayPalPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPayPalLoaded, setIsPayPalLoaded] = useState(false);
  const [payPalError, setPayPalError] = useState<string | null>(null);

  useEffect(() => {
    // PayPal SDK'yı yükle
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}`;
    script.async = true;
    
    script.onload = () => {
      setIsPayPalLoaded(true);
    };
    
    script.onerror = () => {
      setPayPalError('PayPal yüklenemedi');
    };
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [currency]);

  useEffect(() => {
    if (isPayPalLoaded && window.paypal) {
      // PayPal butonunu oluştur
      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.toFixed(2),
                currency_code: currency
              }
            }],
            application_context: {
              shipping_preference: 'NO_SHIPPING'
            }
          });
        },
        
        onApprove: async (data: any, actions: any) => {
          try {
            setIsLoading(true);
            
            const order = await actions.order.capture();
            
            onSuccess({
              method: 'paypal',
              transactionId: order.id,
              amount,
              currency,
              payer: order.payer
            });
          } catch (error) {
            onError(error);
          } finally {
            setIsLoading(false);
          }
        },
        
        onError: (err: any) => {
          onError(err);
        },
        
        onCancel: () => {
          // Kullanıcı ödemeyi iptal etti
        }
      }).render('#paypal-button-container');
    }
  }, [isPayPalLoaded, amount, currency, onSuccess, onError]);

  const handleDirectPayment = async () => {
    setIsLoading(true);
    
    try {
      // PayPal Direct Payment API
      const response = await fetch('/api/payments/paypal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          customerInfo
        }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess({
          method: 'paypal',
          transactionId: result.transactionId,
          amount,
          currency
        });
      } else {
        onError(new Error(result.error || 'PayPal ödeme işlemi başarısız'));
      }
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (payPalError) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          <span className="text-lg font-semibold text-red-600">PayPal Hatası</span>
        </div>
        <p className="text-red-600 mb-4">{payPalError}</p>
        <button
          onClick={handleDirectPayment}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>İşleniyor...</span>
            </>
          ) : (
            <>
              <CreditCardIcon className="w-5 h-5" />
              <span>PayPal ile Öde</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <img 
          src="/images/paypal-logo.png" 
          alt="PayPal" 
          className="h-8"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="text-lg font-semibold text-gray-900">PayPal ile Ödeme</span>
        <LockClosedIcon className="w-5 h-5 text-green-600" />
      </div>

      <div className="space-y-4">
        {/* PayPal Buton Container */}
        <div id="paypal-button-container" className="min-h-[50px]">
          {!isPayPalLoaded && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">PayPal yükleniyor...</span>
            </div>
          )}
        </div>

        {/* Alternatif Ödeme */}
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">veya</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleDirectPayment}
          disabled={isLoading}
          className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
              <span>İşleniyor...</span>
            </>
          ) : (
            <>
              <CreditCardIcon className="w-5 h-5" />
              <span>PayPal Hesabı ile Öde</span>
            </>
          )}
        </button>

        {/* Güvenlik Bilgisi */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <LockClosedIcon className="w-4 h-4 text-green-600" />
          <span>PayPal güvenli ödeme sistemi</span>
        </div>

        {/* PayPal Avantajları */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">PayPal Avantajları</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Hızlı ve güvenli ödeme</li>
            <li>• Kart bilgilerinizi paylaşmayın</li>
            <li>• PayPal koruması</li>
            <li>• Kolay iade işlemi</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
