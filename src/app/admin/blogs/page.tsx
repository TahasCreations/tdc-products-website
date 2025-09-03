'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
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

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  published_at: string;
  read_time: number;
  tags: string[];
  status: 'published' | 'pending' | 'rejected';
  user_id?: string;
  created_at: string;
}

export default function AdminBlogsPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'published' | 'pending' | 'rejected'>('published');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    category: 'Genel',
    tags: [] as string[],
    author: ''
  });

  const categories = ['Genel', 'Anime', 'Gaming', 'Film', 'Teknoloji', 'Lifestyle'];

  const fetchBlogs = useCallback(async () => {
    const supabase = createClientSupabaseClient();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', activeTab)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blogs:', error);
        return;
      }

      setBlogs(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
  }, [user, activeTab, fetchBlogs]);

  const handleCreateBlog = async () => {
    if (!newBlog.title || !newBlog.content || !newBlog.author) {
      alert('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    const supabase = createClientSupabaseClient();
    if (!supabase) return;

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newBlog,
          author: newBlog.author || 'Admin',
          user_id: null // Admin blog'u direkt yayınlanır
        }),
      });

      if (response.ok) {
        alert('Blog başarıyla oluşturuldu!');
        setShowCreateForm(false);
        setNewBlog({
          title: '',
          content: '',
          excerpt: '',
          image: '',
          category: 'Genel',
          tags: [],
          author: ''
        });
        fetchBlogs();
      } else {
        const error = await response.json();
        alert('Hata: ' + error.error);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Blog oluşturulurken hata oluştu');
    }
  };

  const handleStatusUpdate = async (blogId: string, newStatus: 'published' | 'rejected') => {
    const supabase = createClientSupabaseClient();
    if (!supabase) return;

    try {
      const response = await fetch('/api/blogs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: blogId,
          updates: { status: newStatus }
        }),
      });

      if (response.ok) {
        alert(`Blog ${newStatus === 'published' ? 'yayınlandı' : 'reddedildi'}!`);
        fetchBlogs();
      } else {
        const error = await response.json();
        alert('Hata: ' + error.error);
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Blog güncellenirken hata oluştu');
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) return;

    const supabase = createClientSupabaseClient();
    if (!supabase) return;

    try {
      const response = await fetch('/api/blogs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: blogId }),
      });

      if (response.ok) {
        alert('Blog başarıyla silindi!');
        fetchBlogs();
      } else {
        const error = await response.json();
        alert('Hata: ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Blog silinirken hata oluştu');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erişim Reddedildi</h1>
          <p className="text-gray-600 mb-6">Bu sayfaya erişmek için giriş yapmanız gerekiyor.</p>
          <Link
            href="/auth"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <PageLoader text="Blog'lar yükleniyor..." />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Yayında';
      case 'pending':
        return 'Onay Bekliyor';
      case 'rejected':
        return 'Reddedildi';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Yönetimi</h1>
              <p className="text-gray-600 mt-2">Blog yazılarını yönetin ve kullanıcı blog&apos;larını onaylayın</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {showCreateForm ? 'İptal' : 'Yeni Blog Oluştur'}
            </button>
          </div>
        </div>

        {/* Create Blog Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Blog Oluştur</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
                <input
                  type="text"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Blog başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select
                  value={newBlog.category}
                  onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yazar</label>
                <input
                  type="text"
                  value={newBlog.author}
                  onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Yazar adı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Görsel URL</label>
                <input
                  type="url"
                  value={newBlog.image}
                  onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Özet</label>
                <textarea
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Blog özeti (opsiyonel)"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">İçerik *</label>
                <textarea
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Blog içeriği (HTML desteklenir)"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleCreateBlog}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Blog Oluştur
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('published')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'published'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Yayında ({blogs.filter(b => b.status === 'published').length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Onay Bekleyen ({blogs.filter(b => b.status === 'pending').length})
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rejected'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reddedilen ({blogs.filter(b => b.status === 'rejected').length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {blogs.length === 0 ? (
              <div className="text-center py-12">
                <i className="ri-article-line text-6xl text-gray-400 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeTab === 'published' && 'Henüz yayınlanmış blog yok'}
                  {activeTab === 'pending' && 'Onay bekleyen blog yok'}
                  {activeTab === 'rejected' && 'Reddedilen blog yok'}
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'published' && 'İlk blog yazınızı oluşturun'}
                  {activeTab === 'pending' && 'Kullanıcılar blog yazdığında burada görünecek'}
                  {activeTab === 'rejected' && 'Reddedilen blog yazıları burada görünecek'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div key={blog.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{blog.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(blog.status)}`}>
                            {getStatusText(blog.status)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{blog.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Yazar: {blog.author}</span>
                          <span>Kategori: {blog.category}</span>
                          <span>Oluşturulma: {new Date(blog.created_at).toLocaleDateString('tr-TR')}</span>
                          {blog.user_id && <span className="text-blue-600">Kullanıcı Blog&apos;u</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {blog.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(blog.id, 'published')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Onayla
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(blog.id, 'rejected')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Reddet
                            </button>
                          </>
                        )}
                        <Link
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Görüntüle
                        </Link>
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
