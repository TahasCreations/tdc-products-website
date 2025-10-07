// PWA Utility Functions
export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAConfig {
  serviceWorkerPath: string;
  enableNotifications: boolean;
  enableBackgroundSync: boolean;
  cacheStrategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
}

class PWAManager {
  private deferredPrompt: PWAInstallPrompt | null = null;
  private isInstalled = false;
  private config: PWAConfig;

  constructor(config: PWAConfig) {
    this.config = config;
    this.init();
  }

  private init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupNotifications();
    this.checkInstallStatus();
  }

  // Service Worker kaydı
  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(this.config.serviceWorkerPath);
        console.log('Service Worker registered:', registration);

        // Update available
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdateNotification();
              }
            });
          }
        });

        // Background sync
        if (this.config.enableBackgroundSync && 'sync' in window.ServiceWorkerRegistration.prototype) {
          this.setupBackgroundSync(registration);
        }

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  // Install prompt setup
  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt = event as unknown as PWAInstallPrompt;
      this.showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallButton();
      console.log('PWA installed successfully');
    });
  }

  // Notification setup
  private setupNotifications() {
    if (!this.config.enableNotifications) return;

    if ('Notification' in window) {
      // Request permission on user interaction
      document.addEventListener('click', this.requestNotificationPermission.bind(this), { once: true });
    }
  }

  // Install status kontrolü
  private checkInstallStatus() {
    // Standalone mode kontrolü (iOS Safari)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
    }

    // Android Chrome kontrolü
    if ((window.navigator as any).standalone === true) {
      this.isInstalled = true;
    }
  }

  // Install prompt göster
  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }

  // Install button göster
  private showInstallButton() {
    const installButton = document.getElementById('pwa-install-button');
    if (installButton && !this.isInstalled) {
      installButton.style.display = 'block';
    }
  }

  // Install button gizle
  private hideInstallButton() {
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.style.display = 'none';
    }
  }

  // Update notification göster
  private showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'pwa-update-notification';
    notification.innerHTML = `
      <div class="pwa-update-content">
        <h4>Güncelleme Mevcut</h4>
        <p>Yeni bir sürüm mevcut. Şimdi güncellemek ister misiniz?</p>
        <div class="pwa-update-actions">
          <button class="pwa-update-btn pwa-update-now">Güncelle</button>
          <button class="pwa-update-btn pwa-update-later">Daha Sonra</button>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Event listeners
    notification.querySelector('.pwa-update-now')?.addEventListener('click', () => {
      this.updateApp();
      notification.remove();
    });

    notification.querySelector('.pwa-update-later')?.addEventListener('click', () => {
      notification.remove();
    });
  }

  // App güncelleme
  private async updateApp() {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  // Notification permission iste
  private async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }

  // Push notification gönder
  async sendNotification(title: string, options: NotificationOptions = {}) {
    if (!this.config.enableNotifications) return false;

    const hasPermission = await this.requestNotificationPermission();
    if (!hasPermission) return false;

    try {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  // Background sync setup
  private setupBackgroundSync(registration: ServiceWorkerRegistration) {
    // Cart sync
    this.registerBackgroundSync('cart-sync');
    
    // Wishlist sync
    this.registerBackgroundSync('wishlist-sync');
  }

  // Background sync kaydı
  private registerBackgroundSync(tag: string) {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        return (registration as any).sync.register(tag);
      }).catch((error) => {
        console.error('Background sync registration failed:', error);
      });
    }
  }

  // Cache temizleme
  async clearCache() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
    }
  }

  // Cache boyutu kontrolü
  async getCacheSize(): Promise<number> {
    if (!('caches' in window)) return 0;

    let totalSize = 0;
    const cacheNames = await caches.keys();

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }

    return totalSize;
  }

  // Network durumu
  getNetworkStatus(): boolean {
    return navigator.onLine;
  }

  // PWA durumu
  getPWAStatus() {
    return {
      isInstalled: this.isInstalled,
      canInstall: !!this.deferredPrompt,
      hasServiceWorker: 'serviceWorker' in navigator,
      hasNotifications: 'Notification' in window,
      hasBackgroundSync: 'sync' in window.ServiceWorkerRegistration.prototype,
      isOnline: navigator.onLine
    };
  }

  // Share API
  async share(data: ShareData): Promise<boolean> {
    if ('share' in navigator) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Share failed:', error);
        return false;
      }
    }
    return false;
  }

  // Web Share Target
  setupShareTarget() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Share target handling will be implemented in service worker
        console.log('Share target ready');
      });
    }
  }
}

// Global PWA instance
let pwaInstance: PWAManager | null = null;

export function initPWA(config: PWAConfig = {
  serviceWorkerPath: '/sw.js',
  enableNotifications: true,
  enableBackgroundSync: true,
  cacheStrategy: 'stale-while-revalidate'
}): PWAManager {
  if (!pwaInstance) {
    pwaInstance = new PWAManager(config);
  }
  return pwaInstance;
}

export function getPWA(): PWAManager | null {
  return pwaInstance;
}

// Utility functions
export async function isPWAInstalled(): Promise<boolean> {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  if ((window.navigator as any).standalone === true) {
    return true;
  }
  
  return false;
}

export function isPWASupported(): boolean {
  return 'serviceWorker' in navigator;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export async function sendPushNotification(title: string, options: NotificationOptions = {}): Promise<boolean> {
  const pwa = getPWA();
  if (pwa) {
    return await pwa.sendNotification(title, options);
  }
  return false;
}

export async function shareContent(data: ShareData): Promise<boolean> {
  const pwa = getPWA();
  if (pwa) {
    return await pwa.share(data);
  }
  return false;
}

export async function clearPWACache(): Promise<void> {
  const pwa = getPWA();
  if (pwa) {
    await pwa.clearCache();
  }
}

export async function getPWACacheSize(): Promise<number> {
  const pwa = getPWA();
  if (pwa) {
    return await pwa.getCacheSize();
  }
  return 0;
}
