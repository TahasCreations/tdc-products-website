'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface MenuGroup {
  title: string;
  icon: string;
  items: MenuItem[];
}

interface MenuItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
}

const menuGroups: MenuGroup[] = [
  {
    title: 'Genel',
    icon: '📊',
    items: [
      { title: 'Dashboard', href: '/admin/dashboard', icon: '🏠' },
      { title: 'Analitik', href: '/admin/analytics', icon: '📈' },
      { title: 'Raporlar', href: '/admin/reports', icon: '📋' }
    ]
  },
  {
    title: 'E-Ticaret',
    icon: '🛒',
    items: [
      { title: 'Ürünler', href: '/admin/products', icon: '📦', badge: null, badgeColor: 'blue' },
      { title: 'Kategoriler', href: '/admin/categories', icon: '🏷️', badge: null, badgeColor: 'green' },
      { title: 'Siparişler', href: '/admin/orders', icon: '🛍️', badge: null, badgeColor: 'purple' },
      { title: 'Stok Yönetimi', href: '/admin/inventory', icon: '📦', badge: null, badgeColor: 'orange' },
      { title: 'Kuponlar', href: '/admin/coupons', icon: '🎫', badge: null, badgeColor: 'pink' }
    ]
  },
  {
    title: 'Kullanıcılar',
    icon: '👥',
    items: [
      { title: 'Müşteriler', href: '/admin/customers', icon: '👤', badge: null, badgeColor: 'blue' },
      { title: 'Satıcılar', href: '/admin/sellers', icon: '🏪', badge: null, badgeColor: 'green' },
      { title: 'Yorumlar', href: '/admin/reviews', icon: '💬', badge: null, badgeColor: 'purple' },
      { title: 'Destek Talepleri', href: '/admin/support', icon: '🎧', badge: null, badgeColor: 'red' }
    ]
  },
  {
    title: 'İçerik',
    icon: '📝',
    items: [
      { title: 'Medya Yönetimi', href: '/admin/media', icon: '🖼️' },
      { title: 'Blog Yazıları', href: '/admin/blog', icon: '📰' },
      { title: 'Sayfalar', href: '/admin/pages', icon: '📄' },
      { title: 'Menüler', href: '/admin/menus', icon: '🔗' }
    ]
  },
  {
    title: 'Pazarlama',
    icon: '📢',
    items: [
      { title: 'E-posta Kampanyaları', href: '/admin/email-campaigns', icon: '📧' },
      { title: 'Sosyal Medya', href: '/admin/social', icon: '📱' },
      { title: 'SEO', href: '/admin/seo', icon: '🔍' },
      { title: 'Bannerlar', href: '/admin/banners', icon: '🖼️' }
    ]
  },
  {
    title: 'Sistem',
    icon: '⚙️',
    items: [
      { title: 'Ayarlar', href: '/admin/settings', icon: '🔧' },
      { title: 'Güvenlik', href: '/admin/security', icon: '🔒' },
      { title: 'Yedekleme', href: '/admin/backup', icon: '💾' },
      { title: 'Loglar', href: '/admin/logs', icon: '📜' }
    ]
  }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleLogout = () => {
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
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
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-coral-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">TDC Admin</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-2">
                <div className="flex items-center px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  <span className="mr-2">{group.icon}</span>
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{item.icon}</span>
                        {item.title}
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.badgeColor === 'blue' ? 'bg-blue-100 text-blue-800' :
                          item.badgeColor === 'green' ? 'bg-green-100 text-green-800' :
                          item.badgeColor === 'purple' ? 'bg-purple-100 text-purple-800' :
                          item.badgeColor === 'orange' ? 'bg-orange-100 text-orange-800' :
                          item.badgeColor === 'pink' ? 'bg-pink-100 text-pink-800' :
                          item.badgeColor === 'red' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <span className="text-gray-600 font-medium text-sm">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">admin@tdcproducts.com</p>
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
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <h2 className="text-lg font-semibold text-gray-900">
                  {menuGroups.flatMap(g => g.items).find(item => item.href === pathname)?.title || 'Dashboard'}
                </h2>
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
