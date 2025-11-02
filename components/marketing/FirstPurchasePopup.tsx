"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Clock, Copy, Check } from 'lucide-react';

export default function FirstPurchasePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 dakika = 600 saniye
  const [isMounted, setIsMounted] = useState(false); // Hydration fix

  const couponCode = 'HOSGELDIN';
  const discount = 10;

  // Hydration fix - mount check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Guard clause for SSR
    
    // Check if user has seen this popup before
    const hasSeenPopup = localStorage.getItem('firstPurchasePopupSeen');
    const hasPurchased = localStorage.getItem('hasPurchased');

    if (!hasSeenPopup && !hasPurchased) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
        setShowConfetti(true);
        
        // Stop confetti after 3 seconds
        setTimeout(() => setShowConfetti(false), 3000);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  useEffect(() => {
    if (!isVisible || !isMounted) return; // Guard clause for SSR

    // Countdown timer
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, isMounted]);

  const handleClose = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('firstPurchasePopupSeen', 'true');
    }
  };

  const handleCopyCoupon = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Hydration fix - don't render on server
  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Popup */}
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            />

            {/* Popup Content - Perfectly Centered with Flexbox */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-md pointer-events-auto"
              >
                <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg z-10"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>

                  {/* Header with Animation - Kompakt */}
                  <div className="relative p-6 pb-4 text-center">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 opacity-10" />
                    
                    {/* Gift Icon - Küçültüldü */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 200, 
                        damping: 10,
                        delay: 0.2 
                      }}
                      className="inline-block mb-3"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl">
                        <Gift className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-black text-gray-900 mb-1"
                    >
                      Hoş Geldiniz! 🎉
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-700 text-base"
                    >
                      İlk alışverişinize özel
                    </motion.p>
                  </div>

                  {/* Discount Display - Kompakt */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="px-6 pb-4"
                  >
                    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-2xl p-6 text-center shadow-2xl transform hover:scale-105 transition-transform">
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                        <p className="text-white text-lg font-bold">ÖZEL İNDİRİM</p>
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                      </div>
                      <p className="text-white text-5xl font-black mb-1">
                        %{discount}
                      </p>
                      <p className="text-white/90 text-xs">
                        İlk siparişinizde geçerli
                      </p>
                    </div>
                  </motion.div>

                  {/* Coupon Code - Kompakt */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="px-6 pb-4"
                  >
                    <div className="bg-white rounded-xl border-2 border-dashed border-purple-400 p-3">
                      <p className="text-xs text-gray-600 text-center mb-2">
                        Kupon Kodunuz:
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-center">
                          <p className="text-xl font-black text-gray-900 tracking-wider">
                            {couponCode}
                          </p>
                        </div>
                        <button
                          onClick={handleCopyCoupon}
                          className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {copied && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-green-600 text-center mt-1.5 font-semibold"
                        >
                          ✓ Kopyalandı!
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  {/* Timer - Kompakt */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="px-6 pb-4"
                  >
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
                      <div className="flex items-center justify-center space-x-1.5">
                        <Clock className="w-4 h-4 text-red-600" />
                        <p className="text-xs text-red-800">
                          Bu teklif <span className="font-bold text-base">{formatTime(timeLeft)}</span> içinde sona erecek!
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Buttons - Kompakt */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="px-6 pb-4 space-y-2"
                  >
                    <button
                      onClick={() => {
                        handleClose();
                        // Navigate to products
                        window.location.href = '/products';
                      }}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold text-base shadow-lg hover:shadow-xl"
                    >
                      Alışverişe Başla 🛍️
                    </button>
                    
                    <button
                      onClick={handleClose}
                      className="w-full py-2 text-gray-600 hover:text-gray-900 transition-all font-medium text-xs"
                    >
                      Daha Sonra
                    </button>
                  </motion.div>

                  {/* Benefits - Kompakt */}
                  <div className="px-6 pb-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 space-y-1.5">
                      <p className="text-[10px] font-semibold text-gray-700 mb-1">Bu Kampanya ile:</p>
                      <div className="space-y-1 text-[10px] text-gray-600">
                        <div className="flex items-center space-x-1.5">
                          <div className="w-1 h-1 bg-green-500 rounded-full" />
                          <span>Min. 100 TL alışverişte geçerli</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <div className="w-1 h-1 bg-green-500 rounded-full" />
                          <span>Tüm ürünlerde kullanılabilir</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <div className="w-1 h-1 bg-green-500 rounded-full" />
                          <span>Ücretsiz kargo ile birleştirilebilir</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
