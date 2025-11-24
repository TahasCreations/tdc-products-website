'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Palette, 
  Globe, 
  Settings, 
  CreditCard,
  Users,
  MessageSquare,
  TrendingUp,
  Store,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
  LogOut,
  Tag
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  href: string;
  badge?: string;
  submenu?: {
    label: string;
    href: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/seller',
  },
  {
    id: 'products',
    label: 'Ürünler',
    icon: Package,
    href: '/seller/products',
    submenu: [
      { label: 'Tüm Ürünler', href: '/seller/products' },
      { label: 'Yeni Ürün Ekle', href: '/seller/products/new' },
      { label: 'Kategoriler', href: '/seller/products/categories' },
      { label: 'Stok Yönetimi', href: '/seller/products/inventory' },
    ],
  },
  {
    id: 'orders',
    label: 'Siparişler',
    icon: ShoppingCart,
    href: '/seller/orders',
    badge: '3',
  },
  {
    id: 'returns',
    label: 'İade Talepleri',
    icon: Package,
    href: '/seller/returns',
  },
  {
    id: 'coupons',
    label: 'Kuponlar',
    icon: Tag,
    href: '/seller/coupons',
  },
  {
    id: 'support',
    label: 'Destek Talepleri',
    icon: MessageSquare,
    href: '/seller/support',
  },
  {
    id: 'customers',
    label: 'Müşteriler',
    icon: Users,
    href: '/seller/customers',
  },
  {
    id: 'analytics',
    label: 'Analitik',
    icon: BarChart3,
    href: '/seller/analytics',
    submenu: [
      { label: 'Genel Bakış', href: '/seller/analytics' },
      { label: 'Satış Raporları', href: '/seller/analytics/sales' },
      { label: 'Ürün Performansı', href: '/seller/analytics/products' },
      { label: 'Müşteri Analizi', href: '/seller/analytics/customers' },
    ],
  },
  {
    id: 'marketing',
    label: 'Pazarlama',
    icon: TrendingUp,
    href: '/seller/marketing',
    submenu: [
      { label: 'Kampanyalar', href: '/seller/marketing/campaigns' },
      { label: 'Kuponlar', href: '/seller/marketing/coupons' },
      { label: 'Reklamlar', href: '/seller/marketing/ads' },
    ],
  },
  {
    id: 'store',
    label: 'Mağaza Tasarımı',
    icon: Store,
    href: '/seller/store',
    submenu: [
      { label: 'Site Builder', href: '/seller/store/builder' },
      { label: 'Tema Ayarları', href: '/seller/store/theme' },
      { label: 'Sayfalar', href: '/seller/store/pages' },
      { label: 'Menü Yönetimi', href: '/seller/store/menus' },
    ],
  },
  {
    id: 'domain',
    label: 'Domain Yönetimi',
    icon: Globe,
    href: '/seller/domain',
  },
  {
    id: 'billing',
    label: 'Abonelik & Fatura',
    icon: CreditCard,
    href: '/seller/billing',
  },
  {
    id: 'settings',
    label: 'Ayarlar',
    icon: Settings,
    href: '/seller/settings',
    submenu: [
      { label: 'Genel Ayarlar', href: '/seller/settings' },
      { label: 'Profil', href: '/seller/settings/profile' },
      { label: 'Ödeme Bilgileri', href: '/seller/settings/payment' },
      { label: 'Kargo Ayarları', href: '/seller/settings/shipping' },
      { label: 'Bildirimler', href: '/seller/settings/notifications' },
    ],
  },
];

export default function SellerAdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const pathname = usePathname();
  const { data: session } = useSession();

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (href: string) => {
    if (href === '/seller') {
      return pathname === '/seller';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:block hidden"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <Link href="/seller" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TDC Satıcı
              </span>
            </Link>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ürün, sipariş veya müşteri ara..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block"
            >
              Mağazayı Görüntüle
            </Link>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                <p className="text-xs text-gray-500">Satıcı Hesabı</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Çıkış Yap"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
        } hidden lg:block overflow-hidden`}
      >
        <nav className="p-4 space-y-1 overflow-y-auto h-full">
          {menuItems.map((item) => (
            <div key={item.id}>
              <Link
                href={item.href}
                onClick={(e) => {
                  if (item.submenu) {
                    e.preventDefault();
                    toggleSubmenu(item.id);
                  }
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive(item.href) ? 'text-indigo-600' : 'text-gray-500'
                    }`}
                  />
                  {sidebarOpen && (
                    <span className="font-medium truncate">{item.label}</span>
                  )}
                </div>
                {sidebarOpen && (
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.submenu && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedMenus.includes(item.id) ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </div>
                )}
              </Link>

              {/* Submenu */}
              {item.submenu && sidebarOpen && expandedMenus.includes(item.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-8 mt-1 space-y-1"
                >
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.href}
                      href={subitem.href}
                      className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                        pathname === subitem.href
                          ? 'text-indigo-600 bg-indigo-50'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className="fixed left-0 top-16 bottom-0 w-80 bg-white border-r border-gray-200 z-50 lg:hidden overflow-y-auto"
            >
              <nav className="p-4 space-y-1">
                {menuItems.map((item) => (
                  <div key={item.id}>
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        if (item.submenu) {
                          e.preventDefault();
                          toggleSubmenu(item.id);
                        } else {
                          setMobileMenuOpen(false);
                        }
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.submenu && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            expandedMenus.includes(item.id) ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </Link>

                    {item.submenu && expandedMenus.includes(item.id) && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                              pathname === subitem.href
                                ? 'text-indigo-600 bg-indigo-50'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

