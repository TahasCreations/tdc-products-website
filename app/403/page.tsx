import Link from 'next/link';
import { motion } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* 403 Icon */}
          <div className="text-6xl mb-6">🚫</div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Erişim Reddedildi
          </h1>
          
          <p className="text-gray-600 mb-8">
            Bu sayfaya erişim yetkiniz bulunmuyor. Lütfen yetkili bir kullanıcı ile giriş yapın.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
            
            <Link
              href="/giris"
              className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Giriş Yap
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Eğer bu bir hata olduğunu düşünüyorsanız,</p>
            <p>lütfen destek ekibi ile iletişime geçin.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
