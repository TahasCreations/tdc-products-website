'use client';

import { useState, useEffect } from 'react';
import { 
  CubeIcon, 
  ChartBarIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function AdvancedInventoryManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: ChartBarIcon },
    { id: 'products', name: 'Ürünler', icon: CubeIcon },
    { id: 'stock', name: 'Stok Durumu', icon: ExclamationTriangleIcon },
    { id: 'suppliers', name: 'Tedarikçiler', icon: PlusIcon }
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
                    <CubeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Toplam Ürün</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                    <p className="text-sm text-green-600">+23 ürün</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-4">
                    <ChartBarIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Stok Değeri</p>
                    <p className="text-2xl font-bold text-gray-900">₺2,345,678</p>
                    <p className="text-sm text-green-600">+12.5%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg mr-4">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Düşük Stok</p>
                    <p className="text-2xl font-bold text-gray-900">23</p>
                    <p className="text-sm text-red-600">Dikkat Gerekli</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-4">
                    <PlusIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tedarikçi</p>
                    <p className="text-2xl font-bold text-gray-900">45</p>
                    <p className="text-sm text-green-600">+3 yeni</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ürün Listesi</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="w-4 h-4 mr-2 inline" />
                  Yeni Ürün
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Naruto Figürü</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Anime</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">45</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₺299</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <PencilIcon className="w-4 h-4 inline" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Goku Figürü</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Anime</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">32</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₺349</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <PencilIcon className="w-4 h-4 inline" />
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
      case 'stock':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stok Durumu</h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                    <div>
                      <h4 className="font-medium text-red-900">Düşük Stok Uyarısı</h4>
                      <p className="text-sm text-red-700">23 ürün kritik stok seviyesinde</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-2" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Orta Seviye Uyarı</h4>
                      <p className="text-sm text-yellow-700">67 ürün orta stok seviyesinde</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <ChartBarIcon className="w-5 h-5 text-green-500 mr-2" />
                    <div>
                      <h4 className="font-medium text-green-900">Yeterli Stok</h4>
                      <p className="text-sm text-green-700">1,157 ürün yeterli stok seviyesinde</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'suppliers':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tedarikçi Listesi</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="w-4 h-4 mr-2 inline" />
                  Yeni Tedarikçi
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Anime Figür Ltd.</h4>
                  <p className="text-sm text-gray-600 mb-2">İletişim: info@animefigur.com</p>
                  <p className="text-sm text-gray-600">Ürün Sayısı: 245</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Gaming World</h4>
                  <p className="text-sm text-gray-600 mb-2">İletişim: contact@gamingworld.com</p>
                  <p className="text-sm text-gray-600">Ürün Sayısı: 189</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Collector&apos;s Choice</h4>
                  <p className="text-sm text-gray-600 mb-2">İletişim: sales@collectors.com</p>
                  <p className="text-sm text-gray-600">Ürün Sayısı: 156</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Gelişmiş Envanter Yönetimi</h2>
          <p className="text-sm text-gray-500 mt-1">Stok, ürün ve tedarikçi yönetimi</p>
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