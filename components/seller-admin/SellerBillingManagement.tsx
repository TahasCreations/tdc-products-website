'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Check,
  Crown,
  Zap,
  Star,
  Rocket,
  Globe,
  Package,
  TrendingUp,
  Users,
  BarChart,
  Shield,
  Calendar,
  Download,
} from 'lucide-react';

interface SellerBillingManagementProps {
  data: {
    seller: {
      id: string;
      storeName: string;
      storeSlug: string;
    };
    currentSubscription: {
      id: string;
      plan: string;
      status: string;
      billingCycle: string;
      price: number | null;
      currency: string;
      periodStart: string;
      periodEnd: string;
    } | null;
    subscriptionHistory: Array<any>;
    domainAllowances: Array<any>;
  };
}

const plans = [
  {
    id: 'FREE',
    name: 'Ücretsiz',
    price: 0,
    icon: Package,
    color: 'from-gray-500 to-gray-600',
    features: [
      '5 ürüne kadar',
      'Temel mağaza tasarımı',
      'TDC subdomain',
      '%10 komisyon',
      'Temel analitik',
      'E-posta desteği',
    ],
    limits: {
      products: 5,
      domains: 0,
      commission: 10,
    },
  },
  {
    id: 'STARTER',
    name: 'Başlangıç',
    price: 299,
    icon: Star,
    color: 'from-blue-500 to-indigo-600',
    popular: false,
    features: [
      '50 ürüne kadar',
      'Gelişmiş tema özelleştirme',
      '1 custom domain',
      '%7 komisyon',
      'Gelişmiş analitik',
      'Öncelikli destek',
      'SEO araçları',
    ],
    limits: {
      products: 50,
      domains: 1,
      commission: 7,
    },
  },
  {
    id: 'GROWTH',
    name: 'Büyüme',
    price: 599,
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-600',
    popular: true,
    features: [
      '200 ürüne kadar',
      'Tüm tema özellikleri',
      '3 custom domain',
      '%5 komisyon',
      'Premium analitik',
      '7/24 destek',
      'Gelişmiş SEO',
      'Reklam kampanyaları',
      'Email pazarlama',
    ],
    limits: {
      products: 200,
      domains: 3,
      commission: 5,
    },
  },
  {
    id: 'PRO',
    name: 'Profesyonel',
    price: 1299,
    icon: Rocket,
    color: 'from-orange-500 to-red-600',
    popular: false,
    features: [
      'Sınırsız ürün',
      'Özel tema geliştirme',
      '10 custom domain',
      '%3 komisyon',
      'AI destekli analitik',
      'Özel hesap yöneticisi',
      'API erişimi',
      'Toplu ürün yükleme',
      'Multi-channel satış',
      'Özel entegrasyonlar',
    ],
    limits: {
      products: -1, // unlimited
      domains: 10,
      commission: 3,
    },
  },
];

export default function SellerBillingManagement({ data }: SellerBillingManagementProps) {
  const { seller, currentSubscription, subscriptionHistory } = data;
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [isUpgrading, setIsUpgrading] = useState(false);

  const currentPlan = currentSubscription?.plan || 'FREE';

  const handleUpgrade = async (planId: string) => {
    setIsUpgrading(true);
    try {
      const response = await fetch('/api/seller/subscription/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: seller.id,
          plan: planId,
          billingCycle,
        }),
      });

      if (response.ok) {
        alert('Plan yükseltme işlemi başlatıldı!');
        window.location.reload();
      } else {
        alert('Plan yükseltilirken hata oluştu');
      }
    } catch (error) {
      alert('Bir hata oluştu');
    } finally {
      setIsUpgrading(false);
    }
  };

  const getDiscountedPrice = (price: number) => {
    if (billingCycle === 'YEARLY') {
      return price * 12 * 0.8; // 20% discount for yearly
    }
    return price;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Abonelik & Faturalama</h1>
        <p className="text-gray-600">
          Planınızı yönetin ve faturalarınızı görüntüleyin
        </p>
      </div>

      {/* Current Plan */}
      {currentSubscription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/80 mb-1">Mevcut Planınız</p>
                <h2 className="text-3xl font-bold">{currentPlan} Plan</h2>
              </div>
              <Crown className="w-12 h-12 text-yellow-300" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-white/80 text-sm mb-1">Faturalama Dönemi</p>
                <p className="text-xl font-semibold">
                  {currentSubscription.billingCycle === 'MONTHLY' ? 'Aylık' : 'Yıllık'}
                </p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Sonraki Ödeme</p>
                <p className="text-xl font-semibold">
                  {new Date(currentSubscription.periodEnd).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Aylık Tutar</p>
                <p className="text-xl font-semibold">
                  ₺{currentSubscription.price?.toLocaleString('tr-TR') || '0'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={`font-medium ${billingCycle === 'MONTHLY' ? 'text-gray-900' : 'text-gray-500'}`}>
          Aylık
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'MONTHLY' ? 'YEARLY' : 'MONTHLY')}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            billingCycle === 'YEARLY' ? 'bg-indigo-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
              billingCycle === 'YEARLY' ? 'translate-x-7' : ''
            }`}
          />
        </button>
        <span className={`font-medium ${billingCycle === 'YEARLY' ? 'text-gray-900' : 'text-gray-500'}`}>
          Yıllık
        </span>
        {billingCycle === 'YEARLY' && (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
            %20 İndirim
          </span>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => {
          const PlanIcon = plan.icon;
          const isCurrentPlan = currentPlan === plan.id;
          const price = getDiscountedPrice(plan.price);

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl border-2 overflow-hidden relative ${
                plan.popular
                  ? 'border-indigo-600 shadow-xl scale-105'
                  : isCurrentPlan
                  ? 'border-green-500'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                  En Popüler
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 text-sm font-semibold">
                  Mevcut Planınız
                </div>
              )}

              <div className={`p-6 ${plan.popular || isCurrentPlan ? 'pt-12' : ''}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <PlanIcon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      ₺{billingCycle === 'YEARLY' ? Math.round(price) : plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /{billingCycle === 'YEARLY' ? 'yıl' : 'ay'}
                    </span>
                  </div>
                  {billingCycle === 'YEARLY' && plan.price > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      ₺{Math.round(price / 12)}/ay
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <button
                    disabled
                    className="w-full px-6 py-3 bg-green-100 text-green-700 rounded-xl font-semibold cursor-not-allowed"
                  >
                    Aktif Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isUpgrading}
                    className={`w-full px-6 py-3 rounded-xl font-semibold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } disabled:opacity-50`}
                  >
                    {plan.id === 'FREE' ? 'Düşür' : 'Yükselt'}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Subscription History */}
      {subscriptionHistory.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Abonelik Geçmişi</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {subscriptionHistory.map((sub) => (
              <div key={sub.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{sub.plan} Plan</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      sub.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : sub.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {sub.status === 'active' ? 'Aktif' : sub.status === 'cancelled' ? 'İptal' : 'Pasif'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(sub.periodStart).toLocaleDateString('tr-TR')} - {new Date(sub.periodEnd).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ₺{sub.price?.toLocaleString('tr-TR') || '0'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {sub.billingCycle === 'MONTHLY' ? 'Aylık' : 'Yıllık'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

