'use client';

import { Suspense } from 'react';
import CommunityForum from '@/components/community/CommunityForum';

export default function ForumPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Forum yükleniyor...</p>
      </div>
    </div>}>
      <CommunityForum />
    </Suspense>
  );
}

