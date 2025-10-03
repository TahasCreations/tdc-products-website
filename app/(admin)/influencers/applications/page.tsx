"use client";

import { useState, useEffect } from 'react';
import { requireAdmin } from '@/src/lib/guards';

interface InfluencerApplication {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  platforms: string[];
  followers: number;
  profileUrl?: string;
  status: string;
  categories: string[];
  createdAt: string;
}

export default function InfluencerApplicationsPage() {
  const [applications, setApplications] = useState<InfluencerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // Mock data - gerçek uygulamada API'den gelecek
      setApplications([
        {
          id: 'inf1',
          userId: 'user1',
          displayName: 'TechReviewer',
          bio: 'Teknoloji ürünleri hakkında detaylı incelemeler yapıyorum',
          platforms: ['INSTAGRAM', 'YOUTUBE'],
          followers: 50000,
          profileUrl: 'https://instagram.com/techreviewer',
          status: 'PENDING',
          categories: ['Elektronik', 'Teknoloji'],
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 'inf2',
          userId: 'user2',
          displayName: 'FashionInfluencer',
          bio: 'Moda ve lifestyle içerikleri',
          platforms: ['INSTAGRAM', 'TIKTOK'],
          followers: 75000,
          profileUrl: 'https://instagram.com/fashioninfluencer',
          status: 'PENDING',
          categories: ['Moda', 'Lifestyle'],
          createdAt: '2024-01-14T15:30:00Z'
        }
      ]);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId: string, approve: boolean) => {
    setProcessing(userId);
    try {
      const response = await fetch('/api/influencers/applications/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, approve })
      });

      if (response.ok) {
        // Başvuru listesini güncelle
        setApplications(prev => 
          prev.map(app => 
            app.userId === userId 
              ? { ...app, status: approve ? 'APPROVED' : 'REJECTED' }
              : app
          )
        );
      } else {
        alert('İşlem başarısız. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert('İşlem başarısız. Lütfen tekrar deneyin.');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'INSTAGRAM': return '📷';
      case 'TIKTOK': return '🎵';
      case 'YOUTUBE': return '📺';
      default: return '📱';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Influencer Başvuruları</h1>
      
      {applications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz başvuru yok</h3>
          <p className="text-gray-500">Yeni influencer başvuruları burada görünecek.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-lg">
                        {app.displayName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{app.displayName}</h3>
                      <p className="text-sm text-gray-500">@{app.userId}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  {app.bio && (
                    <p className="text-gray-700 mb-4">{app.bio}</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Takipçi Sayısı</p>
                      <p className="font-semibold">{app.followers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Platformlar</p>
                      <div className="flex space-x-2">
                        {app.platforms.map((platform) => (
                          <span key={platform} className="text-lg">
                            {getPlatformIcon(platform)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kategoriler</p>
                      <div className="flex flex-wrap gap-1">
                        {app.categories.map((category) => (
                          <span key={category} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {app.profileUrl && (
                    <div className="mb-4">
                      <a 
                        href={app.profileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 text-sm"
                      >
                        Profil Linki →
                      </a>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    Başvuru Tarihi: {new Date(app.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>

                {app.status === 'PENDING' && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleApproval(app.userId, true)}
                      disabled={processing === app.userId}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {processing === app.userId ? 'İşleniyor...' : 'Onayla'}
                    </button>
                    <button
                      onClick={() => handleApproval(app.userId, false)}
                      disabled={processing === app.userId}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Reddet
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
