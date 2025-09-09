import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

// HR verilerini getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const employeeId = searchParams.get('employee_id');

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    if (type === 'dashboard') {
      // HR Dashboard verileri
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('id, employment_status, hire_date, department_id, position_id');

      if (employeesError) {
        console.error('Employees fetch error:', employeesError);
        return NextResponse.json({ 
          success: false, 
          error: 'Çalışan verileri alınamadı' 
        }, { status: 500 });
      }

      // Performans değerlendirmeleri
      const { data: performanceReviews, error: performanceError } = await supabase
        .from('performance_reviews')
        .select('id, overall_rating, goals_achieved, goals_total, review_period');

      // Eğitim programları
      const { data: trainings, error: trainingError } = await supabase
        .from('trainings')
        .select('id, title, training_type, start_date, end_date');

      // İş ilanları
      const { data: recruitments, error: recruitmentError } = await supabase
        .from('recruitments')
        .select('id, position_title, department, deadline');

      // İstatistikler
      const totalEmployees = employees?.length || 0;
      const activeEmployees = employees?.filter(e => e.employment_status === 'active').length || 0;
      const newHires = employees?.filter(e => {
        const hireDate = new Date(e.hire_date);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return hireDate >= sixMonthsAgo;
      }).length || 0;

      // Departman dağılımı
      const departmentStats = employees?.reduce((acc, employee) => {
        const deptId = employee.department_id;
        acc[deptId] = (acc[deptId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Performans istatistikleri
      const avgPerformanceRating = performanceReviews?.length > 0 
        ? performanceReviews.reduce((sum, review) => sum + review.overall_rating, 0) / performanceReviews.length 
        : 0;

      // Aktif eğitim programları
      const activeTrainings = trainings?.filter(training => {
        const endDate = new Date(training.end_date);
        return endDate >= new Date();
      }).length || 0;

      // Açık iş ilanları
      const openRecruitments = recruitments?.filter(recruitment => {
        const deadline = new Date(recruitment.deadline);
        return deadline >= new Date();
      }).length || 0;

      return NextResponse.json({
        success: true,
        data: {
          totalEmployees,
          activeEmployees,
          newHires,
          departmentStats,
          avgPerformanceRating: Math.round(avgPerformanceRating * 10) / 10,
          activeTrainings,
          openRecruitments
        }
      });
    }

    if (type === 'employees') {
      // Çalışanları getir
      const { data: employees, error } = await supabase
        .from('employees')
        .select(`
          *,
          department:department_id (
            name
          ),
          position:position_id (
            title
          ),
          manager:manager_id (
            first_name,
            last_name
          )
        `)
        .order('hire_date', { ascending: false });

      if (error) {
        console.error('Employees fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Çalışanlar alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        employees: employees || []
      });
    }

    if (type === 'departments') {
      // Departmanları getir
      const { data: departments, error } = await supabase
        .from('departments')
        .select(`
          *,
          manager:manager_id (
            first_name,
            last_name
          )
        `)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Departments fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Departmanlar alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        departments: departments || []
      });
    }

    if (type === 'positions') {
      // Pozisyonları getir
      const { data: positions, error } = await supabase
        .from('positions')
        .select(`
          *,
          department:department_id (
            name
          )
        `)
        .eq('is_active', true)
        .order('title', { ascending: true });

      if (error) {
        console.error('Positions fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Pozisyonlar alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        positions: positions || []
      });
    }

    if (type === 'payrolls') {
      // Maaş bordrolarını getir
      const { data: payrolls, error } = await supabase
        .from('payrolls')
        .select(`
          *,
          employee:employee_id (
            first_name,
            last_name,
            employee_number
          )
        `)
        .order('payroll_period', { ascending: false });

      if (error) {
        console.error('Payrolls fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Maaş bordroları alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        payrolls: payrolls || []
      });
    }

    if (type === 'leave_requests') {
      // İzin taleplerini getir
      const { data: leaveRequests, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          employee:employee_id (
            first_name,
            last_name,
            employee_number
          ),
          leave_type:leave_type_id (
            name
          ),
          approver:approved_by (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Leave requests fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'İzin talepleri alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        leaveRequests: leaveRequests || []
      });
    }

    if (type === 'performance_reviews') {
      // Performans değerlendirmelerini getir
      const { data: performanceReviews, error } = await supabase
        .from('performance_reviews')
        .select(`
          *,
          employee:employee_id (
            first_name,
            last_name,
            employee_number
          ),
          reviewer:reviewer_id (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Performance reviews fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Performans değerlendirmeleri alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        performanceReviews: performanceReviews || []
      });
    }

    if (type === 'trainings') {
      // Eğitim programlarını getir
      const { data: trainings, error } = await supabase
        .from('trainings')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Trainings fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Eğitim programları alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        trainings: trainings || []
      });
    }

    if (type === 'recruitments') {
      // İş ilanlarını getir
      const { data: recruitments, error } = await supabase
        .from('recruitments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Recruitments fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'İş ilanları alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        recruitments: recruitments || []
      });
    }

    if (type === 'performance_reviews') {
      // Performans değerlendirmelerini getir
      const { data: reviews, error } = await supabase
        .from('performance_reviews')
        .select(`
          *,
          employee:employee_id (
            first_name,
            last_name,
            employee_number
          ),
          reviewer:reviewer_id (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Performance reviews fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Performans değerlendirmeleri alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        reviews: reviews || []
      });
    }

    if (type === 'trainings') {
      // Eğitimleri getir
      const { data: trainings, error } = await supabase
        .from('trainings')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Trainings fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Eğitimler alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        trainings: trainings || []
      });
    }

    if (type === 'leave_types') {
      // İzin türlerini getir
      const { data: leaveTypes, error } = await supabase
        .from('leave_types')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Leave types fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'İzin türleri alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        leaveTypes: leaveTypes || []
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Geçersiz tip parametresi' 
    }, { status: 400 });

  } catch (error) {
    console.error('HR API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// HR işlemleri
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    if (action === 'create_employee') {
      const {
        first_name,
        last_name,
        email,
        phone,
        department_id,
        position_id,
        manager_id,
        employment_type,
        hire_date,
        base_salary,
        sgk_number,
        tc_number,
        created_by
      } = data;

      // Çalışan numarası oluştur
      const employeeNumber = `EMP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

      const { data: newEmployee, error } = await supabase
        .from('employees')
        .insert({
          employee_number: employeeNumber,
          first_name,
          last_name,
          email,
          phone,
          department_id,
          position_id,
          manager_id,
          employment_type: employment_type || 'full_time',
          hire_date,
          base_salary: parseFloat(base_salary),
          sgk_number,
          tc_number,
          created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Create employee error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Çalışan oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        employee: newEmployee
      });
    }

    if (action === 'create_department') {
      const {
        name,
        code,
        description,
        manager_id,
        budget
      } = data;

      const { data: newDepartment, error } = await supabase
        .from('departments')
        .insert({
          name,
          code: code.toUpperCase(),
          description,
          manager_id,
          budget: budget ? parseFloat(budget) : null
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return NextResponse.json({ 
            success: false, 
            error: 'Bu departman kodu zaten kullanılıyor' 
          }, { status: 400 });
        }
        console.error('Create department error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Departman oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        department: newDepartment
      });
    }

    if (action === 'create_position') {
      const {
        title,
        code,
        department_id,
        description,
        requirements,
        responsibilities,
        min_salary,
        max_salary
      } = data;

      const { data: newPosition, error } = await supabase
        .from('positions')
        .insert({
          title,
          code: code.toUpperCase(),
          department_id,
          description,
          requirements,
          responsibilities,
          min_salary: min_salary ? parseFloat(min_salary) : null,
          max_salary: max_salary ? parseFloat(max_salary) : null
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return NextResponse.json({ 
            success: false, 
            error: 'Bu pozisyon kodu zaten kullanılıyor' 
          }, { status: 400 });
        }
        console.error('Create position error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Pozisyon oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        position: newPosition
      });
    }

    if (action === 'create_payroll') {
      const {
        employee_id,
        payroll_period,
        base_salary,
        overtime_pay,
        bonus,
        commission,
        allowance,
        other_income,
        income_tax,
        stamp_tax,
        sgk_employee,
        sgk_employer,
        unemployment_employee,
        unemployment_employer,
        other_deductions,
        notes,
        created_by
      } = data;

      const { data: newPayroll, error } = await supabase
        .from('payrolls')
        .insert({
          employee_id,
          payroll_period,
          base_salary: parseFloat(base_salary),
          overtime_pay: parseFloat(overtime_pay) || 0,
          bonus: parseFloat(bonus) || 0,
          commission: parseFloat(commission) || 0,
          allowance: parseFloat(allowance) || 0,
          other_income: parseFloat(other_income) || 0,
          income_tax: parseFloat(income_tax) || 0,
          stamp_tax: parseFloat(stamp_tax) || 0,
          sgk_employee: parseFloat(sgk_employee) || 0,
          sgk_employer: parseFloat(sgk_employer) || 0,
          unemployment_employee: parseFloat(unemployment_employee) || 0,
          unemployment_employer: parseFloat(unemployment_employer) || 0,
          other_deductions: parseFloat(other_deductions) || 0,
          notes,
          created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Create payroll error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Maaş bordrosu oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        payroll: newPayroll
      });
    }

    if (action === 'create_leave_request') {
      const {
        employee_id,
        leave_type_id,
        start_date,
        end_date,
        reason
      } = data;

      // Toplam gün sayısını hesapla
      const start = new Date(start_date);
      const end = new Date(end_date);
      const timeDiff = end.getTime() - start.getTime();
      const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

      const { data: newLeaveRequest, error } = await supabase
        .from('leave_requests')
        .insert({
          employee_id,
          leave_type_id,
          start_date,
          end_date,
          total_days: totalDays,
          reason
        })
        .select()
        .single();

      if (error) {
        console.error('Create leave request error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'İzin talebi oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        leaveRequest: newLeaveRequest
      });
    }

    if (action === 'create_training') {
      const {
        title,
        description,
        training_type,
        provider,
        duration_hours,
        cost,
        max_participants,
        start_date,
        end_date,
        location,
        is_mandatory,
        created_by
      } = data;

      const { data: newTraining, error } = await supabase
        .from('trainings')
        .insert({
          title,
          description,
          training_type,
          provider,
          duration_hours: duration_hours ? parseInt(duration_hours) : null,
          cost: cost ? parseFloat(cost) : null,
          max_participants: max_participants ? parseInt(max_participants) : null,
          start_date,
          end_date,
          location,
          is_mandatory: is_mandatory || false,
          created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Create training error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Eğitim oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        training: newTraining
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Geçersiz işlem' 
    }, { status: 400 });

  } catch (error) {
    console.error('HR POST API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// HR güncelleme işlemleri
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    if (action === 'update_employee') {
      const { employee_id, ...updateData } = data;

      const { data: updatedEmployee, error } = await supabase
        .from('employees')
        .update(updateData)
        .eq('id', employee_id)
        .select()
        .single();

      if (error) {
        console.error('Update employee error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Çalışan güncellenemedi' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        employee: updatedEmployee
      });
    }

    if (action === 'approve_leave_request') {
      const { leave_request_id, approved_by } = data;

      const { data: updatedRequest, error } = await supabase
        .from('leave_requests')
        .update({
          status: 'approved',
          approved_by,
          approved_at: new Date().toISOString()
        })
        .eq('id', leave_request_id)
        .select()
        .single();

      if (error) {
        console.error('Approve leave request error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'İzin talebi onaylanamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        leaveRequest: updatedRequest
      });
    }

    if (action === 'reject_leave_request') {
      const { leave_request_id, rejection_reason, approved_by } = data;

      const { data: updatedRequest, error } = await supabase
        .from('leave_requests')
        .update({
          status: 'rejected',
          rejection_reason,
          approved_by,
          approved_at: new Date().toISOString()
        })
        .eq('id', leave_request_id)
        .select()
        .single();

      if (error) {
        console.error('Reject leave request error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'İzin talebi reddedilemedi' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        leaveRequest: updatedRequest
      });
    }

    if (action === 'create_performance_review') {
      const {
        employee_id,
        review_period,
        overall_rating,
        goals_achieved,
        goals_total,
        feedback,
        reviewer_id,
        created_by
      } = data;

      const { data: newReview, error } = await supabase
        .from('performance_reviews')
        .insert({
          employee_id,
          review_period,
          overall_rating: parseFloat(overall_rating),
          goals_achieved: parseInt(goals_achieved),
          goals_total: parseInt(goals_total),
          feedback,
          reviewer_id,
          created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Create performance review error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Performans değerlendirmesi oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        performanceReview: newReview
      });
    }

    if (action === 'create_training') {
      const {
        title,
        description,
        training_type,
        duration_hours,
        start_date,
        end_date,
        instructor,
        max_participants,
        requirements,
        created_by
      } = data;

      const { data: newTraining, error } = await supabase
        .from('trainings')
        .insert({
          title,
          description,
          training_type,
          duration_hours: parseInt(duration_hours),
          start_date,
          end_date,
          instructor,
          max_participants: parseInt(max_participants),
          requirements,
          created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Create training error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Eğitim programı oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        training: newTraining
      });
    }

    if (action === 'create_recruitment') {
      const {
        position_title,
        department,
        salary_range,
        requirements,
        deadline,
        description,
        location,
        employment_type,
        created_by
      } = data;

      const { data: newRecruitment, error } = await supabase
        .from('recruitments')
        .insert({
          position_title,
          department,
          salary_range,
          requirements,
          deadline,
          description,
          location,
          employment_type,
          created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Create recruitment error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'İş ilanı oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        recruitment: newRecruitment
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Geçersiz işlem' 
    }, { status: 400 });

  } catch (error) {
    console.error('HR PUT API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
