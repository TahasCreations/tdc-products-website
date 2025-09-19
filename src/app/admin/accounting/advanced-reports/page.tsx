'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ApiWrapper } from '@/lib/api-wrapper';

interface ReportCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color: string;
  parent_id?: string;
  sort_order: number;
}

interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  template_type: string;
  data_source: string;
  template_config: any;
  layout_config: any;
  export_formats: string[];
  is_public: boolean;
  report_categories?: ReportCategory;
}

interface ReportWidget {
  id: string;
  name: string;
  widget_type: string;
  category: string;
  widget_config: any;
  data_query: string;
  icon?: string;
  description?: string;
}

interface ReportExecution {
  id: string;
  template_id: string;
  execution_name?: string;
  status: string;
  progress: number;
  result_data?: any;
  error_message?: string;
  execution_time?: number;
  started_at: string;
  completed_at?: string;
  report_templates?: ReportTemplate;
}

export default function AdvancedReportsPage() {
  const [activeTab, setActiveTab] = useState('templates');
  const [categories, setCategories] = useState<ReportCategory[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [widgets, setWidgets] = useState<ReportWidget[]>([]);
  const [executions, setExecutions] = useState<ReportExecution[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);

  // Form states
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showWidgetForm, setShowWidgetForm] = useState(false);
  const [showExecutionForm, setShowExecutionForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null);
  const [editingWidget, setEditingWidget] = useState<ReportWidget | null>(null);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category_id: '',
    template_type: 'financial',
    data_source: 'accounting',
    template_config: {},
    layout_config: {},
    export_formats: ['pdf', 'excel'],
    is_public: false
  });

  const [newWidget, setNewWidget] = useState({
    name: '',
    widget_type: 'chart',
    category: 'financial',
    widget_config: {},
    data_query: '',
    icon: 'ri-bar-chart-line',
    description: ''
  });

  const [newExecution, setNewExecution] = useState({
    template_id: '',
    execution_name: '',
    parameters: {},
    filters: {}
  });

  const fetchCategories = useCallback(async () => {
    try {
      const result = await ApiWrapper.get('/api/accounting/advanced-reports?action=categories');
      if (result && (result as any).data) {
        setCategories((result as any).data);
      }
    } catch (error) {
      console.error('Kategori listesi yüklenemedi:', error);
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const result = await ApiWrapper.get('/api/accounting/advanced-reports?action=templates');
      if (result && (result as any).data) {
        setTemplates((result as any).data);
      }
    } catch (error) {
      console.error('Şablon listesi yüklenemedi:', error);
    }
  }, []);

  const fetchWidgets = useCallback(async () => {
    try {
      const result = await ApiWrapper.get('/api/accounting/advanced-reports?action=widgets');
      if (result && (result as any).data) {
        setWidgets((result as any).data);
      }
    } catch (error) {
      console.error('Widget listesi yüklenemedi:', error);
    }
  }, []);

  const fetchExecutions = useCallback(async () => {
    try {
      const result = await ApiWrapper.get('/api/accounting/advanced-reports?action=executions');
      if (result && (result as any).data) {
        setExecutions((result as any).data);
      }
    } catch (error) {
      console.error('Çalıştırma listesi yüklenemedi:', error);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCategories(),
        fetchTemplates(),
        fetchWidgets(),
        fetchExecutions()
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, fetchTemplates, fetchWidgets, fetchExecutions]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiLoading(true);

    try {
      const result = await ApiWrapper.post('/api/accounting/advanced-reports', {
        action: 'create_template',
        ...newTemplate
      });

      if (result && (result as any).data) {
        await fetchTemplates();
        setShowTemplateForm(false);
        setNewTemplate({
          name: '',
          description: '',
          category_id: '',
          template_type: 'financial',
          data_source: 'accounting',
          template_config: {},
          layout_config: {},
          export_formats: ['pdf', 'excel'],
          is_public: false
        });
      }
    } catch (error) {
      console.error('Şablon oluşturulamadı:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const handleCreateWidget = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiLoading(true);

    try {
      const result = await ApiWrapper.post('/api/accounting/advanced-reports', {
        action: 'create_widget',
        ...newWidget
      });

      if (result && (result as any).data) {
        await fetchWidgets();
        setShowWidgetForm(false);
        setNewWidget({
          name: '',
          widget_type: 'chart',
          category: 'financial',
          widget_config: {},
          data_query: '',
          icon: 'ri-bar-chart-line',
          description: ''
        });
      }
    } catch (error) {
      console.error('Widget oluşturulamadı:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const handleExecuteReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiLoading(true);

    try {
      const result = await ApiWrapper.post('/api/accounting/advanced-reports', {
        action: 'execute_report',
        ...newExecution
      });

      if (result && (result as any).data) {
        await fetchExecutions();
        setShowExecutionForm(false);
        setNewExecution({
          template_id: '',
          execution_name: '',
          parameters: {},
          filters: {}
        });
      }
    } catch (error) {
      console.error('Rapor çalıştırılamadı:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'running': return 'Çalışıyor';
      case 'failed': return 'Başarısız';
      default: return 'Beklemede';
    }
  };

  // Stable handlers
  const handleRunTemplate = useCallback((templateId: string) => {
    setNewExecution(prev => ({ ...prev, template_id: templateId }));
    setShowExecutionForm(true);
  }, []);

  // Memoized row lists to avoid unnecessary re-renders
  const templateRows = useMemo(() => (
    templates.map((template) => (
      <tr key={template.id}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <i className="ri-file-chart-line text-blue-600"></i>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {template.name}
              </div>
              <div className="text-sm text-gray-500">
                {template.description}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {template.report_categories && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {template.report_categories.name}
            </span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {template.template_type}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {template.data_source}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            template.is_public 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {template.is_public ? 'Açık' : 'Özel'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRunTemplate(template.id)}
              className="text-blue-600 hover:text-blue-900"
              title="Çalıştır"
            >
              <i className="ri-play-line"></i>
            </button>
            <button
              className="text-green-600 hover:text-green-900"
              title="Düzenle"
            >
              <i className="ri-edit-line"></i>
            </button>
            <button
              className="text-red-600 hover:text-red-900"
              title="Sil"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    ))
  ), [templates, handleRunTemplate]);

  const widgetRows = useMemo(() => (
    widgets.map((widget) => (
      <tr key={widget.id}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <i className={`${widget.icon || 'ri-dashboard-line'} text-green-600`}></i>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {widget.name}
              </div>
              <div className="text-sm text-gray-500">
                {widget.description}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {widget.widget_type}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {widget.category}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center gap-2">
            <button
              className="text-green-600 hover:text-green-900"
              title="Düzenle"
            >
              <i className="ri-edit-line"></i>
            </button>
            <button
              className="text-red-600 hover:text-red-900"
              title="Sil"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    ))
  ), [widgets]);

  const executionRows = useMemo(() => (
    executions.map((execution) => (
      <tr key={execution.id}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {execution.execution_name || 'İsimsiz Çalıştırma'}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {execution.report_templates?.name || 'Bilinmeyen Şablon'}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
            {getStatusText(execution.status)}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${execution.progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">{execution.progress}%</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {formatDate(execution.started_at)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center gap-2">
            {execution.status === 'completed' && (
              <button
                className="text-green-600 hover:text-green-900"
                title="İndir"
              >
                <i className="ri-download-line"></i>
              </button>
            )}
            <button
              className="text-blue-600 hover:text-blue-900"
              title="Detaylar"
            >
              <i className="ri-eye-line"></i>
            </button>
            <button
              className="text-red-600 hover:text-red-900"
              title="Sil"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    ))
  ), [executions]);

  const categoryRows = useMemo(() => (
    categories.map((category) => (
      <tr key={category.id}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <div 
                className="h-10 w-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: category.color + '20' }}
              >
                <i className={`${category.icon || 'ri-folder-line'} text-lg`} style={{ color: category.color }}></i>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {category.name}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">
          {category.description || '-'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {category.sort_order}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center gap-2">
            <button
              className="text-green-600 hover:text-green-900"
              title="Düzenle"
            >
              <i className="ri-edit-line"></i>
            </button>
            <button
              className="text-red-600 hover:text-red-900"
              title="Sil"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    ))
  ), [categories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gelişmiş Rapor Tasarımcısı</h1>
          <p className="text-gray-600">Drag & drop rapor tasarımcısı ve özel raporlar</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <i className="ri-add-line"></i>
            Şablon Oluştur
          </button>
          <button
            onClick={() => setShowWidgetForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <i className="ri-dashboard-line"></i>
            Widget Ekle
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'templates', label: 'Rapor Şablonları', icon: 'ri-file-chart-line' },
            { id: 'widgets', label: 'Widget&apos;lar', icon: 'ri-dashboard-line' },
            { id: 'executions', label: 'Çalıştırmalar', icon: 'ri-play-line' },
            { id: 'categories', label: 'Kategoriler', icon: 'ri-folder-line' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Şablonlar Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* Şablon Formu */}
          {showTemplateForm && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingTemplate ? 'Şablon Düzenle' : 'Yeni Rapor Şablonu'}
              </h3>
              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Şablon Adı
                    </label>
                    <input
                      type="text"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      value={newTemplate.category_id}
                      onChange={(e) => setNewTemplate({ ...newTemplate, category_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Kategori seçin</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Şablon Tipi
                    </label>
                    <select
                      value={newTemplate.template_type}
                      onChange={(e) => setNewTemplate({ ...newTemplate, template_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="financial">Finansal</option>
                      <option value="inventory">Envanter</option>
                      <option value="sales">Satış</option>
                      <option value="custom">Özel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Veri Kaynağı
                    </label>
                    <select
                      value={newTemplate.data_source}
                      onChange={(e) => setNewTemplate({ ...newTemplate, data_source: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="accounting">Muhasebe</option>
                      <option value="inventory">Envanter</option>
                      <option value="sales">Satış</option>
                      <option value="hr">İnsan Kaynakları</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newTemplate.is_public}
                      onChange={(e) => setNewTemplate({ ...newTemplate, is_public: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Herkese Açık</span>
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={apiLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <i className="ri-save-line"></i>
                    {apiLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTemplateForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Şablon Listesi */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Rapor Şablonları</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Şablon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tip
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Veri Kaynağı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {templateRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Widget'lar Tab */}
      {activeTab === 'widgets' && (
        <div className="space-y-6">
          {/* Widget Formu */}
          {showWidgetForm && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Widget</h3>
              <form onSubmit={handleCreateWidget} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Widget Adı
                    </label>
                    <input
                      type="text"
                      value={newWidget.name}
                      onChange={(e) => setNewWidget({ ...newWidget, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Widget Tipi
                    </label>
                    <select
                      value={newWidget.widget_type}
                      onChange={(e) => setNewWidget({ ...newWidget, widget_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="chart">Grafik</option>
                      <option value="table">Tablo</option>
                      <option value="metric">Metrik</option>
                      <option value="text">Metin</option>
                      <option value="image">Resim</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      value={newWidget.category}
                      onChange={(e) => setNewWidget({ ...newWidget, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="financial">Finansal</option>
                      <option value="sales">Satış</option>
                      <option value="inventory">Envanter</option>
                      <option value="hr">İnsan Kaynakları</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İkon
                    </label>
                    <input
                      type="text"
                      value={newWidget.icon}
                      onChange={(e) => setNewWidget({ ...newWidget, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ri-bar-chart-line"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Veri Sorgusu
                  </label>
                  <textarea
                    value={newWidget.data_query}
                    onChange={(e) => setNewWidget({ ...newWidget, data_query: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="SELECT * FROM table_name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={newWidget.description}
                    onChange={(e) => setNewWidget({ ...newWidget, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={apiLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <i className="ri-save-line"></i>
                    {apiLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWidgetForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Widget Listesi */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Widget&apos;lar</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Widget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tip
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {widgetRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Çalıştırmalar Tab */}
      {activeTab === 'executions' && (
        <div className="space-y-6">
          {/* Çalıştırma Formu */}
          {showExecutionForm && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rapor Çalıştır</h3>
              <form onSubmit={handleExecuteReport} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şablon
                  </label>
                  <select
                    value={newExecution.template_id}
                    onChange={(e) => setNewExecution({ ...newExecution, template_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Şablon seçin</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Çalıştırma Adı
                  </label>
                  <input
                    type="text"
                    value={newExecution.execution_name}
                    onChange={(e) => setNewExecution({ ...newExecution, execution_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Aylık Satış Raporu"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={apiLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <i className="ri-play-line"></i>
                    {apiLoading ? 'Çalıştırılıyor...' : 'Raporu Çalıştır'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowExecutionForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Rapor Çalıştırmaları</h3>
            <button
              onClick={() => setShowExecutionForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              Yeni Çalıştırma
            </button>
          </div>

          {/* Çalıştırma Listesi */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Çalıştırma
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Şablon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İlerleme
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Başlangıç
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {executionRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Kategoriler Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Rapor Kategorileri</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Açıklama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sıra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoryRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
