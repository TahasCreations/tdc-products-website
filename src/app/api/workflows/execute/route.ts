import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { workflowId, data } = await request.json();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock workflow execution
    const execution = {
      id: Date.now().toString(),
      workflowId,
      workflowName: 'Test İş Akışı',
      status: 'running',
      currentStep: 'İlk Adım',
      data,
      startedAt: new Date().toISOString(),
      steps: [
        { id: '1', stepId: '1', stepName: 'İlk Adım', status: 'running', startedAt: new Date().toISOString() }
      ]
    };

    return NextResponse.json(execution);

  } catch (error) {
    console.error('Workflow execution error:', error);
    return NextResponse.json(
      { error: 'İş akışı çalıştırılamadı' },
      { status: 500 }
    );
  }
}
