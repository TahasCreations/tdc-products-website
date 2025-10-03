'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/jobs/export-analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Export failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Analitik Export</h1>
          <p className="text-gray-600">
            BigQuery dataset: <code className="bg-gray-100 px-2 py-1 rounded">{process.env.NEXT_PUBLIC_BQ_DATASET || 'tdc_analytics'}</code>
          </p>
          <p className="text-gray-600">
            GCS export bucket: <code className="bg-gray-100 px-2 py-1 rounded">{process.env.NEXT_PUBLIC_GCS_EXPORT_BUCKET || 'tdc-exports'}</code>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Export İşlemi</h2>
            <p className="text-gray-600 mb-4">
              Bu işlem LedgerEntry, AdClick ve Subscription verilerini BigQuery'ye export eder.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              disabled={isLoading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Export Ediliyor...' : 'Analitik Exportu Çalıştır'}
            </motion.button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <h3 className="text-red-800 font-semibold mb-2">Hata</h3>
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-green-800 font-semibold mb-2">Export Başarılı!</h3>
                <p className="text-green-700">Tarih: {result.date}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Dosya Konumları:</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Ledger Entries:</p>
                    <code className="text-xs text-gray-600 break-all">{result.files?.ledger}</code>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Ad Clicks:</p>
                    <code className="text-xs text-gray-600 break-all">{result.files?.adClicks}</code>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Subscriptions:</p>
                    <code className="text-xs text-gray-600 break-all">{result.files?.subscriptions}</code>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">BigQuery Job ID'leri:</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-700">Ledger Entries Job:</p>
                    <code className="text-xs text-blue-600">{result.jobIds?.ledger}</code>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-700">Ad Clicks Job:</p>
                    <code className="text-xs text-blue-600">{result.jobIds?.adClicks}</code>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-700">Subscriptions Job:</p>
                    <code className="text-xs text-blue-600">{result.jobIds?.subscriptions}</code>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Cloud Scheduler URL'leri:</h4>
            <div className="space-y-2 text-sm">
              <p className="text-yellow-700">
                Ads Reset: <code className="bg-yellow-100 px-2 py-1 rounded">/api/crons/ads/reset-spend?key=CRON_KEY</code>
              </p>
              <p className="text-yellow-700">
                Billing Renew: <code className="bg-yellow-100 px-2 py-1 rounded">/api/crons/billing/renew?key=CRON_KEY</code>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
