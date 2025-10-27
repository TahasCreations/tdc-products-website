"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, CreditCard, Home } from 'lucide-react';
import Link from 'next/link';

interface OrderData {
  orderNumber: string;
  status: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
  items: Array<{
    id: string;
    product: {
      title: string;
      image: string;
    };
    quantity: number;
    price: number;
  }>;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  const orderNumber = searchParams.get('order');
  const paymentMethod = searchParams.get('method') || 'credit';

  useEffect(() => {
    if (!orderNumber) {
      router.push('/');
      return;
    }

    // Sipariş detaylarını getir
    fetch(`/api/orders/${orderNumber}`)
      .then(res => res.json())
      .then(data => {
        setOrderData(data.order);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [orderNumber, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CBA135]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Siparişiniz Başarıyla Alındı!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Sipariş numaranız: <span className="font-semibold text-[#CBA135]">{orderNumber}</span>
          </p>
          <p className="text-gray-500">
            Sipariş detayları e-posta adresinize gönderildi.
          </p>
        </motion.div>

        {/* Order Summary */}
        {orderData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sipariş Özeti</h2>
            
            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.title}</h3>
                    <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ₺{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-900">Toplam</span>
                <span className="text-[#CBA135]">₺{orderData.total.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Payment Method Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Ödeme Bilgileri
          </h3>
          
          {paymentMethod === 'credit' ? (
            <div className="space-y-2">
              <p className="text-gray-700">💳 Kredi Kartı ile ödendi</p>
              <p className="text-sm text-gray-500">
                Ödeme işleminiz başarıyla tamamlandı. Siparişiniz hazırlanmaya başlandı.
              </p>
            </div>
          ) : paymentMethod === 'bank' ? (
            <div className="space-y-2">
              <p className="text-gray-700">🏦 Banka Havalesi</p>
              <p className="text-sm text-gray-500">
                Siparişiniz onaylandı. Ödeme bilgileri e-posta ile gönderilecek.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-700">💰 Kapıda Ödeme</p>
              <p className="text-sm text-gray-500">
                Siparişiniz kargoya verildiğinde ödeme bilgileri gönderilecek.
              </p>
            </div>
          )}
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] rounded-lg p-8 text-white mb-8"
        >
          <h3 className="text-xl font-semibold mb-4">Sonraki Adımlar</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Sipariş Hazırlanıyor</p>
                <p className="text-sm opacity-90">1-2 iş günü</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Kargoya Veriliyor</p>
                <p className="text-sm opacity-90">2-3 iş günü</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">Teslimat</p>
                <p className="text-sm opacity-90">1-2 iş günü</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/orders"
            className="px-8 py-3 bg-white border-2 border-[#CBA135] text-[#CBA135] rounded-lg hover:bg-[#CBA135] hover:text-white transition-colors font-medium text-center"
          >
            Siparişlerimi Görüntüle
          </Link>
          
          <Link
            href="/products"
            className="px-8 py-3 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors font-medium text-center"
          >
            Alışverişe Devam Et
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CBA135]"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
