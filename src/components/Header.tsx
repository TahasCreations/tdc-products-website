'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import HeaderLogo from './header/HeaderLogo';
import HeaderNav from './header/HeaderNav';
import HeaderActions from './header/HeaderActions';
import HeaderMobileMenu from './header/HeaderMobileMenu';
import SearchModal from './header/SearchModal';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        {/* Main Header */}
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <HeaderLogo />

            {/* Desktop Navigation */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-4">
              <HeaderNav />
            </div>

            {/* Actions */}
            <HeaderActions
              onSearchClick={() => setIsSearchOpen(true)}
              onMenuClick={() => setIsMobileMenuOpen(true)}
            />
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
      <div className="h-24 lg:h-28" />
    </>
  );
}