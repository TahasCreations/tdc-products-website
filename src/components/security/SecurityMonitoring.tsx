'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  ShieldExclamationIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ChartBarIcon,
  BellIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

interface SecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
  };
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

interface SecurityAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  isAcknowledged: boolean;
  isResolved: boolean;
  createdAt: string;
}

interface SecurityStats {
  totalEvents: number;
  criticalEvents: number;
  highEvents: number;
  mediumEvents: number;
  lowEvents: number;
  resolvedEvents: number;
  activeAlerts: number;
  failedLogins: number;
  suspiciousActivities: number;
}

export default function SecurityMonitoring() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchSecurityData = useCallback(async () => {
    try {
      setLoading(true);
      const [threatsRes, vulnerabilitiesRes, statsRes] = await Promise.all([
        fetch(`/api/security/threats?severity=${selectedSeverity}&status=${selectedType}`),
        fetch('/api/security/vulnerabilities'),
        fetch('/api/security/stats')
      ]);

      // Tehditleri işle
      if (threatsRes.ok) {
        const threatsData = await threatsRes.json();
        if (threatsData.success) {
          setEvents(threatsData.data.map((threat: any) => ({
            id: threat.id,
            type: threat.attackType || 'Unknown',
            severity: threat.severity,
            title: threat.title,
            description: threat.description,
            ipAddress: threat.sourceIp,
            userAgent: threat.userAgent,
            isResolved: threat.status === 'resolved' || threat.status === 'blocked',
            resolvedBy: threat.resolvedBy,
            resolvedAt: threat.resolvedAt,
            createdAt: threat.createdAt
          })));
        }
      }

      // Güvenlik açıklarını işle
      if (vulnerabilitiesRes.ok) {
        const vulnData = await vulnerabilitiesRes.json();
        if (vulnData.success) {
          setAlerts(vulnData.data.map((vuln: any) => ({
            id: vuln.id,
            type: 'Vulnerability',
            severity: vuln.severity,
            title: vuln.title,
            description: vuln.description,
            isAcknowledged: vuln.status === 'in_progress',
            isResolved: vuln.status === 'resolved',
            createdAt: vuln.createdAt
          })));
        }
      }

      // İstatistikleri işle
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats({
            totalEvents: statsData.data.totalThreats,
            criticalEvents: statsData.data.criticalThreats,
            highEvents: statsData.data.mediumThreats,
            mediumEvents: statsData.data.mediumThreats,
            lowEvents: statsData.data.lowThreats,
            resolvedEvents: statsData.data.blockedAttempts,
            activeAlerts: statsData.data.suspiciousActivities,
            failedLogins: statsData.data.failedLogins,
            suspiciousActivities: statsData.data.suspiciousActivities
          });
        }
      }
    } catch (error) {
      console.error('Security data fetch error:', error);
      
      // Fallback: Mock data
      setEvents([
        {
          id: '1',
          type: 'SQL Injection',
          severity: 'critical',
          title: 'SQL Injection Attempt',
          description: 'Malicious SQL injection attempt detected',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          isResolved: true,
          resolvedBy: 'admin@company.com',
          resolvedAt: '2024-01-20T10:35:00Z',
          createdAt: '2024-01-20T10:30:00Z'
        }
      ]);
      
      setAlerts([
        {
          id: '1',
          type: 'Vulnerability',
          severity: 'critical',
          title: 'SQL Injection Vulnerability',
          description: 'Application is vulnerable to SQL injection attacks',
          isAcknowledged: false,
          isResolved: false,
          createdAt: '2024-01-20T10:00:00Z'
        }
      ]);
      
      setStats({
        totalEvents: 23,
        criticalEvents: 2,
        highEvents: 8,
        mediumEvents: 8,
        lowEvents: 13,
        resolvedEvents: 21,
        activeAlerts: 7,
        failedLogins: 45,
        suspiciousActivities: 7
      });
    } finally {
      setLoading(false);
    }
  }, [selectedSeverity, selectedType]);

  useEffect(() => {
    fetchSecurityData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchSecurityData, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchSecurityData]);

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/security/alerts/${alertId}/acknowledge`, {
        method: 'POST',
      });

      if (response.ok) {
        await fetchSecurityData();
      }
    } catch (error) {
      console.error('Acknowledge alert error:', error);
    }
  };

  const handleResolveEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/security/events/${eventId}/resolve`, {
        method: 'POST',
      });

      if (response.ok) {
        await fetchSecurityData();
      }
    } catch (error) {
      console.error('Resolve event error:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'high':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      default:
        return <EyeIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('Mobile')) {
      return <DevicePhoneMobileIcon className="w-4 h-4" />;
    } else if (userAgent.includes('Tablet')) {
      return <DevicePhoneMobileIcon className="w-4 h-4" />;
    } else {
      return <ComputerDesktopIcon className="w-4 h-4" />;
    }
  };

  if (loading && !stats) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-20"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Güvenlik İzleme
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Güvenlik olayları ve tehdit tespiti
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Otomatik Yenileme:
            </label>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoRefresh ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoRefresh ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <button
            onClick={fetchSecurityData}
            className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ChartBarIcon className="w-4 h-4 mr-1" />
            Yenile
          </button>
        </div>
      </div>

      {/* Security Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg mr-3">
                <ShieldExclamationIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Kritik Olaylar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.criticalEvents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg mr-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Yüksek Öncelik</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.highEvents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg mr-3">
                <BellIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Aktif Uyarılar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.activeAlerts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                <LockClosedIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Başarısız Giriş</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.failedLogins}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">Tüm Öncelikler</option>
          <option value="critical">Kritik</option>
          <option value="high">Yüksek</option>
          <option value="medium">Orta</option>
          <option value="low">Düşük</option>
        </select>
        
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">Tüm Türler</option>
          <option value="failed_login">Başarısız Giriş</option>
          <option value="suspicious_activity">Şüpheli Aktivite</option>
          <option value="privilege_escalation">Yetki Yükseltme</option>
          <option value="data_breach_attempt">Veri İhlali Girişimi</option>
        </select>
      </div>

      {/* Security Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Aktif Güvenlik Uyarıları
          </h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getSeverityIcon(alert.severity)}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">
                          {alert.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {alert.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(alert.createdAt).toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!alert.isAcknowledged && (
                      <button
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Onayla
                      </button>
                    )}
                    {alert.isAcknowledged && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Onaylandı
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Events */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Güvenlik Olayları
        </h3>
        
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-16 animate-pulse"></div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getSeverityIcon(event.severity)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">
                          {event.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(event.severity)}`}>
                          {event.severity}
                        </span>
                        {event.isResolved && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Çözüldü
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {event.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-500">
                        {event.user && (
                          <div className="flex items-center space-x-1">
                            <UserIcon className="w-3 h-3" />
                            <span>{event.user.email}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <GlobeAltIcon className="w-3 h-3" />
                          <span>{event.ipAddress}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <span>{event.location.city}, {event.location.country}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          {getDeviceIcon(event.userAgent)}
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-3 h-3" />
                          <span>{new Date(event.createdAt).toLocaleString('tr-TR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!event.isResolved && (
                    <button
                      onClick={() => handleResolveEvent(event.id)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Çöz
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShieldExclamationIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Güvenlik Olayı Bulunamadı
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Seçilen kriterlere uygun güvenlik olayı bulunamadı.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
