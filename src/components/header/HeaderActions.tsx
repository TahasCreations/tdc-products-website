'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Search, Heart, ShoppingCart, User, LogOut, Package, MapPin, Edit3, Sun, Moon, Languages } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useTheme } from 'next-themes';
import Link from 'next/link';

interface HeaderActionsProps {
  isMobile?: boolean;
  onSearchClick?: () => void;
  onMenuClick?: () => void;
}

export default function HeaderActions({ 
  isMobile = false, 
  onSearchClick,
  onMenuClick 
}: HeaderActionsProps) {
  const { data: session, status } = useSession();
  const { count: cartCount, toggleCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { theme, setTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const handleSearchClick = () => {
    onSearchClick?.();
  };

  const handleWishlistClick = () => {
    // Redirect to profile favorites tab
    window.location.href = '/profile?tab=favorites';
  };

  const handleCartClick = () => {
    toggleCart();
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLanguageToggle = () => {
    setIsLanguageOpen(!isLanguageOpen);
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (isMobile) {
    return (
      <div className="flex items-center justify-end space-x-3">
        {/* Wishlist */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleWishlistClick}
          className="relative p-2 text-gray-600 hover:text-[#CBA135] transition-colors"
          aria-label="Favoriler"
        >
          <Heart className="w-6 h-6" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#CBA135] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
              {wishlistCount}
            </span>
          )}
        </motion.button>

        {/* Cart */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCartClick}
          className="relative p-2 text-gray-600 hover:text-[#CBA135] transition-colors"
          aria-label="Sepet"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#CBA135] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
              {cartCount}
            </span>
          )}
        </motion.button>

        {/* User Menu */}
        {session ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleUserMenuToggle}
            className="relative p-2 text-gray-600 hover:text-[#CBA135] transition-colors"
            aria-label="Kullanıcı Menüsü"
          >
            <User className="w-6 h-6" />
          </motion.button>
        ) : (
          <Link
            href="/giris"
            className="px-4 py-2 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
          >
            Giriş Yap
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-0.5">
      {/* Cart with Wishlist */}
      <div className="flex items-center space-x-0.5">
        {/* Wishlist */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWishlistClick}
          className="relative p-1.5 text-gray-600 hover:text-[#CBA135] transition-colors rounded-lg hover:bg-gray-50"
          aria-label="Favoriler"
        >
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-[#CBA135] text-white rounded-full h-4 w-4 flex items-center justify-center text-xs font-bold"
            >
              {wishlistCount}
            </motion.span>
          )}
        </motion.button>

        {/* Cart */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCartClick}
          className="relative p-1.5 text-gray-600 hover:text-[#CBA135] transition-colors rounded-lg hover:bg-gray-50"
          aria-label="Sepet"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-[#CBA135] text-white rounded-full h-4 w-4 flex items-center justify-center text-xs font-bold"
            >
              {cartCount}
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleThemeToggle}
        className="p-1.5 text-gray-600 hover:text-[#CBA135] transition-colors rounded-lg hover:bg-gray-50"
        aria-label="Tema Değiştir"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </motion.button>

      {/* Language Toggle */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLanguageToggle}
          className="p-1.5 text-gray-600 hover:text-[#CBA135] transition-colors rounded-lg hover:bg-gray-50 flex items-center space-x-1"
          aria-label="Dil Seçimi"
        >
          <Languages className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">TR</span>
        </motion.button>

        <AnimatePresence>
          {isLanguageOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
            >
              <div className="py-2">
                <button className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#CBA135] transition-colors">
                  🇹🇷 Türkçe
                </button>
                <button className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#CBA135] transition-colors">
                  🇺🇸 English
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Menu */}
      {session ? (
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUserMenuToggle}
            className="flex items-center space-x-1.5 p-1.5 text-gray-600 hover:text-[#CBA135] transition-colors rounded-lg hover:bg-gray-50"
            aria-label="Kullanıcı Menüsü"
          >
            <img
              src={session.user?.image || 'https://via.placeholder.com/32x32/4F46E5/FFFFFF?text=U'}
              alt={session.user?.name || 'User'}
              className="w-7 h-7 rounded-full"
            />
            <span className="hidden lg:block text-sm font-medium truncate max-w-20">{session.user?.name}</span>
          </motion.button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
                role="menu"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <img
                      src={session.user?.image || 'https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=U'}
                      alt={session.user?.name || 'User'}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{session.user?.name}</p>
                      <p className="text-xs text-gray-500">{session.user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#CBA135] transition-colors"
                    role="menuitem"
                  >
                    <User className="w-4 h-4" />
                    <span>Profilim</span>
                  </Link>
                  <Link
                    href="/profile?tab=orders"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#CBA135] transition-colors"
                    role="menuitem"
                  >
                    <Package className="w-4 h-4" />
                    <span>Siparişlerim</span>
                  </Link>
                  <Link
                    href="/profile?tab=addresses"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#CBA135] transition-colors"
                    role="menuitem"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Adreslerim</span>
                  </Link>
                  <Link
                    href="/profile?tab=author"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#CBA135] transition-colors"
                    role="menuitem"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Yazar Profilim</span>
                  </Link>
                </div>

                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={() => {
                      // TODO: Implement logout
                      console.log('Logout clicked');
                    }}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <Link
          href="/giris"
          className="px-2.5 py-1.5 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 whitespace-nowrap"
        >
          Giriş Yap
        </Link>
      )}

      {/* Mobile Menu Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onMenuClick}
        className="lg:hidden p-1.5 text-gray-600 hover:text-[#CBA135] transition-colors rounded-lg hover:bg-gray-50"
        aria-label="Menü"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </motion.button>
    </div>
  );
}
