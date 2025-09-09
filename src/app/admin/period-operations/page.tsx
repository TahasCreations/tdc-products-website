'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminProtection from '@/components/AdminProtection';
import OptimizedLoader from '@/components/OptimizedLoader';

interface PeriodOperation {
  id: string;
  name: string;
  type: 'opening' | 'closing' | 'adjustment';
  period: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  created_by: string;
  description?: string;
  affected_records: number;
}

interface PeriodStats {
  totalOperations: number;
  pendingOperations: number;
  completedOperations: number;
  failedOperations: number;
  currentPeriod: string;
  lastClosingDate?: string;
}

export default function AdminPeriodOperationsPage() {
  const router = useRouter();
  const [operations, setOperations] = useState<PeriodOperation[]>([]);
  const [stats, setStats] = useState<PeriodStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [activeTab, setActiveTab] = useState<'overview' | 'operations' | 'settings'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOperation, setNewOperation] = useState<Partial<PeriodOperation>>({
    name: '',
    type: 'opening',
    period: '',
    description: ''
  });

  const fetchOperations = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/period-operations');
      const data = await response.json();

      if (data.success) {
        setOperations(data.operations || []);
        setStats(data.stats || null);
      } else {
        setMessage(data.error || 'Dönem işlemleri alınamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Period operations fetch error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  const handleCreateOperation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/period-operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newOperation,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Dönem işlemi başarıyla oluşturuldu');
        setMessageType('success');
        setNewOperation({
          name: '',
          type: 'opening',
          period: '',
          description: ''
        });
        setShowCreateModal(false);
        fetchOperations();
      } else {
        setMessage(data.error || 'Dönem işlemi oluşturulamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Create operation error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleExecuteOperation = async (operationId: string) => {
    try {
      const response = await fetch(`/api/period-operations/${operationId}/execute`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Dönem işlemi başarıyla tamamlandı');
        setMessageType('success');
        fetchOperations();
      } else {
        setMessage(data.error || 'Dönem işlemi tamamlanamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Execute operation error:', error);
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

  const getOperationTypeText = (type: string) => {
    const types: Record<string, string> = {
      opening: 'Dönem Açma',
      closing: 'Dönem Kapatma',
      adjustment: 'Düzeltme'
    };
    return types[type] || type;
  };

  const getOperationTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      opening: 'bg-green-100 text-green-800',
      closing: 'bg-red-100 text-red-800',
      adjustment: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Beklemede',
      completed: 'Tamamlandı',
      failed: 'Başarısız'
    };
    return texts[status] || status;
  };

  if (loading) {
    return <OptimizedLoader message="Dönem işlemleri yükleniyor..." />;
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
                  <h1 className="text-2xl font-bold text-gray-900">Dönem İşlemleri</h1>
                  <p className="text-gray-600">Muhasebe dönemleri ve kapanış işlemleri</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Yeni İşlem
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
        {stats && (
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <i className="ri-calendar-line text-2xl text-blue-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Toplam İşlem</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalOperations}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <i className="ri-time-line text-2xl text-yellow-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.pendingOperations}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <i className="ri-check-line text-2xl text-green-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.completedOperations}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <i className="ri-calendar-check-line text-2xl text-purple-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Mevcut Dönem</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.currentPeriod}</p>
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
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📊 Genel Bakış
                </button>
                <button
                  onClick={() => setActiveTab('operations')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'operations'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🔄 İşlemler
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'settings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ⚙️ Ayarlar
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Operations */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Son İşlemler</h3>
                      <div className="space-y-3">
                        {operations.slice(0, 5).map((operation) => (
                          <div key={operation.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOperationTypeColor(operation.type)}`}>
                                {getOperationTypeText(operation.type)}
                              </span>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{operation.name}</div>
                                <div className="text-xs text-gray-500">{operation.period}</div>
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(operation.status)}`}>
                              {getStatusText(operation.status)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
                      <div className="space-y-3">
                        <button className="w-full bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg text-left transition-colors">
                          <div className="flex items-center">
                            <i className="ri-play-circle-line text-xl mr-3"></i>
                            <div>
                              <div className="font-medium">Dönem Aç</div>
                              <div className="text-sm">Yeni muhasebe dönemi başlat</div>
                            </div>
                          </div>
                        </button>
                        <button className="w-full bg-red-50 hover:bg-red-100 text-red-700 p-4 rounded-lg text-left transition-colors">
                          <div className="flex items-center">
                            <i className="ri-stop-circle-line text-xl mr-3"></i>
                            <div>
                              <div className="font-medium">Dönem Kapat</div>
                              <div className="text-sm">Mevcut dönemi sonlandır</div>
                            </div>
                          </div>
                        </button>
                        <button className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 p-4 rounded-lg text-left transition-colors">
                          <div className="flex items-center">
                            <i className="ri-settings-3-line text-xl mr-3"></i>
                            <div>
                              <div className="font-medium">Düzeltme İşlemi</div>
                              <div className="text-sm">Muhasebe kayıtlarını düzelt</div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Period Status */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Dönem Durumu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats?.currentPeriod || '2024'}</div>
                        <div className="text-sm text-gray-600">Mevcut Dönem</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {stats?.lastClosingDate ? formatDate(stats.lastClosingDate) : 'Henüz kapatılmamış'}
                        </div>
                        <div className="text-sm text-gray-600">Son Kapanış Tarihi</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {operations.filter(op => op.status === 'pending').length}
                        </div>
                        <div className="text-sm text-gray-600">Bekleyen İşlemler</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Operations Tab */}
              {activeTab === 'operations' && (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlem Adı
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tür
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dönem
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durum
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Etkilenen Kayıt
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Oluşturulma
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {operations.map((operation) => (
                          <tr key={operation.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{operation.name}</div>
                                {operation.description && (
                                  <div className="text-sm text-gray-500">{operation.description}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOperationTypeColor(operation.type)}`}>
                                {getOperationTypeText(operation.type)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {operation.period}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(operation.status)}`}>
                                {getStatusText(operation.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {operation.affected_records}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(operation.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {operation.status === 'pending' && (
                                <button
                                  onClick={() => handleExecuteOperation(operation.id)}
                                  className="text-blue-600 hover:text-blue-900 mr-3"
                                >
                                  Çalıştır
                                </button>
                              )}
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

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Dönem Ayarları</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Dönem</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          defaultValue={stats?.currentPeriod || '2024'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Otomatik Kapanış</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="disabled">Devre Dışı</option>
                          <option value="monthly">Aylık</option>
                          <option value="quarterly">Üç Aylık</option>
                          <option value="yearly">Yıllık</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kapanış Günü</label>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          defaultValue="31"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Ayarları Kaydet
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Operation Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Dönem İşlemi</h2>
              <form onSubmit={handleCreateOperation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İşlem Adı</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newOperation.name}
                      onChange={(e) => setNewOperation({ ...newOperation, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İşlem Türü</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newOperation.type}
                      onChange={(e) => setNewOperation({ ...newOperation, type: e.target.value as any })}
                    >
                      <option value="opening">Dönem Açma</option>
                      <option value="closing">Dönem Kapatma</option>
                      <option value="adjustment">Düzeltme</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dönem</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: 2024"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newOperation.period}
                      onChange={(e) => setNewOperation({ ...newOperation, period: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newOperation.description}
                    onChange={(e) => setNewOperation({ ...newOperation, description: e.target.value })}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İşlem Oluştur
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
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
