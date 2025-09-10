'use client';

import { useState, useEffect } from 'react';
import { useToast } from './Toast';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'bank' | 'crypto' | 'mobile' | 'digital_wallet';
  icon: string;
  enabled: boolean;
  fees: {
    percentage: number;
    fixed: number;
  };
  processingTime: string;
  supportedCurrencies: string[];
}

interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerInfo: {
    email: string;
    phone: string;
    name: string;
  };
  description: string;
}

export default function MultiPaymentSystem() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>({
    amount: 0,
    currency: 'TRY',
    orderId: '',
    customerInfo: { email: '', phone: '', name: '' },
    description: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const { addToast } = useToast();

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await fetch('/api/payments/methods');
      const methods = await response.json();
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Payment methods loading error:', error);
    }
  };

  const processPayment = async () => {
    if (!selectedMethod || paymentRequest.amount <= 0) {
      addToast({
        type: 'error',
        title: 'Ödeme Hatası',
        message: 'Lütfen geçerli bir ödeme yöntemi ve tutar seçin'
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: selectedMethod,
          request: paymentRequest
        })
      });

      const result = await response.json();

      if (result.success) {
        setPaymentStatus('success');
        addToast({
          type: 'success',
          title: 'Ödeme Başarılı',
          message: `Ödeme ${result.transactionId} ile tamamlandı`
        });
      } else {
        setPaymentStatus('failed');
        addToast({
          type: 'error',
          title: 'Ödeme Başarısız',
          message: result.error || 'Ödeme işlemi tamamlanamadı'
        });
      }
    } catch (error) {
      setPaymentStatus('failed');
      addToast({
        type: 'error',
        title: 'Ödeme Hatası',
        message: 'Ödeme işlemi sırasında hata oluştu'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentIcon = (type: string) => {
    const icons = {
      card: 'ri-bank-card-line',
      bank: 'ri-bank-line',
      crypto: 'ri-bit-coin-line',
      mobile: 'ri-smartphone-line',
      digital_wallet: 'ri-wallet-3-line'
    };
    return icons[type as keyof typeof icons] || 'ri-money-dollar-circle-line';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      idle: 'text-gray-500',
      processing: 'text-blue-500',
      success: 'text-green-500',
      failed: 'text-red-500'
    };
    return colors[status as keyof typeof colors] || 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods Selection */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <i className="ri-money-dollar-circle-line text-3xl text-green-600 mr-3"></i>
          Çoklu Ödeme Sistemi
        </h2>

        {/* Payment Request Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ödeme Tutarı
            </label>
            <div className="flex">
              <input
                type="number"
                value={paymentRequest.amount}
                onChange={(e) => setPaymentRequest(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0.00"
              />
              <select
                value={paymentRequest.currency}
                onChange={(e) => setPaymentRequest(prev => ({ ...prev, currency: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="TRY">TRY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sipariş ID
            </label>
            <input
              type="text"
              value={paymentRequest.orderId}
              onChange={(e) => setPaymentRequest(prev => ({ ...prev, orderId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="SIP-2024-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Müşteri Adı
            </label>
            <input
              type="text"
              value={paymentRequest.customerInfo.name}
              onChange={(e) => setPaymentRequest(prev => ({ 
                ...prev, 
                customerInfo: { ...prev.customerInfo, name: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Ad Soyad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-posta
            </label>
            <input
              type="email"
              value={paymentRequest.customerInfo.email}
              onChange={(e) => setPaymentRequest(prev => ({ 
                ...prev, 
                customerInfo: { ...prev.customerInfo, email: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="ornek@email.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <input
              type="text"
              value={paymentRequest.description}
              onChange={(e) => setPaymentRequest(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Ödeme açıklaması"
            />
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => method.enabled && setSelectedMethod(method.id)}
            >
              <div className="flex items-center mb-3">
                <i className={`${getPaymentIcon(method.type)} text-2xl mr-3 ${
                  selectedMethod === method.id ? 'text-green-600' : 'text-gray-600'
                }`}></i>
                <div>
                  <h3 className="font-semibold text-gray-900">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.processingTime}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Komisyon:</span>
                  <span className="font-medium">
                    %{method.fees.percentage} + {method.fees.fixed} {paymentRequest.currency}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Desteklenen:</span>
                  <span className="font-medium">
                    {method.supportedCurrencies.join(', ')}
                  </span>
                </div>
                
                {!method.enabled && (
                  <div className="text-xs text-red-600 font-medium">
                    Şu anda kullanılamıyor
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Payment Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${getStatusColor(paymentStatus)}`}>
              <i className={`ri-${paymentStatus === 'idle' ? 'pause-circle' :
                paymentStatus === 'processing' ? 'loader-4' :
                paymentStatus === 'success' ? 'check-circle' : 'close-circle'}-line text-xl mr-2`}></i>
              <span className="font-medium">
                {paymentStatus === 'idle' ? 'Ödeme Bekleniyor' :
                 paymentStatus === 'processing' ? 'İşleniyor...' :
                 paymentStatus === 'success' ? 'Başarılı' : 'Başarısız'}
              </span>
            </div>
          </div>
          
          <button
            onClick={processPayment}
            disabled={isProcessing || !selectedMethod || paymentRequest.amount <= 0}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center"
          >
            {isProcessing ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                İşleniyor...
              </>
            ) : (
              <>
                <i className="ri-money-dollar-circle-line mr-2"></i>
                Ödeme Yap
              </>
            )}
          </button>
        </div>
      </div>

      {/* Payment Analytics */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Ödeme Analitikleri</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <i className="ri-money-dollar-circle-line text-3xl text-blue-600 mb-2"></i>
            <div className="text-2xl font-bold text-blue-900">₺125,430</div>
            <div className="text-sm text-blue-700">Toplam Ödeme</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <i className="ri-check-circle-line text-3xl text-green-600 mb-2"></i>
            <div className="text-2xl font-bold text-green-900">98.2%</div>
            <div className="text-sm text-green-700">Başarı Oranı</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <i className="ri-time-line text-3xl text-orange-600 mb-2"></i>
            <div className="text-2xl font-bold text-orange-900">2.3s</div>
            <div className="text-sm text-orange-700">Ortalama Süre</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <i className="ri-bar-chart-line text-3xl text-purple-600 mb-2"></i>
            <div className="text-2xl font-bold text-purple-900">1,247</div>
            <div className="text-sm text-purple-700">Toplam İşlem</div>
          </div>
        </div>
      </div>
    </div>
  );
}
