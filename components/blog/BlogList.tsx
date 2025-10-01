'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { trackEvent, AnalyticsEvent } from '../../lib/analytics/events';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl?: string;
  author: {
    name: string;
    handle: string;
    avatarUrl?: string;
  };
  topic: {
    name: string;
    slug: string;
  };
  tags: string[];
  readingTime: number;
  publishedAt: string;
  likes: number;
  views: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

interface BlogListProps {
  initialPosts?: BlogPost[];
  topic?: string;
  sort?: string;
  search?: string;
}

export default function BlogList({ 
  initialPosts = [], 
  topic, 
  sort = 'newest',
  search 
}: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = async (pageNum: number = 1, reset: boolean = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12',
        sort,
        ...(topic && { topic }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/blog/list?${params}`);
      const data = await response.json();

      if (reset) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }
      
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(1, true);
  }, [topic, sort, search]);

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/blog/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1
              }
            : post
        ));
        
        trackEvent(AnalyticsEvent.BLOG_LIKE, { postId });
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleSave = async (postId: string) => {
    try {
      const response = await fetch(`/api/blog/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, isSaved: !post.isSaved }
            : post
        ));
        
        trackEvent(AnalyticsEvent.BLOG_SAVE, { postId });
      }
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPosts(nextPage, false);
  };

  if (posts.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          {search ? 'Arama kriterlerinize uygun yazı bulunamadı.' : 'Henüz yayınlanmış yazı yok.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Cover Image */}
            {post.coverUrl && (
              <div className="relative h-48 w-full">
                <Image
                  src={post.coverUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}

            <div className="p-6">
              {/* Topic Badge */}
              <Link 
                href={`/blog/topic/${post.topic.slug}`}
                className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 text-sm font-medium rounded-full mb-3 hover:bg-indigo-200 transition-colors"
              >
                {post.topic.name}
              </Link>

              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>

              {/* Excerpt */}
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Author & Meta */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {post.author.avatarUrl ? (
                    <Image
                      src={post.author.avatarUrl}
                      alt={post.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {post.author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <Link 
                      href={`/blog/author/${post.author.handle}`}
                      className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                    >
                      {post.author.name}
                    </Link>
                    <div className="text-xs text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString('tr-TR')} • {post.readingTime} dk
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1 text-sm ${
                      post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    } transition-colors`}
                  >
                    <span>❤️</span>
                    <span>{post.likes}</span>
                  </button>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <span>👁️</span>
                    <span>{post.views}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleSave(post.id)}
                  className={`p-2 rounded-full ${
                    post.isSaved 
                      ? 'text-indigo-600 bg-indigo-100' 
                      : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                  } transition-colors`}
                >
                  {post.isSaved ? '🔖' : '📌'}
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
          </button>
        </div>
      )}
    </div>
  );
}
