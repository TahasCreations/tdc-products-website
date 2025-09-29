'use client'

import { useState, useCallback } from 'react'
import { MagnifyingGlassIcon, EyeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import OrderModal from './OrderModal'
import { toast } from 'react-hot-toast'

interface OrderItem {
  id: string
  quantity: number
  price: number
  products: {
    id: string
    name: string
    image_url?: string
  }
}

interface Order {
  id: string
  order_number: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_address: string
  billing_address: string
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  notes?: string
  created_at: string
  updated_at: string
  users: {
    id: string
    name: string
    email: string
  }
  order_items: OrderItem[]
}

interface OrderManagementProps {
  initialOrders: Order[]
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

const statusLabels = {
  pending: 'Beklemede',
  processing: 'İşleniyor',
  shipped: 'Kargoya Verildi',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi'
}

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
}

const paymentStatusLabels = {
  pending: 'Beklemede',
  paid: 'Ödendi',
  failed: 'Başarısız',
  refunded: 'İade Edildi'
}

export default function OrderManagement({ initialOrders }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.users.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.users.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = useCallback(async (orderId: string, newStatus: Order['status']) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error('Sipariş durumu güncellenemedi')

      const updatedOrder = await response.json()
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o))
      toast.success('Sipariş durumu güncellendi')
    } catch (error) {
      toast.error('Sipariş durumu güncellenirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const getTotalItems = (order: Order) => {
    return order.order_items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Sipariş ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tüm Durumlar</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Sipariş bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter ? 'Arama kriterlerinize uygun sipariş bulunamadı.' : 'Henüz sipariş bulunmuyor.'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <li key={order.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          #{order.order_number}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[order.payment_status]}`}>
                          {paymentStatusLabels[order.payment_status]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {order.users.name} ({order.users.email})
                      </p>
                      <p className="text-sm text-gray-500">
                        {getTotalItems(order)} ürün • ₺{order.total_amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Detayları Görüntüle"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>

                    {/* Quick Status Update */}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <div className="flex items-center space-x-1">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'processing')}
                            disabled={isLoading}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="İşleme Al"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'shipped')}
                            disabled={isLoading}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Kargoya Ver"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'delivered')}
                            disabled={isLoading}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Teslim Et"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                          disabled={isLoading}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          title="İptal Et"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Order Modal */}
      {isModalOpen && selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedOrder(null)
          }}
          onStatusUpdate={(newStatus) => {
            handleStatusUpdate(selectedOrder.id, newStatus)
            setSelectedOrder({ ...selectedOrder, status: newStatus })
          }}
        />
      )}
    </div>
  )
}
