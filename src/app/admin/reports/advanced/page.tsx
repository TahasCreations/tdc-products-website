'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import AdminProtection from '../../../../components/AdminProtection';
import { 
  DocumentTextIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ChartPieIcon,
  TableCellsIcon,
  PresentationChartLineIcon,
  DocumentChartBarIcon,
  CpuChipIcon,
  SparklesIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface Report {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'financial' | 'customer' | 'inventory' | 'marketing' | 'operational' | 'custom';
  type: 'table' | 'chart' | 'dashboard' | 'pdf' | 'excel';
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'failed';
  schedule: ReportSchedule;
  filters: ReportFilter[];
  columns: ReportColumn[];
  data: any[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastRun?: string;
  nextRun?: string;
  isPublic: boolean;
  tags: string[];
}

interface ReportSchedule {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  time: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  timezone: string;
  isActive: boolean;
}

interface ReportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in';
  value: any;
  value2?: any;
  label: string;
}

interface ReportColumn {
  id: string;
  name: string;
  field: string;
  type: 'string' | 'number' | 'date' | 'currency' | 'percentage' | 'boolean';
  format?: string;
  isVisible: boolean;
  isSortable: boolean;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  features: string[];
  complexity: 'simple' | 'medium' | 'advanced';
  estimatedTime: string;
}

export default function AdvancedReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reports' | 'templates' | 'scheduled' | 'analytics' | 'settings'>('reports');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const mockReports: Report[] = [
      {
        id: '1',
        name: 'Aylık Satış Raporu',
        description: 'Aylık satış performansı ve trend analizi',
        category: 'sales',
        type: 'dashboard',
        status: 'completed',
        schedule: {
          frequency: 'monthly',
          time: '09:00',
          dayOfMonth: 1,
          timezone: 'Europe/Istanbul',
          isActive: true
        },
        filters: [
          { id: '1', field: 'date_range', operator: 'between', value: '2024-01-01', value2: '2024-01-31', label: 'Tarih Aralığı' },
          { id: '2', field: 'category', operator: 'in', value: ['Electronics', 'Clothing'], label: 'Kategori' }
        ],
        columns: [
          { id: '1', name: 'Tarih', field: 'date', type: 'date', isVisible: true, isSortable: true },
          { id: '2', name: 'Toplam Satış', field: 'total_sales', type: 'currency', isVisible: true, isSortable: true, aggregation: 'sum' },
          { id: '3', name: 'Sipariş Sayısı', field: 'order_count', type: 'number', isVisible: true, isSortable: true, aggregation: 'count' }
        ],
        data: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
        lastRun: '2024-01-15T09:00:00Z',
        nextRun: '2024-02-01T09:00:00Z',
        isPublic: true,
        tags: ['sales', 'monthly', 'performance']
      },
      {
        id: '2',
        name: 'Müşteri Analiz Raporu',
        description: 'Müşteri segmentasyonu ve davranış analizi',
        category: 'customer',
        type: 'chart',
        status: 'running',
        schedule: {
          frequency: 'weekly',
          time: '08:00',
          dayOfWeek: 1,
          timezone: 'Europe/Istanbul',
          isActive: true
        },
        filters: [],
        columns: [],
        data: [],
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com',
        isPublic: false,
        tags: ['customer', 'segmentation', 'behavior']
      }
    ];

    const mockTemplates: ReportTemplate[] = [
      {
        id: '1',
        name: 'Satış Performans Raporu',
        description: 'Detaylı satış analizi ve performans metrikleri',
        category: 'sales',
        icon: '📊',
        features: ['Satış trendleri', 'Kategori analizi', 'Bölgesel performans', 'Müşteri segmentasyonu'],
        complexity: 'medium',
        estimatedTime: '15 dakika'
      },
      {
        id: '2',
        name: 'Finansal Durum Raporu',
        description: 'Gelir-gider analizi ve finansal sağlık',
        category: 'financial',
        icon: '💰',
        features: ['Gelir analizi', 'Gider takibi', 'Kar marjı', 'Nakit akışı'],
        complexity: 'advanced',
        estimatedTime: '30 dakika'
      },
      {
        id: '3',
        name: 'Stok Durumu Raporu',
        description: 'Envanter seviyeleri ve stok hareketleri',
        category: 'inventory',
        icon: '📦',
        features: ['Stok seviyeleri', 'Hareket geçmişi', 'Tedarik önerileri', 'ABC analizi'],
        complexity: 'simple',
        estimatedTime: '10 dakika'
      }
    ];

    setReports(mockReports);
    setTemplates(mockTemplates);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircleIcon;
      case 'running': return ClockIcon;
      case 'scheduled': return CalendarIcon;
      case 'failed': return XCircleIcon;
      case 'draft': return DocumentTextIcon;
      default: return DocumentTextIcon;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales': return ShoppingBagIcon;
      case 'financial': return CurrencyDollarIcon;
      case 'customer': return UserGroupIcon;
      case 'inventory': return DocumentTextIcon;
      case 'marketing': return ChartBarIcon;
      case 'operational': return CogIcon;
      default: return DocumentTextIcon;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'table': return TableCellsIcon;
      case 'chart': return ChartPieIcon;
      case 'dashboard': return PresentationChartLineIcon;
      case 'pdf': return DocumentTextIcon;
      case 'excel': return TableCellsIcon;
      default: return DocumentTextIcon;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || report.category === categoryFilter;
    const matchesStatus = !statusFilter || report.status === statusFilter;
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
                <h1 className="text-3xl font-bold text-gray-900">Gelişmiş Raporlama</h1>
                <p className="mt-2 text-gray-600">Kapsamlı rapor oluşturma ve analiz sistemi</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Yeni Rapor
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                  <CpuChipIcon className="w-5 h-5 mr-2" />
                  AI Rapor Oluştur
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
                { id: 'reports', name: 'Raporlar', icon: DocumentTextIcon },
                { id: 'templates', name: 'Şablonlar', icon: DocumentChartBarIcon },
                { id: 'scheduled', name: 'Zamanlanmış', icon: CalendarIcon },
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
                  placeholder="Rapor ara..."
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
              <option value="sales">Satış</option>
              <option value="financial">Finansal</option>
              <option value="customer">Müşteri</option>
              <option value="inventory">Envanter</option>
              <option value="marketing">Pazarlama</option>
              <option value="operational">Operasyonel</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tüm Durumlar</option>
              <option value="completed">Tamamlandı</option>
              <option value="running">Çalışıyor</option>
              <option value="scheduled">Zamanlandı</option>
              <option value="failed">Başarısız</option>
              <option value="draft">Taslak</option>
            </select>
          </div>

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => {
                  const StatusIcon = getStatusIcon(report.status);
                  const CategoryIcon = getCategoryIcon(report.category);
                  const TypeIcon = getTypeIcon(report.type);
                  
                  return (
                    <div key={report.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start">
                            <div className="p-2 bg-gray-100 rounded-lg mr-3">
                              <CategoryIcon className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                              <div className="flex items-center mt-2">
                                <TypeIcon className="w-4 h-4 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500">
                                  {report.type === 'table' ? 'Tablo' :
                                   report.type === 'chart' ? 'Grafik' :
                                   report.type === 'dashboard' ? 'Dashboard' :
                                   report.type === 'pdf' ? 'PDF' : 'Excel'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {report.status === 'completed' ? 'Tamamlandı' :
                               report.status === 'running' ? 'Çalışıyor' :
                               report.status === 'scheduled' ? 'Zamanlandı' :
                               report.status === 'failed' ? 'Başarısız' : 'Taslak'}
                            </span>
                            {report.isPublic && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                Genel
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Kategori:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {report.category === 'sales' ? 'Satış' :
                               report.category === 'financial' ? 'Finansal' :
                               report.category === 'customer' ? 'Müşteri' :
                               report.category === 'inventory' ? 'Envanter' :
                               report.category === 'marketing' ? 'Pazarlama' :
                               report.category === 'operational' ? 'Operasyonel' : 'Özel'}
                            </span>
                          </div>
                          {report.lastRun && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Son Çalıştırma:</span>
                              <span className="text-sm text-gray-900">
                                {new Date(report.lastRun).toLocaleString('tr-TR')}
                              </span>
                            </div>
                          )}
                          {report.nextRun && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Sonraki Çalıştırma:</span>
                              <span className="text-sm text-gray-900">
                                {new Date(report.nextRun).toLocaleString('tr-TR')}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedReport(report)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-blue-600">
                                <ArrowDownTrayIcon className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <ShareIcon className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {report.tags.map((tag, index) => (
                                <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                                  {tag}
                                </span>
                              ))}
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
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          template.complexity === 'simple' ? 'text-green-600 bg-green-100' :
                          template.complexity === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                          'text-red-600 bg-red-100'
                        }`}>
                          {template.complexity === 'simple' ? 'Basit' :
                           template.complexity === 'medium' ? 'Orta' : 'Gelişmiş'}
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
                          <span className="text-sm text-gray-600">Tahmini Süre:</span>
                          <span className="text-sm font-medium text-gray-900">{template.estimatedTime}</span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
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

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Toplam Rapor</p>
                      <p className="text-2xl font-semibold text-gray-900">{reports.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {reports.filter(r => r.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <ClockIcon className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Zamanlanmış</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {reports.filter(r => r.status === 'scheduled').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <SparklesIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">AI Raporları</p>
                      <p className="text-2xl font-semibold text-gray-900">12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}
