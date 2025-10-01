'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'general', label: 'Genel', icon: '⚙️' },
    { id: 'ecommerce', label: 'E-Ticaret', icon: '🛒' },
    { id: 'email', label: 'E-posta', icon: '📧' },
    { id: 'payment', label: 'Ödeme', icon: '💳' },
    { id: 'shipping', label: 'Kargo', icon: '🚚' },
    { id: 'security', label: 'Güvenlik', icon: '🔒' }
  ];

  const [settings, setSettings] = useState({
    general: {
      siteName: 'TDC Products',
      siteDescription: 'Premium Figür & Koleksiyon Dünyası',
      siteUrl: 'https://tdcproducts.com',
      adminEmail: 'admin@tdcproducts.com',
      timezone: 'Europe/Istanbul',
      language: 'tr',
      currency: 'TRY',
      maintenanceMode: false
    },
    ecommerce: {
      enableCart: true,
      enableWishlist: true,
      enableReviews: true,
      enableCoupons: true,
      taxRate: 18,
      minOrderAmount: 100,
      freeShippingThreshold: 500,
      inventoryTracking: true
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'noreply@tdcproducts.com',
      smtpPassword: '••••••••',
      fromName: 'TDC Products',
      fromEmail: 'noreply@tdcproducts.com',
      enableNotifications: true
    },
    payment: {
      stripeEnabled: true,
      stripePublishableKey: 'pk_test_...',
      stripeSecretKey: 'sk_test_...',
      paypalEnabled: true,
      paypalClientId: '••••••••',
      bankTransferEnabled: true,
      cashOnDelivery: true
    },
    shipping: {
      defaultShippingCost: 25,
      freeShippingEnabled: true,
      freeShippingThreshold: 500,
      shippingZones: [
        { name: 'İstanbul', cost: 15 },
        { name: 'Ankara', cost: 20 },
        { name: 'İzmir', cost: 20 },
        { name: 'Diğer', cost: 25 }
      ]
    },
    security: {
      twoFactorAuth: false,
      loginAttempts: 5,
      sessionTimeout: 24,
      passwordMinLength: 8,
      requireStrongPassword: true,
      enableCSP: true,
      enableHSTS: true
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    // Show success message
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Adı</label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
          <input
            type="url"
            value={settings.general.siteUrl}
            onChange={(e) => handleInputChange('general', 'siteUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Site Açıklaması</label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Zaman Dilimi</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="Europe/Istanbul">İstanbul (GMT+3)</option>
            <option value="Europe/London">Londra (GMT+0)</option>
            <option value="America/New_York">New York (GMT-5)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dil</label>
          <select
            value={settings.general.language}
            onChange={(e) => handleInputChange('general', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Para Birimi</label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="TRY">₺ Türk Lirası</option>
            <option value="USD">$ US Dollar</option>
            <option value="EUR">€ Euro</option>
          </select>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="maintenanceMode"
          checked={settings.general.maintenanceMode}
          onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
          Bakım modunu etkinleştir
        </label>
      </div>
    </div>
  );

  const renderEcommerceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableCart"
              checked={settings.ecommerce.enableCart}
              onChange={(e) => handleInputChange('ecommerce', 'enableCart', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="enableCart" className="ml-2 block text-sm text-gray-900">
              Sepet özelliğini etkinleştir
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableWishlist"
              checked={settings.ecommerce.enableWishlist}
              onChange={(e) => handleInputChange('ecommerce', 'enableWishlist', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="enableWishlist" className="ml-2 block text-sm text-gray-900">
              İstek listesi özelliğini etkinleştir
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableReviews"
              checked={settings.ecommerce.enableReviews}
              onChange={(e) => handleInputChange('ecommerce', 'enableReviews', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="enableReviews" className="ml-2 block text-sm text-gray-900">
              Yorum özelliğini etkinleştir
            </label>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">KDV Oranı (%)</label>
            <input
              type="number"
              value={settings.ecommerce.taxRate}
              onChange={(e) => handleInputChange('ecommerce', 'taxRate', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Sipariş Tutarı (₺)</label>
            <input
              type="number"
              value={settings.ecommerce.minOrderAmount}
              onChange={(e) => handleInputChange('ecommerce', 'minOrderAmount', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ücretsiz Kargo Eşiği (₺)</label>
            <input
              type="number"
              value={settings.ecommerce.freeShippingThreshold}
              onChange={(e) => handleInputChange('ecommerce', 'freeShippingThreshold', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'ecommerce':
        return renderEcommerceSettings();
      case 'email':
        return <div className="text-center py-8 text-gray-500">E-posta ayarları yakında...</div>;
      case 'payment':
        return <div className="text-center py-8 text-gray-500">Ödeme ayarları yakında...</div>;
      case 'shipping':
        return <div className="text-center py-8 text-gray-500">Kargo ayarları yakında...</div>;
      case 'security':
        return <div className="text-center py-8 text-gray-500">Güvenlik ayarları yakında...</div>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
            <p className="text-gray-600">Site ve sistem ayarlarını yönetin</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSaving ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Kaydet
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
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

          {/* Tab Content */}
          <div className="p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Durumu</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Web Sitesi</p>
                <p className="text-sm text-gray-600">Çevrimiçi</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Veritabanı</p>
                <p className="text-sm text-gray-600">Çevrimiçi</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">E-posta Servisi</p>
                <p className="text-sm text-gray-600">Bakımda</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
