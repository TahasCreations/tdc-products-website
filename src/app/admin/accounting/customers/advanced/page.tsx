'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import AdminProtection from '../../../../../components/AdminProtection';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface Customer {
  id: string;
  code: string;
  name: string;
  taxNumber: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  phone: string;
  email: string;
  type: 'individual' | 'corporate';
  status: 'active' | 'inactive' | 'blocked';
  creditLimit: number;
  currentBalance: number;
  paymentTerms: number;
  currency: string;
  riskScore: number;
  lastPurchaseDate?: string;
  totalPurchases: number;
  averageOrderValue: number;
  createdAt: string;
  updatedAt: string;
}

interface CustomerSummary {
  totalCustomers: number;
  activeCustomers: number;
  totalReceivables: number;
  averageCreditLimit: number;
  highRiskCustomers: number;
  newCustomersThisMonth: number;
}

export default function AdvancedCustomers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [summary, setSummary] = useState<CustomerSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/accounting/advanced?module=customers');
      
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.data.customers);
        setSummary(data.data.summary);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (customerData: any) => {
    try {
      const response = await fetch('/api/accounting/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_customer',
          data: customerData
        })
      });

      if (response.ok) {
        await fetchCustomers();
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 80) return 'bg-red-100 text-red-800';
    if (riskScore >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getRiskLevel = (riskScore: number) => {
    if (riskScore >= 80) return 'Yüksek Risk';
    if (riskScore >= 60) return 'Orta Risk';
    return 'Düşük Risk';
  };

  const getTypeIcon = (type: string) => {
    return type === 'corporate' ? BuildingOfficeIcon : UserIcon;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.taxNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesType = typeFilter === 'all' || customer.type === typeFilter;
    const matchesRisk = riskFilter === 'all' || 
                       (riskFilter === 'high' && customer.riskScore >= 80) ||
                       (riskFilter === 'medium' && customer.riskScore >= 60 && customer.riskScore < 80) ||
                       (riskFilter === 'low' && customer.riskScore < 60);
    
    return matchesSearch && matchesStatus && matchesType && matchesRisk;
  });

  if (!user) {
    return <AdminProtection><div>Loading...</div></AdminProtection>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gelişmiş Cari Hesap Yönetimi</h1>
              <p className="text-gray-600 mt-1">Müşterilerinizi yönetin ve risk analizi yapın</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Yeni Müşteri
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalCustomers}</p>
                  <p className="text-sm text-green-600">+{summary.newCustomersThisMonth} bu ay</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <UserIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif Müşteri</p>
                  <p className="text-2xl font-bold text-green-600">{summary.activeCustomers}</p>
                  <p className="text-sm text-gray-500">{Math.round((summary.activeCustomers / summary.totalCustomers) * 100)}% oran</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Alacak</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalReceivables)}</p>
                  <p className="text-sm text-gray-500">Bekleyen ödemeler</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Yüksek Risk</p>
                  <p className="text-2xl font-bold text-red-600">{summary.highRiskCustomers}</p>
                  <p className="text-sm text-gray-500">Müşteri sayısı</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Müşteri ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
                <option value="blocked">Engelli</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tip</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Tipler</option>
                <option value="individual">Bireysel</option>
                <option value="corporate">Kurumsal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Seviyesi</label>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Risk Seviyeleri</option>
                <option value="high">Yüksek Risk</option>
                <option value="medium">Orta Risk</option>
                <option value="low">Düşük Risk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Müşteriler</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Müşteriler yükleniyor...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Müşteri
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tip
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bakiye
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kredi Limiti
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Skoru
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Son Alışveriş
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => {
                    const TypeIcon = getTypeIcon(customer.type);
                    return (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <TypeIcon className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">{customer.code}</div>
                              <div className="text-sm text-gray-500">{customer.taxNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            customer.type === 'corporate' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {customer.type === 'corporate' ? 'Kurumsal' : 'Bireysel'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                            {customer.status === 'active' ? 'Aktif' :
                             customer.status === 'inactive' ? 'Pasif' : 'Engelli'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${customer.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(customer.currentBalance)}
                          </div>
                          <div className="text-sm text-gray-500">{customer.currency}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(customer.creditLimit)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(customer.riskScore)}`}>
                              {customer.riskScore}/100
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              {getRiskLevel(customer.riskScore)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.lastPurchaseDate ? formatDate(customer.lastPurchaseDate) : 'Henüz yok'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedCustomer(customer)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <ChartBarIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
