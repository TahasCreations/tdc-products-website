"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
}

export default function AccountMenu() {
  const { data: session, status } = useSession();
  const [me, setMe] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/me")
        .then(r => r.json())
        .then(setMe)
        .catch(() => setMe({ id: "", email: "", name: "", role: "BUYER" }));
    }
  }, [session]);

  if (status === "loading") {
    return (
      <button className="px-3 py-2 rounded hover:bg-black/5 dark:hover:bg-white/10 opacity-50">
        👤 Yükleniyor...
      </button>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link 
          href="/auth/signin"
          className="px-3 py-2 rounded hover:bg-black/5 dark:hover:bg-white/10 text-sm"
        >
          Giriş Yap
        </Link>
        <Link 
          href="/auth/signup"
          className="px-3 py-2 rounded bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-sm"
        >
          Kayıt Ol
        </Link>
      </div>
    );
  }

  const role = me?.role || "BUYER";

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-black/5 dark:hover:bg-white/10"
      >
        {me?.image ? (
          <img 
            src={me.image} 
            alt={me.name || "Kullanıcı"} 
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <span className="text-lg">👤</span>
        )}
        <span className="text-sm text-black">
          {me?.name || session.user?.name || "Hesap"}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50">
          <div className="py-2">
            {/* Kullanıcı Bilgileri */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {me?.name || session.user?.name || "Kullanıcı"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {me?.email || session.user?.email}
              </p>
              <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                {role === "BUYER" && "Müşteri"}
                {role === "SELLER" && "Satıcı"}
                {role === "INFLUENCER" && "Influencer"}
                {role === "ADMIN" && "Admin"}
              </span>
            </div>

            {/* Rol Bazlı Menü Öğeleri */}
            <div className="py-2">
              {role === "BUYER" && (
                <>
                  <Link 
                    href="/partner/satici-ol"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    🛍️ Satıcı Ol
                  </Link>
                  <Link 
                    href="/partner/influencer-ol"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    📱 Influencer Ol
                  </Link>
                </>
              )}

              {role === "SELLER" && (
                <Link 
                  href="/seller"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  🏪 Satıcı Paneli
                </Link>
              )}

              {role === "INFLUENCER" && (
                <Link 
                  href="/influencer"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  📈 Influencer Paneli
                </Link>
              )}

              {role === "ADMIN" && (
                <>
                  <Link 
                    href="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    ⚙️ Admin Paneli
                  </Link>
                  <Link 
                    href="/admin/partners"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    📋 Başvurular
                  </Link>
                </>
              )}

              {/* Ortak Menü Öğeleri */}
              <Link 
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                👤 Profil
              </Link>
              
              <Link 
                href="/orders"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                📦 Siparişlerim
              </Link>
              
              <Link 
                href="/wishlist"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                ❤️ Favorilerim
              </Link>

              <hr className="my-2 border-gray-100 dark:border-gray-700" />
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                🚪 Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay - menü dışına tıklandığında kapat */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
