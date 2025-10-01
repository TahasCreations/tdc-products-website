'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function RolesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const adminAuth = document.cookie.includes('adminAuth=true');
    if (adminAuth) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      router.push('/admin');
    }
  }, [router]);

  const roles = [
    {
      id: 'ROLE-001',
      name: 'Super Admin',
      description: 'Tüm sistem yetkilerine sahip',
      permissions: ['read', 'write', 'delete', 'admin', 'finance', 'marketing', 'ai', 'system'],
      userCount: 2,
      status: 'active',
      createdAt: '2024-01-01',
      createdBy: 'System'
    },
    {
      id: 'ROLE-002',
      name: 'Finance Manager',
      description: 'Mali işlemler ve raporlama yetkisi',
      permissions: ['read', 'write', 'finance', 'reports'],
      userCount: 3,
      status: 'active',
      createdAt: '2024-02-15',
      createdBy: 'Super Admin'
    },
    {
      id: 'ROLE-003',
      name: 'Marketing Specialist',
      description: 'Pazarlama kampanyaları ve CRM yetkisi',
      permissions: ['read', 'write', 'marketing', 'crm', 'campaigns'],
      userCount: 5,
      status: 'active',
      createdAt: '2024-03-10',
      createdBy: 'Super Admin'
    },
    {
      id: 'ROLE-004',
      name: 'Support Agent',
      description: 'Müşteri destek ve temel işlemler',
      permissions: ['read', 'support', 'orders'],
      userCount: 8,
      status: 'active',
      createdAt: '2024-04-05',
      createdBy: 'Super Admin'
    },
    {
      id: 'ROLE-005',
      name: 'Analyst',
      description: 'Veri analizi ve raporlama',
      permissions: ['read', 'analytics', 'reports'],
      userCount: 2,
      status: 'active',
      createdAt: '2024-05-20',
      createdBy: 'Super Admin'
    }
  ];

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'finance': return 'bg-green-100 text-green-800';
      case 'marketing': return 'bg-blue-100 text-blue-800';
      case 'ai': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      case 'support': return 'bg-yellow-100 text-yellow-800';
      case 'analytics': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rol Yönetimi</h1>
            <p className="text-gray-600 mt-1">Kullanıcı rolleri ve yetki yönetimi</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ➕ Yeni Rol
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              📊 Rapor
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Rol</p>
                <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 text-xl">🔐</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Roller</p>
                <p className="text-2xl font-bold text-green-600">
                  {roles.filter(r => r.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-blue-600">
                  {roles.reduce((sum, r) => sum + r.userCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Rolleri</p>
                <p className="text-2xl font-bold text-red-600">
                  {roles.filter(r => r.permissions.includes('admin')).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-xl">👑</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rol ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRoles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">{role.userCount}</p>
                  <p className="text-xs text-gray-500">Kullanıcı</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Permissions */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Yetkiler:</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission, idx) => (
                      <span key={idx} className={`px-2 py-1 text-xs font-medium rounded-full ${getPermissionColor(permission)}`}>
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Oluşturan: {role.createdBy}</span>
                  <span>{new Date(role.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
                    ✏️ Düzenle
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                    👥 Kullanıcılar
                  </button>
                  <button className="flex-1 px-3 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors">
                    🗑️ Sil
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Role Modal */}
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Rol Oluştur</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rol Adı</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Rol Adı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={3}
                    placeholder="Rol açıklaması"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yetkiler</label>
                  <div className="space-y-2">
                    {['read', 'write', 'delete', 'admin', 'finance', 'marketing', 'ai', 'system', 'support', 'analytics'].map(permission => (
                      <label key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Oluştur
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </ModernAdminLayout>
  );
}
