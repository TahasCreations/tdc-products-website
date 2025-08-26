'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-orange-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-['Pacifico'] text-orange-600 hover:text-orange-700 transition-colors duration-300">TDC Products</span>
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
            <button className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <i className="ri-search-line text-xl text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"></i>
            </button>
            <button className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <i className="ri-heart-line text-xl text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"></i>
            </button>
            <button className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <i className="ri-shopping-cart-line text-xl text-gray-700 hover:text-orange-600 transition-colors cursor-pointer"></i>
            </button>
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