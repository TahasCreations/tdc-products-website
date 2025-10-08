'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

export default function BottomNavigation() {
  const pathname = usePathname();
  const { getItemCount } = useCart();
  const { getItemCount: getWishlistCount } = useWishlist();

  const cartCount = getItemCount();
  const wishlistCount = getWishlistCount();

  const navItems = [
    { 
      href: '/', 
      icon: Home, 
      label: 'Ana Sayfa',
      badge: null
    },
    { 
      href: '/search', 
      icon: Search, 
      label: 'Ara',
      badge: null
    },
    { 
      href: '/cart', 
      icon: ShoppingCart, 
      label: 'Sepet',
      badge: cartCount > 0 ? cartCount : null
    },
    { 
      href: '/wishlist', 
      icon: Heart, 
      label: 'Favoriler',
      badge: wishlistCount > 0 ? wishlistCount : null
    },
    { 
      href: '/profile', 
      icon: User, 
      label: 'Profil',
      badge: null
    }
  ];

  // Don't show on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
    >
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700" />
      
      {/* Content */}
      <div className="relative max-w-lg mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center w-16 h-14 group"
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Icon container */}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <Icon 
                    className={`w-6 h-6 transition-colors duration-200 ${
                      isActive 
                        ? 'text-[#CBA135]' 
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'
                    }`}
                  />
                  
                  {/* Badge */}
                  <AnimatePresence>
                    {item.badge && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Label */}
                <span 
                  className={`text-xs mt-1 transition-colors duration-200 ${
                    isActive 
                      ? 'text-[#CBA135] font-semibold' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {item.label}
                </span>

                {/* Ripple effect on tap */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  whileTap={{
                    backgroundColor: 'rgba(203, 161, 53, 0.1)',
                    scale: 1.5
                  }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Safe area padding for iOS */}
      <div className="h-safe-area-inset-bottom bg-white/80 dark:bg-gray-900/80" />
    </motion.nav>
  );
}
