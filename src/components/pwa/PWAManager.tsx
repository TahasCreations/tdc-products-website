'use client';

import { useState, useEffect } from 'react';
import { useToast } from '../Toast';
import { 
  DevicePhoneMobileIcon,
  BellIcon,
  WifiIcon,
  CloudIcon,
  CogIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAFeatures {
  installable: boolean;
  pushNotifications: boolean;
  offlineSupport: boolean;
  backgroundSync: boolean;
  shareTarget: boolean;
}

export default function PWAManager() {
  const { addToast } = useToast();
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [features, setFeatures] = useState<PWAFeatures>({
    installable: false,
    pushNotifications: false,
    offlineSupport: false,
    backgroundSync: false,
    shareTarget: false
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as any);
      setFeatures(prev => ({ ...prev, installable: true }));
    };

    // PWA installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      addToast({
        type: 'success',
        title: 'Uygulama Yüklendi!',
        message: 'TDC Products uygulaması başarıyla yüklendi',
        duration: 5000
      });
    };

    // Online/Offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Check PWA features
    const checkPWAFeatures = () => {
      const newFeatures: PWAFeatures = {
        installable: !!installPrompt,
        pushNotifications: 'Notification' in window && 'serviceWorker' in navigator,
        offlineSupport: 'serviceWorker' in navigator,
        backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
        shareTarget: 'share' in navigator
      };
      setFeatures(newFeatures);
    };

    // Check notification permission
    const checkNotificationPermission = () => {
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    };

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial checks
    checkPWAFeatures();
    checkNotificationPermission();
    setIsOnline(navigator.onLine);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [installPrompt, addToast]);

  const handleInstall = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        addToast({
          type: 'success',
          title: 'Yükleme Başlatıldı',
          message: 'Uygulama yükleniyor...',
          duration: 3000
        });
      } else {
        addToast({
          type: 'info',
          title: 'Yükleme İptal Edildi',
          message: 'İstediğiniz zaman tekrar deneyebilirsiniz',
          duration: 3000
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Yükleme Hatası',
        message: 'Uygulama yüklenirken bir hata oluştu',
        duration: 5000
      });
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      addToast({
        type: 'error',
        title: 'Desteklenmiyor',
        message: 'Bu tarayıcı bildirimleri desteklemiyor',
        duration: 5000
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        addToast({
          type: 'success',
          title: 'Bildirimler Etkinleştirildi',
          message: 'Artık önemli güncellemeleri alacaksınız',
          duration: 5000
        });
        
        // Test notification
        new Notification('TDC Products', {
          body: 'Bildirimler başarıyla etkinleştirildi!',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png'
        });
      } else {
        addToast({
          type: 'info',
          title: 'Bildirimler Reddedildi',
          message: 'Ayarlardan bildirimleri etkinleştirebilirsiniz',
          duration: 5000
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Hata',
        message: 'Bildirim izni alınırken bir hata oluştu',
        duration: 5000
      });
    }
  };

  const sendTestNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification('TDC Products Test', {
        body: 'Bu bir test bildirimidir. Bildirimler düzgün çalışıyor!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: 'test-notification'
      });
    }
  };

  const shareApp = async () => {
    if (!('share' in navigator)) {
      addToast({
        type: 'error',
        title: 'Paylaşım Desteklenmiyor',
        message: 'Bu tarayıcı paylaşım özelliğini desteklemiyor',
        duration: 5000
      });
      return;
    }

    try {
      await navigator.share({
        title: 'TDC Products',
        text: 'TDC Products uygulamasını keşfedin!',
        url: window.location.origin
      });
    } catch (error) {
      if ((error as any).name !== 'AbortError') {
        addToast({
          type: 'error',
          title: 'Paylaşım Hatası',
          message: 'Paylaşım sırasında bir hata oluştu',
          duration: 5000
        });
      }
    }
  };

  const openAppSettings = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        if (registrations.length > 0) {
          // Open browser settings for PWA
          window.open('chrome://settings/content/notifications', '_blank');
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PWA Yönetimi</h2>
        <p className="text-gray-600">
          Progressive Web App özelliklerini yönetin ve optimize edin
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <DevicePhoneMobileIcon className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Uygulama Durumu</p>
              <p className="text-lg font-bold text-blue-900">
                {isInstalled ? 'Yüklü' : 'Yüklenebilir'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <WifiIcon className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">Bağlantı</p>
              <p className="text-lg font-bold text-green-900">
                {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <BellIcon className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-900">Bildirimler</p>
              <p className="text-lg font-bold text-purple-900">
                {notificationPermission === 'granted' ? 'Etkin' : 'Kapalı'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <CloudIcon className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-900">Offline</p>
              <p className="text-lg font-bold text-orange-900">
                {features.offlineSupport ? 'Destekleniyor' : 'Desteklenmiyor'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Özellik Durumu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(features).map(([feature, enabled]) => (
            <div key={feature} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {feature.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
              {enabled ? (
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              ) : (
                <XCircleIcon className="w-5 h-5 text-red-600" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        {!isInstalled && installPrompt && (
          <button
            onClick={handleInstall}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <DevicePhoneMobileIcon className="w-5 h-5 mr-2" />
            Uygulamayı Yükle
          </button>
        )}

        {notificationPermission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            <BellIcon className="w-5 h-5 mr-2" />
            Bildirimleri Etkinleştir
          </button>
        )}

        {notificationPermission === 'granted' && (
          <button
            onClick={sendTestNotification}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <BellIcon className="w-5 h-5 mr-2" />
            Test Bildirimi Gönder
          </button>
        )}

        {features.shareTarget && (
          <button
            onClick={shareApp}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center"
          >
            <CloudIcon className="w-5 h-5 mr-2" />
            Uygulamayı Paylaş
          </button>
        )}

        <button
          onClick={openAppSettings}
          className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center"
        >
          <CogIcon className="w-5 h-5 mr-2" />
          Uygulama Ayarları
        </button>
      </div>

      {/* PWA Benefits */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">PWA Avantajları</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Hızlı yükleme ve offline çalışma</li>
          <li>• Push bildirimleri ile güncel kalın</li>
          <li>• Ana ekrana ekleyin, native app gibi kullanın</li>
          <li>• Düşük veri kullanımı ve pil tasarrufu</li>
          <li>• Otomatik güncellemeler</li>
        </ul>
      </div>
    </div>
  );
}
