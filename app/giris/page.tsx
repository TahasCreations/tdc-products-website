import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              TDC Market
            </h1>
            <p className="text-gray-600">
              Hesabınıza giriş yapın
            </p>
          </div>
          
          {/* Login Form */}
          <div className="space-y-6">
            <GoogleLoginButton />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">veya</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Giriş yaparak{' '}
                <span className="font-medium text-indigo-600">
                  TDC Market'in tüm özelliklerinden
                </span>{' '}
                yararlanabilirsiniz
              </p>
            </div>
          </div>
          
          {/* Features */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-green-500 mr-2">✓</span>
              Güvenli alışveriş deneyimi
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-green-500 mr-2">✓</span>
              Kişiselleştirilmiş öneriler
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-green-500 mr-2">✓</span>
              Sipariş takibi
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-green-500 mr-2">✓</span>
              Satıcı olma imkanı
            </div>
          </div>
          
          {/* Back to Home */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Ana sayfaya dön
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
