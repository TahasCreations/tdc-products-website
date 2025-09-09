'use client';

import { useState, useEffect } from 'react';
import AdminProtection from '../../../../components/AdminProtection';

interface Contact {
  id: string;
  name: string;
  tax_number: string;
  type: 'CUSTOMER' | 'SUPPLIER' | 'OTHER';
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  created_at: string;
  balance?: number;
  last_transaction_date?: string;
}

interface ContactTransaction {
  id: string;
  date: string;
  type: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reference: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactTransactions, setContactTransactions] = useState<ContactTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'detail' | 'statement'>('list');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Yeni cari formu state'leri
  const [newContact, setNewContact] = useState({
    name: '',
    tax_number: '',
    type: 'CUSTOMER' as 'CUSTOMER' | 'SUPPLIER' | 'OTHER',
    address: '',
    phone: '',
    email: '',
    is_active: true
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/accounting/contacts');
      if (!response.ok) {
        throw new Error('Cari hesaplar alınamadı');
      }
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Contacts fetch error:', error);
      setError('Cari hesaplar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchContactTransactions = async (contactId: string) => {
    try {
      const response = await fetch(`/api/accounting/contacts/${contactId}/transactions`);
      if (!response.ok) {
        throw new Error('Cari hareketler alınamadı');
      }
      const data = await response.json();
      setContactTransactions(data);
    } catch (error) {
      console.error('Contact transactions fetch error:', error);
      setError('Cari hareketler yüklenirken hata oluştu');
    }
  };

  const handleAddContact = async () => {
    try {
      const response = await fetch('/api/accounting/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) {
        throw new Error('Cari hesap eklenemedi');
      }

      await fetchContacts();
      setShowAddForm(false);
      setNewContact({
        name: '',
        tax_number: '',
        type: 'CUSTOMER',
        address: '',
        phone: '',
        email: '',
        is_active: true
      });
      setError('');
    } catch (error) {
      console.error('Add contact error:', error);
      setError('Cari hesap eklenirken hata oluştu');
    }
  };

  const handleEditContact = async (id: string, contactData: Partial<Contact>) => {
    try {
      const response = await fetch(`/api/accounting/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        throw new Error('Cari hesap güncellenemedi');
      }

      await fetchContacts();
      setEditingContact(null);
    } catch (error) {
      console.error('Edit contact error:', error);
      setError('Cari hesap güncellenirken hata oluştu');
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Bu cari hesabı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/accounting/contacts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Cari hesap silinemedi');
      }

      await fetchContacts();
    } catch (error) {
      console.error('Delete contact error:', error);
      setError('Cari hesap silinirken hata oluştu');
    }
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setActiveTab('detail');
    fetchContactTransactions(contact.id);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesType = filterType === 'ALL' || contact.type === filterType;
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.tax_number.includes(searchTerm) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cari hesaplar yükleniyor...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Cari Hesap Yönetimi</h1>
                <p className="mt-2 text-gray-600">Müşteri ve tedarikçi kartları</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-add-line mr-2"></i>
                  Yeni Cari
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
                  onClick={() => setActiveTab('list')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'list'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-list-check mr-2"></i>
                  Cari Listesi
                </button>
                {selectedContact && (
                  <>
                    <button
                      onClick={() => setActiveTab('detail')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'detail'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <i className="ri-user-line mr-2"></i>
                      Cari Detayı
                    </button>
                    <button
                      onClick={() => setActiveTab('statement')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'statement'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <i className="ri-file-list-line mr-2"></i>
                      Cari Ekstre
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>

          {/* Cari Listesi Tab */}
          {activeTab === 'list' && (
            <>
              {/* Filtreler */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Ad, vergi no veya e-posta ile ara..."
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
                      <option value="CUSTOMER">Müşteri</option>
                      <option value="SUPPLIER">Tedarikçi</option>
                      <option value="OTHER">Diğer</option>
                    </select>
                    <span className="text-sm text-gray-600">
                      Toplam: {filteredContacts.length} cari
                    </span>
                  </div>
                </div>
              </div>

              {/* Yeni Cari Formu */}
              {showAddForm && (
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Yeni Cari Hesap</h2>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <i className="ri-close-line text-xl"></i>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad/Unvan *
                      </label>
                      <input
                        type="text"
                        value={newContact.name}
                        onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Şirket adı veya kişi adı"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vergi No
                      </label>
                      <input
                        type="text"
                        value={newContact.tax_number}
                        onChange={(e) => setNewContact(prev => ({ ...prev, tax_number: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1234567890"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tür *
                      </label>
                      <select
                        value={newContact.type}
                        onChange={(e) => setNewContact(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="CUSTOMER">Müşteri</option>
                        <option value="SUPPLIER">Tedarikçi</option>
                        <option value="OTHER">Diğer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta
                      </label>
                      <input
                        type="email"
                        value={newContact.email}
                        onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ornek@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={newContact.phone}
                        onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+90 555 123 4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adres
                      </label>
                      <textarea
                        value={newContact.address}
                        onChange={(e) => setNewContact(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Tam adres bilgisi"
                      />
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
                      onClick={handleAddContact}
                      disabled={!newContact.name.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                    >
                      Kaydet
                    </button>
                  </div>
                </div>
              )}

              {/* Cari Listesi */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Cari Hesaplar</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ad/Unvan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vergi No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tür
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          E-posta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Telefon
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
                      {filteredContacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {contact.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {contact.tax_number || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              contact.type === 'CUSTOMER' ? 'bg-green-100 text-green-800' :
                              contact.type === 'SUPPLIER' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {contact.type === 'CUSTOMER' ? 'Müşteri' : 
                               contact.type === 'SUPPLIER' ? 'Tedarikçi' : 'Diğer'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {contact.email || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {contact.phone || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              contact.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {contact.is_active ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleContactSelect(contact)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Detay"
                              >
                                <i className="ri-eye-line"></i>
                              </button>
                              <button
                                onClick={() => setEditingContact(contact)}
                                className="text-green-600 hover:text-green-900"
                                title="Düzenle"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteContact(contact.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Sil"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Cari Detayı Tab */}
          {activeTab === 'detail' && selectedContact && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{selectedContact.name}</h2>
                <button
                  onClick={() => setActiveTab('list')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-arrow-left-line text-xl"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Genel Bilgiler</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Ad/Unvan:</span>
                      <p className="text-sm text-gray-900">{selectedContact.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Vergi No:</span>
                      <p className="text-sm text-gray-900">{selectedContact.tax_number || '-'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Tür:</span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        selectedContact.type === 'CUSTOMER' ? 'bg-green-100 text-green-800' :
                        selectedContact.type === 'SUPPLIER' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedContact.type === 'CUSTOMER' ? 'Müşteri' : 
                         selectedContact.type === 'SUPPLIER' ? 'Tedarikçi' : 'Diğer'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">E-posta:</span>
                      <p className="text-sm text-gray-900">{selectedContact.email || '-'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Telefon:</span>
                      <p className="text-sm text-gray-900">{selectedContact.phone || '-'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Adres:</span>
                      <p className="text-sm text-gray-900">{selectedContact.address || '-'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Hesap Bilgileri</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Durum:</span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        selectedContact.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedContact.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Kayıt Tarihi:</span>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedContact.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Son İşlem:</span>
                      <p className="text-sm text-gray-900">
                        {selectedContact.last_transaction_date 
                          ? new Date(selectedContact.last_transaction_date).toLocaleDateString('tr-TR')
                          : 'Henüz işlem yok'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Bakiye:</span>
                      <p className={`text-sm font-semibold ${
                        (selectedContact.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(selectedContact.balance || 0).toLocaleString('tr-TR')} TL
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center space-x-4">
                <button
                  onClick={() => setActiveTab('statement')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-file-list-line mr-2"></i>
                  Cari Ekstre Görüntüle
                </button>
                <button
                  onClick={() => setEditingContact(selectedContact)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-edit-line mr-2"></i>
                  Düzenle
                </button>
              </div>
            </div>
          )}

          {/* Cari Ekstre Tab */}
          {activeTab === 'statement' && selectedContact && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedContact.name} - Cari Ekstre
                </h2>
                <button
                  onClick={() => setActiveTab('detail')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-arrow-left-line text-xl"></i>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tür
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Açıklama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referans
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Borç
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alacak
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bakiye
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contactTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.reference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {transaction.debit > 0 ? transaction.debit.toLocaleString('tr-TR') : '-'} TL
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {transaction.credit > 0 ? transaction.credit.toLocaleString('tr-TR') : '-'} TL
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          <span className={`font-semibold ${
                            transaction.balance >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.balance.toLocaleString('tr-TR')} TL
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
