'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './Toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  twoFactorEnabled: boolean;
  permissions: string[];
  loginAttempts: number;
  lockedUntil?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  level: number;
  color: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
}

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'success' | 'failed' | 'blocked';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityAlert {
  id: string;
  type: 'login_anomaly' | 'permission_violation' | 'data_breach' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  affectedUsers: string[];
  recommendedAction: string;
}

export default function AdvancedSecuritySystem() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'users' | 'roles' | 'audit' | 'alerts' | 'settings'>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersResponse, rolesResponse, permissionsResponse, auditResponse, alertsResponse] = await Promise.all([
        fetch('/api/security/users'),
        fetch('/api/security/roles'),
        fetch('/api/security/permissions'),
        fetch('/api/security/audit-logs'),
        fetch('/api/security/alerts')
      ]);

      const [usersData, rolesData, permissionsData, auditData, alertsData] = await Promise.all([
        usersResponse.json(),
        rolesResponse.json(),
        permissionsResponse.json(),
        auditResponse.json(),
        alertsResponse.json()
      ]);

      setUsers(usersData);
      setRoles(rolesData);
      setPermissions(permissionsData);
      setAuditLogs(auditData);
      setSecurityAlerts(alertsData);
    } catch (error) {
      console.error('Security fetch error:', error);
      addToast({
        type: 'error',
        title: 'Güvenlik Verisi Hatası',
        message: 'Güvenlik verileri yüklenirken hata oluştu'
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const enableTwoFactor = async (userId: string) => {
    try {
      const response = await fetch('/api/security/two-factor/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        const result = await response.json();
        setShowTwoFactorSetup(true);
        
        addToast({
          type: 'success',
          title: '2FA Etkinleştirildi',
          message: 'İki faktörlü kimlik doğrulama etkinleştirildi'
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: '2FA Hatası',
        message: 'İki faktörlü kimlik doğrulama etkinleştirilemedi'
      });
    }
  };

  const disableTwoFactor = async (userId: string) => {
    try {
      const response = await fetch('/api/security/two-factor/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        addToast({
          type: 'success',
          title: '2FA Devre Dışı',
          message: 'İki faktörlü kimlik doğrulama devre dışı bırakıldı'
        });
        fetchSecurityData();
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: '2FA Hatası',
        message: 'İki faktörlü kimlik doğrulama devre dışı bırakılamadı'
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/security/users/role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      });

      if (response.ok) {
        addToast({
          type: 'success',
          title: 'Rol Güncellendi',
          message: 'Kullanıcı rolü başarıyla güncellendi'
        });
        fetchSecurityData();
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Rol Hatası',
        message: 'Kullanıcı rolü güncellenemedi'
      });
    }
  };

  const lockUser = async (userId: string, reason: string) => {
    try {
      const response = await fetch('/api/security/users/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason })
      });

      if (response.ok) {
        addToast({
          type: 'success',
          title: 'Kullanıcı Kilitlendi',
          message: 'Kullanıcı hesabı güvenlik nedeniyle kilitlendi'
        });
        fetchSecurityData();
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Kilitleme Hatası',
        message: 'Kullanıcı hesabı kilitlenemedi'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Güvenlik verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <i className="ri-shield-check-line text-3xl text-blue-600 mr-3"></i>
            Gelişmiş Güvenlik Sistemi
          </h2>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Sistem Güvenli</span>
            </div>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'users', label: 'Kullanıcılar', icon: 'ri-user-line' },
            { key: 'roles', label: 'Roller', icon: 'ri-group-line' },
            { key: 'audit', label: 'Audit Logs', icon: 'ri-file-list-line' },
            { key: 'alerts', label: 'Güvenlik Uyarıları', icon: 'ri-alarm-warning-line' },
            { key: 'settings', label: 'Güvenlik Ayarları', icon: 'ri-settings-3-line' }
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                viewMode === mode.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className={`${mode.icon} mr-2`}></i>
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users View */}
      {viewMode === 'users' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <i className="ri-user-line text-2xl text-blue-600"></i>
                </div>
                <div className="text-sm font-medium text-blue-600">
                  Toplam
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {users.length}
              </div>
              <div className="text-sm text-gray-600">Kullanıcı</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <i className="ri-shield-check-line text-2xl text-green-600"></i>
                </div>
                <div className="text-sm font-medium text-green-600">
                  2FA Aktif
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {users.filter(u => u.twoFactorEnabled).length}
              </div>
              <div className="text-sm text-gray-600">Güvenli Hesap</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <i className="ri-lock-line text-2xl text-red-600"></i>
                </div>
                <div className="text-sm font-medium text-red-600">
                  Kilitli
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {users.filter(u => u.status === 'suspended').length}
              </div>
              <div className="text-sm text-gray-600">Kilitli Hesap</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <i className="ri-alarm-warning-line text-2xl text-orange-600"></i>
                </div>
                <div className="text-sm font-medium text-orange-600">
                  Risk
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {users.filter(u => u.loginAttempts > 3).length}
              </div>
              <div className="text-sm text-gray-600">Yüksek Risk</div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Kullanıcı Yönetimi</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      2FA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Son Giriş
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksiyonlar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${user.twoFactorEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm text-gray-900">
                            {user.twoFactorEnabled ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(user.lastLogin).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => user.twoFactorEnabled ? disableTwoFactor(user.id) : enableTwoFactor(user.id)}
                            className={`${user.twoFactorEnabled ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          >
                            {user.twoFactorEnabled ? '2FA Kapat' : '2FA Aç'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Roles View */}
      {viewMode === 'roles' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Rol ve İzin Yönetimi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{role.name}</h4>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: role.color }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Seviye:</span>
                    <span className="font-semibold">{role.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">İzin Sayısı:</span>
                    <span className="font-semibold">{role.permissions.length}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">İzinler:</h5>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map((permission) => (
                      <span key={permission} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {permission}
                      </span>
                    ))}
                    {role.permissions.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{role.permissions.length - 3} daha
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Logs View */}
      {viewMode === 'audit' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Audit Logs</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksiyon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kaynak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Adresi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Seviyesi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditLogs.slice(0, 20).map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                      <div className="text-sm text-gray-500">{log.userId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === 'success' ? 'bg-green-100 text-green-600' :
                        log.status === 'failed' ? 'bg-red-100 text-red-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.resource}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(log.riskLevel)}`}>
                        {log.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.timestamp).toLocaleString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Security Alerts View */}
      {viewMode === 'alerts' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Güvenlik Uyarıları</h3>
          <div className="space-y-4">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${
                      alert.severity === 'critical' ? 'bg-red-100' :
                      alert.severity === 'high' ? 'bg-orange-100' :
                      alert.severity === 'medium' ? 'bg-yellow-100' :
                      'bg-green-100'
                    }`}>
                      <i className={`text-lg ${
                        alert.type === 'login_anomaly' ? 'ri-login-circle-line' :
                        alert.type === 'permission_violation' ? 'ri-shield-cross-line' :
                        alert.type === 'data_breach' ? 'ri-database-2-line' :
                        'ri-eye-line'
                      } ${
                        alert.severity === 'critical' ? 'text-red-600' :
                        alert.severity === 'high' ? 'text-orange-600' :
                        alert.severity === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.status === 'new' ? 'bg-blue-100 text-blue-600' :
                      alert.status === 'investigating' ? 'bg-yellow-100 text-yellow-600' :
                      alert.status === 'resolved' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-700">
                    <strong>Önerilen Aksiyon:</strong> {alert.recommendedAction}
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(alert.timestamp).toLocaleString('tr-TR')}
                  </span>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                      İncele
                    </button>
                    <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors">
                      Çöz
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Settings View */}
      {viewMode === 'settings' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Güvenlik Ayarları</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Kimlik Doğrulama</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">İki Faktörlü Kimlik Doğrulama</span>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-green-600">Aktif</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Oturum Süresi</span>
                    <span className="text-sm font-medium">8 saat</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Maksimum Giriş Denemesi</span>
                    <span className="text-sm font-medium">5</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Şifre Politikası</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Minimum Uzunluk</span>
                    <span className="text-sm font-medium">8 karakter</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Büyük/Küçük Harf</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sayı Gereksinimi</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Özel Karakter</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Ağ Güvenliği</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">IP Kısıtlaması</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">VPN Gereksinimi</span>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Şüpheli Aktivite Tespiti</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Veri Koruması</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Veri Şifreleme</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Yedekleme</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">GDPR Uyumluluğu</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
