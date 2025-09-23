'use client';

import { useState, useEffect } from 'react';
import { 
  CalculatorIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  BanknotesIcon,
  CogIcon,
  ReceiptPercentIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

export default function AdvancedAccountingSystem() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: ChartBarIcon },
    { id: 'invoices', name: 'Faturalar', icon: DocumentTextIcon },
    { id: 'expenses', name: 'Giderler', icon: BanknotesIcon },
    { id: 'taxes', name: 'Vergiler', icon: ReceiptPercentIcon },
    { id: 'reports', name: 'Raporlar', icon: ClipboardDocumentListIcon },
    { id: 'chart', name: 'Hesap Planı', icon: BuildingOfficeIcon },
    { id: 'reconciliation', name: 'Mutabakat', icon: CalculatorIcon },
    { id: 'settings', name: 'Ayarlar', icon: CogIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Toplam Gelir</h4>
                <p className="text-3xl font-bold text-green-600">₺2,450,000</p>
                <p className="text-sm text-green-700">+12% bu ay</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Toplam Gider</h4>
                <p className="text-3xl font-bold text-red-600">₺1,890,000</p>
                <p className="text-sm text-red-700">+8% bu ay</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Net Kar</h4>
                <p className="text-3xl font-bold text-blue-600">₺560,000</p>
                <p className="text-sm text-blue-700">+18% artış</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">KDV Ödemesi</h4>
                <p className="text-3xl font-bold text-yellow-600">₺441,000</p>
                <p className="text-sm text-yellow-700">Bu ay</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aylık Gelir Trendi</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Aralık 2024</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
                      </div>
                      <span className="text-sm font-semibold">₺2.45M</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Kasım 2024</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <span className="text-sm font-semibold">₺2.08M</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ekim 2024</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '78%'}}></div>
                      </div>
                      <span className="text-sm font-semibold">₺1.91M</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vergi Durumu</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-800">KDV Ödemesi</span>
                    <span className="text-sm font-semibold text-green-600">Güncel</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm text-yellow-800">Kurumlar Vergisi</span>
                    <span className="text-sm font-semibold text-yellow-600">Beklemede</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-800">Stopaj</span>
                    <span className="text-sm font-semibold text-blue-600">Hesaplanıyor</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Muhasebe Hareketleri</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Açıklama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hesap
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Borç
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alacak
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bakiye
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        15 Aralık 2024
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Müşteri Ödemesi
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        120.01.001
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        ₺45,000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₺2,450,000
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        14 Aralık 2024
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Ofis Kira
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        770.01.001
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                        ₺25,000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₺1,890,000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'invoices':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Fatura Yönetimi</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Yeni Fatura Oluştur
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Toplam Fatura</h4>
                <p className="text-3xl font-bold text-blue-600">1,247</p>
                <p className="text-sm text-blue-700">Bu ay</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Ödenen</h4>
                <p className="text-3xl font-bold text-green-600">1,189</p>
                <p className="text-sm text-green-700">%95.3 oran</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Bekleyen</h4>
                <p className="text-3xl font-bold text-yellow-600">58</p>
                <p className="text-sm text-yellow-700">%4.7 oran</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Gecikmiş</h4>
                <p className="text-3xl font-bold text-red-600">12</p>
                <p className="text-sm text-red-700">%1.0 oran</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Son Faturalar</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fatura No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Müşteri
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tutar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vade
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
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #FT-2024-001
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Ahmet Yılmaz
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₺2,450
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        15 Aralık 2024
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        30 Aralık 2024
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Ödendi
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Görüntüle</button>
                        <button className="text-green-600 hover:text-green-900">Yazdır</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #FT-2024-002
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Elif Kaya
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₺1,890
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        14 Aralık 2024
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        29 Aralık 2024
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Bekleyen
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Görüntüle</button>
                        <button className="text-green-600 hover:text-green-900">Hatırlat</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'expenses':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Gider Yönetimi</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Yeni Gider Ekle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Toplam Gider</h4>
                <p className="text-3xl font-bold text-red-600">₺1,890,000</p>
                <p className="text-sm text-red-700">Bu ay</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Personel</h4>
                <p className="text-3xl font-bold text-orange-600">₺850,000</p>
                <p className="text-sm text-orange-700">%45 pay</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Operasyonel</h4>
                <p className="text-3xl font-bold text-yellow-600">₺567,000</p>
                <p className="text-sm text-yellow-700">%30 pay</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Pazarlama</h4>
                <p className="text-3xl font-bold text-purple-600">₺283,500</p>
                <p className="text-sm text-purple-700">%15 pay</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Gider Kategorileri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-semibold text-red-900 mb-2">Personel Giderleri</h5>
                  <p className="text-2xl font-bold text-red-600">₺850,000</p>
                  <p className="text-sm text-red-700">Maaş, prim, sosyal haklar</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-semibold text-orange-900 mb-2">Ofis Giderleri</h5>
                  <p className="text-2xl font-bold text-orange-600">₺300,000</p>
                  <p className="text-sm text-orange-700">Kira, elektrik, internet</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-semibold text-yellow-900 mb-2">Pazarlama</h5>
                  <p className="text-2xl font-bold text-yellow-600">₺283,500</p>
                  <p className="text-sm text-yellow-700">Reklam, promosyon</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-900 mb-2">Teknoloji</h5>
                  <p className="text-2xl font-bold text-green-600">₺150,000</p>
                  <p className="text-sm text-green-700">Yazılım, donanım</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">Ulaştırma</h5>
                  <p className="text-2xl font-bold text-blue-600">₺117,000</p>
                  <p className="text-sm text-blue-700">Kargo, yakıt</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-semibold text-purple-900 mb-2">Diğer</h5>
                  <p className="text-2xl font-bold text-purple-600">₺189,500</p>
                  <p className="text-sm text-purple-700">Çeşitli giderler</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'taxes':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Vergi Yönetimi</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Vergi Beyannamesi
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">KDV Ödemesi</h4>
                <p className="text-3xl font-bold text-yellow-600">₺441,000</p>
                <p className="text-sm text-yellow-700">Bu ay</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Kurumlar Vergisi</h4>
                <p className="text-3xl font-bold text-blue-600">₺140,000</p>
                <p className="text-sm text-blue-700">Bu ay</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Stopaj</h4>
                <p className="text-3xl font-bold text-green-600">₺85,000</p>
                <p className="text-sm text-green-700">Bu ay</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Toplam Vergi</h4>
                <p className="text-3xl font-bold text-purple-600">₺666,000</p>
                <p className="text-sm text-purple-700">Bu ay</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Vergi Ödemeleri</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-900">KDV Ödemesi</p>
                      <p className="text-sm text-yellow-700">Son ödeme: 15 Aralık</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Güncel</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Kurumlar Vergisi</p>
                      <p className="text-sm text-blue-700">Son ödeme: 30 Kasım</p>
                    </div>
                    <span className="text-sm text-yellow-600 font-medium">Beklemede</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Stopaj</p>
                      <p className="text-sm text-green-700">Son ödeme: 10 Aralık</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Güncel</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Vergi Oranları</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">KDV Oranı</span>
                    <span className="font-semibold">%18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Kurumlar Vergisi</span>
                    <span className="font-semibold">%20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Stopaj Oranı</span>
                    <span className="font-semibold">%20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gelir Vergisi</span>
                    <span className="font-semibold">%15-35</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{tabs.find(tab => tab.id === activeTab)?.name}</h3>
            <p className="text-gray-600">Bu modül geliştirilme aşamasındadır.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Muhasebe Sistemi</h2>
          <p className="text-sm text-gray-500 mt-1">Muhasebe ve finansal raporlama</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">Sistem Aktif</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {renderTabContent()}
      </div>
    </div>
  );
}
