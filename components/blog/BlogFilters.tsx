'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface BlogTopic {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

interface BlogFiltersProps {
  topics?: BlogTopic[];
}

export default function BlogFilters({ topics = [] }: BlogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedTopic, setSelectedTopic] = useState(searchParams.get('topic') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  const handleSearch = (value: string) => {
    setSearch(value);
    updateURL({ search: value || null });
  };

  const handleTopicChange = (topicSlug: string) => {
    setSelectedTopic(topicSlug);
    updateURL({ topic: topicSlug || null });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateURL({ sort });
  };

  const updateURL = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    router.push(`/blog?${newSearchParams.toString()}`);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedTopic('');
    setSortBy('newest');
    router.push('/blog');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
    >
      <div className="space-y-6">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Arama
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Yazı ara..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Topics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTopicChange('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedTopic
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü
            </button>
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicChange(topic.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTopic === topic.slug
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {topic.name} ({topic.postCount})
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
            Sıralama
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="newest">En Yeni</option>
            <option value="trending">Trend</option>
            <option value="most_liked">En Beğenilen</option>
            <option value="most_viewed">En Çok Okunan</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(search || selectedTopic || sortBy !== 'newest') && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
