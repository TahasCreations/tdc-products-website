import { Metadata } from 'next';
import { Suspense } from 'react';
import BlogList from '../../components/blog/BlogList';
import BlogFilters from '../../components/blog/BlogFilters';
import { revalidateTag } from 'next/cache';

export const metadata: Metadata = {
  title: 'Blog — TDC Market',
  description: 'TDC Market blogunda en son trendler, ürün incelemeleri ve sektör haberleri.',
  keywords: ['blog', 'trend', 'inceleme', 'haber', 'TDC Market'],
  openGraph: {
    title: 'Blog — TDC Market',
    description: 'TDC Market blogunda en son trendler, ürün incelemeleri ve sektör haberleri.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://tdcmarket.com/blog',
  },
};

export const revalidate = 3600; // 1 hour

export default async function BlogPage() {
  revalidateTag('blog');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TDC Market Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            En son trendler, ürün incelemeleri ve sektör haberleri
          </p>
        </div>

        {/* Filters */}
        <Suspense fallback={<div>Loading filters...</div>}>
          <BlogFilters />
        </Suspense>

        {/* Blog List */}
        <Suspense fallback={<div>Loading posts...</div>}>
          <BlogList />
        </Suspense>
      </div>
    </div>
  );
}
