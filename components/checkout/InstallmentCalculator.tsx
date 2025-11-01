"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ChevronDown, ChevronUp, Calculator, Sparkles } from 'lucide-react';

interface InstallmentCalculatorProps {
  totalAmount: number;
}

interface Bank {
  name: string;
  logo: string;
  color: string;
  installments: {
    count: number;
    rate: number; // 0 = faiz yok
  }[];
}

export default function InstallmentCalculator({ totalAmount }: InstallmentCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>('garanti');

  const banks: Record<string, Bank> = {
    garanti: {
      name: 'Garanti BBVA',
      logo: '🏦',
      color: 'bg-green-600',
      installments: [
        { count: 2, rate: 0 },
        { count: 3, rate: 0 },
        { count: 6, rate: 1.99 },
        { count: 9, rate: 2.49 },
        { count: 12, rate: 2.99 },
      ],
    },
    isbank: {
      name: 'İş Bankası',
      logo: '🏛️',
      color: 'bg-blue-600',
      installments: [
        { count: 2, rate: 0 },
        { count: 3, rate: 0 },
        { count: 6, rate: 1.89 },
        { count: 9, rate: 2.39 },
        { count: 12, rate: 2.89 },
      ],
    },
    akbank: {
      name: 'Akbank',
      logo: '🏦',
      color: 'bg-red-600',
      installments: [
        { count: 2, rate: 0 },
        { count: 3, rate: 0 },
        { count: 6, rate: 1.95 },
        { count: 9, rate: 2.45 },
        { count: 12, rate: 2.95 },
      ],
    },
    yapi: {
      name: 'Yapı Kredi',
      logo: '🏦',
      color: 'bg-blue-700',
      installments: [
        { count: 2, rate: 0 },
        { count: 3, rate: 0 },
        { count: 6, rate: 2.09 },
        { count: 9, rate: 2.59 },
        { count: 12, rate: 3.09 },
      ],
    },
  };

  const calculateInstallment = (amount: number, count: number, rate: number) => {
    if (rate === 0) {
      return amount / count;
    }
    const monthlyRate = rate / 100;
    const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, count)) / (Math.pow(1 + monthlyRate, count) - 1);
    return payment;
  };

  const bank = banks[selectedBank];

  return (
    <div className="space-y-3">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all group"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900 flex items-center">
              Taksit Seçenekleri
              <Sparkles className="w-4 h-4 ml-2 text-yellow-500" />
            </p>
            <p className="text-xs text-gray-600">3 ay 0 faizli taksit imkanı!</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
        )}
      </button>

      {/* Installment Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-white border-2 border-blue-200 rounded-xl space-y-4">
              {/* Bank Selection */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Bankanızı Seçin:</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(banks).map(([key, bankData]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedBank(key)}
                      className={`
                        p-3 rounded-lg border-2 transition-all text-sm font-medium
                        ${selectedBank === key 
                          ? 'border-blue-600 bg-blue-50 text-blue-900' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{bankData.logo}</span>
                        <span>{bankData.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Installment Options */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Taksit Seçenekleri:</p>
                <div className="space-y-2">
                  {bank.installments.map((installment) => {
                    const monthlyPayment = calculateInstallment(totalAmount, installment.count, installment.rate);
                    const totalWithInterest = monthlyPayment * installment.count;
                    const interestAmount = totalWithInterest - totalAmount;
                    const isZeroInterest = installment.rate === 0;

                    return (
                      <motion.div
                        key={installment.count}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`
                          p-4 rounded-lg border-2 transition-all cursor-pointer
                          ${isZeroInterest 
                            ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 hover:border-green-400' 
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-gray-900">
                                {installment.count} Taksit
                              </span>
                              {isZeroInterest && (
                                <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full font-bold">
                                  0 FAİZ
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Aylık <span className="font-bold text-[#CBA135]">₺{monthlyPayment.toFixed(2)}</span>
                            </p>
                            {!isZeroInterest && (
                              <p className="text-xs text-gray-500 mt-1">
                                Toplam: ₺{totalWithInterest.toFixed(2)} 
                                <span className="text-red-600"> (+₺{interestAmount.toFixed(2)} faiz)</span>
                              </p>
                            )}
                            {isZeroInterest && (
                              <p className="text-xs text-green-600 mt-1 font-semibold">
                                ✨ Faiz Yok! Toplam: ₺{totalAmount.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <CreditCard className={`w-6 h-6 ${isZeroInterest ? 'text-green-600' : 'text-gray-400'}`} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Best Deal Highlight */}
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-300">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  💡 En Avantajlı Seçenek
                </p>
                <p className="text-xs text-gray-700">
                  <span className="font-bold text-green-600">3 ay 0 faizli</span> taksit ile 
                  aylık sadece <span className="font-bold text-[#CBA135]">₺{(totalAmount / 3).toFixed(2)}</span> ödeyerek alışverişinizi tamamlayın!
                </p>
              </div>

              {/* Info */}
              <div className="text-xs text-gray-500 text-center">
                Taksit seçenekleri bankanıza göre değişiklik gösterebilir
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


