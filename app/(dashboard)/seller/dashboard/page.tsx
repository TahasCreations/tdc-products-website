import { requireSeller } from '@/lib/guards';
import { motion } from 'framer-motion';

export default async function SellerDashboardPage() {
  // Bu sayfa sadece SELLER veya ADMIN rolüne sahip kullanıcılar tarafından erişilebilir
  const user = await requireSeller();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-3">
                Satıcı Paneli
              </h1>
              <p className="text-xl text-gray-600">
                Hoş geldiniz, <span className="font-semibold text-indigo-600">{user.name}</span>! 
                Mağazanızı yönetin ve satışlarınızı takip edin.
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Yeni Ürün Ekle
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                Kampanya Oluştur
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl p-8 border border-white/50 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Toplam Satış</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">₺12,450</p>
              <p className="text-xs text-green-500">Bu ay artış</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl p-8 border border-white/50 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+3</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Aktif Ürünler</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">24</p>
              <p className="text-xs text-blue-500">Yeni ürünler</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl p-8 border border-white/50 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">2 acil</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Bekleyen Siparişler</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">8</p>
              <p className="text-xs text-orange-500">İşlem bekliyor</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl p-8 border border-white/50 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">+0.2</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Müşteri Puanı</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">4.8</p>
              <p className="text-xs text-purple-500">Bu ay artış</p>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/seller/products/new"
              className="flex flex-col items-center justify-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <span className="text-indigo-600 text-2xl mb-2">➕</span>
              <span className="text-sm font-medium text-gray-800">Yeni Ürün Ekle</span>
            </a>
            <a
              href="/seller/orders"
              className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <span className="text-green-600 text-2xl mb-2">📦</span>
              <span className="text-sm font-medium text-gray-800">Siparişleri Görüntüle</span>
            </a>
            <a
              href="/seller/analytics"
              className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <span className="text-purple-600 text-2xl mb-2">📊</span>
              <span className="text-sm font-medium text-gray-800">Analitikleri İncele</span>
            </a>
            <a
              href="/seller/settings"
              className="flex flex-col items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <span className="text-orange-600 text-2xl mb-2">⚙️</span>
              <span className="text-sm font-medium text-gray-800">Mağaza Ayarları</span>
            </a>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Son Siparişler</h2>
          <div className="space-y-4">
            {[
              { id: '1001', customer: 'Ahmet Yılmaz', product: 'Naruto Figürü', amount: '₺299', status: 'Beklemede' },
              { id: '1002', customer: 'Ayşe Demir', product: 'One Piece Koleksiyonu', amount: '₺450', status: 'Hazırlanıyor' },
              { id: '1003', customer: 'Mehmet Can', product: 'Dragon Ball Figürü', amount: '₺180', status: 'Kargoda' },
            ].map((order) => (
              <div key={order.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">#{order.id} - {order.product}</p>
                  <p className="text-sm text-gray-500">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{order.amount}</p>
                  <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
