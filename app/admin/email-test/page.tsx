"use client";

export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle, Settings } from 'lucide-react';

export default function EmailTestPage() {
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    error?: string;
  } | null>(null);

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Test email gönderilemedi',
          error: data.details,
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Beklenmeyen bir hata oluştu',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-8 h-8 text-[#CBA135]" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Email Sistemi Test</h1>
              <p className="text-gray-600">SMTP ayarlarınızı test edin</p>
            </div>
          </div>

          {/* SMTP Configuration Status */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              SMTP Konfigürasyonu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">SMTP Host:</span>
                <span className="ml-2 text-gray-600">
                  {process.env.NEXT_PUBLIC_SMTP_HOST || 'Gizli'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">SMTP Port:</span>
                <span className="ml-2 text-gray-600">
                  {process.env.NEXT_PUBLIC_SMTP_PORT || 'Gizli'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">SMTP User:</span>
                <span className="ml-2 text-gray-600">
                  {process.env.NEXT_PUBLIC_SMTP_USER || 'Gizli'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Test Mode:</span>
                <span className="ml-2 text-gray-600">
                  {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
                </span>
              </div>
            </div>
          </div>

          {/* Test Form */}
          <form onSubmit={handleTestEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Email Adresi
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Test email'i göndereceğiniz adresi girin
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !testEmail}
              className="w-full px-6 py-3 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Test Email Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Test Email Gönder
                </>
              )}
            </button>
          </form>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg border ${
                result.success
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {result.success ? 'Email Başarıyla Gönderildi!' : 'Email Gönderilemedi'}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message}
                  </p>
                  {result.error && (
                    <details className="mt-2">
                      <summary className="text-sm font-medium text-red-800 cursor-pointer">
                        Hata Detayları
                      </summary>
                      <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
                        {result.error}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Email Types Info */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3">Mevcut Email Türleri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-800">Sipariş Onayı</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-800">Hoş Geldin</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-800">Şifre Sıfırlama</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-800">Değerlendirme Hatırlatması</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-800">Fiyat Düşüşü</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-800">Kargo Takip</span>
                </div>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-3">Sorun Giderme</h3>
            <div className="text-sm text-yellow-800 space-y-2">
              <p>• Gmail kullanıyorsanız "App Password" oluşturun</p>
              <p>• SMTP port 587 kullanıldığından emin olun</p>
              <p>• Firewall ayarlarını kontrol edin</p>
              <p>• Environment variables doğru tanımlandığından emin olun</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
