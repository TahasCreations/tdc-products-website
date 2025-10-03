"use client";

import { useState, useEffect } from 'react';

interface PayoutEntry {
  id: string;
  amount: number;
  currency: string;
  createdAt: string;
  meta?: {
    method: string;
    reference: string;
  };
}

export default function PayoutsReportPage() {
  const [entries, setEntries] = useState<PayoutEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    setStartDate(lastMonth.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
    
    fetchData(lastMonth, today);
  }, []);

  const fetchData = async (start: Date, end: Date) => {
    setLoading(true);
    try {
      // Mock data - gerçek uygulamada API'den gelecek
      setEntries([
        {
          id: '1',
          amount: 1500.00,
          currency: 'TRY',
          createdAt: '2024-01-15T10:00:00Z',
          meta: { method: 'IBAN', reference: 'PAY-001' }
        },
        {
          id: '2',
          amount: 750.50,
          currency: 'TRY',
          createdAt: '2024-01-10T15:30:00Z',
          meta: { method: 'IBAN', reference: 'PAY-002' }
        }
      ]);
    } catch (error) {
      console.error('Error fetching payouts data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = () => {
    if (startDate && endDate) {
      fetchData(new Date(startDate), new Date(endDate));
    }
  };

  const handleExport = () => {
    const csvData = entries.map(entry => ({
      'Tarih': new Date(entry.createdAt).toLocaleDateString('tr-TR'),
      'Tutar': entry.amount,
      'Para Birimi': entry.currency,
      'Yöntem': entry.meta?.method || '',
      'Referans': entry.meta?.reference || ''
    }));
    
    const csv = generateCSV(csvData, 'payouts-report');
    const link = document.createElement('a');
    link.href = csv;
    link.download = `payouts-report-${startDate}-${endDate}.csv`;
    link.click();
  };

  const generateCSV = (data: any[], filename: string) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    return `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
  };

  const totalPayouts = entries.reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ödeme Raporları</h1>
      
      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Toplam Ödeme</h3>
          <p className="text-2xl font-bold text-green-600">₺{totalPayouts.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Ödeme Sayısı</h3>
          <p className="text-2xl font-bold text-blue-600">{entries.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Ortalama Ödeme</h3>
          <p className="text-2xl font-bold text-purple-600">
            ₺{entries.length > 0 ? (totalPayouts / entries.length).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h2 className="text-lg font-semibold mb-4">Tarih Filtresi</h2>
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleDateChange}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Filtrele
            </button>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              CSV İndir
            </button>
          </div>
        </div>
      </div>

      {/* Entries Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Ödeme Detayları</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yöntem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referans
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(entry.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ₺{entry.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.meta?.method || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.meta?.reference || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
