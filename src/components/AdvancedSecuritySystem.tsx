'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  LockClosedIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

export default function AdvancedSecuritySystem() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: ShieldCheckIcon },
    { id: 'monitoring', name: 'Güvenlik İzleme', icon: EyeIcon },
    { id: 'access', name: 'Erişim Kontrolü', icon: LockClosedIcon },
    { id: 'alerts', name: 'Güvenlik Uyarıları', icon: ExclamationTriangleIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-4">
                    <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Güvenlik Skoru</p>
                    <p className="text-2xl font-bold text-gray-900">94/100</p>
                    <p className="text-sm text-green-600">Mükemmel</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4">
                    <UserGroupIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Aktif Oturumlar</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                    <p className="text-sm text-green-600">+12 bu saat</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg mr-4">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Güvenlik Uyarısı</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                    <p className="text-sm text-red-600">Dikkat Gerekli</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-4">
                    <KeyIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">MFA Kullanıcıları</p>
                    <p className="text-2xl font-bold text-gray-900">89%</p>
                    <p className="text-sm text-green-600">+5% bu ay</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'monitoring':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Güvenlik İzleme</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <ShieldCheckIcon className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <h4 className="font-medium text-green-900">Sistem Durumu</h4>
                      <p className="text-sm text-green-700">Tüm güvenlik sistemleri aktif ve çalışıyor</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <EyeIcon className="w-5 h-5 text-blue-500 mr-3" />
                    <div>
                      <h4 className="font-medium text-blue-900">İzleme Kapsamı</h4>
                      <p className="text-sm text-blue-700">Tüm sistem aktiviteleri 7/24 izleniyor</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-3" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Son Tarama</h4>
                      <p className="text-sm text-yellow-700">2 saat önce - 0 tehdit tespit edildi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'access':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Erişim Kontrolü</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Admin Erişimi</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                  </div>
                  <p className="text-sm text-gray-600">Yönetici paneli erişim kontrolü</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">API Erişimi</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                  </div>
                  <p className="text-sm text-gray-600">API endpoint güvenliği</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Veritabanı Erişimi</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                  </div>
                  <p className="text-sm text-gray-600">Veritabanı güvenlik katmanları</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Dosya Erişimi</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Aktif</span>
                  </div>
                  <p className="text-sm text-gray-600">Dosya yükleme güvenliği</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'alerts':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Güvenlik Uyarıları</h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-red-900">Kritik Uyarı</h4>
                      <p className="text-sm text-red-700">Şüpheli giriş denemesi tespit edildi</p>
                      <p className="text-xs text-red-600">2 saat önce - IP: 192.168.1.100</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Orta Seviye Uyarı</h4>
                      <p className="text-sm text-yellow-700">Olağandışı veri erişim kalıbı</p>
                      <p className="text-xs text-yellow-600">4 saat önce - Kullanıcı: admin@example.com</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="w-5 h-5 text-blue-500 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-blue-900">Bilgi Uyarısı</h4>
                      <p className="text-sm text-blue-700">Güvenlik taraması tamamlandı</p>
                      <p className="text-xs text-blue-600">6 saat önce - Sistem otomatik</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Gelişmiş Güvenlik Sistemi</h2>
          <p className="text-sm text-gray-500 mt-1">Enterprise güvenlik yönetimi</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">Sistem Güvenli</span>
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