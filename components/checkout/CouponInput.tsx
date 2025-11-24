"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Check, X, Loader2, Sparkles } from 'lucide-react';

interface CouponInputProps {
  onApply: (code: string, discount: number) => void;
  onRemove: () => void;
  appliedCoupon?: {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  } | null;
}

export default function CouponInput({ onApply, onRemove, appliedCoupon }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Lütfen kupon kodu girin');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      // Sepet toplamını al (parent component'ten geçirilmeli, şimdilik 0)
      const cartTotal = 0; // TODO: Cart total'ı geçir
      
      // API'ye kupon doğrulama isteği
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: couponCode.toUpperCase(),
          cartTotal,
        }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        onApply(couponCode.toUpperCase(), data.discount);
        setCouponCode('');
      } else {
        setError(data.message || 'Geçersiz kupon kodu');
      }
    } catch (err) {
      setError('Kupon doğrulanamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsValidating(false);
    }
  };

  if (appliedCoupon) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-green-900">Kupon Uygulandı! 🎉</p>
              <p className="text-sm text-green-700">
                <span className="font-bold">{appliedCoupon.code}</span>
                {' - '}
                {appliedCoupon.type === 'percentage' 
                  ? `%${appliedCoupon.discount} indirim`
                  : `₺${appliedCoupon.discount.toFixed(2)} indirim`
                }
              </p>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="p-2 hover:bg-green-100 rounded-lg transition-colors"
            aria-label="Kuponu kaldır"
          >
            <X className="w-5 h-5 text-green-700" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 mb-2">
        <Ticket className="w-5 h-5 text-[#CBA135]" />
        <p className="text-sm font-medium text-gray-700">İndirim Kuponu</p>
      </div>
      
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value.toUpperCase());
              setError('');
            }}
            onKeyPress={(e) => e.key === 'Enter' && validateCoupon()}
            placeholder="KUPON KODU"
            disabled={isValidating}
            className={`
              w-full px-4 py-3 rounded-lg border-2 transition-all uppercase
              ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#CBA135]'}
              focus:outline-none focus:ring-2 focus:ring-[#CBA135]/20
              disabled:bg-gray-100 disabled:cursor-not-allowed
            `}
          />
          {isValidating && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-[#CBA135] animate-spin" />
            </div>
          )}
        </div>
        
        <button
          onClick={validateCoupon}
          disabled={isValidating || !couponCode.trim()}
          className="px-6 py-3 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg"
        >
          {isValidating ? 'Kontrol...' : 'Uygula'}
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg"
          >
            <X className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Önerilen Kuponlar */}
      <div className="flex flex-wrap gap-2 mt-3">
        {[
          { code: 'HOSGELDIN', label: 'İlk alışveriş' },
          { code: 'YILBASI', label: 'Yılbaşı özel' },
        ].map((suggestion) => (
          <button
            key={suggestion.code}
            onClick={() => {
              setCouponCode(suggestion.code);
              setError('');
            }}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full text-xs font-medium text-purple-700 hover:from-purple-100 hover:to-pink-100 transition-all flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>{suggestion.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}


