'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { 
  ChartBarIcon, 
  ClockIcon, 
  ArrowTrendingUpIcon, 
  EyeIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import RealTimeDashboard from '../../../components/analytics/RealTimeDashboard';
import PredictiveAnalytics from '../../../components/analytics/PredictiveAnalytics';
import BusinessIntelligence from '../../../components/analytics/BusinessIntelligence';
import CustomReports from '../../../components/analytics/CustomReports';
import AdminProtection from '../../../components/AdminProtection';

export default function AnalyticsAdminPage() {
  const [activeTab, setActiveTab] = useState('realtime');

  const tabs = [
    {
      id: 'realtime',
      name: 'Real-Time Dashboard',
      icon: ClockIcon,
      description: 'Canlı veriler ve anlık metrikler'
    },
    {
      id: 'predictive',
      name: 'Tahmine Dayalı Analiz',
      icon: ArrowTrendingUpIcon,
      description: 'AI destekli gelecek tahminleri'
    },
    {
      id: 'business',
      name: 'İş Zekası',
      icon: ChartBarIcon,
      description: 'Kapsamlı iş analitikleri'
    },
    {
      id: 'reports',
      name: 'Özel Raporlar',
      icon: EyeIcon,
      description: 'Özelleştirilmiş raporlar'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'realtime':
        return <RealTimeDashboard />;
      case 'predictive':
        return <PredictiveAnalytics />;
      case 'business':
        return <BusinessIntelligence />;
      case 'reports':
        return <CustomReports />;
      default:
        return <RealTimeDashboard />;
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
                  Analitik Yönetimi
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Gelişmiş analitik ve raporlama sistemleri
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Son Güncelleme</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {new Date().toLocaleString('tr-TR')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-white" />
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
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
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

        {/* Quick Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                  <EyeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Görüntüleme</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1,234,567</p>
                  <p className="text-sm text-green-600 dark:text-green-400">+12.5%</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-4">
                  <UserGroupIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aktif Kullanıcı</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">45,678</p>
                  <p className="text-sm text-green-600 dark:text-green-400">+8.3%</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg mr-4">
                  <ShoppingCartIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Sipariş</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">12,345</p>
                  <p className="text-sm text-green-600 dark:text-green-400">+15.2%</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg mr-4">
                  <CurrencyDollarIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Gelir</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">₺2,345,678</p>
                  <p className="text-sm text-green-600 dark:text-green-400">+18.7%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {renderTabContent()}
          </div>
        </div>

        {/* System Status */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Sistem Durumu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                  <ChartBarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Analitik Motoru</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Çalışıyor</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">AI Modelleri</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Aktif</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg mr-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Veri Güncelleme</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Gecikme Var</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtection>
  );
}