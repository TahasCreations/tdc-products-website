"use client";

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import GlassCard from '@/components/ui/GlassCard';
import InteractiveButton from '@/components/ui/InteractiveButton';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useToast } from '@/components/ui/Toast';
import CouponInput from '@/components/checkout/CouponInput';
import WhatsAppButton from '@/components/support/WhatsAppButton';
import SocialProof from '@/components/checkout/SocialProof';

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart();
  const toast = useToast();
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  } | null>(null);

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
            <ShoppingBag className="w-full h-full" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sepetiniz Boş</h2>
          <p className="text-gray-600 mb-8">Alışverişe başlamak için ürünlere göz atın</p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Alışverişe Başla
          </Link>
        </motion.div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const couponDiscount = appliedCoupon?.discount || 0;
  const subtotalAfterCoupon = Math.max(0, subtotal - couponDiscount);
  const shipping = subtotalAfterCoupon >= 500 ? 0 : 125; // 500 TL ve üzeri ücretsiz kargo
  const tax = subtotalAfterCoupon * 0.18; // %18 KDV
  const finalTotal = subtotalAfterCoupon + shipping + tax;

  const handleCouponApply = (code: string, discount: number) => {
    setAppliedCoupon({
      code,
      discount,
      type: 'fixed',
    });
    toast.success(`Kupon uygulandı! ₺${discount} indirim kazandınız 🎉`);
  };

  const handleCouponRemove = () => {
    setAppliedCoupon(null);
    toast.info('Kupon kaldırıldı');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sepetim</h1>
          <p className="text-gray-600">{state.items.length} ürün</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <ScrollReveal direction="left" delay={0.1} className="lg:col-span-2">
            <GlassCard variant="premium" hover3d={false}>
              {/* Cart Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Sepet Ürünleri</h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Sepeti Temizle
                </button>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {state.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-6 flex items-center gap-4"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">Satıcı: {item.sellerName}</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        ₺{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                </motion.div>
              ))}
              </div>
            </GlassCard>
          </ScrollReveal>

          {/* Order Summary */}
          <ScrollReveal direction="right" delay={0.2} className="lg:col-span-1">
            <GlassCard variant="premium" hover3d={false} className="p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>
              
              {/* Coupon Input */}
              <div className="mb-4">
                <CouponInput
                  onApply={handleCouponApply}
                  onRemove={handleCouponRemove}
                  appliedCoupon={appliedCoupon}
                />
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="text-gray-900">₺{subtotal.toFixed(2)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 font-semibold">İndirim ({appliedCoupon.code})</span>
                    <span className="font-semibold text-green-600">-₺{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kargo</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : 'text-gray-900'}>
                    {shipping === 0 ? '🎉 Ücretsiz' : `₺${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                {/* Ücretsiz Kargo Uyarısı */}
                {shipping > 0 && subtotalAfterCoupon < 500 && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-800">
                      💡 <span className="font-semibold">₺{(500 - subtotalAfterCoupon).toFixed(2)}</span> daha alışveriş yaparak <span className="font-semibold">ücretsiz kargo</span> kazanın!
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">KDV (%18)</span>
                  <span className="text-gray-900">₺{tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Toplam</span>
                    <span className="text-[#CBA135]">₺{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Social Proof in Cart */}
              <div className="mb-6">
                <SocialProof />
              </div>

              {/* Checkout Button */}
              <Link href="/checkout" className="block">
                <InteractiveButton
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                  className="w-full"
                >
                  Ödemeye Geç
                </InteractiveButton>
              </Link>

              {/* Security Info */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  🔒 Güvenli ödeme ile korunuyorsunuz
                </p>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="/products"
                  className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Alışverişe Devam Et
                </Link>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>

      {/* WhatsApp Support */}
      <WhatsAppButton />
    </div>
  );
}
