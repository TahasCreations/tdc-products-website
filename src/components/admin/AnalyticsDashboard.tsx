'use client'

import { useState, useMemo } from 'react'
import { 
  ChartBarIcon, 
  UsersIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  users: Array<{
    id: string
    created_at: string
    role: string
  }>
  products: Array<{
    id: string
    price: number
    created_at: string
    is_active: boolean
  }>
  categories: Array<{
    id: string
    created_at: string
    is_active: boolean
  }>
  orders: Array<{
    id: string
    total_amount: number
    status: string
    created_at: string
  }>
  recentOrders: Array<{
    id: string
    order_number: string
    total_amount: number
    status: string
    created_at: string
    users: {
      name: string
      email: string
    }
  }>
}

interface AnalyticsDashboardProps {
  data: AnalyticsData
}

export default function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  const analytics = useMemo(() => {
    const now = new Date()
    const timeRanges = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }
    
    const days = timeRanges[timeRange]
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

    // Filter data by time range
    const filteredUsers = data.users.filter(user => new Date(user.created_at) >= startDate)
    const filteredProducts = data.products.filter(product => new Date(product.created_at) >= startDate)
    const filteredOrders = data.orders.filter(order => new Date(order.created_at) >= startDate)

    // Calculate metrics
    const totalUsers = data.users.length
    const newUsers = filteredUsers.length
    const activeUsers = data.users.filter(user => user.role === 'USER').length
    const adminUsers = data.users.filter(user => user.role === 'ADMIN').length
    const sellerUsers = data.users.filter(user => user.role === 'SELLER').length

    const totalProducts = data.products.length
    const activeProducts = data.products.filter(product => product.is_active).length
    const newProducts = filteredProducts.length
    const averagePrice = data.products.length > 0 
      ? data.products.reduce((sum, product) => sum + product.price, 0) / data.products.length 
      : 0

    const totalCategories = data.categories.length
    const activeCategories = data.categories.filter(category => category.is_active).length

    const totalOrders = data.orders.length
    const newOrders = filteredOrders.length
    const totalRevenue = data.orders.reduce((sum, order) => sum + order.total_amount, 0)
    const periodRevenue = filteredOrders.reduce((sum, order) => sum + order.total_amount, 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Order status breakdown
    const orderStatuses = data.orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Monthly revenue (last 6 months)
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      
      const monthOrders = data.orders.filter(order => {
        const orderDate = new Date(order.created_at)
        return orderDate >= date && orderDate < nextMonth
      })
      
      return {
        month: date.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
        revenue: monthOrders.reduce((sum, order) => sum + order.total_amount, 0)
      }
    }).reverse()

    return {
      users: {
        total: totalUsers,
        new: newUsers,
        active: activeUsers,
        admin: adminUsers,
        seller: sellerUsers
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        new: newProducts,
        averagePrice
      },
      categories: {
        total: totalCategories,
        active: activeCategories
      },
      orders: {
        total: totalOrders,
        new: newOrders,
        totalRevenue,
        periodRevenue,
        averageOrderValue,
        statuses: orderStatuses
      },
      monthlyRevenue
    }
  }, [data, timeRange])

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = 'blue' 
  }: {
    title: string
    value: string | number
    change?: number
    icon: any
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500'
    }

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 ${colorClasses[color]} rounded-md flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change !== undefined && (
              <div className="flex items-center mt-1">
                {change >= 0 ? (
                  <TrendingUpIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDownIcon className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(change)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Genel Bakış</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7d">Son 7 Gün</option>
          <option value="30d">Son 30 Gün</option>
          <option value="90d">Son 90 Gün</option>
          <option value="1y">Son 1 Yıl</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Toplam Kullanıcı"
          value={analytics.users.total}
          icon={UsersIcon}
          color="blue"
        />
        <StatCard
          title="Toplam Ürün"
          value={analytics.products.total}
          icon={ShoppingBagIcon}
          color="green"
        />
        <StatCard
          title="Toplam Sipariş"
          value={analytics.orders.total}
          icon={ChartBarIcon}
          color="purple"
        />
        <StatCard
          title="Toplam Gelir"
          value={`₺${analytics.orders.totalRevenue.toLocaleString()}`}
          icon={CurrencyDollarIcon}
          color="yellow"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Kullanıcı Dağılımı</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Aktif Kullanıcılar</span>
              <span className="text-sm font-medium text-gray-900">{analytics.users.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Yöneticiler</span>
              <span className="text-sm font-medium text-gray-900">{analytics.users.admin}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Satıcılar</span>
              <span className="text-sm font-medium text-gray-900">{analytics.users.seller}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Yeni Kullanıcılar ({timeRange})</span>
              <span className="text-sm font-medium text-gray-900">{analytics.users.new}</span>
            </div>
          </div>
        </div>

        {/* Products Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ürün İstatistikleri</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Aktif Ürünler</span>
              <span className="text-sm font-medium text-gray-900">{analytics.products.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Yeni Ürünler ({timeRange})</span>
              <span className="text-sm font-medium text-gray-900">{analytics.products.new}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ortalama Fiyat</span>
              <span className="text-sm font-medium text-gray-900">₺{analytics.products.averagePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Toplam Kategori</span>
              <span className="text-sm font-medium text-gray-900">{analytics.categories.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders and Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sipariş Durumları</h3>
          <div className="space-y-3">
            {Object.entries(analytics.orders.statuses).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{status}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Gelir Özeti</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Toplam Gelir</span>
              <span className="text-sm font-medium text-gray-900">₺{analytics.orders.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Dönem Geliri ({timeRange})</span>
              <span className="text-sm font-medium text-gray-900">₺{analytics.orders.periodRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ortalama Sipariş Değeri</span>
              <span className="text-sm font-medium text-gray-900">₺{analytics.orders.averageOrderValue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Son Siparişler</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sipariş No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.order_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.users.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₺{order.total_amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
