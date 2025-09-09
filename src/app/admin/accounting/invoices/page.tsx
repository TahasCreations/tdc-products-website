'use client';

import { useState, useEffect } from 'react';
import AdminProtection from '../../../../components/AdminProtection';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  date: string;
  due_date: string;
  type: 'SALE' | 'PURCHASE' | 'RETURN';
  status: 'DRAFT' | 'POSTED' | 'CANCELLED';
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  kdvsum: number;
  withhold_sum: number;
  contact_id: string;
  lines: InvoiceLine[];
}

interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  kdv_rate: number;
  kdv_amount: number;
  withhold_rate?: number;
  withhold_amount?: number;
  total_line: number;
  stock_id?: string;
}

interface Contact {
  id: string;
  name: string;
  tax_number: string;
  type: 'CUSTOMER' | 'SUPPLIER' | 'OTHER';
}

interface StockItem {
  id: string;
  sku: string;
  name: string;
  unit: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Yeni fatura formu state'leri
  const [newInvoice, setNewInvoice] = useState({
    invoice_number: '',
    customer_name: '',
    date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: 'SALE' as 'SALE' | 'PURCHASE' | 'RETURN',
    contact_id: '',
    lines: [] as Omit<InvoiceLine, 'id'>[]
  });

  useEffect(() => {
    fetchInvoices();
    fetchContacts();
    fetchStockItems();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/accounting/invoices');
      if (!response.ok) {
        throw new Error('Faturalar alınamadı');
      }
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Invoices fetch error:', error);
      setError('Faturalar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/accounting/contacts');
      if (!response.ok) {
        throw new Error('Cari hesaplar alınamadı');
      }
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Contacts fetch error:', error);
    }
  };

  const fetchStockItems = async () => {
    try {
      const response = await fetch('/api/accounting/stock-items');
      if (!response.ok) {
        throw new Error('Stok kalemleri alınamadı');
      }
      const data = await response.json();
      setStockItems(data);
    } catch (error) {
      console.error('Stock items fetch error:', error);
    }
  };

  const handleAddLine = () => {
    setNewInvoice(prev => ({
      ...prev,
      lines: [...prev.lines, {
        description: '',
        quantity: 1,
        unit_price: 0,
        kdv_rate: 20,
        kdv_amount: 0,
        withhold_rate: 0,
        withhold_amount: 0,
        total_line: 0,
        stock_id: ''
      }]
    }));
  };

