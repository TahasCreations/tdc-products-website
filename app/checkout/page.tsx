"use client";

// Force dynamic rendering to avoid prerendering errors
export const dynamic = 'force-dynamic';

import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, User, Phone, Mail, Lock } from 'lucide-react';
import Image from 'next/image';
import ShippingCalculator from '@/components/shipping/ShippingCalculator';
import PaymentMethods from '@/components/payment/PaymentMethods';
import { usePayment } from '@/hooks/usePayment';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'credit' | 'bank' | 'cash';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

export default function CheckoutPage() {
  const { state, getTotalPrice } = useCart();
  const { createOrder, processPayment, error } = usePayment();
  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'credit',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedShipping, setSelectedShipping] = useState<{
    id: string;
    name: string;
    price: number;
  } | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);

  const shipping = selectedShipping?.price || 0;
  const tax = getTotalPrice() * 0.18;
  const finalTotal = getTotalPrice() + shipping + tax;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName) newErrors.firstName = 'Ad gereklidir';
    if (!form.lastName) newErrors.lastName = 'Soyad gereklidir';
    if (!form.email) newErrors.email = 'E-posta gereklidir';
    if (!form.phone) newErrors.phone = 'Telefon gereklidir';
    if (!form.address) newErrors.address = 'Adres gereklidir';
    if (!form.city) newErrors.city = 'Şehir gereklidir';
    if (!form.postalCode) newErrors.postalCode = 'Posta kodu gereklidir';

    if (form.paymentMethod === 'credit') {
      if (!form.cardNumber) newErrors.cardNumber = 'Kart numarası gereklidir';
      if (!form.expiryDate) newErrors.expiryDate = 'Son kullanma tarihi gereklidir';
      if (!form.cvv) newErrors.cvv = 'CVV gereklidir';
      if (!form.cardName) newErrors.cardName = 'Kart üzerindeki isim gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);
    
    try {
      // Önce sipariş oluştur
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.items,
          customerInfo: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
          },
          shippingAddress: {
            address: form.address,
            city: form.city,
            postalCode: form.postalCode,
          },
          total: finalTotal,
          paymentMethod: form.paymentMethod,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Sipariş oluşturulamadı');
      }

      const orderData = await orderResponse.json();
      
      if (form.paymentMethod === 'credit') {
        // PayTR ile ödeme
        const paymentResponse = await fetch('/api/payment/paytr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.orderNumber,
            amount: finalTotal,
            currency: 'TRY',
            customerEmail: form.email,
            customerName: `${form.firstName} ${form.lastName}`,
            customerPhone: form.phone,
            customerAddress: form.address,
            productName: `${state.items.length} ürün`,
            basket: state.items.map(item => ({
              name: item.title,
              price: item.price,
              quantity: item.quantity,
            })),
            successUrl: `${window.location.origin}/order-success?order=${orderData.orderNumber}`,
            failUrl: `${window.location.origin}/order-failed?order=${orderData.orderNumber}`,
          }),
        });

        if (!paymentResponse.ok) {
          throw new Error('Ödeme başlatılamadı');
        }

        const paymentData = await paymentResponse.json();
        
        // PayTR iframe'ine yönlendir
        window.location.href = paymentData.paymentUrl;
      } else {
        // Kapıda ödeme veya banka havalesi için sipariş onay sayfasına yönlendir
        window.location.href = `/order-success?order=${orderData.orderNumber}&method=${form.paymentMethod}`;
      }
    } catch (error) {
      console.error('Ödeme hatası:', error);
      alert('Ödeme sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sepetiniz Boş</h2>
          <p className="text-gray-600">Ödeme yapmak için önce sepetinize ürün ekleyin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ödeme</h1>
          <p className="text-gray-600">Sipariş bilgilerinizi tamamlayın</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                İletişim Bilgileri
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soyad *</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Teslimat Adresi
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Şehir *</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu *</label>
                    <input
                      type="text"
                      value={form.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent ${
                        errors.postalCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Options */}
            {form.city && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <ShippingCalculator
                  items={state.items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    weight: 0.5, // Default weight
                    dimensions: {
                      length: 20,
                      width: 15,
                      height: 10
                    }
                  }))}
                  destination={{
                    city: form.city,
                    postalCode: form.postalCode,
                    country: 'Turkey'
                  }}
                  onOptionSelect={(option) => {
                    setSelectedShipping({
                      id: option.id,
                      name: option.name,
                      price: option.price
                    });
                  }}
                  selectedOption={selectedShipping?.id}
                />
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <PaymentMethods
                amount={finalTotal}
                currency="TRY"
                onMethodSelect={setSelectedPaymentMethod}
                selectedMethod={selectedPaymentMethod?.id}
                onProceed={(method, formData) => {
                  console.log('Payment method selected:', method, formData);
                }}
              />
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">Adet: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ₺{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="text-gray-900">₺{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {selectedShipping ? selectedShipping.name : 'Kargo'}
                  </span>
                  <span className={shipping === 0 ? "text-green-600" : "text-gray-900"}>
                    {shipping === 0 ? 'Ücretsiz' : `₺${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">KDV (%18)</span>
                  <span className="text-gray-900">₺{tax.toLocaleString()}</span>
                  </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Toplam</span>
                    <span className="text-gray-900">₺{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center px-6 py-3 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Siparişi Tamamla
                  </>
                )}
              </button>

              {/* Security Info */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  🔒 SSL ile güvenli ödeme
                </p>
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}