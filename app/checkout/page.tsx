'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createOrder } from './actions';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  seller: {
    name: string;
    storeName: string;
  };
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock cart data - gerçek uygulamada localStorage veya context'ten gelecek
  useEffect(() => {
    const mockCartItems: CartItem[] = [
      {
        id: 'naruto-uzumaki-figuru-shippuden',
        title: 'Naruto Uzumaki Figürü - Shippuden',
        price: 499.90,
        image: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=Naruto',
        quantity: 1,
        seller: {
          name: 'Demo Seller',
          storeName: 'TS Art Store'
        }
      },
      {
        id: '3d-yazici-nozul-seti-04mm',
        title: '3D Yazıcı Nozulu Seti - 0.4mm',
        price: 89.90,
        image: 'https://via.placeholder.com/150x150/3498DB/FFFFFF?text=Nozul',
        quantity: 2,
        seller: {
          name: 'Tech Hub',
          storeName: 'Tech Hub Store'
        }
      }
    ];
    setCartItems(mockCartItems);
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/giris');
    return null;
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = total > 200 ? 0 : 29.90; // Ücretsiz kargo 200 TL üzeri
  const finalTotal = total + shipping;

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const orderItems = cartItems.map(item => ({
        productId: item.id,
        qty: item.quantity,
      }));

      const order = await createOrder(orderItems);
      
      // Gerçek uygulamada ödeme sağlayıcıya yönlendirme yapılacak
      console.log('Order created:', order);
      
      // Mock ödeme başarılı
      setTimeout(() => {
        router.push(`/orders/${order.id}?success=true`);
      }, 2000);
      
    } catch (err) {
      setError('Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Sipariş Özeti</h1>
          <p className="text-gray-600 mt-2">Siparişinizi gözden geçirin ve ödemeyi tamamlayın</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Sepetinizdeki Ürünler</h2>
              
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.seller.storeName}</p>
                      <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₺{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₺{item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Sipariş Özeti</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="font-medium">₺{total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Kargo</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Ücretsiz</span>
                    ) : (
                      `₺${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                {shipping > 0 && (
                  <div className="text-sm text-gray-500">
                    ₺{(200 - total).toFixed(2)} daha alışveriş yapın, ücretsiz kargo kazanın!
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Toplam</span>
                    <span>₺{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0}
                className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    İşleniyor...
                  </div>
                ) : (
                  'Ödemeyi Tamamla'
                )}
              </button>

              <div className="mt-4 text-xs text-gray-500 text-center">
                Güvenli ödeme ile korunuyorsunuz
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
