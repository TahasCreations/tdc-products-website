'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: '📊',
  },
  {
    title: 'KPI & Analytics',
    href: '/admin/kpi',
    icon: '📈',
  },
  {
    title: 'Ürün Yönetimi',
    href: '/admin/products',
    icon: '📦',
  },
  {
    title: 'Sipariş Yönetimi',
    href: '/admin/orders',
    icon: '🛒',
  },
  {
    title: 'Blog Moderasyon',
    href: '/admin/blog-moderation',
    icon: '📝',
  },
  {
    title: 'Settlement',
    href: '/admin/settlement',
    icon: '💰',
  },
  {
    title: 'İade Yönetimi',
    href: '/admin/returns',
    icon: '↩️',
  },
  {
    title: 'Muhasebe',
    href: '/admin/accounting',
    icon: '🧮',
  },
  {
    title: 'Pazarlama',
    href: '/admin/marketing',
    icon: '📢',
  },
  {
    title: 'AI Lab',
    href: '/admin/ai',
    icon: '🤖',
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white shadow-lg z-40">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
