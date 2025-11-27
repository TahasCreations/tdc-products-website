"use client";


// Client components are dynamic by default
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Clock, 
  CheckCircle, 
  XCircle,
  Package,
  TrendingUp,
  DollarSign,
  MessageCircle,
  Eye
} from 'lucide-react';

interface Collaboration {
  id: string;
  influencer: {
    id: string;
    name: string;
    email: string;
  };
  seller: {
    id: string;
    name: string;
    storeName: string;
  };
  product: {
    id: string;
    name: string;
    image?: string;
  };
  type: 'sponsored_post' | 'product_review' | 'story' | 'video' | 'giveaway';
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  compensation: number;
  deliverables: string[];
  metrics: {
    views?: number;
    likes?: number;
    comments?: number;
    clicks?: number;
    conversions?: number;
  };
}

export default function CollaborationsPage() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/influencers/collabs/list');
      
      if (response.ok) {
        const data = await response.json();
        setCollaborations(data.collaborations || []);
      } else {
        setCollaborations([]);
      }
    } catch (error) {
      console.error('İşbirlikleri yüklenirken hata:', error);
      setCollaborations([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCollaborations = collaborations.filter(collab =>
    filter === 'all' || collab.status === filter
  );

  const stats = {
    total: collaborations.length,
    pending: collaborations.filter(c => c.status === 'pending').length,
    active: collaborations.filter(c => c.status === 'active').length,
    completed: collaborations.filter(c => c.status === 'completed').length,
    totalRevenue: collaborations.reduce((sum, c) => sum + c.compensation, 0)
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      active: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'active': return <TrendingUp className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeName = (type: string) => {
    const names = {
      sponsored_post: 'Sponsorlu Gönderi',
      product_review: 'Ürün İncelemesi',
      story: 'Story',
      video: 'Video',
      giveaway: 'Çekiliş'
    };
    return names[type as keyof typeof names] || type;
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
              <h1 className="text-3xl font-bold text-gray-900">Influencer İşbirlikleri</h1>
              <p className="text-gray-600">Aktif ve tamamlanan işbirliklerini takip edin</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Toplam</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-gray-500" />
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

          <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Aktif</p>
                <p className="text-2xl font-bold text-blue-900">{stats.active}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Tamamlanan</p>
                <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg shadow-sm border border-amber-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700 mb-1">Toplam Gelir</p>
                <p className="text-xl font-bold text-amber-900">₺{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-amber-500" />
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
            {['all', 'pending', 'active', 'completed', 'cancelled'].map((status) => (
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
                 status === 'active' ? 'Aktif' :
                 status === 'completed' ? 'Tamamlanan' : 'İptal'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Collaborations List */}
        {filteredCollaborations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Henüz İşbirliği Yok
            </h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              İlk influencer işbirliği başladığında burada görünecek
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredCollaborations.map((collab, index) => (
              <motion.div
                key={collab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadge(collab.status)}`}>
                        {getStatusIcon(collab.status)}
                        {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                      </div>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {getTypeName(collab.type)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">{collab.product.name}</h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Influencer</p>
                        <p className="font-medium text-gray-900">{collab.influencer.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Satıcı</p>
                        <p className="font-medium text-gray-900">{collab.seller.storeName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Başlangıç</p>
                        <p className="font-medium text-gray-900">
                          {new Date(collab.startDate).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ödeme</p>
                        <p className="font-medium text-gray-900">₺{collab.compensation.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Metrics */}
                    {Object.keys(collab.metrics).length > 0 && (
                      <div className="flex items-center gap-4 text-sm">
                        {collab.metrics.views && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-900 font-medium">
                              {collab.metrics.views.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {collab.metrics.clicks && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-900 font-medium">
                              {collab.metrics.clicks.toLocaleString()} tıklama
                            </span>
                          </div>
                        )}
                        {collab.metrics.conversions && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-900 font-medium">
                              {collab.metrics.conversions} satış
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <button className="ml-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Detaylar
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

