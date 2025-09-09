'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminProtection from '@/components/AdminProtection';
import OptimizedLoader from '@/components/OptimizedLoader';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  date_of_birth: string;
  gender: string;
  newsletter_subscription: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  login_count?: number;
  provider?: 'email' | 'google' | 'facebook';
  avatar_url?: string;
  is_active: boolean;
  total_orders?: number;
  total_spent?: number;
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  target_audience: 'all' | 'newsletter' | 'active' | 'inactive';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  created_at: string;
  scheduled_at?: string;
  sent_at?: string;
  recipients_count?: number;
  open_rate?: number;
  click_rate?: number;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  googleUsers: number;
  emailUsers: number;
  newsletterSubscribers: number;
  newUsersThisMonth: number;
  averageOrdersPerUser: number;
  topSpenders: User[];
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [activeTab, setActiveTab] = useState<'users' | 'campaigns' | 'analytics'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvider, setFilterProvider] = useState<'all' | 'email' | 'google'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'last_login' | 'total_spent' | 'total_orders'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    name: '',
    subject: '',
    content: '',
    target_audience: 'all',
    status: 'draft'
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        search: searchTerm,
        provider: filterProvider,
        status: filterStatus,
        sort_by: sortBy,
        sort_order: sortOrder
      });

      const response = await fetch(`/api/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users || []);
        setUserStats(data.stats || null);
      } else {
        setMessage(data.error || 'Kullanıcı verileri alınamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Users fetch error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterProvider, filterStatus, sortBy, sortOrder]);

  const fetchCampaigns = useCallback(async () => {
    try {
      const response = await fetch('/api/campaigns');
      const data = await response.json();

      if (data.success) {
        setCampaigns(data.campaigns || []);
      } else {
        setMessage(data.error || 'Kampanya verileri alınamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Campaigns fetch error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (activeTab === 'campaigns') {
      fetchCampaigns();
    }
  }, [activeTab, fetchCampaigns]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm);
      
      const matchesProvider = filterProvider === 'all' || user.provider === filterProvider;
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'active' && user.is_active) ||
        (filterStatus === 'inactive' && !user.is_active);
      
      return matchesSearch && matchesProvider && matchesStatus;
    });
  }, [users, searchTerm, filterProvider, filterStatus]);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCampaign,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Kampanya başarıyla oluşturuldu');
        setMessageType('success');
        setNewCampaign({
          name: '',
          subject: '',
          content: '',
          target_audience: 'all',
          status: 'draft'
        });
        setShowCampaignModal(false);
        fetchCampaigns();
      } else {
        setMessage(data.error || 'Kampanya oluşturulamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Create campaign error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/send`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Kampanya başarıyla gönderildi');
        setMessageType('success');
        fetchCampaigns();
      } else {
        setMessage(data.error || 'Kampanya gönderilemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Send campaign error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedUsers.length === 0) {
      setMessage('Lütfen en az bir kullanıcı seçin');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch('/api/users/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          user_ids: selectedUsers
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`${selectedUsers.length} kullanıcı için işlem başarıyla tamamlandı`);
        setMessageType('success');
        setSelectedUsers([]);
        fetchUsers();
      } else {
        setMessage(data.error || 'Toplu işlem başarısız');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getProviderIcon = (provider: string) => {
    const icons: Record<string, string> = {
      google: 'ri-google-line',
      facebook: 'ri-facebook-line',
      email: 'ri-mail-line'
    };
    return icons[provider] || 'ri-user-line';
  };

  const getProviderColor = (provider: string) => {
    const colors: Record<string, string> = {
      google: 'text-red-600 bg-red-100',
      facebook: 'text-blue-600 bg-blue-100',
      email: 'text-gray-600 bg-gray-100'
    };
    return colors[provider] || 'text-gray-600 bg-gray-100';
  };

  const getCampaignStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCampaignStatusText = (status: string) => {
    const texts: Record<string, string> = {
      draft: 'Taslak',
      scheduled: 'Zamanlanmış',
      sent: 'Gönderildi',
      failed: 'Başarısız'
    };
    return texts[status] || status;
  };

  if (loading) {
    return <OptimizedLoader message="Kullanıcı verileri yükleniyor..." />;
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="text-red-600 hover:text-red-700 text-2xl font-bold"
                >
                  ✕
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
                  <p className="text-gray-600">Kullanıcılar ve kampanya yönetimi</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowCampaignModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Yeni Kampanya
                </button>
                <Link
                  href="/admin"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Admin Paneli
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg mx-6 mt-4 ${
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

        {/* Stats Cards */}
        {userStats && (
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <i className="ri-user-line text-2xl text-blue-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                    <p className="text-2xl font-semibold text-gray-900">{userStats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <i className="ri-user-check-line text-2xl text-green-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
                    <p className="text-2xl font-semibold text-gray-900">{userStats.activeUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <i className="ri-google-line text-2xl text-red-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Google Kullanıcı</p>
                    <p className="text-2xl font-semibold text-gray-900">{userStats.googleUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <i className="ri-mail-line text-2xl text-purple-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">E-posta Abonesi</p>
                    <p className="text-2xl font-semibold text-gray-900">{userStats.newsletterSubscribers}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="px-6">
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  👥 Kullanıcılar
                </button>
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'campaigns'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📧 Kampanyalar
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'analytics'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📊 Analitik
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  {/* Filters and Search */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Kullanıcı ara..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      value={filterProvider}
                      onChange={(e) => setFilterProvider(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tüm Kayıt Türleri</option>
                      <option value="email">E-posta</option>
                      <option value="google">Google</option>
                    </select>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tüm Durumlar</option>
                      <option value="active">Aktif</option>
                      <option value="inactive">Pasif</option>
                    </select>
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-');
                        setSortBy(field as any);
                        setSortOrder(order as any);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="created_at-desc">En Yeni</option>
                      <option value="created_at-asc">En Eski</option>
                      <option value="last_login-desc">Son Giriş</option>
                      <option value="total_spent-desc">En Çok Harcayan</option>
                      <option value="total_orders-desc">En Çok Sipariş</option>
                    </select>
                  </div>

                  {/* Bulk Actions */}
                  {selectedUsers.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">
                          {selectedUsers.length} kullanıcı seçildi
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleBulkAction('activate')}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Aktifleştir
                          </button>
                          <button
                            onClick={() => handleBulkAction('deactivate')}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Pasifleştir
                          </button>
                          <button
                            onClick={() => handleBulkAction('delete')}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Users Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers(filteredUsers.map(user => user.id));
                                } else {
                                  setSelectedUsers([]);
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kullanıcı
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kayıt Türü
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durum
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Siparişler
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Toplam Harcama
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Son Giriş
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedUsers([...selectedUsers, user.id]);
                                  } else {
                                    setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {user.avatar_url ? (
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={user.avatar_url}
                                      alt=""
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                      <i className="ri-user-line text-gray-600"></i>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.first_name} {user.last_name}
                                  </div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                  <div className="text-sm text-gray-500">{user.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`p-1 rounded ${getProviderColor(user.provider || 'email')}`}>
                                  <i className={`text-sm ${getProviderIcon(user.provider || 'email')}`}></i>
                                </div>
                                <span className="ml-2 text-sm text-gray-900 capitalize">
                                  {user.provider || 'email'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                user.is_active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {user.is_active ? 'Aktif' : 'Pasif'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.total_orders || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(user.total_spent || 0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.last_login ? formatDate(user.last_login) : 'Hiç giriş yapmamış'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserDetails(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                Detaylar
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                Sil
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Campaigns Tab */}
              {activeTab === 'campaigns' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{campaign.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{campaign.subject}</p>
                            <p className="text-sm text-gray-500 line-clamp-2">{campaign.content}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCampaignStatusColor(campaign.status)}`}>
                            {getCampaignStatusText(campaign.status)}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <i className="ri-user-line mr-2"></i>
                            <span>Hedef: {campaign.target_audience}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <i className="ri-calendar-line mr-2"></i>
                            <span>Oluşturulma: {formatDate(campaign.created_at)}</span>
                          </div>
                          {campaign.recipients_count && (
                            <div className="flex items-center text-sm text-gray-600">
                              <i className="ri-mail-line mr-2"></i>
                              <span>{campaign.recipients_count} alıcı</span>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          {campaign.status === 'draft' && (
                            <button
                              onClick={() => handleSendCampaign(campaign.id)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                              Gönder
                            </button>
                          )}
                          <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Düzenle
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && userStats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <i className="ri-user-add-line text-xl text-blue-600"></i>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-600">Bu Ay Yeni Kullanıcı</p>
                          <p className="text-xl font-semibold text-blue-900">{userStats.newUsersThisMonth}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <i className="ri-shopping-cart-line text-xl text-green-600"></i>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-green-600">Ortalama Sipariş/Kullanıcı</p>
                          <p className="text-xl font-semibold text-green-900">{userStats.averageOrdersPerUser.toFixed(1)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <i className="ri-money-dollar-circle-line text-xl text-purple-600"></i>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-purple-600">En Çok Harcayan</p>
                          <p className="text-xl font-semibold text-purple-900">
                            {userStats.topSpenders[0]?.first_name} {userStats.topSpenders[0]?.last_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Spenders */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Harcayan Kullanıcılar</h3>
                    <div className="space-y-3">
                      {userStats.topSpenders.slice(0, 5).map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(user.total_spent || 0)}
                            </div>
                            <div className="text-xs text-gray-500">{user.total_orders || 0} sipariş</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Campaign Modal */}
        {showCampaignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Kampanya Oluştur</h2>
              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kampanya Adı</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Kitle</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCampaign.target_audience}
                      onChange={(e) => setNewCampaign({ ...newCampaign, target_audience: e.target.value as any })}
                    >
                      <option value="all">Tüm Kullanıcılar</option>
                      <option value="newsletter">E-posta Aboneleri</option>
                      <option value="active">Aktif Kullanıcılar</option>
                      <option value="inactive">Pasif Kullanıcılar</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                  <textarea
                    rows={6}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newCampaign.content}
                    onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
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
                    onClick={() => setShowCampaignModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Kullanıcı Detayları</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                    <p className="text-sm text-gray-900">{selectedUser.first_name} {selectedUser.last_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <p className="text-sm text-gray-900">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kayıt Türü</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedUser.provider || 'email'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                    <p className="text-sm text-gray-900">{selectedUser.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                    <p className="text-sm text-gray-900">{selectedUser.city}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Toplam Sipariş</label>
                    <p className="text-sm text-gray-900">{selectedUser.total_orders || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Toplam Harcama</label>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedUser.total_spent || 0)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Son Giriş</label>
                    <p className="text-sm text-gray-900">
                      {selectedUser.last_login ? formatDate(selectedUser.last_login) : 'Hiç giriş yapmamış'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kayıt Tarihi</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedUser.created_at)}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminProtection>
  );
}