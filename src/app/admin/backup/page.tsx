'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminProtection from '../../../components/AdminProtection';
import { useErrorToast } from '../../../hooks/useErrorToast';
import { ApiWrapper } from '../../../lib/api-wrapper';

interface Backup {
  id: string;
  name: string;
  data: any;
  size: number;
  created_at: string;
}

export default function BackupPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [backupName, setBackupName] = useState('');

  const { handleAsyncOperation, showSuccess, showError } = useErrorToast();

  const fetchBackups = useCallback(async () => {
    const result = await handleAsyncOperation(
      () => ApiWrapper.get('/api/backup?action=list'),
      undefined,
      'Yedeklemeler yüklenirken'
    );

    if (result && (result as any).data) {
      setBackups((result as any).data.backups || []);
    }
    setLoading(false);
  }, [handleAsyncOperation]);

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  const handleCreateBackup = async () => {
    if (!backupName.trim()) {
      showError('Yedekleme adı gerekli');
      return;
    }

    setCreating(true);
    
    try {
      // Önce yedekleme oluştur
      const createResult = await handleAsyncOperation(
        () => ApiWrapper.get('/api/backup?action=create'),
        undefined,
        'Yedekleme oluşturulurken'
      );

      if (createResult && (createResult as any).data) {
        const backupData = (createResult as any).data.backup;
        
        // Yedeklemeyi kaydet
        const saveResult = await handleAsyncOperation(
          () => ApiWrapper.post('/api/backup', {
            action: 'save',
            backupData: backupData
          }),
          'Yedekleme başarıyla oluşturuldu',
          'Yedekleme kaydedilirken'
        );

        if (saveResult && (saveResult as any).data) {
          setBackupName('');
          setShowCreateForm(false);
          fetchBackups();
        }
      }
    } catch (error) {
      console.error('Backup creation error:', error);
      showError('Yedekleme oluşturulamadı');
    } finally {
      setCreating(false);
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (!confirm('Bu yedeklemeyi geri yüklemek istediğinizden emin misiniz? Mevcut veriler silinecektir!')) {
      return;
    }

    setRestoring(backupId);
    
    const result = await handleAsyncOperation(
      () => ApiWrapper.post('/api/backup', {
        action: 'restore',
        backupId: backupId
      }),
      'Yedekleme başarıyla geri yüklendi',
      'Yedekleme geri yüklenirken'
    );

    if (result && (result as any).data) {
      fetchBackups();
    }
    
    setRestoring(null);
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (!confirm('Bu yedeklemeyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    const result = await handleAsyncOperation(
      () => ApiWrapper.post('/api/backup', {
        action: 'delete',
        backupId: backupId
      }),
      'Yedekleme silindi',
      'Yedekleme silinirken'
    );

    if (result && (result as any).data) {
      fetchBackups();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yedeklemeler yükleniyor...</p>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Veri Yedekleme Yönetimi</h1>
                <p className="mt-2 text-gray-600">Sistem verilerini yedekleyin ve geri yükleyin</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {showCreateForm ? 'Formu Gizle' : 'Yeni Yedekleme'}
                </button>
                <button
                  onClick={fetchBackups}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-refresh-line mr-2"></i>
                  Yenile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Create Backup Form */}
          {showCreateForm && (
            <div className="bg-white rounded-lg shadow-sm border mb-8">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Yeni Yedekleme Oluştur</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yedekleme Adı
                    </label>
                    <input
                      type="text"
                      value={backupName}
                      onChange={(e) => setBackupName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Örn: Günlük Yedekleme"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleCreateBackup}
                      disabled={creating}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      {creating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Oluşturuluyor...
                        </>
                      ) : (
                        <>
                          <i className="ri-download-line mr-2"></i>
                          Yedekleme Oluştur
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <i className="ri-information-line text-blue-600 text-lg mr-3 mt-1"></i>
                    <div>
                      <h3 className="text-sm font-medium text-blue-900">Yedekleme Bilgileri</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Bu işlem tüm sistem verilerini (ürünler, kategoriler, kullanıcılar, siparişler, muhasebe verileri) yedekleyecektir.
                        Yedekleme işlemi tamamlandıktan sonra verilerinizi güvenle saklayabilirsiniz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Backups List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Mevcut Yedeklemeler</h2>
              <p className="text-sm text-gray-600 mt-1">
                Toplam {backups.length} yedekleme bulundu
              </p>
            </div>
            
            {backups.length === 0 ? (
              <div className="p-8 text-center">
                <i className="ri-database-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz yedekleme bulunmuyor</h3>
                <p className="text-gray-600 mb-4">İlk yedeklemenizi oluşturmak için yukarıdaki butonu kullanın.</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  İlk Yedekleme Oluştur
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Yedekleme Adı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Boyut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Oluşturulma Tarihi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {backups.map((backup) => (
                      <tr key={backup.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <i className="ri-database-line text-blue-600 text-lg mr-3"></i>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {backup.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {backup.id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatFileSize(backup.size)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(backup.created_at).toLocaleString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleRestoreBackup(backup.id)}
                              disabled={restoring === backup.id}
                              className="text-green-600 hover:text-green-900 disabled:text-gray-400 flex items-center"
                            >
                              {restoring === backup.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-1"></div>
                                  Geri Yükleniyor...
                                </>
                              ) : (
                                <>
                                  <i className="ri-upload-line mr-1"></i>
                                  Geri Yükle
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteBackup(backup.id)}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <i className="ri-delete-bin-line mr-1"></i>
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Backup Statistics */}
          {backups.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="ri-database-line text-3xl text-blue-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Toplam Yedekleme</p>
                    <p className="text-2xl font-semibold text-gray-900">{backups.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="ri-file-line text-3xl text-green-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Toplam Boyut</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatFileSize(backups.reduce((sum, backup) => sum + backup.size, 0))}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="ri-calendar-line text-3xl text-purple-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Son Yedekleme</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {backups.length > 0 
                        ? new Date(backups[0].created_at).toLocaleDateString('tr-TR')
                        : 'Yok'
                      }
                    </p>
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
