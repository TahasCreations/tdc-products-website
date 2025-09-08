'use client';

import { useState, useEffect } from 'react';
import AdminProtection from '../../../components/AdminProtection';
import OptimizedLoader from '../../../components/OptimizedLoader';

interface MarketingDashboardData {
  totalFollowers: number;
  targetedKeywords: number;
  avgRanking: number;
  avgOpenRate: number;
}

interface Keyword {
  id: string;
  keyword: string;
  search_volume: number;
  difficulty_score: number;
  competition: string;
  is_targeted: boolean;
  current_ranking: number;
  target_ranking: number;
}

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  display_name: string;
  followers_count: number;
  engagement_rate: number;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  total_recipients: number;
  open_rate: number;
  click_rate: number;
  send_date: string;
}

export default function AdminMarketingPage() {
  const [dashboardData, setDashboardData] = useState<MarketingDashboardData | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'seo' | 'social' | 'email'>('dashboard');
  const [showAddKeyword, setShowAddKeyword] = useState(false);
  const [showAddSocialAccount, setShowAddSocialAccount] = useState(false);
  const [showAddEmailCampaign, setShowAddEmailCampaign] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [newKeyword, setNewKeyword] = useState({
    keyword: '',
    search_volume: '',
    difficulty_score: '',
    competition: 'medium',
    is_targeted: false,
    current_ranking: '',
    target_ranking: '',
    notes: ''
  });

  const [newSocialAccount, setNewSocialAccount] = useState({
    platform: 'facebook',
    username: '',
    display_name: '',
    profile_url: '',
    followers_count: '',
    engagement_rate: ''
  });

  const [newEmailCampaign, setNewEmailCampaign] = useState({
    name: '',
    subject: '',
    from_name: '',
    from_email: '',
    content: '',
    send_date: ''
  });

  useEffect(() => {
    fetchMarketingData();
  }, []);

  const fetchMarketingData = async () => {
    try {
      setLoading(true);
      
      const [dashboardResponse, keywordsResponse, socialResponse, emailResponse] = await Promise.all([
        fetch('/api/marketing?type=dashboard'),
        fetch('/api/marketing?type=keywords'),
        fetch('/api/marketing?type=social_accounts'),
        fetch('/api/marketing?type=email_campaigns')
      ]);

      const [dashboardData, keywordsData, socialData, emailData] = await Promise.all([
        dashboardResponse.json(),
        keywordsResponse.json(),
        socialResponse.json(),
        emailResponse.json()
      ]);

      if (dashboardData.success) {
        setDashboardData(dashboardData.data);
      }

      if (keywordsData.success) {
        setKeywords(keywordsData.keywords);
      }

      if (socialData.success) {
        setSocialAccounts(socialData.accounts);
      }

      if (emailData.success) {
        setEmailCampaigns(emailData.campaigns);
      }

    } catch (error) {
      console.error('Fetch marketing data error:', error);
      setMessage('Veriler yüklenemedi');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/marketing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_keyword',
          ...newKeyword,
          search_volume: newKeyword.search_volume ? parseInt(newKeyword.search_volume) : null,
          difficulty_score: newKeyword.difficulty_score ? parseInt(newKeyword.difficulty_score) : null,
          current_ranking: newKeyword.current_ranking ? parseInt(newKeyword.current_ranking) : null,
          target_ranking: newKeyword.target_ranking ? parseInt(newKeyword.target_ranking) : null
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Anahtar kelime başarıyla eklendi');
        setMessageType('success');
        setNewKeyword({
          keyword: '',
          search_volume: '',
          difficulty_score: '',
          competition: 'medium',
          is_targeted: false,
          current_ranking: '',
          target_ranking: '',
          notes: ''
        });
        setShowAddKeyword(false);
        fetchMarketingData();
      } else {
        setMessage(data.error || 'Anahtar kelime eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add keyword error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleAddSocialAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/marketing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_social_account',
          ...newSocialAccount,
          followers_count: newSocialAccount.followers_count ? parseInt(newSocialAccount.followers_count) : 0,
          engagement_rate: newSocialAccount.engagement_rate ? parseFloat(newSocialAccount.engagement_rate) : null
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Sosyal medya hesabı başarıyla eklendi');
        setMessageType('success');
        setNewSocialAccount({
          platform: 'facebook',
          username: '',
          display_name: '',
          profile_url: '',
          followers_count: '',
          engagement_rate: ''
        });
        setShowAddSocialAccount(false);
        fetchMarketingData();
      } else {
        setMessage(data.error || 'Sosyal medya hesabı eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add social account error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleAddEmailCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/marketing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_email_campaign',
          ...newEmailCampaign,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('E-posta kampanyası başarıyla oluşturuldu');
        setMessageType('success');
        setNewEmailCampaign({
          name: '',
          subject: '',
          from_name: '',
          from_email: '',
          content: '',
          send_date: ''
        });
        setShowAddEmailCampaign(false);
        fetchMarketingData();
      } else {
        setMessage(data.error || 'E-posta kampanyası oluşturulamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add email campaign error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getCompetitionColor = (competition: string) => {
    const colors: Record<string, string> = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return colors[competition] || 'bg-gray-100 text-gray-800';
  };

  const getCompetitionText = (competition: string) => {
    const texts: Record<string, string> = {
      'low': 'Düşük',
      'medium': 'Orta',
      'high': 'Yüksek'
    };
    return texts[competition] || competition;
  };

  const getCampaignStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'draft': 'bg-gray-100 text-gray-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'sending': 'bg-yellow-100 text-yellow-800',
      'sent': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCampaignStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      'draft': 'Taslak',
      'scheduled': 'Planlandı',
      'sending': 'Gönderiliyor',
      'sent': 'Gönderildi',
      'failed': 'Başarısız'
    };
    return statuses[status] || status;
  };

  if (loading) {
    return <OptimizedLoader message="Pazarlama verileri yükleniyor..." />;
  }

  return (
    <AdminProtection>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pazarlama & SEO</h1>
            <p className="text-gray-600">SEO optimizasyonu ve pazarlama kampanyaları</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
            <button
              onClick={() => setMessage('')}
              className="float-right text-lg font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'seo'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                SEO
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'social'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sosyal Medya
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'email'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                E-posta
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && dashboardData && (
              <div className="space-y-6">
                {/* Pazarlama Özeti */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <i className="ri-user-heart-line text-2xl text-blue-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Toplam Takipçi</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {dashboardData.totalFollowers.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <i className="ri-search-line text-2xl text-green-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Hedef Anahtar Kelime</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {dashboardData.targetedKeywords}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <i className="ri-trophy-line text-2xl text-yellow-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Ortalama Sıralama</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {dashboardData.avgRanking}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <i className="ri-mail-open-line text-2xl text-purple-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Açılma Oranı</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          %{dashboardData.avgOpenRate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Anahtar Kelimeler</h3>
                  <button
                    onClick={() => setShowAddKeyword(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Anahtar Kelime Ekle
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Anahtar Kelime
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Arama Hacmi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Zorluk
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rekabet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mevcut Sıralama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hedef Sıralama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hedeflenen
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {keywords.map((keyword) => (
                        <tr key={keyword.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {keyword.keyword}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {keyword.search_volume?.toLocaleString() || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {keyword.difficulty_score || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCompetitionColor(keyword.competition)}`}>
                              {getCompetitionText(keyword.competition)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {keyword.current_ranking || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {keyword.target_ranking || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              keyword.is_targeted 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {keyword.is_targeted ? 'Evet' : 'Hayır'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Sosyal Medya Hesapları</h3>
                  <button
                    onClick={() => setShowAddSocialAccount(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Hesap Ekle
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Platform
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kullanıcı Adı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Takipçi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Etkileşim Oranı
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {socialAccounts.map((account) => (
                        <tr key={account.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                            {account.platform}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            @{account.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {account.followers_count.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            %{account.engagement_rate || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">E-posta Kampanyaları</h3>
                  <button
                    onClick={() => setShowAddEmailCampaign(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Kampanya Oluştur
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kampanya Adı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Konu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Alıcı Sayısı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Açılma Oranı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tıklama Oranı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {emailCampaigns.map((campaign) => (
                        <tr key={campaign.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {campaign.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {campaign.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {campaign.total_recipients.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            %{campaign.open_rate || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            %{campaign.click_rate || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCampaignStatusColor(campaign.status)}`}>
                              {getCampaignStatusText(campaign.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Keyword Modal */}
        {showAddKeyword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Anahtar Kelime Ekle</h2>
              <form onSubmit={handleAddKeyword} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Anahtar Kelime</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newKeyword.keyword}
                      onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Arama Hacmi</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newKeyword.search_volume}
                      onChange={(e) => setNewKeyword({ ...newKeyword, search_volume: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zorluk Skoru</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newKeyword.difficulty_score}
                      onChange={(e) => setNewKeyword({ ...newKeyword, difficulty_score: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rekabet</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newKeyword.competition}
                      onChange={(e) => setNewKeyword({ ...newKeyword, competition: e.target.value })}
                    >
                      <option value="low">Düşük</option>
                      <option value="medium">Orta</option>
                      <option value="high">Yüksek</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Sıralama</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newKeyword.current_ranking}
                      onChange={(e) => setNewKeyword({ ...newKeyword, current_ranking: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Sıralama</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newKeyword.target_ranking}
                      onChange={(e) => setNewKeyword({ ...newKeyword, target_ranking: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_targeted"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={newKeyword.is_targeted}
                    onChange={(e) => setNewKeyword({ ...newKeyword, is_targeted: e.target.checked })}
                  />
                  <label htmlFor="is_targeted" className="ml-2 block text-sm text-gray-900">
                    Hedeflenen anahtar kelime
                  </label>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddKeyword(false)}
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
    </AdminProtection>
  );
}
