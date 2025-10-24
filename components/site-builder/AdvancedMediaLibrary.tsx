"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Search,
  Grid as GridIcon,
  List,
  Folder,
  FolderPlus,
  Image as ImageIcon,
  Video,
  File,
  X,
  Download,
  Trash2,
  Edit3,
  Check,
  Filter,
  SortAsc,
  Tag,
  Maximize2,
  CheckSquare,
  MoreVertical,
  Move,
  Zap,
  Eye
} from 'lucide-react';
import { MediaAsset } from '@/lib/site-builder/types';

export const AdvancedMediaLibrary: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<string[]>(['Uncategorized', 'Products', 'Blog', 'Banners', 'Logos']);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    fetchAssets();
    fetchFolders();
  }, [selectedFolder, filterType, sortBy]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/site-builder/media?folder=${selectedFolder}&type=${filterType}&sort=${sortBy}`);
      if (response.ok) {
        const data = await response.json();
        setAssets(data.assets || []);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await fetch('/api/site-builder/media/folders');
      if (response.ok) {
        const data = await response.json();
        setFolders(data.folders || ['Uncategorized']);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    
    if (selectedFolder !== 'all') {
      formData.append('folder', selectedFolder);
    }

    try {
      const response = await fetch('/api/site-builder/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchAssets();
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const response = await fetch('/api/site-builder/media/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName }),
      });

      if (response.ok) {
        fetchFolders();
        setNewFolderName('');
        setShowNewFolderModal(false);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`${selectedAssets.size} dosyayı silmek istediğinizden emin misiniz?`)) return;

    try {
      const response = await fetch('/api/site-builder/media/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetIds: Array.from(selectedAssets) }),
      });

      if (response.ok) {
        setSelectedAssets(new Set());
        fetchAssets();
      }
    } catch (error) {
      console.error('Error deleting assets:', error);
    }
  };

  const handleBulkMove = async (targetFolder: string) => {
    try {
      const response = await fetch('/api/site-builder/media/bulk-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetIds: Array.from(selectedAssets), folder: targetFolder }),
      });

      if (response.ok) {
        setSelectedAssets(new Set());
        fetchAssets();
      }
    } catch (error) {
      console.error('Error moving assets:', error);
    }
  };

  const handleBulkTag = async () => {
    const tags = prompt('Etiketler (virgülle ayırın):');
    if (!tags) return;

    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);

    try {
      const response = await fetch('/api/site-builder/media/bulk-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetIds: Array.from(selectedAssets), tags: tagArray }),
      });

      if (response.ok) {
        fetchAssets();
      }
    } catch (error) {
      console.error('Error tagging assets:', error);
    }
  };

  const handleOptimize = async (assetId: string) => {
    try {
      const response = await fetch('/api/site-builder/media/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId }),
      });

      if (response.ok) {
        fetchAssets();
        alert('Görsel optimize edildi!');
      }
    } catch (error) {
      console.error('Error optimizing:', error);
    }
  };

  const toggleAssetSelection = (id: string) => {
    const newSelection = new Set(selectedAssets);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedAssets(newSelection);
  };

  const selectAll = () => {
    setSelectedAssets(new Set(filteredAssets.map(a => a.id)));
  };

  const deselectAll = () => {
    setSelectedAssets(new Set());
  };

  const filteredAssets = assets
    .filter(asset =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(asset => filterType === 'all' || asset.type === filterType);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-6 h-6" />;
      case 'video': return <Video className="w-6 h-6" />;
      default: return <File className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Folder Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Folder className="w-5 h-5" />
            Klasörler
          </h3>
          
          <button
            onClick={() => setShowNewFolderModal(true)}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            Yeni Klasör
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <button
            onClick={() => setSelectedFolder('all')}
            className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 transition-colors ${
              selectedFolder === 'all'
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>Tümü</span>
            <span className="ml-auto text-xs text-gray-500">{assets.length}</span>
          </button>

          <div className="mt-2 space-y-1">
            {folders.map(folder => (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 transition-colors ${
                  selectedFolder === folder
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Folder className="w-4 h-4" />
                <span>{folder}</span>
                <span className="ml-auto text-xs text-gray-500">
                  {assets.filter(a => a.folder === folder).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Medya Kütüphanesi</h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredAssets.length} dosya {selectedAssets.size > 0 && `(${selectedAssets.size} seçili)`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                >
                  <GridIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Upload */}
              <label className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 font-semibold">
                <Upload className="w-4 h-4" />
                <span>Yükle</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Dosya veya etiket ara..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Tipler</option>
              <option value="image">Görseller</option>
              <option value="video">Videolar</option>
              <option value="document">Dökümanlar</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Tarihe Göre</option>
              <option value="name">İsme Göre</option>
              <option value="size">Boyuta Göre</option>
            </select>

            {/* Select All */}
            {filteredAssets.length > 0 && (
              <button
                onClick={selectedAssets.size === filteredAssets.length ? deselectAll : selectAll}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <CheckSquare className="w-4 h-4" />
                {selectedAssets.size === filteredAssets.length ? 'Seçimi Kaldır' : 'Tümünü Seç'}
              </button>
            )}
          </div>
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedAssets.size > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between"
            >
              <span className="text-sm font-semibold text-blue-900">
                {selectedAssets.size} dosya seçildi
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkTag}
                  className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center gap-1"
                >
                  <Tag className="w-4 h-4" />
                  Etiketle
                </button>

                <div className="relative group">
                  <button className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center gap-1">
                    <Move className="w-4 h-4" />
                    Taşı
                  </button>
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-2 hidden group-hover:block min-w-40 z-10">
                    {folders.map(folder => (
                      <button
                        key={folder}
                        onClick={() => handleBulkMove(folder)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded text-sm"
                      >
                        {folder}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Sil
                </button>

                <button
                  onClick={deselectAll}
                  className="p-1.5 text-gray-600 hover:text-gray-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media Grid/List */}
        <div className="flex-1 overflow-auto p-6">
          {isUploading && (
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-2xl text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-blue-600 mx-auto mb-3"></div>
              <p className="text-blue-700 font-semibold">Yükleniyor...</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Medya Yok</h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Dosyaları buraya sürükleyin veya upload butonunu kullanın
                </p>
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer font-semibold">
                  <Upload className="w-5 h-5" />
                  İlk Dosyayı Yükle
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                    selectedAssets.has(asset.id)
                      ? 'border-blue-600 shadow-lg ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                  }`}
                  onClick={() => toggleAssetSelection(asset.id)}
                >
                  {/* Thumbnail */}
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    {asset.type === 'image' ? (
                      <img
                        src={asset.thumbnailUrl || asset.url}
                        alt={asset.alt || asset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400">
                        {getAssetIcon(asset.type)}
                      </div>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div className="flex items-center gap-1 mb-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(asset.url, '_blank');
                        }}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                        title="Görüntüle"
                      >
                        <Eye className="w-4 h-4 text-gray-900" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOptimize(asset.id);
                        }}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                        title="Optimize Et"
                      >
                        <Zap className="w-4 h-4 text-yellow-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit modal
                        }}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                        title="Düzenle"
                      >
                        <Edit3 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                        title="İndir"
                      >
                        <Download className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedAssets.has(asset.id) && (
                    <div className="absolute top-3 right-3 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-3 bg-white">
                    <p className="text-sm font-medium text-gray-900 truncate" title={asset.name}>
                      {asset.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{formatFileSize(asset.size)}</span>
                      {asset.width && asset.height && (
                        <span className="text-xs text-gray-500">{asset.width}×{asset.height}</span>
                      )}
                    </div>
                    {asset.tags && asset.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {asset.tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {asset.tags.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            +{asset.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.01 }}
                  onClick={() => toggleAssetSelection(asset.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedAssets.has(asset.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedAssets.has(asset.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                  }`}>
                    {selectedAssets.has(asset.id) && <Check className="w-3 h-3 text-white" />}
                  </div>

                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {asset.type === 'image' ? (
                      <img
                        src={asset.thumbnailUrl || asset.url}
                        alt={asset.alt || asset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400">
                        {getAssetIcon(asset.type)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{asset.name}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>{formatFileSize(asset.size)}</span>
                      {asset.width && asset.height && <span>{asset.width}×{asset.height}</span>}
                      <span>{new Date(asset.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    {asset.tags && asset.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {asset.tags.map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptimize(asset.id);
                      }}
                      className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                      title="Optimize"
                    >
                      <Zap className="w-4 h-4 text-yellow-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Folder Modal */}
      <AnimatePresence>
        {showNewFolderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewFolderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Yeni Klasör</h3>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Klasör adı..."
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNewFolderModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleCreateFolder}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Oluştur
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

