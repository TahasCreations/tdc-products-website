import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const status = searchParams.get('status') || '';

    let employees = [];

    if (supabase) {
      // Supabase'den çalışanları çek
      let query = supabase
        .from('employees')
        .select(`
          id,
          employee_number,
          first_name,
          last_name,
          email,
          phone,
          employment_type,
          employment_status,
          hire_date,
          base_salary,
          department_id,
          position_id,
          manager_id,
          departments!inner(name),
          positions!inner(title),
          managers!inner(first_name, last_name)
        `)
        .order('hire_date', { ascending: false });

      // Filtreler
      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,employee_number.ilike.%${search}%`);
      }
      if (department) {
        query = query.eq('department_id', department);
      }
      if (status) {
        query = query.eq('employment_status', status);
      }

      // Sayfalama
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase employees error:', error);
        throw error;
      }

      employees = data?.map(employee => ({
        id: employee.id,
        employee_number: employee.employee_number,
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone,
        employment_type: employee.employment_type,
        employment_status: employee.employment_status,
        hire_date: employee.hire_date,
        base_salary: employee.base_salary || 0,
        department: {
          name: (employee.departments as any)?.name || 'Bilinmeyen Departman'
        },
        position: {
          title: (employee.positions as any)?.title || 'Bilinmeyen Pozisyon'
        },
        manager: {
          first_name: (employee.managers as any)?.first_name || '',
          last_name: (employee.managers as any)?.last_name || ''
        }
      })) || [];

    } else {
      // Fallback: Mock data
      employees = [
        {
          id: '1',
          employee_number: 'EMP-001',
          first_name: 'Ahmet',
          last_name: 'Yılmaz',
          email: 'ahmet@company.com',
          phone: '+90 555 123 4567',
          employment_type: 'Tam Zamanlı',
          employment_status: 'active',
          hire_date: '2023-01-15T10:00:00Z',
          base_salary: 15000,
          department: {
            name: 'İnsan Kaynakları'
          },
          position: {
            title: 'İK Uzmanı'
          },
          manager: {
            first_name: 'Fatma',
            last_name: 'Demir'
          }
        },
        {
          id: '2',
          employee_number: 'EMP-002',
          first_name: 'Mehmet',
          last_name: 'Kaya',
          email: 'mehmet@company.com',
          phone: '+90 555 987 6543',
          employment_type: 'Tam Zamanlı',
          employment_status: 'active',
          hire_date: '2023-03-20T10:00:00Z',
          base_salary: 18000,
          department: {
            name: 'Pazarlama'
          },
          position: {
            title: 'Pazarlama Müdürü'
          },
          manager: {
            first_name: 'Ayşe',
            last_name: 'Özkan'
          }
        }
      ];
    }

    return NextResponse.json({
      success: true,
      data: employees,
      pagination: {
        page,
        limit,
        total: employees.length
      }
    });

  } catch (error) {
    console.error('HR employees error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch employees',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, ...employeeData } = body;

    if (action === 'create') {
      if (supabase) {
        const { data, error } = await supabase
          .from('employees')
          .insert([{
            employee_number: employeeData.employee_number,
            first_name: employeeData.first_name,
            last_name: employeeData.last_name,
            email: employeeData.email,
            phone: employeeData.phone,
            employment_type: employeeData.employment_type,
            employment_status: employeeData.employment_status || 'active',
            hire_date: employeeData.hire_date,
            base_salary: parseFloat(employeeData.base_salary) || 0,
            department_id: employeeData.department_id,
            position_id: employeeData.position_id,
            manager_id: employeeData.manager_id
          }])
          .select()
          .single();

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Employee created successfully',
          data
        });
      } else {
        // Fallback: Mock creation
        const newEmployee = {
          id: Date.now().toString(),
          ...employeeData,
          hire_date: employeeData.hire_date || new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          message: 'Employee created successfully (mock)',
          data: newEmployee
        });
      }
    }

    if (action === 'update' && id) {
      if (supabase) {
        const { data, error } = await supabase
          .from('employees')
          .update({
            first_name: employeeData.first_name,
            last_name: employeeData.last_name,
            email: employeeData.email,
            phone: employeeData.phone,
            employment_type: employeeData.employment_type,
            employment_status: employeeData.employment_status,
            base_salary: parseFloat(employeeData.base_salary) || 0,
            department_id: employeeData.department_id,
            position_id: employeeData.position_id,
            manager_id: employeeData.manager_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Employee updated successfully',
          data
        });
      } else {
        // Fallback: Mock update
        return NextResponse.json({
          success: true,
          message: 'Employee updated successfully (mock)',
          data: { id, ...employeeData }
        });
      }
    }

    if (action === 'delete' && id) {
      if (supabase) {
        const { error } = await supabase
          .from('employees')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Employee deleted successfully'
        });
      } else {
        // Fallback: Mock delete
        return NextResponse.json({
          success: true,
          message: 'Employee deleted successfully (mock)'
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('HR employees error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process employee request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