  const handleRemoveLine = (index: number) => {
    setNewInvoice(prev => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index)
    }));
  };

  const handleLineChange = (index: number, field: string, value: any) => {
    setNewInvoice(prev => ({
      ...prev,
      lines: prev.lines.map((line, i) => {
        if (i === index) {
          const updatedLine = { ...line, [field]: value };
          
          // Otomatik hesaplamalar
          if (field === 'quantity' || field === 'unit_price' || field === 'kdv_rate') {
            const quantity = field === 'quantity' ? value : line.quantity;
            const unitPrice = field === 'unit_price' ? value : line.unit_price;
            const kdvRate = field === 'kdv_rate' ? value : line.kdv_rate;
            
            const subtotal = quantity * unitPrice;
            const kdvAmount = subtotal * (kdvRate / 100);
            const totalLine = subtotal + kdvAmount;
            
            updatedLine.kdv_amount = kdvAmount;
            updatedLine.total_line = totalLine;
          }
          
          return updatedLine;
        }
        return line;
      })
    }));
  };

  const calculateTotals = () => {
    const subtotal = newInvoice.lines.reduce((sum, line) => sum + (line.quantity * line.unit_price), 0);
    const taxAmount = newInvoice.lines.reduce((sum, line) => sum + line.kdv_amount, 0);
    const withholdAmount = newInvoice.lines.reduce((sum, line) => sum + (line.withhold_amount || 0), 0);
    const totalAmount = subtotal + taxAmount - withholdAmount;
    
    return { subtotal, taxAmount, withholdAmount, totalAmount };
  };

  const handleSaveInvoice = async () => {
    if (newInvoice.lines.length === 0) {
      setError('En az bir fatura satırı eklemelisiniz');
      return;
    }

    const { subtotal, taxAmount, withholdAmount, totalAmount } = calculateTotals();

    try {
      const response = await fetch('/api/accounting/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newInvoice,
          subtotal,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          kdvsum: taxAmount,
          withhold_sum: withholdAmount,
          status: 'DRAFT'
        }),
      });

      if (!response.ok) {
        throw new Error('Fatura kaydedilemedi');
      }

      await fetchInvoices();
      setShowAddForm(false);
      setNewInvoice({
        invoice_number: '',
        customer_name: '',
        date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'SALE',
        contact_id: '',
        lines: []
      });
      setError('');
    } catch (error) {
      console.error('Save invoice error:', error);
      setError('Fatura kaydedilirken hata oluştu');
    }
  };

  const handlePostInvoice = async (id: string) => {
    try {
      const response = await fetch(`/api/accounting/invoices/${id}/post`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Fatura kaydedilemedi');
      }

      await fetchInvoices();
    } catch (error) {
      console.error('Post invoice error:', error);
      setError('Fatura kaydedilirken hata oluştu');
    }
  };

  const handleCancelInvoice = async (id: string) => {
    if (!confirm('Bu faturayı iptal etmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/accounting/invoices/${id}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Fatura iptal edilemedi');
      }

      await fetchInvoices();
    } catch (error) {
      console.error('Cancel invoice error:', error);
      setError('Fatura iptal edilirken hata oluştu');
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesType = filterType === 'ALL' || invoice.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || invoice.status === filterStatus;
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const { subtotal, taxAmount, withholdAmount, totalAmount } = calculateTotals();

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Faturalar yükleniyor...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Fatura Yönetimi</h1>
                <p className="mt-2 text-gray-600">Satış, alış ve iade faturaları</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-add-line mr-2"></i>
                  Yeni Fatura
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
                  placeholder="Fatura no veya müşteri adı ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">Tüm Türler</option>
                  <option value="SALE">Satış</option>
                  <option value="PURCHASE">Alış</option>
                  <option value="RETURN">İade</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">Tüm Durumlar</option>
                  <option value="DRAFT">Taslak</option>
                  <option value="POSTED">Kayıtlı</option>
                  <option value="CANCELLED">İptal</option>
                </select>
                <span className="text-sm text-gray-600">
                  Toplam: {filteredInvoices.length} fatura
                </span>
              </div>
            </div>
          </div>

          {/* Yeni Fatura Formu */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Yeni Fatura</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fatura No
                  </label>
                  <input
                    type="text"
                    value={newInvoice.invoice_number}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, invoice_number: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="FAT-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Müşteri/Tedarikçi
                  </label>
                  <select
                    value={newInvoice.contact_id}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, contact_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seçin</option>
                    {contacts.map(contact => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fatura Tarihi
                  </label>
                  <input
                    type="date"
                    value={newInvoice.date}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vade Tarihi
                  </label>
                  <input
                    type="date"
                    value={newInvoice.due_date}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, due_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fatura Türü
                </label>
                <div className="flex space-x-4">
                  {['SALE', 'PURCHASE', 'RETURN'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        value={type}
                        checked={newInvoice.type === type}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, type: e.target.value as any }))}
                        className="mr-2"
                      />
                      <span className="text-sm">
                        {type === 'SALE' ? 'Satış' : type === 'PURCHASE' ? 'Alış' : 'İade'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fatura Satırları */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Fatura Satırları</h3>
                  <button
                    onClick={handleAddLine}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i className="ri-add-line mr-1"></i>
                    Satır Ekle
                  </button>
                </div>

                {newInvoice.lines.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Açıklama
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Miktar
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Birim Fiyat
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            KDV %
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            KDV Tutarı
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Toplam
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlem
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {newInvoice.lines.map((line, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={line.description}
                                onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ürün/hizmet açıklaması"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                step="0.01"
                                value={line.quantity}
                                onChange={(e) => handleLineChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="1"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                step="0.01"
                                value={line.unit_price}
                                onChange={(e) => handleLineChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={line.kdv_rate}
                                onChange={(e) => handleLineChange(index, 'kdv_rate', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value={0}>%0</option>
                                <option value={1}>%1</option>
                                <option value={10}>%10</option>
                                <option value={20}>%20</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                step="0.01"
                                value={line.kdv_amount}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                placeholder="0.00"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                step="0.01"
                                value={line.total_line}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
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
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ara Toplam:</span>
                        <span className="font-semibold">{subtotal.toLocaleString('tr-TR')} TL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">KDV Toplamı:</span>
                        <span className="font-semibold">{taxAmount.toLocaleString('tr-TR')} TL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tevkifat:</span>
                        <span className="font-semibold">{withholdAmount.toLocaleString('tr-TR')} TL</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-900 font-semibold">Genel Toplam:</span>
                        <span className="font-bold text-lg">{totalAmount.toLocaleString('tr-TR')} TL</span>
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
                  onClick={handleSaveInvoice}
                  disabled={newInvoice.lines.length === 0}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  Taslak Olarak Kaydet
                </button>
              </div>
            </div>
          )}

          {/* Faturalar Listesi */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Faturalar</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fatura No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Müşteri/Tedarikçi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tür
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Toplam
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
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.invoice_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {invoice.customer_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(invoice.date).toLocaleDateString('tr-TR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          invoice.type === 'SALE' ? 'bg-green-100 text-green-800' :
                          invoice.type === 'PURCHASE' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.type === 'SALE' ? 'Satış' : 
                           invoice.type === 'PURCHASE' ? 'Alış' : 'İade'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.total_amount?.toLocaleString('tr-TR')} TL
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          invoice.status === 'POSTED' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status === 'POSTED' ? 'Kayıtlı' :
                           invoice.status === 'DRAFT' ? 'Taslak' : 'İptal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {invoice.status === 'DRAFT' && (
                            <button
                              onClick={() => handlePostInvoice(invoice.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Kaydet"
                            >
                              <i className="ri-check-line"></i>
                            </button>
                          )}
                          {invoice.status === 'POSTED' && (
                            <button
                              onClick={() => handleCancelInvoice(invoice.id)}
                              className="text-red-600 hover:text-red-900"
                              title="İptal Et"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          )}
                          <button
                            onClick={() => setEditingInvoice(invoice)}
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
