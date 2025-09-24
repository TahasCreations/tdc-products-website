'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '../../hooks/useI18n';
import { 
  StarIcon,
  CheckIcon,
  XMarkIcon,
  TruckIcon,
  ShieldCheckIcon,
  GiftIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  benefits: {
    freeShipping: boolean;
    exclusiveDeals: boolean;
    prioritySupport: boolean;
    earlyAccess: boolean;
    personalShopper?: boolean;
    unlimitedReturns?: boolean;
  };
  popular: boolean;
}

export default function SubscriptionsPage() {
  const { t } = useI18n();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/subscriptions/buyer-plans');
        const data = await response.json();
        
        if (data.success) {
          setPlans(data.data);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = (planId: string) => {
    // Mock subscription process
    alert(`Abonelik işlemi başlatılıyor: ${planId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Abonelik planları yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Premium Abonelik Planları
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            TDC Market'te daha iyi alışveriş deneyimi için premium üye olun
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center">
              <CheckIcon className="w-5 h-5 mr-2" />
              Ücretsiz kargo
            </div>
            <div className="flex items-center">
              <CheckIcon className="w-5 h-5 mr-2" />
              Özel indirimler
            </div>
            <div className="flex items-center">
              <CheckIcon className="w-5 h-5 mr-2" />
              Öncelikli destek
            </div>
            <div className="flex items-center">
              <CheckIcon className="w-5 h-5 mr-2" />
              Erken erişim
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-green-500 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    En Popüler
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">₺{plan.price}</span>
                  <span className="text-gray-600">/{plan.interval}</span>
                </div>
                <p className="text-gray-600">Aylık faturalandırma</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                    : plan.price === 0
                    ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }`}
                disabled={plan.price === 0}
              >
                {plan.price === 0 ? 'Mevcut Plan' : 'Abone Ol'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Premium Üyelik Avantajları
            </h2>
            <p className="text-xl text-gray-600">
              TDC Market'te premium üye olmanın faydalarını keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ücretsiz Kargo</h3>
              <p className="text-gray-600">Tüm siparişlerinizde ücretsiz kargo</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GiftIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Özel İndirimler</h3>
              <p className="text-gray-600">Sadece üyelerimize özel kampanyalar</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Öncelikli Destek</h3>
              <p className="text-gray-600">7/24 öncelikli müşteri hizmetleri</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Erken Erişim</h3>
              <p className="text-gray-600">Yeni ürünlere ilk siz erişin</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sık Sorulan Sorular
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aboneliğimi istediğim zaman iptal edebilir miyim?
              </h3>
              <p className="text-gray-600">
                Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal işlemi hemen geçerli olur ve bir sonraki faturalandırma döneminde ücret alınmaz.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Abonelik ücreti ne zaman alınır?
              </h3>
              <p className="text-gray-600">
                Abonelik ücreti aylık olarak alınır. İlk ödeme abonelik başladığında, sonraki ödemeler her ay aynı tarihte otomatik olarak alınır.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Hangi ödeme yöntemlerini kabul ediyorsunuz?
              </h3>
              <p className="text-gray-600">
                Kredi kartı, banka kartı, PayPal ve banka havalesi ile ödeme yapabilirsiniz. Tüm ödemeler güvenli SSL şifreleme ile korunur.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Abonelik avantajları ne zaman aktif olur?
              </h3>
              <p className="text-gray-600">
                Abonelik avantajları ödeme onaylandıktan hemen sonra aktif olur. Ücretsiz kargo, özel indirimler ve diğer tüm avantajlar anında kullanılabilir.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Hemen Premium Üye Olun!
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Binlerce ürün arasından seçim yapın, özel indirimlerden faydalanın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Ürünleri Keşfet
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              İletişime Geç
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
