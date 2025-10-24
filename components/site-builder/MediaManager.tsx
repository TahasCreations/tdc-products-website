"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Search,
  Grid as GridIcon,
  List,
  Folder,
  Image as ImageIcon,
  Video,
  File,
  X,
  Download,
  Trash2,
  Edit3,
  Check,
  Filter,
  SortAsc
} from 'lucide-react';
import { MediaAsset } from '@/lib/site-builder/types';

interface MediaManagerProps {
  onSelect?: (asset: MediaAsset) => void;
  allowMultiple?: boolean;
  filterType?: 'image' | 'video' | 'document' | 'all';
}

export const MediaManager: React.FC<MediaManagerProps> = ({
  onSelect,
  allowMultiple = false,
  filterType = 'all'
}) => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, [selectedFolder, filterType]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/site-builder/media?folder=${selectedFolder}&type=${filterType}`);
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

  const handleFileUpload = useCallback(async (files: FileList | null) => {
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
        const data = await response.json();
        setAssets(prev => [...data.assets, ...prev]);
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [selectedFolder]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const toggleAssetSelection = (id: string) => {
    const newSelection = new Set(selectedAssets);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      if (!allowMultiple) {
        newSelection.clear();
      }
      newSelection.add(id);
    }
    setSelectedAssets(newSelection);
  };

  const handleSelectAsset = (asset: MediaAsset) => {
    if (onSelect) {
      onSelect(asset);
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-6 h-6" />;
      case 'video': return <Video className="w-6 h-6" />;
      default: return <File className="w-6 h-6" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Upload */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Medya ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2 font-medium">
            <Upload className="w-4 h-4" />
            <span>Upload</span>
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

      {/* Drag & Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex-1 overflow-auto p-6"
      >
        {isUploading && (
          <div className="mb-4 p-4 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-blue-700">Yükleniyor...</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-center">
            <div>
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Medya Yok</h3>
              <p className="text-gray-600 text-sm mb-4">
                Dosyaları buraya sürükleyin veya upload butonunu kullanın
              </p>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedAssets.has(asset.id)
                    ? 'border-blue-600 shadow-lg'
                    : 'border-gray-200 hover:border-blue-400'
                }`}
                onClick={() => {
                  toggleAssetSelection(asset.id);
                  if (!allowMultiple) {
                    handleSelectAsset(asset);
                  }
                }}
              >
                {/* Thumbnail */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
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

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAsset(asset);
                    }}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100"
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </button>
                  <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                    <Download className="w-4 h-4 text-blue-600" />
                  </button>
                  <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                {/* Selection Indicator */}
                {selectedAssets.has(asset.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Info */}
                <div className="p-2 bg-white">
                  <p className="text-xs font-medium text-gray-900 truncate">{asset.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(asset.size)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => {
                  toggleAssetSelection(asset.id);
                  if (!allowMultiple) {
                    handleSelectAsset(asset);
                  }
                }}
                className={`flex items-center gap-4 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAssets.has(asset.id)
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  {asset.type === 'image' ? (
                    <img
                      src={asset.thumbnailUrl || asset.url}
                      alt={asset.alt || asset.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="text-gray-400">
                      {getAssetIcon(asset.type)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{asset.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(asset.size)} • {asset.width && asset.height && `${asset.width}x${asset.height}`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {selectedAssets.has(asset.id) && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with Selected Count */}
      {selectedAssets.size > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="text-sm text-gray-700 font-medium">
            {selectedAssets.size} seçildi
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedAssets(new Set())}
              className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 rounded"
            >
              Temizle
            </button>
            {allowMultiple && onSelect && (
              <button
                onClick={() => {
                  selectedAssets.forEach(id => {
                    const asset = assets.find(a => a.id === id);
                    if (asset && onSelect) onSelect(asset);
                  });
                }}
                className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Seç
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Media Manager Modal
interface MediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  filterType?: 'image' | 'video' | 'document' | 'all';
}

export const MediaManagerModal: React.FC<MediaManagerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  filterType = 'all'
}) => {
  if (!isOpen) return null;

  const handleSelect = (asset: MediaAsset) => {
    onSelect(asset);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Medya Seç</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Manager */}
            <div className="flex-1 overflow-hidden">
              <MediaManager onSelect={handleSelect} filterType={filterType} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

