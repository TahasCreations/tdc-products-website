'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Banknote, Wallet, Smartphone, Calendar, ShieldCheck } from 'lucide-react';

interface PaymentOption {
  id: string;
  name: string;
  type: 'credit_card' | 'bank_transfer' | 'cash_on_delivery' | 'digital_wallet' | 'installment' | 'bnpl';
  icon: React.ReactNode;
  description: string;
  fee: number;
  discount?: number;
  installmentOptions?: number[];
  isRecommended?: boolean;
}

interface AdvancedPaymentOptionsProps {
  total: number;
  onSelect: (option: PaymentOption) => void;
  selectedOption?: string;
}

export default function AdvancedPaymentOptions({ total, onSelect, selectedOption }: AdvancedPaymentOptionsProps) {
  const [selectedInstallment, setSelectedInstallment] = useState<number>(1);

  const paymentOptions: PaymentOption[] = [
    {
      id: 'credit_card',
      name: 'Kredi Kartı',
      type: 'credit_card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Tüm kredi kartları kabul edilir',
      fee: 0,
      installmentOptions: [1, 3, 6, 9, 12],
      isRecommended: true
    },
    {
      id: 'bank_transfer',
      name: 'Havale/EFT',
      type: 'bank_transfer',
      icon: <Banknote className="w-6 h-6" />,
      description: '%5 indirim kazanın',
      fee: 0,
      discount: 5
    },
    {
      id: 'cash_on_delivery',
      name: 'Kapıda Ödeme',
      type: 'cash_on_delivery',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Kredi kartı veya nakit',
      fee: 10
    },
    {
      id: 'digital_wallet',
      name: 'Dijital Cüzdan',
      type: 'digital_wallet',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Papara, PayPal, Apple Pay',
      fee: 0
    },
    {
      id: 'bnpl',
      name: 'Şimdi Al, Sonra Öde',
      type: 'bnpl',
      icon: <Calendar className="w-6 h-6" />,
      description: '30 gün sonra öde, faiz yok',
      fee: 0
    }
  ];

  const calculateTotal = (option: PaymentOption, installments: number = 1) => {
    let finalTotal = total;

    // Apply fee
    if (option.fee > 0) {
      finalTotal += option.fee;
    }

    // Apply discount
    if (option.discount) {
      finalTotal -= (total * option.discount / 100);
    }

    const monthlyPayment = installments > 1 ? finalTotal / installments : finalTotal;

    return {
      total: finalTotal,
      monthly: monthlyPayment,
      savings: option.discount ? (total * option.discount / 100) : 0
    };
  };

  return (
    <div className="space-y-4">
      {/* Payment Options */}
      {paymentOptions.map((option) => {
        const calculation = calculateTotal(option, selectedInstallment);
        const isSelected = selectedOption === option.id;

        return (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.01 }}
            onClick={() => onSelect(option)}
            className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
              isSelected
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 bg-white hover:border-indigo-300'
            }`}
          >
            {/* Recommended Badge */}
            {option.isRecommended && (
              <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold">
                ⭐ Önerilen
              </div>
            )}

            {/* Discount Badge */}
            {option.discount && (
              <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs font-bold">
                %{option.discount} İNDİRİM
              </div>
            )}

            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className={`p-3 rounded-lg ${
                isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {option.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900 text-lg">{option.name}</h4>
                  {isSelected && (
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3">{option.description}</p>

                {/* Installment Options */}
                {option.installmentOptions && isSelected && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">Taksit Seçenekleri:</div>
                    <div className="flex flex-wrap gap-2">
                      {option.installmentOptions.map((months) => {
                        const calc = calculateTotal(option, months);
                        return (
                          <button
                            key={months}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInstallment(months);
                            }}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${
                              selectedInstallment === months
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-600 font-bold'
                                : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                            }`}
                          >
                            <div className="text-sm font-semibold">
                              {months === 1 ? 'Peşin' : `${months} Taksit`}
                            </div>
                            <div className="text-xs">
                              {calc.monthly.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Price Display */}
                <div className="flex items-center justify-between">
                  <div>
                    {calculation.savings > 0 && (
                      <div className="text-sm text-green-600 font-medium mb-1">
                        ✅ {calculation.savings.toLocaleString('tr-TR')} ₺ tasarruf
                      </div>
                    )}
                    {option.fee > 0 && (
                      <div className="text-sm text-gray-600">
                        +{option.fee} ₺ hizmet bedeli
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {calculation.total.toLocaleString('tr-TR')} ₺
                    </div>
                    {selectedInstallment > 1 && isSelected && (
                      <div className="text-sm text-gray-600">
                        {selectedInstallment}x{calculation.monthly.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 pt-4">
        <ShieldCheck className="w-5 h-5 text-green-600" />
        <span>Tüm ödemeler 256-bit SSL ile güvence altında</span>
      </div>
    </div>
  );
}

