'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import Link from 'next/link';
import HeaderLogo from './header/HeaderLogo';
import HeaderNav from './header/HeaderNav';
import HeaderActions from './header/HeaderActions';
import HeaderMobileMenu from './header/HeaderMobileMenu';
import SearchModal from './header/SearchModal';
import AccountMenu from '../../components/layout/AccountMenu';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getItemCount } = useCart();
  const { getItemCount: getWishlistCount } = useWishlist();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isSearchOpen]);

  // Close search when mobile menu opens
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsSearchOpen(false);
    }
  }, [isMobileMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-lg border-b border-gray-100 ${
          isScrolled ? 'shadow-lg' : 'shadow-sm'
        }`}
      >
        {/* Main Header */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <HeaderLogo />
            </div>

            {/* Desktop Navigation - Moved closer to logo */}
            <div className="hidden lg:block flex-1 ml-6">
              <HeaderNav />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-orange-400 hover:text-orange-300 focus:ring-2 focus:ring-orange-500 focus:outline-none rounded-lg transition-colors"
                aria-label="Ara"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <Link
                href="/wishlist"
                className="relative p-2 text-orange-400 hover:text-orange-300 focus:ring-2 focus:ring-orange-500 focus:outline-none rounded-lg transition-colors"
                aria-label="Favoriler"
              >
                ♡
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#CBA135] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>
              
                  <Link
                    href="/cart"
                    className="relative p-2 text-orange-400 hover:text-orange-300 focus:ring-2 focus:ring-orange-500 focus:outline-none rounded-lg transition-colors"
                    aria-label="Sepet"
                  >
                    🛒
                    {getItemCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#CBA135] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {getItemCount()}
                      </span>
                    )}
                  </Link>
              
              <AccountMenu />
            </div>
          </div>
        </div>

        {/* Desktop Category Navigation */}
        <div className="hidden lg:block border-t border-gray-100 bg-white/90 backdrop-blur-sm">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-8 py-3">
              {/* Category links will be rendered by HeaderNav */}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search Bar - Below Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="fixed top-16 lg:top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 hover:border-[#CBA135] transition-all duration-200 group"
            >
              <Search className="w-5 h-5 text-gray-400 group-hover:text-[#CBA135] transition-colors" />
              <span className="text-gray-500 group-hover:text-gray-700 transition-colors">
                Ürün, kategori veya marka ara...
              </span>
              <div className="ml-auto flex items-center space-x-2">
                <kbd className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-200 rounded">⌘K</kbd>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <HeaderMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Header Spacer */}
      <div className="h-32 lg:h-36" />
    </>
  );
}