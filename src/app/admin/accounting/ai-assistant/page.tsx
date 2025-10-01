'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import TDCMarketAdminLayout from '@/components/admin/TDCMarketAdminLayout';

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState('vat-assistant');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-10');
  const [isProcessing, setIsProcessing] = useState(false);

  const tabs = [
    { id: 'vat-assistant', label: 'KDV Asistanı', icon: '🧾' },
    { id: 'profit-optimizer', label: 'Kâr Önerileri', icon: '💰' }
  ];

  const periods = [
    { value: '2024-10', label: '2024-10 (Ekim)' },
    { value: '2024-09', label: '2024-09 (Eylül)' },
    { value: '2024-08', label: '2024-08 (Ağustos)' }
  ];

  const vatData = {
    periodSummary: {
      period: '2024-10',
      outputVat: 45600,
      inputVat: 32100,
      netVat: 13500,
      status: 'open',
      capacity: {
        min: 5000,
        max: 15000,
        current: 32100,
        projected: 38000
      }
    },
    recentInvoices: [
      { id: 'INV-001', supplier: 'Office Supplies Co', amount: 1200, vat: 216, category: 'Office', status: 'processed', confidence: 95 },
      { id: 'INV-002', supplier: 'Fuel Station', amount: 850, vat: 153, category: 'Fuel', status: 'pending', confidence: 88 },
      { id: 'INV-003', supplier: 'Marketing Agency', amount: 3500, vat: 630, category: 'Marketing', status: 'conflict', confidence: 92 }
    ],
    deductibilityRules: [
      { category: 'Office', rule: 'FULL', rate: 100, description: 'Ofis malzemeleri tam indirilebilir' },
      { category: 'Fuel', rule: 'PARTIAL', rate: 50, description: 'Yakıt %50 indirilebilir' },
      { category: 'Marketing', rule: 'FULL', rate: 100, description: 'Pazarlama harcamaları tam indirilebilir' },
      { category: 'Entertainment', rule: 'NONE', rate: 0, description: 'Eğlence harcamaları indirilemez' }
    ],
    conflicts: [
      { type: 'duplicate', invoice: 'INV-001', message: 'Aynı fatura numarası tespit edildi', severity: 'high' },
      { type: 'unusual_amount', invoice: 'INV-003', message: 'Sıra dışı tutar - normal aralığın %200 üzerinde', severity: 'medium' },
      { type: 'missing_tax', invoice: 'INV-002', message: 'Eksik vergi alanı tespit edildi', severity: 'high' }
    ]
  };

  const profitData = {
    scenarios: [
      {
        id: 'scenario-1',
        title: 'Erken Ödeme İndirimi',
        description: 'Tedarikçi faturalarında %2 erken ödeme indirimi',
        impact: {
          vat: -200,
          cash: -5000,
          profit: 300,
          confidence: 85
        },
        formula: 'İndirim Tutarı × (1 - Vergi Oranı) - Finansman Maliyeti'
      },
      {
        id: 'scenario-2',
        title: 'Stok Değerleme Değişikliği',
        description: 'FIFO yerine Weighted Average kullanımı',
        impact: {
          vat: 0,
          cash: 0,
          profit: -1200,
          confidence: 78
        },
        formula: 'COGS Farkı = (FIFO COGS - WAvg COGS) × Stok Miktarı'
      },
      {
        id: 'scenario-3',
        title: 'Amortisman Yöntemi',
        description: 'Straight-line yerine Double Declining Balance',
        impact: {
          vat: 0,
          cash: 0,
          profit: 2500,
          confidence: 92
        },
        formula: 'Amortisman Farkı = (SL Amortisman - DDB Amortisman) × Vergi Oranı'
      }
    ],
    reminders: [
      { type: 'vat_declaration', date: '2024-11-15', message: 'KDV beyan tarihi yaklaşıyor', priority: 'high' },
      { type: 'period_close', date: '2024-10-31', message: 'Dönem kapanışı için hazırlık', priority: 'medium' },
      { type: 'payment', date: '2024-11-05', message: 'Banka ödeme günü', priority: 'high' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'conflict': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getRuleColor = (rule: string) => {
    switch (rule) {
      case 'FULL': return 'bg-green-100 text-green-800';
      case 'PARTIAL': return 'bg-yellow-100 text-yellow-800';
      case 'NONE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TDCMarketAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI KDV Asistanı</h1>
            <p className="text-gray-600 mt-1">AI destekli KDV yönetimi ve kâr optimizasyonu</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsProcessing(true)}
              disabled={isProcessing}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'İşleniyor...' : 'AI Analizi Başlat'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'vat-assistant' && (
              <motion.div
                key="vat-assistant"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Period Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-xl shadow-sm border p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Hesaplanan KDV</p>
                        <p className="text-2xl font-bold text-gray-900">₺{vatData.periodSummary.outputVat.toLocaleString()}</p>
                        <p className="text-sm text-blue-600">Output VAT</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-xl">📤</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm border p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">İndirilecek KDV</p>
                        <p className="text-2xl font-bold text-gray-900">₺{vatData.periodSummary.inputVat.toLocaleString()}</p>
                        <p className="text-sm text-green-600">Input VAT</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-xl">📥</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-xl shadow-sm border p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Net KDV</p>
                        <p className="text-2xl font-bold text-gray-900">₺{vatData.periodSummary.netVat.toLocaleString()}</p>
                        <p className="text-sm text-purple-600">Ödenecek</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 text-xl">💰</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white rounded-xl shadow-sm border p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Kapasite</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₺{vatData.periodSummary.capacity.min.toLocaleString()}-{vatData.periodSummary.capacity.max.toLocaleString()}
                        </p>
                        <p className="text-sm text-orange-600">Eklenebilir</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 text-xl">📊</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Capacity Gauge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white rounded-xl shadow-sm border p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">"Ne kadar daha eklenebilir?" Analizi</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Mevcut İndirilecek KDV</span>
                      <span className="text-lg font-bold text-gray-900">₺{vatData.periodSummary.capacity.current.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-yellow-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${(vatData.periodSummary.capacity.current / vatData.periodSummary.capacity.max) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₺{vatData.periodSummary.capacity.min.toLocaleString()}</span>
                      <span>₺{vatData.periodSummary.capacity.max.toLocaleString()}</span>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>AI Önerisi:</strong> Bu dönemde ₺{vatData.periodSummary.capacity.max - vatData.periodSummary.capacity.current} daha indirilebilir KDV eklenebilir. 
                        Projeksiyon: ₺{vatData.periodSummary.capacity.projected.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Recent Invoices */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-white rounded-xl shadow-sm border p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Son İşlenen Faturalar</h3>
                  <div className="space-y-3">
                    {vatData.recentInvoices.map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-2xl mr-4">🧾</span>
                          <div>
                            <p className="font-medium text-gray-900">{invoice.supplier}</p>
                            <p className="text-sm text-gray-500">{invoice.id} • {invoice.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium text-gray-900">₺{invoice.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">KDV: ₺{invoice.vat}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Güven</p>
                            <p className="font-medium text-green-600">%{invoice.confidence}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                            {invoice.status === 'processed' ? 'İşlendi' :
                             invoice.status === 'pending' ? 'Beklemede' : 'Çakışma'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Conflicts & Alerts */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-white rounded-xl shadow-sm border p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Çakışmalar ve Uyarılar</h3>
                  <div className="space-y-3">
                    {vatData.conflicts.map((conflict, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          <div>
                            <p className="font-medium text-gray-900">{conflict.message}</p>
                            <p className="text-sm text-gray-500">Fatura: {conflict.invoice}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getSeverityColor(conflict.severity)}`}>
                            {conflict.severity === 'high' ? 'Yüksek' :
                             conflict.severity === 'medium' ? 'Orta' : 'Düşük'}
                          </span>
                          <button className="text-sm text-indigo-600 hover:text-indigo-900">İncele</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Deductibility Rules */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="bg-white rounded-xl shadow-sm border p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">İndirilebilirlik Kuralları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vatData.deductibilityRules.map((rule, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{rule.category}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRuleColor(rule.rule)}`}>
                            {rule.rule === 'FULL' ? 'Tam' :
                             rule.rule === 'PARTIAL' ? 'Kısmi' : 'Yok'} (%{rule.rate})
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{rule.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'profit-optimizer' && (
              <motion.div
                key="profit-optimizer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* What-if Scenarios */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-xl shadow-sm border p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What-if Senaryoları</h3>
                  <div className="space-y-4">
                    {profitData.scenarios.map((scenario, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{scenario.title}</h4>
                            <p className="text-sm text-gray-600">{scenario.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Güven: %{scenario.impact.confidence}</span>
                            <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                              Uygula
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">KDV Etkisi</p>
                            <p className={`font-medium ${scenario.impact.vat >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {scenario.impact.vat >= 0 ? '+' : ''}₺{scenario.impact.vat.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Nakit Etkisi</p>
                            <p className={`font-medium ${scenario.impact.cash >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {scenario.impact.cash >= 0 ? '+' : ''}₺{scenario.impact.cash.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Kâr Etkisi</p>
                            <p className={`font-medium ${scenario.impact.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {scenario.impact.profit >= 0 ? '+' : ''}₺{scenario.impact.profit.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Formül:</strong> {scenario.formula}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Reminders */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-white rounded-xl shadow-sm border p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hatırlatmalar ve Takvim</h3>
                  <div className="space-y-3">
                    {profitData.reminders.map((reminder, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">📅</span>
                          <div>
                            <p className="font-medium text-gray-900">{reminder.message}</p>
                            <p className="text-sm text-gray-500">{reminder.date}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          reminder.priority === 'high' ? 'bg-red-100 text-red-800' :
                          reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {reminder.priority === 'high' ? 'Yüksek' :
                           reminder.priority === 'medium' ? 'Orta' : 'Düşük'}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fiş/Fatura Yükle</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
            <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-indigo-600 text-2xl">📄</span>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">PDF veya JPG dosyalarını sürükleyin</p>
            <p className="text-sm text-gray-600 mb-4">veya dosya seçmek için tıklayın</p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Dosya Seç
            </button>
            <p className="text-xs text-gray-500 mt-2">OCR ile otomatik işleme</p>
          </div>
        </motion.div>

        {/* Guardrails Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
        >
          <div className="flex items-start">
            <span className="text-yellow-600 text-xl mr-3">⚠️</span>
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">Önemli Uyarı</h4>
              <p className="text-sm text-yellow-700">
                Bu araç vergi/muhasebe danışmanlığının yerini almaz; yalnızca bilgilendirme amaçlıdır. 
                Tüm öneriler bağımsız doğrulama gerektirir. Uygunsuz belge üretmez, yalnızca yüklenen/doğrulanan belgeleri işler.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </TDCMarketAdminLayout>
  );
}
