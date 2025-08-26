"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/products", label: "Ürünler" },
  { href: "/about", label: "Hakkımızda" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "İletişim" },
  { href: "/tdc-bist", label: "TDC BİST" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="w-full bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold text-gray-900">
          TDC Products
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname === item.href ? "text-orange-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/products" className="hidden md:inline-flex bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          Ürünleri Keşfet
        </Link>
      </div>
    </header>
  );
}
