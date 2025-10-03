import { requireSeller } from '@/src/lib/guards';
import { PrismaClient } from '@prisma/client';
import { motion } from 'framer-motion';

const prisma = new PrismaClient();

export default async function SellerOrdersPage() {
  const user = await requireSeller();
  
  // Satıcının kendi siparişlerini getir
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: user.id },
  });

  if (!sellerProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Satıcı Profili Bulunamadı</h1>
          <p className="text-gray-600">Lütfen admin ile iletişime geçin.</p>
        </div>
      </div>
    );
  }

  // Satıcının ürünlerinin siparişlerini getir
  const orderItems = await prisma.orderItem.findMany({
    where: { sellerId: sellerProfile.id },
    include: {
      order: {
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      },
      product: {
        select: { title: true, images: true }
      }
    },
    orderBy: { order: { createdAt: 'desc' } },
  });

  // Siparişleri grupla
  const ordersMap = new Map();
  orderItems.forEach(item => {
    const orderId = item.order.id;
    if (!ordersMap.has(orderId)) {
      ordersMap.set(orderId, {
        ...item.order,
        items: []
      });
    }
    ordersMap.get(orderId).items.push(item);
  });

  const orders = Array.from(ordersMap.values());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'paid': return 'Ödendi';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sipariş Yönetimi</h1>
          <p className="text-gray-600">
            {sellerProfile.storeName} mağazanızın siparişlerini yönetin
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{orders.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <p className="text-sm font-medium text-gray-600">Bekleyen</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <p className="text-sm font-medium text-gray-600">Kargoda</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {orders.filter(o => o.status === 'shipped').length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <p className="text-sm font-medium text-gray-600">Teslim Edildi</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {orders.filter(o => o.status === 'delivered').length}
            </p>
          </motion.div>
        </div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Siparişleriniz</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {order.user?.name} ({order.user?.email})
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <p className="text-lg font-semibold text-gray-900 mt-2">
                      ₺{Number(order.total).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.product.images[0] || 'https://via.placeholder.com/50x50'}
                        alt={item.product.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product.title}</p>
                        <p className="text-sm text-gray-500">
                          {item.qty} adet × ₺{Number(item.unitPrice).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ₺{Number(item.subtotal).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  {order.status === 'paid' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Kargoya Ver
                    </button>
                  )}
                  {order.status === 'shipped' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Teslim Edildi Olarak İşaretle
                    </button>
                  )}
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Detayları Görüntüle
                  </button>
                </div>
              </div>
            ))}
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz sipariş yok</h3>
              <p className="text-gray-500">Ürünlerinizi ekleyerek ilk siparişinizi bekleyin</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
