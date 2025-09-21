'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { 
  DocumentTextIcon,
  PhotoIcon,
  LinkIcon,
  CodeBracketIcon,
  ListBulletIcon,
  BoldIcon,
  ItalicIcon,
  LinkSlashIcon,
  EyeIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadedAt: Date;
}

interface BlogPost {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string | null;
  tags: string[];
  category: string;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt: Date | null;
}

export default function BlogWritePage() {
  const [post, setPost] = useState<BlogPost>({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: null,
    tags: [],
    category: '',
    status: 'draft',
    publishedAt: null
  });

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    await handleFileUpload(files);
  }, []);

  // File upload handler
  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true);
    
    try {
      for (const file of files) {
        // Simulate file upload
        const mockFile: MediaFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'document',
          size: file.size,
          uploadedAt: new Date()
        };
        
        setMediaFiles(prev => [...prev, mockFile]);
      }
    } catch (error) {
      console.error('File upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Insert image into content
  const insertImage = (imageUrl: string) => {
    const imageMarkdown = `![Image](${imageUrl})`;
    setPost(prev => ({
      ...prev,
      content: prev.content + imageMarkdown + '\n\n'
    }));
    setShowMediaLibrary(false);
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !post.tags.includes(newTag.trim())) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Blog Editörü</h1>
              <p className="text-gray-600">Sürükle-bırak ile kolay blog yazımı</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <EyeIcon className="w-4 h-4 mr-2 inline" />
                Önizleme
              </button>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <CheckIcon className="w-4 h-4 mr-2 inline" />
                Yayınla
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              {/* Title Input */}
              <div className="p-6 border-b">
                <input
                  type="text"
                  placeholder="Blog başlığı yazın..."
                  value={post.title}
                  onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full text-2xl font-bold border-none outline-none placeholder-gray-400"
                />
              </div>

              {/* Content Editor */}
              <div className="p-6">
                <div
                  className={`min-h-[500px] p-4 border-2 border-dashed rounded-lg transition-colors ${
                    isDragOver 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isDragOver && (
                    <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <PhotoIcon className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                        <p className="text-blue-600 font-medium">Dosyaları buraya bırakın</p>
                      </div>
                    </div>
                  )}

                  <textarea
                    placeholder="Blog içeriğinizi yazın... Görselleri sürükleyip bırakabilirsiniz."
                    value={post.content}
                    onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full h-full min-h-[400px] border-none outline-none resize-none placeholder-gray-400"
                  />

                  {/* Drag and Drop Hint */}
                  {post.content === '' && !isDragOver && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center text-gray-400">
                        <PhotoIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Görselleri sürükleyip bırakın</p>
                        <p className="text-sm">veya yazmaya başlayın</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Media Library */}
            {showMediaLibrary && (
              <div className="mt-6 bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Medya Kütüphanesi</h3>
                    <button
                      onClick={() => setShowMediaLibrary(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {mediaFiles.length === 0 ? (
                    <div className="text-center py-8">
                      <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Henüz medya dosyası yok</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {mediaFiles.map((file) => (
                        <div key={file.id} className="relative group">
                          {file.type === 'image' ? (
                            <Image
                              src={file.url}
                              alt={file.name}
                              width={200}
                              height={200}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                              <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all duration-200 flex items-center justify-center">
                            <button
                              onClick={() => insertImage(file.url)}
                              className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-3 py-1 rounded text-sm font-medium transition-all duration-200"
                            >
                              Ekle
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Öne Çıkan Görsel</h3>
              {post.featuredImage ? (
                <div className="relative">
                  <Image
                    src={post.featuredImage}
                    alt="Featured"
                    width={300}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setPost(prev => ({ ...prev, featuredImage: null }))}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Öne çıkan görsel seçin</p>
                  <button
                    onClick={() => setShowMediaLibrary(true)}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Medya Kütüphanesinden Seç
                  </button>
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Özet</h3>
              <textarea
                placeholder="Blog özeti yazın..."
                value={post.excerpt}
                onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Etiketler</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Etiket ekle..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                >
                  Ekle
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori</h3>
              <select
                value={post.category}
                onChange={(e) => setPost(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Kategori seçin</option>
                <option value="teknoloji">Teknoloji</option>
                <option value="isletme">İşletme</option>
                <option value="egitim">Eğitim</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="haberler">Haberler</option>
              </select>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Durum</h3>
              <select
                value={post.status}
                onChange={(e) => setPost(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayınlandı</option>
                <option value="scheduled">Zamanlandı</option>
              </select>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dosya Yükle</h3>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Dosyaları sürükleyip bırakın</p>
                <p className="text-sm text-gray-500 mb-4">veya</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Dosya Seç
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
                  className="hidden"
                />
              </div>
            </div>

            {/* Media Files List */}
            {mediaFiles.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Yüklenen Dosyalar</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {mediaFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <PhotoIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
