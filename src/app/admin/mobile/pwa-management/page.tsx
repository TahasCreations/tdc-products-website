'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import AdminProtection from '../../../../components/AdminProtection';
import { 
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  CogIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  GlobeAltIcon,
  ServerIcon,
  KeyIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BoltIcon,
  WifiIcon,
  CloudIcon,
  CircleStackIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface PWAConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  orientation: 'portrait' | 'landscape' | 'any';
  startUrl: string;
  scope: string;
  icons: PWAIcon[];
  screenshots: string[];
  categories: string[];
  lang: string;
  dir: 'ltr' | 'rtl';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PWAIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: 'any' | 'maskable' | 'monochrome';
}

interface PWAMetrics {
  installs: number;
  launches: number;
  sessions: number;
  averageSessionTime: number;
  bounceRate: number;
  conversionRate: number;
  lastUpdated: string;
}

export default function PWAManagement() {
  const { user } = useAuth();
  const [pwaConfig, setPwaConfig] = useState<PWAConfig | null>(null);
  const [metrics, setMetrics] = useState<PWAMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'config' | 'metrics' | 'icons' | 'testing' | 'settings'>('config');

  useEffect(() => {
    const mockConfig: PWAConfig = {
      id: '1',
      name: 'TDC Products',
      shortName: 'TDC',
      description: 'TDC Ürünleri - E-ticaret Uygulaması',
      themeColor: '#3B82F6',
      backgroundColor: '#FFFFFF',
      display: 'standalone',
      orientation: 'any',
      startUrl: '/',
      scope: '/',
      icons: [
        { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icons/icon-maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' }
      ],
      screenshots: [
        '/screenshots/desktop-1.png',
        '/screenshots/mobile-1.png',
        '/screenshots/tablet-1.png'
      ],
      categories: ['shopping', 'business'],
      lang: 'tr',
      dir: 'ltr',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    };

    const mockMetrics: PWAMetrics = {
      installs: 1250,
      launches: 15420,
      sessions: 8920,
      averageSessionTime: 420,
      bounceRate: 35.2,
      conversionRate: 8.7,
      lastUpdated: '2024-01-15T14:30:00Z'
    };

    setPwaConfig(mockConfig);
    setMetrics(mockMetrics);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">PWA Yönetimi</h1>
                <p className="mt-2 text-gray-600">Progressive Web App yapılandırması ve optimizasyonu</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                  <ArrowPathIcon className="w-5 h-5 mr-2" />
                  Manifest Güncelle
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Test Et
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'config', name: 'Yapılandırma', icon: CogIcon },
                { id: 'metrics', name: 'Metrikler', icon: ChartBarIcon },
                { id: 'icons', name: 'İkonlar', icon: DocumentTextIcon },
                { id: 'testing', name: 'Test', icon: PlayIcon },
                { id: 'settings', name: 'Ayarlar', icon: AdjustmentsHorizontalIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Config Tab */}
          {activeTab === 'config' && pwaConfig && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">PWA Manifest Ayarları</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Uygulama Adı</label>
                    <input
                      type="text"
                      value={pwaConfig.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kısa Ad</label>
                    <input
                      type="text"
                      value={pwaConfig.shortName}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                    <textarea
                      value={pwaConfig.description}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tema Rengi</label>
                    <input
                      type="color"
                      value={pwaConfig.themeColor}
                      className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Arka Plan Rengi</label>
                    <input
                      type="color"
                      value={pwaConfig.backgroundColor}
                      className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Görüntüleme Modu</label>
                    <select
                      value={pwaConfig.display}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="fullscreen">Tam Ekran</option>
                      <option value="standalone">Bağımsız</option>
                      <option value="minimal-ui">Minimal UI</option>
                      <option value="browser">Tarayıcı</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Yönlendirme</label>
                    <select
                      value={pwaConfig.orientation}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="portrait">Dikey</option>
                      <option value="landscape">Yatay</option>
                      <option value="any">Herhangi</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Ayarları Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Metrics Tab */}
          {activeTab === 'metrics' && metrics && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <DevicePhoneMobileIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Kurulumlar</p>
                      <p className="text-2xl font-semibold text-gray-900">{metrics.installs.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <PlayIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Başlatmalar</p>
                      <p className="text-2xl font-semibold text-gray-900">{metrics.launches.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ClockIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Ortalama Süre</p>
                      <p className="text-2xl font-semibold text-gray-900">{Math.floor(metrics.averageSessionTime / 60)}dk</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <ChartBarIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Dönüşüm Oranı</p>
                      <p className="text-2xl font-semibold text-gray-900">%{metrics.conversionRate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Icons Tab */}
          {activeTab === 'icons' && pwaConfig && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">PWA İkonları</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pwaConfig.icons.map((icon, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-center mb-4">
                        <img
                          src={icon.src}
                          alt={`Icon ${icon.sizes}`}
                          className="w-16 h-16 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{icon.sizes}</p>
                        <p className="text-xs text-gray-500">{icon.type}</p>
                        {icon.purpose && (
                          <p className="text-xs text-gray-500">{icon.purpose}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Testing Tab */}
          {activeTab === 'testing' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">PWA Test Sonuçları</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-sm font-medium text-green-900">Manifest Dosyası</span>
                    </div>
                    <span className="text-sm text-green-600">✓ Geçti</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-sm font-medium text-green-900">Service Worker</span>
                    </div>
                    <span className="text-sm text-green-600">✓ Geçti</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-sm font-medium text-green-900">HTTPS</span>
                    </div>
                    <span className="text-sm text-green-600">✓ Geçti</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-3" />
                      <span className="text-sm font-medium text-yellow-900">Offline Desteği</span>
                    </div>
                    <span className="text-sm text-yellow-600">⚠ Uyarı</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">PWA Ayarları</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">PWA Özelliklerini Etkinleştir</p>
                      <p className="text-xs text-gray-500">Progressive Web App özelliklerini aktif eder</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Offline Desteği</p>
                      <p className="text-xs text-gray-500">İnternet bağlantısı olmadan çalışma</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Push Bildirimleri</p>
                      <p className="text-xs text-gray-500">Kullanıcılara bildirim gönderme</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Ana Ekrana Ekleme</p>
                      <p className="text-xs text-gray-500">Kullanıcıların uygulamayı ana ekrana eklemesi</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Ayarları Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}
