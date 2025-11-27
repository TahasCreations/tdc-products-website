'use client';


// Client components are dynamic by default
import { Suspense } from 'react';
import MicroInfluencerDashboard from '@/components/influencer/MicroInfluencerDashboard';

export default function MicroInfluencerDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Dashboard yükleniyor...</p>
            </div>
          </div>
        }>
          <MicroInfluencerDashboard />
        </Suspense>
      </div>
    </div>
  );
}

