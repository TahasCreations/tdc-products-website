'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-xl font-bold text-blue-600 hover:scale-105 transition-all duration-300">
              TDC
            </span>
            <span className="text-xl font-bold text-purple-600 hover:scale-105 transition-all duration-300">
              Market
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Ürünler
            </Link>
            <Link href="/campaigns" className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Kampanyalar
            </Link>
            <Link href="/about" className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Hakkımızda
            </Link>
            <Link href="/blog" className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Blog
            </Link>
            <Link href="/contact" className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium">
              İletişim
            </Link>
            <Link href="/become-seller" className="text-sm text-gray-700 hover:text-green-600 transition-colors font-medium bg-green-50 px-3 py-1.5 rounded-lg">
              Satıcı Ol
            </Link>
            <Link href="/tdc-bist" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
              TDC BİST
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button 
              className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-300"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <i className="ri-search-line text-xl text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"></i>
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <i className="ri-heart-line text-xl text-gray-700 hover:text-red-600 transition-colors cursor-pointer"></i>
            </Link>
            
            {/* Cart */}
            <div className="relative">
              <button 
                className="w-10 h-10 flex items-center justify-center hover:scale-110 transition-all duration-300 relative group"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-lg">🛒</span>
                </div>
              </button>

              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Sepetim</h3>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <i className="ri-close-line text-xl"></i>
                      </button>
                    </div>

                      <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="ri-shopping-bag-3-line text-2xl text-gray-400"></i>
                      </div>
                      <p className="text-gray-500 font-medium">Sepetiniz boş</p>
                      <p className="text-gray-400 text-sm mt-1">Ürün ekleyerek alışverişe başlayın</p>
                        </div>
                  </div>
                </div>
              )}
            </div>

            {/* Login Button */}
              <Link
                href="/auth"
                className="hidden md:flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <i className="ri-login-box-line text-sm"></i>
                <span>Giriş Yap</span>
              </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl text-gray-700`}></i>
            </button>
          </div>
        </div>

        {/* Search Dropdown */}
        {isSearchOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ürün ara..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
                  autoFocus
                />
                <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
                >
                  <i className="ri-arrow-right-line text-sm"></i>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-gray-200">
            <Link href="/products" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Ürünler
            </Link>
            <Link href="/campaigns" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Kampanyalar
            </Link>
            <Link href="/about" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Hakkımızda
            </Link>
            <Link href="/blog" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Blog
            </Link>
            <Link href="/contact" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">
              İletişim
            </Link>
            <Link href="/become-seller" className="block text-gray-700 hover:text-green-600 transition-colors font-medium bg-green-50 px-4 py-2 rounded-lg w-fit">
              Satıcı Ol
            </Link>
            <Link href="/tdc-bist" className="block bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-4 py-2 rounded-full w-fit">
              TDC BİST
            </Link>
            
            {/* Mobile Login Button */}
              <Link
                href="/auth"
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg w-full"
              >
                <i className="ri-login-box-line"></i>
                <span>Giriş Yap / Kayıt Ol</span>
              </Link>
          </div>
        )}
      </div>
    </header>
  );
}