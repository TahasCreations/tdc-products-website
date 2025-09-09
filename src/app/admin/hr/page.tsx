'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminProtection from '../../../components/AdminProtection';
import OptimizedLoader from '../../../components/OptimizedLoader';

interface HRDashboardData {
  totalEmployees: number;
  activeEmployees: number;
  newHires: number;
  departmentStats: Record<string, number>;
}

interface Employee {
  id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  employment_type: string;
  employment_status: string;
  hire_date: string;
  base_salary: number;
  department: {
    name: string;
  };
  position: {
    title: string;
  };
  manager: {
    first_name: string;
    last_name: string;
  };
}

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  budget: number;
  manager: {
    first_name: string;
    last_name: string;
  };
}

interface Position {
  id: string;
  title: string;
  code: string;
  department: {
    name: string;
  };
  min_salary: number;
  max_salary: number;
}

interface Payroll {
  id: string;
  payroll_period: string;
  base_salary: number;
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  status: string;
  employee: {
    first_name: string;
    last_name: string;
    employee_number: string;
  };
}

interface LeaveRequest {
  id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: string;
  employee: {
    first_name: string;
    last_name: string;
    employee_number: string;
  };
  leave_type: {
    name: string;
  };
  approver: {
    name: string;
  };
}

interface PerformanceReview {
  id: string;
  review_period: string;
  overall_rating: number;
  goals_achieved: number;
  goals_total: number;
  feedback: string;
  employee: {
    first_name: string;
    last_name: string;
    employee_number: string;
  };
  reviewer: {
    first_name: string;
    last_name: string;
  };
  status: string;
}

interface Training {
  id: string;
  title: string;
  description: string;
  training_type: string;
  duration_hours: number;
  start_date: string;
  end_date: string;
  status: string;
  participants_count: number;
  max_participants: number;
  instructor: string;
}

interface Recruitment {
  id: string;
  position_title: string;
  department: string;
  description: string;
  employment_type: string;
  location: string;
  status: string;
  applications_count: number;
  posted_date: string;
  deadline: string;
  salary_range: string;
  requirements: string;
}

