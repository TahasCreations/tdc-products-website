'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../src/contexts/CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { state, removeItem, updateQuantity } = useCart();
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
    }
  };

  return (
    <header className="bg-white border-b border-orange-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl md:text-3xl font-bubblegum text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:scale-105 transition-all duration-300 group-hover:animate-pulse">
              TDC Products
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-orange-600 transition-all duration-300 font-medium hover:scale-105 transform">
              Ürünler
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-600 transition-all duration-300 font-medium hover:scale-105 transform">
              Hakkımızda
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-orange-600 transition-all duration-300 font-medium hover:scale-105 transform">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-600 transition-all duration-300 font-medium hover:scale-105 transform">
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
              <i className="ri-search-line text-xl text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"></i>
            </button>

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
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
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

            <button className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <i className="ri-heart-line text-xl text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"></i>
            </button>
            
            {/* Sepet Butonu */}
            <div className="relative">
              <button 
                className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-300 relative"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <i className="ri-shopping-cart-line text-xl text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"></i>
                {state.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {state.itemCount > 99 ? '99+' : state.itemCount}
                  </span>
                )}
              </button>

              {/* Sepet Dropdown */}
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

                    {state.items.length === 0 ? (
                      <div className="text-center py-8">
                        <i className="ri-shopping-cart-line text-4xl text-gray-300 mb-2"></i>
                        <p className="text-gray-500">Sepetiniz boş</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 mb-4">
                          {state.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-12 h-12 object-cover rounded-md"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-800 truncate">{item.title}</h4>
                                <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                                >
                                  <i className="ri-subtract-line text-xs"></i>
                                </button>
                                <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                                >
                                  <i className="ri-add-line text-xs"></i>
                                </button>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-500 hover:text-red-700 ml-2"
                                >
                                  <i className="ri-delete-bin-line text-sm"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-gray-800">Toplam:</span>
                            <span className="font-bold text-lg text-orange-600">{formatPrice(state.total)}</span>
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

            <button className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <i className="ri-user-line text-xl text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"></i>
            </button>

            <button 
              className="md:hidden w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl text-gray-700`}></i>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-orange-100 animate-slide-down">
            <Link href="/products" className="block text-gray-700 hover:text-orange-600 transition-colors duration-200 font-medium hover:translate-x-2 transform">
              Ürünler
            </Link>
            <Link href="/about" className="block text-gray-700 hover:text-orange-600 transition-colors duration-200 font-medium hover:translate-x-2 transform">
              Hakkımızda
            </Link>
            <Link href="/blog" className="block text-gray-700 hover:text-orange-600 transition-colors duration-200 font-medium hover:translate-x-2 transform">
              Blog
            </Link>
            <Link href="/contact" className="block text-gray-700 hover:text-orange-600 transition-colors duration-200 font-medium hover:translate-x-2 transform">
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