'use client'

import { createContext, useContext, useState } from 'react'

interface Order {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  createdAt: string
}

interface OrderContextType {
  orders: Order[]
  addOrder: (order: Order) => void
  updateOrderStatus: (id: string, status: string) => void
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  addOrder: () => {},
  updateOrderStatus: () => {}
})

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev])
  }

  const updateOrderStatus = (id: string, status: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status } : order
      )
    )
  }

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus
    }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}
