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
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Özel İndirimler
          </h2>
          <p className="text-xl text-white/80">
            Hemen kullanabileceğin indirim kodları
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white/10 backdrop-blur-sm rounded-tdc p-6 border border-white/20"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">
                  %{coupon.discount} İndirim
                </div>
                <p className="text-white/80 mb-4">{coupon.description}</p>
                <div className="bg-white/20 rounded-tdc p-3 mb-4">
                  <code className="text-white font-mono text-lg">
                    {coupon.code}
                  </code>
                </div>
                <button
                  onClick={() => handleCopyCode(coupon)}
                  className={`w-full py-3 px-6 rounded-tdc font-semibold transition-all duration-300 ${
                    copiedCode === coupon.code
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-primary-600 hover:bg-white/90'
                  }`}
                >
                  {copiedCode === coupon.code ? '✓ Kopyalandı!' : 'Kodu Kopyala'}
                </button>
                <p className="text-white/60 text-sm mt-2">
                  Min. ₺{coupon.minAmount} alışveriş
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
