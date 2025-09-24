import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // SendGrid API status check
    const response = await fetch('https://api.sendgrid.com/v3/user/account', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY || 'demo-key'}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return NextResponse.json({
        status: 'active',
        service: 'SendGrid',
        message: 'SendGrid API is working',
        data: {
          emailsSent: 2100,
          deliveryRate: 98.5,
          bounceRate: 1.2,
          spamRate: 0.3
        }
      });
    } else {
      return NextResponse.json({
        status: 'inactive',
        service: 'SendGrid',
        message: 'SendGrid API connection failed',
        error: 'Invalid API key or service unavailable'
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      service: 'SendGrid',
      message: 'SendGrid service error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'send_email':
        // Mock email sending
        return NextResponse.json({
          success: true,
          message: 'Email sent successfully',
          messageId: `sg_${Date.now()}`,
          data: {
            to: data.to,
            subject: data.subject,
            status: 'sent',
            sentAt: new Date().toISOString()
          }
        });

      case 'create_template':
        // Mock template creation
        return NextResponse.json({
          success: true,
          message: 'Template created successfully',
          templateId: `tpl_${Date.now()}`,
          data: {
            name: data.name,
            content: data.content,
            status: 'active'
          }
        });

      case 'get_stats':
        // Mock statistics
        return NextResponse.json({
          success: true,
          data: {
            totalSent: 2100,
            delivered: 2068,
            bounced: 25,
            blocked: 7,
            openRate: 18.3,
            clickRate: 4.7
          }
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'SendGrid API error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
