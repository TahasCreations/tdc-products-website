'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  XMarkIcon, 
  MinusIcon, 
  PlusIcon, 
  TrashIcon,
  ShoppingBagIcon,
  TruckIcon,
  TagIcon
} from '@heroicons/react/24/outline';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [taxRate, setTaxRate] = useState(0.18); // %18 KDV
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const subtotal = state.total;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount + shippingCost - (appliedCoupon?.discount_amount || 0);

  // Kargo ücreti hesaplama (500 TL üzeri ücretsiz)
  useEffect(() => {
    if (subtotal >= 500) {
      setShippingCost(0);
    } else {
      setShippingCost(25); // Sabit kargo ücreti
    }
  }, [subtotal]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    try {
      const response = await fetch(`/api/ecommerce?type=validate_coupon&code=${couponCode}&order_amount=${subtotal}`);
      const result = await response.json();

      if (result.success) {
        setAppliedCoupon(result.coupon);
        // Toast notification göster
        console.log('Kupon uygulandı:', result.coupon);
      } else {
        alert('Geçersiz kupon kodu: ' + result.error);
      }
    } catch (error) {
      console.error('Kupon uygulama hatası:', error);
      alert('Kupon uygulanırken bir hata oluştu');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  const handleQuickCheckout = () => {
    // Hızlı checkout - mevcut kullanıcı bilgileri ile
    onClose();
    router.push('/checkout?quick=true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <ShoppingBagIcon className="w-6 h-6 text-gray-900" />
              <h2 className="text-lg font-semibold text-gray-900">Sepetim</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {state.itemCount}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Sepetiniz boş</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="relative">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coupon Section */}
          {state.items.length > 0 && (
            <div className="p-6 border-t">
              <div className="space-y-4">
                {/* Kupon Kodu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kupon Kodu
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Kupon kodunuzu girin"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isApplyingCoupon ? 'Uygulanıyor...' : 'Uygula'}
                    </button>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <TagIcon className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            {appliedCoupon.code} uygulandı
                          </span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Kaldır
                        </button>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        {formatPrice(appliedCoupon.discount_amount)} indirim
                      </p>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">KDV (%18)</span>
                    <span className="font-medium">{formatPrice(taxAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kargo</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Ücretsiz</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>İndirim ({appliedCoupon.code})</span>
                      <span className="font-medium">-{formatPrice(appliedCoupon.discount_amount)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Toplam</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Sepeti Onayla
                  </button>
                  
                  <button
                    onClick={handleQuickCheckout}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Hızlı Satın Al
                  </button>
                  
                  <button
                    onClick={clearCart}
                    className="w-full text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    Sepeti Temizle
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
