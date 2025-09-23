'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiWrapper } from '@/lib/api-wrapper';

interface Employee {
  id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  hire_date: string;
  status: string;
  employment_type: string;
  departments?: { name: string; code: string };
  positions?: { title: string; code: string };
}

interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  budget?: number;
}

interface Position {
  id: string;
  title: string;
  code: string;
  description?: string;
  level: number;
  min_salary?: number;
  max_salary?: number;
}

interface PayrollPeriod {
  id: string;
  period_name: string;
  period_type: string;
  start_date: string;
  end_date: string;
  pay_date: string;
  status: string;
  total_employees: number;
  total_gross_pay: number;
  total_net_pay: number;
}

interface PayrollRecord {
  id: string;
  period_id: string;
  employee_id: string;
  base_salary: number;
  gross_salary: number;
  net_salary: number;
  total_allowances: number;
  total_deductions: number;
  total_taxes: number;
  status: string;
  employees?: Employee;
  payroll_periods?: PayrollPeriod;
}

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriod[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);

  // Form states
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [showPayrollForm, setShowPayrollForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [newEmployee, setNewEmployee] = useState({
    employee_number: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    birth_date: '',
    hire_date: '',
    department_id: '',
    position_id: '',
    employment_type: 'full_time'
  });

  const [newDepartment, setNewDepartment] = useState({
    name: '',
    code: '',
    description: '',
    budget: ''
  });

  const [newPayrollPeriod, setNewPayrollPeriod] = useState({
    period_name: '',
    period_type: 'monthly',
    start_date: '',
    end_date: '',
    pay_date: ''
  });

  const fetchEmployees = useCallback(async () => {
    try {
      const result = await apiWrapper.get('/api/accounting/payroll?action=employees');
      if (result && (result as any).data) {
        setEmployees((result as any).data);
      }
    } catch (error) {
      console.error('Çalışan listesi yüklenemedi:', error);
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const result = await apiWrapper.get('/api/accounting/payroll?action=departments');
      if (result && (result as any).data) {
        setDepartments((result as any).data);
      }
    } catch (error) {
      console.error('Departman listesi yüklenemedi:', error);
    }
  }, []);

  const fetchPositions = useCallback(async () => {
    try {
      const result = await apiWrapper.get('/api/accounting/payroll?action=positions');
      if (result && (result as any).data) {
        setPositions((result as any).data);
      }
    } catch (error) {
      console.error('Pozisyon listesi yüklenemedi:', error);
    }
  }, []);

  const fetchPayrollPeriods = useCallback(async () => {
    try {
      const result = await apiWrapper.get('/api/accounting/payroll?action=payroll-periods');
      if (result && (result as any).data) {
        setPayrollPeriods((result as any).data);
      }
    } catch (error) {
      console.error('Bordro dönemleri yüklenemedi:', error);
    }
  }, []);

  const fetchPayrollRecords = useCallback(async () => {
    try {
      const result = await apiWrapper.get('/api/accounting/payroll?action=payroll-records');
      if (result && (result as any).data) {
        setPayrollRecords((result as any).data);
      }
    } catch (error) {
      console.error('Bordro kayıtları yüklenemedi:', error);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchEmployees(),
        fetchDepartments(),
        fetchPositions(),
        fetchPayrollPeriods(),
        fetchPayrollRecords()
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchEmployees, fetchDepartments, fetchPositions, fetchPayrollPeriods, fetchPayrollRecords]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiLoading(true);

    try {
      const result = await apiWrapper.post('/api/accounting/payroll', {
        action: 'create_employee',
        ...newEmployee
      });

      if (result && (result as any).data) {
        await fetchEmployees();
        setShowEmployeeForm(false);
        setNewEmployee({
          employee_number: '',
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          postal_code: '',
          birth_date: '',
          hire_date: '',
          department_id: '',
          position_id: '',
          employment_type: 'full_time'
        });
      }
    } catch (error) {
      console.error('Çalışan oluşturulamadı:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiLoading(true);

    try {
      const result = await apiWrapper.post('/api/accounting/payroll', {
        action: 'create_department',
        ...newDepartment,
        budget: newDepartment.budget ? parseFloat(newDepartment.budget) : null
      });

      if (result && (result as any).data) {
        await fetchDepartments();
        setShowDepartmentForm(false);
        setNewDepartment({
          name: '',
          code: '',
          description: '',
          budget: ''
        });
      }
    } catch (error) {
      console.error('Departman oluşturulamadı:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const handleCreatePayrollPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiLoading(true);

    try {
      const result = await apiWrapper.post('/api/accounting/payroll', {
        action: 'create_payroll_period',
        ...newPayrollPeriod
      });

      if (result && (result as any).data) {
        await fetchPayrollPeriods();
        setShowPayrollForm(false);
        setNewPayrollPeriod({
          period_name: '',
          period_type: 'monthly',
          start_date: '',
          end_date: '',
          pay_date: ''
        });
      }
    } catch (error) {
      console.error('Bordro dönemi oluşturulamadı:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const handleProcessPayroll = async (periodId: string) => {
    setApiLoading(true);
    try {
      const result = await apiWrapper.post('/api/accounting/payroll', {
        action: 'process_payroll',
        period_id: periodId
      });

      if (result && (result as any).data) {
        await fetchPayrollPeriods();
        await fetchPayrollRecords();
      }
    } catch (error) {
      console.error('Bordro işlenemedi:', error);
    } finally {
      setApiLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'completed': return 'Tamamlandı';
      case 'approved': return 'Onaylandı';
      case 'draft': return 'Taslak';
      case 'processing': return 'İşleniyor';
      case 'inactive': return 'Pasif';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bordro ve Maaş Yönetimi</h1>
          <p className="text-gray-600">Çalışan bordroları, maaş hesaplamaları ve HR süreçleri</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEmployeeForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <i className="ri-user-add-line"></i>
            Çalışan Ekle
          </button>
          <button
            onClick={() => setShowPayrollForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <i className="ri-calendar-line"></i>
            Bordro Dönemi
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'employees', label: 'Çalışanlar', icon: 'ri-team-line' },
            { id: 'departments', label: 'Departmanlar', icon: 'ri-building-line' },
            { id: 'payroll-periods', label: 'Bordro Dönemleri', icon: 'ri-calendar-line' },
            { id: 'payroll-records', label: 'Bordro Kayıtları', icon: 'ri-file-list-line' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Çalışanlar Tab */}
      {activeTab === 'employees' && (
        <div className="space-y-6">
          {/* Çalışan Formu */}
          {showEmployeeForm && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingEmployee ? 'Çalışan Düzenle' : 'Yeni Çalışan'}
              </h3>
              <form onSubmit={handleCreateEmployee} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Çalışan Numarası
                    </label>
                    <input
                      type="text"
                      value={newEmployee.employee_number}
                      onChange={(e) => setNewEmployee({ ...newEmployee, employee_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İşe Giriş Tarihi
                    </label>
                    <input
                      type="date"
                      value={newEmployee.hire_date}
                      onChange={(e) => setNewEmployee({ ...newEmployee, hire_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ad
                    </label>
                    <input
                      type="text"
                      value={newEmployee.first_name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, first_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Soyad
                    </label>
                    <input
                      type="text"
                      value={newEmployee.last_name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, last_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta
                    </label>
                    <input
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departman
                    </label>
                    <select
                      value={newEmployee.department_id}
                      onChange={(e) => setNewEmployee({ ...newEmployee, department_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Departman seçin</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pozisyon
                    </label>
                    <select
                      value={newEmployee.position_id}
                      onChange={(e) => setNewEmployee({ ...newEmployee, position_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Pozisyon seçin</option>
                      {positions.map((pos) => (
                        <option key={pos.id} value={pos.id}>
                          {pos.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={apiLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <i className="ri-save-line"></i>
                    {apiLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmployeeForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Çalışan Listesi */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Çalışanlar</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Çalışan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departman
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pozisyon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşe Giriş
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
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <i className="ri-user-line text-blue-600"></i>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.first_name} {employee.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.employee_number}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.departments?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.positions?.title || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(employee.hire_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                          {getStatusText(employee.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Düzenle"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
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
        </div>
      )}

      {/* Departmanlar Tab */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          {/* Departman Formu */}
          {showDepartmentForm && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Departman</h3>
              <form onSubmit={handleCreateDepartment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departman Adı
                    </label>
                    <input
                      type="text"
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departman Kodu
                    </label>
                    <input
                      type="text"
                      value={newDepartment.code}
                      onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={newDepartment.description}
                    onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bütçe
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newDepartment.budget}
                    onChange={(e) => setNewDepartment({ ...newDepartment, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={apiLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <i className="ri-save-line"></i>
                    {apiLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDepartmentForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Departmanlar</h3>
            <button
              onClick={() => setShowDepartmentForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              Departman Ekle
            </button>
          </div>

          {/* Departman Listesi */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departman
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kod
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bütçe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departments.map((department) => (
                    <tr key={department.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <i className="ri-building-line text-green-600"></i>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {department.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {department.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {department.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {department.budget ? formatCurrency(department.budget) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Düzenle"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
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
        </div>
      )}

      {/* Bordro Dönemleri Tab */}
      {activeTab === 'payroll-periods' && (
        <div className="space-y-6">
          {/* Bordro Dönemi Formu */}
          {showPayrollForm && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Bordro Dönemi</h3>
              <form onSubmit={handleCreatePayrollPeriod} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dönem Adı
                  </label>
                  <input
                    type="text"
                    value={newPayrollPeriod.period_name}
                    onChange={(e) => setNewPayrollPeriod({ ...newPayrollPeriod, period_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2024 Ocak Bordrosu"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dönem Tipi
                    </label>
                    <select
                      value={newPayrollPeriod.period_type}
                      onChange={(e) => setNewPayrollPeriod({ ...newPayrollPeriod, period_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="monthly">Aylık</option>
                      <option value="bi_weekly">İki Haftalık</option>
                      <option value="weekly">Haftalık</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ödeme Tarihi
                    </label>
                    <input
                      type="date"
                      value={newPayrollPeriod.pay_date}
                      onChange={(e) => setNewPayrollPeriod({ ...newPayrollPeriod, pay_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Başlangıç Tarihi
                    </label>
                    <input
                      type="date"
                      value={newPayrollPeriod.start_date}
                      onChange={(e) => setNewPayrollPeriod({ ...newPayrollPeriod, start_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bitiş Tarihi
                    </label>
                    <input
                      type="date"
                      value={newPayrollPeriod.end_date}
                      onChange={(e) => setNewPayrollPeriod({ ...newPayrollPeriod, end_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={apiLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <i className="ri-save-line"></i>
                    {apiLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPayrollForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Bordro Dönemleri Listesi */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Bordro Dönemleri</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dönem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih Aralığı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ödeme Tarihi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Çalışan Sayısı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Toplam Brüt
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
                  {payrollPeriods.map((period) => (
                    <tr key={period.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {period.period_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {period.period_type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(period.start_date)} - {formatDate(period.end_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(period.pay_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {period.total_employees}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(period.total_gross_pay)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(period.status)}`}>
                          {getStatusText(period.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {period.status === 'draft' && (
                            <button
                              onClick={() => handleProcessPayroll(period.id)}
                              disabled={apiLoading}
                              className="text-blue-600 hover:text-blue-900 disabled:text-gray-400"
                              title="İşle"
                            >
                              <i className="ri-play-line"></i>
                            </button>
                          )}
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Düzenle"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
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
        </div>
      )}

      {/* Bordro Kayıtları Tab */}
      {activeTab === 'payroll-records' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Bordro Kayıtları</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Çalışan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dönem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brüt Maaş
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Maaş
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kesintiler
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payrollRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.employees?.first_name} {record.employees?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.employees?.employee_number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.payroll_periods?.period_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(record.gross_salary)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(record.net_salary)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(record.total_deductions)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {getStatusText(record.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
