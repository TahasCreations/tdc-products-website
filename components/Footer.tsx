'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-orange-50 to-white border-t border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-['Pacifico'] text-orange-600 group-hover:text-orange-700 transition-colors duration-300">TDC Products</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Yüksek kaliteli 3D baskı ürünleri ile hayallerinizi gerçeğe dönüştürüyoruz.
            </p>
            <div className="flex space-x-4">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 hover:bg-orange-200 transition-all duration-300 hover:scale-110">
                <i className="ri-facebook-fill text-orange-600"></i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 hover:bg-orange-200 transition-all duration-300 hover:scale-110">
                <i className="ri-twitter-fill text-orange-600"></i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 hover:bg-orange-200 transition-all duration-300 hover:scale-110">
                <i className="ri-instagram-fill text-orange-600"></i>
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Ürünler</h3>
            <div className="space-y-2">
              <Link href="/products?category=anime" className="block text-gray-600 hover:text-orange-600 transition-colors text-sm hover:translate-x-1 transform duration-300">
                Anime Figürleri
              </Link>
              <Link href="/products?category=oyun" className="block text-gray-600 hover:text-orange-600 transition-colors text-sm hover:translate-x-1 transform duration-300">
                Oyun Karakterleri
              </Link>
              <Link href="/products?category=film" className="block text-gray-600 hover:text-orange-600 transition-colors text-sm hover:translate-x-1 transform duration-300">
                Film Karakterleri
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Kurumsal</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-600 hover:text-orange-600 transition-colors text-sm hover:translate-x-1 transform duration-300">
                Hakkımızda
              </Link>
              <Link href="/blog" className="block text-gray-600 hover:text-orange-600 transition-colors text-sm hover:translate-x-1 transform duration-300">
                Blog
              </Link>
              <Link href="/contact" className="block text-gray-600 hover:text-orange-600 transition-colors text-sm hover:translate-x-1 transform duration-300">
                İletişim
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">İletişim</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center space-x-2 hover:text-orange-600 transition-colors duration-300">
                <i className="ri-phone-line w-4 h-4 flex items-center justify-center"></i>
                <span>05558988242</span>
              </p>
              <p className="flex items-center space-x-2 hover:text-orange-600 transition-colors duration-300">
                <i className="ri-mail-line w-4 h-4 flex items-center justify-center"></i>
                <span>bentahasarii@gmail.com</span>
              </p>
              <p className="flex items-start space-x-2 hover:text-orange-600 transition-colors duration-300">
                <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center mt-0.5"></i>
                <span>Erzene, 66. Sk. No:5 D:1A, 35040 Bornova/İzmir</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-orange-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 TDC Products. Tüm hakları saklıdır.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-gray-500 hover:text-orange-600 text-sm transition-colors hover:scale-105 transform duration-300">
              Gizlilik Politikası
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-orange-600 text-sm transition-colors hover:scale-105 transform duration-300">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}