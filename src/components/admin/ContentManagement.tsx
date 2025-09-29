'use client'

import { useState } from 'react'
import { PlusIcon, DocumentTextIcon, GlobeAltIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState<'pages' | 'blogs'>('pages')

  const tabs = [
    { id: 'pages', name: 'Sayfalar', icon: GlobeAltIcon },
    { id: 'blogs', name: 'Blog Yazıları', icon: DocumentTextIcon }
  ]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'pages' ? (
        <PagesManagement />
      ) : (
        <BlogsManagement />
      )}
    </div>
  )
}

function PagesManagement() {
  const [pages] = useState([
    {
      id: '1',
      title: 'Ana Sayfa',
      slug: '/',
      status: 'published',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Hakkımızda',
      slug: '/about',
      status: 'published',
      updatedAt: '2024-01-10'
    },
    {
      id: '3',
      title: 'İletişim',
      slug: '/contact',
      status: 'draft',
      updatedAt: '2024-01-12'
    }
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Sayfalar</h2>
          <p className="text-sm text-gray-600">Web sitenizin sayfalarını yönetin</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <PlusIcon className="h-5 w-5 mr-2" />
          Yeni Sayfa
        </button>
      </div>

      {/* Pages List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {pages.map((page) => (
            <li key={page.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <GlobeAltIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">
                      {page.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {page.slug}
                    </p>
                    <p className="text-xs text-gray-400">
                      Son güncelleme: {new Date(page.updatedAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    page.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {page.status === 'published' ? 'Yayında' : 'Taslak'}
                  </span>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function BlogsManagement() {
  const [blogs] = useState([
    {
      id: '1',
      title: 'E-ticaret Trendleri 2024',
      slug: 'e-ticaret-trendleri-2024',
      status: 'published',
      author: 'Admin',
      publishedAt: '2024-01-15',
      views: 1250
    },
    {
      id: '2',
      title: 'Dijital Pazarlama Stratejileri',
      slug: 'dijital-pazarlama-stratejileri',
      status: 'published',
      author: 'Admin',
      publishedAt: '2024-01-10',
      views: 890
    },
    {
      id: '3',
      title: 'Müşteri Memnuniyeti Nasıl Artırılır?',
      slug: 'musteri-memnuniyeti-nasil-artirilir',
      status: 'draft',
      author: 'Admin',
      publishedAt: null,
      views: 0
    }
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Blog Yazıları</h2>
          <p className="text-sm text-gray-600">Blog içeriklerinizi yönetin</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <PlusIcon className="h-5 w-5 mr-2" />
          Yeni Blog Yazısı
        </button>
      </div>

      {/* Blogs List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {blogs.map((blog) => (
            <li key={blog.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      /blog/{blog.slug}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-xs text-gray-400">
                        Yazar: {blog.author}
                      </p>
                      {blog.publishedAt && (
                        <p className="text-xs text-gray-400">
                          Yayın: {new Date(blog.publishedAt).toLocaleDateString('tr-TR')}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        Görüntülenme: {blog.views}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    blog.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {blog.status === 'published' ? 'Yayında' : 'Taslak'}
                  </span>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
