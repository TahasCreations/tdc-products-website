'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'user' | 'seller'>('user');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClick = (type: 'user' | 'seller') => {
    setAuthType(type);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (type: 'user' | 'seller') => {
    console.log(`${type} authentication successful`);
    // Redirect based on user type
    if (type === 'seller') {
      window.location.href = '/seller/dashboard';
    } else {
      window.location.href = '/user/dashboard';
    }
  };

  const navItems = [
    { href: '/collections', label: 'Koleksiyonlar' },
    { href: '/figures', label: 'Figürler' },
    { href: '/artists', label: 'Sanatçılar' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'Hakkımızda' }
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0"
            >
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-coral-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-2xl font-bold text-ink-900 font-serif">TDC Products</span>
                  <p className="text-xs text-ink-600 -mt-1">Figür & Koleksiyon</p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className="relative text-ink-600 hover:text-indigo-600 transition-colors duration-300 font-medium group"
                  >
                    {item.label}
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-coral-500"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {/* User Login Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAuthClick('user')}
                className="relative group px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold transition-all duration-300 hover:bg-indigo-600"
              >
                <div className="absolute inset-0 rounded-lg border-2 border-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-400 to-indigo-600 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300" />
                <span className="relative z-10">Giriş</span>
              </motion.button>

              {/* Seller Login Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAuthClick('seller')}
                className="relative group px-6 py-3 border-2 border-ink-300 text-ink-700 rounded-lg font-semibold transition-all duration-300 hover:border-ink-400 hover:text-ink-900"
              >
                <div className="absolute inset-0 rounded-lg border-2 border-ink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-ink-100 to-ink-200 opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300" />
                <span className="relative z-10">Satıcı Girişi</span>
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-ink-600 hover:text-indigo-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden border-t border-gray-200 py-4"
              >
                <div className="space-y-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="block text-ink-600 hover:text-indigo-600 transition-colors font-medium py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authType}
        onTypeChange={setAuthType}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}