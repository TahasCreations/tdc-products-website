'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  ArrowRightIcon,
  TagIcon
} from '@heroicons/react/24/outline';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
}

interface BlogSectionProps {
  posts: BlogPost[];
  onPostClick: (post: BlogPost) => void;
}

export default function BlogSection({ posts, onPostClick }: BlogSectionProps) {
  const featuredPosts = posts.slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-clash font-bold text-ink-900 mb-4">
            Blog & Rehber
          </h2>
          <p className="text-xl text-ink-600 max-w-2xl mx-auto">
            3D figür dünyasından haberler, ipuçları ve rehberler
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post, index) => (
            <article
              key={post.id}
              className="group bg-white rounded-tdc shadow-tdc hover:shadow-tdc-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Post Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm text-ink-700 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <TagIcon className="w-3 h-3 mr-1" />
                    {post.category}
                  </div>
                </div>

                {/* Read Time Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {post.readTime}
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Post Meta */}
                  <div className="flex items-center text-sm text-ink-500 space-x-4">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="w-4 h-4 mr-1" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <span>•</span>
                      <span className="ml-2">{post.author}</span>
                    </div>
                  </div>

                  {/* Post Title */}
                  <h3 className="text-xl font-bold text-ink-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                    {post.title}
                  </h3>

                  {/* Post Excerpt */}
                  <p className="text-ink-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Read More Button */}
                  <Link
                    href={`/blog/${post.id}`}
                    onClick={() => onPostClick(post)}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm group/link transition-colors duration-300"
                    aria-label={`${post.title} yazısını oku`}
                  >
                    Devamını Oku
                    <ArrowRightIcon className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Posts CTA */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center px-8 py-4 bg-gradient-tdc text-white text-lg font-semibold rounded-tdc shadow-tdc-lg hover:shadow-tdc-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Tüm blog yazılarını görüntüle"
          >
            Tüm Yazıları Gör
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-accent-50 rounded-tdc p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-clash font-bold text-ink-900 mb-4">
              Blog Güncellemelerini Kaçırma
            </h3>
            <p className="text-lg text-ink-600 mb-6">
              En son yazılarımız ve özel içeriklerimiz için e-posta listemize katıl
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 rounded-tdc border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                aria-label="E-posta adresi"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-tdc text-white font-semibold rounded-tdc hover:shadow-tdc-lg transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="E-posta listesine katıl"
              >
                Katıl
              </button>
            </form>
            
            <p className="text-sm text-ink-500 mt-4">
              Spam göndermiyoruz. İstediğiniz zaman abonelikten çıkabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

