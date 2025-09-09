import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseKey);
};
import { ApiWrapper } from '@/lib/api-wrapper';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'employees':
        return await getEmployees(supabase, searchParams);
      case 'departments':
        return await getDepartments(supabase);
      case 'positions':
        return await getPositions(supabase);
      case 'salary-components':
        return await getSalaryComponents(supabase);
      case 'payroll-periods':
        return await getPayrollPeriods(supabase, searchParams);
      case 'payroll-records':
        return await getPayrollRecords(supabase, searchParams);
      case 'leave-types':
        return await getLeaveTypes(supabase);
      case 'leave-requests':
        return await getLeaveRequests(supabase, searchParams);
      case 'overtime-records':
        return await getOvertimeRecords(supabase, searchParams);
      case 'performance-reviews':
        return await getPerformanceReviews(supabase, searchParams);
      case 'payroll-templates':
        return await getPayrollTemplates(supabase);
      case 'payroll-logs':
        return await getPayrollLogs(supabase, searchParams);
      case 'employee-salary':
        return await getEmployeeSalary(supabase, searchParams);
      case 'payroll-summary':
        return await getPayrollSummary(supabase, searchParams);
      default:
        return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
    }
  } catch (error) {
    console.error('Payroll GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create_employee':
        return await createEmployee(supabase, body);
      case 'update_employee':
        return await updateEmployee(supabase, body);
      case 'create_department':
        return await createDepartment(supabase, body);
      case 'update_department':
        return await updateDepartment(supabase, body);
      case 'create_position':
        return await createPosition(supabase, body);
      case 'update_position':
        return await updatePosition(supabase, body);
      case 'create_salary_component':
        return await createSalaryComponent(supabase, body);
      case 'update_salary_component':
        return await updateSalaryComponent(supabase, body);
      case 'create_payroll_period':
        return await createPayrollPeriod(supabase, body);
      case 'update_payroll_period':
        return await updatePayrollPeriod(supabase, body);
      case 'process_payroll':
        return await processPayroll(supabase, body);
      case 'approve_payroll':
        return await approvePayroll(supabase, body);
      case 'create_leave_request':
        return await createLeaveRequest(supabase, body);
      case 'update_leave_request':
        return await updateLeaveRequest(supabase, body);
      case 'create_overtime_record':
        return await createOvertimeRecord(supabase, body);
      case 'update_overtime_record':
        return await updateOvertimeRecord(supabase, body);
      case 'create_performance_review':
        return await createPerformanceReview(supabase, body);
      case 'update_performance_review':
        return await updatePerformanceReview(supabase, body);
      case 'calculate_salary':
        return await calculateSalary(supabase, body);
      case 'export_payroll':
        return await exportPayroll(supabase, body);
      default:
        return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
    }
  } catch (error) {
    console.error('Payroll POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    }

    switch (action) {
      case 'delete_employee':
        return await deleteEmployee(supabase, id);
      case 'delete_department':
        return await deleteDepartment(supabase, id);
      case 'delete_position':
        return await deletePosition(supabase, id);
      case 'delete_salary_component':
        return await deleteSalaryComponent(supabase, id);
      case 'delete_payroll_period':
        return await deletePayrollPeriod(supabase, id);
      case 'delete_leave_request':
        return await deleteLeaveRequest(supabase, id);
      case 'delete_overtime_record':
        return await deleteOvertimeRecord(supabase, id);
      case 'delete_performance_review':
        return await deletePerformanceReview(supabase, id);
      default:
        return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
    }
  } catch (error) {
    console.error('Payroll DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Çalışanlar
async function getEmployees(supabase: any, searchParams: URLSearchParams) {
  const departmentId = searchParams.get('department_id');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('employees')
    .select(`
      *,
      departments (
        name,
        code
      ),
      positions (
        title,
        code
      ),
      employee_salaries (
        base_salary,
        effective_date
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (departmentId) {
    query = query.eq('department_id', departmentId);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Departmanlar
async function getDepartments(supabase: any) {
  const { data, error } = await supabase
    .from('departments')
    .select(`
      *,
      employees (
        id,
        first_name,
        last_name
      )
    `)
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return NextResponse.json({ data });
}

// Pozisyonlar
async function getPositions(supabase: any) {
  const { data, error } = await supabase
    .from('positions')
    .select(`
      *,
      departments (
        name,
        code
      )
    `)
    .eq('is_active', true)
    .order('title');

  if (error) throw error;
  return NextResponse.json({ data });
}

// Maaş bileşenleri
async function getSalaryComponents(supabase: any) {
  const { data, error } = await supabase
    .from('salary_components')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return NextResponse.json({ data });
}

// Bordro dönemleri
async function getPayrollPeriods(supabase: any, searchParams: URLSearchParams) {
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('payroll_periods')
    .select('*')
    .order('start_date', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Bordro kayıtları
async function getPayrollRecords(supabase: any, searchParams: URLSearchParams) {
  const periodId = searchParams.get('period_id');
  const employeeId = searchParams.get('employee_id');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('payroll_records')
    .select(`
      *,
      employees (
        first_name,
        last_name,
        employee_number
      ),
      payroll_periods (
        period_name,
        start_date,
        end_date
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (periodId) {
    query = query.eq('period_id', periodId);
  }

  if (employeeId) {
    query = query.eq('employee_id', employeeId);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// İzin türleri
async function getLeaveTypes(supabase: any) {
  const { data, error } = await supabase
    .from('leave_types')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return NextResponse.json({ data });
}

// İzin talepleri
async function getLeaveRequests(supabase: any, searchParams: URLSearchParams) {
  const employeeId = searchParams.get('employee_id');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('leave_requests')
    .select(`
      *,
      employees (
        first_name,
        last_name,
        employee_number
      ),
      leave_types (
        name,
        code
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (employeeId) {
    query = query.eq('employee_id', employeeId);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Mesai kayıtları
async function getOvertimeRecords(supabase: any, searchParams: URLSearchParams) {
  const employeeId = searchParams.get('employee_id');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('overtime_records')
    .select(`
      *,
      employees (
        first_name,
        last_name,
        employee_number
      )
    `)
    .order('date', { ascending: false })
    .limit(limit);

  if (employeeId) {
    query = query.eq('employee_id', employeeId);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Performans değerlendirmeleri
async function getPerformanceReviews(supabase: any, searchParams: URLSearchParams) {
  const employeeId = searchParams.get('employee_id');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('performance_reviews')
    .select(`
      *,
      employees (
        first_name,
        last_name,
        employee_number
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (employeeId) {
    query = query.eq('employee_id', employeeId);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Bordro şablonları
async function getPayrollTemplates(supabase: any) {
  const { data, error } = await supabase
    .from('payroll_templates')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return NextResponse.json({ data });
}

// Bordro logları
async function getPayrollLogs(supabase: any, searchParams: URLSearchParams) {
  const periodId = searchParams.get('period_id');
  const employeeId = searchParams.get('employee_id');
  const limit = parseInt(searchParams.get('limit') || '100');

  let query = supabase
    .from('payroll_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (periodId) {
    query = query.eq('period_id', periodId);
  }

  if (employeeId) {
    query = query.eq('employee_id', employeeId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Çalışan maaş bilgisi
async function getEmployeeSalary(supabase: any, searchParams: URLSearchParams) {
  const employeeId = searchParams.get('employee_id');

  if (!employeeId) {
    return NextResponse.json({ error: 'Çalışan ID gerekli' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('employee_salaries')
    .select(`
      *,
      employee_salary_components (
        amount,
        effective_date,
        salary_components (
          name,
          code,
          component_type,
          calculation_type
        )
      )
    `)
    .eq('employee_id', employeeId)
    .eq('is_active', true)
    .order('effective_date', { ascending: false });

  if (error) throw error;
  return NextResponse.json({ data });
}

// Bordro özeti
async function getPayrollSummary(supabase: any, searchParams: URLSearchParams) {
  const periodId = searchParams.get('period_id');

  if (!periodId) {
    return NextResponse.json({ error: 'Dönem ID gerekli' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('payroll_periods')
    .select(`
      *,
      payroll_records (
        gross_salary,
        net_salary,
        total_allowances,
        total_deductions,
        total_taxes
      )
    `)
    .eq('id', periodId)
    .single();

  if (error) throw error;

  // Özet hesaplamaları
  const summary = {
    total_employees: data.payroll_records.length,
    total_gross_salary: data.payroll_records.reduce((sum: number, record: any) => sum + record.gross_salary, 0),
    total_net_salary: data.payroll_records.reduce((sum: number, record: any) => sum + record.net_salary, 0),
    total_allowances: data.payroll_records.reduce((sum: number, record: any) => sum + record.total_allowances, 0),
    total_deductions: data.payroll_records.reduce((sum: number, record: any) => sum + record.total_deductions, 0),
    total_taxes: data.payroll_records.reduce((sum: number, record: any) => sum + record.total_taxes, 0)
  };

  return NextResponse.json({ data: { ...data, summary } });
}

// Çalışan oluştur
async function createEmployee(supabase: any, body: any) {
  const { 
    employee_number, 
    first_name, 
    last_name, 
    email, 
    phone, 
    address, 
    city, 
    postal_code, 
    birth_date, 
    hire_date, 
    department_id, 
    position_id, 
    manager_id, 
    employment_type 
  } = body;

  const { data, error } = await supabase
    .from('employees')
    .insert({
      employee_number,
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      postal_code,
      birth_date,
      hire_date,
      department_id,
      position_id,
      manager_id,
      employment_type: employment_type || 'full_time'
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Çalışan güncelle
async function updateEmployee(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('employees')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Departman oluştur
async function createDepartment(supabase: any, body: any) {
  const { name, code, description, manager_id, parent_department_id, budget } = body;

  const { data, error } = await supabase
    .from('departments')
    .insert({
      name,
      code,
      description,
      manager_id,
      parent_department_id,
      budget
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Departman güncelle
async function updateDepartment(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('departments')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Pozisyon oluştur
async function createPosition(supabase: any, body: any) {
  const { title, code, description, department_id, level, min_salary, max_salary } = body;

  const { data, error } = await supabase
    .from('positions')
    .insert({
      title,
      code,
      description,
      department_id,
      level: level || 1,
      min_salary,
      max_salary
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Pozisyon güncelle
async function updatePosition(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('positions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Maaş bileşeni oluştur
async function createSalaryComponent(supabase: any, body: any) {
  const { 
    name, 
    code, 
    component_type, 
    calculation_type, 
    calculation_value, 
    is_taxable, 
    is_mandatory, 
    description 
  } = body;

  const { data, error } = await supabase
    .from('salary_components')
    .insert({
      name,
      code,
      component_type,
      calculation_type,
      calculation_value,
      is_taxable: is_taxable || false,
      is_mandatory: is_mandatory || false,
      description
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Maaş bileşeni güncelle
async function updateSalaryComponent(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('salary_components')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Bordro dönemi oluştur
async function createPayrollPeriod(supabase: any, body: any) {
  const { period_name, period_type, start_date, end_date, pay_date } = body;

  const { data, error } = await supabase
    .from('payroll_periods')
    .insert({
      period_name,
      period_type,
      start_date,
      end_date,
      pay_date
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Bordro dönemi güncelle
async function updatePayrollPeriod(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('payroll_periods')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Bordro işle
async function processPayroll(supabase: any, body: any) {
  const { period_id } = body;

  // Mock bordro işleme
  const mockPayrollData = {
    period_id,
    total_employees: 25,
    total_gross_pay: 750000,
    total_net_pay: 600000,
    total_taxes: 112500,
    total_deductions: 37500,
    status: 'completed'
  };

  // Bordro dönemini güncelle
  await supabase
    .from('payroll_periods')
    .update({
      status: 'completed',
      total_employees: mockPayrollData.total_employees,
      total_gross_pay: mockPayrollData.total_gross_pay,
      total_net_pay: mockPayrollData.total_net_pay,
      total_taxes: mockPayrollData.total_taxes,
      total_deductions: mockPayrollData.total_deductions
    })
    .eq('id', period_id);

  return NextResponse.json({ data: mockPayrollData });
}

// Bordro onayla
async function approvePayroll(supabase: any, body: any) {
  const { period_id } = body;

  const { data, error } = await supabase
    .from('payroll_periods')
    .update({ status: 'approved' })
    .eq('id', period_id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// İzin talebi oluştur
async function createLeaveRequest(supabase: any, body: any) {
  const { employee_id, leave_type_id, start_date, end_date, total_days, reason } = body;

  const { data, error } = await supabase
    .from('leave_requests')
    .insert({
      employee_id,
      leave_type_id,
      start_date,
      end_date,
      total_days,
      reason
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// İzin talebi güncelle
async function updateLeaveRequest(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('leave_requests')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Mesai kaydı oluştur
async function createOvertimeRecord(supabase: any, body: any) {
  const { employee_id, date, start_time, end_time, total_hours, overtime_type } = body;

  const { data, error } = await supabase
    .from('overtime_records')
    .insert({
      employee_id,
      date,
      start_time,
      end_time,
      total_hours,
      overtime_type: overtime_type || 'regular'
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Mesai kaydı güncelle
async function updateOvertimeRecord(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('overtime_records')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Performans değerlendirmesi oluştur
async function createPerformanceReview(supabase: any, body: any) {
  const { 
    employee_id, 
    reviewer_id, 
    review_period_start, 
    review_period_end, 
    overall_rating, 
    goals_achieved, 
    total_goals, 
    strengths, 
    areas_for_improvement, 
    development_plan 
  } = body;

  const { data, error } = await supabase
    .from('performance_reviews')
    .insert({
      employee_id,
      reviewer_id,
      review_period_start,
      review_period_end,
      overall_rating,
      goals_achieved: goals_achieved || 0,
      total_goals: total_goals || 0,
      strengths,
      areas_for_improvement,
      development_plan
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Performans değerlendirmesi güncelle
async function updatePerformanceReview(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('performance_reviews')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Maaş hesapla
async function calculateSalary(supabase: any, body: any) {
  const { employee_id, period_start, period_end } = body;

  // Mock maaş hesaplama
  const mockCalculation = {
    base_salary: 25000,
    gross_salary: 27500,
    net_salary: 22000,
    allowances: {
      meal_allowance: 500,
      transport_allowance: 300,
      performance_bonus: 1700
    },
    deductions: {
      income_tax: 4125,
      social_security: 3850,
      unemployment_insurance: 275,
      health_insurance: 275
    },
    overtime: {
      hours: 8,
      rate: 1.5,
      pay: 1000
    }
  };

  return NextResponse.json({ data: mockCalculation });
}

// Bordro dışa aktar
async function exportPayroll(supabase: any, body: any) {
  const { period_id, format } = body;

  // Mock export işlemi
  const exportData = {
    file_path: `/exports/payroll_${period_id}.${format}`,
    file_size: Math.floor(Math.random() * 500000) + 100000,
    download_url: `/api/download/payroll/${period_id}`,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };

  return NextResponse.json({ data: exportData });
}

// Çalışan sil
async function deleteEmployee(supabase: any, id: string) {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Çalışan silindi' });
}

// Departman sil
async function deleteDepartment(supabase: any, id: string) {
  const { error } = await supabase
    .from('departments')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Departman silindi' });
}

// Pozisyon sil
async function deletePosition(supabase: any, id: string) {
  const { error } = await supabase
    .from('positions')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Pozisyon silindi' });
}

// Maaş bileşeni sil
async function deleteSalaryComponent(supabase: any, id: string) {
  const { error } = await supabase
    .from('salary_components')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Maaş bileşeni silindi' });
}

// Bordro dönemi sil
async function deletePayrollPeriod(supabase: any, id: string) {
  const { error } = await supabase
    .from('payroll_periods')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Bordro dönemi silindi' });
}

// İzin talebi sil
async function deleteLeaveRequest(supabase: any, id: string) {
  const { error } = await supabase
    .from('leave_requests')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'İzin talebi silindi' });
}

// Mesai kaydı sil
async function deleteOvertimeRecord(supabase: any, id: string) {
  const { error } = await supabase
    .from('overtime_records')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Mesai kaydı silindi' });
}

// Performans değerlendirmesi sil
async function deletePerformanceReview(supabase: any, id: string) {
  const { error } = await supabase
    .from('performance_reviews')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Performans değerlendirmesi silindi' });
}
