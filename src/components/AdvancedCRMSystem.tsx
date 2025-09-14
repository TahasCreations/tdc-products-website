'use client';

import { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  ChartBarIcon,
  PhoneIcon,
  EnvelopeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function AdvancedCRMSystem() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: ChartBarIcon },
    { id: 'customers', name: 'Müşteriler', icon: UserGroupIcon },
    { id: 'leads', name: 'Potansiyel Müşteriler', icon: PhoneIcon },
    { id: 'communications', name: 'İletişim', icon: EnvelopeIcon }
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
                    <UserGroupIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Toplam Müşteri</p>
                    <p className="text-2xl font-bold text-gray-900">2,456</p>
                    <p className="text-sm text-green-600">+156 bu ay</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-4">
                    <PhoneIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Aktif Potansiyel</p>
                    <p className="text-2xl font-bold text-gray-900">89</p>
                    <p className="text-sm text-green-600">+12 bu hafta</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-4">
                    <EnvelopeIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bu Ay İletişim</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                    <p className="text-sm text-green-600">+23% artış</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                    <ChartBarIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dönüşüm Oranı</p>
                    <p className="text-2xl font-bold text-gray-900">23.5%</p>
                    <p className="text-sm text-green-600">+2.1% artış</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'customers':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Müşteri Listesi</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="w-4 h-4 mr-2 inline" />
                  Yeni Müşteri
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İletişim</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sipariş Sayısı</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toplam Harcama</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Ahmet Yılmaz</div>
                          <div className="text-sm text-gray-500">VIP Müşteri</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">ahmet@example.com</div>
                        <div className="text-sm text-gray-500">+90 555 123 4567</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₺4,250</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <PencilIcon className="w-4 h-4 inline" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 mr-3">
                          <PhoneIcon className="w-4 h-4 inline" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Ayşe Demir</div>
                          <div className="text-sm text-gray-500">Standart Müşteri</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">ayse@example.com</div>
                        <div className="text-sm text-gray-500">+90 555 987 6543</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₺1,890</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <PencilIcon className="w-4 h-4 inline" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 mr-3">
                          <PhoneIcon className="w-4 h-4 inline" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'leads':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Potansiyel Müşteriler</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="w-4 h-4 mr-2 inline" />
                  Yeni Potansiyel
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Mehmet Kaya</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Sıcak</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">mehmet@example.com</p>
                  <p className="text-sm text-gray-600 mb-2">+90 555 111 2233</p>
                  <p className="text-xs text-gray-500">Son İletişim: 2 gün önce</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Fatma Özkan</h4>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Ilımlı</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">fatma@example.com</p>
                  <p className="text-sm text-gray-600 mb-2">+90 555 444 5566</p>
                  <p className="text-xs text-gray-500">Son İletişim: 1 hafta önce</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Ali Veli</h4>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Soğuk</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">ali@example.com</p>
                  <p className="text-sm text-gray-600 mb-2">+90 555 777 8899</p>
                  <p className="text-xs text-gray-500">Son İletişim: 2 hafta önce</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'communications':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Geçmişi</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <PhoneIcon className="w-5 h-5 text-blue-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-blue-900">Telefon Görüşmesi</h4>
                      <p className="text-sm text-blue-700">Ahmet Yılmaz ile yapılan görüşme</p>
                      <p className="text-xs text-blue-600">2 gün önce - 15 dakika</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <EnvelopeIcon className="w-5 h-5 text-green-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-green-900">E-posta</h4>
                      <p className="text-sm text-green-700">Yeni ürün kataloğu gönderildi</p>
                      <p className="text-xs text-green-600">3 gün önce</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start">
                    <EnvelopeIcon className="w-5 h-5 text-purple-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-purple-900">SMS</h4>
                      <p className="text-sm text-purple-700">Kampanya bilgilendirmesi</p>
                      <p className="text-xs text-purple-600">1 hafta önce</p>
                    </div>
                  </div>
                </div>
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
          <h2 className="text-2xl font-bold text-gray-900">Gelişmiş CRM Sistemi</h2>
          <p className="text-sm text-gray-500 mt-1">Müşteri ilişkileri yönetimi</p>
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