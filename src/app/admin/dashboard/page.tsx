'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import LanguageSelector, { useLanguage } from '@/components/LanguageSelector';
import PerformanceMonitor from '@/components/PerformanceMonitor';

// Lazy load heavy components for better performance
const AdvancedAISystem = lazy(() => import('@/components/AdvancedAISystem'));
const MultiPaymentSystem = lazy(() => import('@/components/MultiPaymentSystem'));
const AdvancedAnalyticsDashboard = lazy(() => import('@/components/AdvancedAnalyticsDashboard'));
const AdvancedInventoryManagement = lazy(() => import('@/components/AdvancedInventoryManagement'));
const AdvancedCRMSystem = lazy(() => import('@/components/AdvancedCRMSystem'));
const AdvancedSecuritySystem = lazy(() => import('@/components/AdvancedSecuritySystem'));
const WorkflowAutomationSystem = lazy(() => import('@/components/WorkflowAutomationSystem'));
const IntegrationManagementSystem = lazy(() => import('@/components/IntegrationManagementSystem'));

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { language, changeLanguage, t } = useLanguage();

  const tabs = [
    { id: 'overview', label: t('navigation.dashboard'), icon: 'ri-dashboard-line' },
    { id: 'ai', label: t('ai.chatbot'), icon: 'ri-brain-line' },
    { id: 'payments', label: t('payment.paymentMethod'), icon: 'ri-money-dollar-circle-line' },
    { id: 'analytics', label: t('business.analytics'), icon: 'ri-bar-chart-line' },
    { id: 'inventory', label: t('business.inventory'), icon: 'ri-box-3-line' },
    { id: 'crm', label: t('business.crm'), icon: 'ri-user-heart-line' },
    { id: 'security', label: t('business.security'), icon: 'ri-shield-check-line' },
    { id: 'workflows', label: 'İş Akışları', icon: 'ri-flow-chart' },
    { id: 'integrations', label: 'Entegrasyonlar', icon: 'ri-plug-line' }
  ];

  const renderTabContent = () => {
    const LoadingSpinner = () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

    switch (activeTab) {
      case 'ai':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdvancedAISystem />
          </Suspense>
        );
      case 'payments':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <MultiPaymentSystem />
          </Suspense>
        );
      case 'analytics':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdvancedAnalyticsDashboard />
          </Suspense>
        );
      case 'inventory':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdvancedInventoryManagement />
          </Suspense>
        );
      case 'crm':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdvancedCRMSystem />
          </Suspense>
        );
      case 'security':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdvancedSecuritySystem />
          </Suspense>
        );
      case 'workflows':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <WorkflowAutomationSystem />
          </Suspense>
        );
      case 'integrations':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <IntegrationManagementSystem />
          </Suspense>
        );
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="mr-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors group"
                title="Önceki sayfaya dön"
              >
                <i className="ri-close-line text-lg text-gray-600 group-hover:text-red-600 transition-colors"></i>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('business.dashboard')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={changeLanguage}
                compact={true}
              />
              
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Sistem Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={tab.icon}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
}

function OverviewDashboard() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Hoş Geldiniz! 🚀
            </h2>
            <p className="text-blue-100 text-lg">
              En gelişmiş AI destekli iş yönetim sisteminize hoş geldiniz
            </p>
          </div>
          <div className="text-6xl">🎯</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <i className="ri-line-chart-line text-2xl text-blue-600"></i>
            </div>
            <div className="text-sm font-medium text-blue-600">
              +12.5%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            ₺125,430
          </div>
          <div className="text-sm text-gray-600">Bu Ay Satış</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <i className="ri-user-line text-2xl text-green-600"></i>
            </div>
            <div className="text-sm font-medium text-green-600">
              +8.2%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            1,247
          </div>
          <div className="text-sm text-gray-600">Aktif Müşteri</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <i className="ri-box-3-line text-2xl text-purple-600"></i>
            </div>
            <div className="text-sm font-medium text-purple-600">
              -3.1%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            892
          </div>
          <div className="text-sm text-gray-600">Stok Ürün</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <i className="ri-money-dollar-circle-line text-2xl text-orange-600"></i>
            </div>
            <div className="text-sm font-medium text-orange-600">
              +15.3%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            ₺45,230
          </div>
          <div className="text-sm text-gray-600">Bu Ay Gelir</div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Sistem Durumu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <i className="ri-check-circle-line text-3xl text-green-600 mb-2"></i>
            <div className="text-lg font-semibold text-green-900">AI Sistemi</div>
            <div className="text-sm text-green-700">Aktif ve Çalışıyor</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <i className="ri-shield-check-line text-3xl text-blue-600 mb-2"></i>
            <div className="text-lg font-semibold text-blue-900">Güvenlik</div>
            <div className="text-sm text-blue-700">Tüm Sistemler Güvenli</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <i className="ri-plug-line text-3xl text-purple-600 mb-2"></i>
            <div className="text-lg font-semibold text-purple-900">Entegrasyonlar</div>
            <div className="text-sm text-purple-700">12/12 Aktif</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
        <div className="space-y-4">
          {[
            { action: 'Yeni sipariş alındı', time: '2 dakika önce', type: 'success' },
            { action: 'Stok seviyesi düşük uyarısı', time: '15 dakika önce', type: 'warning' },
            { action: 'Müşteri segmentasyonu tamamlandı', time: '1 saat önce', type: 'info' },
            { action: 'AI analizi başlatıldı', time: '2 saat önce', type: 'info' },
            { action: 'Ödeme işlemi tamamlandı', time: '3 saat önce', type: 'success' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Performance Monitor */}
      <PerformanceMonitor />
    </div>
  );
}