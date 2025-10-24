'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: '📊',
    subItems: []
  },
  {
    title: 'KPI & Analytics',
    href: '/admin/kpi',
    icon: '📈',
    subItems: []
  },
  {
    title: 'Ürün Yönetimi',
    href: '/admin/products',
    icon: '📦',
    subItems: [
      { title: 'Tüm Ürünler', href: '/admin/products' },
      { title: 'Kategori Yönetimi', href: '/admin/products/categories' },
      { title: 'Stok Yönetimi', href: '/admin/products/inventory' },
      { title: 'Toplu İşlemler', href: '/admin/products/bulk' }
    ]
  },
  {
    title: 'Sipariş Yönetimi',
    href: '/admin/orders',
    icon: '🛒',
    subItems: [
      { title: 'Tüm Siparişler', href: '/admin/orders' },
      { title: 'Bekleyen Siparişler', href: '/admin/orders/pending' },
      { title: 'Kargo Takibi', href: '/admin/orders/shipping' }
    ]
  },
  {
    title: 'Blog Moderasyon',
    href: '/admin/blog-moderation',
    icon: '📝',
    subItems: [
      { title: 'Bekleyen İncelemeler', href: '/admin/blog-moderation' },
      { title: 'Onaylanan Yazılar', href: '/admin/blog-moderation/approved' },
      { title: 'Reddedilen Yazılar', href: '/admin/blog-moderation/rejected' }
    ]
  },
  {
    title: 'Settlement',
    href: '/admin/settlement',
    icon: '💰',
    subItems: [
      { title: 'Settlement Geçmişi', href: '/admin/settlement' },
      { title: 'Komisyon Kuralları', href: '/admin/settlement/rules' },
      { title: 'Payout Raporları', href: '/admin/settlement/payouts' }
    ]
  },
  {
    title: 'İade Yönetimi',
    href: '/admin/returns',
    icon: '↩️',
    subItems: [
      { title: 'İade Kanban', href: '/admin/returns' },
      { title: 'İade Kuralları', href: '/admin/returns/rules' },
      { title: 'İade Raporları', href: '/admin/returns/reports' }
    ]
  },
  {
    title: 'Visual Site Builder',
    href: '/admin/site-builder/pages',
    icon: '✨',
    subItems: [
      { title: '🎨 Site Builder', href: '/admin/site-builder/pages' },
      { title: 'Sayfalar', href: '/admin/site-builder/pages' },
      { title: 'Medya Kütüphanesi', href: '/admin/media' },
      { title: 'Şablonlar', href: '/admin/site-builder/templates' }
    ]
  },
  {
    title: 'Medya Yönetimi',
    href: '/admin/media',
    icon: '🖼️',
    subItems: [
      { title: 'Tüm Görseller', href: '/admin/media' },
      { title: 'Görsel Yükle', href: '/admin/media/upload' },
      { title: 'Görsel Optimizasyonu', href: '/admin/media/optimize' }
    ]
  },
  {
    title: 'Muhasebe',
    href: '/admin/accounting',
    icon: '🧮',
    subItems: [
      { title: 'Genel Bakış', href: '/admin/accounting' },
      { title: 'Fatura Yönetimi', href: '/admin/accounting/invoices' },
      { title: 'Banka Entegrasyonu', href: '/admin/accounting/bank' },
      { title: 'Vergi Raporları', href: '/admin/accounting/tax' }
    ]
  },
  {
    title: 'Pazarlama',
    href: '/admin/marketing',
    icon: '📢',
    subItems: [
      { title: 'Kampanya Yönetimi', href: '/admin/marketing' },
      { title: 'Reklam Yönetimi', href: '/admin/marketing/ads' },
      { title: 'E-posta Pazarlama', href: '/admin/marketing/email' },
      { title: 'SEO Yönetimi', href: '/admin/marketing/seo' }
    ]
  },
  {
    title: 'Influencer Yönetimi',
    href: '/admin/influencers',
    icon: '💫',
    subItems: [
      { title: 'Tüm Başvurular', href: '/admin/influencers/applications' },
      { title: 'Onaylanan Influencer\'lar', href: '/admin/influencers/approved' },
      { title: 'İşbirlikleri', href: '/admin/influencers/collaborations' }
    ]
  },
  {
    title: 'AI Lab',
    href: '/admin/ai',
    icon: '🤖',
    subItems: [
      { title: 'AI Dashboard', href: '/admin/ai' },
      { title: 'KDV Asistanı', href: '/admin/ai/vat-assistant' },
      { title: 'Kar Önerileri', href: '/admin/ai/profit-suggestions' },
      { title: 'OCR İşlemleri', href: '/admin/ai/ocr' }
    ]
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Scroll position'ı koru
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll position'ı restore et
  useEffect(() => {
    if (scrollPosition > 0) {
      window.scrollTo(0, scrollPosition);
    }
  }, [pathname]);

  const toggleExpanded = (itemTitle: string) => {
    setExpandedItems(prev => 
      prev.includes(itemTitle) 
        ? prev.filter(item => item !== itemTitle)
        : [...prev, itemTitle]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const isSubItemActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white shadow-lg z-40 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const hasSubItems = item.subItems.length > 0;
            const isExpanded = expandedItems.includes(item.title);
            const isItemActive = isActive(item.href);
            
            return (
              <div key={item.href}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors flex-1 ${
                      isItemActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                  
                  {hasSubItems && (
                    <button
                      onClick={() => toggleExpanded(item.title)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <motion.svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </button>
                  )}
                </div>
                
                <AnimatePresence>
                  {hasSubItems && isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-8 mt-1 space-y-1"
                    >
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                            isSubItemActive(subItem.href)
                              ? 'bg-indigo-50 text-indigo-600 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
