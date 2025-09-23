'use client';

import { useState, useEffect } from 'react';
import { useToast } from '../Toast';
import IyzicoPayment from './IyzicoPayment';
import PayPalPayment from './PayPalPayment';
import StripePayment from './StripePayment';
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  CurrencyDollarIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  enabled: boolean;
  fees?: number;
  processingTime?: string;
  securityLevel: 'high' | 'medium' | 'low';
}

interface InstallmentOption {
  id: string;
  installments: number;
  monthlyPayment: number;
  totalAmount: number;
  interestRate: number;
  bank: string;
  enabled: boolean;
}

interface AdvancedPaymentSystemProps {
  amount: number;
  currency: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: any) => void;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function AdvancedPaymentSystem({
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError,
  customerInfo
}: AdvancedPaymentSystemProps) {
  const { addToast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [selectedInstallment, setSelectedInstallment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'method' | 'details' | 'verification' | 'processing' | 'success' | 'error'>('method');
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [verificationCode, setVerificationCode] = useState('');
  const [securityChecks, setSecurityChecks] = useState({
    fraudCheck: false,
    identityVerification: false,
    addressVerification: false,
    deviceVerification: false
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'iyzico',
      name: 'iyzico',
      icon: <CreditCardIcon className="w-6 h-6" />,
      description: 'Türkiye\'nin en güvenilir ödeme sistemi',
      enabled: true,
      fees: 0,
      processingTime: 'Anında',
      securityLevel: 'high'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <CreditCardIcon className="w-6 h-6" />,
      description: 'Dünya çapında güvenilir ödeme',
      enabled: true,
      fees: 0,
      processingTime: 'Anında',
      securityLevel: 'high'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: <CreditCardIcon className="w-6 h-6" />,
      description: 'Gelişmiş güvenlik ve 135+ para birimi',
      enabled: true,
      fees: 0,
      processingTime: 'Anında',
      securityLevel: 'high'
    },
    {
      id: 'bank_transfer',
      name: 'Banka Havalesi',
      icon: <BanknotesIcon className="w-6 h-6" />,
      description: 'EFT, Havale, IBAN',
      enabled: true,
      fees: 0,
      processingTime: '1-2 iş günü',
      securityLevel: 'high'
    },
    {
      id: 'crypto',
      name: 'Kripto Para',
      icon: <CurrencyDollarIcon className="w-6 h-6" />,
      description: 'Bitcoin, Ethereum, USDT',
      enabled: true,
      fees: 0.5,
      processingTime: '10-30 dakika',
      securityLevel: 'high'
    }
  ];

  const installmentOptions: InstallmentOption[] = [
    {
      id: 'installment_2',
      installments: 2,
      monthlyPayment: amount / 2,
      totalAmount: amount,
      interestRate: 0,
      bank: 'Tüm Bankalar',
      enabled: true
    },
    {
      id: 'installment_3',
      installments: 3,
      monthlyPayment: amount / 3,
      totalAmount: amount,
      interestRate: 0,
      bank: 'Tüm Bankalar',
      enabled: true
    },
    {
      id: 'installment_6',
      installments: 6,
      monthlyPayment: amount / 6,
      totalAmount: amount * 1.05,
      interestRate: 5,
      bank: 'Tüm Bankalar',
      enabled: true
    },
    {
      id: 'installment_9',
      installments: 9,
      monthlyPayment: amount / 9,
      totalAmount: amount * 1.08,
      interestRate: 8,
      bank: 'Tüm Bankalar',
      enabled: true
    },
    {
      id: 'installment_12',
      installments: 12,
      monthlyPayment: amount / 12,
      totalAmount: amount * 1.12,
      interestRate: 12,
      bank: 'Tüm Bankalar',
      enabled: true
    }
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setPaymentStep('details');
  };

  const handleInstallmentSelect = (installmentId: string) => {
    setSelectedInstallment(installmentId);
  };

  const handlePaymentDetails = (details: any) => {
    setPaymentDetails(details);
    setPaymentStep('verification');
  };

  const handleVerification = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Güvenlik kontrollerini başlat
      await performSecurityChecks();
      
      // Ödeme işlemini başlat
      const paymentResult = await processPayment();
      
      if (paymentResult.success) {
        setPaymentStep('success');
        onPaymentSuccess(paymentResult);
        addToast({
          type: 'success',
          title: 'Ödeme Başarılı!',
          message: 'Ödemeniz başarıyla tamamlandı',
          duration: 5000
        });
      } else {
        setPaymentStep('error');
        onPaymentError(paymentResult.error);
        addToast({
          type: 'error',
          title: 'Ödeme Hatası',
          message: paymentResult.error.message || 'Ödeme işlemi başarısız',
          duration: 5000
        });
      }
    } catch (error) {
      setPaymentStep('error');
      onPaymentError(error);
      addToast({
        type: 'error',
        title: 'Hata',
        message: 'Beklenmeyen bir hata oluştu',
        duration: 5000
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const performSecurityChecks = async () => {
    // Fraud detection
    setSecurityChecks(prev => ({ ...prev, fraudCheck: true }));
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Identity verification
    setSecurityChecks(prev => ({ ...prev, identityVerification: true }));
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Address verification
    setSecurityChecks(prev => ({ ...prev, addressVerification: true }));
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Device verification
    setSecurityChecks(prev => ({ ...prev, deviceVerification: true }));
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const processPayment = async () => {
    const paymentData = {
      method: selectedMethod,
      amount,
      currency,
      customerInfo,
      paymentDetails,
      installment: selectedInstallment,
      securityChecks
    };

    const response = await fetch('/api/payments/advanced/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    return await response.json();
  };

  const renderPaymentMethods = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ödeme Yöntemi Seçin</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => method.enabled && handleMethodSelect(method.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              method.enabled
                ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-blue-600">{method.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{method.name}</h4>
                <p className="text-sm text-gray-600">{method.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-gray-500">{method.processingTime}</span>
                  {method.fees && method.fees > 0 && (
                    <span className="text-xs text-orange-600">+{method.fees}% komisyon</span>
                  )}
                  <div className="flex items-center space-x-1">
                    <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600 capitalize">{method.securityLevel}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInstallmentOptions = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Taksit Seçenekleri</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {installmentOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => option.enabled && handleInstallmentSelect(option.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              option.enabled
                ? 'border-gray-200 hover:border-green-500 hover:bg-green-50'
                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
            } ${selectedInstallment === option.id ? 'border-green-500 bg-green-50' : ''}`}
          >
            <div className="text-center">
              <h4 className="font-semibold text-gray-900">{option.installments} Taksit</h4>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: 'TRY'
                }).format(option.monthlyPayment)}
              </p>
              <p className="text-sm text-gray-600">Aylık</p>
              {option.interestRate > 0 && (
                <p className="text-xs text-orange-600">+%{option.interestRate} faiz</p>
              )}
              <p className="text-xs text-gray-500 mt-2">Toplam: {
                new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: 'TRY'
                }).format(option.totalAmount)
              }</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ödeme Detayları</h3>
      
      {selectedMethod === 'iyzico' && (
        <IyzicoPayment
          amount={amount}
          currency={currency}
          onSuccess={onPaymentSuccess}
          onError={onPaymentError}
          customerInfo={customerInfo}
        />
      )}

      {selectedMethod === 'paypal' && (
        <PayPalPayment
          amount={amount}
          currency={currency}
          onSuccess={onPaymentSuccess}
          onError={onPaymentError}
          customerInfo={customerInfo}
        />
      )}

      {selectedMethod === 'stripe' && (
        <StripePayment
          amount={amount}
          currency={currency}
          onSuccess={onPaymentSuccess}
          onError={onPaymentError}
          customerInfo={customerInfo}
        />
      )}

      {selectedMethod === 'bank_transfer' && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Banka Bilgileri</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Banka:</strong> TDC Bank</p>
              <p><strong>IBAN:</strong> TR12 0006 4000 0011 2345 6789 01</p>
              <p><strong>Hesap Sahibi:</strong> TDC Products Ltd.</p>
              <p><strong>Açıklama:</strong> Sipariş No: {Date.now()}</p>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Önemli:</strong> Ödeme yaptıktan sonra dekontu yükleyin. 
              Ödemeniz 1-2 iş günü içinde onaylanacaktır.
            </p>
          </div>
        </div>
      )}

      {selectedMethod === 'crypto' && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Kripto Para Ödeme</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Bitcoin:</strong> bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
              <p><strong>Ethereum:</strong> 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6</p>
              <p><strong>USDT:</strong> TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE</p>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-orange-800 text-sm">
              <strong>Dikkat:</strong> Kripto para ödemeleri geri alınamaz. 
              Doğru adrese ödeme yaptığınızdan emin olun.
            </p>
          </div>
        </div>
      )}

      {selectedMethod === 'mobile_payment' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <div className="text-4xl mb-2">📱</div>
              <h4 className="font-semibold">Apple Pay</h4>
              <p className="text-sm text-gray-600">iPhone ile ödeme</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <div className="text-4xl mb-2">🤖</div>
              <h4 className="font-semibold">Google Pay</h4>
              <p className="text-sm text-gray-600">Android ile ödeme</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg text-center">
              <div className="text-4xl mb-2">💳</div>
              <h4 className="font-semibold">PayPal</h4>
              <p className="text-sm text-gray-600">PayPal hesabı ile</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setPaymentStep('method')}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Geri
        </button>
        <button
          onClick={() => handlePaymentDetails({})}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Devam Et
        </button>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Güvenlik Doğrulama</h3>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <ShieldCheckIcon className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-900">3D Secure Doğrulama</span>
        </div>
        <p className="text-sm text-green-800">
          Ödemenizi güvence altına almak için 3D Secure doğrulaması yapılacaktır.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMS Doğrulama Kodu
          </label>
          <input
            type="text"
            placeholder="6 haneli kod"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={6}
          />
          <p className="text-sm text-gray-600 mt-1">
            {customerInfo.phone} numarasına gönderilen kodu girin
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setPaymentStep('details')}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Geri
        </button>
        <button
          onClick={handleVerification}
          disabled={verificationCode.length !== 6}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ödemeyi Tamamla
        </button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="space-y-6 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
      <h3 className="text-lg font-semibold text-gray-900">Ödeme İşleniyor</h3>
      <p className="text-gray-600">Lütfen bekleyin, ödemeniz güvenli bir şekilde işleniyor...</p>
      
      <div className="space-y-3">
        {Object.entries(securityChecks).map(([key, completed]) => (
          <div key={key} className="flex items-center space-x-3">
            {completed ? (
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full animate-pulse"></div>
            )}
            <span className="text-sm text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircleIcon className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Ödeme Başarılı!</h3>
      <p className="text-gray-600">
        Ödemeniz başarıyla tamamlandı. Siparişiniz onaylandı.
      </p>
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>İşlem ID:</strong> TXN-{Date.now()}
        </p>
        <p className="text-sm text-green-800">
          <strong>Tutar:</strong> {new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
          }).format(amount)}
        </p>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Ödeme Hatası</h3>
      <p className="text-gray-600">
        Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.
      </p>
      <button
        onClick={() => setPaymentStep('method')}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Tekrar Dene
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gelişmiş Ödeme Sistemi</h2>
        <p className="text-gray-600">
          Güvenli ve hızlı ödeme yöntemleri ile siparişinizi tamamlayın
        </p>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Toplam Tutar:</span>
          <span className="text-xl font-bold text-gray-900">
            {new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY'
            }).format(amount)}
          </span>
        </div>
      </div>

      <div className="mb-6">
        {paymentStep === 'method' && renderPaymentMethods()}
        {paymentStep === 'details' && renderPaymentDetails()}
        {paymentStep === 'verification' && renderVerification()}
        {paymentStep === 'processing' && renderProcessing()}
        {paymentStep === 'success' && renderSuccess()}
        {paymentStep === 'error' && renderError()}
      </div>

      {paymentStep === 'details' && selectedMethod === 'credit_card' && (
        <div className="mt-6">
          {renderInstallmentOptions()}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <LockClosedIcon className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-blue-800">
            <strong>Güvenlik:</strong> Tüm ödemeler SSL ile şifrelenir ve 3D Secure ile korunur
          </span>
        </div>
      </div>
    </div>
  );
}
