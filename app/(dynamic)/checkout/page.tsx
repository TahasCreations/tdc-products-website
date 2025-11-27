"use client";

// Client components are dynamic by default, no need for export const dynamic

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  Truck,
  Shield,
  Check,
  ChevronLeft,
  ChevronRight,
  Package,
  Lock,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const CouponInput = dynamic(() => import('@/components/checkout/CouponInput'), {
  loading: () => <div className="h-20 bg-gray-100 animate-pulse rounded-xl" />,
});
const TrustBadges = dynamic(() => import('@/components/checkout/TrustBadges'), {
  loading: () => <div className="h-16 bg-gray-100 animate-pulse rounded-xl" />,
});
const ProductRecommendations = dynamic(() => import('@/components/checkout/ProductRecommendations'), {
  loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-xl" />,
});
const SocialProof = dynamic(() => import('@/components/checkout/SocialProof'), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-xl" />,
});
const InstallmentCalculator = dynamic(() => import('@/components/checkout/InstallmentCalculator'), {
  loading: () => <div className="h-24 bg-gray-100 animate-pulse rounded-xl" />,
});

type CheckoutStep = 'info' | 'address' | 'payment' | 'review';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  addressNote: string;
  paymentMethod: 'credit' | 'bank';
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export default function CheckoutPage() {
  const { state, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('info');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToDistanceSales, setAgreedToDistanceSales] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  } | null>(null);

  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    addressNote: '',
    paymentMethod: 'credit',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});

  // Sepet boşsa anasayfaya yönlendir
  if (state.items.length === 0) {
    router.push('/products');
    return null;
  }

  // Fiyat hesaplamaları
  const subtotal = getTotalPrice();
  const couponDiscount = appliedCoupon?.discount || 0;
  const subtotalAfterCoupon = Math.max(0, subtotal - couponDiscount);
  const shipping = subtotalAfterCoupon >= 500 ? 0 : 125;
  const tax = subtotalAfterCoupon * 0.18;
  const total = subtotalAfterCoupon + shipping + tax;

  const steps = [
    { id: 'info', title: 'Bilgiler', icon: User },
    { id: 'address', title: 'Adres', icon: MapPin },
    { id: 'payment', title: 'Ödeme', icon: CreditCard },
    { id: 'review', title: 'Onay', icon: Check },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const validateStep = (step: CheckoutStep): boolean => {
    const newErrors: Partial<Record<keyof CheckoutForm, string>> = {};

    if (step === 'info') {
      if (!form.firstName.trim()) newErrors.firstName = 'Ad gerekli';
      if (!form.lastName.trim()) newErrors.lastName = 'Soyad gerekli';
      if (!form.email.trim()) newErrors.email = 'E-posta gerekli';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = 'Geçerli bir e-posta girin';
      }
      if (!form.phone.trim()) newErrors.phone = 'Telefon gerekli';
    } else if (step === 'address') {
      if (!form.address.trim()) newErrors.address = 'Adres gerekli';
      if (!form.city.trim()) newErrors.city = 'Şehir gerekli';
      if (!form.district.trim()) newErrors.district = 'İlçe gerekli';
      if (!form.postalCode.trim()) newErrors.postalCode = 'Posta kodu gerekli';
    } else if (step === 'payment') {
      if (form.paymentMethod === 'credit') {
        if (!form.cardNumber.trim()) newErrors.cardNumber = 'Kart numarası gerekli';
        if (!form.cardName.trim()) newErrors.cardName = 'Kart sahibi gerekli';
        if (!form.expiryDate.trim()) newErrors.expiryDate = 'Son kullanma tarihi gerekli';
        if (!form.cvv.trim()) newErrors.cvv = 'CVV gerekli';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex].id as CheckoutStep);
      }
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id as CheckoutStep);
    }
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      alert('Lütfen kullanım koşullarını kabul edin');
      return;
    }

    if (!agreedToDistanceSales) {
      alert('Lütfen mesafeli satış sözleşmesini kabul edin');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/orders', {
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
            district: form.district,
            note: form.addressNote,
          },
          total: total,
          paymentMethod: form.paymentMethod,
          couponCode: appliedCoupon?.code,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        clearCart();
        setTimeout(() => {
          router.push(`/orders/${data.orderNumber || 'success'}`);
        }, 1000);
      } else {
        throw new Error('Sipariş oluşturulamadı');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
      setIsProcessing(false);
    }
  };

  const updateForm = (field: keyof CheckoutForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCouponApply = (code: string, discount: number) => {
    setAppliedCoupon({ code, discount, type: 'fixed' });
  };

  const handleCouponRemove = () => {
    setAppliedCoupon(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center space-x-2 mb-2 sm:mb-4"
          >
            <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-[#CBA135]" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Ödeme</h1>
          </motion.div>

          {/* Progress Steps - Mobile Scrollable */}
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex justify-center space-x-2 sm:space-x-4 min-w-max sm:min-w-0">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = index < currentStepIndex;

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                            : isCompleted
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                          <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                      </div>
                      <span className={`mt-2 text-xs sm:text-sm font-medium ${
                        isActive ? 'text-indigo-600' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content - Mobile First Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Form Section - Mobile First */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            
            {/* Step Content */}
            <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-100 p-4 sm:p-6">
              {currentStep === 'info' && (
                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Kişisel Bilgiler</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Ad *</label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => updateForm('firstName', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base"
                        placeholder="Adınız"
                      />
                      {errors.firstName && (
                        <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Soyad *</label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => updateForm('lastName', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base"
                        placeholder="Soyadınız"
                      />
                      {errors.lastName && (
                        <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">E-posta *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base"
                      placeholder="ornek@email.com"
                    />
                    {errors.email && (
                      <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Telefon *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base"
                      placeholder="05XX XXX XX XX"
                    />
                    {errors.phone && (
                      <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 'address' && (
                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Teslimat Adresi</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Adres *</label>
                    <textarea
                      value={form.address}
                      onChange={(e) => updateForm('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base"
                      placeholder="Açık adresiniz"
                    />
                    {errors.address && (
                      <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Şehir *</label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => updateForm('city', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base"
                        placeholder="Şehir"
                      />
                      {errors.city && (
                        <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">İlçe *</label>
                      <input
                        type="text"
                        value={form.district}
                        onChange={(e) => updateForm('district', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base"
                        placeholder="İlçe"
                      />
                      {errors.district && (
                        <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.district}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Posta Kodu</label>
                    <input
                      type="text"
                      value={form.postalCode}
                      onChange={(e) => updateForm('postalCode', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base"
                      placeholder="34000"
                    />
                  </div>
                </div>
              )}

              {currentStep === 'payment' && (
                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Ödeme Yöntemi</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'credit', label: 'Kredi Kartı', icon: CreditCard },
                      { value: 'bank', label: 'Banka Havalesi', icon: Lock },
                    ].map((method) => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => updateForm('paymentMethod', method.value)}
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                          form.paymentMethod === method.value
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <method.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-gray-700" />
                        <p className="text-xs sm:text-sm font-medium text-gray-900">{method.label}</p>
                      </button>
                    ))}
                  </div>

                  {form.paymentMethod === 'credit' && (
                    <div className="space-y-3 sm:space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Kart Numarası *</label>
                        <input
                          type="text"
                          value={form.cardNumber}
                          onChange={(e) => updateForm('cardNumber', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        {errors.cardNumber && (
                          <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.cardNumber}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Kart Üzerindeki İsim *</label>
                        <input
                          type="text"
                          value={form.cardName}
                          onChange={(e) => updateForm('cardName', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base"
                          placeholder="AD SOYAD"
                        />
                        {errors.cardName && (
                          <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.cardName}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Son Kullanma *</label>
                          <input
                            type="text"
                            value={form.expiryDate}
                            onChange={(e) => updateForm('expiryDate', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          {errors.expiryDate && (
                            <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.expiryDate}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">CVV *</label>
                          <input
                            type="text"
                            value={form.cvv}
                            onChange={(e) => updateForm('cvv', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base"
                            placeholder="123"
                            maxLength={4}
                          />
                          {errors.cvv && (
                            <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 'review' && (
                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Sipariş Özeti</h2>
                  
                  {/* Mesafeli Satış Sözleşmesi Onayı */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <label className="flex items-start space-x-2 sm:space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToDistanceSales}
                        onChange={(e) => setAgreedToDistanceSales(e.target.checked)}
                        className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          <Link href="/mesafeli-satis-sozlesmesi" target="_blank" className="text-indigo-600 hover:underline">
                            Mesafeli Satış Sözleşmesi
                          </Link>
                          'ni okudum ve kabul ediyorum. *
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Mesafeli satış sözleşmesini kabul etmeden sipariş veremezsiniz.
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="space-y-3 text-sm sm:text-base">
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-900 mb-2">Kişisel Bilgiler</p>
                      <p className="text-gray-700">{form.firstName} {form.lastName}</p>
                      <p className="text-gray-600">{form.email}</p>
                      <p className="text-gray-600">{form.phone}</p>
                    </div>

                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-900 mb-2">Teslimat Adresi</p>
                      <p className="text-gray-700">{form.address}</p>
                      <p className="text-gray-600">{form.district}, {form.city} {form.postalCode}</p>
                    </div>

                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-900 mb-2">Ödeme</p>
                      <p className="text-gray-700">
                        {form.paymentMethod === 'credit' ? 'Kredi Kartı' : 'Banka Havalesi'}
                      </p>
                    </div>

                    <label className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 sm:w-5 sm:h-5"
                      />
                      <span className="text-xs sm:text-sm text-gray-700">
                        <Link href="/terms" className="text-indigo-600 hover:underline">Kullanım koşullarını</Link> ve{' '}
                        <Link href="/privacy" className="text-indigo-600 hover:underline">gizlilik politikasını</Link> kabul ediyorum
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons - Mobile Sticky */}
            <div className="sticky bottom-0 sm:static bg-white sm:bg-transparent p-4 sm:p-0 -mx-4 sm:mx-0 border-t sm:border-0 shadow-lg sm:shadow-none">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                {currentStepIndex > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:border-gray-300 transition-all font-semibold text-sm sm:text-base flex items-center justify-center space-x-2"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Geri</span>
                  </button>
                )}

                {currentStep === 'review' ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing || !agreedToTerms || !agreedToDistanceSales}
                    className="flex-1 px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg sm:rounded-xl hover:shadow-xl transition-all font-bold text-sm sm:text-base disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>İşleniyor...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Siparişi Tamamla</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex-1 px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:shadow-xl transition-all font-bold text-sm sm:text-base flex items-center justify-center space-x-2"
                  >
                    <span>Devam Et</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Social Proof - Hidden on Mobile for Performance */}
            <div className="hidden sm:block">
              <SocialProof />
            </div>

            {/* Recommendations - Hidden on Mobile */}
            <div className="hidden lg:block">
              <ProductRecommendations onProductAdd={() => {}} />
            </div>
          </div>

          {/* Sidebar - Order Summary - Mobile: Show at top on review step */}
          <div className={`space-y-4 ${currentStep === 'review' ? 'order-first lg:order-last' : ''}`}>
            <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-100 p-4 sm:p-6 sticky top-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Sipariş Özeti</h2>

              {/* Cart Items - Collapsible on Mobile */}
              <div className="space-y-3 mb-4 max-h-48 sm:max-h-64 overflow-y-auto">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 48px, 64px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-600">
                        {item.quantity} × ₺{item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      ₺{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Coupon Input */}
              <div className="pt-3 border-t">
                <CouponInput
                  onApply={handleCouponApply}
                  onRemove={handleCouponRemove}
                  appliedCoupon={appliedCoupon}
                />
              </div>

              {/* Installment Calculator */}
              <div className="pt-3">
                <InstallmentCalculator totalAmount={total} />
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t text-sm sm:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="font-semibold">₺{subtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>İndirim ({appliedCoupon.code})</span>
                    <span className="font-semibold">-₺{couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Kargo</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>
                    {shipping === 0 ? 'Ücretsiz' : `₺${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">KDV (%18)</span>
                  <span className="font-semibold">₺{tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between pt-3 border-t text-base sm:text-lg">
                  <span className="font-bold text-gray-900">Toplam</span>
                  <span className="font-black text-[#CBA135] text-lg sm:text-2xl">
                    ₺{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t">
                <TrustBadges />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

