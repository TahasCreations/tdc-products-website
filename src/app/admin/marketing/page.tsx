'use client';

import { useState, useEffect } from 'react';
import { 
  MegaphoneIcon,
  ChartBarIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import AdminProtection from '../../../components/AdminProtection';

interface MarketingData {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpent: number;
  totalRevenue: number;
  campaigns: Array<{
  id: string;
  name: string;
    type: 'email' | 'social' | 'google_ads' | 'facebook_ads';
    status: 'active' | 'paused' | 'completed' | 'draft';
    budget: number;
    spent: number;
    impressions: number;
    clicks: number;
    conversions: number;
    startDate: string;
    endDate: string;
    targetAudience: string;
  }>;
  emailCampaigns: Array<{
    id: string;
  subject: string;
    sent: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
    status: 'sent' | 'scheduled' | 'draft';
    sendDate: string;
  }>;
  socialMediaStats: Array<{
    platform: string;
    followers: number;
    engagement: number;
    posts: number;
    reach: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export default function MarketingPage() {
  const [marketingData, setMarketingData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [showAddEmail, setShowAddEmail] = useState(false);

  useEffect(() => {
    // Simüle edilmiş pazarlama verisi
    const mockData: MarketingData = {
      totalCampaigns: 24,
      activeCampaigns: 8,
      totalSpent: 45680,
      totalRevenue: 125600,
      campaigns: [
        {
          id: '1',
          name: 'Yaz İndirimi Kampanyası',
          type: 'email',
          status: 'active',
          budget: 5000,
          spent: 3200,
          impressions: 45000,
          clicks: 1200,
          conversions: 45,
          startDate: '2024-01-15',
          endDate: '2024-02-15',
          targetAudience: 'Tüm müşteriler'
        },
        {
          id: '2',
          name: 'Google Ads - Elektronik',
          type: 'google_ads',
          status: 'active',
          budget: 10000,
          spent: 6800,
          impressions: 120000,
          clicks: 3200,
          conversions: 89,
          startDate: '2024-01-10',
          endDate: '2024-03-10',
          targetAudience: 'Elektronik alıcıları'
        },
        {
          id: '3',
          name: 'Facebook Ads - Giyim',
          type: 'facebook_ads',
          status: 'paused',
          budget: 8000,
          spent: 4500,
          impressions: 85000,
          clicks: 2100,
          conversions: 67,
          startDate: '2024-01-20',
          endDate: '2024-02-20',
          targetAudience: '18-35 yaş arası'
        },
        {
          id: '4',
          name: 'Instagram Story Kampanyası',
          type: 'social',
          status: 'completed',
          budget: 3000,
          spent: 3000,
          impressions: 65000,
          clicks: 1800,
          conversions: 34,
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          targetAudience: 'Genç yetişkinler'
        }
      ],
      emailCampaigns: [
        {
          id: '1',
          subject: 'Yeni Ürünler Geldi! %20 İndirim',
          sent: 5000,
          opened: 2500,
          clicked: 450,
          unsubscribed: 25,
          status: 'sent',
          sendDate: '2024-01-20'
        },
        {
          id: '2',
          subject: 'Haftalık Bülten - En Popüler Ürünler',
          sent: 4800,
          opened: 1920,
          clicked: 320,
          unsubscribed: 15,
          status: 'sent',
          sendDate: '2024-01-18'
        },
        {
          id: '3',
          subject: 'Özel Müşteri İndirimi',
          sent: 0,
          opened: 0,
          clicked: 0,
          unsubscribed: 0,
          status: 'scheduled',
          sendDate: '2024-01-25'
        }
      ],
      socialMediaStats: [
        { platform: 'Instagram', followers: 12500, engagement: 4.2, posts: 45, reach: 85000 },
        { platform: 'Facebook', followers: 8900, engagement: 3.8, posts: 32, reach: 65000 },
        { platform: 'Twitter', followers: 5600, engagement: 2.9, posts: 28, reach: 32000 },
        { platform: 'LinkedIn', followers: 3400, engagement: 5.1, posts: 15, reach: 18000 }
      ],
      recentActivities: [
        { id: '1', type: 'campaign', description: 'Yeni kampanya oluşturuldu: Yaz İndirimi', timestamp: '2 saat önce' },
        { id: '2', type: 'email', description: 'E-posta kampanyası gönderildi: 5,000 kişi', timestamp: '4 saat önce' },
        { id: '3', type: 'social', description: 'Instagram gönderisi yayınlandı', timestamp: '6 saat önce' },
        { id: '4', type: 'ads', description: 'Google Ads bütçesi güncellendi', timestamp: '8 saat önce' },
        { id: '5', type: 'analytics', description: 'Haftalık rapor oluşturuldu', timestamp: '1 gün önce' }
      ]
    };

    setTimeout(() => {
      setMarketingData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AdminProtection>
    );
  }

  const getCampaignTypeText = (type: string) => {
    const types: Record<string, string> = {
      'email': 'E-posta',
      'social': 'Sosyal Medya',
      'google_ads': 'Google Ads',
      'facebook_ads': 'Facebook Ads'
    };
    return types[type] || type;
  };

  const getCampaignStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800',
      'paused': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-blue-100 text-blue-800',
      'draft': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCampaignStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      'active': 'Aktif',
      'paused': 'Duraklatıldı',
      'completed': 'Tamamlandı',
      'draft': 'Taslak'
    };
    return statuses[status] || status;
  };

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Pazarlama Yönetimi</h1>
              <p className="text-gray-600">Kampanyalarınızı yönetin ve pazarlama performansını takip edin</p>
            </div>
            <div className="flex space-x-3">
                <button
                onClick={() => setShowAddCampaign(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                <PlusIcon className="h-4 w-4 mr-2" />
                Kampanya Oluştur
                </button>
              <button
                onClick={() => setShowAddEmail(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                E-posta Gönder
                </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {[
              { id: 'overview', label: 'Genel Bakış' },
              { id: 'campaigns', label: 'Kampanyalar' },
              { id: 'email', label: 'E-posta' },
              { id: 'social', label: 'Sosyal Medya' },
              { id: 'analytics', label: 'Analiz' }
            ].map((tab) => (
            <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                <MegaphoneIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Kampanya</p>
                <p className="text-2xl font-bold text-gray-900">{marketingData?.totalCampaigns}</p>
                      </div>
                    </div>
                  </div>

          <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Kampanya</p>
                <p className="text-2xl font-bold text-gray-900">{marketingData?.activeCampaigns}</p>
                      </div>
                    </div>
                  </div>

          <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Harcama</p>
                <p className="text-2xl font-bold text-gray-900">₺{marketingData?.totalSpent.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

          <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">₺{marketingData?.totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>
          </div>
        </div>

        {/* Content based on selected tab */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
              <div className="space-y-4">
                {marketingData?.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      activity.type === 'campaign' ? 'bg-blue-500' :
                      activity.type === 'email' ? 'bg-green-500' :
                      activity.type === 'social' ? 'bg-purple-500' :
                      activity.type === 'ads' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sosyal Medya İstatistikleri</h3>
              <div className="space-y-4">
                {marketingData?.socialMediaStats.map((stat) => (
                  <div key={stat.platform} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {stat.platform.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{stat.platform}</p>
                        <p className="text-sm text-gray-600">{stat.followers.toLocaleString()} takipçi</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">%{stat.engagement}</div>
                      <div className="text-sm text-gray-600">etkileşim</div>
                    </div>
                  </div>
                ))}
                  </div>
                </div>
              </div>
            )}

        {selectedTab === 'campaigns' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Kampanyalar</h3>
                  <button
                onClick={() => setShowAddCampaign(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                Yeni Kampanya
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kampanya
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tür
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bütçe
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harcama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dönüşüm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                  {marketingData?.campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-sm text-gray-500">{campaign.targetAudience}</div>
                        </div>
                          </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getCampaignTypeText(campaign.type)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCampaignStatusColor(campaign.status)}`}>
                          {getCampaignStatusText(campaign.status)}
                            </span>
                          </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₺{campaign.budget.toLocaleString()}
                          </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₺{campaign.spent.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.conversions}
                          </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <PencilIcon className="h-4 w-4 inline" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-4 w-4 inline" />
                        </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

        {selectedTab === 'email' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">E-posta Kampanyaları</h3>
                  <button
                onClick={() => setShowAddEmail(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                Yeni E-posta
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Konu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gönderilen
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Açılma
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tıklama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                  {marketingData?.emailCampaigns.map((email) => (
                    <tr key={email.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {email.subject}
                          </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {email.sent.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {email.opened.toLocaleString()} (%{((email.opened / email.sent) * 100).toFixed(1)})
                          </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {email.clicked.toLocaleString()} (%{((email.clicked / email.sent) * 100).toFixed(1)})
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          email.status === 'sent' ? 'bg-green-100 text-green-800' :
                          email.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {email.status === 'sent' ? 'Gönderildi' :
                           email.status === 'scheduled' ? 'Zamanlandı' : 'Taslak'}
                            </span>
                          </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(email.sendDate).toLocaleDateString('tr-TR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

        {selectedTab === 'social' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketingData?.socialMediaStats.map((stat) => (
              <div key={stat.platform} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{stat.platform}</h3>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {stat.platform.charAt(0)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stat.followers.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Takipçi</div>
                      </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">%{stat.engagement}</div>
                    <div className="text-sm text-gray-600">Etkileşim</div>
                      </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stat.posts}</div>
                    <div className="text-sm text-gray-600">Gönderi</div>
                    </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stat.reach.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Erişim</div>
                      </div>
                      </div>
                    </div>
            ))}
                  </div>
        )}

        {selectedTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kampanya Performansı</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Grafik verisi yükleniyor...</p>
                      </div>
                    </div>
                  </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ROI Analizi</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Toplam Harcama</span>
                  <span className="font-medium">₺{marketingData?.totalSpent.toLocaleString()}</span>
                      </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Toplam Gelir</span>
                  <span className="font-medium">₺{marketingData?.totalRevenue.toLocaleString()}</span>
                      </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ROI</span>
                  <span className="font-medium text-green-600">
                    %{((marketingData?.totalRevenue! - marketingData?.totalSpent!) / marketingData?.totalSpent! * 100).toFixed(1)}
                  </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

        {/* Add Campaign Modal */}
        {showAddCampaign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Kampanya Oluştur</h2>
              <form className="space-y-4">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kampanya Adı</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Kampanya adı girin"
                    />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kampanya Türü</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Tür seçin</option>
                    <option value="email">E-posta</option>
                    <option value="social">Sosyal Medya</option>
                    <option value="google_ads">Google Ads</option>
                    <option value="facebook_ads">Facebook Ads</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bütçe</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Bütçe girin"
                    />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Kitle</label>
                    <input
                    type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hedef kitle girin"
                    />
                  </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Kampanya Oluştur
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCampaign(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
                  </div>
        )}

        {/* Add Email Modal */}
        {showAddEmail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni E-posta Gönder</h2>
              <form className="space-y-4">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                    <input
                    type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="E-posta konusu"
                    />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alıcı Listesi</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Liste seçin</option>
                    <option value="all">Tüm müşteriler</option>
                    <option value="vip">VIP müşteriler</option>
                    <option value="new">Yeni müşteriler</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                  <textarea
                    rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="E-posta içeriği"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    E-posta Gönder
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddEmail(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </AdminProtection>
  );
}