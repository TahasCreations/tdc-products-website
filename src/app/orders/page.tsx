'use client';

import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useOrder } from '../../contexts/OrderContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SimpleRecommendationEngine from '../../components/ai/SimpleRecommendationEngine';

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders, loading, getOrders } = useOrder();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth?redirect=orders');
      return;
    }

    getOrders();
  }, [user, router, getOrders]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'confirmed':
        return 'Onaylandı';
      case 'shipped':
        return 'Kargoda';
      case 'delivered':
        return 'Teslim Edildi';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-user-line text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Giriş Yapmanız Gerekli
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Siparişlerinizi görüntülemek için lütfen giriş yapın
          </p>
          <Link
            href="/auth?redirect=orders"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Siparişlerim</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Tüm siparişlerinizi buradan takip edebilirsiniz
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <i className="ri-loader-4-line animate-spin text-4xl text-orange-600 mb-4"></i>
              <p className="text-gray-600 dark:text-gray-400">Siparişler yükleniyor...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <i className="ri-shopping-bag-3-line text-4xl text-orange-500 dark:text-orange-400"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Sipariş Yok
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Henüz hiç sipariş vermediniz. İlk siparişinizi vermek için ürünlerimizi keşfedin ve alışverişe başlayın!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <i className="ri-store-line mr-2"></i>
                Ürünleri Keşfet
              </Link>
              <Link
                href="/"
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              >
                <i className="ri-home-line mr-2"></i>
                Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sipariş Sayısı */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Toplam Sipariş
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {orders.length} sipariş bulundu
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {orders.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Sipariş Listesi */}
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                {/* Sipariş Başlığı */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Sipariş #{order.id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <i className="ri-calendar-line mr-1"></i>
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)} shadow-sm`}>
                        <i className="ri-checkbox-circle-line mr-1"></i>
                        {getStatusText(order.status)}
                      </span>
                      <Link
                        href={`/orders/${order.id}`}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors shadow-sm"
                      >
                        <i className="ri-eye-line mr-1"></i>
                        Detayları Gör
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Sipariş Ürünleri */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Adet: {item.quantity} • {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {order.items.length > 3 && (
                      <div className="text-center py-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          +{order.items.length - 3} ürün daha
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Sipariş Özeti */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 -mx-6 px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <i className="ri-shopping-bag-line mr-1"></i>
                          Toplam {order.items.length} ürün
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <i className="ri-bank-card-line mr-1"></i>
                          Ödeme: {order.payment_method === 'credit_card' ? 'Kredi Kartı' : 
                                  order.payment_method === 'bank_transfer' ? 'Banka Havalesi' : 
                                  'Kapıda Ödeme'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {formatPrice(order.total_amount)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Toplam Tutar
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Önerileri */}
        {orders.length > 0 && (
          <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  🤖 Size Özel Öneriler
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Geçmiş siparişlerinize göre kişiselleştirilmiş figür önerileri
                </p>
              </div>
              <SimpleRecommendationEngine
                context="orders"
                limit={6}
                
                
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
