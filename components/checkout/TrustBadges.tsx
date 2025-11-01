"use client";

import { motion } from 'framer-motion';
import { Shield, Lock, RefreshCw, Truck, CreditCard, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: 'Güvenli Alışveriş',
      description: '256-bit SSL Şifreleme',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Lock,
      title: '3D Secure',
      description: 'Güvenli Ödeme',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: RefreshCw,
      title: '14 Gün İade',
      description: 'Koşulsuz İade Hakkı',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Truck,
      title: 'Hızlı Kargo',
      description: '2-3 İş Günü Teslimat',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const paymentMethods = [
    { name: 'Visa', logo: '/images/payments/visa.svg' },
    { name: 'Mastercard', logo: '/images/payments/mastercard.svg' },
    { name: 'Troy', logo: '/images/payments/troy.svg' },
    { name: 'American Express', logo: '/images/payments/amex.svg' },
  ];

  return (
    <div className="space-y-6">
      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${badge.bgColor} p-4 rounded-xl border-2 border-${badge.color.replace('text-', '')}/20`}
          >
            <div className="flex items-start space-x-3">
              <badge.icon className={`w-6 h-6 ${badge.color} flex-shrink-0`} />
              <div>
                <p className="text-sm font-semibold text-gray-900">{badge.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{badge.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700 flex items-center">
            <CreditCard className="w-4 h-4 mr-2 text-gray-600" />
            Kabul Edilen Kartlar
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Payment logos - fallback to text if images don't exist */}
          <div className="flex items-center space-x-2 flex-wrap">
            <div className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold">VISA</div>
            <div className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-bold">MC</div>
            <div className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-bold">TROY</div>
            <div className="px-3 py-1.5 bg-blue-700 text-white rounded text-xs font-bold">AMEX</div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Tüm kartlar 3D Secure ile korunmaktadır
        </p>
      </div>

      {/* Security Badge */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-green-900">%100 Güvenli Alışveriş</p>
            <p className="text-xs text-green-700 mt-0.5">
              Ödeme bilgileriniz asla saklanmaz ve paylaşılmaz
            </p>
          </div>
        </div>
      </div>

      {/* Customer Testimonial */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <div className="flex items-start space-x-3">
          <div className="text-3xl">⭐</div>
          <div>
            <p className="text-xs text-gray-600 italic mb-1">
              "Çok hızlı teslimat ve kaliteli ürünler. Kesinlikle tavsiye ederim!"
            </p>
            <p className="text-xs font-semibold text-gray-900">
              - Ayşe K. <span className="text-green-600">✓ Doğrulanmış Alışveriş</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


