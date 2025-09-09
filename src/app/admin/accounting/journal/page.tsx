'use client';

import { useState, useEffect } from 'react';
import AdminProtection from '../../../../components/AdminProtection';

interface JournalEntry {
  id: string;
  no: string;
  description: string;
  date: string;
  period: string;
  status: 'DRAFT' | 'POSTED' | 'REVERSED';
  total_debit: number;
  total_credit: number;
  created_at: string;
  lines: JournalLine[];
}

interface JournalLine {
  id: string;
  account_id: string;
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  description: string;
}

interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
}

export default function JournalPage() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Yeni fiş formu state'leri
  const [newEntry, setNewEntry] = useState({
    no: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    period: new Date().toISOString().substring(0, 7),
    lines: [] as Omit<JournalLine, 'id' | 'account_code' | 'account_name'>[]
  });

  useEffect(() => {
    fetchJournalEntries();
    fetchAccounts();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/accounting/journal');
      if (!response.ok) {
        throw new Error('Yevmiye fişleri alınamadı');
      }
      const data = await response.json();
      setJournalEntries(data);
    } catch (error) {
      console.error('Journal entries fetch error:', error);
      setError('Yevmiye fişleri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounting/accounts');
      if (!response.ok) {
        throw new Error('Hesaplar alınamadı');
      }
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Accounts fetch error:', error);
    }
  };

  const handleAddLine = () => {
    setNewEntry(prev => ({
      ...prev,
      lines: [...prev.lines, {
        account_id: '',
        debit: 0,
        credit: 0,
        description: ''
      }]
    }));
  };

  const handleRemoveLine = (index: number) => {
    setNewEntry(prev => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index)
    }));
  };

  const handleLineChange = (index: number, field: string, value: any) => {
    setNewEntry(prev => ({
      ...prev,
      lines: prev.lines.map((line, i) => 
        i === index ? { ...line, [field]: value } : line
      )
    }));
  };

  const calculateTotals = () => {
    const totalDebit = newEntry.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = newEntry.lines.reduce((sum, line) => sum + (line.credit || 0), 0);
    return { totalDebit, totalCredit };
  };

  const handleSaveEntry = async () => {
    const { totalDebit, totalCredit } = calculateTotals();
    
    if (totalDebit !== totalCredit) {
      setError('Borç ve alacak toplamları eşit olmalıdır');
      return;
    }

    if (newEntry.lines.length === 0) {
      setError('En az bir fiş satırı eklemelisiniz');
      return;
    }

    try {
      const response = await fetch('/api/accounting/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newEntry,
          total_debit: totalDebit,
          total_credit: totalCredit,
          status: 'DRAFT'
        }),
      });

      if (!response.ok) {
        throw new Error('Yevmiye fişi kaydedilemedi');
      }

      await fetchJournalEntries();
      setShowAddForm(false);
      setNewEntry({
        no: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        period: new Date().toISOString().substring(0, 7),
        lines: []
      });
      setError('');
    } catch (error) {
      console.error('Save entry error:', error);
      setError('Yevmiye fişi kaydedilirken hata oluştu');
    }
  };

  const handlePostEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/accounting/journal/${id}/post`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Fiş kaydedilemedi');
      }

      await fetchJournalEntries();
    } catch (error) {
      console.error('Post entry error:', error);
      setError('Fiş kaydedilirken hata oluştu');
    }
  };

  const handleReverseEntry = async (id: string) => {
    if (!confirm('Bu fişi ters kayıt yapmak istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/accounting/journal/${id}/reverse`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Fiş ters kayıt edilemedi');
      }

      await fetchJournalEntries();
    } catch (error) {
      console.error('Reverse entry error:', error);
      setError('Fiş ters kayıt edilirken hata oluştu');
    }
  };

  const filteredEntries = journalEntries.filter(entry => {
    const matchesStatus = filterStatus === 'ALL' || entry.status === filterStatus;
    const matchesSearch = entry.no.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const { totalDebit, totalCredit } = calculateTotals();
  const isBalanced = totalDebit === totalCredit;

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yevmiye fişleri yükleniyor...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Yevmiye Fişleri</h1>
                <p className="mt-2 text-gray-600">Muhasebe fişi yönetimi ve kayıt işlemleri</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-add-line mr-2"></i>
                  Yeni Fiş
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filtreler */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Fiş no veya açıklama ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">Tüm Durumlar</option>
                  <option value="DRAFT">Taslak</option>
                  <option value="POSTED">Kayıtlı</option>
                  <option value="REVERSED">Ters Kayıt</option>
                </select>
                <span className="text-sm text-gray-600">
                  Toplam: {filteredEntries.length} fiş
                </span>
              </div>
            </div>
          </div>

          {/* Yeni Fiş Formu */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Yeni Yevmiye Fişi</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiş No
                  </label>
                  <input
                    type="text"
                    value={newEntry.no}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, no: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="YF-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarih
                  </label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dönem
                  </label>
                  <input
                    type="month"
                    value={newEntry.period}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, period: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={newEntry.description}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Fiş açıklaması..."
                />
              </div>

              {/* Fiş Satırları */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Fiş Satırları</h3>
                  <button
                    onClick={handleAddLine}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i className="ri-add-line mr-1"></i>
                    Satır Ekle
                  </button>
                </div>

                {newEntry.lines.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hesap
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Açıklama
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Borç
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Alacak
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlem
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {newEntry.lines.map((line, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3">
                              <select
                                value={line.account_id}
                                onChange={(e) => handleLineChange(index, 'account_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Hesap Seçin</option>
                                {accounts.map(account => (
                                  <option key={account.id} value={account.id}>
                                    {account.code} - {account.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={line.description}
                                onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Satır açıklaması"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                step="0.01"
                                value={line.debit}
                                onChange={(e) => handleLineChange(index, 'debit', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                step="0.01"
                                value={line.credit}
                                onChange={(e) => handleLineChange(index, 'credit', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleRemoveLine(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Toplamlar */}
                <div className="mt-4 flex justify-end">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-6">
                      <div className="text-sm">
                        <span className="text-gray-600">Toplam Borç: </span>
                        <span className={`font-semibold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                          {totalDebit.toLocaleString('tr-TR')} TL
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Toplam Alacak: </span>
                        <span className={`font-semibold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                          {totalCredit.toLocaleString('tr-TR')} TL
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Fark: </span>
                        <span className={`font-semibold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                          {(totalDebit - totalCredit).toLocaleString('tr-TR')} TL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveEntry}
                  disabled={!isBalanced || newEntry.lines.length === 0}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  Taslak Olarak Kaydet
                </button>
              </div>
            </div>
          )}

          {/* Fişler Listesi */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Yevmiye Fişleri</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fiş No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
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
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {entry.no}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(entry.date).toLocaleDateString('tr-TR')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {entry.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {entry.total_debit?.toLocaleString('tr-TR')} TL
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {entry.total_credit?.toLocaleString('tr-TR')} TL
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          entry.status === 'POSTED' ? 'bg-green-100 text-green-800' :
                          entry.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {entry.status === 'POSTED' ? 'Kayıtlı' :
                           entry.status === 'DRAFT' ? 'Taslak' : 'Ters Kayıt'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {entry.status === 'DRAFT' && (
                            <button
                              onClick={() => handlePostEntry(entry.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Kaydet"
                            >
                              <i className="ri-check-line"></i>
                            </button>
                          )}
                          {entry.status === 'POSTED' && (
                            <button
                              onClick={() => handleReverseEntry(entry.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Ters Kayıt"
                            >
                              <i className="ri-arrow-go-back-line"></i>
                            </button>
                          )}
                          <button
                            onClick={() => setEditingEntry(entry)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Düzenle"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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
