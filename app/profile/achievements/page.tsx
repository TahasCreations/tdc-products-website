'use client';


// Client components are dynamic by default
import { Suspense } from 'react';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';
import ReferralProgram from '@/components/referral/ReferralProgram';

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎮 Başarımlar & Ödüller
          </h1>
          <p className="text-lg text-gray-600">
            Görevleri tamamla, puan kazan, özel ödüller kazan!
          </p>
        </div>

        {/* Gamification Dashboard */}
        <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-xl"></div>}>
          <GamificationDashboard />
        </Suspense>

        {/* Referral Program */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            💰 Arkadaşını Getir Programı
          </h2>
          <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded-xl"></div>}>
            <ReferralProgram />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

