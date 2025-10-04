'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import { CATEGORIES } from '@/data/nav';

interface HeaderNavProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

export default function HeaderNav({ isMobile = false, onItemClick }: HeaderNavProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const simpleNavItems = [
    { href: '/products', label: 'Tüm Ürünler', icon: '📦' },
    { href: '/blog', label: 'Blog', icon: '📝' },
    { href: '/about', label: 'Hakkımızda', icon: 'ℹ️' }
  ];

  const handleMouseEnter = (categoryKey: string) => {
    if (!isMobile) {
      setActiveDropdown(categoryKey);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setActiveDropdown(null);
    }
  };

  const handleClick = (categoryKey: string) => {
    if (isMobile) {
      setActiveDropdown(activeDropdown === categoryKey ? null : categoryKey);
    }
    onItemClick?.();
  };

  if (isMobile) {
    return (
      <div className="space-y-2">
        {/* Simple nav items for mobile */}
        {simpleNavItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-[#CBA135] hover:bg-gray-50 rounded-xl transition-all duration-200 group"
              onClick={onItemClick}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          </motion.div>
        ))}

        {/* Category items with mobile accordion */}
        {CATEGORIES.map((cat, index) => (
          <motion.div
            key={cat.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index + simpleNavItems.length) * 0.1 }}
            className="border-b border-gray-100 last:border-b-0"
          >
            <button
              onClick={() => handleClick(cat.key)}
              className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:text-[#CBA135] hover:bg-gray-50 rounded-xl transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">🎯</span>
                <span className="font-medium">{cat.label}</span>
              </div>
              <motion.div
                animate={{ rotate: activeDropdown === cat.key ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#CBA135]" />
              </motion.div>
            </button>

            <AnimatePresence>
              {activeDropdown === cat.key && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pl-8 pr-4 py-2 space-y-2">
                    {cat.children.map((subcat, subIndex) => (
                      <motion.div
                        key={subcat.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: subIndex * 0.05 }}
                      >
                        <Link
                          href={subcat.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-[#CBA135] hover:bg-gray-50 rounded-lg transition-all duration-200"
                          onClick={onItemClick}
                        >
                          {subcat.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <nav className="hidden lg:flex items-center space-x-8" role="navigation">
      {/* Simple nav items */}
      {simpleNavItems.map((item, index) => (
        <motion.div
          key={item.href}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          <Link
            href={item.href}
            className="relative text-sm font-medium text-gray-700 hover:text-[#CBA135] transition-colors duration-300 group py-2 flex items-center space-x-1"
          >
            <span>{item.label}</span>
            <motion.div
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#CBA135] to-[#F4D03F]"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </Link>
        </motion.div>
      ))}

      {/* Category items with dropdown */}
      {CATEGORIES.map((cat, index) => (
        <motion.div
          key={cat.key}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (index + simpleNavItems.length) * 0.1 + 0.3 }}
          className="relative"
          onMouseEnter={() => handleMouseEnter(cat.key)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={cat.href}
            className="relative text-sm font-medium text-gray-700 hover:text-[#CBA135] transition-colors duration-300 group py-2 flex items-center space-x-1"
          >
            <span>{cat.label}</span>
            <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-[#CBA135] transition-colors" />
            <motion.div
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#CBA135] to-[#F4D03F]"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </Link>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {activeDropdown === cat.key && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                role="menu"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{cat.label}</h3>
                    <p className="text-sm text-gray-500">En popüler ürünler ve koleksiyonlar</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {cat.children.map((subcat, subIndex) => (
                      <motion.div
                        key={subcat.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: subIndex * 0.05 }}
                      >
                        <Link
                          href={subcat.href}
                          className="block p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
                          role="menuitem"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-[#CBA135] rounded-full" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-[#CBA135]">
                              {subcat.label}
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      href={cat.href}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-white rounded-xl hover:shadow-lg transition-all duration-200 group"
                    >
                      <span className="font-medium">Tümünü Gör</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </nav>
  );
}
