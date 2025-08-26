"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">TDC Products</h3>
          <p className="text-sm">Yüksek kaliteli 3D baskı ürünleri ile hayallerinizi gerçeğe dönüştürüyoruz.</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Ürünler</h4>
          <ul className="space-y-2 text-sm">
            <li>Anime Figürleri</li>
            <li>Oyun Karakterleri</li>
            <li>Film Karakterleri</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Kurumsal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:underline">Hakkımızda</Link></li>
            <li><Link href="/blog" className="hover:underline">Blog</Link></li>
            <li><Link href="/contact" className="hover:underline">İletişim</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">İletişim</h4>
          <ul className="space-y-2 text-sm">
            <li>05558988242</li>
            <li>bentahasarii@gmail.com</li>
            <li>Erzene, 66. Sk. No:5 D:1A, 35040 Bornova/İzmir</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-xs text-gray-400">
          <span>© {new Date().getFullYear()} TDC Products. Tüm hakları saklıdır.</span>
          <div className="space-x-4">
            <Link href="#" className="hover:underline">Gizlilik Politikası</Link>
            <Link href="#" className="hover:underline">Kullanım Şartları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
