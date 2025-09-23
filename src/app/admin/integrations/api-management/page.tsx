'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import AdminProtection from '../../../../components/AdminProtection';
import { 
  CogIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  GlobeAltIcon,
  ServerIcon,
  KeyIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BoltIcon,
  WifiIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  CloudIcon,
  CircleStackIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  TruckIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

interface ApiIntegration {
  id: string;
  name: string;
  description: string;
  provider: string;
  category: 'payment' | 'shipping' | 'communication' | 'analytics' | 'social' | 'ecommerce' | 'finance' | 'other';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status: 'active' | 'inactive' | 'error' | 'testing';
  lastSync: string;
  nextSync: string;
  successRate: number;
  responseTime: number;
  requestsCount: number;
  errorCount: number;
  credentials: ApiCredentials;
  headers: Record<string, string>;
  parameters: ApiParameter[];
  webhooks: Webhook[];
  logs: ApiLog[];
  createdAt: string;
  updatedAt: string;
}

interface ApiCredentials {
  apiKey?: string;
  secretKey?: string;
  username?: string;
  password?: string;
  token?: string;
  clientId?: string;
  clientSecret?: string;
  environment: 'sandbox' | 'production';
}

interface ApiParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  defaultValue?: any;
  description: string;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  lastTriggered: string;
  successCount: number;
  failureCount: number;
}

interface ApiLog {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  status: number;
  responseTime: number;
  requestSize: number;
  responseSize: number;
  error?: string;
  userId?: string;
}

interface ApiTemplate {
  id: string;
  name: string;
  description: string;
  provider: string;
  category: string;
  icon: string;
  features: string[];
  pricing: string;
  setupTime: string;
  documentation: string;
}

