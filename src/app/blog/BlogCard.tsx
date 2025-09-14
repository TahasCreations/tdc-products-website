'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  published_at: string;
  read_time: number;
  tags: string[];
};

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy');
    } catch {
      return 'Tarih belirtilmemiş';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'anime':
        return 'bg-pink-100 text-pink-800';
      case 'gaming':
        return 'bg-blue-100 text-blue-800';
      case 'film':
        return 'bg-purple-100 text-purple-800';
      case 'koleksiyon':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.image || '/blog/default-blog.jpg'}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 text-white text-sm">
          <span className="flex items-center space-x-1">
            <i className="ri-time-line" />
            <span>{post.read_time} dk</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="flex items-center space-x-1">
            <i className="ri-user-line" />
            <span>{post.author}</span>
          </span>
          <span className="mx-2">•</span>
          <span>{formatDate(post.published_at)}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Read More Button */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
        >
          Devamını Oku
          <i className="ri-arrow-right-line ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}