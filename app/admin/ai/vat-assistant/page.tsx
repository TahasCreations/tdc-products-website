'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function VatAssistantPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [vatData, setVatData] = useState({
    outputVat: 0,
    inputVat: 0,
    netVat: 0,
    capacity: 0
  });

  const periods = [
    { value: '2024-01', label: 'Ocak 2024' },
    { value: '2024-02', label: 'Şubat 2024' },
    { value: '2024-03', label: 'Mart 2024' },
    { value: '2024-04', label: 'Nisan 2024' },
  ];

  // Demo veriler temizlendi - API'den gerçek veriler gelecek
  const mockVatData: Record<string, any> = {};

  useEffect(() => {
    setVatData(mockVatData[selectedPeriod as keyof typeof mockVatData] || mockVatData['2024-01']);
  }, [selectedPeriod]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI KDV Asistanı</h1>
          <p className="text-gray-600">KDV hesaplamaları ve optimizasyon önerileri</p>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dönem Seçimi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedPeriod === period.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-sm font-medium">{period.label}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* VAT Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Çıktı KDV</p>
                <p className="text-2xl font-bold text-green-600">
                  {vatData.outputVat.toLocaleString('tr-TR')} ₺
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">📈</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Girdi KDV</p>
                <p className="text-2xl font-bold text-blue-600">
                  {vatData.inputVat.toLocaleString('tr-TR')} ₺
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📉</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net KDV</p>
                <p className="text-2xl font-bold text-purple-600">
                  {vatData.netVat.toLocaleString('tr-TR')} ₺
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">💰</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Kapasite</p>
                <p className="text-2xl font-bold text-orange-600">
                  {vatData.capacity.toLocaleString('tr-TR')} ₺
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">⚡</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* OCR Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Belge Yükleme</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-indigo-600 text-2xl">📄</span>
            </div>
            <p className="text-gray-600 mb-2">Fatura veya makbuz yükleyin</p>
            <p className="text-sm text-gray-500 mb-4">PDF, JPG, PNG formatları desteklenir</p>
            <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
              Dosya Seç
            </button>
          </div>
        </motion.div>

        {/* What-if Scenarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What-if Senaryoları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Ek Gider Senaryosu</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ek Gider Tutarı (₺)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    KDV Oranı (%)
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="18">18%</option>
                    <option value="8">8%</option>
                    <option value="1">1%</option>
                    <option value="0">0%</option>
                  </select>
                </div>
                <button className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                  Hesapla
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Sonuç</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mevcut Net KDV:</span>
                  <span className="font-medium">{vatData.netVat.toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ek Gider KDV:</span>
                  <span className="font-medium">+1,800 ₺</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-900 font-medium">Yeni Net KDV:</span>
                  <span className="font-bold text-indigo-600">8,800 ₺</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