export default function AdminHRPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<HRDashboardData | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'departments' | 'payrolls' | 'leaves' | 'performance' | 'training' | 'recruitment'>('dashboard');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showAddPayroll, setShowAddPayroll] = useState(false);
  const [showAddPerformance, setShowAddPerformance] = useState(false);
  const [showAddTraining, setShowAddTraining] = useState(false);
  const [showAddRecruitment, setShowAddRecruitment] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department_id: '',
    position_id: '',
    manager_id: '',
    employment_type: 'full_time',
    hire_date: new Date().toISOString().split('T')[0],
    base_salary: '',
    sgk_number: '',
    tc_number: ''
  });

  const [newDepartment, setNewDepartment] = useState({
    name: '',
    code: '',
    description: '',
    manager_id: '',
    budget: ''
  });

  const [newPayroll, setNewPayroll] = useState({
    employee_id: '',
    payroll_period: '',
    base_salary: '',
    overtime_pay: '',
    bonus: '',
    commission: '',
    allowance: '',
    other_income: '',
    income_tax: '',
    stamp_tax: '',
    sgk_employee: '',
    sgk_employer: '',
    unemployment_employee: '',
    unemployment_employer: '',
    other_deductions: '',
    notes: ''
  });

  const [newPerformanceReview, setNewPerformanceReview] = useState({
    employee_id: '',
    review_period: '',
    overall_rating: '',
    goals_achieved: '',
    goals_total: '',
    feedback: '',
    reviewer_id: ''
  });

  const [newTraining, setNewTraining] = useState({
    title: '',
    description: '',
    training_type: 'internal',
    duration_hours: '',
    start_date: '',
    end_date: '',
    instructor: '',
    max_participants: '',
    requirements: ''
  });

  const [newRecruitment, setNewRecruitment] = useState({
    position_title: '',
    department: '',
    salary_range: '',
    requirements: '',
    deadline: '',
    description: '',
    location: '',
    employment_type: 'full_time'
  });

  useEffect(() => {
    fetchHRData();
  }, []);

  const fetchHRData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Dashboard verilerini getir
      const dashboardResponse = await fetch('/api/hr?type=dashboard');
      const dashboardData = await dashboardResponse.json();
      
      if (dashboardData.success) {
        setDashboardData(dashboardData.data);
      }

      // Diğer verileri getir
      const [employeesResponse, departmentsResponse, positionsResponse, payrollsResponse, leaveRequestsResponse, performanceResponse, trainingResponse, recruitmentResponse] = await Promise.all([
        fetch('/api/hr?type=employees'),
        fetch('/api/hr?type=departments'),
        fetch('/api/hr?type=positions'),
        fetch('/api/hr?type=payrolls'),
        fetch('/api/hr?type=leave_requests'),
        fetch('/api/hr?type=performance_reviews'),
        fetch('/api/hr?type=trainings'),
        fetch('/api/hr?type=recruitments')
      ]);

      const [employeesData, departmentsData, positionsData, payrollsData, leaveRequestsData, performanceData, trainingData, recruitmentData] = await Promise.all([
        employeesResponse.json(),
        departmentsResponse.json(),
        positionsResponse.json(),
        payrollsResponse.json(),
        leaveRequestsResponse.json(),
        performanceResponse.json(),
        trainingResponse.json(),
        recruitmentResponse.json()
      ]);

      if (employeesData.success) {
        setEmployees(employeesData.employees);
      }

      if (departmentsData.success) {
        setDepartments(departmentsData.departments);
      }

      if (positionsData.success) {
        setPositions(positionsData.positions);
      }

      if (payrollsData.success) {
        setPayrolls(payrollsData.payrolls);
      }

      if (leaveRequestsData.success) {
        setLeaveRequests(leaveRequestsData.leaveRequests);
      }

      if (performanceData.success) {
        setPerformanceReviews(performanceData.reviews);
      }

      if (trainingData.success) {
        setTrainings(trainingData.trainings);
      }

      if (recruitmentData.success) {
        setRecruitments(recruitmentData.recruitments);
      }

    } catch (error) {
      console.error('Fetch HR data error:', error);
      setMessage('Veriler yüklenemedi');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/hr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_employee',
          ...newEmployee,
          base_salary: parseFloat(newEmployee.base_salary),
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Çalışan başarıyla eklendi');
        setMessageType('success');
        setNewEmployee({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          department_id: '',
          position_id: '',
          manager_id: '',
          employment_type: 'full_time',
          hire_date: new Date().toISOString().split('T')[0],
          base_salary: '',
          sgk_number: '',
          tc_number: ''
        });
        setShowAddEmployee(false);
        fetchHRData();
      } else {
        setMessage(data.error || 'Çalışan eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add employee error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/hr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_department',
          ...newDepartment,
          budget: newDepartment.budget ? parseFloat(newDepartment.budget) : null
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Departman başarıyla eklendi');
        setMessageType('success');
        setNewDepartment({
          name: '',
          code: '',
          description: '',
          manager_id: '',
          budget: ''
        });
        setShowAddDepartment(false);
        fetchHRData();
      } else {
        setMessage(data.error || 'Departman eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add department error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleAddPayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/hr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_payroll',
          ...newPayroll,
          base_salary: parseFloat(newPayroll.base_salary),
          overtime_pay: parseFloat(newPayroll.overtime_pay) || 0,
          bonus: parseFloat(newPayroll.bonus) || 0,
          commission: parseFloat(newPayroll.commission) || 0,
          allowance: parseFloat(newPayroll.allowance) || 0,
          other_income: parseFloat(newPayroll.other_income) || 0,
          income_tax: parseFloat(newPayroll.income_tax) || 0,
          stamp_tax: parseFloat(newPayroll.stamp_tax) || 0,
          sgk_employee: parseFloat(newPayroll.sgk_employee) || 0,
          sgk_employer: parseFloat(newPayroll.sgk_employer) || 0,
          unemployment_employee: parseFloat(newPayroll.unemployment_employee) || 0,
          unemployment_employer: parseFloat(newPayroll.unemployment_employer) || 0,
          other_deductions: parseFloat(newPayroll.other_deductions) || 0,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Maaş bordrosu başarıyla oluşturuldu');
        setMessageType('success');
        setNewPayroll({
          employee_id: '',
          payroll_period: '',
          base_salary: '',
          overtime_pay: '',
          bonus: '',
          commission: '',
          allowance: '',
          other_income: '',
          income_tax: '',
          stamp_tax: '',
          sgk_employee: '',
          sgk_employer: '',
          unemployment_employee: '',
          unemployment_employer: '',
          other_deductions: '',
          notes: ''
        });
        setShowAddPayroll(false);
        fetchHRData();
      } else {
        setMessage(data.error || 'Maaş bordrosu oluşturulamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add payroll error:', error);
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

  const getEmploymentTypeText = (type: string) => {
    const types: Record<string, string> = {
      'full_time': 'Tam Zamanlı',
      'part_time': 'Yarı Zamanlı',
      'contract': 'Sözleşmeli',
      'intern': 'Stajyer'
    };
    return types[type] || type;
  };

  const getEmploymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'terminated': 'bg-red-100 text-red-800',
      'on_leave': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getEmploymentStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      'active': 'Aktif',
      'inactive': 'Pasif',
      'terminated': 'İşten Çıkarıldı',
      'on_leave': 'İzinli'
    };
    return statuses[status] || status;
  };

  const getLeaveStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getLeaveStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      'pending': 'Beklemede',
      'approved': 'Onaylandı',
      'rejected': 'Reddedildi',
      'cancelled': 'İptal Edildi'
    };
    return statuses[status] || status;
  };

  const handleAddPerformanceReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/hr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_performance_review',
          ...newPerformanceReview,
          overall_rating: parseFloat(newPerformanceReview.overall_rating),
          goals_achieved: parseInt(newPerformanceReview.goals_achieved),
          goals_total: parseInt(newPerformanceReview.goals_total),
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Performans değerlendirmesi başarıyla oluşturuldu');
        setMessageType('success');
        setNewPerformanceReview({
          employee_id: '',
          review_period: '',
          overall_rating: '',
          goals_achieved: '',
          goals_total: '',
          feedback: '',
          reviewer_id: ''
        });
        setShowAddPerformance(false);
        fetchHRData();
      } else {
        setMessage(data.error || 'Performans değerlendirmesi oluşturulamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add performance review error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleAddTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/hr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_training',
          ...newTraining,
          duration_hours: parseInt(newTraining.duration_hours),
          max_participants: parseInt(newTraining.max_participants),
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Eğitim programı başarıyla oluşturuldu');
        setMessageType('success');
        setNewTraining({
          title: '',
          description: '',
          training_type: 'internal',
          duration_hours: '',
          start_date: '',
          end_date: '',
          instructor: '',
          max_participants: '',
          requirements: ''
        });
        setShowAddTraining(false);
        fetchHRData();
      } else {
        setMessage(data.error || 'Eğitim programı oluşturulamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add training error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleAddRecruitment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/hr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_recruitment',
          ...newRecruitment,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('İş ilanı başarıyla oluşturuldu');
        setMessageType('success');
        setNewRecruitment({
          position_title: '',
          department: '',
          salary_range: '',
          requirements: '',
          deadline: '',
          description: '',
          location: '',
          employment_type: 'full_time'
        });
        setShowAddRecruitment(false);
        fetchHRData();
      } else {
        setMessage(data.error || 'İş ilanı oluşturulamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add recruitment error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  if (loading) {
    return <OptimizedLoader message="HR verileri yükleniyor..." />;
  }

  return (
    <AdminProtection>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">İnsan Kaynakları</h1>
            <p className="text-gray-600">Çalışan yönetimi ve HR süreçleri</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddEmployee(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Çalışan Ekle
            </button>
            <button
              onClick={() => setShowAddDepartment(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Departman Ekle
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
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'employees'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Çalışanlar
              </button>
              <button
                onClick={() => setActiveTab('departments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'departments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Departmanlar
              </button>
              <button
                onClick={() => setActiveTab('payrolls')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payrolls'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Maaş Bordroları
              </button>
              <button
                onClick={() => setActiveTab('leaves')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'leaves'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                İzin Talepleri
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'performance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Performans
              </button>
              <button
                onClick={() => setActiveTab('training')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'training'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🎓 Eğitimler
              </button>
              <button
                onClick={() => setActiveTab('recruitment')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'recruitment'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                💼 İş İlanları
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && dashboardData && (
              <div className="space-y-6">
                {/* HR Özeti */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <i className="ri-user-line text-2xl text-blue-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Toplam Çalışan</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {dashboardData.totalEmployees}
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
                        <p className="text-sm font-medium text-gray-600">Aktif Çalışan</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {dashboardData.activeEmployees}
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
                        <p className="text-sm font-medium text-gray-600">Yeni İşe Alım</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {dashboardData.newHires}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <i className="ri-building-line text-2xl text-purple-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Departman</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {Object.keys(dashboardData.departmentStats).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Departman Dağılımı */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Departman Dağılımı</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(dashboardData.departmentStats).map(([deptId, count]) => {
                      const department = departments.find(d => d.id === deptId);
                      return (
                        <div key={deptId} className="p-4 border border-gray-200 rounded-lg">
                          <p className="text-sm font-medium text-gray-600">{department?.name || 'Bilinmeyen'}</p>
                          <p className="text-xl font-semibold text-gray-900">{count}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'employees' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Çalışanlar</h3>
                  <button
                    onClick={() => setShowAddEmployee(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Çalışan Ekle
                  </button>
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
                          Maaş
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employees.map((employee) => (
                        <tr key={employee.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {employee.first_name} {employee.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{employee.employee_number}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {employee.department?.name || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {employee.position?.title || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(employee.hire_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(employee.base_salary)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEmploymentStatusColor(employee.employment_status)}`}>
                              {getEmploymentStatusText(employee.employment_status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'departments' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Departmanlar</h3>
                  <button
                    onClick={() => setShowAddDepartment(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Departman Ekle
                  </button>
                </div>

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
                          Müdür
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bütçe
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Açıklama
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {departments.map((department) => (
                        <tr key={department.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {department.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {department.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {department.manager ? `${department.manager.first_name} ${department.manager.last_name}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {department.budget ? formatCurrency(department.budget) : '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {department.description || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'payrolls' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Maaş Bordroları</h3>
                  <button
                    onClick={() => setShowAddPayroll(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Bordro Oluştur
                  </button>
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
                          Kesintiler
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Net Maaş
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payrolls.map((payroll) => (
                        <tr key={payroll.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {payroll.employee.first_name} {payroll.employee.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{payroll.employee.employee_number}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payroll.payroll_period}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(payroll.gross_salary)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(payroll.total_deductions)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(payroll.net_salary)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              payroll.status === 'paid' 
                                ? 'bg-green-100 text-green-800'
                                : payroll.status === 'approved'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payroll.status === 'paid' ? 'Ödendi' : 
                               payroll.status === 'approved' ? 'Onaylandı' : 'Taslak'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'leaves' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">İzin Talepleri</h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Çalışan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İzin Türü
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Başlangıç
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bitiş
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gün Sayısı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leaveRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {request.employee.first_name} {request.employee.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{request.employee.employee_number}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.leave_type.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(request.start_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(request.end_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.total_days} gün
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLeaveStatusColor(request.status)}`}>
                              {getLeaveStatusText(request.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Performance Reviews Tab */}
            {activeTab === 'performance' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Performans Değerlendirmeleri</h3>
                  <button
                    onClick={() => setShowAddPerformance(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Yeni Değerlendirme
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {performanceReviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <i className="ri-user-line text-xl text-blue-600"></i>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {review.employee?.first_name} {review.employee?.last_name}
                            </h4>
                            <p className="text-sm text-gray-500">{review.review_period}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{review.overall_rating}/5</div>
                          <div className="text-sm text-gray-500">Genel Puan</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Hedef Başarısı:</span>
                          <span className="font-medium">{review.goals_achieved}/{review.goals_total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(review.goals_achieved / review.goals_total) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-4">
                        <p className="line-clamp-2">{review.feedback}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                          Detaylar
                        </button>
                        <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                          Düzenle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Training Tab */}
            {activeTab === 'training' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Eğitim Programları</h3>
                  <button
                    onClick={() => setShowAddTraining(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Yeni Eğitim
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trainings.map((training) => (
                    <div key={training.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{training.title}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{training.description}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          training.training_type === 'internal' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {training.training_type === 'internal' ? 'İç Eğitim' : 'Dış Eğitim'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="ri-time-line mr-2"></i>
                          <span>{training.duration_hours} saat</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="ri-calendar-line mr-2"></i>
                          <span>{formatDate(training.start_date)} - {formatDate(training.end_date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="ri-user-line mr-2"></i>
                          <span>{training.instructor}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="ri-group-line mr-2"></i>
                          <span>Max {training.max_participants} katılımcı</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                          Detaylar
                        </button>
                        <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                          Düzenle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recruitment Tab */}
            {activeTab === 'recruitment' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">İş İlanları</h3>
                  <button
                    onClick={() => setShowAddRecruitment(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Yeni İlan
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recruitments.map((recruitment) => (
                    <div key={recruitment.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{recruitment.position_title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{recruitment.department}</p>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{recruitment.description}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          recruitment.employment_type === 'full_time' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {recruitment.employment_type === 'full_time' ? 'Tam Zamanlı' : 'Yarı Zamanlı'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="ri-money-dollar-circle-line mr-2"></i>
                          <span>{recruitment.salary_range}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="ri-map-pin-line mr-2"></i>
                          <span>{recruitment.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="ri-calendar-line mr-2"></i>
                          <span>Son Başvuru: {formatDate(recruitment.deadline)}</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-4">
                        <p className="font-medium mb-1">Gereksinimler:</p>
                        <p className="line-clamp-2">{recruitment.requirements}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                          Detaylar
                        </button>
                        <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                          Düzenle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Employee Modal */}
        {showAddEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Çalışan Ekle</h2>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newEmployee.first_name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, first_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newEmployee.last_name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, last_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departman</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newEmployee.department_id}
                      onChange={(e) => setNewEmployee({ ...newEmployee, department_id: e.target.value })}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pozisyon</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newEmployee.position_id}
                      onChange={(e) => setNewEmployee({ ...newEmployee, position_id: e.target.value })}
                    >
                      <option value="">Pozisyon seçin</option>
                      {positions.map((pos) => (
                        <option key={pos.id} value={pos.id}>
                          {pos.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İşe Giriş Tarihi</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newEmployee.hire_date}
                      onChange={(e) => setNewEmployee({ ...newEmployee, hire_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maaş</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newEmployee.base_salary}
                      onChange={(e) => setNewEmployee({ ...newEmployee, base_salary: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SGK Numarası</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newEmployee.sgk_number}
                      onChange={(e) => setNewEmployee({ ...newEmployee, sgk_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
                    <input
                      type="text"
                      maxLength={11}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newEmployee.tc_number}
                      onChange={(e) => setNewEmployee({ ...newEmployee, tc_number: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Çalışan Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddEmployee(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Department Modal */}
        {showAddDepartment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Departman Ekle</h2>
              <form onSubmit={handleAddDepartment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departman Adı</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kod</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newDepartment.code}
                      onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bütçe</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newDepartment.budget}
                      onChange={(e) => setNewDepartment({ ...newDepartment, budget: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newDepartment.description}
                      onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Departman Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddDepartment(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Performance Review Modal */}
        {showAddPerformance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Performans Değerlendirmesi</h2>
              <form onSubmit={handleAddPerformanceReview} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Çalışan</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPerformanceReview.employee_id}
                      onChange={(e) => setNewPerformanceReview({ ...newPerformanceReview, employee_id: e.target.value })}
                    >
                      <option value="">Çalışan Seçin</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.first_name} {employee.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Değerlendirme Dönemi</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: 2024 Q1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPerformanceReview.review_period}
                      onChange={(e) => setNewPerformanceReview({ ...newPerformanceReview, review_period: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Genel Puan (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPerformanceReview.overall_rating}
                      onChange={(e) => setNewPerformanceReview({ ...newPerformanceReview, overall_rating: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başarılan Hedef</label>
                    <input
                      type="number"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPerformanceReview.goals_achieved}
                      onChange={(e) => setNewPerformanceReview({ ...newPerformanceReview, goals_achieved: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Toplam Hedef</label>
                    <input
                      type="number"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPerformanceReview.goals_total}
                      onChange={(e) => setNewPerformanceReview({ ...newPerformanceReview, goals_total: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Değerlendiren</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPerformanceReview.reviewer_id}
                      onChange={(e) => setNewPerformanceReview({ ...newPerformanceReview, reviewer_id: e.target.value })}
                    >
                      <option value="">Değerlendiren Seçin</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.first_name} {employee.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Geri Bildirim</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newPerformanceReview.feedback}
                    onChange={(e) => setNewPerformanceReview({ ...newPerformanceReview, feedback: e.target.value })}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Değerlendirme Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddPerformance(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Training Modal */}
        {showAddTraining && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Eğitim Programı</h2>
              <form onSubmit={handleAddTraining} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eğitim Başlığı</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newTraining.title}
                      onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eğitim Türü</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newTraining.training_type}
                      onChange={(e) => setNewTraining({ ...newTraining, training_type: e.target.value as 'internal' | 'external' })}
                    >
                      <option value="internal">İç Eğitim</option>
                      <option value="external">Dış Eğitim</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Süre (Saat)</label>
                    <input
                      type="number"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newTraining.duration_hours}
                      onChange={(e) => setNewTraining({ ...newTraining, duration_hours: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eğitmen</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newTraining.instructor}
                      onChange={(e) => setNewTraining({ ...newTraining, instructor: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newTraining.start_date}
                      onChange={(e) => setNewTraining({ ...newTraining, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newTraining.end_date}
                      onChange={(e) => setNewTraining({ ...newTraining, end_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Katılımcı</label>
                    <input
                      type="number"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newTraining.max_participants}
                      onChange={(e) => setNewTraining({ ...newTraining, max_participants: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newTraining.description}
                    onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gereksinimler</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newTraining.requirements}
                    onChange={(e) => setNewTraining({ ...newTraining, requirements: e.target.value })}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Eğitim Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTraining(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Recruitment Modal */}
        {showAddRecruitment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni İş İlanı</h2>
              <form onSubmit={handleAddRecruitment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pozisyon</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newRecruitment.position_title}
                      onChange={(e) => setNewRecruitment({ ...newRecruitment, position_title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departman</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newRecruitment.department}
                      onChange={(e) => setNewRecruitment({ ...newRecruitment, department: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maaş Aralığı</label>
                    <input
                      type="text"
                      placeholder="Örn: 15.000 - 25.000 TL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newRecruitment.salary_range}
                      onChange={(e) => setNewRecruitment({ ...newRecruitment, salary_range: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Çalışma Türü</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newRecruitment.employment_type}
                      onChange={(e) => setNewRecruitment({ ...newRecruitment, employment_type: e.target.value as 'full_time' | 'part_time' })}
                    >
                      <option value="full_time">Tam Zamanlı</option>
                      <option value="part_time">Yarı Zamanlı</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lokasyon</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newRecruitment.location}
                      onChange={(e) => setNewRecruitment({ ...newRecruitment, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Son Başvuru</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newRecruitment.deadline}
                      onChange={(e) => setNewRecruitment({ ...newRecruitment, deadline: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İş Tanımı</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newRecruitment.description}
                    onChange={(e) => setNewRecruitment({ ...newRecruitment, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gereksinimler</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newRecruitment.requirements}
                    onChange={(e) => setNewRecruitment({ ...newRecruitment, requirements: e.target.value })}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İlan Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddRecruitment(false)}
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
