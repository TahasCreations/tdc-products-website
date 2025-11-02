'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Folder, Check } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface MediaUploaderProps {
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function MediaUploader({ onClose, onSelect }: MediaUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  // Drag & Drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);

    try {
      // Dosyaları yükle (gerçek API'ye gönderilecek)
      const uploaded = await Promise.all(
        acceptedFiles.map(async (file) => {
          // Mock upload - gerçekte API'ye gönderilecek
          const url = URL.createObjectURL(file);
          return {
            id: Math.random().toString(36),
            name: file.name,
            url: url,
            size: file.size,
            type: file.type
          };
        })
      );

      setUploadedFiles(prev => [...prev, ...uploaded]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Yükleme hatası!');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
    },
    multiple: true
  });

  const handleSelectMedia = () => {
    if (selectedMedia) {
      onSelect(selectedMedia);
    }
  };

  // Mock existing media library
  const existingMedia = [
    { id: '1', url: '/images/hero/sample-1.jpg', name: 'Hero Banner 1' },
    { id: '2', url: '/images/hero/sample-2.jpg', name: 'Hero Banner 2' },
    { id: '3', url: '/images/products/sample-1.jpg', name: 'Product Image 1' },
  ];

  const allMedia = [...uploadedFiles, ...existingMedia];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Medya Kütüphanesi</h2>
              <p className="text-sm text-gray-600">Görsel yükleyin veya mevcut görsellerden seçin</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Drag & Drop Upload Area */}
            <div className="p-6 border-b border-gray-200">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                
                <Upload className={`w-12 h-12 mx-auto mb-4 ${
                  isDragActive ? 'text-indigo-600' : 'text-gray-400'
                }`} />
                
                {isDragActive ? (
                  <p className="text-lg font-medium text-indigo-600">
                    Dosyaları buraya bırakın...
                  </p>
                ) : (
                  <>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Görselleri sürükleyip bırakın
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      veya tıklayarak dosya seçin
                    </p>
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Dosya Seç
                    </button>
                  </>
                )}

                {isUploading && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Yükleniyor...</p>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-2 text-center">
                Desteklenen formatlar: PNG, JPG, GIF, WebP, SVG
              </p>
            </div>

            {/* Media Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Medya Kütüphanesi ({allMedia.length})
              </h3>

              <div className="grid grid-cols-3 gap-4">
                {allMedia.map((media) => (
                  <motion.div
                    key={media.id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedMedia(media.url)}
                    className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedMedia === media.url 
                        ? 'border-indigo-600 ring-2 ring-indigo-600' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={media.url} 
                      alt={media.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Selected Indicator */}
                    {selectedMedia === media.url && (
                      <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Name */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-xs text-white truncate">{media.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {allMedia.length === 0 && (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Henüz görsel yüklenmedi</p>
                  <p className="text-sm text-gray-400">Yukarıdaki alana sürükleyip bırakın</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="text-sm text-gray-600">
              {selectedMedia ? (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  1 görsel seçildi
                </span>
              ) : (
                'Görsel seçin'
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSelectMedia}
                disabled={!selectedMedia}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Görseli Kullan
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

