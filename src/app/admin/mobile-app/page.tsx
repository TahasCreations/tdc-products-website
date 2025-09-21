'use client';

import { useState, useEffect } from 'react';
import { 
  DevicePhoneMobileIcon,
  QrCodeIcon,
  CloudIcon,
  BellIcon,
  CogIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface MobileApp {
  id: string;
  name: string;
  platform: 'ios' | 'android' | 'both';
  version: string;
  status: 'active' | 'inactive' | 'maintenance';
  downloads: number;
  rating: number;
  lastUpdate: string;
  features: string[];
}

interface PushNotification {
  id: string;
  title: string;
  message: string;
  target: 'all' | 'segment' | 'individual';
  status: 'sent' | 'scheduled' | 'draft';
  sentAt: string;
  openRate: number;
}

export default function MobileAppPage() {
  const [apps, setApps] = useState<MobileApp[]>([]);
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock mobile app data
    const mockApps: MobileApp[] = [
      {
        id: '1',
        name: 'TDC Products iOS',
        platform: 'ios',
        version: '1.2.3',
        status: 'active',
        downloads: 1250,
        rating: 4.8,
        lastUpdate: '2024-01-15T10:00:00Z',
        features: ['E-ticaret', 'BİST takibi', 'Push bildirimler', 'Offline mod']
      },
      {
        id: '2',
        name: 'TDC Products Android',
        platform: 'android',
        version: '1.2.1',
        status: 'active',
        downloads: 2100,
        rating: 4.6,
        lastUpdate: '2024-01-10T14:30:00Z',
        features: ['E-ticaret', 'BİST takibi', 'Push bildirimler', 'Offline mod']
      }
    ];

    const mockNotifications: PushNotification[] = [
      {
        id: '1',
        title: 'Yeni Ürün Geldi!',
        message: 'Elektronik kategorisinde yeni ürünler keşfedin',
        target: 'all',
        status: 'sent',
        sentAt: '2024-01-20T09:00:00Z',
        openRate: 23.5
      },
      {
        id: '2',
        title: 'Özel İndirim',
        message: 'Sadece bugün geçerli %30 indirim fırsatı',
        target: 'segment',
        status: 'scheduled',
        sentAt: '2024-01-21T10:00:00Z',
        openRate: 0
      }
    ];

    setTimeout(() => {
      setApps(mockApps);
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: 'Aktif',
      inactive: 'Pasif',
      maintenance: 'Bakımda',
      sent: 'Gönderildi',
      scheduled: 'Zamanlandı',
      draft: 'Taslak'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'ios' ? '🍎' : platform === 'android' ? '🤖' : '📱';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mobil Uygulama Yönetimi</h1>
              <p className="text-gray-600 mt-1">iOS ve Android uygulamalarınızı yönetin</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <CogIcon className="w-4 h-4 mr-2 inline" />
                Ayarlar
              </button>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <DevicePhoneMobileIcon className="w-4 h-4 mr-2 inline" />
                Yeni Uygulama
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* App Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam İndirme</p>
                <p className="text-2xl font-bold text-gray-900">
                  {apps.reduce((sum, app) => sum + app.downloads, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Tüm platformlar</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ArrowDownTrayIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Puan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(apps.reduce((sum, app) => sum + app.rating, 0) / apps.length).toFixed(1)}
                </p>
                <p className="text-sm text-gray-500">5 üzerinden</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-yellow-600 text-xl">⭐</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Uygulama</p>
                <p className="text-2xl font-bold text-gray-900">
                  {apps.filter(app => app.status === 'active').length}
                </p>
                <p className="text-sm text-gray-500">Platform</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Push Bildirim</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.status === 'sent').length}
                </p>
                <p className="text-sm text-gray-500">Bu ay gönderilen</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BellIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Apps */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mobil Uygulamalar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {apps.map((app) => (
              <div key={app.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{getPlatformIcon(app.platform)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                      <p className="text-sm text-gray-600">v{app.version}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                    {getStatusText(app.status)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">İndirme:</span>
                    <span className="font-medium">{app.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Puan:</span>
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">{app.rating}</span>
                      <span className="text-yellow-500">⭐</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Son Güncelleme:</span>
                    <span className="font-medium">
                      {new Date(app.lastUpdate).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Özellikler:</h4>
                  <div className="flex flex-wrap gap-2">
                    {app.features.map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <EyeIcon className="w-4 h-4 mr-1 inline" />
                    Detaylar
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <PencilIcon className="w-4 h-4 mr-1 inline" />
                    Düzenle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Push Bildirimler</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <BellIcon className="w-4 h-4 mr-2 inline" />
              Yeni Bildirim
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <BellIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz bildirim yok</h3>
                  <p className="text-gray-600">Müşterilerinize push bildirim göndermek için başlayın</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Hedef: {notification.target === 'all' ? 'Tümü' : notification.target === 'segment' ? 'Segment' : 'Bireysel'}</span>
                            <span>Gönderim: {new Date(notification.sentAt).toLocaleDateString('tr-TR')}</span>
                            <span>Açılma Oranı: %{notification.openRate}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                            {getStatusText(notification.status)}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QR Code for App Download */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uygulama İndirme QR Kodu</h3>
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-gray-100 rounded-lg">
              <QrCodeIcon className="w-24 h-24 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-600 mb-2">
                Müşterileriniz bu QR kodu tarayarak uygulamayı indirebilir
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                QR Kodu Güncelle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
