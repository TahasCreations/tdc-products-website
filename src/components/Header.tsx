'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { GoogleLoginButton } from './auth/GoogleLoginButton';
import { LogoutButton } from './auth/LogoutButton';
import ThemeToggle from './ThemeToggle';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const { data: session, status } = useSession();
  const { count, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard navigation for mega menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) { setSuggestions([]); return; }
    const ctrl = new AbortController();
    fetch(`/api/search/suggest?q=${encodeURIComponent(q)}&limit=6`, { signal: ctrl.signal })
      .then(r => r.json())
      .then(data => setSuggestions((data?.items || []).map((i: any) => i.label)))
      .catch(() => {});
    return () => ctrl.abort();
  }, [searchQuery]);

  const navItems = [
    { href: '/products', key: 'all', label: 'Tüm Ürünler', hasMegaMenu: false },
    { href: '/products?category=figur-koleksiyon', key: 'figur-koleksiyon', label: 'Figür & Koleksiyon', hasMegaMenu: true },
    { href: '/products?category=moda-aksesuar', key: 'moda-aksesuar', label: 'Moda & Aksesuar', hasMegaMenu: true },
    { href: '/products?category=elektronik', key: 'elektronik', label: 'Elektronik', hasMegaMenu: true },
    { href: '/products?category=ev-yasam', key: 'ev-yasam', label: 'Ev & Yaşam', hasMegaMenu: true },
    { href: '/products?category=sanat-hobi', key: 'sanat-hobi', label: 'Sanat & Hobi', hasMegaMenu: true },
    { href: '/products?category=hediyelik', key: 'hediyelik', label: 'Hediyelik', hasMegaMenu: true },
    { href: '/blog', key: 'blog', label: 'Blog', hasMegaMenu: false },
    { href: '/about', key: 'about', label: 'Hakkımızda', hasMegaMenu: false }
  ];

  const megaMenuData = {
    'figur-koleksiyon': {
      title: 'Figür & Koleksiyon',
      description: 'Anime figürleri, film karakterleri ve koleksiyon ürünleri',
      categories: [
        { name: 'Anime Figürleri', href: '/products?category=anime-figurleri', icon: 'zap', subcategories: ['Naruto', 'One Piece', 'Dragon Ball', 'Attack on Titan', 'Demon Slayer', 'My Hero Academia'] },
        { name: 'Film/TV Figürleri', href: '/products?category=film-tv-figurleri', icon: 'film', subcategories: ['Marvel', 'DC Comics', 'Star Wars', 'Harry Potter', 'Stranger Things', 'The Witcher'] },
        { name: 'Dioramalar', href: '/products?category=dioramalar', icon: 'layers', subcategories: ['Savaş Sahnesi', 'Fantastik Dünya', 'Şehir Manzarası', 'Doğa Manzarası', 'Uzay Teması'] },
        { name: 'Koleksiyon Arabaları', href: '/products?category=koleksiyon-arabalari', icon: 'car', subcategories: ['Formula 1', 'Klasik Arabalar', 'Spor Arabalar', 'SUV Modelleri', 'Retro Arabalar'] },
        { name: 'Maket & Kitler', href: '/products?category=maket-kitler', icon: 'package', subcategories: ['Gundam', 'Tank Modelleri', 'Uçak Modelleri', 'Araba Modelleri', 'Gemi Modelleri'] },
        { name: 'Limited Edition', href: '/products?category=limited-edition', icon: 'star', subcategories: ['Exclusive Figürler', 'Özel Renkler', 'Altın Seri', 'Platin Seri', 'Koleksiyoncu Özel'] },
        { name: 'Aksesuar & Stand', href: '/products?category=figur-aksesuar', icon: 'box', subcategories: ['Figür Standları', 'LED Aydınlatma', 'Vitrin Kutusu', 'Temizlik Seti', 'Pozisyon Aksesuarları'] }
      ],
      featured: [
        { name: 'Naruto Uzumaki Figürü', href: '/products/naruto-uzumaki-figuru-shippuden', price: '₺299.99', image: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=Naruto' },
        { name: 'One Piece Luffy Figürü', href: '/products/one-piece-luffy-figuru-gear-4', price: '₺459.99', image: 'https://via.placeholder.com/150x150/FF9F43/FFFFFF?text=Luffy' },
        { name: 'Iron Man Mark 85', href: '/products/iron-man-mark-85-figuru', price: '₺1299.99', image: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=Iron+Man' }
      ]
    },
    'moda-aksesuar': {
      title: 'Moda & Aksesuar',
      description: 'Tişört, hoodie, şapka ve takı koleksiyonları',
      categories: [
        { name: 'Tişört', href: '/products?category=tisort', icon: 'shirt', subcategories: ['Anime Tişört', 'Film Tişört', 'Oyun Tişört', 'Klasik Tişört', 'Vintage Tişört', 'Özel Tasarım'] },
        { name: 'Hoodie', href: '/products?category=hoodie', icon: 'shirt', subcategories: ['Kapüşonlu', 'Zipsiz', 'Oversize', 'Klasik', 'Vintage', 'Özel Tasarım'] },
        { name: 'Şapka', href: '/products?category=sapka', icon: 'hat', subcategories: ['Baseball Şapka', 'Beanie', 'Snapback', 'Trucker Şapka', 'Bucket Hat', 'Özel Tasarım'] },
        { name: 'Takı & Bileklik', href: '/products?category=taki-bileklik', icon: 'gem', subcategories: ['Bileklik', 'Kolye', 'Küpe', 'Yüzük', 'Broş', 'Özel Tasarım'] },
        { name: 'Çanta & Cüzdan', href: '/products?category=canta-cuzdan', icon: 'bag', subcategories: ['Sırt Çantası', 'El Çantası', 'Cüzdan', 'Kartlık', 'Telefon Kılıfı', 'Özel Tasarım'] },
        { name: 'Ayakkabı', href: '/products?category=ayakkabi', icon: 'shoe', subcategories: ['Sneaker', 'Spor Ayakkabı', 'Klasik Ayakkabı', 'Bot', 'Sandalet', 'Özel Tasarım'] }
      ],
      featured: [
        { name: 'Anime Tişört - Naruto', href: '/products/anime-tisort-naruto-collection', price: '₺89.99', image: 'https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=Naruto+T' },
        { name: 'One Piece Hoodie', href: '/products/one-piece-hoodie', price: '₺199.99', image: 'https://via.placeholder.com/150x150/FF9F43/FFFFFF?text=One+Piece+H' }
      ]
    },
    'elektronik': {
      title: 'Elektronik',
      description: 'Kulaklık, akıllı ev ürünleri ve elektronik aksesuarlar',
      categories: [
        { name: 'Kulaklık', href: '/products?category=kulaklik', icon: 'headphones', subcategories: ['Kablosuz Kulaklık', 'Gaming Kulaklık', 'Spor Kulaklık', 'Noise Cancelling', 'Bluetooth Kulaklık', 'Profesyonel'] },
        { name: 'Akıllı Ev', href: '/products?category=akilli-ev', icon: 'home', subcategories: ['Akıllı Ampul', 'Akıllı Priz', 'Akıllı Sensör', 'Akıllı Kamera', 'Akıllı Hoparlör', 'Akıllı Termostat'] },
        { name: 'Aydınlatma', href: '/products?category=aydinlatma', icon: 'lightbulb', subcategories: ['LED Şerit', 'RGB Aydınlatma', 'Masa Lambası', 'Duvar Aydınlatması', 'Bahçe Aydınlatması', 'Özel Tasarım'] },
        { name: 'Hobi Elektroniği', href: '/products?category=hobi-elektronigi', icon: 'cpu', subcategories: ['Arduino Kitleri', 'Raspberry Pi', 'Sensörler', 'Motorlar', 'Kablo Setleri', 'Breadboard'] },
        { name: '3D Yazıcı Aksesuarları', href: '/products?category=3d-yazici-aksesuarlari', icon: 'printer', subcategories: ['3D Yazıcı', 'Filament', 'Nozzle', 'Yatak Yüzeyi', 'Aksesuarlar', 'Yedek Parçalar'] },
        { name: 'Bilgisayar Aksesuarları', href: '/products?category=pc-aksesuar', icon: 'keyboard', subcategories: ['Klavye', 'Mouse', 'Webcam', 'Mikrofon', 'Hoparlör', 'Monitör Standı'] },
        { name: 'Giyilebilir Teknoloji', href: '/products?category=giyilebilir', icon: 'watch', subcategories: ['Akıllı Saat', 'Fitness Band', 'VR Gözlük', 'Akıllı Gözlük', 'Kulaklık', 'Özel Tasarım'] }
      ],
      featured: [
        { name: 'Kablosuz Kulaklık', href: '/products/kablosuz-kulaklik-noise-cancelling', price: '₺899.99', image: 'https://via.placeholder.com/150x150/2C3E50/FFFFFF?text=Headphones' },
        { name: 'LED Aydınlatma Seti', href: '/products/led-aydinlatma-seti-rgb', price: '₺149.99', image: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=LED' }
      ]
    },
    'ev-yasam': {
      title: 'Ev & Yaşam',
      description: 'Dekorasyon, aydınlatma ve ev ürünleri',
      categories: [
        { name: 'Dekor', href: '/products?category=dekor', icon: 'sparkles', subcategories: ['Duvar Dekoru', 'Masa Dekoru', 'Raf Sistemi', 'Çerçeve', 'Süs Eşyaları', 'Özel Tasarım'] },
        { name: 'Mutfak', href: '/products?category=mutfak', icon: 'utensils', subcategories: ['Mutfak Gereçleri', 'Pişirme Ekipmanları', 'Saklama Kapları', 'Mutfak Tekstili', 'Mutfak Aksesuarları', 'Özel Tasarım'] },
        { name: 'Düzenleme', href: '/products?category=duzenleme', icon: 'box', subcategories: ['Saklama Kutuları', 'Dosyalama Sistemi', 'Raf Organizatörü', 'Çekmece Organizatörü', 'Askı Sistemleri', 'Özel Tasarım'] },
        { name: 'Banyo', href: '/products?category=banyo', icon: 'droplet', subcategories: ['Banyo Aksesuarları', 'Havlu & Bornoz', 'Banyo Tekstili', 'Banyo Dekoru', 'Banyo Organizatörü', 'Özel Tasarım'] },
        { name: 'Tekstil', href: '/products?category=ev-tekstil', icon: 'fabric', subcategories: ['Yatak Takımları', 'Yastık Kılıfları', 'Perde & Tül', 'Halı & Kilim', 'Battaniye', 'Özel Tasarım'] }
      ],
      featured: [
        { name: 'LED Aydınlatma Seti', href: '/products/led-aydinlatma-seti-rgb', price: '₺149.99', image: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=LED' },
        { name: 'Kişiye Özel Çerçeve', href: '/products/kisiye-ozel-fotograf-cercevesi', price: '₺79.99', image: 'https://via.placeholder.com/150x150/8E44AD/FFFFFF?text=Frame' }
      ]
    },
    'sanat-hobi': {
      title: 'Sanat & Hobi',
      description: 'Boya, tuval ve el sanatları malzemeleri',
      categories: [
        { name: 'Boya & Fırça', href: '/products?category=boya-firca', icon: 'brush', subcategories: ['Akrilik Boya', 'Sulu Boya', 'Yağlı Boya', 'Pastel Boya', 'Fırça Setleri', 'Palet'] },
        { name: 'Tuval', href: '/products?category=tuval', icon: 'square', subcategories: ['Tuval Çeşitleri', 'Tuval Setleri', 'Tuval Çerçeveleri', 'Tuval Aksesuarları', 'Özel Boyutlar', 'Özel Tasarım'] },
        { name: '3D Baskı Malzemeleri', href: '/products?category=3d-baski-malzemeleri', icon: 'package', subcategories: ['3D Yazıcı', 'Filament', 'Nozzle', 'Yatak Yüzeyi', 'Aksesuarlar', 'Yedek Parçalar'] },
        { name: 'El Sanatları', href: '/products?category=el-sanatlari', icon: 'scissors', subcategories: ['Dikiş Malzemeleri', 'Örgü Malzemeleri', 'Takı Malzemeleri', 'Ahşap İşleme', 'Seramik', 'Özel Tasarım'] },
        { name: 'Kırtasiye', href: '/products?category=kirtasiye', icon: 'pen', subcategories: ['Kalem Setleri', 'Defter & Bloknot', 'Çizim Malzemeleri', 'Ofis Gereçleri', 'Okul Malzemeleri', 'Özel Tasarım'] },
        { name: 'Model & Maket', href: '/products?category=model-maket', icon: 'cube', subcategories: ['Gundam Kitleri', 'Tank Modelleri', 'Uçak Modelleri', 'Araba Modelleri', 'Gemi Modelleri', 'Özel Tasarım'] }
      ],
      featured: [
        { name: 'Akrilik Boya Seti', href: '/products/akrilik-boya-seti-24-renk', price: '₺199.99', image: 'https://via.placeholder.com/150x150/FF9F43/FFFFFF?text=Paint' },
        { name: 'Gundam Model Kit', href: '/products/gundam-model-kit', price: '₺299.99', image: 'https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=Gundam' }
      ]
    },
    'hediyelik': {
      title: 'Hediyelik',
      description: 'Kişiye özel hediyeler ve özel gün setleri',
      categories: [
        { name: 'Kişiye Özel', href: '/products?category=kisiye-ozel', icon: 'user', subcategories: ['Kişiye Özel Çerçeve', 'Kişiye Özel Tişört', 'Kişiye Özel Kupa', 'Kişiye Özel Takı', 'Kişiye Özel Çanta', 'Özel Tasarım'] },
        { name: 'Doğum Günü', href: '/products?category=dogum-gunu', icon: 'cake', subcategories: ['Doğum Günü Setleri', 'Doğum Günü Kartları', 'Doğum Günü Süsleri', 'Doğum Günü Hediyeleri', 'Doğum Günü Parti', 'Özel Tasarım'] },
        { name: 'Özel Gün Setleri', href: '/products?category=ozel-gun-setleri', icon: 'gift', subcategories: ['Sevgililer Günü', 'Anneler Günü', 'Babalar Günü', 'Yılbaşı Setleri', 'Bayram Setleri', 'Özel Tasarım'] },
        { name: 'Kart & Aksesuar', href: '/products?category=hediye-kart-aksesuar', icon: 'credit-card', subcategories: ['Hediye Kartları', 'Kart Aksesuarları', 'Hediye Paketleri', 'Kurdele & Fiyonk', 'Hediye Etiketleri', 'Özel Tasarım'] },
        { name: 'Kurumsal Hediyeler', href: '/products?category=kurumsal-hediye', icon: 'briefcase', subcategories: ['Kurumsal Hediye Setleri', 'Promosyon Ürünleri', 'Özel Gün Hediyeleri', 'Kurumsal Kartlar', 'Kurumsal Aksesuarlar', 'Özel Tasarım'] }
      ],
      featured: [
        { name: 'Kişiye Özel Çerçeve', href: '/products/kisiye-ozel-fotograf-cercevesi', price: '₺79.99', image: 'https://via.placeholder.com/150x150/8E44AD/FFFFFF?text=Frame' },
        { name: 'Doğum Günü Seti', href: '/products/dogum-gunu-hediyelik-seti', price: '₺149.99', image: 'https://via.placeholder.com/150x150/E74C3C/FFFFFF?text=Gift+Set' }
      ]
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0"
            >
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-coral-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl sm:text-2xl">T</span>
                </div>
                <div className="hidden xs:block">
                  <span className="text-lg sm:text-2xl font-bold text-ink-900 font-serif">TDC Market</span>
                  <p className="text-xs text-ink-600 -mt-1 hidden sm:block">Özel figürlerden elektroniğe</p>
                </div>
              </Link>
            </motion.div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ürün, kategori veya marka ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-10 sm:pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                  >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500 hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
                {suggestions.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border z-40">
                    <ul className="py-2">
                      {suggestions.map((s) => (
                        <li key={s}>
                          <button
                            onClick={() => (window.location.href = `/search?q=${encodeURIComponent(s)}`)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            {s}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Mobile Search Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 text-ink-600 hover:text-indigo-600 transition-colors touch-manipulation"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.button>

              {/* Theme Toggle */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* User/Profile or Auth Trigger */}
              {session ? (
                <div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-ink-600 hover:text-indigo-600 transition-colors rounded-lg hover:bg-gray-50 touch-manipulation"
                  >
                    <img
                      src={session.user?.image || 'https://via.placeholder.com/32x32/4F46E5/FFFFFF?text=U'}
                      alt={session.user?.name || 'User'}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                    />
                    <span className="hidden sm:block font-medium text-sm truncate max-w-[120px]">{session.user?.name}</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-sm font-semibold text-gray-900 truncate">{session.user?.name}</div>
                        <div className="text-xs text-gray-500 truncate">{session.user?.email}</div>
                      </div>
                      <a href="/profile" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <span>👤</span>
                        <span>Profilim</span>
                      </a>
                      <a href="/profile?tab=orders" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <span>📦</span>
                        <span>Siparişlerim</span>
                      </a>
                      <a href="/profile?tab=addresses" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <span>📍</span>
                        <span>Adreslerim</span>
                      </a>
                      <a href="/profile?tab=author" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <span>✍️</span>
                        <span>Yazar Profilim</span>
                      </a>
                      <div className="border-t border-gray-100 mt-2 pt-2 px-4 pb-2">
                        <LogoutButton />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAuthOpen(true)}
                  className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow"
                >
                  Giriş Yap / Kayıt Ol
                </motion.button>
              )}

              {/* Authentication Buttons (desktop inline) */}
              {status === 'loading' ? (
                <div className="hidden sm:flex items-center space-x-2 px-3 sm:px-4 py-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                </div>
              ) : null}

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-ink-600 hover:text-indigo-600 transition-colors touch-manipulation"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>

              {/* Cart Button - move to the far right */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className="relative p-2 text-ink-600 hover:text-indigo-600 transition-colors touch-manipulation"
                aria-label="Sepeti Aç"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-coral-500 text-white rounded-full h-4 min-w-[16px] px-1 sm:h-5 sm:min-w-[20px] flex items-center justify-center text-[10px] sm:text-xs">{count}</span>
              </motion.button>
            </div>
          </div>

          {/* Mobile Search Overlay */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden border-t border-gray-200 py-4"
              >
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ürün, kategori veya marka ara..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <button
                      type="submit"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <svg className="h-5 w-5 text-indigo-500 hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden border-t border-gray-200 py-4"
              >
                <div className="space-y-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="block text-ink-600 hover:text-indigo-600 transition-colors font-medium py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Mobile Auth Buttons */}
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    {status === 'loading' ? (
                      <div className="flex items-center justify-center py-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                      </div>
                    ) : session ? (
                      <>
                        <div className="flex items-center space-x-3 px-4 py-3">
                          <img
                            src={session.user?.image || 'https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=U'}
                            alt={session.user?.name || 'User'}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                            <p className="text-xs text-gray-500">{session.user?.email}</p>
                          </div>
                        </div>

                        {/* Seller Apply Button (for BUYER role) */}
                        {session.user?.role === 'BUYER' && (
                          <div className="px-4 mb-3">
                            <Link
                              href="/seller/apply"
                              className="block w-full px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors text-center"
                            >
                              Satıcı Ol
                            </Link>
                          </div>
                        )}

                        <div className="px-4">
                          <LogoutButton />
                        </div>
                      </>
                    ) : (
                      <div className="px-4">
                        <GoogleLoginButton />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Navigation Bar with Mega Menu */}
        <div className="hidden lg:block border-t border-gray-200 bg-white/90 backdrop-blur-sm" ref={megaMenuRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-center space-x-8 py-3">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="relative"
                  onMouseEnter={() => item.hasMegaMenu && setActiveMegaMenu(item.href.split('/').pop() || null)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link
                    href={item.href}
                    className="relative text-sm text-ink-600 hover:text-indigo-600 transition-colors duration-300 font-medium group py-2 flex items-center space-x-1"
                  >
                    <span>{item.label}</span>
                    {item.hasMegaMenu && (
                      <svg className="w-3 h-3 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-coral-500"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </Link>

                  {/* Mega Menu */}
                  <AnimatePresence>
                    {item.hasMegaMenu && activeMegaMenu === item.href.split('/').pop() && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-7xl bg-white shadow-xl border-t border-gray-200 z-50"
                      >
                        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                          {(() => {
                            const menuKey = item.href.split('/').pop();
                            const menuData = menuKey ? megaMenuData[menuKey as keyof typeof megaMenuData] : null;
                            if (!menuData) return null;

                            return (
                              <div className="grid grid-cols-12 gap-8">
                                {/* Quick Links */}
                                <div className="col-span-12 mb-2">
                                  <div className="flex items-center justify-center gap-3">
                                    <a href={`${item.href}&sort=newest`} className="px-3 py-1.5 text-xs rounded-full bg-gray-100 hover:bg-gray-200">Yeni Gelenler</a>
                                    <a href={`${item.href}&sort=best-selling`} className="px-3 py-1.5 text-xs rounded-full bg-gray-100 hover:bg-gray-200">En Çok Satanlar</a>
                                    <a href={`${item.href}&discount=true`} className="px-3 py-1.5 text-xs rounded-full bg-gray-100 hover:bg-gray-200">İndirimler</a>
                                  </div>
                                </div>
                                {/* Categories Column */}
                                <div className="col-span-8">
                                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{menuData.title}</h3>
                                  <p className="text-gray-600 mb-6">{menuData.description}</p>
                                  <div className="grid grid-cols-2 gap-6">
                                    {menuData.categories.map((category, catIndex) => (
                                      <div key={category.href} className="space-y-2">
                                        <Link
                                          href={category.href}
                                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                        >
                                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                                            <span className="text-indigo-600 text-sm">📦</span>
                                          </div>
                                          <span className="text-gray-700 group-hover:text-indigo-600 transition-colors font-medium">{category.name}</span>
                                        </Link>
                                        {/* Subcategories */}
                                        {category.subcategories && (
                                          <div className="ml-11 space-y-1">
                                            {category.subcategories.slice(0, 4).map((subcategory, subIndex) => (
                                              <Link
                                                key={subIndex}
                                                href={`${category.href}&subcategory=${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                                                className="block text-xs text-gray-600 hover:text-indigo-600 transition-colors py-1"
                                              >
                                                {subcategory}
                                              </Link>
                                            ))}
                                            {category.subcategories.length > 4 && (
                                              <span className="text-xs text-gray-400">+{category.subcategories.length - 4} daha</span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Featured Products Column */}
                                <div className="col-span-4">
                                  <h4 className="text-md font-semibold text-gray-900 mb-4">Öne Çıkan Ürünler</h4>
                                  <div className="space-y-4">
                                    {menuData.featured.map((product, prodIndex) => (
                                      <Link
                                        key={product.href}
                                        href={product.href}
                                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                      >
                                        <img
                                          src={product.image}
                                          alt={product.name}
                                          className="w-12 h-12 rounded-lg object-cover"
                                          loading="lazy"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                                            {product.name}
                                          </p>
                                          <p className="text-sm text-indigo-600 font-semibold">{product.price}</p>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center px-4"
            onClick={() => setIsAuthOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900">Giriş Yap / Kayıt Ol</h3>
                <p className="text-sm text-gray-500">Hesabınıza giriş yapın veya yeni hesap oluşturun</p>
              </div>
              <div className="space-y-3">
                <a
                  href="/giris"
                  className="block w-full text-center px-4 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
                >
                  E-posta ile Giriş Yap
                </a>
                <a
                  href="/kayit"
                  className="block w-full text-center px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Yeni Hesap Oluştur
                </a>
                <div className="flex items-center">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="px-3 text-xs text-gray-400">veya</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <GoogleLoginButton />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
