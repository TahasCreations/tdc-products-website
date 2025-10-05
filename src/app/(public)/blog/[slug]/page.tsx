'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(0);
  const [saves, setSaves] = useState(0);
  const [views, setViews] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockPost = {
      id: params.slug,
      title: 'TDC Market\'te En Popüler Figür Koleksiyonları',
      content: `
        <h2>Giriş</h2>
        <p>Bu yıl TDC Market'te en çok tercih edilen figür koleksiyonlarını sizler için derledik. El yapımı ve premium kalitedeki ürünlerimiz, koleksiyon tutkunlarının beğenisini kazanmaya devam ediyor.</p>
        
        <h2>1. Dragon Figür Serisi</h2>
        <p>En popüler koleksiyonumuz olan Dragon Figür Serisi, detaylı işçiliği ve özel tasarımı ile dikkat çekiyor. Her figür, uzman sanatçılarımız tarafından el ile boyanıyor.</p>
        
        <h2>2. Anime Karakter Koleksiyonu</h2>
        <p>Anime severlerin favorisi olan bu koleksiyon, en sevilen karakterleri figür haline getiriyor. Yüksek kaliteli malzemeler kullanılarak üretilen bu ürünler, uzun yıllar dayanacak.</p>
        
        <h2>3. Vintage Figürler</h2>
        <p>Nostalji sevenler için özel olarak tasarlanan vintage figür koleksiyonu, geçmişin güzelliklerini bugüne taşıyor.</p>
        
        <h2>Sonuç</h2>
        <p>TDC Market olarak, her zevke uygun figür koleksiyonları sunmaya devam ediyoruz. Kalite ve müşteri memnuniyeti bizim önceliğimiz.</p>
      `,
      author: {
        name: 'Ahmet Yılmaz',
        handle: 'ahmet_yilmaz',
        avatar: '👨‍💼',
        bio: 'Koleksiyon tutkunu ve figür uzmanı. 10+ yıllık deneyim.',
        followers: 1250
      },
      topic: {
        name: 'Koleksiyon',
        slug: 'koleksiyon'
      },
      coverImage: '🎭',
      readingTime: 5,
      publishedAt: '2024-10-30T10:00:00Z',
      tags: ['figür', 'koleksiyon', 'trend', 'el yapımı']
    };

    setPost(mockPost);
    setLikes(42);
    setSaves(18);
    setViews(1250);
    setIsLoading(false);

    // Mock comments
    setComments([
      {
        id: 1,
        author: { name: 'Sarah Johnson', handle: 'sarah_j', avatar: '👩‍💻' },
        content: 'Harika bir yazı! Dragon figürlerini çok beğendim.',
        createdAt: '2024-10-30T12:00:00Z',
        likes: 5
      },
      {
        id: 2,
        author: { name: 'Mehmet Kaya', handle: 'mehmet_k', avatar: '👨‍🎨' },
        content: 'Vintage figürler gerçekten çok güzel. Hangi renklerde mevcut?',
        createdAt: '2024-10-30T14:30:00Z',
        likes: 3
      }
    ]);
  }, [params.slug]);

  const handleLike = async () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleSave = async () => {
    if (isSaved) {
      setSaves(prev => prev - 1);
      setIsSaved(false);
    } else {
      setSaves(prev => prev + 1);
      setIsSaved(true);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: { name: 'Sen', handle: 'you', avatar: '👤' },
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Yazı yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-ink-900 mb-4">Yazı Bulunamadı</h1>
            <Link href="/blog" className="text-indigo-600 hover:text-indigo-800">
              ← Blog'a Dön
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Cover Image */}
          <div className="h-64 md:h-96 bg-gradient-to-br from-indigo-100 to-coral-100 rounded-2xl flex items-center justify-center text-8xl mb-8">
            {post.coverImage}
          </div>

          {/* Header */}
          <header className="mb-8">
            {/* Topic Badge */}
            <Link
              href={`/blog/topic/${post.topic.slug}`}
              className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full mb-4 hover:bg-indigo-200 transition-colors"
            >
              {post.topic.name}
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-ink-900 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <Link
                  href={`/blog/author/${post.author.handle}`}
                  className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                    {post.author.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-ink-900">{post.author.name}</p>
                    <p className="text-sm text-ink-500">@{post.author.handle}</p>
                  </div>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-ink-500">
                <span>{post.readingTime} dk okuma</span>
                <span>{new Date(post.publishedAt).toLocaleDateString('tr-TR')}</span>
                <span>{views} görüntülenme</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                  isLiked 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>{likes}</span>
              </button>
              
              <button
                onClick={handleSave}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                  isSaved 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                </svg>
                <span>{saves}</span>
              </button>

              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                </svg>
                <span>Paylaş</span>
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Bio */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-12">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                {post.author.avatar}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-ink-900 mb-2">
                  {post.author.name}
                </h3>
                <p className="text-ink-600 mb-3">
                  {post.author.bio}
                </p>
                <div className="flex items-center space-x-4 text-sm text-ink-500">
                  <span>{post.author.followers} takipçi</span>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Takip Et
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-ink-900 mb-6">
              Yorumlar ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                  👤
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Yorumunuzu yazın..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Yorum Yap
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                    {comment.author.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-ink-900">{comment.author.name}</p>
                          <p className="text-sm text-ink-500">@{comment.author.handle}</p>
                        </div>
                        <span className="text-sm text-ink-500">
                          {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <p className="text-ink-700">{comment.content}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-ink-500">
                      <button className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span>{comment.likes}</span>
                      </button>
                      <button className="hover:text-indigo-600 transition-colors">
                        Yanıtla
                      </button>
                      <button className="hover:text-red-600 transition-colors">
                        Raporla
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
