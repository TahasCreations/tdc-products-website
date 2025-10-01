'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface TDCMarketAdminLayoutProps {
  children: React.ReactNode;
}

interface ModuleGroup {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  modules: Module[];
}

interface Module {
  id: string;
  title: string;
  href: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
  description: string;
}

const moduleGroups: ModuleGroup[] = [
  {
    id: 'accounting',
    title: 'Accounting',
    icon: '📊',
    color: 'blue',
    description: 'ETA-class muhasebe ve finans yönetimi',
    modules: [
      { id: 'chart-of-accounts', title: 'Hesap Planı', href: '/admin/accounting/chart-of-accounts', icon: '📋', description: 'Hiyerarşik hesap yapısı' },
      { id: 'journals', title: 'Yevmiye', href: '/admin/accounting/journals', icon: '📝', description: 'Muhasebe kayıtları' },
      { id: 'ar', title: 'Alacaklar', href: '/admin/accounting/ar', icon: '💰', description: 'Müşteri alacakları' },
      { id: 'ap', title: 'Borçlar', href: '/admin/accounting/ap', icon: '💳', description: 'Tedarikçi borçları' },
      { id: 'banking', title: 'Banka & Nakit', href: '/admin/accounting/banking', icon: '🏦', description: 'Banka işlemleri' },
      { id: 'taxes', title: 'Vergiler', href: '/admin/accounting/taxes', icon: '🧾', description: 'Vergi yönetimi' },
      { id: 'assets', title: 'Duran Varlıklar', href: '/admin/accounting/assets', icon: '🏢', description: 'Sabit kıymetler' },
      { id: 'reports', title: 'Finansal Raporlar', href: '/admin/accounting/reports', icon: '📈', description: 'Mali tablolar' },
      { id: 'ai-assistant', title: 'AI KDV Asistanı', href: '/admin/accounting/ai-assistant', icon: '🤖', badge: 'NEW', badgeColor: 'purple', description: 'AI destekli KDV yönetimi ve kâr optimizasyonu' }
    ]
  },
  {
    id: 'commerce',
    title: 'Commerce Ops',
    icon: '🛒',
    color: 'green',
    description: 'Pazar yeri operasyonları ve sipariş yönetimi',
    modules: [
      { id: 'orders', title: 'Siparişler', href: '/admin/commerce/orders', icon: '📦', badge: '1.2K', badgeColor: 'blue', description: 'Sipariş yaşam döngüsü' },
      { id: 'inventory', title: 'Envanter', href: '/admin/commerce/inventory', icon: '📊', description: 'Stok yönetimi' },
      { id: 'shipping', title: 'Kargo', href: '/admin/commerce/shipping', icon: '🚚', description: 'Kargo orkestrasyonu' },
      { id: 'sellers', title: 'Satıcılar', href: '/admin/commerce/sellers', icon: '🏪', badge: '89', badgeColor: 'green', description: 'Satıcı yönetimi' },
      { id: 'settlements', title: 'Ödemeler', href: '/admin/commerce/settlements', icon: '💸', description: 'Satıcı ödemeleri' },
      { id: 'returns', title: 'İadeler', href: '/admin/commerce/returns', icon: '↩️', description: 'RMA yönetimi' },
      { id: 'risk', title: 'Risk & Fraud', href: '/admin/commerce/risk', icon: '🛡️', description: 'Risk analizi' },
      { id: 'domains', title: 'Domain Yönetimi', href: '/admin/commerce/domains', icon: '🌐', description: 'White-label domainler' }
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing',
    icon: '📢',
    color: 'purple',
    description: 'Promosyon, reklam, CRM ve A/B testleri',
    modules: [
      { id: 'promotions', title: 'Promosyonlar', href: '/admin/marketing/promotions', icon: '🎯', description: 'İndirim kuralları' },
      { id: 'coupons', title: 'Kuponlar', href: '/admin/marketing/coupons', icon: '🎫', badge: '45', badgeColor: 'purple', description: 'Kupon yönetimi' },
      { id: 'ads', title: 'Reklamlar', href: '/admin/marketing/ads', icon: '📺', description: 'Promoted listings' },
      { id: 'crm', title: 'CRM', href: '/admin/marketing/crm', icon: '👥', description: 'Müşteri ilişkileri' },
      { id: 'campaigns', title: 'Kampanyalar', href: '/admin/marketing/campaigns', icon: '📧', description: 'E-posta kampanyaları' },
      { id: 'ab-tests', title: 'A/B Testleri', href: '/admin/marketing/ab-tests', icon: '🧪', description: 'Deney tasarımı' },
      { id: 'segments', title: 'Müşteri Segmentleri', href: '/admin/marketing/segments', icon: '🎭', description: 'Segmentasyon' },
      { id: 'analytics', title: 'Pazarlama Analitiği', href: '/admin/marketing/analytics', icon: '📊', description: 'ROI analizi' }
    ]
  },
  {
    id: 'ai-lab',
    title: 'AI Lab',
    icon: '🤖',
    color: 'orange',
    description: 'Marmelad-benzeri keyword & pazar zekası',
    modules: [
      { id: 'keyword-explorer', title: 'Keyword Explorer', href: '/admin/ai/keyword-explorer', icon: '🔍', description: 'Anahtar kelime analizi' },
      { id: 'price-ai', title: 'AI Fiyat Önerisi', href: '/admin/ai/price-ai', icon: '💰', description: 'Akıllı fiyatlandırma' },
      { id: 'seo-ai', title: 'AI SEO Asistanı', href: '/admin/ai/seo-ai', icon: '📝', description: 'SEO optimizasyonu' },
      { id: 'vision-ai', title: 'Görsel Kalite', href: '/admin/ai/vision-ai', icon: '🖼️', description: 'Görsel moderasyon' },
      { id: 'trends', title: 'Trend Analizi', href: '/admin/ai/trends', icon: '📈', description: 'Pazar trendleri' },
      { id: 'predictions', title: 'Tahminler', href: '/admin/ai/predictions', icon: '🔮', description: 'Stok ve satış tahminleri' },
      { id: 'insights', title: 'Pazar Zekası', href: '/admin/ai/insights', icon: '🧠', description: 'Rekabet analizi' },
      { id: 'automation', title: 'Otomasyon', href: '/admin/ai/automation', icon: '⚡', description: 'AI iş akışları' }
    ]
  }
];

export default function TDCMarketAdminLayout({ children }: TDCMarketAdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check admin authentication
    const adminAuth = document.cookie.includes('adminAuth=true');
    if (adminAuth) {
      setIsAuthenticated(true);
    } else {
      router.push('/admin');
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    // Determine active module from pathname
    const pathSegments = pathname.split('/');
    if (pathSegments.length >= 3) {
      const moduleGroup = pathSegments[2];
      setActiveModule(moduleGroup);
    }
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">TDC Market Admin yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getModuleGroup = (moduleId: string) => {
    return moduleGroups.find(group => group.id === moduleId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                <span className="text-indigo-600 font-bold text-sm">TDC</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">TDC Market</h1>
                <p className="text-xs text-indigo-100">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
            {moduleGroups.map((group) => (
              <div key={group.id} className="space-y-3">
                <div className="flex items-center px-3 py-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  <span className="mr-2 text-lg">{group.icon}</span>
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.modules.map((module) => (
                    <Link
                      key={module.id}
                      href={module.href}
                      className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        pathname === module.href
                          ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center flex-1">
                        <span className="mr-3 text-lg">{module.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{module.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{module.description}</div>
                        </div>
                      </div>
                      {module.badge && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          module.badgeColor === 'blue' ? 'bg-blue-100 text-blue-800' :
                          module.badgeColor === 'green' ? 'bg-green-100 text-green-800' :
                          module.badgeColor === 'purple' ? 'bg-purple-100 text-purple-800' :
                          module.badgeColor === 'orange' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
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

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-medium text-sm">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@tdcmarket.com</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Çıkış Yap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeModule ? getModuleGroup(activeModule)?.title : 'Dashboard'}
                </h2>
                {activeModule && (
                  <span className="ml-3 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    {getModuleGroup(activeModule)?.description}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6z" />
                </svg>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Search */}
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
