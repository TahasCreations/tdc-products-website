'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  LinkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface SocialMediaAccount {
  id: string;
  platform: string;
  name: string;
  username: string;
  avatar: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSync: string;
  followers: number;
  posts: number;
  engagement: number;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
}

interface IntegrationSettings {
  autoSync: boolean;
  syncInterval: number; // minutes
  postNotifications: boolean;
  analyticsTracking: boolean;
  contentModeration: boolean;
}

const mockSocialAccounts: SocialMediaAccount[] = [
  {
    id: '1',
    platform: 'twitter',
    name: 'TDC Products',
    username: '@tdcproducts',
    avatar: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=100&h=100&fit=crop&crop=face',
    status: 'connected',
    lastSync: '2024-01-15T10:30:00Z',
    followers: 12500,
    posts: 234,
    engagement: 4.2
  },
  {
    id: '2',
    platform: 'instagram',
    name: 'TDC Products',
    username: '@tdcproducts',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    status: 'connected',
    lastSync: '2024-01-15T09:15:00Z',
    followers: 8900,
    posts: 156,
    engagement: 6.8
  },
  {
    id: '3',
    platform: 'tiktok',
    name: 'TDC Products',
    username: '@tdcproducts',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    status: 'pending',
    lastSync: '2024-01-14T16:45:00Z',
    followers: 0,
    posts: 0,
    engagement: 0
  },
  {
    id: '4',
    platform: 'reddit',
    name: 'TDC Products',
    username: 'u/tdcproducts',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    status: 'error',
    lastSync: '2024-01-13T14:20:00Z',
    followers: 0,
    posts: 0,
    engagement: 0
  },
  {
    id: '5',
    platform: 'youtube',
    name: 'TDC Products Channel',
    username: '@tdcproductschannel',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face',
    status: 'connected',
    lastSync: '2024-01-15T08:00:00Z',
    followers: 3400,
    posts: 89,
    engagement: 8.1
  }
];

const availablePlatforms = [
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: '𝕏',
    color: 'bg-black',
    description: 'Kısa mesajlar ve güncellemeler paylaşın',
    connected: true
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    description: 'Görsel içerik ve hikayeler paylaşın',
    connected: true
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: 'bg-black',
    description: 'Kısa video içerikleri oluşturun',
    connected: false
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: '🔴',
    color: 'bg-orange-500',
    description: 'Topluluk tartışmalarına katılın',
    connected: false
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '📺',
    color: 'bg-red-600',
    description: 'Uzun form video içerikleri',
    connected: true
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: 'bg-blue-600',
    description: 'Profesyonel ağ ve B2B içerik',
    connected: false
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '👥',
    color: 'bg-blue-700',
    description: 'Geniş kitlelere ulaşın',
    connected: false
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: '📌',
    color: 'bg-red-500',
    description: 'Görsel keşif ve ilham',
    connected: false
  }
];

