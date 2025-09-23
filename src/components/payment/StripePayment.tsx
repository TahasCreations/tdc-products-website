'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCardIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

interface StripePaymentProps {
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
    Stripe?: any;
  }
}

export default function StripePayment({ 
  amount, 
  currency, 
  onSuccess, 
  onError, 
  customerInfo 
}: StripePaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isStripeLoaded, setIsStripeLoaded] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [cardElement, setCardElement] = useState<any>(null);
  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    // Stripe SDK'yı yükle
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    
    script.onload = () => {
      if (window.Stripe) {
        const stripeInstance = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        setStripe(stripeInstance);
        setIsStripeLoaded(true);
      }
    };
    
    script.onerror = () => {
      setStripeError('Stripe yüklenemedi');
    };
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isStripeLoaded && stripe) {
      // Stripe Elements oluştur
      const elements = stripe.elements();
      const cardElementInstance = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
        },
      });
      
      cardElementInstance.mount('#card-element');
      setCardElement(cardElementInstance);
      
      // Hata dinleyicisi
      cardElementInstance.on('change', ({ error }: any) => {
        if (error) {
          setStripeError(error.message);
        } else {
          setStripeError(null);
        }
      });
    }
  }, [isStripeLoaded, stripe]);

  const handlePayment = async () => {
    if (!stripe || !cardElement) {
      onError(new Error('Stripe yüklenemedi'));
      return;
    }

    setIsLoading(true);
    
    try {
      // Payment Intent oluştur
      const response = await fetch('/api/payments/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Stripe kuruş cinsinden ister
          currency: currency.toLowerCase(),
          customerInfo
        }),
      });

      const { clientSecret } = await response.json();

      // Ödeme işlemini onayla
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
          },
        },
      });

      if (error) {
        onError(error);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess({
          method: 'stripe',
          transactionId: paymentIntent.id,
          amount,
          currency,
          paymentIntent
        });
      }
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectPayment = async () => {
    setIsLoading(true);
    
    try {
      // Stripe Direct Payment API
      const response = await fetch('/api/payments/stripe', {
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
          method: 'stripe',
          transactionId: result.transactionId,
          amount,
          currency
        });
      } else {
        onError(new Error(result.error || 'Stripe ödeme işlemi başarısız'));
      }
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (stripeError && !isStripeLoaded) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          <span className="text-lg font-semibold text-red-600">Stripe Hatası</span>
        </div>
        <p className="text-red-600 mb-4">{stripeError}</p>
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
              <span>Stripe ile Öde</span>
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
          src="/images/stripe-logo.png" 
          alt="Stripe" 
          className="h-8"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="text-lg font-semibold text-gray-900">Stripe ile Ödeme</span>
        <LockClosedIcon className="w-5 h-5 text-green-600" />
      </div>

      <div className="space-y-4">
        {/* Kart Bilgileri */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kart Bilgileri *
          </label>
          <div 
            id="card-element" 
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {!isStripeLoaded && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Stripe yükleniyor...</span>
              </div>
            )}
          </div>
          {stripeError && (
            <p className="mt-2 text-sm text-red-600">{stripeError}</p>
          )}
        </div>

        {/* Ödeme Butonu */}
        <button
          onClick={handlePayment}
          disabled={isLoading || !isStripeLoaded || !!stripeError}
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
              <span>{amount.toFixed(2)} {currency} Öde</span>
            </>
          )}
        </button>

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
              <span>Stripe Direct Payment</span>
            </>
          )}
        </button>

        {/* Güvenlik Bilgisi */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <LockClosedIcon className="w-4 h-4 text-green-600" />
          <span>256-bit SSL şifreleme ile güvenli ödeme</span>
        </div>

        {/* Stripe Avantajları */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Stripe Avantajları</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Dünya çapında güvenilir ödeme</li>
            <li>• 135+ para birimi desteği</li>
            <li>• Gelişmiş güvenlik</li>
            <li>• Anlık ödeme onayı</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
