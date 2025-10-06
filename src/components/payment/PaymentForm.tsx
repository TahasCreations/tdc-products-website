"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Lock, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentFormProps {
  orderId: string;
  total: number;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
}

type PaymentMethod = 'paytr' | 'iyzico';

export default function PaymentForm({ orderId, total, onSuccess, onError }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paytr');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // PayTR için form state
  const [paytrData, setPaytrData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
  });

  // Iyzico için form state
  const [iyzicoData, setIyziCoData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expireMonth: '',
    expireYear: '',
    cvc: '',
    installment: 1,
    buyerName: '',
    buyerSurname: '',
    buyerGsmNumber: '',
    buyerEmail: '',
    buyerIdentityNumber: '',
    buyerCity: '',
    buyerCountry: 'Türkiye',
    buyerZipCode: '',
    buyerAddress: '',
    shippingContactName: '',
    shippingCity: '',
    shippingCountry: 'Türkiye',
    shippingAddress: '',
    shippingZipCode: '',
    billingContactName: '',
    billingCity: '',
    billingCountry: 'Türkiye',
    billingAddress: '',
    billingZipCode: '',
  });

  const handlePaytrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/payment/paytr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: total,
          currency: 'TRY',
          customerEmail: paytrData.customerEmail,
          customerName: paytrData.customerName,
          customerPhone: paytrData.customerPhone,
          customerAddress: paytrData.customerAddress,
          productName: `Sipariş #${orderId}`,
          basket: [{
            name: `Sipariş #${orderId}`,
            price: total,
            quantity: 1,
          }],
          successUrl: `${window.location.origin}/payment/success?orderId=${orderId}`,
          failUrl: `${window.location.origin}/payment/fail?orderId=${orderId}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // PayTR iframe'ini aç
        window.open(data.iframeUrl, '_blank', 'width=800,height=600');
        onSuccess(data);
      } else {
        onError(data.error || 'Ödeme işlemi başlatılamadı');
      }
    } catch (error) {
      onError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleIyziCoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/payment/iyzico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          cardHolderName: iyzicoData.cardHolderName,
          cardNumber: iyzicoData.cardNumber,
          expireMonth: iyzicoData.expireMonth,
          expireYear: iyzicoData.expireYear,
          cvc: iyzicoData.cvc,
          installment: iyzicoData.installment,
          buyer: {
            name: iyzicoData.buyerName,
            surname: iyzicoData.buyerSurname,
            gsmNumber: iyzicoData.buyerGsmNumber,
            email: iyzicoData.buyerEmail,
            identityNumber: iyzicoData.buyerIdentityNumber,
            registrationAddress: iyzicoData.buyerAddress,
            city: iyzicoData.buyerCity,
            country: iyzicoData.buyerCountry,
            zipCode: iyzicoData.buyerZipCode,
          },
          shippingAddress: {
            contactName: iyzicoData.shippingContactName,
            city: iyzicoData.shippingCity,
            country: iyzicoData.shippingCountry,
            address: iyzicoData.shippingAddress,
            zipCode: iyzicoData.shippingZipCode,
          },
          billingAddress: {
            contactName: iyzicoData.billingContactName,
            city: iyzicoData.billingCity,
            country: iyzicoData.billingCountry,
            address: iyzicoData.billingAddress,
            zipCode: iyzicoData.billingZipCode,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess(data);
      } else {
        onError(data.errorMessage || 'Ödeme işlemi başarısız');
      }
    } catch (error) {
      onError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(.{2})/, '$1/');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Yöntemi Seçin</h2>
        <p className="text-gray-600">Toplam: ₺{total.toLocaleString()}</p>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setPaymentMethod('paytr')}
            className={`p-4 border-2 rounded-lg transition-all ${
              paymentMethod === 'paytr'
                ? 'border-[#CBA135] bg-[#CBA135]/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-[#CBA135]" />
              <div>
                <h3 className="font-semibold text-gray-900">PayTR</h3>
                <p className="text-sm text-gray-600">Güvenli ödeme</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod('iyzico')}
            className={`p-4 border-2 rounded-lg transition-all ${
              paymentMethod === 'iyzico'
                ? 'border-[#CBA135] bg-[#CBA135]/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-[#CBA135]" />
              <div>
                <h3 className="font-semibold text-gray-900">Iyzico</h3>
                <p className="text-sm text-gray-600">Kredi kartı</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* PayTR Form */}
      {paymentMethod === 'paytr' && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handlePaytrSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Soyad *
              </label>
              <input
                type="text"
                value={paytrData.customerName}
                onChange={(e) => setPaytrData(prev => ({ ...prev, customerName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-posta *
              </label>
              <input
                type="email"
                value={paytrData.customerEmail}
                onChange={(e) => setPaytrData(prev => ({ ...prev, customerEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon *
              </label>
              <input
                type="tel"
                value={paytrData.customerPhone}
                onChange={(e) => setPaytrData(prev => ({ ...prev, customerPhone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adres *
              </label>
              <textarea
                value={paytrData.customerAddress}
                onChange={(e) => setPaytrData(prev => ({ ...prev, customerAddress: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                rows={3}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                İşleniyor...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                PayTR ile Güvenli Ödeme
              </>
            )}
          </button>
        </motion.form>
      )}

      {/* Iyzico Form */}
      {paymentMethod === 'iyzico' && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleIyziCoSubmit}
          className="space-y-6"
        >
          {/* Card Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Kart Bilgileri
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kart Sahibi *
                </label>
                <input
                  type="text"
                  value={iyzicoData.cardHolderName}
                  onChange={(e) => setIyziCoData(prev => ({ ...prev, cardHolderName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                  placeholder="Kart üzerindeki isim"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kart Numarası *
                </label>
                <input
                  type="text"
                  value={iyzicoData.cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    setIyziCoData(prev => ({ ...prev, cardNumber: formatted }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Son Kullanma Tarihi *
                </label>
                <input
                  type="text"
                  value={iyzicoData.expireMonth}
                  onChange={(e) => {
                    const formatted = formatExpiryDate(e.target.value);
                    setIyziCoData(prev => ({ ...prev, expireMonth: formatted }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVC *
                </label>
                <input
                  type="text"
                  value={iyzicoData.cvc}
                  onChange={(e) => setIyziCoData(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '') }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taksit Sayısı
                </label>
                <select
                  value={iyzicoData.installment}
                  onChange={(e) => setIyziCoData(prev => ({ ...prev, installment: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                >
                  {[1, 2, 3, 6, 9, 12].map(num => (
                    <option key={num} value={num}>
                      {num === 1 ? 'Tek Çekim' : `${num} Taksit`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Buyer Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Fatura Bilgileri</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad *</label>
                <input
                  type="text"
                  value={iyzicoData.buyerName}
                  onChange={(e) => setIyziCoData(prev => ({ ...prev, buyerName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soyad *</label>
                <input
                  type="text"
                  value={iyzicoData.buyerSurname}
                  onChange={(e) => setIyziCoData(prev => ({ ...prev, buyerSurname: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No *</label>
                <input
                  type="text"
                  value={iyzicoData.buyerIdentityNumber}
                  onChange={(e) => setIyziCoData(prev => ({ ...prev, buyerIdentityNumber: e.target.value.replace(/\D/g, '') }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                  maxLength={11}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                <input
                  type="tel"
                  value={iyzicoData.buyerGsmNumber}
                  onChange={(e) => setIyziCoData(prev => ({ ...prev, buyerGsmNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                <input
                  type="email"
                  value={iyzicoData.buyerEmail}
                  onChange={(e) => setIyziCoData(prev => ({ ...prev, buyerEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şehir *</label>
                <input
                  type="text"
                  value={iyzicoData.buyerCity}
                  onChange={(e) => setIyziCoData(prev => ({ ...prev, buyerCity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu *</label>
                <input
                  type="text"
                  value={iyzicoData.buyerZipCode}
                  onChange={(e) => setIyziCoData(prev => ({ ...prev, buyerZipCode: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
                <textarea
                  value={iyzicoData.buyerAddress}
                  onChange={(e) => setIyziCoData(prev => ({ ...prev, buyerAddress: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                İşleniyor...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Güvenli Ödeme Yap
              </>
            )}
          </button>
        </motion.form>
      )}

      {/* Security Info */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900">Güvenli Ödeme</h4>
            <p className="text-sm text-green-700 mt-1">
              Tüm ödeme işlemleriniz SSL sertifikası ile korunmaktadır. 
              Kart bilgileriniz güvenli sunucularda saklanmaz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
