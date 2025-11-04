'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function SetupDatabasePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSetup = async () => {
    console.log('🔧 Setup butonu tıklandı');
    
    if (!confirm('Database tablolarını oluşturmak istediğinize emin misiniz?\n\nBu işlem sadece 1 kez yapılmalıdır!')) {
      console.log('❌ Kullanıcı iptal etti');
      return;
    }

    console.log('✅ Onay alındı, API çağrısı başlıyor...');
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('📡 API çağrısı: /api/admin/setup-database');
      
      const response = await fetch('/api/admin/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmKey: 'SETUP_DATABASE_TDC_2024',
        }),
      });

      console.log('📥 Response alındı:', response.status);
      
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (response.ok) {
        console.log('✅ Başarılı!');
        setResult(data);
      } else {
        console.error('❌ Hata:', data);
        setError(data.error || data.message || 'Beklenmeyen hata');
      }
    } catch (err: any) {
      console.error('❌ Catch hatası:', err);
      setError(err.message || 'Bağlantı hatası: API endpoint\'e ulaşılamıyor');
    } finally {
      setIsLoading(false);
      console.log('🏁 İşlem tamamlandı');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Database className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Database Setup</h1>
          <p className="text-gray-400 text-lg">
            Google Cloud SQL database tablolarını oluşturun
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          {/* Info */}
          <div className="mb-8">
            <div className="flex items-start space-x-3 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl mb-6">
              <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200">
                <p className="font-semibold mb-2">⚠️ Önemli Notlar:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-300">
                  <li>Bu işlem sadece <strong>1 kez</strong> yapılmalıdır</li>
                  <li>User, Product, Order gibi tüm tablolar oluşturulacak</li>
                  <li>DATABASE_URL environment variable'ı ayarlanmış olmalı</li>
                  <li>Google Cloud SQL instance'ı çalışır durumda olmalı</li>
                  <li>İşlem 30-60 saniye sürebilir</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#CBA135]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[#CBA135] font-bold">1</span>
                </div>
                <p className="text-gray-300">DATABASE_URL Vercel'de ayarlandı</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#CBA135]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[#CBA135] font-bold">2</span>
                </div>
                <p className="text-gray-300">Google Cloud SQL firewall açıldı (0.0.0.0/0)</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#CBA135]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[#CBA135] font-bold">3</span>
                </div>
                <p className="text-gray-300">postgres şifresi biliniyor</p>
              </div>
            </div>
          </div>

          {/* Setup Button */}
          {!result && !error && (
            <motion.button
              onClick={handleSetup}
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black font-bold rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Tablolar Oluşturuluyor...</span>
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" />
                  <span>Database Tablolarını Oluştur</span>
                </>
              )}
            </motion.button>
          )}

          {/* Success Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-green-400 font-semibold text-lg">✅ Başarılı!</p>
                  <p className="text-green-300 text-sm">{result.message}</p>
                </div>
              </div>

              {result.output && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <p className="text-gray-400 text-sm font-mono mb-2">Migration Çıktısı:</p>
                  <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                    {result.output}
                  </pre>
                </div>
              )}

              <div className="pt-4">
                <a
                  href="/kayit"
                  className="block text-center py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  🎉 Kayıt Sayfasını Test Et
                </a>
              </div>
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
        </motion.div>

        {/* Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 text-sm">
            Sorun yaşıyorsanız:{' '}
            <a href="/admin/dashboard" className="text-[#CBA135] hover:text-[#F4D03F]">
              Dashboard'a dön
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

