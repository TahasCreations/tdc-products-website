"use client";

// Client components are dynamic by default

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Package, Gift, Star, Check, Sparkles, TrendingUp } from 'lucide-react';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic Box',
    price: 299,
    description: 'Aylık sürpriz figür kutusu',
    features: [
      '1 adet premium figür',
      'Özel kutulu paketleme',
      'Koleksiyoner kartı',
      'Ücretsiz kargo',
    ],
    value: 400,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'premium',
    name: 'Premium Box',
    price: 599,
    description: 'Limited edition ürünler',
    features: [
      '2 adet premium figür',
      '1 adet limited edition',
      'Özel kutulu paketleme',
      'Koleksiyoner kartları',
      'Erken erişim',
      'Ücretsiz kargo',
    ],
    value: 850,
    popular: true,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'ultimate',
    name: 'Ultimate Box',
    price: 999,
    description: 'En özel koleksiyon',
    features: [
      '3 adet premium figür',
      '2 adet limited edition',
      'Özel VIP paketleme',
      'Signed koleksiyoner kartları',
      'Exclusive ürünler',
      'VIP erken erişim',
      'Ücretsiz express kargo',
    ],
    value: 1500,
    color: 'from-yellow-500 to-orange-500',
  },
];

const PAST_BOXES = [
  { month: 'Kasım 2024', theme: 'Anime Legends', rating: 4.8, reviews: 234 },
  { month: 'Ekim 2024', theme: 'Gaming Heroes', rating: 4.9, reviews: 312 },
  { month: 'Eylül 2024', theme: 'Marvel Universe', rating: 4.7, reviews: 289 },
];

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const getPrice = (plan: typeof PLANS[0]) => {
    return billingCycle === 'annual' ? Math.floor(plan.price * 0.85) : plan.price;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4"
          >
            <Package className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Aylık Sürpriz Kutusu
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Her ay kapınıza özel seçilmiş figürler
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center space-x-4 bg-white rounded-full p-2 shadow-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-gray-600'
              }`}
            >
              Aylık
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full font-semibold transition-all relative ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-gray-600'
              }`}
            >
              Yıllık
              <span className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                %15 İndirim
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative bg-white rounded-3xl shadow-xl overflow-hidden ${
                plan.popular ? 'ring-4 ring-purple-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 font-bold text-sm">
                  🔥 EN POPÜLER
                </div>
              )}

              <div className={`bg-gradient-to-r ${plan.color} p-6 ${plan.popular ? 'pt-12' : ''}`}>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-white/90 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-bold text-white">
                    ₺{getPrice(plan)}
                  </span>
                  <span className="text-white/80">/ ay</span>
                </div>
                {billingCycle === 'annual' && (
                  <p className="text-white/80 text-sm mt-2">
                    <s>₺{plan.price}</s> önceki fiyat
                  </p>
                )}
                <div className="mt-4 p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <p className="text-white text-sm font-semibold">
                    Toplam Değer: ₺{plan.value}
                  </p>
                  <p className="text-white/80 text-xs">
                    %{Math.round(((plan.value - plan.price) / plan.value) * 100)} tasarruf!
                  </p>
                </div>
              </div>

              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all ${
                    selectedPlan === plan.id
                      ? `bg-gradient-to-r ${plan.color} text-white shadow-2xl`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Seçildi ✓' : 'Seç'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Nasıl Çalışır?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Package, title: '1. Planını Seç', desc: 'Size uygun kutu planını seçin' },
              { icon: Sparkles, title: '2. Kişiselleştir', desc: 'Tercihlerinizi belirtin' },
              { icon: Gift, title: '3. Sürprizini Al', desc: 'Her ay kapınıza gelsin' },
              { icon: Star, title: '4. Keyfini Çıkar', desc: 'Koleksiyonunuzu büyütün' },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Past Boxes */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Geçmiş Kutular
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAST_BOXES.map((box, index) => (
              <div
                key={index}
                className="p-6 border-2 border-gray-100 rounded-2xl hover:border-purple-200 transition-all"
              >
                <h4 className="font-bold text-gray-900 mb-2">{box.month}</h4>
                <p className="text-purple-600 font-semibold mb-3">{box.theme}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-bold">{box.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">{box.reviews} yorum</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

