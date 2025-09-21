'use client';

import Link from 'next/link';
import { 
  ChartBarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CogIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  CloudIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

const adminModules = [
  {
    category: 'Genel Yönetim',
    icon: ChartBarIcon,
    color: 'from-blue-500 to-blue-600',
    modules: [
      { name: 'Dashboard', href: '/admin/dashboard', description: 'Genel bakış ve istatistikler' },
      { name: 'Kullanıcılar', href: '/admin/users', description: 'Kullanıcı yönetimi' },
      { name: 'Güvenlik', href: '/admin/security', description: 'Güvenlik ayarları' },
      { name: 'Yedekleme', href: '/admin/backup', description: 'Veri yedekleme' }
    ]
  },
  {
    category: 'E-Ticaret',
    icon: ShoppingBagIcon,
    color: 'from-green-500 to-green-600',
    modules: [
      { name: 'Ürünler', href: '/admin/products', description: 'Ürün yönetimi' },
      { name: 'Siparişler', href: '/admin/orders', description: 'Sipariş takibi' },
      { name: 'Ödemeler', href: '/admin/payments', description: 'Ödeme yönetimi' },
      { name: 'Envanter', href: '/admin/inventory', description: 'Stok yönetimi' },
      { name: 'E-ticaret Ayarları', href: '/admin/ecommerce', description: 'E-ticaret konfigürasyonu' }
    ]
  },
  {
    category: 'Muhasebe',
    icon: CurrencyDollarIcon,
    color: 'from-purple-500 to-purple-600',
    modules: [
      { name: 'Muhasebe Ana', href: '/admin/accounting', description: 'Muhasebe ana sayfası' },
      { name: 'Faturalar', href: '/admin/invoices', description: 'Fatura yönetimi' },
      { name: 'Finans', href: '/admin/finance', description: 'Finansal raporlar' },
      { name: 'Dönem İşlemleri', href: '/admin/period-operations', description: 'Dönemsel işlemler' }
    ]
  },
  {
    category: 'İnsan Kaynakları',
    icon: UserGroupIcon,
    color: 'from-orange-500 to-orange-600',
    modules: [
      { name: 'İK Yönetimi', href: '/admin/hr', description: 'İnsan kaynakları' },
      { name: 'Maaş Bordrosu', href: '/admin/accounting/payroll', description: 'Maaş yönetimi' }
    ]
  },
  {
    category: 'Pazarlama & İletişim',
    icon: MegaphoneIcon,
    color: 'from-pink-500 to-pink-600',
    modules: [
      { name: 'Pazarlama', href: '/admin/marketing', description: 'Pazarlama kampanyaları' },
      { name: 'Blog Yönetimi', href: '/admin/blogs', description: 'Blog ve içerik' },
      { name: 'Yorumlar', href: '/admin/comments', description: 'Kullanıcı yorumları' },
      { name: 'CRM', href: '/admin/crm', description: 'Müşteri ilişkileri' }
    ]
  },
  {
    category: 'Teknik & Sistem',
    icon: CogIcon,
    color: 'from-gray-500 to-gray-600',
    modules: [
      { name: 'PWA Ayarları', href: '/admin/pwa', description: 'Progressive Web App' },
      { name: 'Çoklu Dil', href: '/admin/i18n', description: 'Dil yönetimi' },
      { name: 'Ana Sayfa Kontrolü', href: '/admin/homepage-controls', description: 'Ana sayfa düzenleme' },
      { name: 'Raporlar', href: '/admin/reports', description: 'Sistem raporları' }
    ]
  },
  {
    category: 'Analitik & AI',
    icon: ChartPieIcon,
    color: 'from-indigo-500 to-indigo-600',
    modules: [
      { name: 'Analitik', href: '/admin/analytics', description: 'Veri analizi' },
      { name: 'AI Yönetimi', href: '/admin/ai', description: 'Yapay zeka araçları' }
    ]
  }
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Paneli</h1>
              <p className="text-gray-600 mt-1">Sistem yönetimi ve konfigürasyon</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i className="ri-home-line mr-2"></i>
                Ana Sayfa
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {adminModules.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mr-4`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{category.category}</h2>
                    <p className="text-gray-600 text-sm">İlgili modüller ve araçlar</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {category.modules.map((module, moduleIndex) => (
                    <Link
                      key={moduleIndex}
                      href={module.href}
                      className="group p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-md border border-transparent hover:border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {module.name}
                        </h3>
                        <i className="ri-arrow-right-s-line text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"></i>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {module.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-shopping-bag-line text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">5,678</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">₺123,456</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-package-line text-orange-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Ürün</p>
                <p className="text-2xl font-bold text-gray-900">890</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}