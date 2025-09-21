'use client';

import Image from 'next/image';
import { useState } from 'react';
import { 
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  SparklesIcon,
  FireIcon,
  TagIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface CampaignTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  elements: any[];
  createdAt: string;
  isActive: boolean;
}

const defaultTemplates: CampaignTemplate[] = [
  {
    id: '1',
    name: 'Anime Kampanya Template',
    category: 'Anime',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    elements: [],
    createdAt: '2024-01-01',
    isActive: true
  },
  {
    id: '2',
    name: 'Gaming Kampanya Template',
    category: 'Gaming',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    elements: [],
    createdAt: '2024-01-01',
    isActive: true
  },
  {
    id: '3',
    name: 'Film Kampanya Template',
    category: 'Film',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    elements: [],
    createdAt: '2024-01-01',
    isActive: true
  }
];

export default function CampaignTemplatesPage() {
  const [templates, setTemplates] = useState<CampaignTemplate[]>(defaultTemplates);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CampaignTemplate | null>(null);

  const categories = ['all', 'Anime', 'Gaming', 'Film', 'Yeni', 'Özel'];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleCreateTemplate = () => {
    setShowCreateModal(true);
  };

  const handleEditTemplate = (template: CampaignTemplate) => {
    setEditingTemplate(template);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Bu template\'i silmek istediğinize emin misiniz?')) {
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kampanya Template Sistemi</h1>
              <p className="text-gray-600 mt-1">Canva benzeri kampanya tasarım aracı</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateTemplate}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Yeni Template
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md border'
                }`}
              >
                {category === 'all' ? 'Tümü' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 group">
              <div className="relative">
                <Image
                  src={template.thumbnail}
                  alt={template.name}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                    {template.category}
                  </span>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="bg-white/90 text-gray-700 p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="bg-red-500/90 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Oluşturulma: {new Date(template.createdAt).toLocaleDateString('tr-TR')}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    template.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {template.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                  
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-green-600 transition-colors">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Template bulunamadı</h3>
            <p className="text-gray-600 mb-6">Bu kategoride henüz template yok.</p>
            <button
              onClick={handleCreateTemplate}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              İlk Template&apos;i Oluştur
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingTemplate) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingTemplate ? 'Template Düzenle' : 'Yeni Template Oluştur'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingTemplate(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Template Editor */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Template Tasarımı</h3>
                  
                  {/* Canvas Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Template tasarım alanı</p>
                      <p className="text-sm text-gray-400">Sürükle-bırak ile öğe ekle</p>
                    </div>
                  </div>
                  
                  {/* Design Tools */}
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                      <FireIcon className="w-5 h-5 text-red-500 mb-1" />
                      <p className="text-sm font-medium">Kampanya Başlığı</p>
                    </button>
                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                      <TagIcon className="w-5 h-5 text-blue-500 mb-1" />
                      <p className="text-sm font-medium">İndirim Etiketi</p>
                    </button>
                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                      <PhotoIcon className="w-5 h-5 text-green-500 mb-1" />
                      <p className="text-sm font-medium">Ürün Görseli</p>
                    </button>
                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                      <SparklesIcon className="w-5 h-5 text-purple-500 mb-1" />
                      <p className="text-sm font-medium">Açıklama</p>
                    </button>
                  </div>
                </div>
                
                {/* Template Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Template Ayarları</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template Adı
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Template adını girin"
                        defaultValue={editingTemplate?.name || ''}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="Anime">Anime</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Film">Film</option>
                        <option value="Yeni">Yeni</option>
                        <option value="Özel">Özel</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thumbnail
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <ArrowUpTrayIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Thumbnail yükleyin</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        defaultChecked={editingTemplate?.isActive || true}
                      />
                      <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                        Template aktif
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingTemplate(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                  {editingTemplate ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
