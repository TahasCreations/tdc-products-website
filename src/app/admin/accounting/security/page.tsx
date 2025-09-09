'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminProtection from '../../../../components/AdminProtection';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'accountant' | 'cashier' | 'auditor' | 'viewer';
  permissions: string[];
  is_main_admin: boolean;
  is_active: boolean;
  last_login: string;
  created_at: string;
  created_by: string;
}

interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  table_name: string;
  record_id: string;
  old_values: any;
  new_values: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

interface SecurityReport {
  total_users: number;
  active_users: number;
  failed_logins: number;
  suspicious_activities: number;
  last_24h_logins: number;
  role_distribution: Record<string, number>;
}

export default function SecurityPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securityReport, setSecurityReport] = useState<SecurityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'audit' | 'reports' | 'settings'>('users');
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Yeni kullanıcı formu state'leri
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'viewer' as 'owner' | 'accountant' | 'cashier' | 'auditor' | 'viewer',
    permissions: [] as string[],
    is_active: true
  });

  // Güvenlik ayarları state'leri
  const [securitySettings, setSecuritySettings] = useState({
    password_min_length: 8,
    password_require_uppercase: true,
    password_require_lowercase: true,
    password_require_numbers: true,
    password_require_symbols: false,
    session_timeout: 480, // 8 saat
    max_login_attempts: 5,
    lockout_duration: 30, // 30 dakika
    mfa_enabled: false,
    audit_log_retention: 365 // 1 yıl
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAdminUsers(),
        fetchAuditLogs(),
        fetchSecurityReport()
      ]);
    } catch (error) {
      console.error('Data fetch error:', error);
      setError('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchAdminUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Admin kullanıcıları alınamadı');
      const data = await response.json();
      setAdminUsers(data);
    } catch (error) {
      console.error('Admin users fetch error:', error);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('/api/admin/audit-logs');
      if (!response.ok) throw new Error('Audit logları alınamadı');
      const data = await response.json();
      setAuditLogs(data);
    } catch (error) {
      console.error('Audit logs fetch error:', error);
    }
  };

  const fetchSecurityReport = async () => {
    try {
      const response = await fetch('/api/admin/security-report');
      if (!response.ok) throw new Error('Güvenlik raporu alınamadı');
      const data = await response.json();
      setSecurityReport(data);
    } catch (error) {
      console.error('Security report fetch error:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error('Kullanıcı eklenemedi');

      await fetchAdminUsers();
      setShowUserForm(false);
      setNewUser({
        email: '',
        name: '',
        role: 'viewer',
        permissions: [],
        is_active: true
      });
      setError('');
    } catch (error) {
      console.error('Add user error:', error);
      setError('Kullanıcı eklenirken hata oluştu');
    }
  };

  const handleUpdateUser = async (userId: string, userData: Partial<AdminUser>) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error('Kullanıcı güncellenemedi');

      await fetchAdminUsers();
    } catch (error) {
      console.error('Update user error:', error);
      setError('Kullanıcı güncellenirken hata oluştu');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Kullanıcı silinemedi');

      await fetchAdminUsers();
    } catch (error) {
      console.error('Delete user error:', error);
      setError('Kullanıcı silinirken hata oluştu');
    }
  };

  const handleSaveSecuritySettings = async () => {
    try {
      const response = await fetch('/api/admin/security-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(securitySettings),
      });

      if (!response.ok) throw new Error('Güvenlik ayarları kaydedilemedi');

      setError('');
      alert('Güvenlik ayarları başarıyla kaydedildi');
    } catch (error) {
      console.error('Save security settings error:', error);
      setError('Güvenlik ayarları kaydedilirken hata oluştu');
    }
  };

  const filteredUsers = adminUsers.filter(user => {
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    const matchesSearch = log.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.table_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const roleLabels = {
    owner: 'Sahip',
    accountant: 'Muhasebeci',
    cashier: 'Kasa',
    auditor: 'Denetçi',
    viewer: 'Görüntüleyici'
  };

  const permissionLabels = {
    'all': 'Tüm Yetkiler',
    'read': 'Okuma',
    'write': 'Yazma',
    'delete': 'Silme',
    'admin': 'Admin',
    'reports': 'Raporlar',
    'settings': 'Ayarlar'
  };

  if (loading) {
    return (
      <AdminProtection requireMainAdmin={true}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Güvenlik verileri yükleniyor...</p>
          </div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection requireMainAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Güvenlik Yönetimi</h1>
                <p className="mt-2 text-gray-600">RBAC, Audit Log ve güvenlik ayarları</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowUserForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-user-add-line mr-2"></i>
                  Yeni Kullanıcı
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-user-settings-line mr-2"></i>
                  Kullanıcı Yönetimi
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'audit'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-file-list-line mr-2"></i>
                  Audit Log
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reports'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-shield-check-line mr-2"></i>
                  Güvenlik Raporları
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'settings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-settings-3-line mr-2"></i>
                  Güvenlik Ayarları
                </button>
              </nav>
            </div>
          </div>

          {/* Kullanıcı Yönetimi Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Filtreler */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Ad veya e-posta ile ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ALL">Tüm Roller</option>
                      <option value="owner">Sahip</option>
                      <option value="accountant">Muhasebeci</option>
                      <option value="cashier">Kasa</option>
                      <option value="auditor">Denetçi</option>
                      <option value="viewer">Görüntüleyici</option>
                    </select>
                    <span className="text-sm text-gray-600">
                      Toplam: {filteredUsers.length} kullanıcı
                    </span>
                  </div>
                </div>
              </div>

              {/* Kullanıcı Listesi */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Admin Kullanıcıları</h2>
                </div>
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
                          Yetkiler
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Son Giriş
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <i className="ri-user-line text-blue-600"></i>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                user.role === 'owner' ? 'bg-red-100 text-red-800' :
                                user.role === 'accountant' ? 'bg-blue-100 text-blue-800' :
                                user.role === 'cashier' ? 'bg-green-100 text-green-800' :
                                user.role === 'auditor' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {roleLabels[user.role]}
                              </span>
                              {user.is_main_admin && (
                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                  Ana Admin
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.permissions.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {user.permissions.slice(0, 2).map((permission, index) => (
                                    <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                      {permissionLabels[permission as keyof typeof permissionLabels] || permission}
                                    </span>
                                  ))}
                                  {user.permissions.length > 2 && (
                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                      +{user.permissions.length - 2}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-500">Yetki yok</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              user.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.is_active ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.last_login ? new Date(user.last_login).toLocaleDateString('tr-TR') : 'Hiç giriş yapmamış'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Düzenle"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              {!user.is_main_admin && (
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Sil"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Audit Log Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              {/* Filtreler */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Kullanıcı, işlem veya tablo ile ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={filterAction}
                      onChange={(e) => setFilterAction(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="ALL">Tüm İşlemler</option>
                      <option value="INSERT">Ekleme</option>
                      <option value="UPDATE">Güncelleme</option>
                      <option value="DELETE">Silme</option>
                      <option value="LOGIN">Giriş</option>
                      <option value="LOGOUT">Çıkış</option>
                    </select>
                    <span className="text-sm text-gray-600">
                      Toplam: {filteredAuditLogs.length} kayıt
                    </span>
                  </div>
                </div>
              </div>

              {/* Audit Log Listesi */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Audit Log Kayıtları</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kullanıcı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlem
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tablo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IP Adresi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Detay
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAuditLogs.slice(0, 100).map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(log.created_at).toLocaleDateString('tr-TR')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(log.created_at).toLocaleTimeString('tr-TR')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {log.user_email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              log.action === 'INSERT' ? 'bg-green-100 text-green-800' :
                              log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                              log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                              log.action === 'LOGIN' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {log.table_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-mono">
                              {log.ip_address}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              title="Detayları Görüntüle"
                            >
                              <i className="ri-eye-line"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Güvenlik Raporları Tab */}
          {activeTab === 'reports' && securityReport && (
            <div className="space-y-6">
              {/* Güvenlik Özeti */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <i className="ri-user-line text-2xl text-blue-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Toplam Kullanıcı</p>
                      <p className="text-2xl font-bold text-gray-900">{securityReport.total_users}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <i className="ri-user-check-line text-2xl text-green-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Aktif Kullanıcı</p>
                      <p className="text-2xl font-bold text-gray-900">{securityReport.active_users}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <i className="ri-error-warning-line text-2xl text-red-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Başarısız Giriş</p>
                      <p className="text-2xl font-bold text-gray-900">{securityReport.failed_logins}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <i className="ri-shield-alert-line text-2xl text-yellow-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Şüpheli Aktivite</p>
                      <p className="text-2xl font-bold text-gray-900">{securityReport.suspicious_activities}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rol Dağılımı */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rol Dağılımı</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(securityReport.role_distribution).map(([role, count]) => (
                    <div key={role} className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{count}</div>
                      <div className="text-sm text-gray-500">{roleLabels[role as keyof typeof roleLabels]}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Son 24 Saat Girişler */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Son 24 Saat Girişler</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{securityReport.last_24h_logins}</div>
                  <div className="text-sm text-gray-500">Giriş yapıldı</div>
                </div>
              </div>
            </div>
          )}

          {/* Güvenlik Ayarları Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Güvenlik Ayarları</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Şifre Politikaları */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Şifre Politikaları</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Şifre Uzunluğu
                        </label>
                        <input
                          type="number"
                          value={securitySettings.password_min_length}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, password_min_length: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={securitySettings.password_require_uppercase}
                            onChange={(e) => setSecuritySettings(prev => ({ ...prev, password_require_uppercase: e.target.checked }))}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Büyük harf zorunlu</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={securitySettings.password_require_lowercase}
                            onChange={(e) => setSecuritySettings(prev => ({ ...prev, password_require_lowercase: e.target.checked }))}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Küçük harf zorunlu</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={securitySettings.password_require_numbers}
                            onChange={(e) => setSecuritySettings(prev => ({ ...prev, password_require_numbers: e.target.checked }))}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Rakam zorunlu</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={securitySettings.password_require_symbols}
                            onChange={(e) => setSecuritySettings(prev => ({ ...prev, password_require_symbols: e.target.checked }))}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Özel karakter zorunlu</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Oturum Ayarları */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Oturum Ayarları</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Oturum Süresi (dakika)
                        </label>
                        <input
                          type="number"
                          value={securitySettings.session_timeout}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, session_timeout: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maksimum Giriş Denemesi
                        </label>
                        <input
                          type="number"
                          value={securitySettings.max_login_attempts}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, max_login_attempts: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kilitleme Süresi (dakika)
                        </label>
                        <input
                          type="number"
                          value={securitySettings.lockout_duration}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, lockout_duration: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Audit Log Saklama (gün)
                        </label>
                        <input
                          type="number"
                          value={securitySettings.audit_log_retention}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, audit_log_retention: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end">
                  <button
                    onClick={handleSaveSecuritySettings}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Ayarları Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Yeni Kullanıcı Formu */}
          {showUserForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Yeni Kullanıcı</h2>
                  <button
                    onClick={() => setShowUserForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="kullanici@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad *
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Kullanıcı Adı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol *
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="viewer">Görüntüleyici</option>
                      <option value="auditor">Denetçi</option>
                      <option value="cashier">Kasa</option>
                      <option value="accountant">Muhasebeci</option>
                      <option value="owner">Sahip</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end space-x-4">
                  <button
                    onClick={() => setShowUserForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleAddUser}
                    disabled={!newUser.email.trim() || !newUser.name.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hata Mesajı */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}
