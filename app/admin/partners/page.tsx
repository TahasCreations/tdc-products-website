"use client";
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, User, Store, TrendingUp, Mail, Phone, MapPin } from 'lucide-react';

interface Application {
  id: string;
  type: 'seller' | 'influencer';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  data: any;
}

export default function PartnersPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'seller' | 'influencer'>('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // TODO: API endpoint'i oluşturulacak
      // const response = await fetch('/api/admin/applications');
      // const data = await response.json();
      
      // Demo veriler temizlendi - API'den gerçek veriler gelecek
      setApplications([]);
    } catch (error) {
      console.error('Başvurular yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: string, userId: string, role: string) => {
    try {
      // TODO: API endpoint'i oluşturulacak
      // await fetch('/api/admin/approve', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId, role })
      // });
      
      // Mock approval
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: 'approved' } : app
      ));
      
      alert('Başvuru onaylandı!');
    } catch (error) {
      console.error('Onaylama hatası:', error);
      alert('Onaylama sırasında hata oluştu');
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      // TODO: API endpoint'i oluşturulacak
      // await fetch('/api/admin/reject', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ applicationId })
      // });
      
      // Mock rejection
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: 'rejected' } : app
      ));
      
      alert('Başvuru reddedildi!');
    } catch (error) {
      console.error('Reddetme hatası:', error);
      alert('Reddetme sırasında hata oluştu');
    }
  };

  const filteredApplications = applications.filter(app => {
    const statusMatch = filter === 'all' || app.status === filter;
    const typeMatch = typeFilter === 'all' || app.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Onaylandı';
      case 'rejected': return 'Reddedildi';
      default: return 'Beklemede';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'seller': return <Store className="w-5 h-5 text-blue-500" />;
      case 'influencer': return <TrendingUp className="w-5 h-5 text-purple-500" />;
      default: return <User className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'seller': return 'Satıcı';
      case 'influencer': return 'Influencer';
      default: return 'Bilinmiyor';
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Başvuru Yönetimi</h1>
          <p className="text-gray-600">Satıcı ve influencer başvurularını yönetin</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
              >
                <option value="all">Tümü</option>
                <option value="pending">Beklemede</option>
                <option value="approved">Onaylandı</option>
                <option value="rejected">Reddedildi</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tür</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
              >
                <option value="all">Tümü</option>
                <option value="seller">Satıcı</option>
                <option value="influencer">Influencer</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <User className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Başvuru Bulunamadı</h3>
              <p className="text-gray-600">Seçilen kriterlere uygun başvuru bulunmuyor.</p>
            </div>
          ) : (
            filteredApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      {getTypeIcon(application.type)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.user.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getTypeText(application.type)} Başvurusu
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        {getStatusIcon(application.status)}
                        <span className="text-sm font-medium text-gray-700">
                          {getStatusText(application.status)}
                        </span>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{application.user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(application.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>

                    {/* Application Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Başvuru Detayları</h4>
                      {application.type === 'seller' ? (
                        <div className="space-y-2 text-sm">
                          <p><strong>Mağaza Adı:</strong> {application.data.storeName}</p>
                          <p><strong>Vergi No:</strong> {application.data.taxId}</p>
                          <p><strong>IBAN:</strong> {application.data.iban}</p>
                        </div>
                      ) : (
                        <div className="space-y-2 text-sm">
                          <p><strong>Sosyal Medya:</strong></p>
                          {application.data.socialLinks?.instagram && (
                            <p>Instagram: {application.data.socialLinks.instagram}</p>
                          )}
                          {application.data.socialLinks?.tiktok && (
                            <p>TikTok: {application.data.socialLinks.tiktok}</p>
                          )}
                          {application.data.followerEst && (
                            <p><strong>Takipçi Sayısı:</strong> {application.data.followerEst.toLocaleString()}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {application.status === 'pending' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(application.id, application.user.id, application.type.toUpperCase())}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                        >
                          Onayla
                        </button>
                        <button
                          onClick={() => handleReject(application.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                        >
                          Reddet
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
