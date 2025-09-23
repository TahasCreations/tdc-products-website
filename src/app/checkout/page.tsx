'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useOrder } from '../../contexts/OrderContext';
import { useRouter } from 'next/navigation';
import { useToast } from '../../components/Toast';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const AdvancedPaymentSystem = dynamic(() => import('../../components/payment/AdvancedPaymentSystem'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />,
  ssr: false
});

const SimpleRecommendationEngine = dynamic(() => import('../../components/ai/SimpleRecommendationEngine'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
  ssr: false
});

export default function CheckoutPage() {
  const { state: cartState } = useCart();
  const { user } = useAuth();
  const { createOrder, loading } = useOrder();
  const router = useRouter();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'Türkiye'
  });

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [useAdvancedPayment, setUseAdvancedPayment] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth?redirect=checkout');
      return;
    }

    if (cartState.items.length === 0) {
      router.push('/cart');
      return;
    }

    // Kullanıcı bilgilerini form'a doldur
    if (user.user_metadata) {
      setFormData(prev => ({
        ...prev,
        first_name: user.user_metadata.first_name || '',
        last_name: user.user_metadata.last_name || '',
        email: user.email || ''
      }));
    }
  }, [user, cartState.items.length, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      addToast({
        type: 'error',
        title: 'Hata',
        message: 'Kupon kodu girin',
        duration: 3000
      });
      return;
    }

    setIsApplyingCoupon(true);

    try {
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'},
        body: JSON.stringify({
          code: couponCode.trim(),
          total_amount: cartState.total
        })});

      const data = await response.json();

      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponCode('');
        addToast({
          type: 'success',
          title: 'Kupon Uygulandı!',
          message: `${data.coupon.discount_amount.toLocaleString('tr-TR')}₺ indirim uygulandı`,
          duration: 3000
        });
      } else {
        addToast({
          type: 'error',
          title: 'Kupon Hatası',
          message: data.error,
          duration: 5000
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Hata',
        message: 'Kupon uygulanırken bir hata oluştu',
        duration: 5000
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    addToast({
      type: 'info',
      title: 'Kupon Kaldırıldı',
      message: 'Kupon kaldırıldı',
      duration: 3000
    });
  };

  const calculateTotal = () => {
    let total = cartState.total;
    if (appliedCoupon) {
      total -= appliedCoupon.discount_amount;
    }
    return Math.max(0, total);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderData = {
        shipping_address: formData,
        payment_method: paymentMethod
      };

      const { order, error } = await createOrder(orderData);

      if (error) {
        addToast({
          type: 'error',
          title: 'Sipariş Hatası',
          message: error.message || 'Sipariş oluşturulurken bir hata oluştu',
          duration: 5000
        });
      } else {
        addToast({
          type: 'success',
          title: 'Sipariş Başarılı!',
          message: 'Siparişiniz başarıyla oluşturuldu',
          duration: 5000
        });
        router.push(`/orders/${order?.id}`);
      }
    } catch (error) {
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

  const handleAdvancedPaymentSuccess = async (paymentData: any) => {
    try {
      const orderData = {
        shipping_address: formData,
        payment_method: paymentData.method,
        payment_details: paymentData,
        advanced_payment: true
      };

      const { order, error } = await createOrder(orderData);

      if (error) {
        addToast({
          type: 'error',
          title: 'Sipariş Hatası',
          message: error.message || 'Sipariş oluşturulurken bir hata oluştu',
          duration: 5000
        });
      } else {
        addToast({
          type: 'success',
          title: 'Ödeme ve Sipariş Başarılı!',
          message: 'Ödemeniz tamamlandı ve siparişiniz oluşturuldu',
          duration: 5000
        });
        router.push(`/orders/${order?.id}`);
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Hata',
        message: 'Beklenmeyen bir hata oluştu',
        duration: 5000
      });
    }
  };

  const handleAdvancedPaymentError = (error: any) => {
    addToast({
      type: 'error',
      title: 'Ödeme Hatası',
      message: error.message || 'Ödeme işlemi başarısız oldu',
      duration: 5000
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-user-line text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Giriş Yapmanız Gerekli
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ödeme yapmak için lütfen giriş yapın
          </p>
          <Link
            href="/auth?redirect=checkout"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-shopping-cart-line text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Sepetiniz Boş
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ödeme yapmak için sepetinizde ürün olmalı
          </p>
          <Link
            href="/products"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Ürünlere Git
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Ödeme</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Siparişinizi tamamlamak için bilgilerinizi girin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Taraf - Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Teslimat Bilgileri */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Teslimat Bilgileri
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ad *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    required
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Adres *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Şehir *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Posta Kodu *
                  </label>
                  <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    required
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Ödeme Yöntemi */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Ödeme Yöntemi
              </h2>
              
              {/* Gelişmiş Ödeme Sistemi Toggle */}
              <div className="mb-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useAdvancedPayment}
                    onChange={(e) => setUseAdvancedPayment(e.target.checked)}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    Gelişmiş Ödeme Sistemi (Kredi kartı, Kripto, Mobil ödeme, Taksit seçenekleri)
                  </span>
                </label>
              </div>

              {useAdvancedPayment ? (
                <AdvancedPaymentSystem
                  amount={calculateTotal()}
                  currency="TRY"
                  onPaymentSuccess={handleAdvancedPaymentSuccess}
                  onPaymentError={handleAdvancedPaymentError}
                  customerInfo={{
                    name: `${formData.first_name} ${formData.last_name}`,
                    email: formData.email,
                    phone: formData.phone
                  }}
                />
              ) : (
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <i className="ri-bank-card-line text-xl text-gray-600 dark:text-gray-400"></i>
                    <span className="text-gray-700 dark:text-gray-300">Kredi Kartı</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <i className="ri-bank-line text-xl text-gray-600 dark:text-gray-400"></i>
                    <span className="text-gray-700 dark:text-gray-300">Banka Havalesi</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash_on_delivery"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <i className="ri-money-dollar-circle-line text-xl text-gray-600 dark:text-gray-400"></i>
                    <span className="text-gray-700 dark:text-gray-300">Kapıda Ödeme</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Sağ Taraf - Özet */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Sipariş Özeti
              </h2>
              
              <div className="space-y-4 mb-6">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Adet: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Kupon Alanı */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                {appliedCoupon ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          Kupon: {appliedCoupon.code}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-300">
                          {appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}% indirim` : `${appliedCoupon.value}₺ indirim`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                      >
                        <i className="ri-close-line text-lg"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Kupon kodu"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponCode.trim()}
                        className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        {isApplyingCoupon ? (
                          <i className="ri-loader-4-line animate-spin"></i>
                        ) : (
                          'Uygula'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Ara Toplam:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatPrice(cartState.total)}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">İndirim:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      -{formatPrice(appliedCoupon.discount_amount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Kargo:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">Ücretsiz</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900 dark:text-gray-100">Toplam:</span>
                    <span className="text-orange-600 dark:text-orange-400">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isProcessing || loading}
                className="w-full mt-6 bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing || loading ? (
                  <div className="flex items-center justify-center">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    İşleniyor...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <i className="ri-bank-card-line mr-2"></i>
                    Siparişi Tamamla
                  </div>
                )}
              </button>
              
              <div className="mt-4 text-center">
                <Link
                  href="/cart"
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium text-sm"
                >
                  <i className="ri-arrow-left-line mr-1"></i>
                  Sepete Dön
                </Link>
              </div>
            </div>
          </div>
        </form>

        {/* AI Önerileri */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                🤖 Son Fırsat Önerileri
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Ödeme yapmadan önce bu özel figürleri de gözden geçirin
              </p>
            </div>
            <SimpleRecommendationEngine
              context="checkout"
              limit={4}
              
              
            />
          </div>
        </section>
      </div>
    </div>
  );
}
