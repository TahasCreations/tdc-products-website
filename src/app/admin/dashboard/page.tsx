'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense, lazy } from 'react';
// import LanguageSelector, { useLanguage } from '@/components/LanguageSelector';
// import PerformanceMonitor from '@/components/PerformanceMonitor';
import AdvancedDashboard from '../../../components/admin/AdvancedDashboard';
import SmartNotifications from '../../../components/admin/SmartNotifications';

// Lazy load heavy components for better performance
const AdvancedAISystem = lazy(() => import('../../../components/AdvancedAISystem'));
const MultiPaymentSystem = lazy(() => import('../../../components/MultiPaymentSystem'));
const AdvancedAnalyticsDashboard = lazy(() => import('../../../components/AdvancedAnalyticsDashboard'));
const AdvancedInventoryManagement = lazy(() => import('../../../components/AdvancedInventoryManagement'));
const AdvancedCRMSystem = lazy(() => import('../../../components/AdvancedCRMSystem'));
const AdvancedSecuritySystem = lazy(() => import('../../../components/AdvancedSecuritySystem'));
const WorkflowAutomationSystem = lazy(() => import('../../../components/WorkflowAutomationSystem'));
const IntegrationManagementSystem = lazy(() => import('../../../components/IntegrationManagementSystem'));
const AdvancedHRSystem = lazy(() => import('../../../components/AdvancedHRSystem'));
const AdvancedMarketingSystem = lazy(() => import('../../../components/AdvancedMarketingSystem'));
const AdvancedFinanceSystem = lazy(() => import('../../../components/AdvancedFinanceSystem'));
const AdvancedEcommerceSystem = lazy(() => import('../../../components/AdvancedEcommerceSystem'));
const AdvancedAccountingSystem = lazy(() => import('../../../components/AdvancedAccountingSystem'));
const ProductRecommendationEngine = lazy(() => import('../../../components/ai/ProductRecommendationEngine'));
const PriceOptimizer = lazy(() => import('../../../components/ai/PriceOptimizer'));
const SmartChatbot = lazy(() => import('../../../components/ai/SmartChatbot'));

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  // const { language, changeLanguage, t } = useLanguage();
  const language = 'tr';
  const changeLanguage = () => {};
  const t = (key: string) => key;

  const tabs = [
    { id: 'overview', label: t('navigation.dashboard'), icon: 'ri-dashboard-line' },
    { id: 'atlassian', label: 'Atlassian Workspace', icon: 'ri-layout-grid-line' },
    { id: 'marketplace', label: 'Pazaryeri Yönetimi', icon: 'ri-store-line' },
    { id: 'vendors', label: 'Satıcı Yönetimi', icon: 'ri-user-line' },
    { id: 'commissions', label: 'Komisyon Sistemi', icon: 'ri-percent-line' },
    { id: 'ai', label: 'AI & Otomasyon', icon: 'ri-brain-line' },
    { id: 'payments', label: t('payment.paymentMethod'), icon: 'ri-money-dollar-circle-line' },
    { id: 'analytics', label: t('business.analytics'), icon: 'ri-bar-chart-line' },
    { id: 'inventory', label: t('business.inventory'), icon: 'ri-box-3-line' },
    { id: 'crm', label: t('business.crm'), icon: 'ri-user-heart-line' },
    { id: 'security', label: t('business.security'), icon: 'ri-shield-check-line' },
    { id: 'workflows', label: 'İş Akışları', icon: 'ri-flow-chart' },
    { id: 'integrations', label: 'Entegrasyonlar', icon: 'ri-plug-line' },
    { id: 'hr', label: 'İnsan Kaynakları', icon: 'ri-team-line' },
    { id: 'marketing', label: 'Pazarlama', icon: 'ri-marketing-line' },
    { id: 'finance', label: 'Finans', icon: 'ri-bank-line' },
    { id: 'ecommerce', label: 'E-ticaret', icon: 'ri-shopping-cart-line' },
    { id: 'accounting', label: 'Muhasebe', icon: 'ri-calculator-line' }
  ];

  const renderTabContent = () => {
    const LoadingSpinner = () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

    switch (activeTab) {
      case 'atlassian':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Atlassian Workspace</h2>
                  <p className="text-gray-600 mt-1">Proje yönetimi, iş akışları ve işbirliği araçları</p>
                </div>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Geri</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
                  <div className="text-gray-600">Aktif Proje</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">89</div>
                  <div className="text-gray-600">Toplam Issue</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
                  <div className="text-gray-600">Ekip Üyesi</div>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 mb-2">68%</div>
                  <div className="text-gray-600">Tamamlanma Oranı</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Erişim</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
                      📋 Yeni Proje Oluştur
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
                      🐛 Bug Raporu Oluştur
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
                      📖 Yeni Story Ekle
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
                      📊 Raporları Görüntüle
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">TMP-123 tamamlandı</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Yeni sprint başlatıldı</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">SOB-45 review'da</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Yeni ekip üyesi eklendi</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <a 
                  href="/admin/atlassian"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>Atlassian Workspace'e Git</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        );
      case 'marketplace':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Pazaryeri Yönetimi</h2>
                  <p className="text-gray-600 mt-1">TDC Market pazaryerinin genel yönetimi</p>
                </div>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Geri</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">10M+</div>
                  <div className="text-gray-600">Toplam Müşteri</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
                  <div className="text-gray-600">Aktif Satıcı</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">100M+</div>
                  <div className="text-gray-600">Toplam Ürün</div>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 mb-2">190+</div>
                  <div className="text-gray-600">Ülke</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pazaryeri Ayarları</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Yeni Satıcı Kayıtları</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Açık</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Komisyon Oranı</span>
                      <span className="text-gray-900 font-semibold">%8.5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Minimum Satış Limiti</span>
                      <span className="text-gray-900 font-semibold">₺100</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
                      Satıcı Başvurularını İncele
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
                      Komisyon Ayarlarını Düzenle
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
                      Pazaryeri Raporlarını Görüntüle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'vendors':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Satıcı Yönetimi</h2>
                  <p className="text-gray-600 mt-1">Tüm satıcıları yönetin ve takip edin</p>
                </div>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Geri</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Satıcı</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Durum</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Ürün Sayısı</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Aylık Satış</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">AB</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Ahmet Bey E-ticaret</div>
                            <div className="text-sm text-gray-500">ahmet@example.com</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Aktif</span>
                      </td>
                      <td className="py-4 px-4 text-gray-900">245</td>
                      <td className="py-4 px-4 text-gray-900">₺45,230</td>
                      <td className="py-4 px-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">Düzenle</button>
                        <button className="text-red-600 hover:text-red-800">Durdur</button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-semibold">MZ</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Mehmet Zeki Mağaza</div>
                            <div className="text-sm text-gray-500">mehmet@example.com</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Beklemede</span>
                      </td>
                      <td className="py-4 px-4 text-gray-900">0</td>
                      <td className="py-4 px-4 text-gray-900">₺0</td>
                      <td className="py-4 px-4">
                        <button className="text-green-600 hover:text-green-800 mr-3">Onayla</button>
                        <button className="text-red-600 hover:text-red-800">Reddet</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'commissions':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Komisyon Sistemi</h2>
                  <p className="text-gray-600 mt-1">Komisyon oranlarını yönetin ve takip edin</p>
                </div>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Geri</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Komisyon Oranları</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Elektronik</span>
                      <span className="text-gray-900 font-semibold">%8.5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Giyim</span>
                      <span className="text-gray-900 font-semibold">%12.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Ev & Yaşam</span>
                      <span className="text-gray-900 font-semibold">%10.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Spor & Outdoor</span>
                      <span className="text-gray-900 font-semibold">%9.5</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Aylık Komisyon Geliri</h3>
                  <div className="text-3xl font-bold text-green-600 mb-2">₺2,450,000</div>
                  <div className="text-gray-600 mb-4">Bu ay toplam komisyon</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Geçen aya göre</span>
                      <span className="text-green-600">+12.5%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Hedef</span>
                      <span className="text-gray-900">₺2,200,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'ai':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">AI & Otomasyon Sistemi</h2>
                  <p className="text-gray-600 mt-1">Yapay zeka destekli özellikler ve otomasyon araçları</p>
                </div>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Geri</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<LoadingSpinner />}>
                  <ProductRecommendationEngine />
                </Suspense>
                <Suspense fallback={<LoadingSpinner />}>
                  <PriceOptimizer />
                </Suspense>
              </div>
              
              <div className="mt-6">
                <Suspense fallback={<LoadingSpinner />}>
                  <SmartChatbot context={{ userType: 'admin' }} />
                </Suspense>
              </div>
            </div>
          </div>
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
      case 'hr':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdvancedHRSystem />
          </Suspense>
        );
      case 'marketing':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdvancedMarketingSystem />
          </Suspense>
        );
      case 'finance':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdvancedFinanceSystem />
          </Suspense>
        );
      case 'ecommerce':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdvancedEcommerceSystem />
          </Suspense>
        );
      case 'accounting':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdvancedAccountingSystem />
          </Suspense>
        );
      default:
        return <AdvancedDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors group"
                title="Önceki sayfaya dön"
              >
                <i className="ri-close-line text-lg text-gray-600 group-hover:text-red-600 transition-colors"></i>
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">TDC</span>
                <span className="text-2xl font-bold text-purple-600">Market</span>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-700">
                {t('business.dashboard')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* <LanguageSelector
                currentLanguage={language}
                onLanguageChange={changeLanguage}
                compact={true}
              /> */}
              
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

      {/* Smart Notifications */}
      <SmartNotifications />
    </div>
  );
}

function OverviewDashboard() {
  // const { t } = useLanguage();
  const t = (key: string) => key;

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
      {/* <PerformanceMonitor /> */}
    </div>
  );
}