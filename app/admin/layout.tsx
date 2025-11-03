"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  Package,
  Store,
  CreditCard,
  Truck,
  DollarSign,
  RotateCcw,
  Shield,
  Globe,
  Target,
  Ticket,
  Tv,
  Mail,
  TestTube,
  Users2,
  BarChart3,
  Brain,
  Sparkles,
  Eye,
  TrendingUpIcon,
  Zap,
  Lock,
  Database,
  FileText,
  BookOpen,
  Webhook,
  Puzzle,
  Workflow,
  Edit3,
  CheckCircle,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

const navigationGroups = [
  {
    id: 'overview',
    title: 'Genel Bakış',
    icon: LayoutDashboard,
    color: 'blue',
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, badge: null },
      { name: 'Analitik', href: '/admin/analytics', icon: BarChart3, badge: null },
      { name: 'Raporlar', href: '/admin/reports', icon: FileText, badge: null },
    ]
  },
  {
    id: 'commerce',
    title: 'Ticaret',
    icon: ShoppingBag,
    color: 'purple',
    items: [
      { name: 'Siparişler', href: '/admin/commerce/orders', icon: Package, badge: null },
      { name: 'Ürünler', href: '/admin/products/inventory', icon: ShoppingBag, badge: null },
      { name: 'Kategoriler', href: '/admin/products/categories', icon: LayoutDashboard, badge: null },
      { name: 'Toplu İşlemler', href: '/admin/products/bulk', icon: Database, badge: null },
      { name: 'Envanter', href: '/admin/commerce/inventory', icon: Package, badge: null },
      { name: 'Kargo', href: '/admin/commerce/shipping', icon: Truck, badge: null },
      { name: 'Satıcılar', href: '/admin/commerce/sellers', icon: Store, badge: null },
      { name: 'Satıcı Ödemeleri', href: '/admin/commerce/seller-payments', icon: DollarSign, badge: null },
      { name: 'Ödemeler', href: '/admin/commerce/settlements', icon: CreditCard, badge: null },
      { name: 'İadeler', href: '/admin/commerce/returns', icon: RotateCcw, badge: null },
      { name: 'Risk & Fraud', href: '/admin/commerce/risk', icon: Shield, badge: null },
      { name: 'Domain Yönetimi', href: '/admin/commerce/domains', icon: Globe, badge: null },
    ]
  },
  {
    id: 'accounting',
    title: 'Muhasebe & Finans',
    icon: CreditCard,
    color: 'green',
    items: [
      { name: 'Hesap Planı', href: '/admin/accounting/chart-of-accounts', icon: FileText, badge: null },
      { name: 'Yevmiye', href: '/admin/accounting/journals', icon: Edit3, badge: null },
      { name: 'Alacaklar', href: '/admin/accounting/ar', icon: DollarSign, badge: null },
      { name: 'Borçlar', href: '/admin/accounting/ap', icon: CreditCard, badge: null },
      { name: 'Banka & Nakit', href: '/admin/accounting/banking', icon: CreditCard, badge: null },
      { name: 'Vergiler', href: '/admin/accounting/taxes', icon: FileText, badge: null },
      { name: 'Duran Varlıklar', href: '/admin/accounting/assets', icon: Package, badge: null },
      { name: 'Sabit Kıymetler', href: '/admin/accounting/fixed-assets', icon: Package, badge: null },
      { name: 'AI KDV Asistanı', href: '/admin/ai/vat-assistant', icon: Brain, badge: 'AI' },
      { name: 'AI Muhasebe', href: '/admin/accounting/ai-assistant', icon: Sparkles, badge: 'NEW' },
    ]
  },
  {
    id: 'marketing',
    title: 'Pazarlama & CRM',
    icon: Target,
    color: 'orange',
    items: [
      { name: 'Promosyonlar', href: '/admin/marketing/promotions', icon: Target, badge: null },
      { name: 'Kuponlar', href: '/admin/marketing/coupons', icon: Ticket, badge: null },
      { name: 'Reklamlar', href: '/admin/marketing/ads', icon: Tv, badge: null },
      { name: 'CRM', href: '/admin/marketing/crm', icon: Users2, badge: null },
      { name: 'Kampanyalar', href: '/admin/marketing/campaigns', icon: Mail, badge: null },
      { name: 'A/B Testleri', href: '/admin/marketing/ab-tests', icon: TestTube, badge: null },
      { name: 'A/B Testing', href: '/admin/marketing/ab-testing', icon: TestTube, badge: null },
      { name: 'Segmentler', href: '/admin/marketing/segments', icon: Users2, badge: null },
      { name: 'Segmentasyon', href: '/admin/marketing/segmentation', icon: Users2, badge: null },
      { name: 'Müşteri İlişkileri', href: '/admin/marketing/customer-relations', icon: Users2, badge: null },
      { name: 'Pazarlama Metrikleri', href: '/admin/marketing/metrics', icon: BarChart3, badge: null },
      { name: 'Pazarlama Analitiği', href: '/admin/marketing/analytics', icon: BarChart3, badge: null },
    ]
  },
  {
    id: 'ai',
    title: 'AI Laboratuvarı',
    icon: Brain,
    color: 'pink',
    items: [
      { name: 'Keyword Explorer', href: '/admin/ai/keyword-explorer', icon: Search, badge: null },
      { name: 'AI Fiyat Önerisi', href: '/admin/ai/price-suggestion', icon: DollarSign, badge: null },
      { name: 'AI SEO Asistanı', href: '/admin/ai/seo-assistant', icon: Target, badge: null },
      { name: 'Görsel Kalite', href: '/admin/ai/visual-quality', icon: Eye, badge: null },
      { name: 'Trend Analizi', href: '/admin/ai/trend-analysis', icon: TrendingUpIcon, badge: null },
      { name: 'Tahminler', href: '/admin/ai/predictions', icon: Sparkles, badge: null },
      { name: 'Pazar Zekası', href: '/admin/ai/market-intelligence', icon: Brain, badge: null },
      { name: 'Otomasyon', href: '/admin/ai/automation', icon: Zap, badge: null },
    ]
  },
  {
    id: 'analytics',
    title: 'Analitik & Tahmin',
    icon: BarChart3,
    color: 'indigo',
    items: [
      { name: 'Pazar Analizi', href: '/admin/analytics/market-analysis', icon: TrendingUpIcon, badge: null },
      { name: 'Tahminleme', href: '/admin/analytics/forecasting', icon: Sparkles, badge: null },
    ]
  },
  {
    id: 'sitebuilder',
    title: 'Visual Site Builder',
    icon: Sparkles,
    color: 'purple',
    items: [
      { name: '✨ Site Builder', href: '/admin/site-builder/pages', icon: Sparkles, badge: 'NEW' },
      { name: 'Sayfalar', href: '/admin/site-builder/pages', icon: FileText, badge: null },
      { name: 'Medya Kütüphanesi', href: '/admin/media', icon: Eye, badge: null },
      { name: 'Şablonlar', href: '/admin/site-builder/templates', icon: LayoutDashboard, badge: null },
    ]
  },
  {
    id: 'content',
    title: 'İçerik Yönetimi',
    icon: Edit3,
    color: 'teal',
    items: [
      { name: 'Blog Moderasyonu', href: '/admin/blog-moderasyon', icon: Edit3, badge: null },
      { name: 'Blog Kontrolü', href: '/admin/content/blog-control', icon: Edit3, badge: null },
      { name: 'İçerik Onayı', href: '/admin/content-approval', icon: CheckCircle, badge: null },
      { name: 'İçerik Onay', href: '/admin/content/content-approval', icon: CheckCircle, badge: null },
      { name: 'Onay Süreçleri', href: '/admin/content/approval-workflows', icon: Workflow, badge: null },
      { name: 'Kullanıcı İçerikleri', href: '/admin/user-content', icon: UserCheck, badge: null },
      { name: 'UGC Yönetimi', href: '/admin/content/user-content', icon: Users2, badge: null },
      { name: 'UGC Blog', href: '/admin/content/ugc-blog-moderation', icon: Edit3, badge: null },
      { name: 'Kullanıcı İçerik', href: '/admin/content/user-generated-content', icon: Users2, badge: null },
      { name: 'İçerik Raporları', href: '/admin/content-reports', icon: AlertTriangle, badge: null },
      { name: 'Raporlar', href: '/admin/content/reports', icon: FileText, badge: null },
    ]
  },
  {
    id: 'partners',
    title: 'Ortaklar',
    icon: Users,
    color: 'cyan',
    items: [
      { name: 'Satıcı Başvuruları', href: '/admin/partners', icon: Store, badge: null },
      { name: 'Influencer Başvuruları', href: '/admin/influencers/applications', icon: Users2, badge: null },
    ]
  },
  {
    id: 'developer',
    title: 'Developer Tools',
    icon: Zap,
    color: 'violet',
    items: [
      { name: 'API Dokümantasyonu', href: '/admin/developer/api-docs', icon: BookOpen, badge: null },
      { name: 'Webhook Yönetimi', href: '/admin/developer/webhooks', icon: Webhook, badge: null },
      { name: 'Eklenti Sistemi', href: '/admin/developer/plugins', icon: Puzzle, badge: null },
      { name: 'İş Akışları', href: '/admin/developer/workflows', icon: Workflow, badge: null },
      { name: 'Otomasyon', href: '/admin/developer/automation', icon: Zap, badge: null },
    ]
  },
  {
    id: 'system',
    title: 'Sistem',
    icon: Settings,
    color: 'gray',
    items: [
      { name: 'Kullanıcılar', href: '/admin/users', icon: Users, badge: null },
      { name: 'Roller & Yetkiler', href: '/admin/roles', icon: Lock, badge: null },
      { name: 'Sistem Rolleri', href: '/admin/system/roles', icon: Lock, badge: null },
      { name: 'İzinler', href: '/admin/system/permissions', icon: Shield, badge: null },
      { name: 'Ayarlar', href: '/admin/settings', icon: Settings, badge: null },
      { name: 'Güvenlik', href: '/admin/security', icon: Shield, badge: null },
      { name: 'Sistem Güvenlik', href: '/admin/system/security', icon: Shield, badge: null },
      { name: 'Güvenlik İzleme', href: '/admin/system/security-monitoring', icon: Eye, badge: null },
      { name: 'Yedekleme', href: '/admin/backup', icon: Database, badge: null },
      { name: 'Sistem Yedekleme', href: '/admin/system/backup', icon: Database, badge: null },
      { name: 'DB Yedekleri', href: '/admin/system/database-backups', icon: Database, badge: null },
      { name: 'Loglar', href: '/admin/logs', icon: FileText, badge: null },
      { name: 'Sistem Logları', href: '/admin/system/system-logs', icon: FileText, badge: null },
      { name: 'Risk Analizi', href: '/admin/system/risk-analysis', icon: AlertTriangle, badge: null },
      { name: 'White Label Domains', href: '/admin/system/white-label-domains', icon: Globe, badge: null },
    ]
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
	const router = useRouter();

  // Hydration fix
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load expanded groups from localStorage (SADECE İLK MOUNT'TA)
  useEffect(() => {
    if (!isMounted) return;

    const savedExpanded = localStorage.getItem('adminLayoutExpandedGroups');
    if (savedExpanded) {
      try {
        setExpandedGroups(JSON.parse(savedExpanded));
      } catch (e) {
        // Hata olursa boş array - tüm sekmeler kapalı
        setExpandedGroups([]);
      }
    } else {
      // İlk kez giriliyorsa tüm sekmeler KAPALI
      setExpandedGroups([]);
    }
  }, [isMounted]); // pathname yok - sayfa değişiminde resetlenmez

  // Save expanded groups to localStorage
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('adminLayoutExpandedGroups', JSON.stringify(expandedGroups));
  }, [expandedGroups, isMounted]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check for main admin page (login page)
      if (pathname === '/admin') {
        setIsAuthenticated(true);
        return;
      }

      try {
        const response = await fetch('/api/admin/auth/verify');
        const data = await response.json();

        if (!data.authenticated) {
          router.push('/admin');
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/admin');
      }
    };

    checkAuth();
  }, [pathname, router]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const filteredGroups = navigationGroups.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  // Show loading while checking authentication (skip for main admin page)
  if (isAuthenticated === null && pathname !== '/admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-[#CBA135] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Yetkilendirme kontrol ediliyor...</p>
        </motion.div>
      </div>
    );
  }

  // For the login page (/admin), render children without the sidebar layout
  if (pathname === '/admin') {
    return <>{children}</>;
  }

	return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#CBA135] to-[#F4D03F]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-black">TDC Admin</h1>
              <p className="text-xs text-black/70">Yönetim Paneli</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-black hover:text-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Modül ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-[#CBA135] focus:border-[#CBA135] transition-all text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredGroups.map((group) => {
            const isExpanded = expandedGroups.includes(group.id);
            const GroupIcon = group.icon;
            
            return (
              <div key={group.id} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-2">
                    <GroupIcon className="w-5 h-5 text-[#CBA135]" />
                    <span>{group.title}</span>
                    <span className="text-xs text-gray-400">({group.items.length})</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 space-y-1 overflow-hidden"
                    >
                      {group.items.map((item) => {
                        const isActive = pathname === item.href;
                        const ItemIcon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all ${
                              isActive
                                ? 'bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black font-bold shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <ItemIcon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                              <span>{item.name}</span>
                            </div>
                            {item.badge && (
                              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                isActive 
                                  ? 'bg-black text-white' 
                                  : 'bg-[#CBA135]/20 text-[#CBA135]'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button 
            onClick={async () => {
              try {
                await fetch('/api/admin/auth/logout', { method: 'POST' });
                window.location.href = '/admin';
              } catch (error) {
                console.error('Logout error:', error);
                window.location.href = '/admin';
              }
            }}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Çıkış Yap
          </button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="lg:pl-80 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {navigationGroups
                    .flatMap(g => g.items)
                    .find(item => item.href === pathname)?.name || 'Admin Panel'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  TDC Products Yönetim Sistemi
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User */}
              <div className="flex items-center space-x-3 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">A</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Admin</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Süper Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
