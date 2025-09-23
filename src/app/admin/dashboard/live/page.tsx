'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import AdminProtection from '../../../../components/AdminProtection';
import { 
  ChartBarIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ServerIcon,
  CpuChipIcon,
  FireIcon,
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  SignalIcon,
  WifiIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  HeartIcon,
  BoltIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

interface LiveMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  unit: string;
  trend: number[];
  status: 'good' | 'warning' | 'critical';
  lastUpdated: string;
}

interface LiveEvent {
  id: string;
  type: 'user_action' | 'system_event' | 'error' | 'success' | 'warning';
  title: string;
  description: string;
  user?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
}

interface LiveUser {
  id: string;
  name: string;
  email: string;
  location: string;
  device: string;
  browser: string;
  page: string;
  duration: number;
  lastActivity: string;
  status: 'online' | 'idle' | 'away';
}

interface SystemHealth {
  component: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  uptime: number;
  responseTime: number;
  cpu: number;
  memory: number;
  disk: number;
  lastCheck: string;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export default function LiveDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<LiveMetric[]>([]);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [users, setUsers] = useState<LiveUser[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');

  // Mock data generation
  useEffect(() => {
    const generateMockData = () => {
      const mockMetrics: LiveMetric[] = [
        {
          id: '1',
          name: 'Aktif Kullanıcılar',
          value: Math.floor(Math.random() * 1000) + 500,
          change: Math.random() * 20 - 10,
          changeType: Math.random() > 0.5 ? 'increase' : 'decrease',
          unit: 'kişi',
          trend: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100) + 400),
          status: 'good',
          lastUpdated: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Siparişler',
          value: Math.floor(Math.random() * 100) + 50,
          change: Math.random() * 30 - 15,
          changeType: Math.random() > 0.5 ? 'increase' : 'decrease',
          unit: 'adet',
          trend: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50) + 20),
          status: 'good',
          lastUpdated: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Gelir',
          value: Math.floor(Math.random() * 50000) + 100000,
          change: Math.random() * 25 - 12,
          changeType: Math.random() > 0.5 ? 'increase' : 'decrease',
          unit: 'TL',
          trend: Array.from({ length: 24 }, () => Math.floor(Math.random() * 20000) + 80000),
          status: 'good',
          lastUpdated: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Sayfa Görüntüleme',
          value: Math.floor(Math.random() * 10000) + 5000,
          change: Math.random() * 15 - 7,
          changeType: Math.random() > 0.5 ? 'increase' : 'decrease',
          unit: 'sayfa',
          trend: Array.from({ length: 24 }, () => Math.floor(Math.random() * 5000) + 3000),
          status: 'good',
          lastUpdated: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Dönüşüm Oranı',
          value: Math.random() * 5 + 2,
          change: Math.random() * 2 - 1,
          changeType: Math.random() > 0.5 ? 'increase' : 'decrease',
          unit: '%',
          trend: Array.from({ length: 24 }, () => Math.random() * 3 + 1),
          status: 'warning',
          lastUpdated: new Date().toISOString()
        },
        {
          id: '6',
          name: 'Ortalama Sepet Tutarı',
          value: Math.floor(Math.random() * 500) + 200,
          change: Math.random() * 20 - 10,
          changeType: Math.random() > 0.5 ? 'increase' : 'decrease',
          unit: 'TL',
          trend: Array.from({ length: 24 }, () => Math.floor(Math.random() * 300) + 150),
          status: 'good',
          lastUpdated: new Date().toISOString()
        }
      ];

      const mockEvents: LiveEvent[] = [
        {
          id: '1',
          type: 'user_action',
          title: 'Yeni Sipariş',
          description: 'Kullanıcı #1234 numaralı siparişi verdi',
          user: 'user@example.com',
          timestamp: new Date(Date.now() - Math.random() * 300000).toISOString(),
          severity: 'low',
          category: 'E-commerce'
        },
        {
          id: '2',
          type: 'system_event',
          title: 'Sistem Güncellemesi',
          description: 'Veritabanı yedekleme tamamlandı',
          timestamp: new Date(Date.now() - Math.random() * 600000).toISOString(),
          severity: 'low',
          category: 'System'
        },
        {
          id: '3',
          type: 'error',
          title: 'API Hatası',
          description: 'Ödeme servisi geçici olarak kullanılamıyor',
          timestamp: new Date(Date.now() - Math.random() * 900000).toISOString(),
          severity: 'high',
          category: 'Error'
        },
        {
          id: '4',
          type: 'success',
          title: 'Başarılı Giriş',
          description: 'Admin kullanıcısı sisteme giriş yaptı',
          user: 'admin@example.com',
          timestamp: new Date(Date.now() - Math.random() * 1200000).toISOString(),
          severity: 'low',
          category: 'Security'
        }
      ];

