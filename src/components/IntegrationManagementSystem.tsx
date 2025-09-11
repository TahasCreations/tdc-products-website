'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './Toast';

interface Integration {
  id: string;
  name: string;
  type: 'cargo' | 'bank' | 'e-invoice' | 'social' | 'payment' | 'email' | 'sms' | 'webhook';
  provider: string;
  status: 'active' | 'inactive' | 'error' | 'testing';
  apiKey?: string;
  apiSecret?: string;
  webhookUrl?: string;
  configuration: any;
  lastSync: string;
  syncFrequency: string;
  errorCount: number;
  successRate: number;
  description: string;
}

interface IntegrationLog {
  id: string;
  integrationId: string;
  integrationName: string;
  action: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  data?: any;
  timestamp: string;
  duration?: number;
}

interface WebhookEvent {
  id: string;
  integrationId: string;
  event: string;
  payload: any;
  status: 'pending' | 'processed' | 'failed';
  timestamp: string;
  retryCount: number;
}

export default function IntegrationManagementSystem() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [logs, setLogs] = useState<IntegrationLog[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'integrations' | 'logs' | 'webhooks' | 'settings'>('integrations');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showIntegrationSetup, setShowIntegrationSetup] = useState(false);
  const { addToast } = useToast();

  const fetchIntegrationData = useCallback(async () => {
    setLoading(true);
    try {
      const [integrationsResponse, logsResponse, webhooksResponse] = await Promise.all([
        fetch('/api/integrations'),
        fetch('/api/integrations/logs'),
        fetch('/api/integrations/webhooks')
      ]);

      const [integrationsData, logsData, webhooksData] = await Promise.all([
        integrationsResponse.json(),
        logsResponse.json(),
        webhooksResponse.json()
      ]);

      setIntegrations(integrationsData);
      setLogs(logsData);
      setWebhooks(webhooksData);
    } catch (error) {
      console.error('Integration fetch error:', error);
      addToast({
        type: 'error',
        title: 'Entegrasyon Hatası',
        message: 'Entegrasyon verileri yüklenirken hata oluştu'
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchIntegrationData();
  }, [fetchIntegrationData]);

  const testIntegration = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}/test`, {
        method: 'POST'
      });

      if (response.ok) {
        addToast({
          type: 'success',
          title: 'Test Başarılı',
          message: 'Entegrasyon testi başarıyla tamamlandı'
        });
        fetchIntegrationData();
      } else {
        addToast({
          type: 'error',
          title: 'Test Başarısız',
          message: 'Entegrasyon testi başarısız oldu'
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Test Hatası',
        message: 'Entegrasyon testi yapılamadı'
      });
    }
  };

  const syncIntegration = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}/sync`, {
        method: 'POST'
      });

      if (response.ok) {
        addToast({
          type: 'success',
          title: 'Senkronizasyon Başlatıldı',
          message: 'Entegrasyon senkronizasyonu başlatıldı'
        });
        fetchIntegrationData();
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Senkronizasyon Hatası',
        message: 'Senkronizasyon başlatılamadı'
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cargo': return 'ri-truck-line';
      case 'bank': return 'ri-bank-line';
      case 'e-invoice': return 'ri-file-text-line';
      case 'social': return 'ri-share-line';
      case 'payment': return 'ri-money-dollar-circle-line';
      case 'email': return 'ri-mail-line';
      case 'sms': return 'ri-message-line';
      case 'webhook': return 'ri-webhook-line';
      default: return 'ri-plug-line';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cargo': return 'text-blue-600 bg-blue-100';
      case 'bank': return 'text-green-600 bg-green-100';
      case 'e-invoice': return 'text-purple-600 bg-purple-100';
      case 'social': return 'text-pink-600 bg-pink-100';
      case 'payment': return 'text-yellow-600 bg-yellow-100';
      case 'email': return 'text-orange-600 bg-orange-100';
      case 'sms': return 'text-teal-600 bg-teal-100';
      case 'webhook': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'testing': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Entegrasyon verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <i className="ri-plug-line text-3xl text-blue-600 mr-3"></i>
            Entegrasyon Yönetimi
          </h2>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowIntegrationSetup(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              <i className="ri-add-line mr-2"></i>
              Yeni Entegrasyon
            </button>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'integrations', label: 'Entegrasyonlar', icon: 'ri-plug-line' },
            { key: 'logs', label: 'Loglar', icon: 'ri-file-list-line' },
            { key: 'webhooks', label: 'Webhook\'lar', icon: 'ri-webhook-line' },
            { key: 'settings', label: 'Ayarlar', icon: 'ri-settings-3-line' }
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                viewMode === mode.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className={`${mode.icon} mr-2`}></i>
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Integrations View */}
      {viewMode === 'integrations' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <i className="ri-plug-line text-2xl text-blue-600"></i>
                </div>
                <div className="text-sm font-medium text-blue-600">
                  Toplam
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {integrations.length}
              </div>
              <div className="text-sm text-gray-600">Entegrasyon</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <i className="ri-check-line text-2xl text-green-600"></i>
                </div>
                <div className="text-sm font-medium text-green-600">
                  Aktif
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {integrations.filter(i => i.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Çalışan</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <i className="ri-error-warning-line text-2xl text-red-600"></i>
                </div>
                <div className="text-sm font-medium text-red-600">
                  Hata
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {integrations.filter(i => i.status === 'error').length}
              </div>
              <div className="text-sm text-gray-600">Sorunlu</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <i className="ri-bar-chart-line text-2xl text-purple-600"></i>
                </div>
                <div className="text-sm font-medium text-purple-600">
                  Ortalama
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                %{Math.round(integrations.reduce((sum, i) => sum + i.successRate, 0) / integrations.length)}
              </div>
              <div className="text-sm text-gray-600">Başarı Oranı</div>
            </div>
          </div>

          {/* Integrations Grid */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Entegrasyonlar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.map((integration) => (
                <div key={integration.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${getTypeColor(integration.type)}`}>
                        <i className={`${getTypeIcon(integration.type)} text-lg`}></i>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{integration.name}</h4>
                        <p className="text-sm text-gray-500">{integration.provider}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                      {integration.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Son Senkronizasyon:</span>
                      <span className="font-medium">
                        {new Date(integration.lastSync).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sıklık:</span>
                      <span className="font-medium">{integration.syncFrequency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Başarı Oranı:</span>
                      <span className="font-medium">%{integration.successRate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Hata Sayısı:</span>
                      <span className={`font-medium ${integration.errorCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {integration.errorCount}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => testIntegration(integration.id)}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                      >
                        Test
                      </button>
                      <button
                        onClick={() => syncIntegration(integration.id)}
                        className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
                      >
                        Senkronize
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Logs View */}
      {viewMode === 'logs' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Entegrasyon Logları</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entegrasyon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksiyon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mesaj
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Süre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.slice(0, 20).map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.integrationName}</div>
                      <div className="text-sm text-gray-500">{log.integrationId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === 'success' ? 'bg-green-100 text-green-600' :
                        log.status === 'error' ? 'bg-red-100 text-red-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.duration ? `${log.duration}ms` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.timestamp).toLocaleString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Webhooks View */}
      {viewMode === 'webhooks' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Webhook Olayları</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entegrasyon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Olay
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tekrar Sayısı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksiyonlar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {webhooks.slice(0, 20).map((webhook) => (
                  <tr key={webhook.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {webhook.integrationId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {webhook.event}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        webhook.status === 'processed' ? 'bg-green-100 text-green-600' :
                        webhook.status === 'failed' ? 'bg-red-100 text-red-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {webhook.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {webhook.retryCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(webhook.timestamp).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Detay
                      </button>
                      {webhook.status === 'failed' && (
                        <button className="text-green-600 hover:text-green-900">
                          Tekrar Dene
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings View */}
      {viewMode === 'settings' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Entegrasyon Ayarları</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Genel Ayarlar</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Otomatik Senkronizasyon</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Hata Bildirimleri</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Log Saklama Süresi</span>
                    <span className="text-sm font-medium">30 gün</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Güvenlik</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Anahtarı Şifreleme</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Webhook Doğrulama</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">IP Kısıtlaması</span>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Performans</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Maksimum Retry</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Timeout Süresi</span>
                    <span className="text-sm font-medium">30 saniye</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Batch Boyutu</span>
                    <span className="text-sm font-medium">100</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Bildirimler</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">E-posta Bildirimleri</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SMS Bildirimleri</span>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Slack Bildirimleri</span>
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
