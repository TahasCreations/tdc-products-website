'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminProtection from '../../../../components/AdminProtection';

interface PeriodLock {
  id: string;
  period_year: number;
  period_month: number;
  is_locked: boolean;
  locked_at: string;
  locked_by: string;
  created_at: string;
}

interface OpeningEntry {
  id: string;
  period_year: number;
  description: string;
  total_debit: number;
  total_credit: number;
  status: 'DRAFT' | 'POSTED';
  created_at: string;
}

interface ClosingEntry {
  id: string;
  period_year: number;
  description: string;
  total_debit: number;
  total_credit: number;
  status: 'DRAFT' | 'POSTED';
  created_at: string;
}

export default function PeriodOperationsPage() {
  const [periodLocks, setPeriodLocks] = useState<PeriodLock[]>([]);
  const [openingEntries, setOpeningEntries] = useState<OpeningEntry[]>([]);
  const [closingEntries, setClosingEntries] = useState<ClosingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'locks' | 'opening' | 'closing' | 'reports' | 'backup'>('locks');
  const [showLockForm, setShowLockForm] = useState(false);
  const [showOpeningForm, setShowOpeningForm] = useState(false);
  const [showClosingForm, setShowClosingForm] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Yeni dönem kilidi formu state'leri
  const [newLock, setNewLock] = useState({
    period_year: new Date().getFullYear(),
    period_month: new Date().getMonth() + 1,
    is_locked: false
  });

  // Açılış fişi formu state'leri
  const [newOpeningEntry, setNewOpeningEntry] = useState({
    period_year: new Date().getFullYear(),
    description: '',
    lines: [] as any[]
  });

  // Kapanış fişi formu state'leri
  const [newClosingEntry, setNewClosingEntry] = useState({
    period_year: new Date().getFullYear(),
    description: '',
    lines: [] as any[]
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPeriodLocks(),
        fetchOpeningEntries(),
        fetchClosingEntries()
      ]);
    } catch (error) {
      console.error('Data fetch error:', error);
      setError('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchPeriodLocks = async () => {
    try {
      const response = await fetch('/api/accounting/period-locks');
      if (!response.ok) throw new Error('Dönem kilitleri alınamadı');
      const data = await response.json();
      setPeriodLocks(data);
    } catch (error) {
      console.error('Period locks fetch error:', error);
    }
  };

  const fetchOpeningEntries = async () => {
    try {
      const response = await fetch('/api/accounting/opening-entries');
      if (!response.ok) throw new Error('Açılış fişleri alınamadı');
      const data = await response.json();
      setOpeningEntries(data);
    } catch (error) {
      console.error('Opening entries fetch error:', error);
    }
  };

  const fetchClosingEntries = async () => {
    try {
      const response = await fetch('/api/accounting/closing-entries');
      if (!response.ok) throw new Error('Kapanış fişleri alınamadı');
      const data = await response.json();
      setClosingEntries(data);
    } catch (error) {
      console.error('Closing entries fetch error:', error);
    }
  };

  const handleLockPeriod = async () => {
    try {
      const response = await fetch('/api/accounting/period-locks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLock),
      });

      if (!response.ok) throw new Error('Dönem kilitlenemedi');

      await fetchPeriodLocks();
      setShowLockForm(false);
      setNewLock({
        period_year: new Date().getFullYear(),
        period_month: new Date().getMonth() + 1,
        is_locked: false
      });
      setError('');
    } catch (error) {
      console.error('Lock period error:', error);
      setError('Dönem kilitlenirken hata oluştu');
    }
  };

  const handleUnlockPeriod = async (lockId: string) => {
    if (!confirm('Bu dönemi açmak istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/accounting/period-locks/${lockId}/unlock`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Dönem açılamadı');

      await fetchPeriodLocks();
    } catch (error) {
      console.error('Unlock period error:', error);
      setError('Dönem açılırken hata oluştu');
    }
  };

  const handleCreateOpeningEntry = async () => {
    try {
      const response = await fetch('/api/accounting/opening-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOpeningEntry),
      });

      if (!response.ok) throw new Error('Açılış fişi oluşturulamadı');

      await fetchOpeningEntries();
      setShowOpeningForm(false);
      setNewOpeningEntry({
        period_year: new Date().getFullYear(),
        description: '',
        lines: []
      });
      setError('');
    } catch (error) {
      console.error('Create opening entry error:', error);
      setError('Açılış fişi oluşturulurken hata oluştu');
    }
  };

  const handleCreateClosingEntry = async () => {
    try {
      const response = await fetch('/api/accounting/closing-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClosingEntry),
      });

      if (!response.ok) throw new Error('Kapanış fişi oluşturulamadı');

      await fetchClosingEntries();
      setShowClosingForm(false);
      setNewClosingEntry({
        period_year: new Date().getFullYear(),
        description: '',
        lines: []
      });
      setError('');
    } catch (error) {
      console.error('Create closing entry error:', error);
      setError('Kapanış fişi oluşturulurken hata oluştu');
    }
  };

  const generateYearlyReport = async () => {
    try {
      const response = await fetch(`/api/accounting/reports/yearly/${selectedYear}`);
      if (!response.ok) throw new Error('Yıllık rapor oluşturulamadı');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `yillik-rapor-${selectedYear}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Generate yearly report error:', error);
      setError('Yıllık rapor oluşturulurken hata oluştu');
    }
  };

  const createBackup = async () => {
    try {
      const response = await fetch('/api/accounting/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: selectedYear }),
      });

      if (!response.ok) throw new Error('Yedekleme oluşturulamadı');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `muhasebe-yedek-${selectedYear}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Create backup error:', error);
      setError('Yedekleme oluşturulurken hata oluştu');
    }
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Dönem işlemleri yükleniyor...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Dönem İşlemleri</h1>
                <p className="mt-2 text-gray-600">Muhasebe dönemi yönetimi ve kapanış işlemleri</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowLockForm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-lock-line mr-2"></i>
                  Dönem Kilitle
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('locks')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'locks'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-lock-line mr-2"></i>
                  Dönem Kilitleri
                </button>
                <button
                  onClick={() => setActiveTab('opening')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'opening'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-play-circle-line mr-2"></i>
                  Açılış Fişleri
                </button>
                <button
                  onClick={() => setActiveTab('closing')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'closing'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-stop-circle-line mr-2"></i>
                  Kapanış Fişleri
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reports'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-file-chart-line mr-2"></i>
                  Dönem Raporları
                </button>
                <button
                  onClick={() => setActiveTab('backup')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'backup'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-download-cloud-line mr-2"></i>
                  Yedekleme
                </button>
              </nav>
            </div>
          </div>

          {/* Dönem Kilitleri Tab */}
          {activeTab === 'locks' && (
            <div className="space-y-6">
              {/* Dönem Kilidi Özeti */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <i className="ri-lock-line text-2xl text-red-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Kilitli Dönemler</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {periodLocks.filter(lock => lock.is_locked).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <i className="ri-unlock-line text-2xl text-green-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Açık Dönemler</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {periodLocks.filter(lock => !lock.is_locked).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <i className="ri-calendar-line text-2xl text-blue-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Toplam Dönem</p>
                      <p className="text-2xl font-bold text-gray-900">{periodLocks.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dönem Kilitleri Listesi */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Dönem Kilitleri</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Yıl
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ay
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kilitlenme Tarihi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kilitleyen
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {periodLocks.map((lock) => (
                        <tr key={lock.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {lock.period_year}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {lock.period_month}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              lock.is_locked 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {lock.is_locked ? 'Kilitli' : 'Açık'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {lock.locked_at ? new Date(lock.locked_at).toLocaleDateString('tr-TR') : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {lock.locked_by || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {lock.is_locked && (
                              <button
                                onClick={() => handleUnlockPeriod(lock.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Dönemi Aç"
                              >
                                <i className="ri-unlock-line"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Açılış Fişleri Tab */}
          {activeTab === 'opening' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Açılış Fişleri</h2>
                <button
                  onClick={() => setShowOpeningForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-add-line mr-2"></i>
                  Yeni Açılış Fişi
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Yıl
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Açıklama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Toplam Borç
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Toplam Alacak
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {openingEntries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {entry.period_year}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {entry.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {entry.total_debit.toLocaleString('tr-TR')} TL
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {entry.total_credit.toLocaleString('tr-TR')} TL
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              entry.status === 'POSTED' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {entry.status === 'POSTED' ? 'Kayıtlı' : 'Taslak'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(entry.created_at).toLocaleDateString('tr-TR')}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Kapanış Fişleri Tab */}
          {activeTab === 'closing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Kapanış Fişleri</h2>
                <button
                  onClick={() => setShowClosingForm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-add-line mr-2"></i>
                  Yeni Kapanış Fişi
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Yıl
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Açıklama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Toplam Borç
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Toplam Alacak
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {closingEntries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {entry.period_year}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {entry.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {entry.total_debit.toLocaleString('tr-TR')} TL
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {entry.total_credit.toLocaleString('tr-TR')} TL
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              entry.status === 'POSTED' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {entry.status === 'POSTED' ? 'Kayıtlı' : 'Taslak'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(entry.created_at).toLocaleDateString('tr-TR')}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Dönem Raporları Tab */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dönem Raporları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Yıllık Mali Tablolar</h3>
                  <p className="text-sm text-gray-600 mb-4">Bilanço ve gelir tablosu</p>
                  <button 
                    onClick={generateYearlyReport}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Raporu Oluştur
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Dönem Karşılaştırması</h3>
                  <p className="text-sm text-gray-600 mb-4">Yıllar arası karşılaştırma</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                    Raporu Oluştur
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">KDV Raporu</h3>
                  <p className="text-sm text-gray-600 mb-4">Yıllık KDV özeti</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                    Raporu Oluştur
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Maliyet Raporu</h3>
                  <p className="text-sm text-gray-600 mb-4">Üretim maliyet analizi</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                    Raporu Oluştur
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Yedekleme Tab */}
          {activeTab === 'backup' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Yedekleme İşlemleri</h2>
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <i className="ri-information-line text-yellow-600 text-xl mr-3"></i>
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">Yedekleme Bilgisi</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Dönem sonu yedekleme işlemi tüm muhasebe verilerini içerir. 
                        Bu işlem sadece dönem kilitlendikten sonra yapılmalıdır.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-2">Tam Yedekleme</h3>
                    <p className="text-sm text-gray-600 mb-4">Tüm muhasebe verilerini yedekle</p>
                    <button 
                      onClick={createBackup}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Yedekleme Oluştur
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-2">Seçmeli Yedekleme</h3>
                    <p className="text-sm text-gray-600 mb-4">Belirli modülleri yedekle</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                      Modül Seç
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dönem Kilitleme Formu */}
          {showLockForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Dönem Kilitle</h2>
                  <button
                    onClick={() => setShowLockForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yıl *
                    </label>
                    <input
                      type="number"
                      value={newLock.period_year}
                      onChange={(e) => setNewLock(prev => ({ ...prev, period_year: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ay *
                    </label>
                    <select
                      value={newLock.period_month}
                      onChange={(e) => setNewLock(prev => ({ ...prev, period_month: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end space-x-4">
                  <button
                    onClick={() => setShowLockForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleLockPeriod}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Dönemi Kilitle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hata Mesajı */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}
