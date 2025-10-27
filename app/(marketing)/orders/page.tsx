"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, XCircle, Eye, Download } from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  createdAt: string;
  shippingAddress: string;
  trackingNumber?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error('Siparişler yüklenemedi');
      }
      
      const data = await response.json();
      
      // API'den gelen veriyi component formatına dönüştür
      const formattedOrders: Order[] = data.orders.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        items: order.items.map((item: any) => ({
          id: item.id,
          title: item.product?.title || 'Ürün',
          price: item.price,
          quantity: item.quantity,
          image: item.product?.image || '/images/placeholder.jpg'
        })),
        createdAt: order.createdAt,
        shippingAddress: order.shippingAddress?.address || 'Adres bilgisi yok',
        trackingNumber: order.trackingNumber
      }));
      
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
      // Hata durumunda boş array set et
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-blue-500" />;
      case 'processing': return <Package className="w-5 h-5 text-yellow-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Teslim Edildi';
      case 'shipped': return 'Kargoya Verildi';
      case 'processing': return 'Hazırlanıyor';
      case 'pending': return 'Beklemede';
      case 'cancelled': return 'İptal Edildi';
      default: return 'Bilinmiyor';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => 
    filter === 'all' || order.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CBA135]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Siparişlerim</h1>
          <p className="text-gray-600">Tüm siparişlerinizi buradan takip edebilirsiniz</p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'Tümü' },
              { value: 'pending', label: 'Beklemede' },
              { value: 'processing', label: 'Hazırlanıyor' },
              { value: 'shipped', label: 'Kargoda' },
              { value: 'delivered', label: 'Teslim Edildi' },
              { value: 'cancelled', label: 'İptal Edildi' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-[#CBA135] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Package className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sipariş Bulunamadı</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Henüz hiç sipariş vermediniz.' 
                  : `${filter} durumunda sipariş bulunamadı.`}
              </p>
            </div>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Sipariş #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={60}
                          height={60}
                          className="w-15 h-15 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            ₺{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p><strong>Teslimat Adresi:</strong> {order.shippingAddress}</p>
                        {order.trackingNumber && (
                          <p><strong>Takip Numarası:</strong> {order.trackingNumber}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          Toplam: ₺{order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="mt-6 flex justify-end gap-3">
                    {order.status === 'shipped' && order.trackingNumber && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Kargo Takip
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Değerlendir
                      </button>
                    )}
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Sipariş Detayı
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
