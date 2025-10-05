'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';

export default function BlogWritePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    topicId: '',
    tags: '',
    coverImage: null as File | null
  });

  const [topics] = useState([
    { id: 1, name: 'Koleksiyon', slug: 'koleksiyon' },
    { id: 2, name: 'Elektronik', slug: 'elektronik' },
    { id: 3, name: 'Moda', slug: 'moda' },
    { id: 4, name: 'Ev & Yaşam', slug: 'ev-yasam' },
    { id: 5, name: 'Sanat', slug: 'sanat' },
    { id: 6, name: 'Teknoloji', slug: 'teknoloji' }
  ]);

  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.push('/auth/login?redirect=/blog/write');
    }
    setIsLoading(false);

    // Autosave every 30 seconds
    const autosaveInterval = setInterval(() => {
      if (formData.title || formData.content) {
        handleAutosave();
      }
    }, 30000);

    return () => clearInterval(autosaveInterval);
  }, [formData.title, formData.content, router]);

  const handleAutosave = async () => {
    if (!formData.title && !formData.content) return;
    
    setAutosaveStatus('saving');
    try {
      // Mock autosave API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAutosaveStatus('saved');
    } catch (error) {
      setAutosaveStatus('error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Lütfen sadece resim dosyası seçin');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
        return;
      }
      setFormData(prev => ({
        ...prev,
        coverImage: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'pending') => {
    e.preventDefault();
    
    if (status === 'pending') {
      setIsSubmitting(true);
    } else {
      setIsSaving(true);
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (status === 'pending') {
        alert('Yazınız incelemeye gönderildi! Onaylandıktan sonra yayınlanacak.');
        router.push('/blog');
      } else {
        alert('Taslak kaydedildi!');
      }
    } catch (error) {
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSaving(false);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-ink-900">Blog Yaz</h1>
              <p className="text-ink-600 mt-2">Toplulukla paylaşmak istediğiniz içeriği yazın</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-ink-500">
                <div className={`w-2 h-2 rounded-full ${
                  autosaveStatus === 'saved' ? 'bg-green-500' :
                  autosaveStatus === 'saving' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
                <span>
                  {autosaveStatus === 'saved' ? 'Kaydedildi' :
                   autosaveStatus === 'saving' ? 'Kaydediliyor...' :
                   'Hata'}
                </span>
              </div>
              <Link
                href="/blog"
                className="px-4 py-2 text-ink-600 hover:text-ink-900 transition-colors"
              >
                ← Geri Dön
              </Link>
            </div>
          </div>

          <form onSubmit={(e) => handleSubmit(e, 'pending')} className="space-y-8">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-ink-700 mb-2">
                Başlık *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Yazınızın başlığını girin..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                required
              />
            </div>

            {/* Topic Selection */}
            <div>
              <label htmlFor="topicId" className="block text-sm font-medium text-ink-700 mb-2">
                Konu *
              </label>
              <select
                id="topicId"
                name="topicId"
                value={formData.topicId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">Konu seçin...</option>
                {topics.map(topic => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover Image */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-ink-700 mb-2">
                Kapak Görseli
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <label htmlFor="coverImage" className="cursor-pointer">
                  {formData.coverImage ? (
                    <div className="space-y-2">
                      <div className="text-4xl">📷</div>
                      <p className="text-sm text-ink-600">{formData.coverImage.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-4xl">📷</div>
                      <p className="text-ink-600">Görsel yüklemek için tıklayın</p>
                      <p className="text-sm text-ink-500">JPG, PNG, WebP (max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-ink-700 mb-2">
                İçerik *
              </label>
              <div className="border border-gray-300 rounded-xl overflow-hidden">
                {/* Toolbar */}
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-300 flex items-center space-x-2">
                  <button type="button" className="p-2 hover:bg-gray-200 rounded text-ink-600">
                    <strong>B</strong>
                  </button>
                  <button type="button" className="p-2 hover:bg-gray-200 rounded text-ink-600">
                    <em>I</em>
                  </button>
                  <button type="button" className="p-2 hover:bg-gray-200 rounded text-ink-600">
                    H1
                  </button>
                  <button type="button" className="p-2 hover:bg-gray-200 rounded text-ink-600">
                    H2
                  </button>
                  <button type="button" className="p-2 hover:bg-gray-200 rounded text-ink-600">
                    • Liste
                  </button>
                  <button type="button" className="p-2 hover:bg-gray-200 rounded text-ink-600">
                    " Alıntı
                  </button>
                </div>
                
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Yazınızın içeriğini buraya yazın..."
                  className="w-full px-4 py-4 min-h-[400px] focus:outline-none resize-none"
                  required
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-ink-700 mb-2">
                Etiketler
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="etiket1, etiket2, etiket3 (virgülle ayırın)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Community Rules */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Topluluk Kuralları</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Saygılı ve yapıcı bir dil kullanın</li>
                <li>• Telif hakkı ihlali yapmayın</li>
                <li>• Kişisel bilgileri paylaşmayın</li>
                <li>• Spam veya reklam içeriği göndermeyin</li>
                <li>• İçerikler moderasyon sürecinden geçer</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={isSaving}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Kaydediliyor...' : 'Taslak Kaydet'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Gönderiliyor...' : 'İncelemeye Gönder'}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
