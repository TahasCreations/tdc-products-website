'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ImageUploadProps {
  onUpload?: (url: string) => void;
  onUploadSuccess?: (url: string) => void;
  initialImageUrl?: string;
  label?: string;
  folder?: string; // GCS folder
  type?: string;
  maxSize?: number;
  className?: string;
}

export default function ImageUpload({ 
  onUpload,
  onUploadSuccess, 
  initialImageUrl, 
  label = "Resim Yükle", 
  folder = "uploads",
  type,
  maxSize,
  className
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // 1. Get a signed URL from your API
      const response = await fetch('/api/upload/signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fileName: file.name, 
          fileType: file.type,
          folder 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }

      const { signedUrl, publicUrl } = await response.json();

      // 2. Upload to GCS using signed URL
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      // 3. Update state and notify parent
      setImageUrl(publicUrl);
      if (onUpload) onUpload(publicUrl);
      if (onUploadSuccess) onUploadSuccess(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setImageUrl(null);
    if (onUpload) onUpload('');
    if (onUploadSuccess) onUploadSuccess('');
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {imageUrl ? (
        <div className="relative group">
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <motion.button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>
      ) : (
        <motion.div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors"
          whileHover={{ scale: 1.02 }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            ) : (
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            <span className="text-sm text-gray-600">
              {isUploading ? 'Yükleniyor...' : 'Resim seçmek için tıklayın'}
            </span>
          </label>
        </motion.div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}