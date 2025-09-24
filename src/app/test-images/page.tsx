'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getSupabaseClient } from '../../lib/supabase-client';


export default function TestImagesPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setLoading(true);
    setMessage('Görseller yükleniyor...');

    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;
        const filePath = `test/${fileName}`;

        // Görsel yükleniyor

        const supabase = getSupabaseClient();
        if (!supabase) {
          setMessage('Supabase client oluşturulamadı');
          continue;
        }

        const { data, error } = await supabase.storage
          .from('images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Upload error:', error);
          setMessage(`Hata: ${error.message}`);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        // Görsel URL alındı
        uploadedUrls.push(urlData.publicUrl);

      } catch (error) {
        console.error('Upload process error:', error);
        setMessage(`Hata: ${error}`);
      }
    }

    setUploadedImages(prev => [...prev, ...uploadedUrls]);
    setMessage(`${uploadedUrls.length} görsel yüklendi!`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Görsel Test Sayfası</h1>
        
        {/* Upload Section */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Görsel Yükleme Testi</h2>
          
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          
          {message && (
            <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-lg">
              {message}
            </div>
          )}
          
          {loading && (
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
              Yükleniyor...
            </div>
          )}
        </div>

        {/* Display Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Yüklenen Görseller</h2>
          
          {uploadedImages.length === 0 ? (
            <p className="text-gray-500">Henüz görsel yüklenmedi</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedImages.map((url, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={url}
                      alt={`Test görsel ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                      onLoad={() => {
                        // Görsel başarıyla yüklendi
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-gray-600 truncate">{url}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

