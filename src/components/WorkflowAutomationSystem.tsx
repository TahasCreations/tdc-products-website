'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './Toast';

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'inventory' | 'hr' | 'finance' | 'marketing' | 'support';
  status: 'active' | 'inactive' | 'draft';
  triggers: WorkflowTrigger[];
  steps: WorkflowStep[];
  conditions: WorkflowCondition[];
  createdAt: string;
  updatedAt: string;
  executions: number;
  successRate: number;
}

interface WorkflowTrigger {
  id: string;
  type: 'event' | 'schedule' | 'condition' | 'manual';
  event?: string;
  schedule?: string;
  condition?: string;
  enabled: boolean;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'action' | 'approval' | 'notification' | 'condition' | 'delay';
  action?: string;
  approver?: string;
  notification?: string;
  condition?: string;
  delay?: number;
  order: number;
  required: boolean;
}

interface WorkflowCondition {
  id: string;
  field: string;
  operator: 'equals' | 'greater' | 'less' | 'contains' | 'not_equals';
  value: any;
  logic: 'AND' | 'OR';
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  currentStep: string;
  data: any;
  startedAt: string;
  completedAt?: string;
  error?: string;
  steps: ExecutionStep[];
}

interface ExecutionStep {
  id: string;
  stepId: string;
  stepName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  result?: any;
  error?: string;
}

