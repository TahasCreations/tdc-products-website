"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, TrendingUp, Users, BarChart3,
  Settings, Bell, Search, Menu, X, ChevronDown, Store, Globe, CreditCard,
  Heart, MessageSquare, Gift, Target, DollarSign, FileText, Megaphone,
  Zap, Crown, LogOut, ChevronRight, Sparkles
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  href: string;
  badge?: string;
  roles: string[];
  submenu?: {
    label: string;
    href: string;
    icon?: any;
  }[];
}

const menuItems: MenuItem[] = [
  // SELLER MODULES
  {
    id: 'seller-dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/partner/seller/dashboard',
    roles: ['SELLER', 'ADMIN'],
  },
  {
    id: 'products',
    label: 'Ürünler',
    icon: Package,
    href: '/partner/seller/products',
    roles: ['SELLER', 'ADMIN'],
    submenu: [
      { label: 'Tüm Ürünler', href: '/partner/seller/products', icon: Package },
      { label: 'Yeni Ürün Ekle', href: '/partner/seller/products/new', icon: Sparkles },
      { label: 'Stok Yönetimi', href: '/partner/seller/products/inventory', icon: BarChart3 },
      { label: 'Kategoriler', href: '/partner/seller/products/categories', icon: Target },
    ],
  },
  {
    id: 'orders',
    label: 'Siparişler',
    icon: ShoppingCart,
    href: '/partner/seller/orders',
    badge: '12',
    roles: ['SELLER', 'ADMIN'],
  },
  {
    id: 'analytics',
    label: 'Analitik',
    icon: BarChart3,
    href: '/partner/seller/analytics',
    roles: ['SELLER', 'ADMIN'],
    submenu: [
      { label: 'Genel Bakış', href: '/partner/seller/analytics' },
      { label: 'Satış Raporları', href: '/partner/seller/analytics/sales' },
      { label: 'Ürün Performansı', href: '/partner/seller/analytics/products' },
      { label: 'Müşteri Analizi', href: '/partner/seller/analytics/customers' },
    ],
  },
  {
    id: 'marketing',
    label: 'Pazarlama',
    icon: Megaphone,
    href: '/partner/seller/marketing',
    roles: ['SELLER', 'ADMIN'],
    submenu: [
      { label: 'Kampanyalar', href: '/partner/seller/marketing/campaigns' },
      { label: 'Kuponlar', href: '/partner/seller/marketing/coupons' },
      { label: 'Reklamlar', href: '/partner/seller/marketing/ads' },
    ],
  },
  {
    id: 'store',
    label: 'Mağaza Tasarımı',
    icon: Store,
    href: '/partner/seller/store',
    roles: ['SELLER', 'ADMIN'],
    submenu: [
      { label: 'Site Builder', href: '/partner/seller/store/builder' },
      { label: 'Tema Ayarları', href: '/partner/seller/store/theme' },
      { label: 'Sayfalar', href: '/partner/seller/store/pages' },
    ],
  },
  {
    id: 'domain',
    label: 'Domain',
    icon: Globe,
    href: '/partner/seller/domain',
    roles: ['SELLER', 'ADMIN'],
  },
  {
    id: 'customers',
    label: 'Müşteriler',
    icon: Users,
    href: '/partner/seller/customers',
    roles: ['SELLER', 'ADMIN'],
  },
  {
    id: 'billing',
    label: 'Abonelik',
    icon: CreditCard,
    href: '/partner/seller/billing',
    roles: ['SELLER', 'ADMIN'],
  },

  // INFLUENCER MODULES
  {
    id: 'influencer-dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/partner/influencer/dashboard',
    roles: ['INFLUENCER', 'ADMIN'],
  },
  {
    id: 'campaigns',
    label: 'Kampanyalar',
    icon: Target,
    href: '/partner/influencer/campaigns',
    badge: '3',
    roles: ['INFLUENCER', 'ADMIN'],
  },
  {
    id: 'collaborations',
    label: 'İş Birlikleri',
    icon: Heart,
    href: '/partner/influencer/collaborations',
    roles: ['INFLUENCER', 'ADMIN'],
  },
  {
    id: 'earnings',
    label: 'Kazançlar',
    icon: DollarSign,
    href: '/partner/influencer/earnings',
    roles: ['INFLUENCER', 'ADMIN'],
  },
  {
    id: 'performance',
    label: 'Performans',
    icon: TrendingUp,
    href: '/partner/influencer/performance',
    roles: ['INFLUENCER', 'ADMIN'],
  },
  {
    id: 'content',
    label: 'İçerikler',
    icon: FileText,
    href: '/partner/influencer/content',
    roles: ['INFLUENCER', 'ADMIN'],
  },
];

interface PartnerDashboardLayoutProps {
  children: React.ReactNode;
  user: any;
  role: string;
}

export default function PartnerDashboardLayout({ children, user, role }: PartnerDashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Filter menu items based on role
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(role)
  );

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Left: Logo + Menu Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TDC</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-900">TDC Market</p>
                <p className="text-xs text-gray-500">
                  {role === 'SELLER' ? 'Satıcı Paneli' : role === 'INFLUENCER' ? 'Influencer Paneli' : 'Partner Paneli'}
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Search + Notifications + Profile */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 min-w-[300px]">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Ara..."
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile */}
            <div className="flex items-center space-x-3 pl-3 border-l">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:block sticky top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto"
            >
              <nav className="p-4 space-y-1">
                {filteredMenuItems.map((item) => (
                  <div key={item.id}>
                    {item.submenu ? (
                      /* Menu with submenu */
                      <div>
                        <button
                          onClick={() => toggleSubmenu(item.id)}
                          className={`
                            w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all
                            ${isActive(item.href) || expandedMenus.includes(item.id)
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                              : 'hover:bg-gray-100 text-gray-700'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              expandedMenus.includes(item.id) ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        <AnimatePresence>
                          {expandedMenus.includes(item.id) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="ml-4 mt-1 space-y-1 overflow-hidden"
                            >
                              {item.submenu.map((subitem) => (
                                <Link
                                  key={subitem.href}
                                  href={subitem.href}
                                  className={`
                                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm
                                    ${isActive(subitem.href)
                                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                                      : 'text-gray-600 hover:bg-gray-50'
                                    }
                                  `}
                                >
                                  {subitem.icon && <subitem.icon className="w-4 h-4" />}
                                  <span>{subitem.label}</span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      /* Simple menu item */
                      <Link
                        href={item.href}
                        className={`
                          flex items-center justify-between px-4 py-3 rounded-xl transition-all
                          ${isActive(item.href)
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                            : 'hover:bg-gray-100 text-gray-700'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Settings & Logout */}
                <div className="pt-4 mt-4 border-t space-y-1">
                  <Link
                    href="/partner/settings"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-all"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Ayarlar</span>
                  </Link>
                  
                  <button
                    onClick={() => window.location.href = '/api/auth/signout'}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Çıkış Yap</span>
                  </button>
                </div>
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="fixed top-16 left-0 w-72 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto z-50 lg:hidden"
              >
                <nav className="p-4 space-y-1">
                  {filteredMenuItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                        ${isActive(item.href)
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}


