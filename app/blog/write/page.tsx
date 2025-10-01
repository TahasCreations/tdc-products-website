import { Metadata } from 'next';
import BlogEditor from '../../../components/blog/BlogEditor';
import { requireAuth } from '@/lib/auth/middleware';

export const metadata: Metadata = {
  title: 'Blog Yaz — TDC Market',
  description: 'TDC Market blogunda yazı yazın ve fikirlerinizi paylaşın.',
  robots: 'noindex, nofollow', // Don't index write page
};

export default function BlogWritePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Yeni Yazı Yaz
            </h1>
            <p className="text-gray-600">
              Fikirlerinizi paylaşın ve TDC Market topluluğuna katkıda bulunun
            </p>
          </div>

          <BlogEditor />
        </div>
      </div>
    </div>
  );
}