export default function ApiManagement() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<ApiIntegration[]>([]);
  const [templates, setTemplates] = useState<ApiTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'integrations' | 'templates' | 'logs' | 'analytics' | 'settings'>('integrations');
  const [selectedIntegration, setSelectedIntegration] = useState<ApiIntegration | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Mock data
  useEffect(() => {
    const mockIntegrations: ApiIntegration[] = [
      {
        id: '1',
        name: 'Stripe Ödeme Entegrasyonu',
        description: 'Kredi kartı ve dijital cüzdan ödemeleri için Stripe entegrasyonu',
        provider: 'Stripe',
        category: 'payment',
        endpoint: 'https://api.stripe.com/v1/charges',
        method: 'POST',
        status: 'active',
        lastSync: '2024-01-15T14:30:00Z',
        nextSync: '2024-01-15T15:00:00Z',
        successRate: 99.2,
        responseTime: 245,
        requestsCount: 15420,
        errorCount: 123,
        credentials: {
          apiKey: 'sk_live_***',
          secretKey: 'sk_live_***',
          environment: 'production'
        },
        headers: {
          'Authorization': 'Bearer {{api_key}}',
          'Content-Type': 'application/json'
        },
        parameters: [
          {
            name: 'amount',
            type: 'number',
            required: true,
            description: 'Ödeme tutarı (kuruş cinsinden)'
          },
          {
            name: 'currency',
            type: 'string',
            required: true,
            defaultValue: 'try',
            description: 'Para birimi kodu'
          },
          {
            name: 'customer',
            type: 'string',
            required: false,
            description: 'Müşteri ID\'si'
          }
        ],
        webhooks: [
          {
            id: '1',
            name: 'Ödeme Başarılı',
            url: 'https://api.example.com/webhooks/stripe/payment-success',
            events: ['payment_intent.succeeded'],
            isActive: true,
            lastTriggered: '2024-01-15T14:25:00Z',
            successCount: 1250,
            failureCount: 5
          }
        ],
        logs: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'Aras Kargo Entegrasyonu',
        description: 'Kargo takibi ve fiyat hesaplama için Aras Kargo API entegrasyonu',
        provider: 'Aras Kargo',
        category: 'shipping',
        endpoint: 'https://api.araskargo.com.tr/v1/shipments',
        method: 'POST',
        status: 'active',
        lastSync: '2024-01-15T14:15:00Z',
        nextSync: '2024-01-15T14:45:00Z',
        successRate: 97.8,
        responseTime: 1200,
        requestsCount: 8920,
        errorCount: 195,
        credentials: {
          apiKey: 'ak_***',
          username: 'api_user',
          environment: 'production'
        },
        headers: {
          'Authorization': 'Bearer {{api_key}}',
          'Content-Type': 'application/json',
          'X-API-Version': 'v1'
        },
        parameters: [
          {
            name: 'origin',
            type: 'string',
            required: true,
            description: 'Gönderi şehri'
          },
          {
            name: 'destination',
            type: 'string',
            required: true,
            description: 'Alıcı şehri'
          },
          {
            name: 'weight',
            type: 'number',
            required: true,
            description: 'Paket ağırlığı (kg)'
          }
        ],
        webhooks: [],
        logs: [],
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '3',
        name: 'SendGrid E-posta Entegrasyonu',
        description: 'Toplu e-posta gönderimi için SendGrid entegrasyonu',
        provider: 'SendGrid',
        category: 'communication',
        endpoint: 'https://api.sendgrid.com/v3/mail/send',
        method: 'POST',
        status: 'testing',
        lastSync: '2024-01-15T13:45:00Z',
        nextSync: '2024-01-15T14:15:00Z',
        successRate: 98.5,
        responseTime: 890,
        requestsCount: 12500,
        errorCount: 188,
        credentials: {
          apiKey: 'SG.***',
          environment: 'sandbox'
        },
        headers: {
          'Authorization': 'Bearer {{api_key}}',
          'Content-Type': 'application/json'
        },
        parameters: [
          {
            name: 'to',
            type: 'array',
            required: true,
            description: 'Alıcı e-posta adresleri'
          },
          {
            name: 'subject',
            type: 'string',
            required: true,
            description: 'E-posta konusu'
          },
          {
            name: 'content',
            type: 'object',
            required: true,
            description: 'E-posta içeriği'
          }
        ],
        webhooks: [
          {
            id: '2',
            name: 'E-posta Durumu',
            url: 'https://api.example.com/webhooks/sendgrid/email-status',
            events: ['delivered', 'bounced', 'opened'],
            isActive: true,
            lastTriggered: '2024-01-15T14:20:00Z',
            successCount: 8900,
            failureCount: 12
          }
        ],
        logs: [],
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ];

    const mockTemplates: ApiTemplate[] = [
      {
        id: '1',
        name: 'PayPal Ödeme',
        description: 'PayPal ödeme işlemleri için hazır entegrasyon',
        provider: 'PayPal',
        category: 'payment',
        icon: '💳',
        features: ['Kredi kartı', 'PayPal hesabı', 'Dijital cüzdan', 'Taksit seçenekleri'],
        pricing: 'Ücretsiz + %2.9 komisyon',
        setupTime: '15 dakika',
        documentation: 'https://developer.paypal.com'
      },
      {
        id: '2',
        name: 'Twilio SMS',
        description: 'SMS gönderimi ve doğrulama için Twilio entegrasyonu',
        provider: 'Twilio',
        category: 'communication',
        icon: '📱',
        features: ['SMS gönderimi', 'SMS doğrulama', 'WhatsApp', 'Voice calls'],
        pricing: 'Kullanım başına ücret',
        setupTime: '10 dakika',
        documentation: 'https://www.twilio.com/docs'
      },
      {
        id: '3',
        name: 'Google Analytics',
        description: 'Web sitesi analitik verileri için Google Analytics entegrasyonu',
        provider: 'Google',
        category: 'analytics',
        icon: '📊',
        features: ['Sayfa görüntüleme', 'Kullanıcı davranışı', 'Dönüşüm takibi', 'Raporlama'],
        pricing: 'Ücretsiz',
        setupTime: '5 dakika',
        documentation: 'https://developers.google.com/analytics'
      },
      {
        id: '4',
        name: 'Facebook Marketing',
        description: 'Facebook ve Instagram reklam yönetimi için API entegrasyonu',
        provider: 'Meta',
        category: 'social',
        icon: '📘',
        features: ['Reklam oluşturma', 'Hedefleme', 'Performans takibi', 'Otomatik optimizasyon'],
        pricing: 'Reklam harcaması + %5 komisyon',
        setupTime: '30 dakika',
        documentation: 'https://developers.facebook.com'
      }
    ];

    setIntegrations(mockIntegrations);
    setTemplates(mockTemplates);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'testing': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircleIcon;
      case 'inactive': return PauseIcon;
      case 'error': return XCircleIcon;
      case 'testing': return ClockIcon;
      default: return ClockIcon;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment': return CurrencyDollarIcon;
      case 'shipping': return TruckIcon;
      case 'communication': return EnvelopeIcon;
      case 'analytics': return ChartBarIcon;
      case 'social': return UserGroupIcon;
      case 'ecommerce': return ShoppingBagIcon;
      case 'finance': return BanknotesIcon;
      default: return CogIcon;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'payment': return 'text-green-600 bg-green-100';
      case 'shipping': return 'text-blue-600 bg-blue-100';
      case 'communication': return 'text-purple-600 bg-purple-100';
      case 'analytics': return 'text-orange-600 bg-orange-100';
      case 'social': return 'text-pink-600 bg-pink-100';
      case 'ecommerce': return 'text-indigo-600 bg-indigo-100';
      case 'finance': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || integration.category === categoryFilter;
    const matchesStatus = !statusFilter || integration.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">API Entegrasyon Yönetimi</h1>
                <p className="mt-2 text-gray-600">Harici servislerle entegrasyon yönetimi ve izleme</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Yeni Entegrasyon
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                  <ArrowPathIcon className="w-5 h-5 mr-2" />
                  Tümünü Senkronize Et
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'integrations', name: 'Entegrasyonlar', icon: CogIcon },
                { id: 'templates', name: 'Şablonlar', icon: DocumentTextIcon },
                { id: 'logs', name: 'Loglar', icon: ClockIcon },
                { id: 'analytics', name: 'Analitik', icon: ChartBarIcon },
                { id: 'settings', name: 'Ayarlar', icon: AdjustmentsHorizontalIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Entegrasyon ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tüm Kategoriler</option>
              <option value="payment">Ödeme</option>
              <option value="shipping">Kargo</option>
              <option value="communication">İletişim</option>
              <option value="analytics">Analitik</option>
              <option value="social">Sosyal Medya</option>
              <option value="ecommerce">E-ticaret</option>
              <option value="finance">Finans</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
              <option value="error">Hata</option>
              <option value="testing">Test</option>
            </select>
          </div>

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIntegrations.map((integration) => {
                  const StatusIcon = getStatusIcon(integration.status);
                  const CategoryIcon = getCategoryIcon(integration.category);
                  
                  return (
                    <div key={integration.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start">
                            <div className="p-2 bg-gray-100 rounded-lg mr-3">
                              <CategoryIcon className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
                              <p className="text-xs text-gray-500 mt-1">Sağlayıcı: {integration.provider}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(integration.status)}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {integration.status === 'active' ? 'Aktif' :
                               integration.status === 'inactive' ? 'Pasif' :
                               integration.status === 'error' ? 'Hata' : 'Test'}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(integration.category)}`}>
                              {integration.category === 'payment' ? 'Ödeme' :
                               integration.category === 'shipping' ? 'Kargo' :
                               integration.category === 'communication' ? 'İletişim' :
                               integration.category === 'analytics' ? 'Analitik' :
                               integration.category === 'social' ? 'Sosyal Medya' :
                               integration.category === 'ecommerce' ? 'E-ticaret' :
                               integration.category === 'finance' ? 'Finans' : 'Diğer'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Başarı Oranı:</span>
                            <span className="text-sm font-medium text-gray-900">%{integration.successRate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Yanıt Süresi:</span>
                            <span className="text-sm font-medium text-gray-900">{integration.responseTime}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Toplam İstek:</span>
                            <span className="text-sm font-medium text-gray-900">{integration.requestsCount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Hata Sayısı:</span>
                            <span className="text-sm font-medium text-gray-900">{integration.errorCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Son Senkronizasyon:</span>
                            <span className="text-sm text-gray-900">
                              {new Date(integration.lastSync).toLocaleString('tr-TR')}
                            </span>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedIntegration(integration)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-600">
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button className="p-1 text-gray-400 hover:text-green-600">
                                <PlayIcon className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-yellow-600">
                                <PauseIcon className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-blue-600">
                                <ArrowPathIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div key={template.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start">
                          <div className="text-2xl mr-3">{template.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                            <p className="text-xs text-gray-500 mt-1">Sağlayıcı: {template.provider}</p>
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                          {template.category === 'payment' ? 'Ödeme' :
                           template.category === 'communication' ? 'İletişim' :
                           template.category === 'analytics' ? 'Analitik' :
                           template.category === 'social' ? 'Sosyal Medya' : 'Diğer'}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Özellikler:</h4>
                          <div className="flex flex-wrap gap-1">
                            {template.features.map((feature, index) => (
                              <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Fiyatlandırma:</span>
                          <span className="text-sm font-medium text-gray-900">{template.pricing}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Kurulum Süresi:</span>
                          <span className="text-sm font-medium text-gray-900">{template.setupTime}</span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <a
                            href={template.documentation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Dokümantasyon →
                          </a>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            Entegre Et
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CogIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Toplam Entegrasyon</p>
                      <p className="text-2xl font-semibold text-gray-900">{integrations.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Aktif Entegrasyon</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {integrations.filter(i => i.status === 'active').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BoltIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Toplam İstek</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {integrations.reduce((sum, i) => sum + i.requestsCount, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <ClockIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Ortalama Yanıt</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {Math.round(integrations.reduce((sum, i) => sum + i.responseTime, 0) / integrations.length)}ms
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Entegrasyon Performansı</h3>
                  <div className="space-y-3">
                    {integrations.map((integration) => (
                      <div key={integration.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{integration.name}</p>
                          <p className="text-xs text-gray-500">{integration.provider}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">%{integration.successRate}</p>
                          <p className="text-xs text-gray-500">{integration.responseTime}ms</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Dağılımı</h3>
                  <div className="space-y-3">
                    {[
                      { category: 'Ödeme', count: integrations.filter(i => i.category === 'payment').length, color: 'bg-green-500' },
                      { category: 'Kargo', count: integrations.filter(i => i.category === 'shipping').length, color: 'bg-blue-500' },
                      { category: 'İletişim', count: integrations.filter(i => i.category === 'communication').length, color: 'bg-purple-500' },
                      { category: 'Analitik', count: integrations.filter(i => i.category === 'analytics').length, color: 'bg-orange-500' },
                      { category: 'Sosyal Medya', count: integrations.filter(i => i.category === 'social').length, color: 'bg-pink-500' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                          <span className="text-sm text-gray-900">{item.category}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">API Entegrasyon Ayarları</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Varsayılan Timeout</label>
                    <input
                      type="number"
                      defaultValue={30000}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Retry</label>
                    <input
                      type="number"
                      defaultValue={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate Limiting</label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        API rate limiting aktif
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Otomatik Retry</label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Başarısız istekleri otomatik tekrar dene
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Ayarları Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}
