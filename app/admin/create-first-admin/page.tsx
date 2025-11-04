'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';

export default function CreateFirstAdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState('bentahasarii@gmail.com');
  const [password, setPassword] = useState('35Sandalye');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!email || !password) {
      setError('Email ve şifre gerekli');
      return;
    }

    if (!confirm('İlk admin kullanıcısını oluşturmak istediğinize emin misiniz?\n\nEmail: ' + email)) {
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/admin/create-first-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          confirmKey: 'CREATE_FIRST_ADMIN_TDC_2024',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        // 3 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          router.push('/admin?message=Admin hesabı oluşturuldu, giriş yapabilirsiniz');
        }, 3000);
      } else {
        setError(data.error || data.message || 'Beklenmeyen hata');
      }
    } catch (err: any) {
      setError(err.message || 'Bağlantı hatası');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Shield className="w-10 h-10 text-black" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">İlk Admin Oluştur</h1>
            <p className="text-gray-300">TDC Products ana admin hesabı</p>
          </div>

          {/* Info */}
          <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
            <p className="text-yellow-200 text-sm">
              ⚠️ Bu sayfa sadece <strong>ilk admin kullanıcısını</strong> oluşturmak içindir.
              Güvenlik nedeniyle sadece <strong>1 kez</strong> kullanılabilir.
            </p>
          </div>

          {!result && !error && (
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CBA135] placeholder:text-gray-500"
                  placeholder="admin@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Şifre
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CBA135] placeholder:text-gray-500"
                    placeholder="Güçlü şifre"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Create Button */}
              <motion.button
                onClick={handleCreate}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black font-bold rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Admin Oluşturuluyor...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Admin Hesabını Oluştur</span>
                  </>
                )}
              </motion.button>
            </div>
          )}

          {/* Success Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-400 font-semibold text-lg">✅ Başarılı!</p>
                  <p className="text-green-300 text-sm">{result.message}</p>
                  <div className="mt-3 space-y-1 text-sm text-green-200">
                    <p>📧 Email: {result.admin?.email}</p>
                    <p>👤 ID: {result.admin?.id}</p>
                    <p>🎯 Role: {result.admin?.role}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                <p className="text-blue-200 text-sm">
                  🔄 3 saniye sonra giriş sayfasına yönlendirileceksiniz...
                </p>
              </div>

              <a
                href="/admin"
                className="block text-center py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300"
              >
                Admin Giriş Sayfasına Git
              </a>
            </motion.div>
          )}

          {/* Error Result */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-semibold text-lg">❌ Hata!</p>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>

              <motion.button
                onClick={() => {
                  setError('');
                  setResult(null);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300"
              >
                Tekrar Dene
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <a href="/admin" className="text-gray-400 hover:text-white transition-colors text-sm">
            ← Admin Giriş Sayfasına Dön
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

