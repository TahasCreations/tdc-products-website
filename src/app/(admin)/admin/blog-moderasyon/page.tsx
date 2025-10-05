'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function BlogModerationPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const adminAuth = document.cookie.includes('adminAuth=true');
    if (adminAuth) {
      setIsAuthenticated(true);
      setIsLoading(false);
      
      // Mock data
      setPosts([
        {
          id: 1,
          title: 'TDC Market\'te En Popüler Figür Koleksiyonları',
          author: { name: 'Ahmet Yılmaz', handle: 'ahmet_yilmaz' },
          topic: { name: 'Koleksiyon' },
          status: 'pending',
          submittedAt: '2024-10-30T10:00:00Z',
          content: 'Bu yıl TDC Market\'te en çok tercih edilen figür koleksiyonlarını sizler için derledik...',
          tags: ['figür', 'koleksiyon', 'trend'],
          coverImage: '🎭',
          readingTime: 5
        },
        {
          id: 2,
          title: 'Elektronik Ürünlerde Kalite Rehberi',
          author: { name: 'Sarah Johnson', handle: 'sarah_j' },
          topic: { name: 'Elektronik' },
          status: 'pending',
          submittedAt: '2024-10-30T09:30:00Z',
          content: 'TDC Market\'te elektronik ürün seçerken dikkat edilmesi gerekenler...',
          tags: ['elektronik', 'kalite', 'rehber'],
          coverImage: '📱',
          readingTime: 8
        },
        {
          id: 3,
          title: 'Moda Trendleri: Bu Sezonun Favorileri',
          author: { name: 'Mehmet Kaya', handle: 'mehmet_k' },
          topic: { name: 'Moda' },
          status: 'approved',
          submittedAt: '2024-10-29T15:20:00Z',
          approvedAt: '2024-10-29T16:45:00Z',
          content: 'Sonbahar-kış sezonu için moda önerileri ve trend analizi...',
          tags: ['moda', 'trend', 'stil'],
          coverImage: '👗',
          readingTime: 6
        },
        {
          id: 4,
          title: 'Spam İçerik - Silinecek',
          author: { name: 'Spam User', handle: 'spam_user' },
          topic: { name: 'Diğer' },
          status: 'rejected',
          submittedAt: '2024-10-28T20:00:00Z',
          rejectedAt: '2024-10-28T20:15:00Z',
          content: 'Bu spam içerik...',
          tags: ['spam'],
          coverImage: '🚫',
          readingTime: 1,
          rejectionReason: 'Spam içerik'
        }
      ]);
    } else {
      router.push('/admin');
    }
  }, [router]);

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'all' || post.status === filter;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = async (postId: number) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, status: 'approved', approvedAt: new Date().toISOString() }
          : post
      ));
      
      alert('Yazı onaylandı ve yayınlandı!');
    } catch (error) {
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleReject = async (postId: number, reason: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, status: 'rejected', rejectedAt: new Date().toISOString(), rejectionReason: reason }
          : post
      ));
      
      alert('Yazı reddedildi ve silindi!');
    } catch (error) {
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleHardDelete = async (postId: number) => {
    if (!confirm('Bu yazı kalıcı olarak silinecek. Emin misiniz?')) return;
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPosts(prev => prev.filter(post => post.id !== postId));
      setShowPreview(false);
      setSelectedPost(null);
      
      alert('Yazı kalıcı olarak silindi!');
    } catch (error) {
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'İncelemede';
      case 'approved': return 'Onaylandı';
      case 'rejected': return 'Reddedildi';
      default: return 'Bilinmiyor';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Blog moderasyonu yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Kontrolü</h1>
            <p className="text-gray-600 mt-1">Kullanıcı içeriklerini moderasyon</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              📊 İstatistikler
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              📋 Raporlar
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum Filtresi</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Tümü</option>
                <option value="pending">İncelemede</option>
                <option value="approved">Onaylandı</option>
                <option value="rejected">Reddedildi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
              <input
                type="text"
                placeholder="Başlık veya yazar ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                🔍 Filtrele
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Posts List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Yazılar ({filteredPosts.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedPost(post);
                      setShowPreview(true);
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-coral-100 rounded-xl flex items-center justify-center text-2xl">
                        {post.coverImage}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {post.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                            {getStatusText(post.status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          <span>@{post.author.handle}</span>
                          <span>•</span>
                          <span>{post.topic.name}</span>
                          <span>•</span>
                          <span>{post.readingTime} dk</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(post.submittedAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            {selectedPost ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-6">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Önizleme</h3>
                </div>
                
                <div className="p-6">
                  <div className="h-32 bg-gradient-to-br from-indigo-100 to-coral-100 rounded-xl flex items-center justify-center text-4xl mb-4">
                    {selectedPost.coverImage}
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedPost.title}
                  </h4>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Yazar: {selectedPost.author.name}</p>
                    <p>Konu: {selectedPost.topic.name}</p>
                    <p>Durum: {getStatusText(selectedPost.status)}</p>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                    {selectedPost.content}
                  </p>
                  
                  <div className="space-y-3">
                    {selectedPost.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(selectedPost.id)}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          ✅ Onayla
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Red sebebi:');
                            if (reason) handleReject(selectedPost.id, reason);
                          }}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          ❌ Reddet
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => handleHardDelete(selectedPost.id)}
                      className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      🗑️ Kalıcı Sil
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <div className="text-gray-400 text-4xl mb-4">👁️</div>
                <p className="text-gray-600">Önizleme için bir yazı seçin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModernAdminLayout>
  );
}
