'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = [
    { id: 1, name: 'Fantasy', slug: 'fantasy', productCount: 25, status: 'active', color: '#8B5CF6' },
    { id: 2, name: 'Anime', slug: 'anime', productCount: 18, status: 'active', color: '#06B6D4' },
    { id: 3, name: 'Action', slug: 'action', productCount: 12, status: 'active', color: '#EF4444' },
    { id: 4, name: 'Cute', slug: 'cute', productCount: 8, status: 'active', color: '#F59E0B' },
    { id: 5, name: 'Sci-Fi', slug: 'sci-fi', productCount: 15, status: 'active', color: '#10B981' },
    { id: 6, name: 'Horror', slug: 'horror', productCount: 3, status: 'inactive', color: '#6B7280' }
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kategori Yönetimi</h1>
            <p className="text-gray-600">Ürün kategorilerini yönetin</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Kategori
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Kategori ara..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  category.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.status === 'active' ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Slug:</span>
                  <span className="text-gray-900 font-mono">{category.slug}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ürün Sayısı:</span>
                  <span className="text-gray-900 font-medium">{category.productCount}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                  Düzenle
                </button>
                <button className="flex-1 text-red-600 hover:text-red-900 text-sm font-medium">
                  Sil
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
