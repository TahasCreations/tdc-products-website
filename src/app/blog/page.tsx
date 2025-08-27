'use client';

import { useState, useEffect } from 'react';
import BlogCard from './BlogCard';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image?: string;
  category: string;
  readTime: number;
  excerpt: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Anime Figürleri: Koleksiyonculuğun Sanatı',
      content: 'Anime figürleri sadece oyuncak değil, gerçek sanat eserleridir. Bu yazıda anime figür koleksiyonculuğunun inceliklerini keşfedelim.',
      author: 'TDC Team',
      date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
      category: 'Anime',
      readTime: 5,
      excerpt: 'Anime figürleri sadece oyuncak değil, gerçek sanat eserleridir...'
    },
    {
      id: '2',
      title: 'Gaming Figürleri: Nostalji ve Modernite',
      content: 'Gaming figürleri hem nostalji hem de modern oyun kültürünü bir araya getiriyor. En popüler gaming figürlerini inceleyelim.',
      author: 'TDC Team',
      date: '2024-01-10',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
      category: 'Gaming',
      readTime: 7,
      excerpt: 'Gaming figürleri hem nostalji hem de modern oyun kültürünü...'
    },
    {
      id: '3',
      title: 'Film Karakter Figürleri: Sinemanın Küçük Kahramanları',
      content: 'Film karakterlerinin figürleri, sinema tutkunları için vazgeçilmez koleksiyon parçalarıdır. En ikonik film figürlerini keşfedelim.',
      author: 'TDC Team',
      date: '2024-01-05',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=400&fit=crop',
      category: 'Film',
      readTime: 6,
      excerpt: 'Film karakterlerinin figürleri, sinema tutkunları için...'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    author: '',
    image: '',
    category: 'Anime',
    excerpt: ''
  });

  const categories = ['all', 'Anime', 'Gaming', 'Film', 'Diğer'];

  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateBlog = () => {
    if (newBlog.title && newBlog.content && newBlog.author) {
      const blog: BlogPost = {
        id: Date.now().toString(),
        title: newBlog.title,
        content: newBlog.content,
        author: newBlog.author,
        date: new Date().toISOString().split('T')[0],
        image: newBlog.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
        category: newBlog.category,
        readTime: Math.ceil(newBlog.content.split(' ').length / 200),
        excerpt: newBlog.excerpt || newBlog.content.substring(0, 100) + '...'
      };

      setBlogs([blog, ...blogs]);
      setNewBlog({
        title: '',
        content: '',
        author: '',
        image: '',
        category: 'Anime',
        excerpt: ''
      });
      setShowCreateForm(false);
    }
  };

  const handleLinkPaste = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pastedText = e.target.value;
    if (pastedText.includes('http') || pastedText.includes('www')) {
      // Eğer link yapıştırıldıysa, yeni sekmede aç
      window.open(pastedText, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">TDC Blog</h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Figür dünyasından en güncel haberler ve makaleler
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center mx-auto space-x-2"
            >
              <i className="ri-add-line text-xl"></i>
              <span>Yeni Blog Yazısı</span>
            </button>
          </div>
        </div>
      </div>

      {/* Create Blog Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Yeni Blog Yazısı</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Blog yazısının başlığı..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yazar
                </label>
                <input
                  type="text"
                  value={newBlog.author}
                  onChange={(e) => setNewBlog({...newBlog, author: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Yazar adı..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={newBlog.category}
                  onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="Anime">Anime</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Film">Film</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resim URL (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={newBlog.image}
                  onChange={(e) => setNewBlog({...newBlog, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Özet
                </label>
                <textarea
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog({...newBlog, excerpt: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  placeholder="Blog yazısının kısa özeti..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İçerik
                </label>
                <textarea
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  placeholder="Blog yazısının içeriği..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Yapıştır (Otomatik Açılır)
                </label>
                <input
                  type="text"
                  onChange={handleLinkPaste}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Link yapıştırın, otomatik olarak yeni sekmede açılacak..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateBlog}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300"
                >
                  Blog Oluştur
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-300"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Tümü' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        {/* Empty State */}
        {filteredBlogs.length === 0 && (
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
              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-300"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">{blogs.length}</div>
              <div className="text-gray-600">Toplam Blog</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
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
              <div className="text-3xl font-bold text-purple-600 mb-2">
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