export default function SocialMediaIntegrations() {
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>(mockSocialAccounts);
  const [settings, setSettings] = useState<IntegrationSettings>({
    autoSync: true,
    syncInterval: 30,
    postNotifications: true,
    analyticsTracking: true,
    contentModeration: false
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [syncing, setSyncing] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Bağlı';
      case 'disconnected':
        return 'Bağlı Değil';
      case 'error':
        return 'Hata';
      case 'pending':
        return 'Beklemede';
      default:
        return 'Bilinmiyor';
    }
  };

  const handleConnect = async (platformId: string) => {
    setSyncing(platformId);
    
    // Simulate OAuth flow
    setTimeout(() => {
      const newAccount: SocialMediaAccount = {
        id: Date.now().toString(),
        platform: platformId,
        name: `${availablePlatforms.find(p => p.id === platformId)?.name} Account`,
        username: `@tdcproducts_${platformId}`,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        status: 'connected',
        lastSync: new Date().toISOString(),
        followers: Math.floor(Math.random() * 10000),
        posts: Math.floor(Math.random() * 500),
        engagement: Math.random() * 10
      };
      
      setAccounts(prev => [...prev, newAccount]);
      setSyncing(null);
      setShowAddModal(false);
    }, 2000);
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm('Bu hesabı bağlantıdan çıkarmak istediğinizden emin misiniz?')) {
      return;
    }
    
    setAccounts(prev => prev.map(account => 
      account.id === accountId 
        ? { ...account, status: 'disconnected' as const }
        : account
    ));
  };

  const handleSync = async (accountId: string) => {
    setSyncing(accountId);
    
    // Simulate sync process
    setTimeout(() => {
      setAccounts(prev => prev.map(account => 
        account.id === accountId 
          ? { 
              ...account, 
              lastSync: new Date().toISOString(),
              followers: account.followers + Math.floor(Math.random() * 100),
              posts: account.posts + Math.floor(Math.random() * 5),
              engagement: Math.max(0, account.engagement + (Math.random() - 0.5) * 2)
            }
          : account
      ));
      setSyncing(null);
    }, 3000);
  };

  const handleSyncAll = async () => {
    const connectedAccounts = accounts.filter(account => account.status === 'connected');
    
    for (const account of connectedAccounts) {
      await handleSync(account.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sosyal Medya Entegrasyonları</h2>
            <p className="text-gray-600 mt-1">Hesaplarınızı bağlayın ve içeriklerinizi senkronize edin</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <PencilIcon className="w-4 h-4" />
              <span>Ayarlar</span>
            </button>
            <button
              onClick={handleSyncAll}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>Tümünü Senkronize Et</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Hesap Bağla</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {accounts.filter(a => a.status === 'connected').length}
                </p>
                <p className="text-sm text-blue-700">Bağlı Hesap</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <ArrowPathIcon className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-green-900">
                  {accounts.reduce((sum, a) => sum + a.followers, 0).toLocaleString()}
                </p>
                <p className="text-sm text-green-700">Toplam Takipçi</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <LinkIcon className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-purple-900">
                  {accounts.reduce((sum, a) => sum + a.posts, 0)}
                </p>
                <p className="text-sm text-purple-700">Toplam İçerik</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <InformationCircleIcon className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-orange-900">
                  {(accounts.reduce((sum, a) => sum + a.engagement, 0) / accounts.length).toFixed(1)}%
                </p>
                <p className="text-sm text-orange-700">Ortalama Etkileşim</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bağlı Hesaplar</h3>
        
        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Henüz bağlı hesap bulunmuyor</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              İlk Hesabınızı Bağlayın
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div key={account.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={account.avatar}
                      alt={account.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{account.name}</h4>
                      <p className="text-sm text-gray-600">{account.username}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(account.status)}`}>
                    {getStatusText(account.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{account.followers.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Takipçi</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{account.posts}</p>
                    <p className="text-xs text-gray-600">İçerik</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{account.engagement.toFixed(1)}%</p>
                    <p className="text-xs text-gray-600">Etkileşim</p>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mb-4">
                  Son senkronizasyon: {new Date(account.lastSync).toLocaleString('tr-TR')}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSync(account.id)}
                    disabled={syncing === account.id || account.status !== 'connected'}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                  >
                    {syncing === account.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                        <span>Senkronize Ediliyor...</span>
                      </>
                    ) : (
                      <>
                        <ArrowPathIcon className="w-4 h-4" />
                        <span>Senkronize Et</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleDisconnect(account.id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Hesap Bağla</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircleIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availablePlatforms.map((platform) => {
                  const isConnected = accounts.some(account => account.platform === platform.id && account.status === 'connected');
                  const isConnecting = syncing === platform.id;
                  
                  return (
                    <div
                      key={platform.id}
                      className={`p-6 border-2 rounded-xl transition-all cursor-pointer ${
                        isConnected 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                      onClick={() => !isConnected && !isConnecting && handleConnect(platform.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl ${platform.color}`}>
                            {platform.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                            <p className="text-sm text-gray-600">{platform.description}</p>
                          </div>
                        </div>
                        
                        {isConnected ? (
                          <CheckCircleIcon className="w-6 h-6 text-green-600" />
                        ) : isConnecting ? (
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <PlusIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {isConnected ? (
                          <span className="text-green-600 font-medium">✓ Bağlı</span>
                        ) : isConnecting ? (
                          <span className="text-blue-600 font-medium">Bağlanıyor...</span>
                        ) : (
                          <span className="text-gray-500">Bağlamak için tıklayın</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Entegrasyon Ayarları</h2>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircleIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.autoSync}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoSync: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Otomatik Senkronizasyon</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Hesaplarınız belirli aralıklarla otomatik olarak senkronize edilir</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senkronizasyon Aralığı (dakika)
                </label>
                <input
                  type="number"
                  min="5"
                  max="1440"
                  value={settings.syncInterval}
                  onChange={(e) => setSettings(prev => ({ ...prev, syncInterval: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.postNotifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, postNotifications: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Gönderi Bildirimleri</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Yeni gönderiler için bildirim alın</p>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.analyticsTracking}
                    onChange={(e) => setSettings(prev => ({ ...prev, analyticsTracking: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">Analitik Takibi</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Performans metriklerini otomatik olarak takip edin</p>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.contentModeration}
                    onChange={(e) => setSettings(prev => ({ ...prev, contentModeration: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">İçerik Moderasyonu</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Paylaşılan içerikleri otomatik olarak kontrol edin</p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-4">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  // Save settings
                  setShowSettingsModal(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
