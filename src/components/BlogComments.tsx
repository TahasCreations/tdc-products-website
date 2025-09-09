'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSupabaseClient } from '../lib/supabase-client';


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
  user?: {
    id: string;
    email: string;
    raw_user_meta_data: any;
  };
  reactions?: Array<{
    id: string;
    user_id: string;
    reaction_type: 'like' | 'dislike';
  }>;
  replies?: Comment[];
}

interface BlogCommentsProps {
  blogId: string;
  blogSlug: string;
}

export default function BlogComments({ blogId, blogSlug }: BlogCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [commentForm, setCommentForm] = useState({
    content: '',
    author_name: user?.user_metadata?.full_name || '',
    author_email: user?.email || ''
  });

  // Yorumları getir
  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?blog_id=${blogId}&status=approved`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  // Kullanıcı değiştiğinde yorumları yenile
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Form değişikliklerini handle et
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCommentForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Yorum gönder
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentForm.content.trim()) {
      alert('Lütfen yorum içeriğini yazın');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blog_id: blogId,
          content: commentForm.content.trim(),
          parent_id: replyingTo,
          author_name: commentForm.author_name || 'Anonim',
          author_email: commentForm.author_email
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        
        // Formu temizle
        setCommentForm({
          content: '',
          author_name: user?.user_metadata?.full_name || '',
          author_email: user?.email || ''
        });
        setReplyingTo(null);
        setShowCommentForm(false);
        
        // Yorumları yenile
        fetchComments();
      } else {
        const error = await response.json();
        alert('Hata: ' + error.error);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Yorum gönderilirken hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  // Beğeni ekle/çıkar
  const handleReaction = async (commentId: string, reactionType: 'like' | 'dislike') => {
    if (!user) {
      alert('Beğeni eklemek için giriş yapmanız gerekiyor');
      return;
    }

    try {
      const response = await fetch('/api/comments/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment_id: commentId,
          reaction_type: reactionType,
          user_id: user.id
        }),
      });

      if (response.ok) {
        // Yorumları yenile
        fetchComments();
      } else {
        const error = await response.json();
        alert('Hata: ' + error.error);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      alert('Beğeni işlenirken hata oluştu');
    }
  };

  // Tarih formatla
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Kullanıcının beğeni durumunu kontrol et
  const getUserReaction = (comment: Comment, reactionType: 'like' | 'dislike') => {
    if (!user || !comment.reactions) return false;
    return comment.reactions.some(reaction => 
      reaction.user_id === user.id && reaction.reaction_type === reactionType
    );
  };

  // Tek yorum bileşeni
  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`border-l-2 ${isReply ? 'border-gray-200 ml-6' : 'border-blue-500'} pl-4 py-3`}>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        {/* Yorum başlığı */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {comment.author_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{comment.author_name}</div>
              <div className="text-xs text-gray-500">{formatDate(comment.created_at)}</div>
            </div>
          </div>
          
          {/* Admin badge */}
          {comment.user?.raw_user_meta_data?.role === 'admin' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
              Admin
            </span>
          )}
        </div>

        {/* Yorum içeriği */}
        <div className="text-gray-700 mb-4 leading-relaxed">
          {comment.content}
        </div>

        {/* Beğeni butonları */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleReaction(comment.id, 'like')}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
              getUserReaction(comment, 'like')
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className={`ri-thumb-up-line ${getUserReaction(comment, 'like') ? 'text-blue-600' : ''}`}></i>
            <span>{comment.likes_count || 0}</span>
          </button>

          <button
            onClick={() => handleReaction(comment.id, 'dislike')}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
              getUserReaction(comment, 'dislike')
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className={`ri-thumb-down-line ${getUserReaction(comment, 'dislike') ? 'text-red-600' : ''}`}></i>
            <span>{comment.dislikes_count || 0}</span>
          </button>

          {/* Yanıtla butonu */}
          {!isReply && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="flex items-center gap-2 px-3 py-1 text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              <i className="ri-reply-line"></i>
              <span>Yanıtla</span>
            </button>
          )}
        </div>

        {/* Yanıt formu */}
        {replyingTo === comment.id && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <form onSubmit={handleSubmitComment} className="space-y-3">
              <textarea
                name="content"
                value={commentForm.content}
                onChange={handleFormChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Yanıtınızı yazın..."
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {submitting ? 'Gönderiliyor...' : 'Yanıt Gönder'}
                </button>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Yanıt yorumları */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yorumlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Yorumlar</h3>
          <p className="text-gray-600 mt-1">
            {comments.length} yorum • Düşüncelerinizi paylaşın
          </p>
        </div>
        
        {user && (
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {showCommentForm ? 'İptal' : 'Yorum Yap'}
          </button>
        )}
      </div>

      {/* Yorum formu */}
      {showCommentForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Yorum Yap</h4>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adınız *
              </label>
              <input
                type="text"
                name="author_name"
                value={commentForm.author_name}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Adınızı yazın"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta (Opsiyonel)
              </label>
              <input
                type="email"
                name="author_email"
                value={commentForm.author_email}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="E-posta adresiniz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yorumunuz *
              </label>
              <textarea
                name="content"
                value={commentForm.content}
                onChange={handleFormChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Düşüncelerinizi paylaşın..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {submitting ? 'Gönderiliyor...' : 'Yorum Gönder'}
              </button>
              <button
                type="button"
                onClick={() => setShowCommentForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Yorumlar listesi */}
      {comments.length === 0 ? (
        <div className="text-center py-12">
          <i className="ri-chat-3-line text-6xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz yorum yok</h3>
          <p className="text-gray-600 mb-6">İlk yorumu siz yapın ve tartışmayı başlatın!</p>
          {user ? (
            <button
              onClick={() => setShowCommentForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              İlk Yorumu Yap
            </button>
          ) : (
            <p className="text-gray-500">Yorum yapmak için giriş yapmanız gerekiyor</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      {/* Bilgi kutusu */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <i className="ri-information-line text-blue-600 text-xl mt-1"></i>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Yorum Kuralları:</p>
            <ul className="space-y-1">
              <li>• Saygılı ve yapıcı olun</li>
              <li>• Spam ve reklam yapmayın</li>
              <li>• Yorumlarınız onay sonrası yayınlanır</li>
              <li>• Yanıt yorumları desteklenir</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
