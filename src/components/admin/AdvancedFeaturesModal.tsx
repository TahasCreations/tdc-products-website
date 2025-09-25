'use client';

import { useState } from 'react';
import { XMarkIcon, Cog6ToothIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface AdvancedFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  onSave: (settings: any) => void;
}

interface FeatureSettings {
  [key: string]: {
    enabled: boolean;
    settings: Record<string, any>;
  };
}

const defaultSettings: FeatureSettings = {
  'ai-recommendations': {
    enabled: true,
    settings: {
      accuracy: 87.3,
      algorithm: 'collaborative',
      minRecommendations: 3,
      maxRecommendations: 10,
      updateFrequency: 'daily',
      userSegmentation: true,
      productCategories: ['electronics', 'clothing', 'books'],
      excludeOutOfStock: true
    }
  },
  'price-optimization': {
    enabled: true,
    settings: {
      profitIncrease: 23.5,
      strategy: 'demand-based',
      competitorTracking: true,
      dynamicPricing: true,
      priceRange: { min: 0.8, max: 1.2 },
      updateFrequency: 'hourly',
      categories: ['electronics', 'fashion'],
      excludeCategories: ['books']
    }
  },
  'advanced-analytics': {
    enabled: true,
    settings: {
      reportCount: 156,
      dataRetention: 365,
      realTimeUpdates: true,
      customMetrics: true,
      exportFormats: ['pdf', 'excel', 'csv'],
      scheduledReports: true,
      alertThresholds: true,
      integrationAPIs: ['google-analytics', 'facebook-pixel']
    }
  },
  'automation': {
    enabled: false,
    settings: {
      ruleCount: 23,
      status: 'test',
      workflows: [
        { name: 'Low Stock Alert', active: true },
        { name: 'Price Change Notification', active: true },
        { name: 'Customer Welcome Email', active: false },
        { name: 'Order Status Update', active: true }
      ],
      triggers: ['inventory', 'pricing', 'customer', 'order'],
      actions: ['email', 'sms', 'webhook', 'notification']
    }
  },
  'customer-segmentation': {
    enabled: true,
    settings: {
      segmentCount: 8,
      autoSegmentation: true,
      criteria: ['purchase_history', 'behavior', 'demographics', 'engagement'],
      segments: [
        { name: 'VIP Customers', count: 245, active: true },
        { name: 'Frequent Buyers', count: 1234, active: true },
        { name: 'New Customers', count: 567, active: true },
        { name: 'At Risk', count: 89, active: true }
      ],
      personalization: true,
      targetedCampaigns: true
    }
  },
  'security': {
    enabled: true,
    settings: {
      securityScore: 98,
      features: {
        twoFactorAuth: true,
        sslEncryption: true,
        dataBackup: true,
        fraudDetection: true,
        accessControl: true,
        auditLogging: true
      },
      compliance: ['GDPR', 'PCI-DSS', 'SOX'],
      monitoring: true,
      alertSystem: true,
      penetrationTesting: 'monthly'
    }
  }
};

