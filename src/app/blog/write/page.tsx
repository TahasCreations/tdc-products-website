'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { PageLoader } from '../../../components/LoadingSpinner';
import Link from 'next/link';

// Client-side Supabase client
const createClientSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

const categories = ['Genel', 'Anime', 'Gaming', 'Film', 'Teknoloji', 'Lifestyle'];

export default function WriteBlogPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    category: 'Genel',
    tags: [] as string[],
    tagInput: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  const handleTagAdd = () => {
    if (blog.tagInput.trim() && !blog.tags.includes(blog.tagInput.trim())) {
      setBlog({
        ...blog,
        tags: [...blog.tags, blog.tagInput.trim()],
        tagInput: ''
      });
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setBlog({
      ...blog,
      tags: blog.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!blog.title || !blog.content) {
      alert('Lütfen başlık ve içerik alanlarını doldurun');
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
    return <PageLoader text="Yönlendiriliyor..." />;
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
                Blog Başlığı *
              </label>
              <input
                type="text"
                value={blog.title}
                onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Blog başlığınızı yazın"
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
                onChange={(e) => setBlog({ ...blog, category: e.target.value })}
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
                onChange={(e) => setBlog({ ...blog, image: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Özet (Opsiyonel)
              </label>
              <textarea
                value={blog.excerpt}
                onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Blog yazınızın kısa özeti (otomatik oluşturulacak)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Boş bırakırsanız, içerikten otomatik olarak oluşturulacak
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiketler
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={blog.tagInput}
                  onChange={(e) => setBlog({ ...blog, tagInput: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Etiket ekleyin ve Enter'a basın"
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Ekle
                </button>
              </div>
              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog İçeriği *
              </label>
              <textarea
                value={blog.content}
                onChange={(e) => setBlog({ ...blog, content: e.target.value })}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Blog yazınızın içeriğini buraya yazın... HTML etiketleri kullanabilirsiniz."
                required
              />
              <div className="mt-2 text-sm text-gray-500">
                <p>HTML etiketleri desteklenir. Örnek:</p>
                <code className="block mt-1 p-2 bg-gray-100 rounded text-xs">
                  &lt;h2&gt;Alt Başlık&lt;/h2&gt;<br/>
                  &lt;p&gt;Paragraf metni&lt;/p&gt;<br/>
                  &lt;strong&gt;Kalın metin&lt;/strong&gt;
                </code>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Gönderiliyor...' : 'Blog Yazısını Gönder'}
              </button>
              <Link
                href="/blog"
                className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-center"
              >
                İptal
              </Link>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-8">
          <div className="flex items-start gap-3">
            <i className="ri-information-line text-blue-600 text-xl mt-1"></i>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Önemli Bilgiler</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Blog yazınız gönderildikten sonra admin onayı bekleyecek</li>
                <li>• Onaylandıktan sonra blog sayfasında yayınlanacak</li>
                <li>• Reddedilirse size bilgi verilecek</li>
                <li>• HTML etiketleri kullanarak zengin içerik oluşturabilirsiniz</li>
                <li>• Etiketler blog yazınızın kategorize edilmesine yardımcı olur</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
