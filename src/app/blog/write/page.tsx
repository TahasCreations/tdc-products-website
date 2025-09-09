'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import OptimizedLoader from '../../../components/OptimizedLoader';
import Link from 'next/link';

const categories = ['Genel', 'Anime', 'Gaming', 'Film', 'Teknoloji', 'Lifestyle'] as const;

export default function WriteBlogPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    category: 'Genel' as typeof categories[number],
    tags: [] as string[],
    tagInput: ''
  });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  // Otomatik kaydetme
  useEffect(() => {
    if (blog.title || blog.content) {
      const timer = setTimeout(() => {
        localStorage.setItem('blog-draft', JSON.stringify(blog));
        setLastSaved(new Date());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [blog]);

  // Sayfa yüklendiğinde draft'ı yükle
  useEffect(() => {
    const savedDraft = localStorage.getItem('blog-draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setBlog(draft);
      } catch (error) {
        console.error('Draft yüklenirken hata:', error);
      }
    }
  }, []);

  const handleTagAdd = () => {
    const trimmedTag = blog.tagInput.trim().toLowerCase();
    if (trimmedTag && !blog.tags.includes(trimmedTag)) {
      if (blog.tags.length >= 10) {
        alert('Maksimum 10 etiket ekleyebilirsiniz');
        return;
      }
      setBlog(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
        tagInput: ''
      }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setBlog(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const clearDraft = () => {
    localStorage.removeItem('blog-draft');
    setBlog({
      title: '',
      content: '',
      excerpt: '',
      image: '',
      category: 'Genel',
      tags: [],
      tagInput: ''
    });
    setLastSaved(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!blog.title.trim()) {
      alert('Lütfen blog başlığını girin');
      return;
    }
    
    if (blog.title.length < 10) {
      alert('Blog başlığı en az 10 karakter olmalıdır');
      return;
    }
    
    if (!blog.content.trim()) {
      alert('Lütfen blog içeriğini girin');
      return;
    }
    
    if (blog.content.length < 100) {
      alert('Blog içeriği en az 100 karakter olmalıdır');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...blog,
          author: user?.user_metadata?.full_name || user?.email || 'Anonim',
          user_id: user?.id
        }),
      });

      if (response.ok) {
        alert('Blog yazınız başarıyla gönderildi! Admin onayından sonra yayınlanacak.');
        clearDraft();
        router.push('/blog');
      } else {
        const error = await response.json();
        alert('Hata: ' + error.error);
      }
    } catch (error) {
      console.error('Error submitting blog:', error);
      alert('Blog gönderilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <OptimizedLoader message="Yönlendiriliyor..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Yaz</h1>
              <p className="text-gray-600 mt-2">Düşüncelerinizi paylaşın, blog yazınız onaylandıktan sonra yayınlanacak</p>
            </div>
            <Link
              href="/blog"
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Blog&apos;a Dön
            </Link>
          </div>
        </div>

        {/* Blog Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Başlığı * ({blog.title.length}/200)
              </label>
              <input
                type="text"
                value={blog.title}
                onChange={(e) => setBlog(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Blog başlığınızı yazın"
                maxLength={200}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={blog.category}
                onChange={(e) => setBlog(prev => ({ ...prev, category: e.target.value as typeof categories[number] }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Görsel URL (Opsiyonel)
              </label>
              <input
                type="url"
                value={blog.image}
                onChange={(e) => setBlog(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog İçeriği * ({blog.content.length}/∞)
              </label>
              <textarea
                value={blog.content}
                onChange={(e) => setBlog(prev => ({ ...prev, content: e.target.value }))}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Blog içeriğinizi buraya yazın..."
                required
              />
              {blog.content.length < 100 && blog.content.length > 0 && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ İçerik en az 100 karakter olmalıdır
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiketler ({blog.tags.length}/10)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={blog.tagInput}
                  onChange={(e) => setBlog(prev => ({ ...prev, tagInput: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Etiket ekleyin..."
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ekle
                </button>
              </div>
              
              {/* Selected Tags */}
              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-1 hover:text-red-200 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center gap-4">
                {lastSaved && (
                  <span className="text-sm text-gray-500">
                    Son kayıt: {lastSaved.toLocaleTimeString('tr-TR')}
                  </span>
                )}
                <button
                  type="button"
                  onClick={clearDraft}
                  className="text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Draft&apos;ı Temizle
                </button>
              </div>
              
              <button
                type="submit"
                disabled={loading || blog.content.length < 100 || blog.title.length < 10}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Gönderiliyor...' : 'Blog Yazısını Gönder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
