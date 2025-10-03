import { requireAdmin } from '@/src/lib/guards';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Ocak', sales: 4000, revenue: 2400 },
  { name: 'Şubat', sales: 3000, revenue: 1398 },
  { name: 'Mart', sales: 2000, revenue: 9800 },
  { name: 'Nisan', sales: 2780, revenue: 3908 },
  { name: 'Mayıs', sales: 1890, revenue: 4800 },
  { name: 'Haziran', sales: 2390, revenue: 3800 },
  { name: 'Temmuz', sales: 3490, revenue: 4300 },
];

const pieData = [
  { name: 'Elektronik', value: 400 },
  { name: 'Moda', value: 300 },
  { name: 'Ev & Yaşam', value: 300 },
  { name: 'Kitap', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default async function AdminDashboard() {
  // Bu sayfa sadece ADMIN rolüne sahip kullanıcılar tarafından erişilebilir
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ana Kontrol Paneli</h1>
          <p className="text-gray-600">Hoş geldiniz, {user.name}! İşletmenizin genel durumuna hızlı bir bakış.</p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <p className="text-sm font-medium text-gray-600">Toplam Satış</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">₺12,450</p>
            <p className="text-xs text-green-500 mt-2">+12% bu ay</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <p className="text-sm font-medium text-gray-600">Yeni Siparişler</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">245</p>
            <p className="text-xs text-red-500 mt-2">-5% bu hafta</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <p className="text-sm font-medium text-gray-600">Aktif Kullanıcılar</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">1,890</p>
            <p className="text-xs text-green-500 mt-2">+8% dün</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <p className="text-sm font-medium text-gray-600">Bekleyen Destek</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">14</p>
            <p className="text-xs text-gray-500 mt-2">Ort. yanıt süresi: 2 saat</p>
          </motion.div>
        </div>

        {/* Sales & Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Satış ve Gelir Genel Bakışı</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="sales" fill="#8884d8" name="Satışlar" />
              <Bar dataKey="revenue" fill="#82ca9d" name="Gelir" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Son Siparişler</h2>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">#1001 - Akıllı Saat</p>
                  <p className="text-sm text-gray-500">Ahmet Yılmaz</p>
                </div>
                <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">Tamamlandı</span>
              </li>
              <li className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">#1002 - Kablosuz Kulaklık</p>
                  <p className="text-sm text-gray-500">Ayşe Demir</p>
                </div>
                <span className="px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full">Beklemede</span>
              </li>
              <li className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">#1003 - Mekanik Klavye</p>
                  <p className="text-sm text-gray-500">Mehmet Can</p>
                </div>
                <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">Kargoda</span>
              </li>
            </ul>
          </motion.div>

          {/* Top Selling Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">En Çok Satan Kategoriler</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/sellers"
              className="flex flex-col items-center justify-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <span className="text-indigo-600 text-2xl mb-2">👥</span>
              <span className="text-sm font-medium text-gray-800">Satıcıları Yönet</span>
            </a>
            <a
              href="/admin/orders"
              className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <span className="text-green-600 text-2xl mb-2">📦</span>
              <span className="text-sm font-medium text-gray-800">Siparişleri Görüntüle</span>
            </a>
            <a
              href="/admin/analytics"
              className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <span className="text-purple-600 text-2xl mb-2">📊</span>
              <span className="text-sm font-medium text-gray-800">Raporları İncele</span>
            </a>
            <a
              href="/admin/settings"
              className="flex flex-col items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <span className="text-orange-600 text-2xl mb-2">⚙️</span>
              <span className="text-sm font-medium text-gray-800">Sistem Ayarları</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}