"use client";

import { useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WaitlistButtonProps {
  productId: string;
  productName: string;
}

export default function WaitlistButton({ productId, productName }: WaitlistButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/waitlist/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setTimeout(() => setIsOpen(false), 2000);
      }
    } catch (error) {
      console.error('Waitlist subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center space-x-2"
      >
        <Bell className="w-5 h-5" />
        <span>Stokta Olunca Haber Ver</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {isSubscribed ? 'Başarılı!' : 'Bildirim Al'}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!isSubscribed ? (
                <>
                  <p className="text-gray-600 mb-4">
                    <strong>{productName}</strong> stokta olduğunda sizi e-posta ile bilgilendireceğiz.
                  </p>
                  <div className="space-y-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-posta adresiniz"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                    />
                    <button
                      onClick={handleSubscribe}
                      disabled={!email || isLoading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Kaydediliyor...' : 'Bildirim İste'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Kaydınız alındı!
                  </p>
                  <p className="text-gray-600">
                    Ürün stokta olduğunda size haber vereceğiz.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

