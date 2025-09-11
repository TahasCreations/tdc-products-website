'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminProtection from '../../../components/AdminProtection';
import OptimizedLoader from '../../../components/OptimizedLoader';

interface CRMDashboardData {
  totalCustomers: number;
  activeCustomers: number;
  vipCustomers: number;
  newCustomers: number;
  totalRevenue: number;
  tierDistribution: Record<string, number>;
}

interface Customer {
  id: string;
  customer_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name: string;
  customer_type: string;
  customer_status: string;
  customer_tier: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string;
  created_at: string;
  tags: Array<{
    tag: {
      id: string;
      name: string;
      color: string;
    };
  }>;
}

interface Tag {
  id: string;
  name: string;
  color: string;
  description: string;
}

interface Communication {
  id: string;
  communication_type: string;
  direction: string;
  subject: string;
  content: string;
  communication_date: string;
  outcome: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  task_type: string;
  priority: string;
  status: string;
  due_date: string;
  completed_date: string;
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  stage: string;
  probability: number;
  expected_value: number;
  expected_close_date: string;
  source: string;
}

export default function AdminCRMPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<CRMDashboardData | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerCommunications, setCustomerCommunications] = useState<Communication[]>([]);
  const [customerTasks, setCustomerTasks] = useState<Task[]>([]);
  const [customerOpportunities, setCustomerOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'customer_detail' | 'analytics' | 'campaigns' | 'reports'>('dashboard');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddCommunication, setShowAddCommunication] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddOpportunity, setShowAddOpportunity] = useState(false);
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('total_spent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [newCustomer, setNewCustomer] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    customer_type: 'individual',
    customer_tier: 'bronze',
    notes: '',
    tags: [] as string[]
  });

  const [newCommunication, setNewCommunication] = useState({
    communication_type: 'email',
    direction: 'outbound',
    subject: '',
    content: '',
    duration_minutes: '',
    outcome: '',
    follow_up_date: '',
    follow_up_notes: '',
    is_important: false
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    task_type: 'follow_up',
    priority: 'medium',
    due_date: ''
  });

  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    description: '',
    stage: 'lead',
    probability: 0,
    expected_value: '',
    expected_close_date: '',
    source: '',
    competitor: '',
    notes: ''
  });

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'email',
    subject: '',
    content: '',
    target_tier: 'all',
    target_status: 'all',
    scheduled_date: '',
    status: 'draft'
  });

  const fetchCRMData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Dashboard verilerini getir
      const dashboardResponse = await fetch('/api/crm?type=dashboard');
      const dashboardData = await dashboardResponse.json();
      
      if (dashboardData.success) {
        setDashboardData(dashboardData.data);
      }

      // Müşterileri getir
      const customersResponse = await fetch('/api/crm?type=customers');
      const customersData = await customersResponse.json();
      
      if (customersData.success) {
        setCustomers(customersData.customers);
      }

      // Etiketleri getir
      const tagsResponse = await fetch('/api/crm?type=tags');
      const tagsData = await tagsResponse.json();
      
      if (tagsData.success) {
        setTags(tagsData.tags);
      }

    } catch (error) {
      console.error('Fetch CRM data error:', error);
      setMessage('Veriler yüklenemedi');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCRMData();
  }, [fetchCRMData]);

  const fetchCustomerDetail = async (customerId: string) => {
    try {
      const response = await fetch(`/api/crm?type=customer_detail&customer_id=${customerId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedCustomer(data.customer);
        setCustomerCommunications(data.communications);
        setCustomerTasks(data.tasks);
        setCustomerOpportunities(data.opportunities);
        setActiveTab('customer_detail');
      }
    } catch (error) {
      console.error('Fetch customer detail error:', error);
      setMessage('Müşteri detayları yüklenemedi');
      setMessageType('error');
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/crm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_customer',
          ...newCustomer,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Müşteri başarıyla eklendi');
        setMessageType('success');
        setNewCustomer({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          company_name: '',
          customer_type: 'individual',
          customer_tier: 'bronze',
          notes: '',
          tags: []
        });
        setShowAddCustomer(false);
        fetchCRMData();
      } else {
        setMessage(data.error || 'Müşteri eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add customer error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleAddCommunication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/crm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_communication',
          customer_id: selectedCustomer?.id,
          ...newCommunication,
          duration_minutes: newCommunication.duration_minutes ? parseInt(newCommunication.duration_minutes) : null,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('İletişim kaydı başarıyla eklendi');
        setMessageType('success');
        setNewCommunication({
          communication_type: 'email',
          direction: 'outbound',
          subject: '',
          content: '',
          duration_minutes: '',
          outcome: '',
          follow_up_date: '',
          follow_up_notes: '',
          is_important: false
        });
        setShowAddCommunication(false);
        if (selectedCustomer) {
          fetchCustomerDetail(selectedCustomer.id);
        }
      } else {
        setMessage(data.error || 'İletişim kaydı eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add communication error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/crm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_task',
          customer_id: selectedCustomer?.id,
          ...newTask,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Görev başarıyla eklendi');
        setMessageType('success');
        setNewTask({
          title: '',
          description: '',
          task_type: 'follow_up',
          priority: 'medium',
          due_date: ''
        });
        setShowAddTask(false);
        if (selectedCustomer) {
          fetchCustomerDetail(selectedCustomer.id);
        }
      } else {
        setMessage(data.error || 'Görev eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add task error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleAddOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/crm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_opportunity',
          customer_id: selectedCustomer?.id,
          ...newOpportunity,
          expected_value: parseFloat(newOpportunity.expected_value) || 0,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Fırsat başarıyla eklendi');
        setMessageType('success');
        setNewOpportunity({
          title: '',
          description: '',
          stage: 'lead',
          probability: 0,
          expected_value: '',
          expected_close_date: '',
          source: '',
          competitor: '',
          notes: ''
        });
        setShowAddOpportunity(false);
        if (selectedCustomer) {
          fetchCustomerDetail(selectedCustomer.id);
        }
      } else {
        setMessage(data.error || 'Fırsat eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add opportunity error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
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

  const getCustomerTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      'bronze': 'bg-orange-100 text-orange-800',
      'silver': 'bg-gray-100 text-gray-800',
      'gold': 'bg-yellow-100 text-yellow-800',
      'platinum': 'bg-purple-100 text-purple-800'
    };
    return colors[tier] || 'bg-gray-100 text-gray-800';
  };

  const getCustomerTierText = (tier: string) => {
    const texts: Record<string, string> = {
      'bronze': 'Bronz',
      'silver': 'Gümüş',
      'gold': 'Altın',
      'platinum': 'Platin'
    };
    return texts[tier] || tier;
  };

  const getTaskPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getTaskStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-gray-100 text-gray-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getOpportunityStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'lead': 'bg-gray-100 text-gray-800',
      'qualified': 'bg-blue-100 text-blue-800',
      'proposal': 'bg-yellow-100 text-yellow-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'closed_won': 'bg-green-100 text-green-800',
      'closed_lost': 'bg-red-100 text-red-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  // Filtrelenmiş ve sıralanmış müşteriler
  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      const matchesSearch = searchTerm === '' || 
        customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTier = filterTier === 'all' || customer.customer_tier === filterTier;
      const matchesStatus = filterStatus === 'all' || customer.customer_status === filterStatus;
      
      return matchesSearch && matchesTier && matchesStatus;
    });

    // Sıralama
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Customer];
      let bValue: any = b[sortBy as keyof Customer];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [customers, searchTerm, filterTier, filterStatus, sortBy, sortOrder]);

  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/crm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_campaign',
          ...newCampaign,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Kampanya başarıyla oluşturuldu');
        setMessageType('success');
        setNewCampaign({
          name: '',
          type: 'email',
          subject: '',
          content: '',
          target_tier: 'all',
          target_status: 'all',
          scheduled_date: '',
          status: 'draft'
        });
        setShowAddCampaign(false);
      } else {
        setMessage(data.error || 'Kampanya oluşturulamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add campaign error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  if (loading) {
    return <OptimizedLoader message="CRM verileri yükleniyor..." />;
  }

  return (
    <AdminProtection>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="mr-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors group"
              title="Önceki sayfaya dön"
            >
              <i className="ri-close-line text-lg text-gray-600 group-hover:text-red-600 transition-colors"></i>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gelişmiş CRM Yönetimi</h1>
              <p className="text-gray-600">Müşteri ilişkileri, satış süreçleri ve pazarlama kampanyaları</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/admin"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <i className="ri-close-line mr-2"></i>
              Çıkış
            </Link>
            <button
              onClick={() => setShowAddCustomer(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <i className="ri-user-add-line mr-2"></i>
              Müşteri Ekle
            </button>
            <button
              onClick={() => setShowAddCampaign(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <i className="ri-mail-send-line mr-2"></i>
              Kampanya Oluştur
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
            <button
              onClick={() => setMessage('')}
              className="float-right text-lg font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-dashboard-line mr-2"></i>
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'customers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-user-line mr-2"></i>
                Müşteriler
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-bar-chart-line mr-2"></i>
                Analitik
              </button>
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'campaigns'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-mail-send-line mr-2"></i>
                Kampanyalar
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
                Raporlar
              </button>
              {selectedCustomer && (
                <button
                  onClick={() => setActiveTab('customer_detail')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'customer_detail'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-user-settings-line mr-2"></i>
                  {selectedCustomer.first_name} {selectedCustomer.last_name}
                </button>
              )}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && dashboardData && (
              <div className="space-y-6">
                {/* CRM Özeti */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <i className="ri-user-line text-2xl text-blue-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {dashboardData.totalCustomers}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <i className="ri-user-check-line text-2xl text-green-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Aktif Müşteri</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {dashboardData.activeCustomers}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <i className="ri-vip-crown-line text-2xl text-purple-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">VIP Müşteri</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {dashboardData.vipCustomers}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <i className="ri-user-add-line text-2xl text-yellow-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Yeni Müşteri</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {dashboardData.newCustomers}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {formatCurrency(dashboardData.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Müşteri Tier Dağılımı */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Tier Dağılımı</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(dashboardData.tierDistribution).map(([tier, count]) => (
                      <div key={tier} className="p-4 border border-gray-200 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">{getCustomerTierText(tier)}</p>
                        <p className="text-xl font-semibold text-gray-900">{count}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="space-y-4">
                {/* Filtreleme ve Arama */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Arama</label>
                      <input
                        type="text"
                        placeholder="Müşteri ara..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterTier}
                        onChange={(e) => setFilterTier(e.target.value)}
                      >
                        <option value="all">Tümü</option>
                        <option value="bronze">Bronz</option>
                        <option value="silver">Gümüş</option>
                        <option value="gold">Altın</option>
                        <option value="platinum">Platin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">Tümü</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Pasif</option>
                        <option value="suspended">Askıda</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
                      <div className="flex space-x-2">
                        <select
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                          <option value="total_spent">Toplam Harcama</option>
                          <option value="total_orders">Sipariş Sayısı</option>
                          <option value="first_name">Ad</option>
                          <option value="last_name">Soyad</option>
                          <option value="created_at">Kayıt Tarihi</option>
                        </select>
                        <button
                          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          <i className={`ri-sort-${sortOrder === 'asc' ? 'asc' : 'desc'}`}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Müşteri Sayısı */}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Toplam {filteredCustomers.length} müşteri gösteriliyor
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Müşteri
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İletişim
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Siparişler
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Toplam Harcama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Son Sipariş
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {customer.first_name} {customer.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{customer.customer_code}</div>
                            {customer.company_name && (
                              <div className="text-sm text-gray-500">{customer.company_name}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customer.email}</div>
                          {customer.phone && (
                            <div className="text-sm text-gray-500">{customer.phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCustomerTierColor(customer.customer_tier)}`}>
                            {getCustomerTierText(customer.customer_tier)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.total_orders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(customer.total_spent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.last_order_date ? formatDate(customer.last_order_date) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => fetchCustomerDetail(customer.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Detay
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}

            {activeTab === 'customer_detail' && selectedCustomer && (
              <div className="space-y-6">
                {/* Müşteri Bilgileri */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedCustomer.first_name} {selectedCustomer.last_name}
                      </h2>
                      <p className="text-gray-600">{selectedCustomer.customer_code}</p>
                      {selectedCustomer.company_name && (
                        <p className="text-gray-600">{selectedCustomer.company_name}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCustomerTierColor(selectedCustomer.customer_tier)}`}>
                        {getCustomerTierText(selectedCustomer.customer_tier)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">E-posta</p>
                      <p className="text-sm text-gray-900">{selectedCustomer.email}</p>
                    </div>
                    {selectedCustomer.phone && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Telefon</p>
                        <p className="text-sm text-gray-900">{selectedCustomer.phone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-600">Toplam Harcama</p>
                      <p className="text-sm text-gray-900">{formatCurrency(selectedCustomer.total_spent)}</p>
                    </div>
                  </div>

                  {/* Etiketler */}
                  {selectedCustomer.tags && selectedCustomer.tags.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Etiketler</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCustomer.tags.map((tagRelation, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{ backgroundColor: tagRelation.tag.color + '20', color: tagRelation.tag.color }}
                          >
                            {tagRelation.tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Alt Tablar */}
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                      <button className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">
                        İletişim Geçmişi
                      </button>
                      <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">
                        Görevler
                      </button>
                      <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">
                        Fırsatlar
                      </button>
                    </nav>
                  </div>

                  <div className="p-6">
                    {/* İletişim Geçmişi */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">İletişim Geçmişi</h3>
                        <button
                          onClick={() => setShowAddCommunication(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          İletişim Ekle
                        </button>
                      </div>
                      
                      {customerCommunications.length > 0 ? (
                        <div className="space-y-3">
                          {customerCommunications.map((comm) => (
                            <div key={comm.id} className="p-4 border border-gray-200 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900">{comm.subject}</p>
                                  <p className="text-sm text-gray-600">{comm.content}</p>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                  <p>{formatDate(comm.communication_date)}</p>
                                  <p className="capitalize">{comm.communication_type}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">Henüz iletişim kaydı bulunmuyor</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">CRM Analitikleri</h3>
                
                {/* Analitik Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <i className="ri-line-chart-line text-2xl text-blue-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Müşteri Büyüme Oranı</p>
                        <p className="text-2xl font-semibold text-gray-900">+12.5%</p>
                        <p className="text-xs text-gray-500">Son 30 gün</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Ortalama Müşteri Değeri</p>
                        <p className="text-2xl font-semibold text-gray-900">₺2,450</p>
                        <p className="text-xs text-gray-500">Son 12 ay</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <i className="ri-customer-service-2-line text-2xl text-purple-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Müşteri Memnuniyeti</p>
                        <p className="text-2xl font-semibold text-gray-900">4.8/5</p>
                        <p className="text-xs text-gray-500">Son 100 değerlendirme</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grafik Alanı */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Tier Dağılımı</h4>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Grafik burada görüntülenecek</p>
                  </div>
                </div>

                {/* En Aktif Müşteriler */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">En Aktif Müşteriler</h4>
                  <div className="space-y-3">
                    {customers.slice(0, 5).map((customer, index) => (
                      <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{customer.first_name} {customer.last_name}</p>
                            <p className="text-sm text-gray-500">{customer.customer_code}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(customer.total_spent)}</p>
                          <p className="text-sm text-gray-500">{customer.total_orders} sipariş</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Pazarlama Kampanyaları</h3>
                  <button
                    onClick={() => setShowAddCampaign(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Yeni Kampanya
                  </button>
                </div>

                {/* Kampanya Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Hoş Geldin Kampanyası</h4>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Aktif
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Yeni müşterilere özel indirim kampanyası</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Gönderilen:</span>
                        <span className="font-medium">1,250</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Açılma Oranı:</span>
                        <span className="font-medium">24.5%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tıklama Oranı:</span>
                        <span className="font-medium">8.2%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">VIP Müşteri Kampanyası</h4>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        Planlanmış
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">VIP müşterilere özel ürün tanıtımı</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Hedef:</span>
                        <span className="font-medium">150 müşteri</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Planlanan Tarih:</span>
                        <span className="font-medium">15 Ocak</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Yeniden Aktivasyon</h4>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Taslak
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Pasif müşterileri geri kazanma kampanyası</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Hedef:</span>
                        <span className="font-medium">500 müşteri</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Durum:</span>
                        <span className="font-medium">Hazırlanıyor</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">CRM Raporları</h3>
                
                {/* Rapor Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <i className="ri-user-line text-xl text-blue-600"></i>
                      </div>
                      <h4 className="ml-3 font-semibold text-gray-900">Müşteri Analizi</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Müşteri segmentasyonu ve davranış analizi</p>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                      Raporu Görüntüle
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <i className="ri-money-dollar-circle-line text-xl text-green-600"></i>
                      </div>
                      <h4 className="ml-3 font-semibold text-gray-900">Satış Performansı</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Satış ekibi ve müşteri performans raporu</p>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                      Raporu Görüntüle
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <i className="ri-mail-send-line text-xl text-purple-600"></i>
                      </div>
                      <h4 className="ml-3 font-semibold text-gray-900">Kampanya Raporu</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Pazarlama kampanyalarının etkinlik analizi</p>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                      Raporu Görüntüle
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <i className="ri-customer-service-2-line text-xl text-orange-600"></i>
                      </div>
                      <h4 className="ml-3 font-semibold text-gray-900">Müşteri Memnuniyeti</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Müşteri geri bildirimleri ve memnuniyet analizi</p>
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                      Raporu Görüntüle
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <i className="ri-user-unfollow-line text-xl text-red-600"></i>
                      </div>
                      <h4 className="ml-3 font-semibold text-gray-900">Müşteri Kaybı Analizi</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Müşteri kaybı nedenleri ve önleme stratejileri</p>
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                      Raporu Görüntüle
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <i className="ri-bar-chart-line text-xl text-indigo-600"></i>
                      </div>
                      <h4 className="ml-3 font-semibold text-gray-900">Trend Analizi</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Müşteri davranışları ve satış trendleri</p>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                      Raporu Görüntüle
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Customer Modal */}
        {showAddCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Müşteri Ekle</h2>
              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCustomer.first_name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCustomer.last_name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Şirket</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCustomer.company_name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, company_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri Tipi</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCustomer.customer_type}
                      onChange={(e) => setNewCustomer({ ...newCustomer, customer_type: e.target.value })}
                    >
                      <option value="individual">Bireysel</option>
                      <option value="corporate">Kurumsal</option>
                      <option value="wholesale">Toptan</option>
                      <option value="retail">Perakende</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri Tier</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCustomer.customer_tier}
                      onChange={(e) => setNewCustomer({ ...newCustomer, customer_tier: e.target.value })}
                    >
                      <option value="bronze">Bronz</option>
                      <option value="silver">Gümüş</option>
                      <option value="gold">Altın</option>
                      <option value="platinum">Platin</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCustomer.notes}
                      onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Müşteri Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCustomer(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Communication Modal */}
        {showAddCommunication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">İletişim Kaydı Ekle</h2>
              <form onSubmit={handleAddCommunication} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İletişim Tipi</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCommunication.communication_type}
                      onChange={(e) => setNewCommunication({ ...newCommunication, communication_type: e.target.value })}
                    >
                      <option value="email">E-posta</option>
                      <option value="phone">Telefon</option>
                      <option value="sms">SMS</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="meeting">Toplantı</option>
                      <option value="note">Not</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yön</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCommunication.direction}
                      onChange={(e) => setNewCommunication({ ...newCommunication, direction: e.target.value })}
                    >
                      <option value="inbound">Gelen</option>
                      <option value="outbound">Giden</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCommunication.subject}
                      onChange={(e) => setNewCommunication({ ...newCommunication, subject: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                    <textarea
                      rows={4}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCommunication.content}
                      onChange={(e) => setNewCommunication({ ...newCommunication, content: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Süre (dakika)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCommunication.duration_minutes}
                      onChange={(e) => setNewCommunication({ ...newCommunication, duration_minutes: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sonuç</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCommunication.outcome}
                      onChange={(e) => setNewCommunication({ ...newCommunication, outcome: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Kaydet
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCommunication(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Campaign Modal */}
        {showAddCampaign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Kampanya Oluştur</h2>
              <form onSubmit={handleAddCampaign} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kampanya Adı</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kampanya Tipi</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCampaign.type}
                      onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
                    >
                      <option value="email">E-posta</option>
                      <option value="sms">SMS</option>
                      <option value="push">Push Bildirimi</option>
                      <option value="social">Sosyal Medya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Tier</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCampaign.target_tier}
                      onChange={(e) => setNewCampaign({ ...newCampaign, target_tier: e.target.value })}
                    >
                      <option value="all">Tümü</option>
                      <option value="bronze">Bronz</option>
                      <option value="silver">Gümüş</option>
                      <option value="gold">Altın</option>
                      <option value="platinum">Platin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Durum</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCampaign.target_status}
                      onChange={(e) => setNewCampaign({ ...newCampaign, target_status: e.target.value })}
                    >
                      <option value="all">Tümü</option>
                      <option value="active">Aktif</option>
                      <option value="inactive">Pasif</option>
                      <option value="suspended">Askıda</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Planlanan Tarih</label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCampaign.scheduled_date}
                      onChange={(e) => setNewCampaign({ ...newCampaign, scheduled_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCampaign.status}
                      onChange={(e) => setNewCampaign({ ...newCampaign, status: e.target.value })}
                    >
                      <option value="draft">Taslak</option>
                      <option value="scheduled">Planlanmış</option>
                      <option value="active">Aktif</option>
                      <option value="paused">Duraklatıldı</option>
                      <option value="completed">Tamamlandı</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCampaign.subject}
                      onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                    <textarea
                      rows={6}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCampaign.content}
                      onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Kampanya Oluştur
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCampaign(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminProtection>
  );
}
