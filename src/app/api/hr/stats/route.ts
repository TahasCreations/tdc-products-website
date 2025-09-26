import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // İK istatistiklerini hesapla
    const stats = {
      totalEmployees: 0,
      activeEmployees: 0,
      newHires: 0,
      departmentStats: {
        'İnsan Kaynakları': 0,
        'Muhasebe': 0,
        'Pazarlama': 0,
        'Satış': 0,
        'Teknoloji': 0,
        'Operasyon': 0
      }
    };

    if (supabase) {
      // Gerçek verilerden hesapla
      const [employeesResult, departmentsResult] = await Promise.all([
        supabase.from('employees').select('id, employment_status, hire_date, department_id'),
        supabase.from('departments').select('id, name')
      ]);

      const employees = employeesResult.data || [];
      const departments = departmentsResult.data || [];

      // Toplam çalışan sayısı
      stats.totalEmployees = employees.length;

      // Aktif çalışan sayısı
      stats.activeEmployees = employees.filter(emp => emp.employment_status === 'active').length;

      // Son 30 gün içindeki yeni işe alımlar
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      stats.newHires = employees.filter(emp => 
        new Date(emp.hire_date) >= thirtyDaysAgo
      ).length;

      // Departman istatistikleri
      employees.forEach(employee => {
        const department = departments.find(dept => dept.id === employee.department_id);
        if (department) {
          const deptName = department.name;
          if (stats.departmentStats[deptName as keyof typeof stats.departmentStats] !== undefined) {
            stats.departmentStats[deptName as keyof typeof stats.departmentStats]++;
          }
        }
      });

    } else {
      // Fallback: Mock data
      stats.totalEmployees = 45;
      stats.activeEmployees = 42;
      stats.newHires = 3;
      stats.departmentStats = {
        'İnsan Kaynakları': 5,
        'Muhasebe': 8,
        'Pazarlama': 12,
        'Satış': 15,
        'Teknoloji': 10,
        'Operasyon': 7
      };
    }

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('HR stats error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch HR statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
