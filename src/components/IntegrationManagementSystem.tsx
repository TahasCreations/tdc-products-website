'use client';

import { useState, useEffect } from 'react';
import { 
  LinkIcon, 
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  CloudIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import SocialMediaIntegrations from './admin/SocialMediaIntegrations';
import AccountSyncManager from './admin/AccountSyncManager';

export default function IntegrationManagementSystem() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: LinkIcon },
    { id: 'integrations', name: 'Entegrasyonlar', icon: CheckCircleIcon },
    { id: 'social-media', name: 'Sosyal Medya', icon: ShareIcon },
    { id: 'account-sync', name: 'Hesap Senkronizasyonu', icon: CloudIcon },
    { id: 'api', name: 'API Yönetimi', icon: PencilIcon },
    { id: 'logs', name: 'Loglar', icon: ArrowPathIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4">
                    <LinkIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Aktif Entegrasyon</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                    <p className="text-sm text-green-600">+1 bu hafta</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-4">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Başarılı Bağlantı</p>
                    <p className="text-2xl font-bold text-gray-900">7</p>
                    <p className="text-sm text-green-600">%87.5 başarı</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg mr-4">
                    <XCircleIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Başarısız Bağlantı</p>
                    <p className="text-2xl font-bold text-gray-900">1</p>
                    <p className="text-sm text-red-600">Dikkat Gerekli</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-4">
                    <ArrowPathIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Günlük İstek</p>
                    <p className="text-2xl font-bold text-gray-900">2,456</p>
                    <p className="text-sm text-green-600">+12% artış</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'integrations':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Entegrasyonlar</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="w-4 h-4 mr-2 inline" />
                  Yeni Entegrasyon
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Stripe Ödeme</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Kredi kartı ödemeleri için Stripe entegrasyonu</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Son test: 5 dakika önce</span>
                    <span>Durum: Başarılı</span>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">PayPal</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">PayPal ödeme sistemi entegrasyonu</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Son test: 10 dakika önce</span>
                    <span>Durum: Başarılı</span>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Kargo Entegrasyonu</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Aras Kargo API entegrasyonu</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Son test: 1 saat önce</span>
                    <span>Durum: Başarılı</span>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">E-posta Servisi</h4>
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Hata</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">SendGrid e-posta servisi entegrasyonu</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Son test: 2 saat önce</span>
                    <span>Durum: Bağlantı Hatası</span>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">SMS Servisi</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Netgsm SMS servisi entegrasyonu</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Son test: 30 dakika önce</span>
                    <span>Durum: Başarılı</span>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Analitik</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Google Analytics entegrasyonu</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Son test: 1 saat önce</span>
                    <span>Durum: Başarılı</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'social-media':
        return <SocialMediaIntegrations />;
      case 'account-sync':
        return <AccountSyncManager />;
      case 'api':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">API Yönetimi</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900">API Anahtarları</h4>
                      <p className="text-sm text-blue-700">Aktif API anahtarlarını yönetin</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Yönet
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-green-900">Rate Limiting</h4>
                      <p className="text-sm text-green-700">API istek limitlerini ayarlayın</p>
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Ayarla
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-purple-900">Webhook Yönetimi</h4>
                      <p className="text-sm text-purple-700">Webhook URL&apos;lerini yapılandırın</p>
                    </div>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      Yapılandır
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'logs':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Entegrasyon Logları</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entegrasyon</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zaman</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Süre</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Stripe</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ödeme İşlemi</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Başarılı</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5 dk önce</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1.2s</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Kargo</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Kargo Oluştur</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Başarılı</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15 dk önce</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2.8s</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">E-posta</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">E-posta Gönder</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Hata</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1 saat önce</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0.5s</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Entegrasyon Yönetim Sistemi</h2>
          <p className="text-sm text-gray-500 mt-1">Dış servisler ve API entegrasyonları</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">Sistem Aktif</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {renderTabContent()}
      </div>
    </div>
  );
}