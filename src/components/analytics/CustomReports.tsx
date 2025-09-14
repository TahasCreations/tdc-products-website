'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  FunnelIcon,
  TableCellsIcon,
  ChartPieIcon,
  ChartBarSquareIcon,
  ChartBarSquareIcon as BarChartIcon
} from '@heroicons/react/24/outline';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'dashboard' | 'analytics' | 'ecommerce' | 'performance' | 'custom';
  queryConfig: any;
  filters: any;
  visualizationConfig: any;
  scheduleConfig: any;
  isPublic: boolean;
  isActive: boolean;
  createdBy: string;
  lastGeneratedAt: string;
  nextGenerationAt: string;
  createdAt: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  queryConfig: any;
  visualizationConfig: any;
  icon: React.ComponentType<any>;
}

export default function CustomReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  useEffect(() => {
    fetchReports();
    fetchTemplates();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/analytics/reports');
      if (response.ok) {
        const reportsData = await response.json();
        setReports(reportsData);
      }
    } catch (error) {
      console.error('Reports fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/analytics/report-templates');
      if (response.ok) {
        const templatesData = await response.json();
        setTemplates(templatesData);
      }
    } catch (error) {
      console.error('Templates fetch error:', error);
    }
  };

  const handleCreateReport = async (reportData: any) => {
    try {
      const response = await fetch('/api/analytics/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        await fetchReports();
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Create report error:', error);
    }
  };

  const handleUpdateReport = async (reportId: string, reportData: any) => {
    try {
      const response = await fetch(`/api/analytics/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        await fetchReports();
        setShowEditModal(false);
        setSelectedReport(null);
      }
    } catch (error) {
      console.error('Update report error:', error);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Bu raporu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/analytics/reports/${reportId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchReports();
      }
    } catch (error) {
      console.error('Delete report error:', error);
    }
  };

  const handleGenerateReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/analytics/reports/${reportId}/generate`, {
        method: 'POST',
      });

      if (response.ok) {
        await fetchReports();
      }
    } catch (error) {
      console.error('Generate report error:', error);
    }
  };

  const handleExportReport = async (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    try {
      const response = await fetch(`/api/analytics/reports/${reportId}/export?format=${format}`, {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${reportId}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export report error:', error);
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'dashboard':
        return <ChartBarIcon className="w-5 h-5" />;
      case 'analytics':
        return <ChartBarSquareIcon className="w-5 h-5" />;
      case 'ecommerce':
        return <BarChartIcon className="w-5 h-5" />;
      case 'performance':
        return <ChartPieIcon className="w-5 h-5" />;
      case 'custom':
        return <TableCellsIcon className="w-5 h-5" />;
      default:
        return <ChartBarIcon className="w-5 h-5" />;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'dashboard':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'analytics':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'ecommerce':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'performance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'custom':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Özel Raporlar
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Özelleştirilmiş analitik raporları oluşturun ve yönetin
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Yeni Rapor
        </button>
      </div>

      {/* Report Templates */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Rapor Şablonları
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => {
            const IconComponent = template.icon;
            return (
              <div
                key={template.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedTemplate(template);
                  setShowCreateModal(true);
                }}
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                    <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {template.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {template.category}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {template.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                  {getReportTypeIcon(report.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {report.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {report.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`px-2 py-1 text-xs rounded-full ${getReportTypeColor(report.type)}`}>
                  {report.type}
                </span>
                {report.isPublic && (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Public
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Son Oluşturulma:</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {new Date(report.lastGeneratedAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Sonraki Oluşturma:</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {new Date(report.nextGenerationAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Durum:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  report.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {report.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleGenerateReport(report.id)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Raporu Oluştur"
                >
                  <CalendarIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedReport(report);
                    setShowEditModal(true);
                  }}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                  title="Düzenle"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteReport(report.id)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Sil"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleExportReport(report.id, 'pdf')}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="PDF Olarak İndir"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleExportReport(report.id, 'excel')}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  title="Excel Olarak İndir"
                >
                  <TableCellsIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleExportReport(report.id, 'csv')}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="CSV Olarak İndir"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {showCreateModal ? 'Yeni Rapor Oluştur' : 'Raporu Düzenle'}
              </h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const reportData = {
                  name: formData.get('name'),
                  description: formData.get('description'),
                  type: formData.get('type'),
                  isPublic: formData.get('isPublic') === 'on',
                  isActive: formData.get('isActive') === 'on',
                  queryConfig: selectedTemplate?.queryConfig || {},
                  visualizationConfig: selectedTemplate?.visualizationConfig || {},
                  scheduleConfig: {
                    frequency: formData.get('frequency'),
                    time: formData.get('time'),
                    dayOfWeek: formData.get('dayOfWeek'),
                    dayOfMonth: formData.get('dayOfMonth')
                  }
                };

                if (showCreateModal) {
                  handleCreateReport(reportData);
                } else if (selectedReport) {
                  handleUpdateReport(selectedReport.id, reportData);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rapor Adı
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedReport?.name || selectedTemplate?.name || ''}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Açıklama
                    </label>
                    <textarea
                      name="description"
                      defaultValue={selectedReport?.description || selectedTemplate?.description || ''}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rapor Türü
                    </label>
                    <select
                      name="type"
                      defaultValue={selectedReport?.type || selectedTemplate?.category || ''}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    >
                      <option value="dashboard">Dashboard</option>
                      <option value="analytics">Analytics</option>
                      <option value="ecommerce">E-ticaret</option>
                      <option value="performance">Performans</option>
                      <option value="custom">Özel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Otomatik Oluşturma Sıklığı
                    </label>
                    <select
                      name="frequency"
                      defaultValue={selectedReport?.scheduleConfig?.frequency || 'daily'}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="daily">Günlük</option>
                      <option value="weekly">Haftalık</option>
                      <option value="monthly">Aylık</option>
                      <option value="quarterly">Üç Aylık</option>
                      <option value="yearly">Yıllık</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isPublic"
                        defaultChecked={selectedReport?.isPublic || false}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Herkese Açık
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        defaultChecked={selectedReport?.isActive !== false}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Aktif
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setSelectedReport(null);
                      setSelectedTemplate(null);
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {showCreateModal ? 'Oluştur' : 'Güncelle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