export default function AdvancedFeaturesModal({ isOpen, onClose, feature, onSave }: AdvancedFeaturesModalProps) {
  const [settings, setSettings] = useState(defaultSettings[feature] || { enabled: false, settings: {} });
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave({ [feature]: settings });
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderFeatureSettings = () => {
    switch (feature) {
      case 'ai-recommendations':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doğruluk Oranı (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.settings.accuracy}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    settings: { ...prev.settings, accuracy: parseFloat(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Algoritma
                </label>
                <select
                  value={settings.settings.algorithm}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    settings: { ...prev.settings, algorithm: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="collaborative">İşbirlikçi Filtreleme</option>
                  <option value="content-based">İçerik Tabanlı</option>
                  <option value="hybrid">Hibrit</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Öneri Sayısı
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.settings.minRecommendations}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    settings: { ...prev.settings, minRecommendations: parseInt(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maksimum Öneri Sayısı
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.settings.maxRecommendations}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    settings: { ...prev.settings, maxRecommendations: parseInt(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="userSegmentation"
                  checked={settings.settings.userSegmentation}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    settings: { ...prev.settings, userSegmentation: e.target.checked }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="userSegmentation" className="ml-2 block text-sm text-gray-900">
                  Kullanıcı Segmentasyonu
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="excludeOutOfStock"
                  checked={settings.settings.excludeOutOfStock}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    settings: { ...prev.settings, excludeOutOfStock: e.target.checked }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="excludeOutOfStock" className="ml-2 block text-sm text-gray-900">
                  Stokta Olmayan Ürünleri Hariç Tut
                </label>
              </div>
            </div>
          </div>
        );

      case 'price-optimization':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kar Artış Hedefi (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.settings.profitIncrease}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    settings: { ...prev.settings, profitIncrease: parseFloat(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strateji
                </label>
                <select
                  value={settings.settings.strategy}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    settings: { ...prev.settings, strategy: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="demand-based">Talep Tabanlı</option>
                  <option value="competitor-based">Rakip Tabanlı</option>
                  <option value="time-based">Zaman Tabanlı</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="competitorTracking"
                  checked={settings.settings.competitorTracking}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    settings: { ...prev.settings, competitorTracking: e.target.checked }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="competitorTracking" className="ml-2 block text-sm text-gray-900">
                  Rakiplerin Fiyatlarını Takip Et
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="dynamicPricing"
                  checked={settings.settings.dynamicPricing}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    settings: { ...prev.settings, dynamicPricing: e.target.checked }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="dynamicPricing" className="ml-2 block text-sm text-gray-900">
                  Dinamik Fiyatlandırma
                </label>
              </div>
            </div>
          </div>
        );

      case 'automation':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">İş Akışları</h4>
              {settings.settings.workflows?.map((workflow: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-900">{workflow.name}</h5>
                    <p className="text-sm text-gray-600">Otomatik iş akışı</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      workflow.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {workflow.active ? 'Aktif' : 'Pasif'}
                    </span>
                    <button
                      onClick={() => {
                        const newWorkflows = [...settings.settings.workflows];
                        newWorkflows[index].active = !newWorkflows[index].active;
                        setSettings(prev => ({
                          ...prev,
                          settings: { ...prev.settings, workflows: newWorkflows }
                        }));
                      }}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        workflow.active 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {workflow.active ? 'Deaktif Et' : 'Aktif Et'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'customer-segmentation':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Müşteri Segmentleri</h4>
              {settings.settings.segments?.map((segment: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-900">{segment.name}</h5>
                    <p className="text-sm text-gray-600">{segment.count} müşteri</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      segment.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {segment.active ? 'Aktif' : 'Pasif'}
                    </span>
                    <button
                      onClick={() => {
                        const newSegments = [...settings.settings.segments];
                        newSegments[index].active = !newSegments[index].active;
                        setSettings(prev => ({
                          ...prev,
                          settings: { ...prev.settings, segments: newSegments }
                        }));
                      }}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        segment.active 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {segment.active ? 'Deaktif Et' : 'Aktif Et'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Güvenlik Skoru
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.settings.securityScore}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        settings: { ...prev.settings, securityScore: parseInt(e.target.value) }
                      }))}
                      className="w-full"
                    />
                  </div>
                  <span className="text-lg font-bold text-indigo-600 w-12 text-right">
                    {settings.settings.securityScore}/100
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Güvenlik Özellikleri</h4>
              {Object.entries(settings.settings.features || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <input
                    type="checkbox"
                    checked={value as boolean}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        features: {
                          ...prev.settings.features,
                          [key]: e.target.checked
                        }
                      }
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Bu özellik için ayarlar henüz mevcut değil.</p>
          </div>
        );
    }
  };

  const getFeatureTitle = () => {
    const titles: Record<string, string> = {
      'ai-recommendations': 'AI Önerileri Ayarları',
      'price-optimization': 'Fiyat Optimizasyonu Ayarları',
      'advanced-analytics': 'Gelişmiş Analitik Ayarları',
      'automation': 'Otomasyon Ayarları',
      'customer-segmentation': 'Müşteri Segmentasyonu Ayarları',
      'security': 'Güvenlik Ayarları'
    };
    return titles[feature] || 'Özellik Ayarları';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Cog6ToothIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">{getFeatureTitle()}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Özellik Durumu</h3>
                <p className="text-sm text-gray-600">Bu özelliği aktif veya pasif hale getirin</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  settings.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {settings.enabled ? 'Aktif' : 'Pasif'}
                </span>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    settings.enabled 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {settings.enabled ? 'Deaktif Et' : 'Aktif Et'}
                </button>
              </div>
            </div>
          </div>

          {settings.enabled && renderFeatureSettings()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Kaydediliyor...</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-4 h-4" />
                <span>Kaydet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
