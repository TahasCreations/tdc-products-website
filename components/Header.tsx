'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../src/contexts/CartContext';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAuth } from '../src/contexts/AuthContext';
import { useWishlist } from '../src/contexts/WishlistContext';
import { useToast } from '../src/components/Toast';
import ThemeToggle from '../src/components/ThemeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { state, removeItem, updateQuantity } = useCart();
  const { isDark } = useTheme();
  const { user, signOut } = useAuth();
  const { wishlistCount } = useWishlist();
  const { addToast } = useToast();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
      setSearchTerm('');
      addToast({
        type: 'info',
        title: 'Arama yapılıyor',
        message: `"${searchTerm.trim()}" için sonuçlar gösteriliyor`
      });
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-orange-100 dark:border-gray-700 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl md:text-3xl font-bubblegum text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:scale-105 transition-all duration-300 group-hover:animate-pulse">
              TDC Products
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 font-medium hover:scale-105 transform">
              Ürünler
            </Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 font-medium hover:scale-105 transform">
              Hakkımızda
            </Link>
            <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 font-medium hover:scale-105 transform">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 font-medium hover:scale-105 transform">
              İletişim
            </Link>
            <Link href="/tdc-bist" className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-black font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 overflow-hidden group whitespace-nowrap">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center space-x-2">
                <span className="font-black text-black">TDC BİST</span>
                <i className="ri-line-chart-line text-black"></i>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button 
              className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-300"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <i className="ri-search-line text-xl text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"></i>
            </button>

            {/* Search Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Ürün ara..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      autoFocus
                    />
                    <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-lg"></i>
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

            <Link href="/wishlist" className="relative w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <i className="ri-heart-line text-xl text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"></i>
              {wishlistCount > 0 && (
                <div className="absolute -top-2 -right-2">
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full min-w-[18px] h-5 shadow-lg animate-pulse border-2 border-white dark:border-gray-800">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                </div>
              )}
            </Link>
            
            {/* Sepet Butonu */}
            <div className="relative">
              <button 
                className="w-10 h-10 flex items-center justify-center hover:scale-110 transition-all duration-300 relative group"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                {/* Cart Emoji */}
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">🛒</span>
                  </div>
                  
                  {/* Cart Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 scale-150"></div>
                </div>
                
                {/* Cart Badge */}
                {state.itemCount > 0 && (
                  <div className="absolute -top-2 -right-2">
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full min-w-[22px] h-6 shadow-lg animate-pulse border-2 border-white dark:border-gray-800">
                      {state.itemCount > 99 ? '99+' : state.itemCount}
                    </span>
                  </div>
                )}
              </button>

              {/* Sepet Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto transition-colors duration-300">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Sepetim</h3>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <i className="ri-close-line text-xl"></i>
                      </button>
                    </div>

                    {state.items.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="ri-shopping-bag-3-line text-2xl text-gray-400 dark:text-gray-500"></i>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Sepetiniz boş</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Ürün ekleyerek alışverişe başlayın</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 mb-4">
                          {state.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <Image 
                                src={item.image} 
                                alt={item.title}
                                width={48}
                                height={48}
                                className="w-12 h-12 object-cover rounded-md"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{formatPrice(item.price)}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                >
                                  <i className="ri-subtract-line text-xs"></i>
                                </button>
                                <span className="text-sm font-medium w-8 text-center text-gray-800 dark:text-gray-200">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                >
                                  <i className="ri-add-line text-xs"></i>
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`${item.title} ürününü sepetten kaldırmak istediğinize emin misiniz?`)) {
                                      removeItem(item.id);
                                      addToast({
                                        type: 'success',
                                        title: 'Ürün kaldırıldı',
                                        message: `${item.title} sepetten kaldırıldı`
                                      });
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2 transition-colors duration-300 hover:scale-110"
                                  title="Ürünü sepetten kaldır"
                                >
                                  <i className="ri-delete-bin-line text-sm"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">Toplam:</span>
                            <span className="font-bold text-lg text-orange-600 dark:text-orange-400">{formatPrice(state.total)}</span>
                          </div>
                          <Link 
                            href="/cart"
                            onClick={() => setIsCartOpen(false)}
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-center block"
                          >
                            Sepete Git
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Kullanıcı Menüsü */}
            <div className="relative">
              <button 
                className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-300"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <i className="ri-user-line text-xl text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"></i>
              </button>

              {/* Kullanıcı Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 transition-colors duration-300">
                  <div className="p-4">
                    {user ? (
                      <>
                        <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {user.user_metadata?.first_name || user.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Link
                            href="/profile"
                            className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-2"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="ri-user-settings-line"></i>
                            <span>Profilim</span>
                          </Link>
                          
                          <Link
                            href="/orders"
                            className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-2"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="ri-shopping-bag-line"></i>
                            <span>Siparişlerim</span>
                          </Link>
                          
                          <button
                            onClick={async () => {
                              await signOut();
                              setIsUserMenuOpen(false);
                              addToast({
                                type: 'success',
                                title: 'Çıkış yapıldı',
                                message: 'Başarıyla çıkış yaptınız'
                              });
                            }}
                            className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors py-2 w-full text-left"
                          >
                            <i className="ri-logout-box-line"></i>
                            <span>Çıkış Yap</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Link
                          href="/auth"
                          className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-2"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <i className="ri-login-box-line"></i>
                          <span>Giriş Yap</span>
                        </Link>
                        
                        <Link
                          href="/auth"
                          className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-2"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <i className="ri-user-add-line"></i>
                          <span>Kayıt Ol</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              className="md:hidden w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl text-gray-700 dark:text-gray-300`}></i>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-orange-100 dark:border-gray-700 animate-slide-down">
            <Link href="/products" className="block text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200 font-medium hover:translate-x-2 transform">
              Ürünler
            </Link>
            <Link href="/about" className="block text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200 font-medium hover:translate-x-2 transform">
              Hakkımızda
            </Link>
            <Link href="/blog" className="block text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200 font-medium hover:translate-x-2 transform">
              Blog
            </Link>
            <Link href="/contact" className="block text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200 font-medium hover:translate-x-2 transform">
              İletişim
            </Link>
            <Link href="/tdc-bist" className="block bg-gradient-to-r from-blue-500 to-blue-600 text-black font-bold px-4 py-2 rounded-full w-fit">
              TDC BİST
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}