'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  KeyIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  LockClosedIcon,
  UserIcon,
  CogIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
  isActive: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
  isSystemPermission: boolean;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  isActive: boolean;
  lastLogin: string;
}

export default function RoleBasedAccess() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'users'>('roles');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, permissionsRes, usersRes] = await Promise.all([
        fetch('/api/security/roles'),
        fetch('/api/security/permissions'),
        fetch('/api/security/users')
      ]);

      if (rolesRes.ok) {
        const rolesData = await rolesRes.json();
        setRoles(rolesData);
      }

      if (permissionsRes.ok) {
        const permissionsData = await permissionsRes.json();
        setPermissions(permissionsData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (roleData: any) => {
    try {
      const response = await fetch('/api/security/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });

      if (response.ok) {
        await fetchData();
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Create role error:', error);
    }
  };

  const handleUpdateRole = async (roleId: string, roleData: any) => {
    try {
      const response = await fetch(`/api/security/roles/${roleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });

      if (response.ok) {
        await fetchData();
        setShowEditModal(false);
        setSelectedRole(null);
      }
    } catch (error) {
      console.error('Update role error:', error);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Bu rolü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/security/roles/${roleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Delete role error:', error);
    }
  };

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      const response = await fetch('/api/security/users/assign-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, roleId }),
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Assign role error:', error);
    }
  };

  const handleRemoveRole = async (userId: string, roleId: string) => {
    try {
      const response = await fetch('/api/security/users/remove-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, roleId }),
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Remove role error:', error);
    }
  };

  const getPermissionGroups = () => {
    const groups: { [key: string]: Permission[] } = {};
    permissions.forEach(permission => {
      if (!groups[permission.resource]) {
        groups[permission.resource] = [];
      }
      groups[permission.resource].push(permission);
    });
    return groups;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-16"></div>
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
            Rol Tabanlı Erişim Kontrolü
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kullanıcı rolleri ve izinleri yönetin
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Yeni Rol
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'roles', name: 'Roller', icon: UserGroupIcon },
            { id: 'permissions', name: 'İzinler', icon: KeyIcon },
            { id: 'users', name: 'Kullanıcılar', icon: UserIcon }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {role.displayName}
                    </h3>
                    {role.isSystemRole && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Sistem Rolü
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      role.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {role.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {role.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{role.userCount} kullanıcı</span>
                    <span>{role.permissions.length} izin</span>
                    <span>Oluşturulma: {new Date(role.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                  
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      İzinler:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.slice(0, 5).map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                        >
                          {permission}
                        </span>
                      ))}
                      {role.permissions.length > 5 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                          +{role.permissions.length - 5} daha
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setSelectedRole(role);
                      setShowEditModal(true);
                    }}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Düzenle"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  {!role.isSystemRole && (
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Sil"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          {Object.entries(getPermissionGroups()).map(([resource, resourcePermissions]) => (
            <div
              key={resource}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 capitalize">
                {resource} İzinleri
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resourcePermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {permission.action}
                      </h4>
                      {permission.isSystemPermission && (
                        <LockClosedIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {permission.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {user.firstName} {user.lastName}
                    </h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {user.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span>Son giriş: {new Date(user.lastLogin).toLocaleDateString('tr-TR')}</span>
                    <span>{user.roles.length} rol</span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Roller:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <div
                          key={role.id}
                          className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                        >
                          <span>{role.displayName}</span>
                          <button
                            onClick={() => handleRemoveRole(user.id, role.id)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                          >
                            <XCircleIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAssignRole(user.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Rol Ekle</option>
                    {roles.filter(role => !user.roles.find(userRole => userRole.id === role.id)).map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Role Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {showCreateModal ? 'Yeni Rol Oluştur' : 'Rolü Düzenle'}
              </h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const roleData = {
                  name: formData.get('name'),
                  displayName: formData.get('displayName'),
                  description: formData.get('description'),
                  permissions: Array.from(formData.getAll('permissions')),
                  isActive: formData.get('isActive') === 'on'
                };

                if (showCreateModal) {
                  handleCreateRole(roleData);
                } else if (selectedRole) {
                  handleUpdateRole(selectedRole.id, roleData);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rol Adı
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedRole?.name || ''}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Görünen Ad
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      defaultValue={selectedRole?.displayName || ''}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Açıklama
                    </label>
                    <textarea
                      name="description"
                      defaultValue={selectedRole?.description || ''}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      İzinler
                    </label>
                    <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                      {Object.entries(getPermissionGroups()).map(([resource, resourcePermissions]) => (
                        <div key={resource} className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 capitalize">
                            {resource}
                          </h4>
                          <div className="space-y-1">
                            {resourcePermissions.map((permission) => (
                              <label key={permission.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="permissions"
                                  value={permission.name}
                                  defaultChecked={selectedRole?.permissions.includes(permission.name) || false}
                                  className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                  {permission.action} - {permission.description}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={selectedRole?.isActive !== false}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Aktif
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setSelectedRole(null);
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {showCreateModal ? 'Oluştur' : 'Güncelle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
