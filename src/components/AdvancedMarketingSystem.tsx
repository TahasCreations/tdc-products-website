'use client';

import { useState, useEffect } from 'react';
import { 
  MegaphoneIcon, 
  ChartBarIcon, 
  EnvelopeIcon, 
  ShareIcon,
  CogIcon,
  CameraIcon,
  TagIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function AdvancedMarketingSystem() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: ChartBarIcon },
    { id: 'campaigns', name: 'Kampanyalar', icon: MegaphoneIcon },
    { id: 'email', name: 'E-posta Pazarlama', icon: EnvelopeIcon },
    { id: 'social', name: 'Sosyal Medya', icon: ShareIcon },
    { id: 'content', name: 'İçerik Yönetimi', icon: CameraIcon },
    { id: 'seo', name: 'SEO & Analytics', icon: TagIcon },
    { id: 'leads', name: 'Potansiyel Müşteriler', icon: UserGroupIcon },
    { id: 'settings', name: 'Ayarlar', icon: CogIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Toplam Kampanya</h4>
                <p className="text-3xl font-bold text-blue-600">24</p>
                <p className="text-sm text-blue-700">+3 bu ay</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">E-posta Açılma Oranı</h4>
                <p className="text-3xl font-bold text-green-600">%23.4</p>
                <p className="text-sm text-green-700">+2.1% artış</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Sosyal Medya Takipçi</h4>
                <p className="text-3xl font-bold text-yellow-600">12.5K</p>
                <p className="text-sm text-yellow-700">+850 bu hafta</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">ROI</h4>
                <p className="text-3xl font-bold text-purple-600">%340</p>
                <p className="text-sm text-purple-700">+15% artış</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktif Kampanyalar</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Yılbaşı İndirimi</p>
                      <p className="text-sm text-blue-700">E-posta kampanyası</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Aktif</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Sosyal Medya Boost</p>
                      <p className="text-sm text-green-700">Instagram & Facebook</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Aktif</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-900">SEO Optimizasyonu</p>
                      <p className="text-sm text-yellow-700">Google Ads</p>
                    </div>
                    <span className="text-sm text-yellow-600 font-medium">Beklemede</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Performans</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">E-posta Gönderimi</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                      <span className="text-sm font-semibold">75%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sosyal Medya Etkileşim</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                      <span className="text-sm font-semibold">60%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Web Sitesi Trafiği</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <span className="text-sm font-semibold">85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'campaigns':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Kampanya Yönetimi</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Yeni Kampanya Oluştur
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">E-posta Kampanyaları</h4>
                  <span className="text-sm text-blue-600 font-medium">8 Aktif</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">Yılbaşı İndirimi</p>
                    <p className="text-sm text-blue-700">2,500 gönderim</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-900">Ürün Lansmanı</p>
                    <p className="text-sm text-green-700">1,800 gönderim</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Sosyal Medya</h4>
                  <span className="text-sm text-green-600 font-medium">5 Aktif</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="font-medium text-purple-900">Instagram Story</p>
                    <p className="text-sm text-purple-700">15K görüntülenme</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="font-medium text-yellow-900">Facebook Post</p>
                    <p className="text-sm text-yellow-700">8K etkileşim</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Google Ads</h4>
                  <span className="text-sm text-orange-600 font-medium">3 Aktif</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="font-medium text-orange-900">Arama Reklamları</p>
                    <p className="text-sm text-orange-700">₺2,500 harcama</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="font-medium text-red-900">Display Reklamları</p>
                    <p className="text-sm text-red-700">₺1,800 harcama</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">E-posta Pazarlama</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Yeni E-posta Gönder
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Toplam Gönderim</h4>
                <p className="text-3xl font-bold text-blue-600">12,450</p>
                <p className="text-sm text-blue-700">Bu ay</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Açılma Oranı</h4>
                <p className="text-3xl font-bold text-green-600">%23.4</p>
                <p className="text-sm text-green-700">+2.1% artış</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Tıklama Oranı</h4>
                <p className="text-3xl font-bold text-yellow-600">%4.2</p>
                <p className="text-sm text-yellow-700">+0.8% artış</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Dönüşüm Oranı</h4>
                <p className="text-3xl font-bold text-purple-600">%1.8</p>
                <p className="text-sm text-purple-700">+0.3% artış</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Son E-posta Kampanyaları</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kampanya
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gönderim
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Açılma
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tıklama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Yılbaşı İndirimi
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2,500
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        %25.2
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        %4.8
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Tamamlandı
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Ürün Lansmanı
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        1,800
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        %22.1
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        %3.9
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Gönderiliyor
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Sosyal Medya Yönetimi</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Yeni Post Oluştur
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Instagram</h4>
                  <span className="text-sm text-pink-600 font-medium">@company</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Takipçi</span>
                    <span className="font-semibold">8.5K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Etkileşim</span>
                    <span className="font-semibold">%4.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Son Post</span>
                    <span className="font-semibold">2 saat önce</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Facebook</h4>
                  <span className="text-sm text-blue-600 font-medium">@company</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Beğeni</span>
                    <span className="font-semibold">4.2K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Etkileşim</span>
                    <span className="font-semibold">%3.8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Son Post</span>
                    <span className="font-semibold">5 saat önce</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Twitter</h4>
                  <span className="text-sm text-blue-400 font-medium">@company</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Takipçi</span>
                    <span className="font-semibold">2.1K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Etkileşim</span>
                    <span className="font-semibold">%2.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Son Tweet</span>
                    <span className="font-semibold">1 gün önce</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{tabs.find(tab => tab.id === activeTab)?.name}</h3>
            <p className="text-gray-600">Bu modül geliştirilme aşamasındadır.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pazarlama Sistemi</h2>
          <p className="text-sm text-gray-500 mt-1">Kampanya yönetimi ve pazarlama süreçleri</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">Sistem Aktif</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
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
