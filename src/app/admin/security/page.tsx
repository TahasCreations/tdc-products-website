'use client';

import { useState } from 'react';
import { 
  ShieldCheckIcon, 
  LockClosedIcon, 
  EyeIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import MultiFactorAuth from '../../../components/security/MultiFactorAuth';
import RoleBasedAccess from '../../../components/security/RoleBasedAccess';
import SecurityMonitoring from '../../../components/security/SecurityMonitoring';
import SecurityIssues from '../../../components/security/SecurityIssues';
import AdminProtection from '../../../components/AdminProtection';

export default function SecurityAdminPage() {
  const [activeTab, setActiveTab] = useState('issues');

  const tabs = [
    {
      id: 'issues',
      name: 'Güvenlik Sorunları',
      icon: ExclamationTriangleIcon,
      description: 'Kritik hatalar ve güvenlik açıkları'
    },
    {
      id: 'monitoring',
      name: 'Güvenlik İzleme',
      icon: EyeIcon,
      description: 'Güvenlik olayları ve tehdit tespiti'
    },
    {
      id: 'mfa',
      name: 'Çok Faktörlü Kimlik Doğrulama',
      icon: ShieldCheckIcon,
      description: 'MFA ayarları ve yönetimi'
    },
    {
      id: 'rbac',
      name: 'Rol Tabanlı Erişim',
      icon: UserGroupIcon,
      description: 'Kullanıcı rolleri ve izinleri'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'issues':
        return <SecurityIssues />;
      case 'monitoring':
        return <SecurityMonitoring />;
      case 'mfa':
        return <MultiFactorAuth />;
      case 'rbac':
        return <RoleBasedAccess />;
      default:
        return <SecurityIssues />;
    }
  };

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Güvenlik Yönetimi
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Enterprise güvenlik sistemleri ve tehdit yönetimi
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Güvenlik Durumu</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Güvenli
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600 dark:text-red-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Quick Security Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg mr-4">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Kritik Olaylar</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">3</p>
                  <p className="text-sm text-red-600 dark:text-red-400">+1 bugün</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg mr-4">
                  <BellIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aktif Uyarılar</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</p>
                  <p className="text-sm text-orange-600 dark:text-orange-400">-2 bugün</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                  <ShieldCheckIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">MFA Kullanıcıları</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">89%</p>
                  <p className="text-sm text-green-600 dark:text-green-400">+5% bu ay</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-4">
                  <LockClosedIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Güvenlik Skoru</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">94/100</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Mükemmel</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {renderTabContent()}
          </div>
        </div>

        {/* Security Recommendations */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Güvenlik Önerileri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center mb-2">
                  <ShieldCheckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    MFA Zorunluluğu
                  </h4>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Tüm yönetici hesapları için MFA&apos;yı zorunlu hale getirin.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center mb-2">
                  <KeyIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                  <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    Şifre Politikası
                  </h4>
                </div>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Şifre politikasını güçlendirin ve düzenli değişim zorunluluğu ekleyin.
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center mb-2">
                  <ChartBarIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                  <h4 className="text-sm font-medium text-green-900 dark:text-green-100">
                    İzleme Artırın
                  </h4>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Güvenlik izleme kapsamını genişletin ve otomatik uyarılar kurun.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtection>
  );
}
