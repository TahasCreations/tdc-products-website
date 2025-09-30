'use client';

import { useState } from 'react';
import { ClipboardDocumentIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
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
  const [showAllCoupons, setShowAllCoupons] = useState(false);

  const activeCoupons = coupons.filter(coupon => coupon.isActive);
  const featuredCoupon = activeCoupons[0];
  const otherCoupons = activeCoupons.slice(1);

  const handleCopyCode = async (coupon: Coupon) => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopiedCode(coupon.code);
      onCouponCopy(coupon);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy coupon code:', err);
    }
  };

  if (!featuredCoupon) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-tdc">
      <div className="max-w-7xl mx-auto">
        {/* Main Coupon Banner */}
        <div className="bg-white rounded-tdc shadow-tdc-2xl p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-tdc opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-tdc-reverse opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-clash font-bold text-ink-900">
                  Özel İndirim Fırsatı! 🎉
                </h2>
                <p className="text-lg text-ink-600">
                  {featuredCoupon.description}
                </p>
              </div>

              {/* Coupon Code */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-neutral-100 rounded-lg p-4 border-2 border-dashed border-neutral-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-ink-600 mb-1">Kupon Kodu</p>
                      <p className="text-2xl font-bold text-ink-900 font-mono">
                        {featuredCoupon.code}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary-600">
                        %{featuredCoupon.discount}
                      </p>
                      <p className="text-sm text-ink-500">İndirim</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyCode(featuredCoupon)}
                  className={`px-6 py-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                    copiedCode === featuredCoupon.code
                      ? 'bg-success-500 hover:bg-success-600'
                      : 'bg-gradient-tdc hover:shadow-tdc-lg transform hover:-translate-y-1'
                  }`}
                  aria-label={`${featuredCoupon.code} kupon kodunu kopyala`}
                >
                  {copiedCode === featuredCoupon.code ? (
                    <>
                      <CheckIcon className="w-5 h-5" />
                      <span>Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="w-5 h-5" />
                      <span>Kodu Kopyala</span>
                    </>
                  )}
                </button>
              </div>

              {/* Terms */}
              <div className="text-sm text-ink-500">
                <p>• Minimum alışveriş tutarı: ₺{featuredCoupon.minAmount}</p>
                <p>• Geçerlilik: {new Date(featuredCoupon.expiresAt).toLocaleDateString('tr-TR')}</p>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative flex justify-center">
              <div className="relative w-64 h-64">
                {/* Confetti Animation Container */}
                <div className="absolute inset-0 overflow-hidden rounded-tdc">
                  {copiedCode === featuredCoupon.code && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-gradient-tdc rounded-full animate-confetti"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 0.6}s`,
                            transform: `rotate(${Math.random() * 360}deg)`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Main Visual */}
                <div className="relative bg-gradient-to-br from-primary-100 to-accent-100 rounded-tdc p-8 shadow-tdc-lg">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🎁</div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-ink-900">
                        Hemen Kullan!
                      </h3>
                      <p className="text-ink-600 text-sm">
                        Kodu kopyalayıp alışverişe başlayın
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Coupons */}
        {otherCoupons.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                Diğer Kuponlar
              </h3>
              <button
                onClick={() => setShowAllCoupons(!showAllCoupons)}
                className="text-white/80 hover:text-white text-sm font-medium flex items-center space-x-1 transition-colors duration-300"
                aria-label={showAllCoupons ? 'Kuponları gizle' : 'Tüm kuponları göster'}
              >
                <span>{showAllCoupons ? 'Gizle' : 'Tümünü Gör'}</span>
                {showAllCoupons ? (
                  <XMarkIcon className="w-4 h-4" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4" />
                )}
              </button>
            </div>

            {showAllCoupons && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherCoupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold">{coupon.code}</p>
                        <p className="text-white/80 text-sm">{coupon.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">
                          %{coupon.discount}
                        </p>
                        <p className="text-white/60 text-xs">İndirim</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleCopyCode(coupon)}
                      className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
                      aria-label={`${coupon.code} kupon kodunu kopyala`}
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          <span>Kopyalandı!</span>
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="w-4 h-4" />
                          <span>Kopyala</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

