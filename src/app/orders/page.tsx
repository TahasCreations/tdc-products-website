'use client';

import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useOrder } from '../../contexts/OrderContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-shopping-bag-3-line text-3xl text-gray-400 dark:text-gray-500"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Henüz Siparişiniz Yok
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              İlk siparişinizi vermek için ürünlerimizi keşfedin
            </p>
            <Link
              href="/products"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              <i className="ri-store-line mr-2"></i>
              Ürünlere Git
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300"
              >
                {/* Sipariş Başlığı */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Sipariş #{order.id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium text-sm"
                      >
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
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Toplam {order.items.length} ürün
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Ödeme: {order.payment_method === 'credit_card' ? 'Kredi Kartı' : 
                                  order.payment_method === 'bank_transfer' ? 'Banka Havalesi' : 
                                  'Kapıda Ödeme'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                          {formatPrice(order.total_amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