      const mockUsers: LiveUser[] = [
        {
          id: '1',
          name: 'Ahmet Yılmaz',
          email: 'ahmet@example.com',
          location: 'İstanbul, Türkiye',
          device: 'Windows 10',
          browser: 'Chrome 120.0',
          page: '/products/laptop',
          duration: Math.floor(Math.random() * 1800) + 300,
          lastActivity: new Date(Date.now() - Math.random() * 300000).toISOString(),
          status: 'online'
        },
        {
          id: '2',
          name: 'Ayşe Kaya',
          email: 'ayse@example.com',
          location: 'Ankara, Türkiye',
          device: 'iPhone 15',
          browser: 'Safari Mobile',
          page: '/cart',
          duration: Math.floor(Math.random() * 1200) + 200,
          lastActivity: new Date(Date.now() - Math.random() * 600000).toISOString(),
          status: 'idle'
        },
        {
          id: '3',
          name: 'Mehmet Demir',
          email: 'mehmet@example.com',
          location: 'İzmir, Türkiye',
          device: 'MacBook Pro',
          browser: 'Safari 17.0',
          page: '/checkout',
          duration: Math.floor(Math.random() * 2400) + 600,
          lastActivity: new Date(Date.now() - Math.random() * 900000).toISOString(),
          status: 'away'
        }
      ];

