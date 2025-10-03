'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  type?: 'image' | 'document';
  maxSize?: number; // MB
  className?: string;
}

export default function ImageUpload({ 
  onUpload, 
  currentImage, 
  type = 'image',
  maxSize = 5,
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Dosya boyutu kontrolü
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Dosya boyutu ${maxSize}MB'dan büyük olamaz`);
      return;
    }

    // Dosya tipi kontrolü
    const allowedTypes = type === 'image' 
      ? ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Desteklenmeyen dosya tipi');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setPreview(result.url);
        onUpload(result.url);
      } else {
        setError(result.error || 'Dosya yükleme başarısız');
      }
    } catch (err) {
      setError('Dosya yükleme sırasında hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={type === 'image' ? 'image/*' : '.pdf,.doc,.docx'}
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          {type === 'image' ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl text-gray-400 mb-2">📄</div>
                <p className="text-sm text-gray-600">Dosya yüklendi</p>
              </div>
            </div>
          )}
          
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            ×
          </button>
        </div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClick}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
        >
          <div className="text-4xl text-gray-400 mb-2">
            {type === 'image' ? '📷' : '📄'}
          </div>
          <p className="text-sm text-gray-600 mb-1">
            {type === 'image' ? 'Görsel yüklemek için tıklayın' : 'Dosya yüklemek için tıklayın'}
          </p>
          <p className="text-xs text-gray-500">
            Max {maxSize}MB, {type === 'image' ? 'JPG, PNG, WebP' : 'PDF, DOC, DOCX'}
          </p>
        </motion.div>
      )}

      {uploading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-2"></div>
          <span className="text-sm text-gray-600">Yükleniyor...</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
