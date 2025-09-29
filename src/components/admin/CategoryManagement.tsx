'use client'

import { useState, useCallback } from 'react'
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, Bars3Icon } from '@heroicons/react/24/outline'
import CategoryModal from './CategoryModal'
import { toast } from 'react-hot-toast'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

interface CategoryManagementProps {
  initialCategories: Category[]
}

export default function CategoryManagement({ initialCategories }: CategoryManagementProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateCategory = useCallback(async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      })

      if (!response.ok) throw new Error('Kategori oluşturulamadı')

      const newCategory = await response.json()
      setCategories(prev => [newCategory, ...prev])
      toast.success('Kategori başarıyla oluşturuldu')
      setIsModalOpen(false)
    } catch (error) {
      toast.error('Kategori oluşturulurken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleUpdateCategory = useCallback(async (id: string, categoryData: Partial<Category>) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      })

      if (!response.ok) throw new Error('Kategori güncellenemedi')

      const updatedCategory = await response.json()
      setCategories(prev => prev.map(c => c.id === id ? updatedCategory : c))
      toast.success('Kategori başarıyla güncellendi')
      setIsModalOpen(false)
      setEditingCategory(null)
    } catch (error) {
      toast.error('Kategori güncellenirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleDeleteCategory = useCallback(async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Kategori silinemedi')

      setCategories(prev => prev.filter(c => c.id !== id))
      toast.success('Kategori başarıyla silindi')
    } catch (error) {
      toast.error('Kategori silinirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingCategory(null)
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
              placeholder="Kategori ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Yeni Kategori
        </button>
      </div>

      {/* Categories List */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Kategori bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Arama kriterlerinize uygun kategori bulunamadı.' : 'Henüz kategori eklenmemiş.'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredCategories.map((category) => (
              <li key={category.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Drag Handle */}
                    <div className="flex-shrink-0">
                      <Bars3Icon className="h-5 w-5 text-gray-400 cursor-move" />
                    </div>

                    {/* Category Image */}
                    <div className="flex-shrink-0">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Category Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {category.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          category.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {category.description || 'Açıklama yok'}
                      </p>
                      <p className="text-xs text-gray-400">
                        Slug: {category.slug}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Düzenle"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
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

      {/* Category Modal */}
      {isModalOpen && (
        <CategoryModal
          category={editingCategory}
          onSave={editingCategory ? 
            (data) => handleUpdateCategory(editingCategory.id, data) : 
            handleCreateCategory
          }
          onClose={() => {
            setIsModalOpen(false)
            setEditingCategory(null)
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
