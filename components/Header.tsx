'use client';

import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsCartOpen(false);
    setIsSearchOpen(false);
  }, [router]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsCartOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  }, [searchTerm, router]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
    if (isCartOpen) setIsCartOpen(false);
    if (isSearchOpen) setIsSearchOpen(false);
  }, [isCartOpen, isSearchOpen]);

  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isSearchOpen) setIsSearchOpen(false);
  }, [isMenuOpen, isSearchOpen]);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isCartOpen) setIsCartOpen(false);
  }, [isMenuOpen, isCartOpen]);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg' 
          : 'bg-white border-b border-gray-200 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1"
            aria-label="TDC Market Ana Sayfa"
          >
            <div className="flex items-center space-x-1">
              <span className="text-xl lg:text-2xl font-bold text-blue-600 group-hover:scale-105 transition-transform duration-300">
                TDC
              </span>
              <span className="text-xl lg:text-2xl font-bold text-purple-600 group-hover:scale-105 transition-transform duration-300">
                Market
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Ana menü">
            <Link 
              href="/products" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Ürünler
            </Link>
            <Link 
              href="/campaigns" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Kampanyalar
            </Link>
            <Link 
              href="/about" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Hakkımızda
            </Link>
            <Link 
              href="/blog" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Blog
            </Link>
            <Link 
              href="/contact" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              İletişim
            </Link>
            <Link 
              href="/become-seller" 
              className="px-4 py-2 text-sm font-medium text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Satıcı Ol
            </Link>
            <Link 
              href="/tdc-bist" 
              className="ml-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              TDC BİST
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Search Button */}
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={toggleSearch}
              aria-label="Arama"
              aria-expanded={isSearchOpen}
            >
              <i className="ri-search-line text-xl text-gray-700 hover:text-blue-600 transition-colors"></i>
            </button>

            {/* Wishlist */}
            <Link 
              href="/wishlist" 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 relative"
              aria-label="Favorilerim"
            >
              <i className="ri-heart-line text-xl text-gray-700 hover:text-red-600 transition-colors"></i>
              {/* Wishlist count badge can be added here */}
            </Link>
            
            {/* Cart */}
            <div className="relative">
              <button 
                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 relative group"
                onClick={toggleCart}
                aria-label="Sepetim"
                aria-expanded={isCartOpen}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <i className="ri-shopping-cart-line text-white text-lg"></i>
                </div>
                {/* Cart count badge can be added here */}
              </button>

              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 top-14 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden animate-scale-in">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Sepetim</h3>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        aria-label="Sepeti kapat"
                      >
                        <i className="ri-close-line text-xl text-gray-400 hover:text-gray-600"></i>
                      </button>
                    </div>

                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="ri-shopping-bag-3-line text-2xl text-gray-400"></i>
                      </div>
                      <p className="text-gray-600 font-medium text-lg">Sepetiniz boş</p>
                      <p className="text-gray-400 text-sm mt-2">Ürün ekleyerek alışverişe başlayın</p>
                      <Link 
                        href="/products"
                        className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={() => setIsCartOpen(false)}
                      >
                        Alışverişe Başla
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Login Button */}
            <Link
              href="/auth"
              className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <i className="ri-login-box-line text-sm"></i>
              <span>Giriş Yap</span>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={toggleMenu}
              aria-label="Menüyü aç/kapat"
              aria-expanded={isMenuOpen}
            >
              <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl text-gray-700`}></i>
            </button>
          </div>
        </div>

        {/* Search Dropdown */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-50 animate-slide-down">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ürün, kategori veya marka ara..."
                    className="w-full pl-12 pr-16 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 text-lg shadow-sm"
                    autoFocus
                    aria-label="Arama terimi"
                  />
                  <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-3 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    aria-label="Ara"
                  >
                    <i className="ri-arrow-right-line text-lg"></i>
                  </button>
                </div>
                {/* Search suggestions can be added here */}
                <div className="mt-2 text-sm text-gray-500">
                  <span>Popüler aramalar: </span>
                  <button 
                    type="button"
                    className="text-blue-600 hover:text-blue-800 mr-3"
                    onClick={() => setSearchTerm('3D figür')}
                  >
                    3D figür
                  </button>
                  <button 
                    type="button"
                    className="text-blue-600 hover:text-blue-800 mr-3"
                    onClick={() => setSearchTerm('oyuncak')}
                  >
                    oyuncak
                  </button>
                  <button 
                    type="button"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => setSearchTerm('dekorasyon')}
                  >
                    dekorasyon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu Backdrop */}
        {isMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 mobile-menu-backdrop"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-slide-down relative z-50">
            <div className="px-4 py-6 space-y-2">
              <nav role="navigation" aria-label="Mobil menü">
                <Link 
                  href="/products" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="ri-shopping-bag-line text-xl mr-3"></i>
                  Ürünler
                </Link>
                <Link 
                  href="/campaigns" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="ri-megaphone-line text-xl mr-3"></i>
                  Kampanyalar
                </Link>
                <Link 
                  href="/about" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="ri-information-line text-xl mr-3"></i>
                  Hakkımızda
                </Link>
                <Link 
                  href="/blog" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="ri-article-line text-xl mr-3"></i>
                  Blog
                </Link>
                <Link 
                  href="/contact" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="ri-phone-line text-xl mr-3"></i>
                  İletişim
                </Link>
                <Link 
                  href="/become-seller" 
                  className="flex items-center px-4 py-3 text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="ri-store-line text-xl mr-3"></i>
                  Satıcı Ol
                </Link>
                <Link 
                  href="/tdc-bist" 
                  className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="ri-line-chart-line text-xl mr-2"></i>
                  TDC BİST
                </Link>
              </nav>
              
              {/* Mobile Login Button */}
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/auth"
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="ri-login-box-line text-lg"></i>
                  <span>Giriş Yap / Kayıt Ol</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}