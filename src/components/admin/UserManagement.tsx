'use client'

import { useState, useCallback } from 'react'
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, EyeIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import UserModal from './UserModal'
import { toast } from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN' | 'SELLER'
  is_active: boolean
  phone?: string
  address?: string
  created_at: string
  updated_at: string
}

interface UserManagementProps {
  initialUsers: User[]
}

const roleLabels = {
  USER: 'Kullanıcı',
  ADMIN: 'Yönetici',
  SELLER: 'Satıcı'
}

const roleColors = {
  USER: 'bg-blue-100 text-blue-800',
  ADMIN: 'bg-red-100 text-red-800',
  SELLER: 'bg-green-100 text-green-800'
}

export default function UserManagement({ initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = !roleFilter || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  const handleCreateUser = useCallback(async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (!response.ok) throw new Error('Kullanıcı oluşturulamadı')

      const newUser = await response.json()
      setUsers(prev => [newUser, ...prev])
      toast.success('Kullanıcı başarıyla oluşturuldu')
      setIsModalOpen(false)
    } catch (error) {
      toast.error('Kullanıcı oluşturulurken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleUpdateUser = useCallback(async (id: string, userData: Partial<User>) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (!response.ok) throw new Error('Kullanıcı güncellenemedi')

      const updatedUser = await response.json()
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u))
      toast.success('Kullanıcı başarıyla güncellendi')
      setIsModalOpen(false)
      setEditingUser(null)
    } catch (error) {
      toast.error('Kullanıcı güncellenirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleDeleteUser = useCallback(async (id: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Kullanıcı silinemedi')

      setUsers(prev => prev.filter(u => u.id !== id))
      toast.success('Kullanıcı başarıyla silindi')
    } catch (error) {
      toast.error('Kullanıcı silinirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tüm Roller</option>
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Yeni Kullanıcı
        </button>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Kullanıcı bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || roleFilter ? 'Arama kriterlerinize uygun kullanıcı bulunamadı.' : 'Henüz kullanıcı bulunmuyor.'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <li key={user.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                          {roleLabels[user.role]}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                      {user.phone && (
                        <p className="text-sm text-gray-500 truncate">
                          {user.phone}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        Kayıt: {new Date(user.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Düzenle"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Sil"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* User Modal */}
      {isModalOpen && (
        <UserModal
          user={editingUser}
          onSave={editingUser ? 
            (data) => handleUpdateUser(editingUser.id, data) : 
            handleCreateUser
          }
          onClose={() => {
            setIsModalOpen(false)
            setEditingUser(null)
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
