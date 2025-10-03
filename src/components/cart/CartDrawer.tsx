'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';

export default function CartDrawer() {
  const { 
    isOpen, 
    closeCart, 
    items, 
    total, 
    removeItem, 
    setQty, 
    saveForLater, 
    moveToSaved, 
    moveToCart,
    appliedCoupons,
    freeShippingThreshold,
    freeShippingProgress,
    isFreeShippingEligible,
    applyCoupon,
    removeCoupon
  } = useCart();
  const [code, setCode] = React.useState('');

  const applyCode = () => {
    const success = applyCoupon(code);
    if (success) {
      setCode('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/40"
          onClick={closeCart}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Sepet</h2>
              <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 h-[calc(100%-64px-88px)] overflow-y-auto">
              {items.length === 0 ? (
                <div className="text-sm text-gray-500">Sepetiniz boş.</div>
              ) : (
                <div className="space-y-4">
                  {items.map((it) => (
                    <div key={it.id} className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                        <span className="text-xl">{it.image ? '' : '🛍️'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{it.title}</div>
                        <div className="text-xs text-gray-500">₺{it.price.toFixed(2)}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <button onClick={() => setQty(it.id, it.qty - 1)} className="w-6 h-6 rounded border">-</button>
                          <span className="text-sm w-6 text-center">{it.qty}</span>
                          <button onClick={() => setQty(it.id, it.qty + 1)} className="w-6 h-6 rounded border">+</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <button onClick={() => moveToSaved(it.id)} className="px-2 py-1 text-xs rounded border hover:bg-gray-50">Daha Sonra</button>
                        <button onClick={() => removeItem(it.id)} className="px-2 py-1 text-xs text-red-600 rounded border border-red-200 hover:bg-red-50">Sil</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Saved for later */}
            {saveForLater.length > 0 && (
              <div className="px-4 pb-2">
                <div className="text-sm font-semibold text-gray-700 mb-2">Daha Sonra Kaydedilenler</div>
                <div className="space-y-3">
                  {saveForLater.map((it) => (
                    <div key={it.id} className="flex items-center justify-between">
                      <div className="text-sm text-gray-700 truncate max-w-[200px]">{it.title}</div>
                      <button onClick={() => moveToCart(it.id)} className="px-2 py-1 text-xs rounded border hover:bg-gray-50">Sepete Ekle</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="p-4 border-t space-y-3">
              {/* Free Shipping Progress */}
              {!isFreeShippingEligible && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-blue-800">Ücretsiz kargo için</span>
                    <span className="text-blue-600 font-semibold">₺{(freeShippingThreshold - total).toFixed(2)} daha</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {isFreeShippingEligible && (
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <span className="text-green-800 text-sm font-medium">🎉 Ücretsiz kargo kazandınız!</span>
                </div>
              )}

              {/* Applied Coupons */}
              {appliedCoupons.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Uygulanan Kuponlar:</div>
                  {appliedCoupons.map((coupon) => (
                    <div key={coupon} className="flex items-center justify-between bg-green-50 p-2 rounded">
                      <span className="text-sm text-green-800">{coupon}</span>
                      <button 
                        onClick={() => removeCoupon(coupon)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Coupon Input */}
              <div className="flex items-center gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Kupon kodu"
                  className="flex-1 px-3 py-2 rounded border"
                />
                <button onClick={applyCode} className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Uygula</button>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Toplam</span>
                <span className="text-lg font-semibold">₺{total.toFixed(2)}</span>
              </div>
              <a href="/checkout" className="block w-full text-center px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                Ödeme Adımına Geç
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