      const mockSystemHealth: SystemHealth[] = [
        {
          component: 'Web Server',
          status: 'healthy',
          uptime: 99.9,
          responseTime: Math.random() * 100 + 50,
          cpu: Math.random() * 30 + 20,
          memory: Math.random() * 40 + 30,
          disk: Math.random() * 20 + 10,
          lastCheck: new Date().toISOString()
        },
        {
          component: 'Database',
          status: 'healthy',
          uptime: 99.8,
          responseTime: Math.random() * 50 + 20,
          cpu: Math.random() * 25 + 15,
          memory: Math.random() * 50 + 40,
          disk: Math.random() * 30 + 20,
          lastCheck: new Date().toISOString()
        },
        {
          component: 'API Gateway',
          status: 'warning',
          uptime: 98.5,
          responseTime: Math.random() * 200 + 100,
          cpu: Math.random() * 60 + 40,
          memory: Math.random() * 70 + 50,
          disk: Math.random() * 40 + 30,
          lastCheck: new Date().toISOString()
        },
        {
          component: 'Cache Server',
          status: 'healthy',
          uptime: 99.5,
          responseTime: Math.random() * 20 + 10,
          cpu: Math.random() * 20 + 10,
          memory: Math.random() * 30 + 20,
          disk: Math.random() * 15 + 5,
          lastCheck: new Date().toISOString()
        }
      ];

      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'warning',
          title: 'Yüksek CPU Kullanımı',
          message: 'API Gateway sunucusunda CPU kullanımı %80\'i aştı',
          timestamp: new Date(Date.now() - Math.random() * 300000).toISOString(),
          read: false,
          priority: 'high'
        },
        {
          id: '2',
          type: 'success',
          title: 'Yedekleme Tamamlandı',
          message: 'Günlük veritabanı yedeklemesi başarıyla tamamlandı',
          timestamp: new Date(Date.now() - Math.random() * 600000).toISOString(),
          read: true,
          priority: 'low'
        },
        {
          id: '3',
          type: 'error',
          title: 'Ödeme Hatası',
          message: 'Ödeme servisinde geçici bir sorun yaşanıyor',
          timestamp: new Date(Date.now() - Math.random() * 900000).toISOString(),
          read: false,
          priority: 'urgent'
        }
      ];

      setMetrics(mockMetrics);
      setEvents(mockEvents);
      setUsers(mockUsers);
      setSystemHealth(mockSystemHealth);
      setNotifications(notifications);
    };

    generateMockData();
    setLoading(false);

    if (isLive) {
      const interval = setInterval(generateMockData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [isLive, refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      case 'online': return 'text-green-600 bg-green-100';
      case 'idle': return 'text-yellow-600 bg-yellow-100';
      case 'away': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return CheckCircleIcon;
      case 'warning': return ExclamationTriangleIcon;
      case 'critical': return XCircleIcon;
      case 'healthy': return HeartIcon;
      case 'offline': return XCircleIcon;
      case 'online': return SignalIcon;
      case 'idle': return ClockIcon;
      case 'away': return PauseIcon;
      default: return CheckCircleIcon;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'user_action': return UserGroupIcon;
      case 'system_event': return ServerIcon;
      case 'error': return ExclamationTriangleIcon;
      case 'success': return CheckCircleIcon;
      case 'warning': return ExclamationTriangleIcon;
      default: return BellIcon;
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return ArrowTrendingUpIcon;
      case 'decrease': return ArrowTrendingDownIcon;
      default: return ClockIcon;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Canlı Dashboard</h1>
                <p className="mt-2 text-gray-600">Gerçek zamanlı sistem izleme ve analitik</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-gray-600">
                    {isLive ? 'Canlı' : 'Duraklatıldı'}
                  </span>
                </div>
                <button
                  onClick={() => setIsLive(!isLive)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                    isLive 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isLive ? (
                    <>
                      <PauseIcon className="w-5 h-5 mr-2" />
                      Duraklat
                    </>
                  ) : (
                    <>
                      <PlayIcon className="w-5 h-5 mr-2" />
                      Başlat
                    </>
                  )}
                </button>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1000}>1 Saniye</option>
                  <option value={5000}>5 Saniye</option>
                  <option value={10000}>10 Saniye</option>
                  <option value={30000}>30 Saniye</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Live Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric) => {
              const ChangeIcon = getChangeIcon(metric.changeType);
              
              return (
                <div key={metric.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{metric.name}</h3>
                        <p className="text-3xl font-bold text-gray-900">
                          {metric.value.toLocaleString('tr-TR')} {metric.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(metric.status)}`}>
                          <ChangeIcon className={`w-3 h-3 mr-1 ${getChangeColor(metric.changeType)}`} />
                          {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Son Güncelleme:</span>
                        <span>{new Date(metric.lastUpdated).toLocaleTimeString('tr-TR')}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-500"
                          style={{ width: `${Math.min(100, (metric.value / 1000) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Live Events */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Canlı Olaylar</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {events.map((event) => {
                    const EventIcon = getEventIcon(event.type);
                    
                    return (
                      <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <EventIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{event.title}</p>
                            <span className="text-xs text-gray-500">
                              {new Date(event.timestamp).toLocaleTimeString('tr-TR')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          {event.user && (
                            <p className="text-xs text-gray-500 mt-1">Kullanıcı: {event.user}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Users */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Aktif Kullanıcılar</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {users.map((user) => {
                    const StatusIcon = getStatusIcon(user.status);
                    
                    return (
                      <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserGroupIcon className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {user.status === 'online' ? 'Çevrimiçi' :
                               user.status === 'idle' ? 'Boşta' : 'Uzakta'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{user.page}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">{user.location}</p>
                            <p className="text-xs text-gray-500">
                              {formatDuration(user.duration)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Sistem Sağlığı</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {systemHealth.map((component) => {
                    const StatusIcon = getStatusIcon(component.status);
                    
                    return (
                      <div key={component.component} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900">{component.component}</h4>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(component.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {component.status === 'healthy' ? 'Sağlıklı' :
                             component.status === 'warning' ? 'Uyarı' :
                             component.status === 'critical' ? 'Kritik' : 'Çevrimdışı'}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Uptime:</span>
                            <span>%{component.uptime}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Yanıt Süresi:</span>
                            <span>{component.responseTime.toFixed(0)}ms</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>CPU:</span>
                            <span>%{component.cpu.toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Bellek:</span>
                            <span>%{component.memory.toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Disk:</span>
                            <span>%{component.disk.toFixed(0)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Bildirimler</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50'
                    }`}>
                      <div className="flex-shrink-0">
                        {notification.type === 'info' && <BellIcon className="w-5 h-5 text-blue-600" />}
                        {notification.type === 'success' && <CheckCircleIcon className="w-5 h-5 text-green-600" />}
                        {notification.type === 'warning' && <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />}
                        {notification.type === 'error' && <XCircleIcon className="w-5 h-5 text-red-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.timestamp).toLocaleTimeString('tr-TR')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtection>
  );
}
