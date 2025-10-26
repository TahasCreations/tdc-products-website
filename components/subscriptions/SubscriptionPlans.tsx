"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Sparkles,
  Star,
  Rocket,
  Crown,
  Zap
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
}

export const SubscriptionPlans: React.FC = () => {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Başlangıç için mükemmel',
      price: 0,
      currency: 'USD',
      interval: 'month',
      features: [
        '50 ürün',
        '5 GB depolama',
        'Temel destek',
        'Ödemesiz kullanım'
      ],
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      id: 'starter',
      name: 'Starter',
      description: 'Küçük işletmeler için',
      price: 29,
      currency: 'USD',
      interval: 'month',
      features: [
        '500 ürün',
        '50 GB depolama',
        'Email desteği',
        'Temel raporlar',
        'API erişimi'
      ],
      icon: <Star className="w-6 h-6" />
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Büyüyen işletmeler için',
      price: 99,
      currency: 'USD',
      interval: 'month',
      features: [
        'Sınırsız ürün',
        '500 GB depolama',
        'Öncelikli destek',
        'Gelişmiş raporlar',
        'API erişimi',
        'Özel tema',
        'Çoklu dil'
      ],
      popular: true,
      icon: <Rocket className="w-6 h-6" />
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Kurumsal çözümler',
      price: 299,
      currency: 'USD',
      interval: 'month',
      features: [
        'Sınırsız her şey',
        '1 TB depolama',
        '7/24 öncelikli destek',
        'Özel raporlar',
        'API + Webhooks',
        'Özel tema',
        'Çoklu dil',
        'White-label',
        'Dedicated account manager'
      ],
      icon: <Crown className="w-6 h-6" />
    },
  ];

  const getPrice = (plan: Plan) => {
    if (plan.price === 0) return 'Ücretsiz';
    if (billingInterval === 'year') {
      return `$${Math.round(plan.price * 12 * 0.8)}/yıl`;
    }
    return `$${plan.price}/ay`;
  };

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    // Redirect to checkout
    // window.location.href = `/checkout?plan=${planId}&interval=${billingInterval}`;
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4"
          >
            <Zap className="w-4 h-4" />
            Profesyonel Planlar
          </motion.div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            İhtiyacınıza Uygun Planı Seçin
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Büyüyen işletmeniz için esnek ve ölçeklenebilir çözümler
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-sm font-medium ${billingInterval === 'month' ? 'text-gray-900' : 'text-gray-500'}`}>
            Aylık
          </span>
          <button
            onClick={() => setBillingInterval(billingInterval === 'month' ? 'year' : 'month')}
            className="relative w-14 h-8 bg-blue-600 rounded-full p-1 transition-colors"
          >
            <div
              className={`w-6 h-6 bg-white rounded-full transition-transform ${
                billingInterval === 'year' ? 'translate-x-6' : ''
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${billingInterval === 'year' ? 'text-gray-900' : 'text-gray-500'}`}>
            Yıllık
          </span>
          {billingInterval === 'year' && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              %20 İndirim
            </span>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl border-2 p-8 ${
                plan.popular
                  ? 'border-blue-500 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xs font-semibold">
                  Popüler
                </div>
              )}

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                plan.id === 'free' ? 'bg-gray-100 text-gray-600' :
                plan.id === 'starter' ? 'bg-blue-100 text-blue-600' :
                plan.id === 'professional' ? 'bg-purple-100 text-purple-600' :
                'bg-yellow-100 text-yellow-600'
              }`}>
                {plan.icon}
              </div>

              {/* Plan Info */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900">{getPrice(plan)}</div>
                {plan.price > 0 && (
                  <div className="text-sm text-gray-500">
                    {billingInterval === 'month' ? 'aylık' : 'yıllık'}
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full px-6 py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                    : plan.id === 'free'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {plan.id === 'free' ? 'Başla' : 'Planı Seç'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

