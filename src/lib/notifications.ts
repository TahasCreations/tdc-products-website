// Push notification utilities
export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.permission = Notification.permission;
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'denied') {
      console.warn('Notification permission denied');
      return false;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async registerServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.warn('This browser does not support service workers');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  async showNotification(options: NotificationOptions): Promise<boolean> {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        return false;
      }
    }

    try {
      if (this.registration) {
        // Use service worker for better control
        await this.registration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/icon-192x192.png',
          badge: options.badge || '/icons/badge-72x72.png',
          tag: options.tag,
          data: options.data,
          requireInteraction: options.requireInteraction || false,
          silent: options.silent || false,
        });
      } else {
        // Fallback to native notification
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/icon-192x192.png',
          tag: options.tag,
          data: options.data,
        });
      }
      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }

  // Predefined notification templates
  async notifyNewBlogPost(authorName: string, postTitle: string, postUrl: string) {
    return this.showNotification({
      title: 'Yeni Blog Yazısı! 📝',
      body: `${authorName} yeni bir yazı yayınladı: ${postTitle}`,
      tag: 'blog-post',
      data: { url: postUrl, type: 'blog-post' },
      actions: [
        {
          action: 'read',
          title: 'Oku',
          icon: '/icons/action-read.png'
        },
        {
          action: 'dismiss',
          title: 'Kapat',
          icon: '/icons/action-close.png'
        }
      ]
    });
  }

  async notifyOrderUpdate(orderNumber: string, status: string) {
    return this.showNotification({
      title: 'Sipariş Güncellemesi 📦',
      body: `Sipariş #${orderNumber} durumu: ${status}`,
      tag: `order-${orderNumber}`,
      data: { orderNumber, status, type: 'order-update' },
      actions: [
        {
          action: 'view',
          title: 'Görüntüle',
          icon: '/icons/action-view.png'
        }
      ]
    });
  }

  async notifyPriceDrop(productName: string, oldPrice: number, newPrice: number) {
    return this.showNotification({
      title: 'Fiyat Düştü! 💰',
      body: `${productName} fiyatı ₺${oldPrice}'dan ₺${newPrice}'a düştü!`,
      tag: 'price-drop',
      data: { productName, oldPrice, newPrice, type: 'price-drop' },
      actions: [
        {
          action: 'view',
          title: 'İncele',
          icon: '/icons/action-view.png'
        }
      ]
    });
  }

  async notifyBackInStock(productName: string) {
    return this.showNotification({
      title: 'Stokta! 🎉',
      body: `${productName} tekrar stokta!`,
      tag: 'back-in-stock',
      data: { productName, type: 'back-in-stock' },
      actions: [
        {
          action: 'view',
          title: 'Satın Al',
          icon: '/icons/action-buy.png'
        }
      ]
    });
  }

  async notifyPromotion(title: string, description: string, promoCode?: string) {
    return this.showNotification({
      title: `Kampanya: ${title} 🎯`,
      body: description + (promoCode ? ` Kupon: ${promoCode}` : ''),
      tag: 'promotion',
      data: { title, description, promoCode, type: 'promotion' },
      actions: [
        {
          action: 'view',
          title: 'İncele',
          icon: '/icons/action-view.png'
        }
      ]
    });
  }

  async notifyCommentReply(authorName: string, postTitle: string, commentUrl: string) {
    return this.showNotification({
      title: 'Yorum Yanıtı 💬',
      body: `${authorName} yazınıza yanıt verdi: ${postTitle}`,
      tag: 'comment-reply',
      data: { authorName, postTitle, commentUrl, type: 'comment-reply' },
      actions: [
        {
          action: 'view',
          title: 'Yanıtı Gör',
          icon: '/icons/action-view.png'
        }
      ]
    });
  }

  async notifyFollowUpdate(followerName: string, action: 'followed' | 'unfollowed') {
    return this.showNotification({
      title: action === 'followed' ? 'Yeni Takipçi! 👥' : 'Takipçi Kaybı',
      body: `${followerName} sizi ${action === 'followed' ? 'takip etmeye başladı' : 'takibi bıraktı'}`,
      tag: 'follow-update',
      data: { followerName, action, type: 'follow-update' },
      actions: [
        {
          action: 'view',
          title: 'Profili Gör',
          icon: '/icons/action-view.png'
        }
      ]
    });
  }

  // Schedule notifications
  async scheduleNotification(options: NotificationOptions, delay: number) {
    setTimeout(() => {
      this.showNotification(options);
    }, delay);
  }

  // Clear notifications
  async clearNotifications(tag?: string) {
    if (this.registration) {
      const notifications = await this.registration.getNotifications({ tag });
      notifications.forEach(notification => notification.close());
    }
  }

  // Get notification permission status
  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Hook for React components
export function useNotifications() {
  const requestPermission = () => notificationService.requestPermission();
  const showNotification = (options: NotificationOptions) => notificationService.showNotification(options);
  const isSupported = () => notificationService.isSupported();
  const getPermissionStatus = () => notificationService.getPermissionStatus();

  return {
    requestPermission,
    showNotification,
    isSupported,
    getPermissionStatus,
    // Predefined notifications
    notifyNewBlogPost: notificationService.notifyNewBlogPost.bind(notificationService),
    notifyOrderUpdate: notificationService.notifyOrderUpdate.bind(notificationService),
    notifyPriceDrop: notificationService.notifyPriceDrop.bind(notificationService),
    notifyBackInStock: notificationService.notifyBackInStock.bind(notificationService),
    notifyPromotion: notificationService.notifyPromotion.bind(notificationService),
    notifyCommentReply: notificationService.notifyCommentReply.bind(notificationService),
    notifyFollowUpdate: notificationService.notifyFollowUpdate.bind(notificationService),
  };
}
