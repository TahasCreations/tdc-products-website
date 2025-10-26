"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  X,
  Image as ImageIcon,
  Video,
  File,
  Check,
  Loader2,
  Trash2,
  Eye,
  Download
} from 'lucide-react';

interface MediaUploaderProps {
  onUpload?: (files: File[]) => void;
  onRemove?: (url: string) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUpload,
  onRemove,
  accept = 'image/*',
  multiple = true,
  maxSize = 10
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    // Validate file size
    const oversizedFiles = files.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`Bazı dosyalar ${maxSize}MB'dan büyük!`);
      return;
    }

    setUploading(true);

    try {
      // Simulate upload (in real app, upload to Supabase Storage)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const urls = files.map(file => URL.createObjectURL(file));
      setUploadedFiles([...uploadedFiles, ...urls]);
      
      if (onUpload) {
        onUpload(files);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Yükleme başarısız!');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (url: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f !== url));
    if (onRemove) {
      onRemove(url);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Medya Yükle</h3>
          <p className="text-xs text-gray-600">Sürükle & bırak veya seç</p>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <div className="text-sm text-gray-600">Yükleniyor...</div>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <div className="text-sm font-semibold text-gray-700 mb-1">
              Dosyaları buraya sürükleyin
            </div>
            <div className="text-xs text-gray-500 mb-4">
              veya dosya seçmek için tıklayın
            </div>
            <div className="text-xs text-gray-400">
              Maksimum {maxSize}MB • {accept}
            </div>
          </>
        )}
      </div>

      {/* Hidden Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="text-xs font-semibold text-gray-700">
            Yüklenen Dosyalar ({uploadedFiles.length})
          </div>
          <div className="grid grid-cols-2 gap-2">
            {uploadedFiles.map((url, index) => (
              <div
                key={index}
                className="relative group border border-gray-200 rounded-lg overflow-hidden"
              >
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => window.open(url, '_blank')}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="Görüntüle"
                  >
                    <Eye className="w-4 h-4 text-gray-900" />
                  </button>
                  <button
                    onClick={() => handleRemove(url)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

