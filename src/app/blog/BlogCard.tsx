'use client';

import { useState } from 'react';
import Image from 'next/image';

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

interface BlogCardProps {
  blog: BlogPost;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Anime':
        return 'bg-pink-100 text-pink-800';
      case 'Gaming':
        return 'bg-blue-100 text-blue-800';
      case 'Film':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {!imageError ? (
          <Image
            src={blog.image || '/vercel.svg'}
            alt={blog.title}
            width={400}
            height={192}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
            <i className="ri-image-line text-4xl text-orange-400"></i>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(blog.category)}`}>
            {blog.category}
          </span>
        </div>

        {/* Read Time */}
        <div className="absolute top-4 right-4">
          <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-medium">
            {blog.readTime} dk okuma
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Full Content (Expandable) */}
        {showFullContent && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 text-sm leading-relaxed">
              {blog.content}
            </p>
          </div>
        )}

        {/* Author and Date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <i className="ri-user-line text-orange-600 text-sm"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{blog.author}</p>
              <p className="text-xs text-gray-500">{formatDate(blog.date)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center space-x-1 transition-colors duration-300"
          >
            <i className={`ri-${showFullContent ? 'arrow-up' : 'arrow-down'}-line`}></i>
            <span>{showFullContent ? 'Daha Az Göster' : 'Devamını Oku'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors duration-300">
              <i className="ri-heart-line"></i>
            </button>
            <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors duration-300">
              <i className="ri-share-line"></i>
            </button>
            <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors duration-300">
              <i className="ri-bookmark-line"></i>
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {blog.category && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                #{blog.category.toLowerCase()}
              </span>
            )}
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              #figür
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              #koleksiyon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}