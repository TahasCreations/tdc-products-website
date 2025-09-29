import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import OrderManagement from '@/components/admin/OrderManagement'

export default async function AdminOrdersPage() {
  const session = await auth()
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const supabase = createClient()
  
  // Fetch orders with user and product details
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      users (
        id,
        name,
        email
      ),
      order_items (
        id,
        quantity,
        price,
        products (
          id,
          name,
          image_url
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h1>
                <p className="text-sm text-gray-600">Siparişleri takip edin ve yönetin</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Toplam {orders?.length || 0} sipariş
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <OrderManagement initialOrders={orders || []} />
      </main>
    </div>
  )
}
