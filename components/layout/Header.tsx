"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Search, Heart, ShoppingCart, User, Menu } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const navLinks = [
    { name: "Figür & Koleksiyon", href: "/categories/figur-koleksiyon" },
    { name: "Moda & Aksesuar", href: "/categories/moda-aksesuar" },
    { name: "Elektronik", href: "/categories/elektronik" },
    { name: "Ev & Yaşam", href: "/categories/ev-yasam" },
    { name: "Sanat & Hobi", href: "/categories/sanat-hobi" },
    { name: "Hediyelik", href: "/categories/hediyelik" },
  ];

  return (
    <motion.header
      data-testid="global-header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0B0B0B]/95 backdrop-blur-md border-b border-white/10 shadow-lg"
          : "bg-[#0B0B0B]/90 backdrop-blur-sm border-b border-white/5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-semibold tracking-wide text-white hover:text-[#CBA135] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#0B0B0B] rounded-lg p-1"
          aria-label="TDC Market Ana Sayfa"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="text-xl font-bold"
          >
            TDC Market
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Ana menü">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link
                href={link.href}
                className="text-white/90 hover:text-[#CBA135] transition-colors duration-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#0B0B0B] rounded-lg px-2 py-1"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
          <Link
            href="/products"
            className="text-[#CBA135] hover:text-white transition-colors duration-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#0B0B0B] rounded-lg px-2 py-1"
          >
            Tüm Ürünler
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="p-2 text-white/80 hover:text-[#CBA135] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#0B0B0B] rounded-lg"
            aria-label="Ara"
          >
            <Search className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="p-2 text-white/80 hover:text-[#CBA135] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#0B0B0B] rounded-lg"
            aria-label="Favoriler"
          >
            <Heart className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="p-2 text-white/80 hover:text-[#CBA135] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#0B0B0B] rounded-lg"
            aria-label="Sepet"
          >
            <ShoppingCart className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="p-2 text-white/80 hover:text-[#CBA135] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#0B0B0B] rounded-lg"
            aria-label="Hesap"
          >
            <User className="w-5 h-5" />
          </motion.button>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="md:hidden p-2 text-white/80 hover:text-[#CBA135] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#0B0B0B] rounded-lg"
                aria-label="Menüyü aç/kapat"
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[300px] bg-[#0B0B0B] border-white/10 text-white"
            >
              <div className="flex flex-col space-y-6 mt-8">
                <nav className="flex flex-col space-y-4" role="navigation" aria-label="Mobil menü">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-white/90 hover:text-[#CBA135] transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#0B0B0B] rounded-lg px-3 py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/products"
                    className="text-[#CBA135] hover:text-white transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#0B0B0B] rounded-lg px-3 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tüm Ürünler
                  </Link>
                </nav>

                {/* Mobile Actions */}
                <div className="flex flex-col space-y-3 pt-6 border-t border-white/10">
                  <Button
                    variant="ghost"
                    className="justify-start text-white/90 hover:text-[#CBA135] hover:bg-white/5 focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#0B0B0B]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Ara
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-white/90 hover:text-[#CBA135] hover:bg-white/5 focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#0B0B0B]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Favoriler
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-white/90 hover:text-[#CBA135] hover:bg-white/5 focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#0B0B0B]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Sepet
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-white/90 hover:text-[#CBA135] hover:bg-white/5 focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2 focus:ring-offset-[#0B0B0B]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Hesap
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
