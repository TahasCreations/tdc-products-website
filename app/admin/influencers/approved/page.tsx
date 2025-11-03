"use client";

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users2, 
  TrendingUp, 
  Heart, 
  Eye,
  Sparkles,
  ExternalLink,
  Mail,
  MessageCircle,
  Instagram,
  Youtube,
  Twitter
} from 'lucide-react';

interface ApprovedInfluencer {
  id: string;
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
  averageEngagement: number;
  totalCollaborations: number;
  totalRevenue: number;
  rating: number;
  joinedAt: string;
}

export default function ApprovedInfluencersPage() {
  const [influencers, setInfluencers] = useState<ApprovedInfluencer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedInfluencers();
  }, []);

  const fetchApprovedInfluencers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/influencers/applications?status=approved');
      
      if (response.ok) {
        const data = await response.json();
        setInfluencers(data.applications || []);
      } else {
        setInfluencers([]);
      }
    } catch (error) {
      console.error('Onaylı influencer\'lar yüklenirken hata:', error);
      setInfluencers([]);
    } finally {
      setLoading(false);
    }
  };

  const getTotalFollowers = (influencer: ApprovedInfluencer) => {
    return Object.values(influencer.followerCounts || {}).reduce((sum, count) => sum + (count || 0), 0);
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
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Users2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Onaylanan Influencer'lar</h1>
              <p className="text-gray-600">Aktif influencer'ları yönetin ve performanslarını izleyin</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Toplam Influencer</p>
                <p className="text-2xl font-bold text-gray-900">{influencers.length}</p>
              </div>
              <Users2 className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Toplam Takipçi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {influencers.reduce((sum, inf) => sum + getTotalFollowers(inf), 0).toLocaleString()}
                </p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Toplam İşbirliği</p>
                <p className="text-2xl font-bold text-gray-900">
                  {influencers.reduce((sum, inf) => sum + (inf.totalCollaborations || 0), 0)}
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{influencers.reduce((sum, inf) => sum + (inf.totalRevenue || 0), 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-amber-500" />
            </div>
          </div>
        </motion.div>

        {/* Influencers Grid */}
        {influencers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Henüz Onaylı Influencer Yok
            </h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              İlk influencer başvurusunu onayladığınızda burada görünecek
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {influencers.map((influencer, index) => (
              <motion.div
                key={influencer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Profile */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">
                      {influencer.user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{influencer.user.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{influencer.niche}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Takipçi:</span>
                    <span className="font-bold text-gray-900">
                      {getTotalFollowers(influencer).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Etkileşim:</span>
                    <span className="font-bold text-gray-900">{influencer.averageEngagement}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">İşbirliği:</span>
                    <span className="font-bold text-gray-900">{influencer.totalCollaborations || 0}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-2 mb-4">
                  {influencer.socialLinks.instagram && (
                    <a
                      href={influencer.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors"
                    >
                      <Instagram className="w-4 h-4 text-pink-600" />
                    </a>
                  )}
                  {influencer.socialLinks.youtube && (
                    <a
                      href={influencer.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <Youtube className="w-4 h-4 text-red-600" />
                    </a>
                  )}
                  {influencer.socialLinks.twitter && (
                    <a
                      href={influencer.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
                    >
                      <Twitter className="w-4 h-4 text-blue-600" />
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    href={`mailto:${influencer.user.email}`}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    İletişim
                  </a>
                  <button
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black rounded-lg hover:shadow-md transition-all text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Mesaj
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

