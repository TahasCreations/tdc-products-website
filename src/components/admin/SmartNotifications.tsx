'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  BellIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'system' | 'sales' | 'inventory' | 'user' | 'security';
  action?: {
    label: string;
    onClick: () => void;
  };
  autoClose?: boolean;
  duration?: number;
}

interface SmartNotificationsProps {
  maxNotifications?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  autoClose?: boolean;
  defaultDuration?: number;
}

export default function SmartNotifications({ 
  maxNotifications = 5,
  position = 'top-right',
  autoClose = true,
  defaultDuration = 5000
}: SmartNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const shouldShowNotification = Math.random() > 0.7; // 30% chance
      
      if (shouldShowNotification) {
        const newNotification = generateRandomNotification();
        addNotification(newNotification);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const generateRandomNotification = useCallback((): Notification => {
    const types: Notification['type'][] = ['success', 'warning', 'error', 'info'];
    const categories: Notification['category'][] = ['system', 'sales', 'inventory', 'user', 'security'];
    const priorities: Notification['priority'][] = ['high', 'medium', 'low'];
    
    const notificationTemplates = [
      {
        type: 'success' as const,
        title: 'Yeni Satış',
        message: 'iPhone 15 Pro satışı tamamlandı - ₺45,000',
        category: 'sales' as const,
        priority: 'high' as const
      },
      {
        type: 'warning' as const,
        title: 'Düşük Stok Uyarısı',
        message: 'Nike Air Max stoku kritik seviyede (3 adet kaldı)',
        category: 'inventory' as const,
        priority: 'high' as const
      },
      {
        type: 'info' as const,
        title: 'Yeni Müşteri',
        message: 'VIP müşteri kaydı yapıldı: Ahmet Yılmaz',
        category: 'user' as const,
        priority: 'medium' as const
      },
      {
        type: 'error' as const,
        title: 'Ödeme Hatası',
        message: 'Sipariş #1234 ödeme işlemi başarısız',
        category: 'sales' as const,
        priority: 'high' as const
      },
      {
        type: 'success' as const,
        title: 'Kampanya Başarılı',
        message: 'Yaz kampanyası %150 hedefi aştı',
        category: 'sales' as const,
        priority: 'medium' as const
      },
      {
        type: 'info' as const,
        title: 'Sistem Güncellemesi',
        message: 'Yeni güvenlik güncellemesi yüklendi',
        category: 'system' as const,
        priority: 'low' as const
      }
    ];

    const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
    
    return {
      id: Date.now().toString(),
      ...template,
      timestamp: new Date(),
      read: false,
      autoClose: template.priority !== 'high',
      duration: template.priority === 'high' ? 8000 : defaultDuration
    };
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => {
      const newNotifications = [notification, ...prev].slice(0, maxNotifications);
      return newNotifications;
    });
    
    setUnreadCount(prev => prev + 1);

    // Auto close if enabled
    if (notification.autoClose && autoClose) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration || defaultDuration);
    }
  }, [autoClose, defaultDuration, maxNotifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return prev.filter(n => n.id !== id);
    });
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string, category: string) => {
    if (category === 'sales') return <CurrencyDollarIcon className="h-5 w-5" />;
    if (category === 'inventory') return <CubeIcon className="h-5 w-5" />;
    if (category === 'user') return <UserIcon className="h-5 w-5" />;
    if (category === 'system') return <ClockIcon className="h-5 w-5" />;
    
    switch (type) {
      case 'success': return <CheckCircleIcon className="h-5 w-5" />;
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'error': return <XCircleIcon className="h-5 w-5" />;
      case 'info': return <InformationCircleIcon className="h-5 w-5" />;
      default: return <BellIcon className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Şimdi';
    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    return `${days} gün önce`;
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      default: return 'top-4 right-4';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <BellIcon className="h-6 w-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute top-16 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Bildirimler</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Tümünü Okundu İşaretle
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <BellIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Henüz bildirim yok</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Priority Indicator */}
                      <div className={`w-1 h-full rounded-full ${getPriorityColor(notification.priority)}`}></div>
                      
                      {/* Icon */}
                      <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type, notification.category)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                          {notification.action && (
                            <button
                              onClick={() => {
                                notification.action?.onClick();
                                markAsRead(notification.id);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              {notification.action.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button className="w-full text-sm text-blue-600 hover:text-blue-800">
                Tüm Bildirimleri Görüntüle
              </button>
            </div>
          )}
        </div>
      )}

      {/* Toast Notifications */}
      <div className="space-y-2">
        {notifications.filter(n => !n.read && n.priority === 'high').map((notification) => (
          <div
            key={`toast-${notification.id}`}
            className={`p-4 rounded-lg shadow-lg border-l-4 ${getNotificationColor(notification.type)} animate-slide-in`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type, notification.category)}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{notification.title}</h4>
                <p className="text-sm mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
