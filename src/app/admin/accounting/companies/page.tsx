'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import AdminProtection from '../../../../components/AdminProtection';
import { 
  BuildingOfficeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CogIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface Company {
  id: string;
  name: string;
  taxNumber: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  currency: string;
  fiscalYear: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
  totalTransactions: number;
  totalRevenue: number;
  employees: number;
  logo?: string;
}

interface CompanyFormData {
  name: string;
  taxNumber: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  currency: string;
  fiscalYear: string;
}

export default function CompaniesManagement() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    taxNumber: '',
    address: '',
    city: '',
    country: 'Türkiye',
    phone: '',
    email: '',
    website: '',
    currency: 'TRY',
    fiscalYear: '2024'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Mock data
  useEffect(() => {
    const mockCompanies: Company[] = [
      {
        id: '1',
        name: 'TDC Products A.Ş.',
        taxNumber: '1234567890',
        address: 'Maslak Mahallesi, Büyükdere Caddesi No:123',
        city: 'İstanbul',
        country: 'Türkiye',
        phone: '+90 212 555 0123',
        email: 'info@tdcproducts.com',
        website: 'https://tdcproducts.com',
        currency: 'TRY',
        fiscalYear: '2024',
        isActive: true,
        createdAt: '2023-01-15',
        lastLogin: '2024-01-15',
        totalTransactions: 1250,
        totalRevenue: 1250000,
        employees: 25
      },
      {
        id: '2',
        name: 'TDC International Ltd.',
        taxNumber: '9876543210',
        address: '123 Business Street, London',
        city: 'London',
        country: 'United Kingdom',
        phone: '+44 20 7946 0958',
        email: 'info@tdcinternational.com',
        website: 'https://tdcinternational.com',
        currency: 'GBP',
        fiscalYear: '2024',
        isActive: true,
        createdAt: '2023-06-10',
        lastLogin: '2024-01-14',
        totalTransactions: 890,
        totalRevenue: 850000,
        employees: 15
      },
      {
        id: '3',
        name: 'TDC Europe GmbH',
        taxNumber: 'DE123456789',
        address: '456 Innovation Avenue, Berlin',
        city: 'Berlin',
        country: 'Germany',
        phone: '+49 30 12345678',
        email: 'info@tdceurope.com',
        website: 'https://tdceurope.com',
        currency: 'EUR',
        fiscalYear: '2024',
        isActive: false,
        createdAt: '2023-09-20',
        lastLogin: '2023-12-15',
        totalTransactions: 450,
        totalRevenue: 320000,
        employees: 8
      }
    ];

    setCompanies(mockCompanies);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.taxNumber.includes(searchTerm) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && company.isActive) ||
                         (filterStatus === 'inactive' && !company.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCompany) {
      // Update existing company
      setCompanies(companies.map(company => 
        company.id === editingCompany.id 
          ? { ...company, ...formData }
          : company
      ));
    } else {
      // Add new company
      const newCompany: Company = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString().split('T')[0],
        totalTransactions: 0,
        totalRevenue: 0,
        employees: 0
      };
      setCompanies([...companies, newCompany]);
    }
    
    setShowModal(false);
    setEditingCompany(null);
    setFormData({
      name: '',
      taxNumber: '',
      address: '',
      city: '',
      country: 'Türkiye',
      phone: '',
      email: '',
      website: '',
      currency: 'TRY',
      fiscalYear: '2024'
    });
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      taxNumber: company.taxNumber,
      address: company.address,
      city: company.city,
      country: company.country,
      phone: company.phone,
      email: company.email,
      website: company.website,
      currency: company.currency,
      fiscalYear: company.fiscalYear
    });
    setShowModal(true);
  };

  const handleDelete = (companyId: string) => {
    if (confirm('Bu şirketi silmek istediğinizden emin misiniz?')) {
      setCompanies(companies.filter(company => company.id !== companyId));
    }
  };

  const toggleCompanyStatus = (companyId: string) => {
    setCompanies(companies.map(company => 
      company.id === companyId 
        ? { ...company, isActive: !company.isActive }
        : company
    ));
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Şirket Yönetimi</h1>
                <p className="mt-2 text-gray-600">Çoklu şirket muhasebe sistemi</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Yeni Şirket
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
                <input
                  type="text"
                  placeholder="Şirket adı, vergi no, e-posta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tümü</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Filtrele
                </button>
              </div>
            </div>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div key={company.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Company Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                        <p className="text-sm text-gray-500">{company.taxNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleCompanyStatus(company.id)}
                        className={`p-1 rounded-full ${
                          company.isActive 
                            ? 'text-green-600 hover:bg-green-100' 
                            : 'text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {company.isActive ? (
                          <CheckCircleIcon className="w-5 h-5" />
                        ) : (
                          <XCircleIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      {company.city}, {company.country}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      {company.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="w-4 h-4 mr-2" />
                      {company.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <GlobeAltIcon className="w-4 h-4 mr-2" />
                      {company.website}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{company.totalTransactions}</p>
                      <p className="text-xs text-gray-500">İşlem</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(company.totalRevenue, company.currency)}
                      </p>
                      <p className="text-xs text-gray-500">Gelir</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(company)}
                      className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Şirket bulunamadı</h3>
              <p className="text-gray-500">Arama kriterlerinize uygun şirket bulunmuyor.</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {editingCompany ? 'Şirket Düzenle' : 'Yeni Şirket Ekle'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Adı *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Numarası *</label>
                      <input
                        type="text"
                        required
                        value={formData.taxNumber}
                        onChange={(e) => setFormData({...formData, taxNumber: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Şehir *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ülke *</label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Para Birimi *</label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="TRY">TRY - Türk Lirası</option>
                        <option value="USD">USD - Amerikan Doları</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - İngiliz Sterlini</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mali Yıl</label>
                      <input
                        type="text"
                        value={formData.fiscalYear}
                        onChange={(e) => setFormData({...formData, fiscalYear: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingCompany(null);
                        setFormData({
                          name: '',
                          taxNumber: '',
                          address: '',
                          city: '',
                          country: 'Türkiye',
                          phone: '',
                          email: '',
                          website: '',
                          currency: 'TRY',
                          fiscalYear: '2024'
                        });
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {editingCompany ? 'Güncelle' : 'Ekle'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminProtection>
  );
}

