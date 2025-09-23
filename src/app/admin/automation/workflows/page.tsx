'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import AdminProtection from '../../../../components/AdminProtection';
import { 
  CogIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  BoltIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BellIcon,
  TagIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  conditions: WorkflowCondition[];
  status: 'active' | 'paused' | 'stopped' | 'draft';
  lastRun: string;
  nextRun: string;
  runCount: number;
  successRate: number;
  createdAt: string;
  createdBy: string;
  tags: string[];
}

interface WorkflowTrigger {
  type: 'event' | 'schedule' | 'webhook' | 'manual';
  event?: string;
  schedule?: string;
  webhookUrl?: string;
  conditions?: TriggerCondition[];
}

interface TriggerCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: any;
  value2?: any;
}

interface WorkflowAction {
  id: string;
  type: 'email' | 'sms' | 'notification' | 'webhook' | 'database' | 'api_call' | 'delay' | 'condition';
  name: string;
  config: any;
  order: number;
  enabled: boolean;
}

interface WorkflowCondition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in';
  value: any;
  value2?: any;
  logic: 'AND' | 'OR';
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  duration?: number;
  error?: string;
  actionsExecuted: number;
  actionsTotal: number;
  data: any;
}

export default function Workflows() {
  const { user } = useAuth();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'workflows' | 'executions' | 'templates' | 'logs'>('workflows');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Mock data
  useEffect(() => {
    const mockWorkflows: Workflow[] = [
      {
        id: '1',
        name: 'Yeni Müşteri Hoş Geldin E-postası',
        description: 'Yeni kayıt olan müşterilere otomatik hoş geldin e-postası gönderir',
        trigger: {
          type: 'event',
          event: 'user_registered',
          conditions: [
            { field: 'user_type', operator: 'equals', value: 'customer' }
          ]
        },
        actions: [
          {
            id: '1',
            type: 'email',
            name: 'Hoş Geldin E-postası Gönder',
            config: {
              template: 'welcome_email',
              subject: 'Hoş Geldiniz!',
              to: '{{user.email}}',
              variables: ['user.name', 'user.email']
            },
            order: 1,
            enabled: true
          },
          {
            id: '2',
            type: 'delay',
            name: '1 Gün Bekle',
            config: { duration: 24, unit: 'hours' },
            order: 2,
            enabled: true
          },
          {
            id: '3',
            type: 'notification',
            name: 'Admin Bildirimi',
            config: {
              message: 'Yeni müşteri kaydı: {{user.name}}',
              channel: 'admin_dashboard'
            },
            order: 3,
            enabled: true
          }
        ],
        conditions: [],
        status: 'active',
        lastRun: '2024-01-15T10:30:00Z',
        nextRun: '2024-01-16T10:30:00Z',
        runCount: 1250,
        successRate: 98.5,
        createdAt: '2024-01-01T00:00:00Z',
        createdBy: 'admin@example.com',
        tags: ['email', 'welcome', 'automation']
      },
      {
        id: '2',
        name: 'Sipariş Onay Süreci',
        description: 'Sipariş verildikten sonra otomatik onay ve bildirim süreci',
        trigger: {
          type: 'event',
          event: 'order_created',
          conditions: [
            { field: 'order.status', operator: 'equals', value: 'pending' }
          ]
        },
        actions: [
          {
            id: '1',
            type: 'email',
            name: 'Sipariş Onay E-postası',
            config: {
              template: 'order_confirmation',
              subject: 'Siparişiniz Onaylandı',
              to: '{{order.customer_email}}'
            },
            order: 1,
            enabled: true
          },
          {
            id: '2',
            type: 'sms',
            name: 'SMS Bildirimi',
            config: {
              message: 'Siparişiniz onaylandı. Sipariş No: {{order.number}}',
              to: '{{order.customer_phone}}'
            },
            order: 2,
            enabled: true
          },
          {
            id: '3',
            type: 'webhook',
            name: 'Stok Güncelle',
            config: {
              url: 'https://api.example.com/inventory/update',
              method: 'POST',
              headers: { 'Authorization': 'Bearer {{api_token}}' }
            },
            order: 3,
            enabled: true
          }
        ],
        conditions: [
          {
            id: '1',
            field: 'order.total',
            operator: 'greater_than',
            value: 100,
            logic: 'AND'
          }
        ],
        status: 'active',
        lastRun: '2024-01-15T14:22:00Z',
        nextRun: '2024-01-15T14:25:00Z',
        runCount: 3420,
        successRate: 99.2,
        createdAt: '2024-01-05T00:00:00Z',
        createdBy: 'admin@example.com',
        tags: ['order', 'email', 'sms', 'webhook']
      },
      {
        id: '3',
        name: 'Haftalık Rapor',
        description: 'Her hafta otomatik olarak satış raporu oluşturur ve gönderir',
        trigger: {
          type: 'schedule',
          schedule: '0 9 * * 1', // Her Pazartesi saat 09:00
          conditions: []
        },
        actions: [
          {
            id: '1',
            type: 'database',
            name: 'Rapor Verilerini Topla',
            config: {
              query: 'SELECT * FROM sales WHERE date >= ? AND date <= ?',
              parameters: ['{{start_date}}', '{{end_date}}']
            },
            order: 1,
            enabled: true
          },
          {
            id: '2',
            type: 'api_call',
            name: 'Rapor Oluştur',
            config: {
              url: 'https://api.example.com/reports/generate',
              method: 'POST',
              data: { type: 'weekly_sales', data: '{{previous_action_result}}' }
            },
            order: 2,
            enabled: true
          },
          {
            id: '3',
            type: 'email',
            name: 'Rapor Gönder',
            config: {
              template: 'weekly_report',
              subject: 'Haftalık Satış Raporu',
              to: 'management@example.com',
              attachments: ['{{report_file}}']
            },
            order: 3,
            enabled: true
          }
        ],
        conditions: [],
        status: 'active',
        lastRun: '2024-01-15T09:00:00Z',
        nextRun: '2024-01-22T09:00:00Z',
        runCount: 52,
        successRate: 100,
        createdAt: '2024-01-01T00:00:00Z',
        createdBy: 'admin@example.com',
        tags: ['report', 'schedule', 'email']
      },
      {
        id: '4',
        name: 'Stok Uyarı Sistemi',
        description: 'Stok seviyesi düşük olduğunda otomatik uyarı gönderir',
        trigger: {
          type: 'event',
          event: 'inventory_updated',
          conditions: [
            { field: 'product.stock_level', operator: 'less_than', value: 10 }
          ]
        },
        actions: [
          {
            id: '1',
            type: 'notification',
            name: 'Stok Uyarısı',
            config: {
              message: 'Düşük stok uyarısı: {{product.name}} - Kalan: {{product.stock_level}}',
              channel: 'admin_dashboard',
              priority: 'high'
            },
            order: 1,
            enabled: true
          },
          {
            id: '2',
            type: 'email',
            name: 'Tedarikçi Bildirimi',
            config: {
              template: 'low_stock_alert',
              subject: 'Stok Yenileme Gerekli',
              to: 'supplier@example.com'
            },
            order: 2,
            enabled: true
          }
        ],
        conditions: [
          {
            id: '1',
            field: 'product.category',
            operator: 'in',
            value: ['Electronics', 'Gadgets'],
            logic: 'AND'
          }
        ],
        status: 'paused',
        lastRun: '2024-01-14T16:45:00Z',
        nextRun: '2024-01-16T16:45:00Z',
        runCount: 45,
        successRate: 95.6,
        createdAt: '2024-01-10T00:00:00Z',
        createdBy: 'admin@example.com',
        tags: ['inventory', 'alert', 'notification']
      }
    ];

    const mockExecutions: WorkflowExecution[] = [
      {
        id: '1',
        workflowId: '1',
        status: 'completed',
        startedAt: '2024-01-15T10:30:00Z',
        completedAt: '2024-01-15T10:30:15Z',
        duration: 15,
        actionsExecuted: 3,
        actionsTotal: 3,
        data: { user_id: '123', user_email: 'test@example.com' }
      },
      {
        id: '2',
        workflowId: '2',
        status: 'failed',
        startedAt: '2024-01-15T14:22:00Z',
        completedAt: '2024-01-15T14:22:45Z',
        duration: 45,
        actionsExecuted: 2,
        actionsTotal: 3,
        error: 'SMS servisi geçici olarak kullanılamıyor',
        data: { order_id: '456', order_number: 'ORD-2024-001' }
      },
      {
        id: '3',
        workflowId: '3',
        status: 'running',
        startedAt: '2024-01-15T09:00:00Z',
        actionsExecuted: 1,
        actionsTotal: 3,
        data: { start_date: '2024-01-08', end_date: '2024-01-14' }
      }
    ];

    setWorkflows(mockWorkflows);
    setExecutions(mockExecutions);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'stopped': return 'text-red-600 bg-red-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return PlayIcon;
      case 'paused': return PauseIcon;
      case 'stopped': return StopIcon;
      case 'completed': return CheckCircleIcon;
      case 'failed': return ExclamationTriangleIcon;
      case 'running': return ArrowPathIcon;
      default: return ClockIcon;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'email': return EnvelopeIcon;
      case 'sms': return ChatBubbleLeftRightIcon;
      case 'notification': return BellIcon;
      case 'webhook': return BoltIcon;
      case 'database': return DocumentTextIcon;
      case 'api_call': return ArrowPathIcon;
      case 'delay': return ClockIcon;
      case 'condition': return AdjustmentsHorizontalIcon;
      default: return CogIcon;
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
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
                <h1 className="text-3xl font-bold text-gray-900">Otomasyon & İş Akışları</h1>
                <p className="mt-2 text-gray-600">Gelişmiş otomasyon ve iş akışı yönetimi</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Yeni İş Akışı
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
                { id: 'workflows', name: 'İş Akışları', icon: CogIcon },
                { id: 'executions', name: 'Çalıştırmalar', icon: PlayIcon },
                { id: 'templates', name: 'Şablonlar', icon: DocumentTextIcon },
                { id: 'logs', name: 'Loglar', icon: ClockIcon }
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
              <input
                type="text"
                placeholder="İş akışı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="paused">Duraklatılmış</option>
              <option value="stopped">Durdurulmuş</option>
              <option value="draft">Taslak</option>
            </select>
          </div>

          {/* Workflows Tab */}
          {activeTab === 'workflows' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkflows.map((workflow) => {
                  const StatusIcon = getStatusIcon(workflow.status);
                  
                  return (
                    <div key={workflow.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedWorkflow(workflow)}
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
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Durum:</span>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workflow.status)}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {workflow.status === 'active' ? 'Aktif' :
                               workflow.status === 'paused' ? 'Duraklatılmış' :
                               workflow.status === 'stopped' ? 'Durdurulmuş' : 'Taslak'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Çalıştırma Sayısı:</span>
                            <span className="text-sm font-medium text-gray-900">{workflow.runCount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Başarı Oranı:</span>
                            <span className="text-sm font-medium text-gray-900">%{workflow.successRate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Son Çalıştırma:</span>
                            <span className="text-sm text-gray-900">
                              {new Date(workflow.lastRun).toLocaleString('tr-TR')}
                            </span>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {workflow.tags.map((tag, index) => (
                              <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="text-xs text-gray-500">
                            Oluşturan: {workflow.createdBy} • {new Date(workflow.createdAt).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Executions Tab */}
          {activeTab === 'executions' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Çalıştırma Geçmişi</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İş Akışı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Başlangıç
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Süre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hata
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {executions.map((execution) => {
                        const workflow = workflows.find(w => w.id === execution.workflowId);
                        const StatusIcon = getStatusIcon(execution.status);
                        
                        return (
                          <tr key={execution.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {workflow?.name || 'Bilinmeyen İş Akışı'}
                              </div>
                              <div className="text-sm text-gray-500">ID: {execution.id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(execution.status)}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {execution.status === 'completed' ? 'Tamamlandı' :
                                 execution.status === 'failed' ? 'Başarısız' :
                                 execution.status === 'running' ? 'Çalışıyor' : 'İptal Edildi'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(execution.startedAt).toLocaleString('tr-TR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {execution.duration ? `${execution.duration}s` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {execution.actionsExecuted}/{execution.actionsTotal}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                              {execution.error || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: 'E-posta Pazarlama',
                    description: 'Müşterilere otomatik e-posta gönderimi',
                    actions: ['email', 'delay', 'condition'],
                    category: 'Marketing'
                  },
                  {
                    name: 'Sipariş İşleme',
                    description: 'Sipariş onay ve bildirim süreci',
                    actions: ['email', 'sms', 'webhook', 'database'],
                    category: 'E-commerce'
                  },
                  {
                    name: 'Müşteri Hizmetleri',
                    description: 'Otomatik müşteri hizmetleri süreçleri',
                    actions: ['notification', 'email', 'api_call'],
                    category: 'Support'
                  },
                  {
                    name: 'Raporlama',
                    description: 'Otomatik rapor oluşturma ve gönderimi',
                    actions: ['database', 'api_call', 'email'],
                    category: 'Analytics'
                  },
                  {
                    name: 'Stok Yönetimi',
                    description: 'Stok seviyesi takibi ve uyarıları',
                    actions: ['notification', 'email', 'webhook'],
                    category: 'Inventory'
                  },
                  {
                    name: 'Güvenlik',
                    description: 'Güvenlik uyarıları ve bildirimleri',
                    actions: ['notification', 'email', 'sms'],
                    category: 'Security'
                  }
                ].map((template, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        </div>
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                          {template.category}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">İçerdiği Aksiyonlar:</h4>
                          <div className="flex flex-wrap gap-1">
                            {template.actions.map((action, actionIndex) => {
                              const ActionIcon = getActionIcon(action);
                              return (
                                <span key={actionIndex} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                  <ActionIcon className="w-3 h-3 mr-1" />
                                  {action}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Şablonu Kullan
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Logları</h3>
                <div className="space-y-4">
                  {[
                    {
                      timestamp: '2024-01-15 14:30:15',
                      level: 'INFO',
                      message: 'İş akışı başlatıldı: Yeni Müşteri Hoş Geldin E-postası',
                      workflow: 'Yeni Müşteri Hoş Geldin E-postası',
                      action: 'email'
                    },
                    {
                      timestamp: '2024-01-15 14:30:12',
                      level: 'ERROR',
                      message: 'SMS gönderimi başarısız: Geçersiz telefon numarası',
                      workflow: 'Sipariş Onay Süreci',
                      action: 'sms'
                    },
                    {
                      timestamp: '2024-01-15 14:30:08',
                      level: 'WARNING',
                      message: 'Webhook yanıt süresi uzun: 5.2 saniye',
                      workflow: 'Sipariş Onay Süreci',
                      action: 'webhook'
                    },
                    {
                      timestamp: '2024-01-15 14:30:05',
                      level: 'INFO',
                      message: 'E-posta başarıyla gönderildi: test@example.com',
                      workflow: 'Yeni Müşteri Hoş Geldin E-postası',
                      action: 'email'
                    }
                  ].map((log, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          log.level === 'ERROR' ? 'text-red-600 bg-red-100' :
                          log.level === 'WARNING' ? 'text-yellow-600 bg-yellow-100' :
                          'text-green-600 bg-green-100'
                        }`}>
                          {log.level}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-900">{log.message}</p>
                          <p className="text-xs text-gray-500">{log.timestamp}</p>
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                          <span>İş Akışı: {log.workflow}</span>
                          <span>Aksiyon: {log.action}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}

