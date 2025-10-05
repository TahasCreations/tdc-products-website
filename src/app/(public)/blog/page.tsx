'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setPosts([
      {
        id: 1,
        title: 'TDC Market\'te En Popüler Figür Koleksiyonları',
        excerpt: 'Bu yılın en çok tercih edilen figür koleksiyonlarını keşfedin...',
        author: {
          name: 'Ahmet Yılmaz',
          handle: 'ahmet_yilmaz',
          avatar: '👨‍💼'
        },
        topic: {
          name: 'Koleksiyon',
          slug: 'koleksiyon'
        },
        coverImage: '🎭',
        readingTime: 5,
        publishedAt: '2024-10-30',
        likes: 42,
        saves: 18,
        views: 1250,
        tags: ['figür', 'koleksiyon', 'trend']
      },
      {
        id: 2,
        title: 'Elektronik Ürünlerde Kalite Rehberi',
        excerpt: 'TDC Market\'te elektronik ürün seçerken dikkat edilmesi gerekenler...',
        author: {
          name: 'Sarah Johnson',
          handle: 'sarah_j',
          avatar: '👩‍💻'
        },
        topic: {
          name: 'Elektronik',
          slug: 'elektronik'
        },
        coverImage: '📱',
        readingTime: 8,
        publishedAt: '2024-10-29',
        likes: 28,
        saves: 12,
        views: 890,
        tags: ['elektronik', 'kalite', 'rehber']
      },
      {
        id: 3,
        title: 'Moda Trendleri: Bu Sezonun Favorileri',
        excerpt: 'Sonbahar-kış sezonu için moda önerileri ve trend analizi...',
        author: {
          name: 'Mehmet Kaya',
          handle: 'mehmet_k',
          avatar: '👨‍🎨'
        },
        topic: {
          name: 'Moda',
          slug: 'moda'
        },
        coverImage: '👗',
        readingTime: 6,
        publishedAt: '2024-10-28',
        likes: 35,
        saves: 22,
        views: 1100,
        tags: ['moda', 'trend', 'stil']
      }
    ]);

    setTopics([
      { name: 'Tümü', slug: 'all', count: 15 },
      { name: 'Koleksiyon', slug: 'koleksiyon', count: 5 },
      { name: 'Elektronik', slug: 'elektronik', count: 3 },
      { name: 'Moda', slug: 'moda', count: 4 },
      { name: 'Ev & Yaşam', slug: 'ev-yasam', count: 2 },
      { name: 'Sanat', slug: 'sanat', count: 1 }
    ]);

    setIsLoading(false);
  }, []);

  const filteredPosts = posts.filter(post => 
    selectedTopic === 'all' || post.topic.slug === selectedTopic
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return (b.likes + b.saves + b.views) - (a.likes + a.saves + a.views);
      case 'newest':
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case 'popular':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Blog yükleniyor...</p>
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
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-50 to-coral-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl lg:text-5xl font-bold text-ink-900 mb-4"
              >
                TDC Market Blog
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-ink-600 mb-8 max-w-2xl mx-auto"
              >
                Topluluk tarafından yazılan içerikler, trend analizleri ve ürün incelemeleri
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  href="/blog/write"
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  ✍️ Blog Yaz
                </Link>
                <Link
                  href="/blog/rss.xml"
                  className="px-8 py-4 border-2 border-indigo-300 text-indigo-700 rounded-2xl font-semibold hover:border-indigo-400 hover:text-indigo-800 transition-colors"
                >
                  📡 RSS Feed
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Topic Filter */}
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <button
                    key={topic.slug}
                    onClick={() => setSelectedTopic(topic.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedTopic === topic.slug
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {topic.name} ({topic.count})
                  </button>
                ))}
              </div>

              {/* Sort Filter */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Sırala:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="trending">Trend</option>
                  <option value="newest">En Yeni</option>
                  <option value="popular">Popüler</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Link
                    href={`/blog/${post.id}`}
                    className="block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-indigo-300"
                  >
                    {/* Cover Image */}
                    <div className="h-48 bg-gradient-to-br from-indigo-100 to-coral-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                      {post.coverImage}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Topic Badge */}
                      <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full mb-3">
                        {post.topic.name}
                      </span>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-ink-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-ink-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Author */}
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm mr-3">
                          {post.author.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink-900">{post.author.name}</p>
                          <p className="text-xs text-ink-500">@{post.author.handle}</p>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-sm text-ink-500">
                        <div className="flex items-center space-x-4">
                          <span>{post.readingTime} dk okuma</span>
                          <span>{new Date(post.publishedAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            {post.likes}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                            </svg>
                            {post.saves}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                            {post.views}
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors">
                Daha Fazla Yükle
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
