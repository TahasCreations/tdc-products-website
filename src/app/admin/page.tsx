'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mock admin authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (formData.email === 'admin@tdcproducts.com' && formData.password === 'admin123') {
        // Store admin session in cookie
        document.cookie = 'adminAuth=true; path=/; max-age=86400'; // 24 hours
        router.push('/admin/dashboard');
      } else {
        setError('Geçersiz e-posta veya şifre');
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-coral-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-white font-bold text-2xl">A</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2 font-serif">
              Admin Panel
            </h1>
            <p className="text-white/80">
              TDC Products Yönetim Paneli
            </p>
          </div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="admin@tdcproducts.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                Şifre
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-coral-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-600 hover:to-coral-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Giriş yapılıyor...
                </div>
              ) : (
                'Giriş Yap'
              )}
            </motion.button>
          </motion.form>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <h3 className="text-sm font-semibold text-white/90 mb-2">Demo Giriş Bilgileri:</h3>
            <p className="text-xs text-white/70">
              E-posta: <span className="font-mono">admin@tdcproducts.com</span>
            </p>
            <p className="text-xs text-white/70">
              Şifre: <span className="font-mono">admin123</span>
            </p>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 text-center"
          >
            <button
              onClick={() => router.push('/')}
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              ← Ana Sayfaya Dön
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
