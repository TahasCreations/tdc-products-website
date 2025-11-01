"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Clock, Copy, Check } from 'lucide-react';

export default function FirstPurchasePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 dakika = 600 saniye

  const couponCode = 'HOSGELDIN';
  const discount = 10;

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (!isVisible) return;

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
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('firstPurchasePopupSeen', 'true');
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Popup Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
            >
              <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg z-10"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>

                {/* Header with Animation */}
                <div className="relative p-8 pb-6 text-center">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 opacity-10" />
                  
                  {/* Gift Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 200, 
                      damping: 10,
                      delay: 0.2 
                    }}
                    className="inline-block mb-4"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl">
                      <Gift className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-black text-gray-900 mb-2"
                  >
                    Hoş Geldiniz! 🎉
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-700 text-lg"
                  >
                    İlk alışverişinize özel
                  </motion.p>
                </div>

                {/* Discount Display */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="px-8 pb-6"
                >
                  <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-2xl p-8 text-center shadow-2xl transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Sparkles className="w-6 h-6 text-yellow-300" />
                      <p className="text-white text-xl font-bold">ÖZEL İNDİRİM</p>
                      <Sparkles className="w-6 h-6 text-yellow-300" />
                    </div>
                    <p className="text-white text-6xl font-black mb-2">
                      %{discount}
                    </p>
                    <p className="text-white/90 text-sm">
                      İlk siparişinizde geçerli
                    </p>
                  </div>
                </motion.div>

                {/* Coupon Code */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="px-8 pb-6"
                >
                  <div className="bg-white rounded-xl border-2 border-dashed border-purple-400 p-4">
                    <p className="text-sm text-gray-600 text-center mb-3">
                      Kupon Kodunuz:
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 text-center">
                        <p className="text-2xl font-black text-gray-900 tracking-wider">
                          {couponCode}
                        </p>
                      </div>
                      <button
                        onClick={handleCopyCoupon}
                        className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                      >
                        {copied ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {copied && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-green-600 text-center mt-2 font-semibold"
                      >
                        ✓ Kopyalandı!
                      </motion.p>
                    )}
                  </div>
                </motion.div>

                {/* Timer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="px-8 pb-6"
                >
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-5 h-5 text-red-600" />
                      <p className="text-sm text-red-800">
                        Bu teklif <span className="font-bold text-xl">{formatTime(timeLeft)}</span> içinde sona erecek!
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="px-8 pb-8 space-y-3"
                >
                  <button
                    onClick={() => {
                      handleClose();
                      // Navigate to products
                      window.location.href = '/products';
                    }}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl"
                  >
                    Alışverişe Başla 🛍️
                  </button>
                  
                  <button
                    onClick={handleClose}
                    className="w-full py-3 text-gray-600 hover:text-gray-900 transition-all font-medium text-sm"
                  >
                    Daha Sonra
                  </button>
                </motion.div>

                {/* Benefits */}
                <div className="px-8 pb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Bu Kampanya ile:</p>
                    <div className="space-y-1.5 text-xs text-gray-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span>Minimum 100 TL alışverişte geçerli</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span>Tüm ürünlerde kullanılabilir</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span>Ücretsiz kargo ile birleştirilebilir</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span>Sadece yeni müşterilere özel</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

