'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PWAManager from '../../../components/pwa/PWAManager';
import AdminProtection from '../../../components/AdminProtection';
import { 
  DevicePhoneMobileIcon,
  BellIcon,
  CloudIcon,
  ChartBarIcon,
  CogIcon,
  ArrowDownTrayIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

interface PWAStats {
  installs: number;
  activeUsers: number;
  pushSubscriptions: number;
  offlineUsage: number;
  cacheHitRate: number;
}

interface NotificationCampaign {
  id: string;
  title: string;
  message: string;
  targetAudience: string;
  scheduledAt: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  sentCount: number;
  openRate: number;
}

export default function AdminPWAPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<PWAStats | null>(null);
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'notifications' | 'analytics' | 'settings'>('overview');

  useEffect(() => {
    if (!user) {
      router.push('/admin/login');
      return;
    }
    
    fetchPWAStats();
    fetchNotificationCampaigns();
  }, [user, router]);

  const fetchPWAStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/pwa/stats');
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching PWA stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationCampaigns = async () => {
    try {
      const response = await fetch('/api/admin/pwa/notifications');
      const data = await response.json();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('Error fetching notification campaigns:', error);
    }
  };

  const sendTestNotification = async () => {
    try {
      const response = await fetch('/api/admin/pwa/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Bildirimi',
          message: 'Bu bir test bildirimidir.',
          targetAudience: 'all'
        })
      });
      
      if (response.ok) {
        alert('Test bildirimi gönderildi!');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('Test bildirimi gönderilemedi.');
    }
  };

  const createNotificationCampaign = async (campaign: Omit<NotificationCampaign, 'id' | 'sentCount' | 'openRate'>) => {
    try {
      const response = await fetch('/api/admin/pwa/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaign)
      });
      
      if (response.ok) {
        fetchNotificationCampaigns();
        alert('Bildirim kampanyası oluşturuldu!');
      }
    } catch (error) {
      console.error('Error creating notification campaign:', error);
      alert('Bildirim kampanyası oluşturulamadı.');
    }
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">PWA Yönetimi</h1>
          <p className="text-gray-600 mt-2">Progressive Web App özelliklerini yönetin ve analiz edin</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ArrowDownTrayIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Yükleme</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.installs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DevicePhoneMobileIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BellIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Push Aboneliği</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pushSubscriptions}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CloudIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Offline Kullanım</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.offlineUsage}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cache Hit Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.cacheHitRate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Genel Bakış', icon: ChartBarIcon },
                { id: 'notifications', name: 'Bildirimler', icon: BellIcon },
                { id: 'analytics', name: 'Analitik', icon: ChartBarIcon },
                { id: 'settings', name: 'Ayarlar', icon: CogIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">PWA Genel Bakış</h3>
                <PWAManager />
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Bildirim Kampanyaları</h3>
                  <div className="space-x-3">
                    <button
                      onClick={sendTestNotification}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Test Bildirimi Gönder
                    </button>
                    <button
                      onClick={() => {/* Create campaign modal */}}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Yeni Kampanya
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kampanya
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hedef Kitle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gönderilen
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Açılma Oranı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {campaigns.map((campaign) => (
                        <tr key={campaign.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                              <div className="text-sm text-gray-500">{campaign.message}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {campaign.targetAudience}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                              campaign.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                              campaign.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {campaign.sentCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            %{campaign.openRate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(campaign.scheduledAt).toLocaleDateString('tr-TR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">PWA Analitikleri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">Kullanım İstatistikleri</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Günlük Aktif Kullanıcı</span>
                        <span className="font-semibold">1,234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Haftalık Aktif Kullanıcı</span>
                        <span className="font-semibold">8,765</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Aylık Aktif Kullanıcı</span>
                        <span className="font-semibold">32,109</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">Performans Metrikleri</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ortalama Yükleme Süresi</span>
                        <span className="font-semibold">1.2s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cache Hit Rate</span>
                        <span className="font-semibold">85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Offline Kullanım</span>
                        <span className="font-semibold">23%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">PWA Ayarları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">Genel Ayarlar</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">PWA Etkin</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Push Bildirimleri</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Offline Desteği</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">Cache Ayarları</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cache Süresi (gün)
                        </label>
                        <input
                          type="number"
                          defaultValue="30"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maksimum Cache Boyutu (MB)
                        </label>
                        <input
                          type="number"
                          defaultValue="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </AdminProtection>
  );
}
