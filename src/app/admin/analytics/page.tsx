import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'

export default async function AdminAnalyticsPage() {
  const session = await auth()
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const supabase = createClient()
  
  // Fetch analytics data
  const [
    usersResult,
    productsResult,
    categoriesResult,
    ordersResult,
    recentOrdersResult
  ] = await Promise.all([
    supabase.from('users').select('id, created_at, role').order('created_at', { ascending: false }),
    supabase.from('products').select('id, price, created_at, is_active').order('created_at', { ascending: false }),
    supabase.from('categories').select('id, created_at, is_active').order('created_at', { ascending: false }),
    supabase.from('orders').select('id, total_amount, status, created_at').order('created_at', { ascending: false }),
    supabase.from('orders').select(`
      id,
      order_number,
      total_amount,
      status,
      created_at,
      users (name, email)
    `).order('created_at', { ascending: false }).limit(10)
  ])

  const analyticsData = {
    users: usersResult.data || [],
    products: productsResult.data || [],
    categories: categoriesResult.data || [],
    orders: ordersResult.data || [],
    recentOrders: (recentOrdersResult.data || []).map(order => ({
      ...order,
      users: Array.isArray(order.users) ? order.users[0] : order.users
    }))
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
                <h1 className="text-2xl font-bold text-gray-900">Analitik Dashboard</h1>
                <p className="text-sm text-gray-600">Detaylı raporlar ve analizler</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <AnalyticsDashboard data={analyticsData} />
      </main>
    </div>
  )
}
