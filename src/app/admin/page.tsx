'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminProtection from '../../components/AdminProtection';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Eğer admin girişi yapılmamışsa login sayfasına yönlendir
    const storedAdmin = localStorage.getItem('admin_user');
    if (!storedAdmin) {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <AdminProtection>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TDC Admin Panel</h1>
          <p className="text-gray-600">Yönetim ve kontrol merkezi</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <i className="ri-shopping-cart-line text-2xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Satış</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <i className="ri-user-line text-2xl text-purple-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <i className="ri-box-line text-2xl text-orange-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Menu */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Admin Menüsü</h2>
            <p className="text-gray-600">Yönetim işlemlerinizi buradan gerçekleştirebilirsiniz</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Admin Users Management */}
              <Link
                href="/admin/dashboard"
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <i className="ri-user-settings-line text-2xl text-blue-600"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Admin Kullanıcıları</h3>
                    <p className="text-sm text-gray-600">Admin kullanıcılarını yönetin</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Yeni admin kullanıcıları ekleyin, mevcut adminleri düzenleyin veya silin.
                </p>
              </Link>

              {/* Blog Management */}
              <Link
                href="/admin/blogs"
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <i className="ri-article-line text-2xl text-green-600"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Blog Yönetimi</h3>
                    <p className="text-sm text-gray-600">Blog yazılarını yönetin</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Blog yazıları oluşturun, düzenleyin ve yayınlayın.
                </p>
              </Link>

              {/* Comments & Customers Management */}
              <Link
                href="/admin/comments"
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <i className="ri-chat-3-line text-2xl text-purple-600"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Yorum & Müşteri Yönetimi</h3>
                    <p className="text-sm text-gray-600">Blog yorumları ve müşteri bilgileri</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Blog yorumlarını onaylayın ve müşteri bilgilerini görüntüleyin.
                </p>
              </Link>

              {/* Products Management */}
              <Link
                href="/admin/products"
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <i className="ri-box-line text-2xl text-orange-600"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Ürün Yönetimi</h3>
                    <p className="text-sm text-gray-600">Ürünleri yönetin</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Ürün ekleyin, düzenleyin ve stok durumlarını kontrol edin.
                </p>
              </Link>

              {/* Orders Management */}
              <Link
                href="/admin/orders"
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                    <i className="ri-shopping-cart-line text-2xl text-red-600"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Sipariş Yönetimi</h3>
                    <p className="text-sm text-gray-600">Siparişleri yönetin</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Siparişleri görüntüleyin, durumlarını güncelleyin.
                </p>
              </Link>

              {/* Finance Management */}
              <Link
                href="/admin/finance"
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Finans Yönetimi</h3>
                    <p className="text-sm text-gray-600">Gelir, gider ve kar analizi</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Fatura kesme, gider takibi ve kar analizi yapın.
                </p>
              </Link>

              {/* Reports */}
              <Link
                href="/admin/reports"
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <i className="ri-bar-chart-box-line text-2xl text-purple-600"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Raporlar</h3>
                    <p className="text-sm text-gray-600">Detaylı finansal raporlar</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Grafik, PDF ve Excel raporları oluşturun.
                </p>
              </Link>

              {/* Invoice Management */}
              <Link
                href="/admin/invoices"
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <i className="ri-file-text-line text-2xl text-orange-600"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Fatura Yönetimi</h3>
                    <p className="text-sm text-gray-600">Fatura oluşturma ve yönetimi</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Fatura şablonları, PDF oluşturma ve e-posta gönderimi.
                </p>
              </Link>

              {/* Inventory Management */}
              <Link
                href="/admin/inventory"
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                    <i className="ri-box-line text-2xl text-teal-600"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Stok Yönetimi</h3>
                    <p className="text-sm text-gray-600">Envanter takibi ve stok hareketleri</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Stok takibi, satın alma siparişleri ve envanter yönetimi.
                </p>
              </Link>

              {/* CRM Management */}
              <Link
                href="/admin/crm"
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors">
                    <i className="ri-user-heart-line text-2xl text-pink-600"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">CRM Yönetimi</h3>
                    <p className="text-sm text-gray-600">Müşteri ilişkileri ve satış süreçleri</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Müşteri takibi, iletişim geçmişi ve satış fırsatları.
                </p>
              </Link>

              {/* E-commerce Management */}
              <Link
                href="/admin/ecommerce"
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                    <i className="ri-shopping-cart-line text-2xl text-indigo-600"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">E-ticaret Yönetimi</h3>
                    <p className="text-sm text-gray-600">Kargo, ödeme ve kupon sistemleri</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Kargo firmaları, ödeme yöntemleri ve kupon yönetimi.
                </p>
              </Link>

              {/* HR Management */}
              <Link
                href="/admin/hr"
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors">
                    <i className="ri-team-line text-2xl text-cyan-600"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">İnsan Kaynakları</h3>
                    <p className="text-sm text-gray-600">Çalışan yönetimi ve HR süreçleri</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Çalışan takibi, maaş bordroları ve izin yönetimi.
                </p>
              </Link>

              {/* Analytics */}
              <Link
                href="/admin/analytics"
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                    <i className="ri-bar-chart-line text-2xl text-indigo-600"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Analitik</h3>
                    <p className="text-sm text-gray-600">Site istatistikleri</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Site performansı ve kullanıcı istatistiklerini görüntüleyin.
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h2>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 py-8">
              <i className="ri-time-line text-4xl mb-4"></i>
              <p>Henüz aktivite bulunmuyor</p>
            </div>
          </div>
        </div>
      </div>
    </AdminProtection>
  );
}
