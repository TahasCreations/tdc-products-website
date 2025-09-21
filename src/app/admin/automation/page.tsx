'use client';

import { useState, useEffect } from 'react';
import { 
  CogIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  BellIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  status: 'active' | 'inactive' | 'error';
  lastRun: string;
  nextRun: string;
  executions: number;
  successRate: number;
}

interface AutomationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  isActive: boolean;
  createdAt: string;
  lastTriggered: string;
}

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock automation data
    const mockWorkflows: Workflow[] = [
      {
        id: '1',
        name: 'Yeni Sipariş İşleme',
        description: 'Yeni sipariş geldiğinde otomatik işlemler',
        trigger: 'Yeni sipariş oluşturuldu',
        actions: ['Stok güncelle', 'Fatura oluştur', 'Müşteriye email gönder', 'Kargo etiketini yazdır'],
        status: 'active',
        lastRun: '2024-01-20T10:30:00Z',
        nextRun: '2024-01-20T11:00:00Z',
        executions: 45,
        successRate: 98.5
      },
      {
        id: '2',
        name: 'Stok Uyarı Sistemi',
        description: 'Stok seviyesi düşük olduğunda otomatik uyarı',
        trigger: 'Stok seviyesi %10 altına düştü',
        actions: ['Tedarikçiye email gönder', 'Admin paneline bildirim', 'Otomatik sipariş oluştur'],
        status: 'active',
        lastRun: '2024-01-19T15:45:00Z',
        nextRun: '2024-01-20T12:00:00Z',
        executions: 12,
        successRate: 100
      },
      {
        id: '3',
        name: 'Müşteri Takip Sistemi',
        description: 'Müşteri davranışlarına göre otomatik kampanyalar',
        trigger: 'Müşteri 30 gün alışveriş yapmadı',
        actions: ['Kişiselleştirilmiş email gönder', 'Özel indirim kodu oluştur', 'Sosyal medya reklamı başlat'],
        status: 'inactive',
        lastRun: '2024-01-15T09:20:00Z',
        nextRun: '2024-01-21T10:00:00Z',
        executions: 8,
        successRate: 87.5
      }
    ];

    const mockRules: AutomationRule[] = [
      {
        id: '1',
        name: 'Fiyat Güncelleme',
        condition: 'Tedarikçi fiyatı değişti',
        action: 'Ürün fiyatını güncelle ve müşterilere bildirim gönder',
        isActive: true,
        createdAt: '2024-01-10T10:00:00Z',
        lastTriggered: '2024-01-18T14:30:00Z'
      },
      {
        id: '2',
        name: 'Kargo Takibi',
        condition: 'Kargo durumu güncellendi',
        action: 'Müşteriye SMS ve email gönder',
        isActive: true,
        createdAt: '2024-01-08T11:00:00Z',
        lastTriggered: '2024-01-20T08:15:00Z'
      },
      {
        id: '3',
        name: 'Müşteri Memnuniyeti',
        condition: 'Sipariş teslim edildi',
        action: 'Müşteri memnuniyet anketi gönder',
        isActive: false,
        createdAt: '2024-01-05T09:00:00Z',
        lastTriggered: '2024-01-12T16:45:00Z'
      }
    ];

    setTimeout(() => {
      setWorkflows(mockWorkflows);
      setRules(mockRules);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: 'Aktif',
      inactive: 'Pasif',
      error: 'Hata'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: CheckCircleIcon,
      inactive: PauseIcon,
      error: ExclamationTriangleIcon
    };
    return icons[status as keyof typeof icons] || PauseIcon;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Otomasyon ve Workflow</h1>
              <p className="text-gray-600 mt-1">İş süreçlerinizi otomatikleştirin ve verimliliği artırın</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <CogIcon className="w-4 h-4 mr-2 inline" />
                Ayarlar
              </button>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <PlusIcon className="w-4 h-4 mr-2 inline" />
                Yeni Workflow
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Automation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Workflow</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workflows.filter(w => w.status === 'active').length}
                </p>
                <p className="text-sm text-gray-500">Toplam {workflows.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <PlayIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Çalıştırma</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workflows.reduce((sum, w) => sum + w.executions, 0)}
                </p>
                <p className="text-sm text-gray-500">Bu ay</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ArrowPathIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Başarı Oranı</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Ortalama</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <CheckCircleIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Otomasyon Kuralı</p>
                <p className="text-2xl font-bold text-gray-900">
                  {rules.filter(r => r.isActive).length}
                </p>
                <p className="text-sm text-gray-500">Aktif kurallar</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <CogIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Workflows */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Workflow&#39;lar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((workflow) => {
              const StatusIcon = getStatusIcon(workflow.status);
              return (
                <div key={workflow.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CogIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                        <p className="text-sm text-gray-600">{workflow.description}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                      {getStatusText(workflow.status)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Tetikleyici:</h4>
                      <p className="text-sm text-gray-600">{workflow.trigger}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Aksiyonlar:</h4>
                      <div className="space-y-1">
                        {workflow.actions.map((action, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Çalıştırma:</span>
                      <span className="font-medium">{workflow.executions}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Başarı Oranı:</span>
                      <span className="font-medium">{workflow.successRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Son Çalışma:</span>
                      <span className="font-medium">
                        {new Date(workflow.lastRun).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <EyeIcon className="w-4 h-4 mr-1 inline" />
                      Detaylar
                    </button>
                    <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <PencilIcon className="w-4 h-4 mr-1 inline" />
                      Düzenle
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Automation Rules */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Otomasyon Kuralları</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon className="w-4 h-4 mr-2 inline" />
              Yeni Kural
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6">
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                          <div className={`w-3 h-3 rounded-full ${rule.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div>
                            <strong>Koşul:</strong> {rule.condition}
                          </div>
                          <div>
                            <strong>Aksiyon:</strong> {rule.action}
                          </div>
                          <div className="flex items-center space-x-4">
                            <span>Oluşturulma: {new Date(rule.createdAt).toLocaleDateString('tr-TR')}</span>
                            <span>Son Tetikleme: {new Date(rule.lastTriggered).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Automation Templates */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Otomasyon Şablonları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingCartIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">E-Ticaret</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Sipariş işleme, stok yönetimi ve müşteri takibi için hazır şablonlar
              </p>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Şablonları Gör
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Muhasebe</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Fatura oluşturma, ödeme takibi ve mali raporlama otomasyonları
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Şablonları Gör
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserGroupIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Müşteri Hizmetleri</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Müşteri iletişimi, destek talepleri ve geri bildirim otomasyonları
              </p>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Şablonları Gör
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
