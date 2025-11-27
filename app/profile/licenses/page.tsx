'use client';


// Client components are dynamic by default
import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { formatFileSize, getLicenseTypeInfo } from '@/lib/digital-products/license-manager';

interface DigitalLicense {
  id: string;
  licenseKey: string;
  downloadUrl: string;
  downloadCount: number;
  maxDownloads: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  lastDownloadAt?: string;
  product: {
    title: string;
    fileFormat: string;
    fileSize: number;
    images: string[];
  };
}

export default function MyLicensesPage() {
  const [licenses, setLicenses] = useState<DigitalLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const response = await fetch('/api/me/licenses');
      const data = await response.json();
      setLicenses(data.licenses || []);
    } catch (error) {
      console.error('Error fetching licenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (license: DigitalLicense) => {
    setDownloading(license.id);
    try {
      // Open download link
      window.open(license.downloadUrl, '_blank');
      
      // Refresh licenses to update download count
      setTimeout(() => {
        fetchLicenses();
      }, 1000);
    } catch (error) {
      console.error('Download error:', error);
      alert('İndirme başarısız oldu');
    } finally {
      setDownloading(null);
    }
  };

  const copyLicenseKey = (key: string) => {
    navigator.clipboard.writeText(key);
    alert('Lisans anahtarı kopyalandı!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dijital Ürünlerim</h1>
          <p className="text-gray-600">Satın aldığınız dijital ürünleri buradan indirebilirsiniz</p>
        </motion.div>

        {/* Licenses List */}
        {licenses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dijital Ürününüz Yok</h3>
            <p className="text-gray-600 mb-6">STL dosyaları ve diğer dijital ürünleri satın alın</p>
            <a
              href="/categories/stl-dosyalari"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              STL Dosyalarına Göz At
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {licenses.map((license) => (
              <motion.div
                key={license.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 hover:border-purple-300 transition-all"
              >
                <div className="grid md:grid-cols-4 gap-6">
                  {/* Product Image */}
                  <div className="md:col-span-1">
                    <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden">
                      <img
                        src={license.product.images[0]}
                        alt={license.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="md:col-span-2">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{license.product.title}</h3>
                    
                    {/* File Details */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="text-xs text-gray-500">Format</div>
                        <div className="font-semibold text-gray-900">{license.product.fileFormat}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="text-xs text-gray-500">Boyut</div>
                        <div className="font-semibold text-gray-900">{formatFileSize(license.product.fileSize)}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="text-xs text-gray-500">İndirme</div>
                        <div className="font-semibold text-gray-900">
                          {license.downloadCount}/{license.maxDownloads === -1 ? '∞' : license.maxDownloads}
                        </div>
                      </div>
                    </div>

                    {/* License Key */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-purple-700 font-medium mb-1">Lisans Anahtarı</div>
                          <code className="text-sm font-mono text-gray-900">{license.licenseKey}</code>
                        </div>
                        <button
                          onClick={() => copyLicenseKey(license.licenseKey)}
                          className="px-3 py-1 bg-white text-purple-600 rounded-lg text-xs font-medium hover:bg-purple-100 transition-colors"
                        >
                          📋 Kopyala
                        </button>
                      </div>
                    </div>

                    {/* Purchase Date */}
                    <div className="text-xs text-gray-500 mt-3">
                      Satın Alındı: {new Date(license.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-1 flex flex-col justify-between">
                    <div>
                      {license.isActive ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          ✅ Aktif
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                          ❌ Pasif
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDownload(license)}
                      disabled={!license.isActive || downloading === license.id || 
                                (license.maxDownloads !== -1 && license.downloadCount >= license.maxDownloads)}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {downloading === license.id ? '⏳ İndiriliyor...' : '📥 İndir'}
                    </button>

                    {license.expiresAt && (
                      <div className="text-xs text-center text-gray-500 mt-2">
                        {new Date(license.expiresAt) > new Date() ? (
                          <>Son: {new Date(license.expiresAt).toLocaleDateString('tr-TR')}</>
                        ) : (
                          <span className="text-red-600">Süresi dolmuş</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