export default function WorkflowAutomationSystem() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'workflows' | 'executions' | 'templates' | 'analytics'>('workflows');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const { addToast } = useToast();

  const fetchWorkflowData = useCallback(async () => {
    setLoading(true);
    try {
      const [workflowsResponse, executionsResponse] = await Promise.all([
        fetch('/api/workflows'),
        fetch('/api/workflows/executions')
      ]);

      const [workflowsData, executionsData] = await Promise.all([
        workflowsResponse.json(),
        executionsResponse.json()
      ]);

      setWorkflows(workflowsData);
      setExecutions(executionsData);
    } catch (error) {
      console.error('Workflow fetch error:', error);
      addToast({
        type: 'error',
        title: 'İş Akışı Hatası',
        message: 'İş akışı verileri yüklenirken hata oluştu'
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchWorkflowData();
  }, [fetchWorkflowData]);

  const createWorkflow = async (workflowData: Partial<Workflow>) => {
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowData)
      });

      if (response.ok) {
        const newWorkflow = await response.json();
        setWorkflows(prev => [newWorkflow, ...prev]);
        
        addToast({
          type: 'success',
          title: 'İş Akışı Oluşturuldu',
          message: 'Yeni iş akışı başarıyla oluşturuldu'
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'İş Akışı Hatası',
        message: 'İş akışı oluşturulamadı'
      });
    }
  };

  const executeWorkflow = async (workflowId: string, data: any) => {
    try {
      const response = await fetch('/api/workflows/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, data })
      });

      if (response.ok) {
        addToast({
          type: 'success',
          title: 'İş Akışı Başlatıldı',
          message: 'İş akışı başarıyla başlatıldı'
        });
        fetchWorkflowData();
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Çalıştırma Hatası',
        message: 'İş akışı çalıştırılamadı'
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sales': return 'text-blue-600 bg-blue-100';
      case 'inventory': return 'text-green-600 bg-green-100';
      case 'hr': return 'text-purple-600 bg-purple-100';
      case 'finance': return 'text-yellow-600 bg-yellow-100';
      case 'marketing': return 'text-pink-600 bg-pink-100';
      case 'support': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'paused': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">İş akışı verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <i className="ri-flow-chart text-3xl text-blue-600 mr-3"></i>
            İş Akışı Otomasyonu
          </h2>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowWorkflowBuilder(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              <i className="ri-add-line mr-2"></i>
              Yeni İş Akışı
            </button>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'workflows', label: 'İş Akışları', icon: 'ri-flow-chart' },
            { key: 'executions', label: 'Çalıştırmalar', icon: 'ri-play-circle-line' },
            { key: 'templates', label: 'Şablonlar', icon: 'ri-file-copy-line' },
            { key: 'analytics', label: 'Analitik', icon: 'ri-bar-chart-line' }
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                viewMode === mode.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className={`${mode.icon} mr-2`}></i>
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workflows View */}
      {viewMode === 'workflows' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <i className="ri-flow-chart text-2xl text-blue-600"></i>
                </div>
                <div className="text-sm font-medium text-blue-600">
                  Toplam
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {workflows.length}
              </div>
              <div className="text-sm text-gray-600">İş Akışı</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <i className="ri-play-circle-line text-2xl text-green-600"></i>
                </div>
                <div className="text-sm font-medium text-green-600">
                  Aktif
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {workflows.filter(w => w.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Çalışan</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <i className="ri-bar-chart-line text-2xl text-purple-600"></i>
                </div>
                <div className="text-sm font-medium text-purple-600">
                  Ortalama
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                %{Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length)}
              </div>
              <div className="text-sm text-gray-600">Başarı Oranı</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <i className="ri-time-line text-2xl text-orange-600"></i>
                </div>
                <div className="text-sm font-medium text-orange-600">
                  Toplam
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {workflows.reduce((sum, w) => sum + w.executions, 0)}
              </div>
              <div className="text-sm text-gray-600">Çalıştırma</div>
            </div>
          </div>

          {/* Workflows Grid */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">İş Akışları</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{workflow.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                      {workflow.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{workflow.description}</p>
                  
                  <div className="flex items-center mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(workflow.category)}`}>
                      {workflow.category}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Adım Sayısı:</span>
                      <span className="font-medium">{workflow.steps.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Çalıştırma:</span>
                      <span className="font-medium">{workflow.executions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Başarı Oranı:</span>
                      <span className="font-medium">%{workflow.successRate}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedWorkflow(workflow)}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => executeWorkflow(workflow.id, {})}
                        className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
                      >
                        Çalıştır
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Executions View */}
      {viewMode === 'executions' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">İş Akışı Çalıştırmaları</h3>
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
                    Mevcut Adım
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başlangıç
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Süre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksiyonlar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {executions.slice(0, 20).map((execution) => (
                  <tr key={execution.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{execution.workflowName}</div>
                      <div className="text-sm text-gray-500">{execution.workflowId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
                        {execution.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {execution.currentStep}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(execution.startedAt).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {execution.completedAt ? 
                        `${Math.round((new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000)}s` :
                        'Devam ediyor'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Detay
                      </button>
                      {execution.status === 'running' && (
                        <button className="text-red-600 hover:text-red-900">
                          Durdur
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Templates View */}
      {viewMode === 'templates' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">İş Akışı Şablonları</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Satış Onay Süreci',
                description: 'Belirli tutar üzeri satışlar için otomatik onay süreci',
                category: 'sales',
                steps: 4
              },
              {
                name: 'Stok Sipariş Otomasyonu',
                description: 'Stok seviyesi düştüğünde otomatik sipariş oluşturma',
                category: 'inventory',
                steps: 3
              },
              {
                name: 'Müşteri Takip Süreci',
                description: 'Yeni müşteriler için otomatik takip e-postaları',
                category: 'marketing',
                steps: 5
              },
              {
                name: 'İnsan Kaynakları Onayı',
                description: 'İzin talepleri için onay süreci',
                category: 'hr',
                steps: 3
              },
              {
                name: 'Fatura Hatırlatma',
                description: 'Vadesi yaklaşan faturalar için otomatik hatırlatma',
                category: 'finance',
                steps: 2
              },
              {
                name: 'Destek Talebi Yönlendirme',
                description: 'Destek taleplerini kategoriye göre yönlendirme',
                category: 'support',
                steps: 4
              }
            ].map((template, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-gray-600">Adım Sayısı:</span>
                  <span className="font-medium">{template.steps}</span>
                </div>
                
                <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  Şablonu Kullan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">İş Akışı Analitikleri</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Kategori Dağılımı</h4>
                <div className="space-y-2">
                  {['sales', 'inventory', 'hr', 'finance', 'marketing', 'support'].map((category) => {
                    const count = workflows.filter(w => w.category === category).length;
                    return (
                      <div key={category} className="flex justify-between">
                        <span className="text-sm text-blue-700 capitalize">{category}:</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Performans Metrikleri</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Toplam Çalıştırma:</span>
                    <span className="font-medium">{workflows.reduce((sum, w) => sum + w.executions, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Ortalama Başarı:</span>
                    <span className="font-medium">%{Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Aktif İş Akışı:</span>
                    <span className="font-medium">{workflows.filter(w => w.status === 'active').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
