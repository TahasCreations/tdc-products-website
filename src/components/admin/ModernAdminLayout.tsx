'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface ModernAdminLayoutProps {
  children: React.ReactNode;
}

const moduleGroups = [
  {
    id: 'overview',
    title: 'Genel Bakış',
    icon: '📊',
    color: 'blue',
    modules: [
      { id: 'dashboard', title: 'Dashboard', href: '/admin/dashboard', icon: '📊', description: 'Ana kontrol paneli' },
      { id: 'analytics', title: 'Analitik', href: '/admin/analytics', icon: '📈', description: 'Detaylı analizler' },
      { id: 'reports', title: 'Raporlar', href: '/admin/reports', icon: '📋', description: 'Mali raporlar' }
    ]
  },
  {
    id: 'accounting',
    title: 'Muhasebe & Finans',
    icon: '💼',
    color: 'green',
    modules: [
      { id: 'chart-of-accounts', title: 'Hesap Planı', href: '/admin/accounting/chart-of-accounts', icon: '📋', description: 'Hiyerarşik hesap yapısı' },
      { id: 'journals', title: 'Yevmiye', href: '/admin/accounting/journals', icon: '📝', description: 'Muhasebe kayıtları' },
      { id: 'ar', title: 'Alacaklar', href: '/admin/accounting/ar', icon: '💰', description: 'Müşteri alacakları' },
      { id: 'ap', title: 'Borçlar', href: '/admin/accounting/ap', icon: '💳', description: 'Tedarikçi borçları' },
      { id: 'banking', title: 'Banka & Nakit', href: '/admin/accounting/banking', icon: '🏦', description: 'Banka işlemleri' },
      { id: 'taxes', title: 'Vergiler', href: '/admin/accounting/taxes', icon: '🧾', description: 'Vergi yönetimi' },
      { id: 'assets', title: 'Duran Varlıklar', href: '/admin/accounting/assets', icon: '🏢', description: 'Sabit kıymetler' },
      { id: 'ai-assistant', title: 'AI KDV Asistanı', href: '/admin/accounting/ai-assistant', icon: '🤖', badge: 'NEW', description: 'AI destekli KDV yönetimi' }
    ]
  },
  {
    id: 'commerce',
    title: 'Ticaret Operasyonları',
    icon: '🛒',
    color: 'purple',
    modules: [
      { id: 'orders', title: 'Siparişler', href: '/admin/commerce/orders', icon: '📦', badge: '1.2K', description: 'Sipariş yaşam döngüsü' },
      { id: 'inventory', title: 'Envanter', href: '/admin/commerce/inventory', icon: '📊', description: 'Stok yönetimi' },
      { id: 'shipping', title: 'Kargo', href: '/admin/commerce/shipping', icon: '🚚', description: 'Kargo orkestrasyonu' },
      { id: 'sellers', title: 'Satıcılar', href: '/admin/commerce/sellers', icon: '🏪', badge: '89', description: 'Satıcı yönetimi' },
      { id: 'settlements', title: 'Ödemeler', href: '/admin/commerce/settlements', icon: '💸', description: 'Satıcı ödemeleri' },
      { id: 'returns', title: 'İadeler', href: '/admin/commerce/returns', icon: '↩️', description: 'RMA yönetimi' },
      { id: 'risk', title: 'Risk & Fraud', href: '/admin/commerce/risk', icon: '🛡️', description: 'Risk analizi' },
      { id: 'domains', title: 'Domain Yönetimi', href: '/admin/commerce/domains', icon: '🌐', description: 'White-label domainler' }
    ]
  },
  {
    id: 'marketing',
    title: 'Pazarlama & CRM',
    icon: '📢',
    color: 'orange',
    modules: [
      { id: 'promotions', title: 'Promosyonlar', href: '/admin/marketing/promotions', icon: '🎯', description: 'İndirim kuralları' },
      { id: 'coupons', title: 'Kuponlar', href: '/admin/marketing/coupons', icon: '🎫', badge: '45', description: 'Kupon yönetimi' },
      { id: 'ads', title: 'Reklamlar', href: '/admin/marketing/ads', icon: '📺', description: 'Promoted listings' },
      { id: 'crm', title: 'CRM', href: '/admin/marketing/crm', icon: '👥', description: 'Müşteri ilişkileri' },
      { id: 'campaigns', title: 'Kampanyalar', href: '/admin/marketing/campaigns', icon: '📧', description: 'E-posta/SMS kampanyaları' },
      { id: 'ab-tests', title: 'A/B Testleri', href: '/admin/marketing/ab-tests', icon: '🧪', description: 'Deney tasarımı' },
      { id: 'segments', title: 'Müşteri Segmentleri', href: '/admin/marketing/segments', icon: '🎭', description: 'Segmentasyon' },
      { id: 'analytics', title: 'Pazarlama Analitiği', href: '/admin/marketing/analytics', icon: '📊', description: 'Pazarlama metrikleri' }
    ]
  },
  {
    id: 'ai-lab',
    title: 'AI Laboratuvarı',
    icon: '🤖',
    color: 'pink',
    modules: [
      { id: 'keyword-explorer', title: 'Keyword Explorer', href: '/admin/ai/keyword-explorer', icon: '🔍', description: 'Anahtar kelime analizi' },
      { id: 'price-suggestion', title: 'AI Fiyat Önerisi', href: '/admin/ai/price-suggestion', icon: '💰', description: 'Fiyat optimizasyonu' },
      { id: 'seo-assistant', title: 'AI SEO Asistanı', href: '/admin/ai/seo-assistant', icon: '🎯', description: 'SEO optimizasyonu' },
      { id: 'visual-quality', title: 'Görsel Kalite', href: '/admin/ai/visual-quality', icon: '🖼️', description: 'Görsel analiz' },
      { id: 'trend-analysis', title: 'Trend Analizi', href: '/admin/ai/trend-analysis', icon: '📈', description: 'Pazar trendleri' },
      { id: 'predictions', title: 'Tahminler', href: '/admin/ai/predictions', icon: '🔮', description: 'Gelecek tahminleri' },
      { id: 'market-intelligence', title: 'Pazar Zekası', href: '/admin/ai/market-intelligence', icon: '🧠', description: 'Pazar analizi' },
      { id: 'automation', title: 'Otomasyon', href: '/admin/ai/automation', icon: '⚙️', description: 'İşlem otomasyonu' }
    ]
  },
  {
    id: 'system',
    title: 'Sistem Yönetimi',
    icon: '⚙️',
    color: 'gray',
    modules: [
      { id: 'users', title: 'Kullanıcılar', href: '/admin/users', icon: '👥', description: 'Kullanıcı yönetimi' },
      { id: 'roles', title: 'Roller', href: '/admin/roles', icon: '🔐', description: 'Yetki yönetimi' },
      { id: 'settings', title: 'Ayarlar', href: '/admin/settings', icon: '⚙️', description: 'Sistem ayarları' },
      { id: 'security', title: 'Güvenlik', href: '/admin/security', icon: '🛡️', description: 'Güvenlik ayarları' },
      { id: 'backup', title: 'Yedekleme', href: '/admin/backup', icon: '💾', description: 'Veritabanı yedekleri' },
      { id: 'logs', title: 'Loglar', href: '/admin/logs', icon: '📄', description: 'Sistem logları' }
    ]
  },
        {
          id: 'developer',
          title: 'Developer Tools',
          icon: '🛠️',
          color: 'indigo',
          modules: [
            { id: 'api-docs', title: 'API Dokümantasyonu', href: '/admin/developer/api-docs', icon: '📚', description: 'API referansı ve test araçları' },
            { id: 'webhooks', title: 'Webhook Yönetimi', href: '/admin/developer/webhooks', icon: '🔗', description: 'Webhook konfigürasyonu' },
            { id: 'plugins', title: 'Eklenti Sistemi', href: '/admin/developer/plugins', icon: '🧩', description: 'Eklenti yönetimi' },
            { id: 'workflows', title: 'İş Akışları', href: '/admin/developer/workflows', icon: '⚡', description: 'Otomasyon kuralları' }
          ]
        },
        {
          id: 'content',
          title: 'İçerik Yönetimi',
          icon: '📝',
          color: 'teal',
          modules: [
            { id: 'blog-moderasyon', title: 'Blog Kontrolü', href: '/admin/blog-moderasyon', icon: '📝', description: 'UGC blog moderasyonu', badge: 'NEW' },
            { id: 'content-approval', title: 'İçerik Onayı', href: '/admin/content-approval', icon: '✅', description: 'İçerik onay süreçleri' },
            { id: 'user-content', title: 'Kullanıcı İçerikleri', href: '/admin/user-content', icon: '👥', description: 'Kullanıcı üretimi içerikler' },
            { id: 'reports', title: 'Raporlar', href: '/admin/content-reports', icon: '🚨', description: 'İçerik raporları' }
          ]
        }
];

