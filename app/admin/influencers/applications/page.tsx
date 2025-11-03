"use client";

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Users2,
  TrendingUp, 
  Mail, 
  Phone, 
  Instagram,
  Youtube,
  Twitter,
  Sparkles,
  Eye,
  Heart,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

interface InfluencerApplication {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  socialLinks: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };
  followerCounts: {
    instagram?: number;
    youtube?: number;
    tiktok?: number;
    twitter?: number;
  };
  niche: string;
  bio: string;
  averageEngagement?: number;
  collaborationTypes: string[];
}

export default function InfluencerApplicationsPage() {
  const [applications, setApplications] = useState<InfluencerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/influencers/applications');
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      } else {
        // Veritabanından gerçek veri gelecek
        setApplications([]);
      }
    } catch (error) {
      console.error('Influencer başvuruları yüklenirken hata:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: string, userId: string) => {
    if (!confirm('Bu influencer başvurusunu onaylamak istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch('/api/influencers/applications/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, userId })
      });

      if (response.ok) {
        alert('Influencer başvurusu onaylandı!');
        fetchApplications();
      } else {
        const error = await response.json();
        alert(`Hata: ${error.message || 'Onaylama başarısız'}`);
      }
    } catch (error) {
      console.error('Onaylama hatası:', error);
      alert('Onaylama sırasında hata oluştu');
    }
  };

  const handleReject = async (applicationId: string) => {
    if (!confirm('Bu başvuruyu reddetmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch('/api/influencers/applications/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId })
      });

      if (response.ok) {
        alert('Başvuru reddedildi');
        fetchApplications();
      } else {
        alert('Reddetme işlemi başarısız');
      }
    } catch (error) {
      console.error('Reddetme hatası:', error);
      alert('Reddetme sırasında hata oluştu');
    }
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.status === filter
  );

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  const getTotalFollowers = (app: InfluencerApplication) => {
    return Object.values(app.followerCounts || {}).reduce((sum, count) => sum + (count || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CBA135]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Influencer Başvuruları</h1>
              <p className="text-gray-600">Influencer başvurularını inceleyin ve yönetin</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Toplam Başvuru</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users2 className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700 mb-1">Bekleyen</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Onaylanan</p>
                <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">Reddedilen</p>
                <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Tümü' : 
                 status === 'pending' ? 'Bekleyen' :
                 status === 'approved' ? 'Onaylanan' : 'Reddedilen'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Henüz Influencer Başvurusu Yok
              </h3>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                Influencer'lar başvurduğunda burada görünecekler. 
                Başvuru formu: /partner/influencer-ol
              </p>
            </motion.div>
          ) : (
            filteredApplications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{app.user.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {app.user.email}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">
                      "{app.bio}"
                    </p>

                    {/* Niche */}
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {app.niche}
                      </span>
                    </div>

                    {/* Social Links & Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Social Platforms */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Sosyal Medya</h4>
                        {app.socialLinks.instagram && (
                          <a
                            href={app.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700"
                          >
                            <Instagram className="w-4 h-4" />
                            Instagram ({app.followerCounts.instagram?.toLocaleString()} takipçi)
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {app.socialLinks.youtube && (
                          <a
                            href={app.socialLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                          >
                            <Youtube className="w-4 h-4" />
                            YouTube ({app.followerCounts.youtube?.toLocaleString()} abone)
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {app.socialLinks.tiktok && (
                          <a
                            href={app.socialLinks.tiktok}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-900 hover:text-gray-700"
                          >
                            <Sparkles className="w-4 h-4" />
                            TikTok ({app.followerCounts.tiktok?.toLocaleString()} takipçi)
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {app.socialLinks.twitter && (
                          <a
                            href={app.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                          >
                            <Twitter className="w-4 h-4" />
                            Twitter ({app.followerCounts.twitter?.toLocaleString()} takipçi)
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">İstatistikler</h4>
                        <div className="flex items-center gap-2 text-sm">
                          <Users2 className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-600">Toplam Takipçi:</span>
                          <span className="font-bold text-gray-900">{getTotalFollowers(app).toLocaleString()}</span>
                        </div>
                        {app.averageEngagement && (
                          <div className="flex items-center gap-2 text-sm">
                            <Heart className="w-4 h-4 text-pink-600" />
                            <span className="text-gray-600">Ortalama Etkileşim:</span>
                            <span className="font-bold text-gray-900">{app.averageEngagement}%</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <MessageCircle className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">İşbirliği Türleri:</span>
                          <span className="font-medium text-gray-900">
                            {app.collaborationTypes.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Başvuru: {new Date(app.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="ml-6 flex flex-col items-end gap-3">
                    {/* Status Badge */}
                    <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                      app.status === 'approved' ? 'bg-green-100 text-green-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {app.status === 'approved' && <CheckCircle className="w-4 h-4" />}
                      {app.status === 'rejected' && <XCircle className="w-4 h-4" />}
                      {app.status === 'pending' && <Clock className="w-4 h-4" />}
                      {app.status === 'approved' ? 'Onaylandı' :
                       app.status === 'rejected' ? 'Reddedildi' : 'Bekliyor'}
                    </div>

                    {/* Action Buttons */}
                    {app.status === 'pending' && (
                      <div className="flex flex-col gap-2 w-full">
                        <button
                          onClick={() => handleApprove(app.id, app.user.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Onayla
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          <XCircle className="w-4 h-4" />
                          Reddet
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Empty State with CTA */}
        {applications.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Henüz Influencer Başvurusu Yok
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              İlk influencer başvurusu geldiğinde burada görünecek. 
              Influencer'lar başvuru formunu kullanarak katılabilirler.
            </p>
            <a
              href="/partner/influencer-ol"
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              <ExternalLink className="w-5 h-5" />
              Başvuru Formunu Görüntüle
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function getTotalFollowers(app: InfluencerApplication): number {
  return Object.values(app.followerCounts || {}).reduce((sum, count) => sum + (count || 0), 0);
}

