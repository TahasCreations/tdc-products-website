import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const severity = searchParams.get('severity') || '';
    const status = searchParams.get('status') || '';

    let vulnerabilities = [];

    if (supabase) {
      // Supabase'den güvenlik açıklarını çek
      let query = supabase
        .from('security_vulnerabilities')
        .select(`
          id,
          title,
          description,
          severity,
          status,
          cve_id,
          cvss_score,
          affected_systems,
          remediation,
          created_at,
          patched_at
        `)
        .order('created_at', { ascending: false });

      // Filtreler
      if (severity) {
        query = query.eq('severity', severity);
      }
      if (status) {
        query = query.eq('status', status);
      }

      // Sayfalama
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase security vulnerabilities error:', error);
        throw error;
      }

      vulnerabilities = data?.map(vuln => ({
        id: vuln.id,
        title: vuln.title,
        description: vuln.description || '',
        severity: vuln.severity || 'low',
        status: vuln.status || 'open',
        cveId: vuln.cve_id || '',
        cvssScore: vuln.cvss_score || 0,
        affectedSystems: vuln.affected_systems || [],
        remediation: vuln.remediation || '',
        createdAt: vuln.created_at,
        patchedAt: vuln.patched_at
      })) || [];

    } else {
      // Fallback: Mock data
      vulnerabilities = [
        {
          id: '1',
          title: 'SQL Injection Vulnerability',
          description: 'Application is vulnerable to SQL injection attacks through user input fields',
          severity: 'critical',
          status: 'open',
          cveId: 'CVE-2024-0001',
          cvssScore: 9.8,
          affectedSystems: ['Web Application', 'Database'],
          remediation: 'Implement parameterized queries and input validation',
          createdAt: '2024-01-20T10:00:00Z',
          patchedAt: null
        },
        {
          id: '2',
          title: 'Cross-Site Scripting (XSS)',
          description: 'Reflected XSS vulnerability in search functionality',
          severity: 'high',
          status: 'in_progress',
          cveId: 'CVE-2024-0002',
          cvssScore: 7.5,
          affectedSystems: ['Frontend', 'Search Module'],
          remediation: 'Implement proper output encoding and CSP headers',
          createdAt: '2024-01-19T15:30:00Z',
          patchedAt: null
        },
        {
          id: '3',
          title: 'Insecure Direct Object Reference',
          description: 'Users can access resources they are not authorized to view',
          severity: 'medium',
          status: 'open',
          cveId: 'CVE-2024-0003',
          cvssScore: 5.4,
          affectedSystems: ['API', 'User Management'],
          remediation: 'Implement proper authorization checks',
          createdAt: '2024-01-18T09:15:00Z',
          patchedAt: null
        },
        {
          id: '4',
          title: 'Weak Password Policy',
          description: 'Password requirements are not strong enough',
          severity: 'medium',
          status: 'resolved',
          cveId: 'CVE-2024-0004',
          cvssScore: 4.2,
          affectedSystems: ['Authentication System'],
          remediation: 'Implement stronger password requirements',
          createdAt: '2024-01-17T14:20:00Z',
          patchedAt: '2024-01-18T10:30:00Z'
        },
        {
          id: '5',
          title: 'Missing Security Headers',
          description: 'Important security headers are not implemented',
          severity: 'low',
          status: 'open',
          cveId: 'CVE-2024-0005',
          cvssScore: 3.1,
          affectedSystems: ['Web Server', 'Application'],
          remediation: 'Add security headers (HSTS, CSP, X-Frame-Options)',
          createdAt: '2024-01-16T11:45:00Z',
          patchedAt: null
        }
      ];
    }

    return NextResponse.json({
      success: true,
      data: vulnerabilities,
      pagination: {
        page,
        limit,
        total: vulnerabilities.length
      }
    });

  } catch (error) {
    console.error('Security vulnerabilities error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch security vulnerabilities',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
