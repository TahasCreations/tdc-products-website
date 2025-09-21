'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  LockClosedIcon,
  KeyIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  GlobeAltIcon,
  CpuChipIcon,
  BellIcon,
  CogIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface SecurityEvent {
  id: string;
  type: 'login' | 'failed_login' | 'permission_denied' | 'data_access' | 'system_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  user: string;
  ip: string;
  timestamp: string;
  status: 'resolved' | 'investigating' | 'pending';
}

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  rules: string[];
  lastUpdated: string;
}

interface SecurityMetrics {
  totalThreats: number;
  blockedAttempts: number;
  activeUsers: number;
  securityScore: number;
  lastScan: string;
  vulnerabilities: number;
}

export default function AdvancedSecurityPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [policies, setPolicies] = useState<SecurityPolicy[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock security data
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        type: 'failed_login',
        severity: 'medium',
        description: 'Başarısız giriş denemesi - 5 kez',
        user: 'admin@tdc.com',
        ip: '192.168.1.100',
        timestamp: '2024-01-20T10:30:00Z',
        status: 'investigating'
      },
      {
        id: '2',
        type: 'permission_denied',
        severity: 'low',
        description: 'Yetkisiz dosya erişim denemesi',
        user: 'user@tdc.com',
        ip: '192.168.1.101',
        timestamp: '2024-01-20T09:15:00Z',
        status: 'resolved'
      },
      {
        id: '3',
        type: 'data_access',
        severity: 'high',
        description: 'Büyük veri seti indirme işlemi',
        user: 'analyst@tdc.com',
        ip: '192.168.1.102',
        timestamp: '2024-01-20T08:45:00Z',
        status: 'pending'
      }
    ];

    const mockPolicies: SecurityPolicy[] = [
      {
        id: '1',
        name: 'Güçlü Şifre Politikası',
        description: 'Minimum 8 karakter, büyük/küçük harf, sayı ve özel karakter',
        isActive: true,
        rules: ['Min 8 karakter', 'Büyük harf zorunlu', 'Sayı zorunlu', 'Özel karakter zorunlu'],
        lastUpdated: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'İki Faktörlü Kimlik Doğrulama',
        description: 'Tüm admin hesapları için 2FA zorunlu',
        isActive: true,
        rules: ['SMS doğrulama', 'Email doğrulama', 'Authenticator app'],
        lastUpdated: '2024-01-10T14:30:00Z'
      },
      {
        id: '3',
        name: 'IP Kısıtlaması',
        description: 'Belirli IP adreslerinden erişim kısıtlaması',
        isActive: false,
        rules: ['Whitelist IP listesi', 'Geolocation kontrolü'],
        lastUpdated: '2024-01-05T09:20:00Z'
      }
    ];

    const mockMetrics: SecurityMetrics = {
      totalThreats: 23,
      blockedAttempts: 156,
      activeUsers: 45,
      securityScore: 87,
      lastScan: '2024-01-20T10:00:00Z',
      vulnerabilities: 3
    };

    setTimeout(() => {
      setEvents(mockEvents);
      setPolicies(mockPolicies);
      setMetrics(mockMetrics);
      setLoading(false);
    }, 1000);
  }, []);

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  const getSeverityText = (severity: string) => {
    const texts = {
      low: 'Düşük',
      medium: 'Orta',
      high: 'Yüksek',
      critical: 'Kritik'
    };
    return texts[severity as keyof typeof texts] || severity;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      resolved: 'bg-green-100 text-green-800',
      investigating: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusText = (status: string) => {
    const texts = {
      resolved: 'Çözüldü',
      investigating: 'İnceleniyor',
      pending: 'Bekliyor'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      login: CheckCircleIcon,
      failed_login: XCircleIcon,
      permission_denied: ExclamationTriangleIcon,
      data_access: EyeIcon,
      system_change: CogIcon
    };
    return icons[type as keyof typeof icons] || ExclamationTriangleIcon;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
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
              <h1 className="text-3xl font-bold text-gray-900">Gelişmiş Güvenlik Modülü</h1>
              <p className="text-gray-600 mt-1">Kapsamlı güvenlik yönetimi ve tehdit analizi</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <CogIcon className="w-4 h-4 mr-2 inline" />
                Ayarlar
              </button>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <ShieldCheckIcon className="w-4 h-4 mr-2 inline" />
                Güvenlik Taraması
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Güvenlik Skoru</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.securityScore}%</p>
                <p className="text-sm text-gray-500">Genel durum</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ShieldCheckIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Tehdit</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.totalThreats}</p>
                <p className="text-sm text-gray-500">Bu ay</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engellenen Deneme</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.blockedAttempts}</p>
                <p className="text-sm text-gray-500">Son 24 saat</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <LockClosedIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.activeUsers}</p>
                <p className="text-sm text-gray-500">Şu anda</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Security Events */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Güvenlik Olayları</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Tümünü Gör
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {events.map((event) => {
                  const Icon = getTypeIcon(event.type);
                  return (
                    <div key={event.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-white rounded-full">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                            {getSeverityText(event.severity)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {getStatusText(event.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 mb-1">{event.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Kullanıcı: {event.user}</span>
                          <span>IP: {event.ip}</span>
                          <span>{new Date(event.timestamp).toLocaleString('tr-TR')}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Security Policies */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Güvenlik Politikaları</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Yeni Politika
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {policies.map((policy) => (
                  <div key={policy.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{policy.name}</h4>
                        <p className="text-sm text-gray-600">{policy.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${policy.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                        <span className="text-xs text-gray-500">
                          {policy.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-900 mb-1">Kurallar:</h5>
                      <div className="flex flex-wrap gap-1">
                        {policy.rules.map((rule, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {rule}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Son güncelleme: {new Date(policy.lastUpdated).toLocaleDateString('tr-TR')}</span>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">Düzenle</button>
                        <button className="text-red-600 hover:text-red-700">Sil</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Güvenlik Özellikleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <KeyIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Şifre Yönetimi</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Güçlü şifre politikaları ve otomatik şifre yenileme sistemi
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Ayarları Yönet
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserGroupIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Erişim Kontrolü</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Rol tabanlı erişim kontrolü ve izin yönetimi sistemi
              </p>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Rolleri Yönet
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CpuChipIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Tehdit Analizi</h3>
              </div>
              <p className="text-gray-600 mb-4">
                AI destekli tehdit tespiti ve otomatik güvenlik analizi
              </p>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Analizi Başlat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
