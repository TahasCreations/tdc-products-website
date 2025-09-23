'use client';

import { useState } from 'react';
import { 
  CreditCardIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

interface IyzicoPaymentProps {
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

export default function IyzicoPayment({ 
  amount, 
  currency, 
  onSuccess, 
  onError, 
  customerInfo 
}: IyzicoPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardHolderName: ''
  });
  const [installment, setInstallment] = useState(1);
  const [errors, setErrors] = useState<any>({});

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const validateCard = () => {
    const newErrors: any = {};
    
    if (!cardData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Kart numarası gerekli';
    } else if (cardData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Geçerli bir kart numarası girin';
    }
    
    if (!cardData.expiryMonth) {
      newErrors.expiryMonth = 'Ay seçin';
    }
    
    if (!cardData.expiryYear) {
      newErrors.expiryYear = 'Yıl seçin';
    }
    
    if (!cardData.cvv) {
      newErrors.cvv = 'CVV gerekli';
    } else if (cardData.cvv.length < 3) {
      newErrors.cvv = 'Geçerli bir CVV girin';
    }
    
    if (!cardData.cardHolderName) {
      newErrors.cardHolderName = 'Kart sahibi adı gerekli';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateCard()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // iyzico API entegrasyonu
      const response = await fetch('/api/payments/iyzico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          cardData,
          installment,
          customerInfo
        }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess({
          method: 'iyzico',
          transactionId: result.transactionId,
          installment,
          amount,
          currency
        });
      } else {
        onError(new Error(result.error || 'Ödeme işlemi başarısız'));
      }
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const installmentOptions = [
    { value: 1, label: 'Tek Çekim' },
    { value: 2, label: '2 Taksit' },
    { value: 3, label: '3 Taksit' },
    { value: 6, label: '6 Taksit' },
    { value: 9, label: '9 Taksit' },
    { value: 12, label: '12 Taksit' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <img 
          src="/images/iyzico-logo.png" 
          alt="iyzico" 
          className="h-8"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="text-lg font-semibold text-gray-900">iyzico ile Ödeme</span>
        <LockClosedIcon className="w-5 h-5 text-green-600" />
      </div>

      <div className="space-y-4">
        {/* Kart Numarası */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kart Numarası *
          </label>
          <input
            type="text"
            value={cardData.cardNumber}
            onChange={(e) => setCardData({
              ...cardData,
              cardNumber: formatCardNumber(e.target.value.replace(/\D/g, ''))
            })}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.cardNumber ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
          )}
        </div>

        {/* Kart Sahibi Adı */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kart Sahibi Adı *
          </label>
          <input
            type="text"
            value={cardData.cardHolderName}
            onChange={(e) => setCardData({
              ...cardData,
              cardHolderName: e.target.value.toUpperCase()
            })}
            placeholder="AD SOYAD"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.cardHolderName ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.cardHolderName && (
            <p className="mt-1 text-sm text-red-600">{errors.cardHolderName}</p>
          )}
        </div>

        {/* Son Kullanma Tarihi ve CVV */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ay *
            </label>
            <select
              value={cardData.expiryMonth}
              onChange={(e) => setCardData({
                ...cardData,
                expiryMonth: e.target.value
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.expiryMonth ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Ay</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                  {String(i + 1).padStart(2, '0')}
                </option>
              ))}
            </select>
            {errors.expiryMonth && (
              <p className="mt-1 text-sm text-red-600">{errors.expiryMonth}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yıl *
            </label>
            <select
              value={cardData.expiryYear}
              onChange={(e) => setCardData({
                ...cardData,
                expiryYear: e.target.value
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.expiryYear ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Yıl</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() + i;
                return (
                  <option key={year} value={year.toString().slice(-2)}>
                    {year}
                  </option>
                );
              })}
            </select>
            {errors.expiryYear && (
              <p className="mt-1 text-sm text-red-600">{errors.expiryYear}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV *
            </label>
            <input
              type="text"
              value={cardData.cvv}
              onChange={(e) => setCardData({
                ...cardData,
                cvv: e.target.value.replace(/\D/g, '')
              })}
              placeholder="123"
              maxLength={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.cvv ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.cvv && (
              <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
            )}
          </div>
        </div>

        {/* Taksit Seçenekleri */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taksit Seçenekleri
          </label>
          <select
            value={installment}
            onChange={(e) => setInstallment(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {installmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
                {option.value > 1 && ` (${(amount / option.value).toFixed(2)} ${currency} x ${option.value})`}
              </option>
            ))}
          </select>
        </div>

        {/* Ödeme Butonu */}
        <button
          onClick={handlePayment}
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
              <span>
                {installment === 1 
                  ? `${amount.toFixed(2)} ${currency} Öde` 
                  : `${(amount / installment).toFixed(2)} ${currency} x ${installment} Taksit`
                }
              </span>
            </>
          )}
        </button>

        {/* Güvenlik Bilgisi */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <LockClosedIcon className="w-4 h-4 text-green-600" />
          <span>256-bit SSL şifreleme ile güvenli ödeme</span>
        </div>
      </div>
    </div>
  );
}
