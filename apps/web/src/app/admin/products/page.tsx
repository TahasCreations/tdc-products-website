import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminProductsPage() {
  const session = await auth()
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div className="p-6">
      <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
        <p className="text-gray-600">Ürünlerinizi yönetin</p>
            </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Ürün Yönetimi</h3>
          <p className="mt-1 text-sm text-gray-500">
            Ürün yönetimi modülü geliştirme aşamasında.
          </p>
          <div className="mt-6">
            <Link
              href="/admin/categories"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Kategori Yönetimine Git
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
