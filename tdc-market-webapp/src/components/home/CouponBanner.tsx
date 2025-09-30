'use client';

import { useState } from 'react';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount: number;
  type: string;
  minAmount: number;
  expiresAt: string;
  isActive: boolean;
}

interface CouponBannerProps {
  coupons: Coupon[];
  onCouponCopy: (coupon: Coupon) => void;
}

export default function CouponBanner({ coupons, onCouponCopy }: CouponBannerProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (coupon: Coupon) => {
    navigator.clipboard.writeText(coupon.code);
    setCopiedCode(coupon.code);
    onCouponCopy(coupon);
    
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  if (coupons.length === 0) return null;

  const activeCoupons = coupons.filter(coupon => coupon.isActive);

  return (
    <section className="py-16 bg-gradient-tdc">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Özel İndirimler
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Sınırlı süreli indirim kodlarını kaçırmayın
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white/10 backdrop-blur-sm rounded-tdc p-8 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {coupon.description}
                  </h3>
                  <p className="text-white/80 mb-4">
                    Minimum {coupon.minAmount}₺ alışveriş için geçerli
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <span className="text-white font-mono text-lg font-bold">
                        {coupon.code}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(coupon)}
                      className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        copiedCode === coupon.code
                          ? 'bg-success-500 text-white'
                          : 'bg-white text-primary-600 hover:bg-white/90'
                      }`}
                    >
                      {copiedCode === coupon.code ? 'Kopyalandı!' : 'Kodu Kopyala'}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-white">
                    %{coupon.discount}
                  </div>
                  <div className="text-white/80 text-sm">İndirim</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
