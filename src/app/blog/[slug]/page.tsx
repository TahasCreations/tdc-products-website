'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { PageLoader } from '../../../components/LoadingSpinner';

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

interface BlogPost {
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
  status: 'published' | 'pending' | 'rejected';
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!params.slug) return;

      const supabase = createClientSupabaseClient();
      if (!supabase) {
        console.error('Supabase client could not be created');
        setLoading(false);
        return;
      }

      try {
        // Blog'u getir
        const { data: blogData, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', params.slug)
          .eq('status', 'published')
          .single();

        if (error || !blogData) {
          console.error('Blog not found:', error);
          router.push('/blog');
          return;
        }

        setBlog(blogData);

        // İlgili blog'ları getir
        const { data: relatedData } = await supabase
          .from('blogs')
          .select('*')
          .eq('status', 'published')
          .eq('category', blogData.category)
          .neq('id', blogData.id)
          .limit(3);

        setRelatedBlogs(relatedData || []);
      } catch (error) {
        console.error('Error fetching blog:', error);
        router.push('/blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.slug, router]);

  if (loading) {
    return <PageLoader text="Blog yükleniyor..." />;
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Bulunamadı</h1>
          <p className="text-gray-600 mb-6">Aradığınız blog yazısı mevcut değil.</p>
          <Link
            href="/blog"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Blog&apos;a Dön
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative py-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-white/80 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <i className="ri-arrow-right-s-line"></i>
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-white font-medium">{blog.title}</span>
          </nav>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blog Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              {blog.category}
            </span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {blog.title}
          </h1>
          
          <div className="flex items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <i className="ri-user-line"></i>
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-time-line"></i>
              <span>{formatDate(blog.published_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-book-open-line"></i>
              <span>{blog.read_time} dakika okuma</span>
            </div>
          </div>

          {blog.image && (
            <div className="mb-6">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-64 lg:h-96 object-cover rounded-xl"
              />
            </div>
          )}

          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            {blog.excerpt}
          </p>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Blog Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">İlgili Blog Yazıları</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog.id}
                  href={`/blog/${relatedBlog.slug}`}
                  className="group block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                >
                  {relatedBlog.image && (
                    <img
                      src={relatedBlog.image}
                      alt={relatedBlog.title}
                      className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform"
                    />
                  )}
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {relatedBlog.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {relatedBlog.excerpt}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <span>{relatedBlog.author}</span>
                    <span>•</span>
                    <span>{formatDate(relatedBlog.published_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
