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

interface Comment {
  id: string;
  blog_id: string;
  user_id?: string;
  author_name: string;
  author_email?: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  parent_id?: string;
  likes_count: number;
  dislikes_count: number;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string;
  ip_address?: string;
  user_agent?: string;
  blog?: {
    title: string;
    slug: string;
  };
  user?: {
    id: string;
    email: string;
    raw_user_meta_data: any;
  };
}

export default function AdminCommentsPage() {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'spam'>('pending');
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchComments = useCallback(async () => {
    const supabase = createClientSupabaseClient();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          *,
          blog:blog_id (
            title,
            slug
          ),
          user:user_id (
            id,
            email,
            raw_user_meta_data
          )
        `)
        .eq('status', activeTab)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }

      setComments(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (user) {
      fetchComments();
    }
  }, [user, activeTab, fetchComments]);

  const handleStatusUpdate = async (commentId: string, newStatus: 'approved' | 'rejected' | 'spam') => {
    try {
      const response = await fetch('/api/comments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: commentId,
          updates: { status: newStatus }
        }),
      });

      if (response.ok) {
        alert(`Yorum ${newStatus === 'approved' ? 'onaylandı' : newStatus === 'rejected' ? 'reddedildi' : 'spam olarak işaretlendi'}!`);
        fetchComments();
      } else {
        const error = await response.json();
        alert('Hata: ' + error.error);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Yorum güncellenirken hata oluştu');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: commentId }),
      });

      if (response.ok) {
        alert('Yorum başarıyla silindi!');
        fetchComments();
      } else {
        const error = await response.json();
        alert('Hata: ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Yorum silinirken hata oluştu');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'spam':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Onaylandı';
      case 'pending':
        return 'Onay Bekliyor';
      case 'rejected':
        return 'Reddedildi';
      case 'spam':
        return 'Spam';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    return <PageLoader text="Yorumlar yükleniyor..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Yorum Yönetimi</h1>
              <p className="text-gray-600 mt-2">Kullanıcı yorumlarını onaylayın, reddedin ve spam&apos;leri temizleyin</p>
            </div>
            <Link
              href="/admin"
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Admin Paneli
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Onay Bekleyen ({comments.filter(c => c.status === 'pending').length})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'approved'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Onaylanan ({comments.filter(c => c.status === 'approved').length})
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rejected'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reddedilen ({comments.filter(c => c.status === 'rejected').length})
              </button>
              <button
                onClick={() => setActiveTab('spam')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'spam'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Spam ({comments.filter(c => c.status === 'spam').length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <i className="ri-chat-3-line text-6xl text-gray-400 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeTab === 'pending' && 'Onay bekleyen yorum yok'}
                  {activeTab === 'approved' && 'Onaylanan yorum yok'}
                  {activeTab === 'rejected' && 'Reddedilen yorum yok'}
                  {activeTab === 'spam' && 'Spam yorum yok'}
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'pending' && 'Kullanıcılar yorum yaptığında burada görünecek'}
                  {activeTab === 'approved' && 'Onaylanan yorumlar burada görünecek'}
                  {activeTab === 'rejected' && 'Reddedilen yorumlar burada görünecek'}
                  {activeTab === 'spam' && 'Spam olarak işaretlenen yorumlar burada görünecek'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {comment.author_name}
                            {comment.user?.raw_user_meta_data?.role === 'admin' && (
                              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Admin
                              </span>
                            )}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(comment.status)}`}>
                            {getStatusText(comment.status)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{comment.content}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Blog: {comment.blog?.title || 'Bilinmeyen'}</span>
                          <span>Oluşturulma: {formatDate(comment.created_at)}</span>
                          <span>Beğeni: {comment.likes_count || 0}</span>
                          <span>Beğenmeme: {comment.dislikes_count || 0}</span>
                          {comment.parent_id && <span className="text-blue-600">Yanıt Yorumu</span>}
                        </div>

                        {comment.ip_address && (
                          <div className="mt-2 text-xs text-gray-400">
                            IP: {comment.ip_address}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {comment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(comment.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Onayla
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(comment.id, 'rejected')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Reddet
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(comment.id, 'spam')}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Spam
                            </button>
                          </>
                        )}

                        {comment.status === 'approved' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(comment.id, 'rejected')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Reddet
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(comment.id, 'spam')}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Spam
                            </button>
                          </>
                        )}

                        {comment.status === 'rejected' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(comment.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Onayla
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(comment.id, 'spam')}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Spam
                            </button>
                          </>
                        )}

                        {comment.status === 'spam' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(comment.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Onayla
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(comment.id, 'rejected')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Reddet
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => {
                            setSelectedComment(comment);
                            setShowDetails(!showDetails);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Detaylar
                        </button>

                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </div>

                    {/* Detaylar */}
                    {showDetails && selectedComment?.id === comment.id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Yorum Detayları</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Yazar:</strong> {comment.author_name}</p>
                            <p><strong>E-posta:</strong> {comment.author_email || 'Belirtilmemiş'}</p>
                            <p><strong>IP Adresi:</strong> {comment.ip_address || 'Bilinmeyen'}</p>
                            <p><strong>Tarayıcı:</strong> {comment.user_agent || 'Bilinmeyen'}</p>
                          </div>
                          <div>
                            <p><strong>Blog:</strong> {comment.blog?.title || 'Bilinmeyen'}</p>
                            <p><strong>Oluşturulma:</strong> {formatDate(comment.created_at)}</p>
                            <p><strong>Güncellenme:</strong> {formatDate(comment.updated_at)}</p>
                            {comment.approved_at && (
                              <p><strong>Onaylanma:</strong> {formatDate(comment.approved_at)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
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
