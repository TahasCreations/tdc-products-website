'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, Eye, User, Clock, Search, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    level: string;
  };
  category: string;
  views: number;
  replies: number;
  likes: number;
  isPinned: boolean;
  isSolved: boolean;
  createdAt: string;
  lastReply?: string;
}

interface ForumCategory {
  id: string;
  name: string;
  icon: string;
  topicCount: number;
  color: string;
}

export default function CommunityForum() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchForumData();
  }, [selectedCategory]);

  const fetchForumData = async () => {
    try {
      const response = await fetch(`/api/community/topics?category=${selectedCategory}`);
      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics || []);
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch forum data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultCategories: ForumCategory[] = [
    { id: 'all', name: 'Tüm Konular', icon: '📋', topicCount: 0, color: 'gray' },
    { id: 'questions', name: 'Sorular', icon: '❓', topicCount: 0, color: 'blue' },
    { id: 'reviews', name: 'Ürün Tavsiyeleri', icon: '⭐', topicCount: 0, color: 'yellow' },
    { id: 'diy', name: 'DIY & Projeler', icon: '🛠️', topicCount: 0, color: 'purple' },
    { id: 'unboxing', name: 'Kutu Açılışları', icon: '📦', topicCount: 0, color: 'green' },
    { id: 'deals', name: 'Fırsatlar', icon: '💰', topicCount: 0, color: 'red' }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🤝 Topluluk Forumu</h1>
          <p className="text-lg text-gray-600">
            Sorularını sor, deneyimlerini paylaş, diğer kullanıcılarla etkileşime geç
          </p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Yeni Konu Aç</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Forumlarda ara..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none text-gray-900"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-8">
        {displayCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
            {category.topicCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {category.topicCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Topics List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz Konu Yok</h3>
          <p className="text-gray-600 mb-6">İlk konuyu sen aç ve topluluğu başlat!</p>
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
            İlk Konuyu Aç
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTopics.map((topic) => (
            <motion.div
              key={topic.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-indigo-300 transition-all cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                {/* Author Avatar */}
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {topic.author.avatar || topic.author.name.charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Badges */}
                  <div className="flex items-center space-x-2 mb-2">
                    {topic.isPinned && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
                        📌 Sabitlendi
                      </span>
                    )}
                    {topic.isSolved && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                        ✅ Çözüldü
                      </span>
                    )}
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {topic.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
                    {topic.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {topic.content}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{topic.author.name}</span>
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">
                        {topic.author.level}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{topic.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{topic.replies}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{topic.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{topic.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

