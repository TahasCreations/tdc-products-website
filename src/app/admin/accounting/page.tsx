'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AdminProtection from '../../../components/AdminProtection';
import OptimizedLoader from '../../../components/OptimizedLoader';

interface DashboardData {
  totalAccounts: number;
  totalJournalEntries: number;
  totalInvoices: number;
  totalContacts: number;
  recentJournalEntries: any[];
  kdvSummary: {
    totalKdv: number;
    kdvRates: { [key: string]: number };
  };
}

export default function AccountingPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [importType, setImportType] = useState('accounts');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/accounting/dashboard');
      if (!response.ok) {
        throw new Error('Dashboard verileri alınamadı');
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Dashboard error:', error);
      setError('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleExcelImport = async () => {
    if (!excelFile) return;

    const formData = new FormData();
    formData.append('file', excelFile);
    formData.append('type', importType);

    try {
      const response = await fetch('/api/accounting/excel-import', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Excel dosyası başarıyla içe aktarıldı!');
        setShowExcelImport(false);
        setExcelFile(null);
        fetchDashboardData();
      } else {
        alert('Excel dosyası içe aktarılırken hata oluştu!');
      }
    } catch (error) {
      console.error('Excel import error:', error);
      alert('Excel dosyası içe aktarılırken hata oluştu!');
    }
  };

  if (loading) {
    return <OptimizedLoader message="Muhasebe verileri yükleniyor..." />;
  }

  if (error) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Hata</h2>
              <p>{error}</p>
              <button
                onClick={fetchDashboardData}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg mx-4 mt-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ETA Muhasebe Sistemi</h1>
              <p className="mt-2 text-gray-600">Profesyonel muhasebe yönetimi ve raporlama</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowExcelImport(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <i className="ri-file-excel-line mr-2"></i>
                Excel İçe Aktar
              </button>
              <span className="text-sm text-gray-500">
                Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-4 mt-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-dashboard-line mr-2"></i>
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('modules')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'modules'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-apps-line mr-2"></i>
                Modüller
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'reports'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-bar-chart-line mr-2"></i>
                Raporlar
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mx-4 mt-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Özet Kartları */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <i className="ri-account-book-line text-2xl text-blue-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Hesap Sayısı</h3>
                      <p className="text-3xl font-bold text-blue-600">
                        {dashboardData?.totalAccounts || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <i className="ri-file-list-line text-2xl text-green-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Yevmiye Fişleri</h3>
                      <p className="text-3xl font-bold text-green-600">
                        {dashboardData?.totalJournalEntries || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <i className="ri-file-text-line text-2xl text-purple-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Faturalar</h3>
                      <p className="text-3xl font-bold text-purple-600">
                        {dashboardData?.totalInvoices || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <i className="ri-contacts-line text-2xl text-orange-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Cari Hesaplar</h3>
                      <p className="text-3xl font-bold text-orange-600">
                        {dashboardData?.totalContacts || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Son Yevmiye Fişleri ve KDV Özeti */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Son Yevmiye Fişleri</h2>
                  </div>
                  <div className="p-6">
                    {dashboardData?.recentJournalEntries && dashboardData.recentJournalEntries.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.recentJournalEntries.map((entry: any) => (
                          <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{entry.no}</p>
                              <p className="text-sm text-gray-600">{entry.description}</p>
                              <p className="text-xs text-gray-500">{entry.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {entry.total_debit?.toLocaleString('tr-TR')} TL
                              </p>
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                entry.status === 'POSTED' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {entry.status === 'POSTED' ? 'Kayıtlı' : 'Taslak'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">Henüz yevmiye fişi bulunmuyor</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">KDV Özeti</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Toplam KDV</span>
                        <span className="font-semibold text-gray-900">
                          {dashboardData?.kdvSummary?.totalKdv?.toLocaleString('tr-TR') || 0} TL
                        </span>
                      </div>
                      {dashboardData?.kdvSummary?.kdvRates && Object.entries(dashboardData.kdvSummary.kdvRates).map(([rate, amount]) => (
                        <div key={rate} className="flex items-center justify-between">
                          <span className="text-gray-600">%{rate} KDV</span>
                          <span className="font-medium text-gray-900">
                            {amount?.toLocaleString('tr-TR') || 0} TL
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Muhasebe Modülleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                  href="/admin/accounting/chart-of-accounts"
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <i className="ri-account-book-line text-2xl text-blue-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Hesap Planı</h3>
                      <p className="text-sm text-gray-600">TDHP hesap ağacı yönetimi</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Hesap ekleme, düzenleme ve CSV içe aktarma.
                  </p>
                </Link>

                <Link
                  href="/admin/accounting/journal"
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <i className="ri-file-list-line text-2xl text-green-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Fişler (Yevmiye)</h3>
                      <p className="text-sm text-gray-600">Yevmiye fişi yönetimi</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Fiş oluşturma, kaydetme ve ters kayıt işlemleri.
                  </p>
                </Link>

                <Link
                  href="/admin/accounting/invoices"
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <i className="ri-file-text-line text-2xl text-purple-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Faturalar</h3>
                      <p className="text-sm text-gray-600">Fatura yönetimi</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Satış, alış ve iade faturaları, otomatik fiş.
                  </p>
                </Link>

                <Link
                  href="/admin/accounting/contacts"
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <i className="ri-contacts-line text-2xl text-orange-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Cari</h3>
                      <p className="text-sm text-gray-600">Müşteri ve tedarikçi yönetimi</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Cari hesap kartları, ekstre ve vade takibi.
                  </p>
                </Link>

                <Link
                  href="/admin/accounting/cash-bank"
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                      <i className="ri-bank-line text-2xl text-yellow-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Kasa & Banka</h3>
                      <p className="text-sm text-gray-600">Kasa ve banka işlemleri</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Tahsilat, ödeme ve banka CSV içe aktarma.
                  </p>
                </Link>

                <Link
                  href="/admin/accounting/stock"
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                      <i className="ri-stack-line text-2xl text-indigo-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Stok</h3>
                      <p className="text-sm text-gray-600">Stok ve envanter yönetimi</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Stok giriş/çıkış, ortalama maliyet ve sayım.
                  </p>
                </Link>

                <Link
                  href="/admin/accounting/reports"
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                      <i className="ri-bar-chart-line text-2xl text-red-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Raporlar</h3>
                      <p className="text-sm text-gray-600">Muhasebe raporları</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Mizan, kebir, yevmiye ve hesap ekstresi.
                  </p>
                </Link>

                <Link
                  href="/admin/accounting/period-operations"
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                      <i className="ri-calendar-line text-2xl text-teal-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Dönem İşlemleri</h3>
                      <p className="text-sm text-gray-600">Dönem kilitleme ve kapanış</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Dönem kilitleme ve açılış/kapanış şablonları.
                  </p>
                </Link>

                <Link
                  href="/admin/accounting/efatura"
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                      <i className="ri-file-text-line text-2xl text-emerald-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">E-Fatura</h3>
                      <p className="text-sm text-gray-600">GİB E-Fatura entegrasyonu</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    E-Fatura gönderimi, durum takibi ve PDF indirme.
                  </p>
                </Link>

                <Link
                  href="/admin/accounting/earsiv"
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                      <i className="ri-archive-line text-2xl text-teal-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">E-Arşiv</h3>
                      <p className="text-sm text-gray-600">GİB E-Arşiv entegrasyonu</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    E-Arşiv gönderimi, toplu işlemler ve arşivleme.
                  </p>
                </Link>

                <Link
                  href="/admin/accounting/currency"
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                      <i className="ri-exchange-line text-2xl text-yellow-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Döviz Kurları</h3>
                      <p className="text-sm text-gray-600">TCMB döviz kuru yönetimi</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Otomatik kur güncelleme, çevirici ve alarm sistemi.
                  </p>
                </Link>

                <Link
                  href="/admin/accounting/settings"
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                      <i className="ri-settings-line text-2xl text-gray-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Ayarlar</h3>
                      <p className="text-sm text-gray-600">Sistem ayarları</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    KDV oranları, tevkifat ve sistem ayarları.
                  </p>
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Hızlı Raporlar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <button className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <i className="ri-file-list-line text-2xl text-blue-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Mizan</h3>
                      <p className="text-sm text-gray-600">Genel mizan raporu</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Tüm hesapların borç/alacak bakiyeleri.
                  </p>
                </button>

                <button className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <i className="ri-bar-chart-line text-2xl text-green-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Kebir Defteri</h3>
                      <p className="text-sm text-gray-600">Detaylı hesap hareketleri</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Hesap bazında detaylı hareket listesi.
                  </p>
                </button>

                <button className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <i className="ri-file-text-line text-2xl text-purple-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Yevmiye Defteri</h3>
                      <p className="text-sm text-gray-600">Günlük kayıtlar</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Tarih sırasına göre fiş listesi.
                  </p>
                </button>

                <button className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <i className="ri-contacts-line text-2xl text-orange-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Cari Ekstre</h3>
                      <p className="text-sm text-gray-600">Müşteri/tedarikçi ekstreleri</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Cari hesap detayları ve bakiyeler.
                  </p>
                </button>

                <button className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <i className="ri-calculator-line text-2xl text-red-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">KDV Raporu</h3>
                      <p className="text-sm text-gray-600">KDV hesaplama raporu</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    KDV oranlarına göre detaylı rapor.
                  </p>
                </button>

                <button className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-teal-100 rounded-lg">
                      <i className="ri-calendar-line text-2xl text-teal-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Dönem Raporu</h3>
                      <p className="text-sm text-gray-600">Dönemsel özet rapor</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Belirli dönem için özet bilgiler.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Excel Import Modal */}
        {showExcelImport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Excel İçe Aktar</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İçe Aktarılacak Veri Türü
                  </label>
                  <select
                    value={importType}
                    onChange={(e) => setImportType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="accounts">Hesap Planı</option>
                    <option value="contacts">Cari Hesaplar</option>
                    <option value="journal">Yevmiye Fişleri</option>
                    <option value="invoices">Faturalar</option>
                    <option value="stock">Stok Kartları</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excel Dosyası
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Önemli Notlar:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Excel dosyası .xlsx veya .xls formatında olmalıdır</li>
                    <li>• İlk satır başlık satırı olarak kullanılacaktır</li>
                    <li>• Veri formatları doğru olmalıdır</li>
                    <li>• Büyük dosyalar işlem süresi uzatabilir</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowExcelImport(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleExcelImport}
                  disabled={!excelFile}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                >
                  İçe Aktar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminProtection>
  );
}