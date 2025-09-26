import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const severity = searchParams.get('severity') || '';
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    let threats = [];

    if (supabase) {
      // Supabase'den güvenlik tehditlerini çek
      let query = supabase
        .from('security_threats')
        .select(`
          id,
          title,
          description,
          severity,
          status,
          source_ip,
          user_agent,
          attack_type,
          created_at,
          resolved_at,
          resolved_by
        `)
        .order('created_at', { ascending: false });

      // Filtreler
      if (severity) {
        query = query.eq('severity', severity);
      }
      if (status) {
        query = query.eq('status', status);
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,attack_type.ilike.%${search}%`);
      }

      // Sayfalama
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase security threats error:', error);
        throw error;
      }

      threats = data?.map(threat => ({
        id: threat.id,
        title: threat.title,
        description: threat.description || '',
        severity: threat.severity || 'low',
        status: threat.status || 'active',
        sourceIp: threat.source_ip || '',
        userAgent: threat.user_agent || '',
        attackType: threat.attack_type || '',
        createdAt: threat.created_at,
        resolvedAt: threat.resolved_at,
        resolvedBy: threat.resolved_by
      })) || [];

    } else {
      // Fallback: Mock data
      threats = [
        {
          id: '1',
          title: 'SQL Injection Attempt',
          description: 'Malicious SQL injection attempt detected from suspicious IP address',
          severity: 'critical',
          status: 'blocked',
          sourceIp: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          attackType: 'SQL Injection',
          createdAt: '2024-01-20T10:30:00Z',
          resolvedAt: '2024-01-20T10:35:00Z',
          resolvedBy: 'admin@company.com'
        },
        {
          id: '2',
          title: 'Brute Force Attack',
          description: 'Multiple failed login attempts detected from same IP address',
          severity: 'high',
          status: 'active',
          sourceIp: '10.0.0.50',
          userAgent: 'curl/7.68.0',
          attackType: 'Brute Force',
          createdAt: '2024-01-20T09:15:00Z',
          resolvedAt: null,
          resolvedBy: null
        },
        {
          id: '3',
          title: 'XSS Attack Attempt',
          description: 'Cross-site scripting attack detected in form submission',
          severity: 'medium',
          status: 'blocked',
          sourceIp: '172.16.0.25',
          userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36',
          attackType: 'XSS',
          createdAt: '2024-01-20T08:45:00Z',
          resolvedAt: '2024-01-20T08:50:00Z',
          resolvedBy: 'security@company.com'
        },
        {
          id: '4',
          title: 'Suspicious File Upload',
          description: 'Attempt to upload potentially malicious file detected',
          severity: 'high',
          status: 'blocked',
          sourceIp: '203.0.113.42',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          attackType: 'File Upload',
          createdAt: '2024-01-20T07:20:00Z',
          resolvedAt: '2024-01-20T07:25:00Z',
          resolvedBy: 'admin@company.com'
        },
        {
          id: '5',
          title: 'DDoS Attack',
          description: 'Distributed Denial of Service attack detected',
          severity: 'critical',
          status: 'mitigated',
          sourceIp: 'Multiple',
          userAgent: 'Various',
          attackType: 'DDoS',
          createdAt: '2024-01-19T15:30:00Z',
          resolvedAt: '2024-01-19T16:00:00Z',
          resolvedBy: 'security@company.com'
        }
      ];
    }

    return NextResponse.json({
      success: true,
      data: threats,
      pagination: {
        page,
        limit,
        total: threats.length
      }
    });

  } catch (error) {
    console.error('Security threats error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch security threats',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, ...threatData } = body;

    if (action === 'update' && id) {
      if (supabase) {
        const { data, error } = await supabase
          .from('security_threats')
          .update({
            status: threatData.status,
            resolved_at: threatData.status === 'resolved' ? new Date().toISOString() : null,
            resolved_by: threatData.resolved_by,
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
          message: 'Security threat updated successfully',
          data
        });
      } else {
        // Fallback: Mock update
        return NextResponse.json({
          success: true,
          message: 'Security threat updated successfully (mock)',
          data: { id, ...threatData }
        });
      }
    }

    if (action === 'delete' && id) {
      if (supabase) {
        const { error } = await supabase
          .from('security_threats')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Security threat deleted successfully'
        });
      } else {
        // Fallback: Mock delete
        return NextResponse.json({
          success: true,
          message: 'Security threat deleted successfully (mock)'
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Security threats error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process security threat request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
