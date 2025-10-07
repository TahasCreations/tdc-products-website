"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Shield, Lock, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  provider: 'paytr' | 'iyzico';
  type: 'credit_card' | 'bank_transfer' | 'mobile_payment';
  icon: React.ReactNode;
  description: string;
  features: string[];
  processingFee: string;
  minAmount?: number;
  maxAmount?: number;
  supportedInstallments?: number[];
  isRecommended?: boolean;
  isAvailable: boolean;
}

interface PaymentMethodsProps {
  amount: number;
  currency: string;
  onMethodSelect: (method: PaymentMethod) => void;
  selectedMethod?: string;
  onProceed: (method: PaymentMethod, formData?: any) => void;
}

export default function PaymentMethods({
  amount,
  currency,
  onMethodSelect,
  selectedMethod,
  onProceed
}: PaymentMethodsProps) {
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardName: '',
    installment: 1
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'paytr_credit',
      name: 'Kredi Kartı ile Ödeme',
      provider: 'paytr',
      type: 'credit_card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, MasterCard, Troy kartlarınızla güvenli ödeme',
      features: ['3D Secure', 'Taksitli Ödeme', 'Anında Onay'],
      processingFee: 'Ücretsiz',
      minAmount: 10,
      maxAmount: 50000,
      supportedInstallments: [1, 2, 3, 6, 9, 12],
      isRecommended: true,
      isAvailable: true
    },
    {
      id: 'iyzico_credit',
      name: 'Iyzico ile Ödeme',
      provider: 'iyzico',
      type: 'credit_card',
      icon: <Building2 className="w-6 h-6" />,
      description: 'Iyzico güvencesiyle kredi kartı ödemesi',
      features: ['Fraud Protection', 'Taksit Seçenekleri', 'Hızlı İşlem'],
      processingFee: '%2.9',
      minAmount: 5,
      maxAmount: 100000,
      supportedInstallments: [1, 2, 3, 6, 9, 12],
      isAvailable: true
    },
    {
      id: 'paytr_mobile',
      name: 'Mobil Ödeme',
      provider: 'paytr',
      type: 'mobile_payment',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Mobil cüzdan uygulamaları ile ödeme',
      features: ['Apple Pay', 'Google Pay', 'Samsung Pay'],
      processingFee: 'Ücretsiz',
      minAmount: 5,
      maxAmount: 10000,
      isAvailable: false // Coming soon
    },
    {
      id: 'bank_transfer',
      name: 'Havale/EFT',
      provider: 'paytr',
      type: 'bank_transfer',
      icon: <Building2 className="w-6 h-6" />,
      description: 'Banka havalesi ile ödeme',
      features: ['Düşük Komisyon', 'Güvenli', 'Manuel Onay'],
      processingFee: '₺5',
      minAmount: 50,
      maxAmount: 100000,
      isAvailable: false // Coming soon
    }
  ];

  const availableMethods = paymentMethods.filter(method => method.isAvailable);
  const selectedPaymentMethod = availableMethods.find(method => method.id === selectedMethod);

  const handleMethodSelect = (method: PaymentMethod) => {
    onMethodSelect(method);
    if (method.type === 'credit_card') {
      setShowCardForm(true);
    } else {
      setShowCardForm(false);
    }
  };

  const handleCardFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentMethod) return;

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onProceed(selectedPaymentMethod, {
        ...cardForm,
        amount,
        currency
      });
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const getCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'unknown';
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Ödeme Yöntemi Seçin</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedMethod === method.id
                  ? 'border-[#CBA135] bg-[#CBA135]/5'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!method.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => method.isAvailable && handleMethodSelect(method)}
            >
              {/* Recommended Badge */}
              {method.isRecommended && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Önerilen
                </div>
              )}

              {/* Coming Soon Badge */}
              {!method.isAvailable && (
                <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Yakında
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedMethod === method.id
                    ? 'bg-[#CBA135] text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {method.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{method.name}</h4>
                    <div className="flex items-center gap-1">
                      {method.isRecommended && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <Shield className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {method.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Processing Fee */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">İşlem Ücreti:</span>
                    <span className={`font-medium ${
                      method.processingFee === 'Ücretsiz' 
                        ? 'text-green-600' 
                        : 'text-gray-900'
                    }`}>
                      {method.processingFee}
                    </span>
                  </div>

                  {/* Amount Limits */}
                  {(method.minAmount || method.maxAmount) && (
                    <div className="mt-2 text-xs text-gray-500">
                      {method.minAmount && `Min: ₺${method.minAmount}`}
                      {method.minAmount && method.maxAmount && ' • '}
                      {method.maxAmount && `Max: ₺${method.maxAmount}`}
                    </div>
                  )}
                </div>

                {/* Selection Indicator */}
                {selectedMethod === method.id && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-6 h-6 text-[#CBA135]" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Card Form */}
      <AnimatePresence>
        {showCardForm && selectedPaymentMethod && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Kart Bilgileri
            </h4>

            <form onSubmit={handleCardFormSubmit} className="space-y-4">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kart Numarası
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardForm.cardNumber}
                    onChange={(e) => setCardForm(prev => ({
                      ...prev,
                      cardNumber: formatCardNumber(e.target.value)
                    }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {cardForm.cardNumber && (
                      <div className="flex items-center gap-1">
                        {getCardType(cardForm.cardNumber) === 'visa' && (
                          <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                            V
                          </div>
                        )}
                        {getCardType(cardForm.cardNumber) === 'mastercard' && (
                          <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
                            MC
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kart Üzerindeki İsim
                </label>
                <input
                  type="text"
                  value={cardForm.cardName}
                  onChange={(e) => setCardForm(prev => ({
                    ...prev,
                    cardName: e.target.value.toUpperCase()
                  }))}
                  placeholder="AHMET YILMAZ"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                  required
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ay
                  </label>
                  <select
                    value={cardForm.expiryMonth}
                    onChange={(e) => setCardForm(prev => ({
                      ...prev,
                      expiryMonth: e.target.value
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                    required
                  >
                    <option value="">Ay</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {String(i + 1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yıl
                  </label>
                  <select
                    value={cardForm.expiryYear}
                    onChange={(e) => setCardForm(prev => ({
                      ...prev,
                      expiryYear: e.target.value
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                    required
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm(prev => ({
                      ...prev,
                      cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                    }))}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Installment Options */}
              {selectedPaymentMethod.supportedInstallments && selectedPaymentMethod.supportedInstallments.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taksit Seçeneği
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {selectedPaymentMethod.supportedInstallments.map((installment) => (
                      <button
                        key={installment}
                        type="button"
                        onClick={() => setCardForm(prev => ({
                          ...prev,
                          installment
                        }))}
                        className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                          cardForm.installment === installment
                            ? 'border-[#CBA135] bg-[#CBA135] text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {installment === 1 ? 'Tek' : `${installment}x`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-900">Güvenli Ödeme</h5>
                    <p className="text-sm text-blue-700 mt-1">
                      Kart bilgileriniz SSL ile şifrelenir ve güvenli sunucularda saklanır. 
                      3D Secure ile ek güvenlik sağlanır.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center px-6 py-3 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    ₺{amount.toFixed(2)} Öde
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