export default function ModernAdminLayout({ children }: ModernAdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(5);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Close sidebar on route change for mobile
    if (isSidebarOpen && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isSidebarOpen]);

  const handleLogout = () => {
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin');
  };

  const filteredGroups = moduleGroups.map(group => ({
    ...group,
    modules: group.modules.filter(module =>
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.modules.length > 0);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:bg-white lg:shadow-xl lg:border-r lg:border-gray-200">
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-coral-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TDC Admin</h1>
                <p className="text-sm text-gray-500">Yönetim Paneli</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Modül ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-6 space-y-6">
              {filteredGroups.map((group) => (
                <div key={group.id}>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">{group.icon}</span>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      {group.title}
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {group.modules.map((module) => (
                      <Link
                        key={module.id}
                        href={module.href}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors group ${
                          pathname === module.href
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{module.icon}</span>
                          <div>
                            <p className="font-medium">{module.title}</p>
                            <p className="text-xs text-gray-500">{module.description}</p>
                          </div>
                        </div>
                        {module.badge && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            module.badge === 'NEW' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {module.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
            >
              <span>🚪</span>
              <span className="font-medium">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl lg:hidden"
          >
            <div className="flex h-full flex-col">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-coral-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">TDC Admin</h1>
                    <p className="text-sm text-gray-500">Yönetim Paneli</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-600">✕</span>
                </button>
              </div>

              {/* Search */}
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Modül ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto">
                <nav className="p-6 space-y-6">
                  {filteredGroups.map((group) => (
                    <div key={group.id}>
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl">{group.icon}</span>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                          {group.title}
                        </h3>
                      </div>
                      <div className="space-y-1">
                        {group.modules.map((module) => (
                          <Link
                            key={module.id}
                            href={module.href}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors group ${
                              pathname === module.href
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">{module.icon}</span>
                              <div>
                                <p className="font-medium">{module.title}</p>
                                <p className="text-xs text-gray-500">{module.description}</p>
                              </div>
                            </div>
                            {module.badge && (
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                module.badge === 'NEW' 
                                  ? 'bg-purple-100 text-purple-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {module.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>

              {/* Sidebar Footer */}
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                >
                  <span>🚪</span>
                  <span className="font-medium">Çıkış Yap</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-600">☰</span>
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {pathname === '/admin/dashboard' ? 'Dashboard' : 
                   pathname.includes('/accounting') ? 'Muhasebe & Finans' :
                   pathname.includes('/commerce') ? 'Ticaret Operasyonları' :
                   pathname.includes('/marketing') ? 'Pazarlama & CRM' :
                   pathname.includes('/ai') ? 'AI Laboratuvarı' :
                   pathname.includes('/system') ? 'Sistem Yönetimi' : 'Admin Panel'}
                </h2>
                <p className="text-sm text-gray-500">
                  {pathname === '/admin/dashboard' ? 'Ana kontrol paneli' : 
                   pathname.includes('/accounting') ? 'Mali işlemler ve raporlama' :
                   pathname.includes('/commerce') ? 'Sipariş ve envanter yönetimi' :
                   pathname.includes('/marketing') ? 'Pazarlama kampanyaları ve CRM' :
                   pathname.includes('/ai') ? 'Yapay zeka araçları ve analiz' :
                   pathname.includes('/system') ? 'Sistem ayarları ve güvenlik' : 'Yönetim paneli'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-600">🔔</span>
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-coral-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">A</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@tdcproducts.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}