'use client';

import { useState } from 'react';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ödeme</h1>
          <p className="text-gray-600 mt-2">
            Siparişinizi tamamlayın
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, label: 'Sepet', icon: '🛒' },
              { step: 2, label: 'Teslimat', icon: '📍' },
              { step: 3, label: 'Ödeme', icon: '💳' },
              { step: 4, label: 'Onay', icon: '✅' },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= item.step
                      ? 'bg-[#CBA135] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > item.step ? '✓' : item.step}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {item.label}
                </span>
                {index < 3 && (
                  <div
                    className={`w-16 h-0.5 mx-4 ${
                      step > item.step ? 'bg-[#CBA135]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Ödeme Bilgileri
          </h2>
          <p className="text-gray-600">
            Ödeme sayfası yakında eklenecek.
          </p>
        </div>
      </div>
    </div>
  );
}
