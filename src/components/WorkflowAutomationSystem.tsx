'use client';

import { useState, useEffect } from 'react';
import { 
  CogIcon, 
  PlayIcon,
  PauseIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export default function WorkflowAutomationSystem() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: CogIcon },
    { id: 'workflows', name: 'İş Akışları', icon: PlayIcon },
    { id: 'triggers', name: 'Tetikleyiciler', icon: CheckCircleIcon },
    { id: 'logs', name: 'Loglar', icon: PencilIcon }
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
                    <PlayIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Aktif İş Akışları</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-green-600">+2 bu hafta</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-4">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Başarılı Çalıştırma</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                    <p className="text-sm text-green-600">+156 bu gün</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg mr-4">
                    <XCircleIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Başarısız Çalıştırma</p>
                    <p className="text-2xl font-bold text-gray-900">23</p>
                    <p className="text-sm text-red-600">-5 bu gün</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-4">
                    <CogIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Başarı Oranı</p>
                    <p className="text-2xl font-bold text-gray-900">98.2%</p>
                    <p className="text-sm text-green-600">+1.2% artış</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'workflows':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">İş Akışları</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="w-4 h-4 mr-2 inline" />
                  Yeni İş Akışı
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Sipariş Onay İş Akışı</h4>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                      <button className="text-blue-600 hover:text-blue-900">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Yeni sipariş geldiğinde otomatik onay süreci</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Son çalıştırma: 5 dakika önce</span>
                    <span>Toplam çalıştırma: 1,247</span>
                    <span>Başarı oranı: 99.2%</span>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Stok Uyarı İş Akışı</h4>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                      <button className="text-blue-600 hover:text-blue-900">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Stok seviyesi düştüğünde otomatik uyarı</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Son çalıştırma: 1 saat önce</span>
                    <span>Toplam çalıştırma: 89</span>
                    <span>Başarı oranı: 100%</span>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Müşteri Takip İş Akışı</h4>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pasif</span>
                      <button className="text-blue-600 hover:text-blue-900">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Müşteri aktivitelerini takip etme</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Son çalıştırma: 2 gün önce</span>
                    <span>Toplam çalıştırma: 456</span>
                    <span>Başarı oranı: 97.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'triggers':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tetikleyiciler</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="w-4 h-4 mr-2 inline" />
                  Yeni Tetikleyici
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Yeni Sipariş</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Sipariş oluşturulduğunda tetiklenir</p>
                  <p className="text-xs text-gray-500">Son tetikleme: 5 dakika önce</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Stok Azalması</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Stok belirli seviyenin altına düştüğünde</p>
                  <p className="text-xs text-gray-500">Son tetikleme: 1 saat önce</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Yeni Müşteri</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Yeni müşteri kaydı oluşturulduğunda</p>
                  <p className="text-xs text-gray-500">Son tetikleme: 2 saat önce</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Ödeme Tamamlandı</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Ödeme başarıyla tamamlandığında</p>
                  <p className="text-xs text-gray-500">Son tetikleme: 10 dakika önce</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'logs':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İş Akışı Logları</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İş Akışı</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlangıç</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Süre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detay</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sipariş Onay</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Başarılı</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5 dk önce</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2.3s</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sipariş #12345 onaylandı</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Stok Uyarı</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Başarılı</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1 saat önce</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1.8s</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Naruto figürü stok uyarısı</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Müşteri Takip</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Hata</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2 saat önce</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0.5s</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">API bağlantı hatası</td>
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
          <h2 className="text-2xl font-bold text-gray-900">İş Akışı Otomasyon Sistemi</h2>
          <p className="text-sm text-gray-500 mt-1">Otomatik iş akışları ve süreç yönetimi</p>
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