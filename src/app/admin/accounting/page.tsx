'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminProtection from '../../../components/AdminProtection';

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

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Muhasebe verileri yükleniyor...</p>
          </div>
        </div>
      </AdminProtection>
    );
  }

  if (error) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Muhasebe Sistemi</h1>
                <p className="mt-2 text-gray-600">Gelişmiş muhasebe yönetimi ve raporlama</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Özet Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
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

            <div className="bg-white rounded-lg shadow-sm border p-6">
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

            <div className="bg-white rounded-lg shadow-sm border p-6">
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

            <div className="bg-white rounded-lg shadow-sm border p-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Son Yevmiye Fişleri */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
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

            {/* KDV Özeti */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
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

          {/* Alt Modül Linkleri */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Muhasebe Modülleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                href="/admin/accounting/chart-of-accounts"
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
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
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
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
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
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
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
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
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
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
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
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
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
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
                href="/admin/accounting/periods"
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
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
                href="/admin/accounting/settings"
                className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
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
                  KDV oranları, tevkifat ve e-Fatura ayarları.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminProtection>
  );
}