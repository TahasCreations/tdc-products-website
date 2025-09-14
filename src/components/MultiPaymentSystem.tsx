'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCardIcon, 
  BanknotesIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function MultiPaymentSystem() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: ChartBarIcon },
    { id: 'methods', name: 'Ödeme Yöntemleri', icon: CreditCardIcon },
    { id: 'transactions', name: 'İşlemler', icon: BanknotesIcon },
    { id: 'security', name: 'Güvenlik', icon: ShieldCheckIcon },
    { id: 'settings', name: 'Ayarlar', icon: CogIcon }
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
                    <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Toplam Gelir</p>
                    <p className="text-2xl font-bold text-gray-900">₺2,345,678</p>
                    <p className="text-sm text-green-600">+12.5%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-4">
                    <CreditCardIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Başarılı İşlemler</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                    <p className="text-sm text-green-600">+8.3%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg mr-4">
                    <BanknotesIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Başarısız İşlemler</p>
                    <p className="text-2xl font-bold text-gray-900">23</p>
                    <p className="text-sm text-red-600">-15.2%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-4">
                    <ChartBarIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Başarı Oranı</p>
                    <p className="text-2xl font-bold text-gray-900">98.2%</p>
                    <p className="text-sm text-green-600">+2.1%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'methods':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ödeme Yöntemleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Kredi Kartı</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                  </div>
                  <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Banka Transferi</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                  </div>
                  <p className="text-sm text-gray-600">EFT, Havale, IBAN</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Kripto Para</h4>
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Beta</span>
                  </div>
                  <p className="text-sm text-gray-600">Bitcoin, Ethereum, USDT</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Mobil Ödeme</h4>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Geliştiriliyor</span>
                  </div>
                  <p className="text-sm text-gray-600">Apple Pay, Google Pay</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Son İşlemler</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yöntem</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#12345</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ahmet Yılmaz</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₺1,250</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Kredi Kartı</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Başarılı</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#12346</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ayşe Demir</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₺890</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Banka Transferi</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Beklemede</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Güvenlik Ayarları</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">3D Secure</h4>
                    <p className="text-sm text-gray-600">Kredi kartı güvenliği</p>
                  </div>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Aktif</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">SSL Şifreleme</h4>
                    <p className="text-sm text-gray-600">Veri güvenliği</p>
                  </div>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Aktif</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Fraud Detection</h4>
                    <p className="text-sm text-gray-600">Dolandırıcılık tespiti</p>
                  </div>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Aktif</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Ayarları</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Otomatik İade</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Aktif</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Taksit Seçenekleri</span>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Aktif</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Komisyon Oranı</span>
                  <span className="text-gray-900 font-medium">2.9%</span>
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
          <h2 className="text-2xl font-bold text-gray-900">Çoklu Ödeme Sistemi</h2>
          <p className="text-sm text-gray-500 mt-1">Ödeme yöntemlerini ve işlemleri yönetin</p>
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