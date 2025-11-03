'use client';

import { Suspense } from 'react';
import GiftRegistryManager from '@/components/gift-registry/GiftRegistryManager';

export default function GiftRegistryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Hediye listeleri yükleniyor...</p>
            </div>
          </div>
        }>
          <GiftRegistryManager />
        </Suspense>
      </div>
    </div>
  );
}

