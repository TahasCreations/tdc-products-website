'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';
import { PageLoader } from '../../components/LoadingSpinner';
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
}

export default function BlogPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['all', 'Genel', 'Anime', 'Gaming', 'Film', 'Teknoloji', 'Lifestyle'];
  
  // Tüm etiketleri topla
  const allTags = Array.from(new Set(blogs.flatMap(blog => blog.tags || []))).sort();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const supabase = createClientSupabaseClient();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

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
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesTags = selectedTags.length === 0 || 
                       (blog.tags && selectedTags.some(tag => blog.tags.includes(tag)));
    return matchesCategory && matchesSearch && matchesTags;
  });

  // Sıralama
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      case 'oldest':
        return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
      case 'popular':
        return (b.read_time || 0) - (a.read_time || 0);
      default:
        return 0;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSelectedTags([]);
    setSortBy('newest');
  };

  if (loading) {
    return <PageLoader text="Blog'lar yükleniyor..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">TDC Blog</h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Figür dünyasından en güncel haberler ve makaleler
            </p>
            {user ? (
              <div className="flex gap-4 justify-center">
                <Link
                  href="/blog/write"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2"
                >
                  <i className="ri-add-line text-xl"></i>
                  <span>Blog Yaz</span>
                </Link>
                {user.user_metadata?.role === 'admin' && (
                  <Link
                    href="/admin/blogs"
                    className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors duration-300"
                  >
                    Admin Panel
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-white/80 mb-4">Blog yazmak için giriş yapmanız gerekiyor</p>
                <Link
                  href="/auth"
                  className="bg-white/20 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors duration-300"
                >
                  Giriş Yap
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Search and Basic Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arama
              </label>
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Blog yazılarında ara..."
                />
              </div>
            </div>

            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Tümü' : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sıralama
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
                <option value="popular">En Popüler</option>
              </select>
            </div>

            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Görünüm
              </label>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className="ri-grid-line"></i>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className="ri-list-check"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Etiketler
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters and Clear Button */}
          {(selectedCategory !== 'all' || searchTerm || selectedTags.length > 0) && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Aktif filtreler:</span>
                {selectedCategory !== 'all' && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {selectedCategory}
                  </span>
                )}
                {searchTerm && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    &quot;{searchTerm}&quot;
                  </span>
                )}
                {selectedTags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                onClick={clearAllFilters}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                <i className="ri-close-line"></i>
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>

        {/* Blog Grid/List */}
        {sortedBlogs.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            : "space-y-6"
          }>
            {sortedBlogs.map((blog) => (
              <div key={blog.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
                viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
              }`}>
                {blog.image && (
                  <div className={`relative overflow-hidden ${
                    viewMode === 'list' ? 'md:w-64 md:h-48' : 'h-48'
                  }`}>
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <i className="ri-user-line"></i>
                      {blog.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <i className="ri-time-line"></i>
                      {blog.read_time} dk
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <i className="ri-chat-3-line"></i>
                      0 yorum
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {formatDate(blog.published_at)}
                    </span>
                    
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Devamını Oku
                      <i className="ri-arrow-right-line"></i>
                    </Link>
                  </div>
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="ri-file-text-line text-6xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Blog yazısı bulunamadı</h3>
            <p className="text-gray-600 mb-6">
              Arama kriterlerinize uygun blog yazısı bulunamadı.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Blog İstatistikleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{blogs.length}</div>
              <div className="text-gray-600">Toplam Blog</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {blogs.filter(b => b.category === 'Anime').length}
              </div>
              <div className="text-gray-600">Anime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {blogs.filter(b => b.category === 'Gaming').length}
              </div>
              <div className="text-gray-600">Gaming</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">
                {blogs.filter(b => b.category === 'Film').length}
              </div>
              <div className="text-gray-600">Film</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
