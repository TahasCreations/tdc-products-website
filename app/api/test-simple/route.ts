import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Simple test endpoint working',
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({ 
      message: 'POST test endpoint working',
      received: body,
      timestamp: new Date().toISOString(),
      status: 'OK'
    });
  } catch (error) {
    return NextResponse.json({ 
      message: 'POST test endpoint error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      status: 'ERROR'
    }, { status: 500 });
  }
}
